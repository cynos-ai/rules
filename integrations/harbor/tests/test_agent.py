import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock

from harbor.cli.utils import parse_kwargs

from cynos_rules_harbor import CynosRulesPi


class CynosRulesPiTests(unittest.TestCase):
    def test_identity_and_exact_pi_version(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            agent = CynosRulesPi(
                logs_dir=Path(directory),
                version="0.84.3",
                rules_enabled=False,
            )
            self.assertEqual(agent.name(), "cynos-rules-pi")
            self.assertEqual(agent._version, "0.84.3")
            self.assertFalse(agent._rules_enabled)

    def test_harbor_cli_boolean_kwarg_is_not_a_truthy_string(self) -> None:
        kwargs = parse_kwargs(["rules_enabled=false"])
        self.assertIs(kwargs["rules_enabled"], False)
        with tempfile.TemporaryDirectory() as directory:
            agent = CynosRulesPi(logs_dir=Path(directory), **kwargs)
            self.assertFalse(agent._rules_enabled)

    def test_rejects_non_boolean_arm_and_relative_mount(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            logs = Path(directory)
            with self.assertRaises(TypeError):
                CynosRulesPi(logs_dir=logs, rules_enabled="false")
            with self.assertRaises(ValueError):
                CynosRulesPi(logs_dir=logs, rules_root="relative/path")


class CynosRulesPiAsyncTests(unittest.IsolatedAsyncioTestCase):
    async def test_profile_recording_sources_nvm_and_records_the_arm(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            agent = CynosRulesPi(logs_dir=Path(directory), rules_enabled=False)
            capture = AsyncMock()
            agent.exec_as_agent = capture
            await agent._record_rules_identity(object())
            command = capture.await_args.kwargs["command"]
            self.assertIn(". ~/.nvm/nvm.sh", command)
            self.assertIn("rulesEnabled", command)
            self.assertIn("false", command)
            self.assertIn("cynos-rules-profile.json", command)


if __name__ == "__main__":
    unittest.main()
