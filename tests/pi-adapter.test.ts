import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test, { type TestContext } from "node:test";
import {
  createAgentSession,
  SessionManager,
  SettingsManager,
  type ExtensionAPI,
} from "@earendil-works/pi-coding-agent";
import { RulesConflictError } from "../src/contract/errors.js";
import { createPiRulesExtension, createPiRulesResourceLoader } from "../src/pi/internal.js";
import { createRulesFixture } from "./helpers/fixture.js";

function cleanup(t: TestContext, ...roots: string[]): void {
  t.after(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })));
}

test("Pi CLI extension registers only a before_agent_start handler", async (t) => {
  const fixture = createRulesFixture();
  cleanup(t, fixture.root);
  let handler: ((event: { systemPrompt: string }) => unknown) | undefined;
  const calls: string[] = [];
  const pi = {
    on(event: string, candidate: (event: { systemPrompt: string }) => unknown) {
      calls.push(event);
      handler = candidate;
    },
  } as unknown as ExtensionAPI;

  createPiRulesExtension(fixture.ruleset)(pi);
  assert.deepEqual(calls, ["before_agent_start"]);
  assert.ok(handler);
  const first = await handler({ systemPrompt: "Base prompt." }) as { systemPrompt: string };
  assert.equal(first.systemPrompt, `Base prompt.\n\n${fixture.ruleset.injectedBlock}`);
  const second = await handler({ systemPrompt: first.systemPrompt });
  assert.equal(second, undefined);
});

test("Pi SDK loader injects one block and disables implicit benchmark resources", async (t) => {
  const fixture = createRulesFixture();
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-agent-"));
  cleanup(t, fixture.root, cwd, agentDir);
  const settingsManager = SettingsManager.inMemory({});
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

  assert.deepEqual(loader.getAppendSystemPrompt(), [fixture.ruleset.injectedBlock]);
  assert.equal(loader.getSkills().skills.length, 0);
  assert.equal(loader.getAgentsFiles().agentsFiles.length, 0);
  assert.equal(loader.getExtensions().extensions.length, 1);

  const { session } = await createAgentSession({
    cwd,
    agentDir,
    resourceLoader: loader,
    settingsManager,
    sessionManager: SessionManager.inMemory(cwd),
  });
  t.after(() => session.dispose());
  assert.equal(session.agent.state.systemPrompt.split(fixture.ruleset.marker).length - 1, 1);
});

test("Pi SDK loader detects an existing exact custom system block before append injection", async (t) => {
  const fixture = createRulesFixture();
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-agent-"));
  cleanup(t, fixture.root, cwd, agentDir);
  const loader = createPiRulesResourceLoader(
    {
      cwd,
      agentDir,
      settingsManager: SettingsManager.inMemory({}),
      noExtensions: true,
      noSkills: true,
      noPromptTemplates: true,
      noThemes: true,
      noContextFiles: true,
      systemPromptOverride: () => fixture.ruleset.injectedBlock,
    },
    fixture.ruleset,
  );
  await loader.reload();
  assert.deepEqual(loader.getAppendSystemPrompt(), []);
  assert.equal(loader.getSystemPrompt(), fixture.ruleset.injectedBlock);
});

test("Pi SDK loader detects an existing exact context block before append injection", async (t) => {
  const fixture = createRulesFixture();
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-agent-"));
  cleanup(t, fixture.root, cwd, agentDir);
  const loader = createPiRulesResourceLoader(
    {
      cwd,
      agentDir,
      settingsManager: SettingsManager.inMemory({}),
      noExtensions: true,
      noSkills: true,
      noPromptTemplates: true,
      noThemes: true,
      noContextFiles: true,
      agentsFilesOverride: () => ({
        agentsFiles: [{ path: "/virtual/context.md", content: fixture.ruleset.injectedBlock }],
      }),
    },
    fixture.ruleset,
  );
  await loader.reload();
  assert.deepEqual(loader.getAppendSystemPrompt(), []);
  assert.equal(loader.getAgentsFiles().agentsFiles.length, 1);
});

test("Pi SDK loader propagates conflicting context identity during reload", async (t) => {
  const expected = createRulesFixture();
  const conflicting = createRulesFixture([
    { id: "CR-OTHER-001", fileName: "CR-OTHER-001.md", content: "Other rule.\n" },
  ]);
  const cwd = mkdtempSync(resolve(tmpdir(), "cynos-rules-cwd-"));
  const agentDir = mkdtempSync(resolve(tmpdir(), "cynos-rules-agent-"));
  cleanup(t, expected.root, conflicting.root, cwd, agentDir);
  const loader = createPiRulesResourceLoader(
    {
      cwd,
      agentDir,
      settingsManager: SettingsManager.inMemory({}),
      noExtensions: true,
      noSkills: true,
      noPromptTemplates: true,
      noThemes: true,
      noContextFiles: true,
      agentsFilesOverride: () => ({
        agentsFiles: [{ path: "/virtual/context.md", content: conflicting.ruleset.injectedBlock }],
      }),
    },
    expected.ruleset,
  );
  await assert.rejects(loader.reload(), RulesConflictError);
});
