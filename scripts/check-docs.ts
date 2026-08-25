import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function walkMarkdown(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "zh-CN") return [];
      return walkMarkdown(path);
    }
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
  });
}

const english = [
  ...readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !entry.name.endsWith(".zh-CN.md"))
    .map((entry) => resolve(root, entry.name)),
  ...walkMarkdown(resolve(root, "docs")),
].sort();

const failures: string[] = [];
for (const sourcePath of english) {
  const sourceRelative = relative(root, sourcePath);
  const translationPath = sourceRelative.startsWith("docs/")
    ? resolve(root, "docs/zh-CN", sourceRelative.slice("docs/".length))
    : resolve(root, sourceRelative.replace(/\.md$/, ".zh-CN.md"));
  let translation: string;
  try {
    translation = readFileSync(translationPath, "utf8");
  } catch {
    failures.push(`${sourceRelative}: missing ${relative(root, translationPath)}`);
    continue;
  }
  const source = readFileSync(sourcePath, "utf8");
  const digest = createHash("sha256").update(Buffer.from(source, "utf8")).digest("hex");
  const expectedMarker = `<!-- source-sha256:${digest} -->`;
  if (translation.split("\n", 1)[0] !== expectedMarker) {
    failures.push(`${sourceRelative}: stale or missing translation digest marker`);
  }
  const sourceHeadings = [...source.matchAll(/^(#{1,6}) /gm)].map((match) => match[1]?.length);
  const translatedHeadings = [...translation.matchAll(/^(#{1,6}) /gm)].map((match) => match[1]?.length);
  if (JSON.stringify(sourceHeadings) !== JSON.stringify(translatedHeadings)) {
    failures.push(`${sourceRelative}: heading hierarchy differs from translation`);
  }
  if ((source.match(/```/g)?.length ?? 0) !== (translation.match(/```/g)?.length ?? 0)) {
    failures.push(`${sourceRelative}: code fence count differs from translation`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Documentation translations are synchronized (${english.length} pairs).`);
}
