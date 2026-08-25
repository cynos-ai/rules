import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test, { type TestContext } from "node:test";
import {
  createAgentSession,
  DefaultResourceLoader,
  ModelRuntime,
  SessionManager,
  SettingsManager,
  type InlineExtension,
} from "@earendil-works/pi-coding-agent";
import { createPiRulesExtension, createPiRulesResourceLoader } from "../src/pi/internal.js";
import { createRulesFixture } from "./helpers/fixture.js";
import { extractSystemText, startFakeOpenAIServer } from "./helpers/fake-openai.js";

async function runProcess(
  executable: string,
  args: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv; timeoutMs: number },
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(executable, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    const timeout = setTimeout(() => child.kill("SIGTERM"), options.timeoutMs);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("close", (code, signal) => {
      clearTimeout(timeout);
      const output = {
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      };
      if (code === 0) resolvePromise(output);
      else reject(new Error(`Process exited code=${code} signal=${signal}: ${output.stderr}`));
    });
  });
}

function cleanup(t: TestContext, ...roots: string[]): void {
  t.after(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })));
}

function writeModelsJson(agentDir: string, baseUrl: string): string {
  const path = resolve(agentDir, "models.json");
  writeFileSync(path, `${JSON.stringify({
    providers: {
      "cynos-test": {
        baseUrl,
        apiKey: "test-key",
        api: "openai-completions",
        models: [{
          id: "fake-model",
          name: "Fake Model",
          reasoning: false,
          input: ["text"],
          cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
          contextWindow: 8192,
          maxTokens: 128,
        }],
      },
    },
  }, null, 2)}\n`);
  return path;
}

test("pinned Pi applies the rules extension as the only SDK injection path", async (t) => {
  const fixture = createRulesFixture();
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-e2e-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-e2e-agent-"));
  cleanup(t, fixture.root, cwd, agentDir);
  const server = await startFakeOpenAIServer();
  t.after(() => server.close());
  const modelsPath = writeModelsJson(agentDir, server.baseUrl);
  const modelRuntime = await ModelRuntime.create({
    authPath: resolve(agentDir, "auth.json"),
    modelsPath,
  });
  const model = modelRuntime.getModel("cynos-test", "fake-model");
  assert.ok(model);
  const extension: InlineExtension = {
    name: "cynos-rules-e2e",
    factory: createPiRulesExtension(fixture.ruleset),
  };
  const settingsManager = SettingsManager.inMemory({ retry: { enabled: false } });
  const loader = new DefaultResourceLoader({
    cwd,
    agentDir,
    settingsManager,
    extensionFactories: [extension],
    noExtensions: true,
    noSkills: true,
    noPromptTemplates: true,
    noThemes: true,
    noContextFiles: true,
  });
  await loader.reload();
  assert.deepEqual(loader.getAppendSystemPrompt(), []);
  const { session } = await createAgentSession({
    cwd,
    agentDir,
    model,
    modelRuntime,
    noTools: "all",
    resourceLoader: loader,
    sessionManager: SessionManager.inMemory(cwd),
    settingsManager,
  });
  t.after(() => session.dispose());
  await session.prompt("Reply with OK.");
  assert.equal(server.requests.length, 1);
  const system = extractSystemText(server.requests[0]!);
  assert.equal(system.split(fixture.ruleset.marker).length - 1, 1);
  assert.ok(system.includes(fixture.ruleset.injectedBlock));
});

test("pinned Pi sends one block through the combined SDK loader path", async (t) => {
  const fixture = createRulesFixture();
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-sdk-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-sdk-agent-"));
  cleanup(t, fixture.root, cwd, agentDir);
  const server = await startFakeOpenAIServer();
  t.after(() => server.close());
  const modelsPath = writeModelsJson(agentDir, server.baseUrl);
  const modelRuntime = await ModelRuntime.create({
    authPath: resolve(agentDir, "auth.json"),
    modelsPath,
  });
  const model = modelRuntime.getModel("cynos-test", "fake-model");
  assert.ok(model);
  const settingsManager = SettingsManager.inMemory({ retry: { enabled: false } });
  const loader = createPiRulesResourceLoader(
    {
      cwd,
      agentDir,
      settingsManager,
      noExtensions: true,
      noSkills: true,
      noPromptTemplates: true,
      noThemes: true,
      noContextFiles: true,
    },
    fixture.ruleset,
  );
  await loader.reload();
  const { session } = await createAgentSession({
    cwd,
    agentDir,
    model,
    modelRuntime,
    noTools: "all",
    resourceLoader: loader,
    sessionManager: SessionManager.inMemory(cwd),
    settingsManager,
  });
  t.after(() => session.dispose());
  await session.prompt("Reply with OK.");
  assert.equal(server.requests.length, 1);
  const system = extractSystemText(server.requests[0]!);
  assert.equal(system.split(fixture.ruleset.marker).length - 1, 1);
  assert.ok(system.includes(fixture.ruleset.injectedBlock));
});

test("pinned Pi loads an explicit CLI extension when discovery is disabled", async (t) => {
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-cli-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-cli-agent-"));
  cleanup(t, cwd, agentDir);
  const portFile = resolve(agentDir, "fake-server.port");
  const requestFile = resolve(agentDir, "fake-server-request.json");
  const serverProcess = spawn(
    process.execPath,
    [resolve(import.meta.dirname, "fixtures/fake-openai-server.mjs"), portFile, requestFile],
    { stdio: "ignore" },
  );
  t.after(() => {
    if (!serverProcess.killed) serverProcess.kill("SIGTERM");
  });
  for (let attempt = 0; attempt < 100 && !existsSync(portFile); attempt += 1) {
    await new Promise((resolveWait) => setTimeout(resolveWait, 20));
  }
  if (!existsSync(portFile)) throw new Error("Fake OpenAI server did not start");
  const port = readFileSync(portFile, "utf8").trim();
  writeModelsJson(agentDir, `http://127.0.0.1:${port}/v1`);
  const extensionPath = resolve(agentDir, "explicit-extension.mjs");
  const marker = "CYNOS_RULES_EXPLICIT_EXTENSION_E2E";
  writeFileSync(
    extensionPath,
    `export default function (pi) {\n  pi.on("before_agent_start", (event) => ({ systemPrompt: event.systemPrompt + "\\n\\n${marker}" }));\n}\n`,
  );
  const piPath = resolve(import.meta.dirname, "../node_modules/.bin/pi");
  const childEnv = { ...process.env };
  for (const key of Object.keys(childEnv)) {
    if (key.startsWith("NODE_") || key.startsWith("TSX_")) delete childEnv[key];
  }
  let result: { stdout: string; stderr: string };
  try {
    result = await runProcess(
      piPath,
      [
        "--print",
        "--no-session",
        "--no-tools",
        "--no-approve",
        "--no-extensions",
        "--no-skills",
        "--no-prompt-templates",
        "--no-context-files",
        "--extension",
        extensionPath,
        "--provider",
        "cynos-test",
        "--model",
        "fake-model",
        "Reply with OK.",
      ],
      {
        cwd,
        env: {
          ...childEnv,
          PI_CODING_AGENT_DIR: agentDir,
          PI_OFFLINE: "1",
        },
        timeoutMs: 10_000,
      },
    );
  } catch (error) {
    throw new Error(
      `Pi CLI failed; requestCaptured=${existsSync(requestFile)}: ${String(error)}`,
    );
  }
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /OK/);
  assert.ok(existsSync(requestFile));
  const request = {
    path: "/v1/chat/completions",
    body: JSON.parse(readFileSync(requestFile, "utf8")) as Record<string, unknown>,
  };
  assert.ok(extractSystemText(request).includes(marker));
});
