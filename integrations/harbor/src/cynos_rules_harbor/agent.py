import shlex
from pathlib import PurePosixPath
from typing import override

from harbor.agents.installed.base import with_prompt_template
from harbor.agents.installed.pi import Pi
from harbor.environments.base import BaseEnvironment
from harbor.models.agent.context import AgentContext

_PI_CONFIG_DIR_ENV = "PI_CODING_AGENT_DIR"
_REMOTE_PI_CONFIG_DIR = PurePosixPath("/tmp/harbor-pi-agent")
_DEFAULT_RULES_ROOT = PurePosixPath("/opt/cynos-rules")


class CynosRulesPi(Pi):
    """Pinned, isolated Pi profile with an optional Cynos Rules extension."""

    def __init__(
        self,
        *args,
        rules_enabled: bool = True,
        rules_root: str = _DEFAULT_RULES_ROOT.as_posix(),
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        if not isinstance(rules_enabled, bool):
            raise TypeError("rules_enabled must be a boolean")
        root = PurePosixPath(rules_root)
        if not root.is_absolute():
            raise ValueError("rules_root must be an absolute container path")
        self._rules_enabled = rules_enabled
        self._rules_root = root

    @staticmethod
    @override
    def name() -> str:
        return "cynos-rules-pi"

    async def _prepare_isolated_config(self, environment: BaseEnvironment) -> None:
        config_dir = shlex.quote(_REMOTE_PI_CONFIG_DIR.as_posix())
        await self.exec_as_agent(
            environment,
            command=f"mkdir -p {config_dir} && chmod 700 {config_dir}",
        )

    async def _record_rules_identity(self, environment: BaseEnvironment) -> None:
        manifest = self._rules_root / "rules" / "manifest.json"
        destination = "/logs/agent/cynos-rules-profile.json"
        script = (
            "const fs=require('node:fs');"
            "const [manifestPath,enabled,destination]=process.argv.slice(1);"
            "const manifest=fs.existsSync(manifestPath)"
            "?JSON.parse(fs.readFileSync(manifestPath,'utf8')):null;"
            "fs.writeFileSync(destination,JSON.stringify({"
            "rulesEnabled:enabled==='true',manifest},null,2)+'\\n');"
        )
        await self.exec_as_agent(
            environment,
            command=(
                "set -euo pipefail; . ~/.nvm/nvm.sh; "
                f"node -e {shlex.quote(script)} "
                f"{shlex.quote(manifest.as_posix())} "
                f"{shlex.quote(str(self._rules_enabled).lower())} "
                f"{shlex.quote(destination)}"
            ),
        )

    @override
    @with_prompt_template
    async def run(
        self,
        instruction: str,
        environment: BaseEnvironment,
        context: AgentContext,
    ) -> None:
        if not self.model_name or "/" not in self.model_name:
            raise ValueError("Model name must be in the format provider/model_name")

        provider, model_id = self.model_name.split("/", 1)
        access = self.model_connection
        provider = access.provider or provider
        env = dict(access.env)
        if provider == "anthropic" and (
            oauth_token := self._get_env("ANTHROPIC_OAUTH_TOKEN")
        ):
            env["ANTHROPIC_OAUTH_TOKEN"] = oauth_token

        await self._prepare_isolated_config(environment)
        models_json = self._build_custom_models_json(access, model_id)
        if models_json is not None:
            await self._write_custom_models_json(environment, models_json)
            provider = "harbor-endpoint"

        await self._record_rules_identity(environment)
        extension = self._rules_root / "dist" / "pi" / "cli.js"
        extension_arg = (
            f"--extension {shlex.quote(extension.as_posix())} "
            if self._rules_enabled
            else ""
        )
        model_args = f"--provider {shlex.quote(provider)} --model {shlex.quote(model_id)} "
        cli_flags = self.build_cli_flags()
        if cli_flags:
            cli_flags += " "
        resume_flag = "--continue " if self._resume else ""
        escaped_instruction = shlex.quote(instruction)
        config_prefix = (
            f"{_PI_CONFIG_DIR_ENV}={shlex.quote(_REMOTE_PI_CONFIG_DIR.as_posix())} "
        )

        raw_log = "/logs/agent/pi/raw.jsonl"
        stderr_log = "/logs/agent/pi/stderr.log"
        output_log = f"/logs/agent/{self._OUTPUT_FILENAME}"
        await self.exec_as_agent(
            environment,
            command=(
                "set -euo pipefail; . ~/.nvm/nvm.sh; "
                "mkdir -p /logs/agent/pi; "
                "set +e; "
                f"{config_prefix}pi --print --mode json "
                "--no-approve --no-extensions --no-skills "
                "--no-prompt-templates --no-context-files "
                "--session-dir /logs/agent/pi/sessions "
                f"{resume_flag}"
                f"{model_args}"
                f"{cli_flags}"
                f"{extension_arg}"
                f"{escaped_instruction} "
                f"> {shlex.quote(raw_log)} 2> {shlex.quote(stderr_log)} </dev/null; "
                "pi_status=$?; set -e; "
                f"awk '!/\"type\":\"message_update\"/' {shlex.quote(raw_log)} "
                f"| stdbuf -oL tee {shlex.quote(output_log)}; "
                "exit \"$pi_status\""
            ),
            env=env,
        )
