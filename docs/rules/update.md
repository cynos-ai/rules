# Installing, Checking, and Updating Cynos Rules

Use this workflow when the user requests installation, a version check, an update, or migration of Cynos Rules. Recognize requests such as "update rules," "upgrade Cynos rules," or "help me update cybos rules" from context rather than requiring a fixed phrase; ask first if the reference is unclear. Without such a request, do not proactively check online. Install only Markdown; do not introduce an npm package, CLI, SDK, Adapter, Skill, or automatic execution mechanism.

## Confirm the Request and Formal Release

- **Version checks are read-only:** read the local `docs/rules/VERSION`, active rule entry, and markers, query the official release, and report differences. Do not install, repair, or update PROJECT or any project file. If a newer version exists, suggest asking "Update Cynos Rules for me"; a check is not authorization to update.
- **Installation, updates, and migration** follow the execution steps below. First follow the target project's existing rules and Git conventions; authorization to update is not authorization to commit, merge, release, or reorganize old documents.
- The only upstream is `https://github.com/cynos-ai/rules`. Query the latest formal Release through `https://github.com/cynos-ai/rules/releases/latest` or the GitHub API `https://api.github.com/repos/cynos-ai/rules/releases/latest`, confirm it is neither a draft nor a prerelease, and obtain its `tag_name`. Do not guess versions by sorting tag strings, or use develop, short-lived branches, or main content without a formal release.
- Confirm that the tag's SemVer, its `docs/rules/VERSION`, and its managed-block version agree. Pin that target tag for this operation and read all subsequent target content from it, avoiding a mix of versions mid-operation. Compare versions using SemVer, not string ordering.
- Check mode does not execute the write steps in the next section; use their version and marker identification rules only to determine local state. When VERSION is missing, distinguish v0 from unversioned content. Report invalid versions, damaged markers, or version conflicts as anomalies without repairing them. Do not downgrade a newer local version; equal versions mean only that there is no version upgrade to perform, not that files are unmodified.
- In update mode, first read this workflow and CHANGELOG at the target tag, then follow them together with local project conventions. If an old tag lacks this workflow, use that tag's README installation/update steps. First installation or a missing local guide is also bootstrapped through the official latest formal tag's README, without depending on this file already being present locally. If the Release, tag, or necessary baseline cannot be obtained, stop and explain that the check or update is unavailable. Do not report network failure as "already up to date" or bypass network or tool permissions.

## Execute Installation or Update

First record the original version and local changes, and prepare a backup or patch covering only this operation's changes; do not restore an update by resetting the entire workspace. Execute these steps only with user authorization to install or update. Do not create empty directories or placeholder files, delete extra rules in the target project, or change the three files of a completed change.

Apply the same conflict test to both the entry and rule files: a text merge reporting overlapping lines is not, by itself, a substantive conflict. Compare the old upstream, new upstream, and local meanings. If translation or moved text causes overlap but the requirements remain compatible, reconstruct the merge in a temporary location, keep local additions verbatim and in place, and continue without asking merely because the text merge failed. If requirements contradict each other or compatibility cannot be established, show the difference, recommend a resolution, and wait for the user before writing any project file. Keeping local text or invoking local precedence does not resolve that conflict or authorize a version-only update or a completion claim.

1. Read the current project's existing rules, README, documentation, code structure, tests, and Git branches before writing any files.
2. Read the root AGENTS.md, docs/rules/**, and CHANGELOG.md from the pinned formal tag, along with old-version tags needed for merging. Only the complete block from `cynos-rules:begin` to `cynos-rules:end` in AGENTS.md is installable; do not copy the Rules repository instructions outside it. Do not use unreleased develop or short-lived branches.
3. Identify the currently installed version:
   - If docs/rules/VERSION exists, read its SemVer;
   - If VERSION is absent but old java-taro-rules-style AGENTS.md, behavior.md, architecture.md, conventions.md, frontend.md, backend.md, or similar rules exist, treat them as the v0 migration baseline;
   - If VERSION is absent and the source is unrecognizable, mark the content "unversioned" and inventory it before merging; do not assume it can be overwritten.
4. If the installed local version is newer than the latest formal release, do not downgrade automatically; explain and stop. If versions match, check only missing content or explicitly requested repairs, without overwriting local edits.
5. Identify the project rule entry actually used by the current platform:
   - Read existing AGENTS.md, CLAUDE.md, other platform rule files, and their reference relationships first;
   - Prefer the root AGENTS.md if supported; otherwise choose the platform's native entry and have the managed block reference docs/rules/**;
   - If multiple entries coexist, modify only one confirmed active entry; reuse existing reference chains rather than embedding duplicates;
   - If the active entry cannot be confirmed, explain the assessment and recommendation, and ask the user.
6. Prepare the merged platform rule entry in a temporary location without writing it to the project yet:
   - If the entry does not exist, create the platform-native file with the complete latest managed block;
   - If an entry exists without Cynos markers or a confirmable old Cynos version, preserve its original text and insert the complete latest block unchanged at a location that does not break Markdown structure. Even if content is duplicated, do not trim the block or the user's original text; only report duplicates or conflicts;
   - If an unmarked entry has VERSION pointing to an old Cynos version such as 1.0/1.1, read that tag's AGENTS.md. Replace only an exact match to the complete old AGENTS, or contiguous old Cynos sections with headings, full bodies, and clear boundaries. Single lines and scattered statements do not prove ownership. If boundaries cannot be safely established, do not delete the original text; present a migration plan and ask the user first;
   - If the entry has one complete managed block, read its version. Replace it as a whole only if it has no local edits; otherwise merge by comparing the old tag, new tag, and local content. Treat project rules already inside the block as local edits and leave them in place rather than automatically moving them outside;
   - Stop if begin/end is missing either side, nested, duplicated, has an invalid version, or disagrees with VERSION; do not guess a repair;
   - Never move, reorder, rewrite, or reformat content outside the managed block. List substantive conflicts individually and ask the user.
7. Merge docs/rules/** in a temporary location:
   - When upgrading from v0, preserve Java, Taro, frontend, backend, deployment, command, and other project-specific rules;
   - When updating from a formal version, first compare the complete old/new tag rule-file sets and inventory upstream additions, modifications, deletions, and renames, then merge each with local content. Do not select the update scope solely from the Changelog, old-upstream-versus-local differences, or a set of file checksums;
   - Preserve local additions and edits. Confirm first when upstream deletions or renames involve local content; do not delete unknown or local content merely because it no longer exists upstream;
   - Preserve extra rule files already in the target project; do not overwrite the whole directory or delete unknown files;
   - communication.md applies by default to natural-language user communication, without changing code, documents, commits, PRs, issues, reports, or user-specified formats.
8. Write and verify in the following order; do not copy the new-version entry, VERSION, and rule files into the project together:
   - First check the temporary merge against the complete upstream difference inventory. Confirm that every difference has an outcome, without omissions or unresolved conflicts. Except for versions, managed content without local edits should match the target tag; where local edits exist, verify that upstream changes were handled, local content was preserved, and user decisions were applied, rather than requiring whole-file equality with upstream;
   - Then write the rule bodies without writing docs/rules/VERSION yet. For an existing valid managed block, write the merged entry body while retaining the original block version. For first installation or without a valid old block, leave the original entry unchanged for now; do not create a temporary version marker;
   - Reread the written content from actual project paths and check it against the complete inventory, not just temporary copies or self-selected modified files. Until these checks pass, both the block version and VERSION must retain their original values or remain absent if originally absent. Without an old block, also confirm that the original entry is unchanged and the pending temporary entry has passed ownership and content checks;
   - Only after these on-disk checks pass, perform a separate version-write step: update the existing block's version, or write the verified first-installation/migration entry, then write VERSION. Do not include unverified rule changes in this step. Finally reread the entry, version, and rules, and report completion only after confirming consistency;
   - If any check fails, stop before the next step. Failure before version writing must not advance versions. Failure during version writing must restore only this step's version/entry writes to their pre-step state, preserving pre-existing local edits. Explain the actual state and do not report completion.
9. Generate or update docs/PROJECT.md from the current project's code and documentation. Do not copy the Cynos Rules repository's own docs/PROJECT.md.
10. Check whether the project has already defined release and development branches, short-lived branches, and commit rules:
    - Without existing conventions, recommend main as the release branch and develop as the development branch;
    - Use feat/*, fix/*, docs/*, refactor/*, test/*, and chore/* for short-lived branches;
    - Use corresponding feat:, fix:, docs:, refactor:, test:, and chore: commit types;
    - Preserve existing alternative branch names and only record their role mapping; do not rename automatically.
11. If the project has no recorded PR convention, ask just one question:
    "Are Pull Requests required when merging short-lived branches into the development branch and when merging the development branch into the release branch?"
    Offer three choices: PRs for all merges, PRs only for releases, or no PRs. Record the user's choice outside the target project's managed block or in docs/PROJECT.md; do not decide for the user.
12. After installing or updating the rules, separately ask whether to reorganize old documents according to docs/rules/project-layout.md. Without consent, do not move, merge, archive, or delete any old files.
13. If the user agrees to reorganize, first present a file-by-file plan, marking each file as move, merge, archive, keep, or uncertain, with its destination and reason. Wait for confirmation again before acting.
14. When reorganizing:
    - Use git mv or an equivalent approach to preserve history;
    - Move/merge only content clearly belonging in docs/PROJECT.md, docs/changes/<change-id>/**, or LuoWang directories;
    - Keep still-valid API, architecture, deployment, operations, and other documents outside the minimal structure in their current locations;
    - Only obsolete, superseded, or explicitly user-designated historical content goes into docs/archive/;
    - Ask when uncertain; do not delete content or replace existing facts with a template.
15. After making changes, run the applicable project checks and report:
    - The original version, target version, and version finally written;
    - Which platform rule entry was used and whether its original outside-block content is unchanged;
    - Which general and project-specific rules were added, replaced, three-way merged, or retained;
    - How docs/PROJECT.md was generated or updated;
    - Git/PR conventions;
    - Old documents moved, archived, kept, or left unhandled;
    - Verification performed, not performed, failed, or unavailable.

Prepare the merge in a temporary location and inspect differences before writing to the project; a conflict-free text merge does not prove the absence of semantic conflicts in project rules. Update this guide through the same three-way merge, rather than treating local revisions as an install script that may be overwritten. After interruption, report the files and versions actually written. Recovery must cover only this operation's changes and preserve pre-existing uncommitted content; versions must not get ahead of the rule merge actually completed.
