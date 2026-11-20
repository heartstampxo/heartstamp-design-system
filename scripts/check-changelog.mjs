#!/usr/bin/env node
/**
 * Changelog gate.
 *
 * Every change pushed to this repo must add an entry to the design system
 * changelog page (src/app/pages/page-changelog.tsx), whoever made it: a
 * developer by hand, a code agent, or a pull request. This script is the one
 * place that rule lives. It runs in three places:
 *
 *   - CI (ci.yml), on every pull request and push, so a missing entry shows
 *     up as a failed check;
 *   - publish.yml and deploy.yml, before anything ships, so a push without an
 *     entry is never released to npm or the website;
 *   - the local pre-push hook (.githooks/pre-push), so you find out before
 *     the push leaves your machine.
 *
 * The rule, for the commits in BASE..HEAD:
 *   1. If every commit is a release bump from CI ("chore: release x.y.z"),
 *      there is nothing to check.
 *   2. Otherwise page-changelog.tsx must be changed in that range, and
 *   3. the newest entry (the first one in RELEASES) must be the version CI
 *      will cut for this push: package.json's version plus one patch, and
 *      must have at least one item.
 *
 * Usage:
 *   node scripts/check-changelog.mjs [base-ref]
 *   CHANGELOG_BASE=<sha> node scripts/check-changelog.mjs
 * With no base it compares against origin/main.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CHANGELOG = "src/app/pages/page-changelog.tsx";
const RELEASE_SUBJECT = /^chore: release \d+\.\d+\.\d+/;

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const fail = (lines) => {
  console.error(["", "✖ Changelog check failed", "", ...lines, ""].join("\n"));
  process.exit(1);
};

let base = process.argv[2] || process.env.CHANGELOG_BASE || "origin/main";
// A push that creates a branch reports an all-zero "before" sha
if (/^0+$/.test(base)) base = "HEAD~1";

try {
  git("rev-parse", "--verify", `${base}^{commit}`);
} catch {
  fail([`Cannot find the base commit "${base}".`, "Fetch it first (git fetch origin) or pass a base ref."]);
}

const commits = git("log", "--format=%H%x09%s", `${base}..HEAD`)
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [sha, ...subject] = line.split("\t");
    return { sha, subject: subject.join("\t") };
  });

if (commits.length === 0) {
  console.log("✓ Changelog check: no new commits.");
  process.exit(0);
}

const work = commits.filter((c) => !RELEASE_SUBJECT.test(c.subject));
if (work.length === 0) {
  console.log("✓ Changelog check: release commits only.");
  process.exit(0);
}

const changed = git("diff", "--name-only", `${base}...HEAD`).split("\n").filter(Boolean);
const list = work.map((c) => `    ${c.sha.slice(0, 7)} ${c.subject}`);

if (!changed.includes(CHANGELOG)) {
  fail([
    `These commits change the design system but do not update ${CHANGELOG}:`,
    ...list,
    "",
    "Add a new entry at the top of RELEASES describing what changed, in simple",
    "English, then commit it with your change. See AGENTS.md for the format.",
  ]);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const [major, minor, patch] = pkg.version.split(".").map(Number);
const expected = `${major}.${minor}.${patch + 1}`;

const source = readFileSync(CHANGELOG, "utf8");
const releases = source.slice(source.indexOf("const RELEASES"));
const top = releases.match(/version:\s*"([^"]+)"/);
if (!top) fail([`Could not find any entry in RELEASES in ${CHANGELOG}.`]);

// Only the newest entry: from its version up to the next entry's version
const rest = releases.slice(top.index + top[0].length);
const next = rest.search(/version:\s*"/);
const items = (next === -1 ? rest : rest.slice(0, next)).match(/items:\s*\[\s*["'`]/);

if (top[1] !== expected) {
  fail([
    `The newest changelog entry is ${top[1]}, but this push will be released as ${expected}`,
    `(package.json is ${pkg.version}, and CI adds one patch on every push to main).`,
    "",
    `Add a new entry with version: "${expected}" at the top of RELEASES.`,
    "If main moved on since you started, pull, then renumber your entry.",
  ]);
}

if (!items) fail([`The ${expected} entry has no items. Say what changed.`]);

// Renumbering the old top entry is not a new entry. Unless the base already
// had this unreleased entry (a second push to a branch adds to it), the
// base's newest entry must still be in the file, below the new one.
const topAt = (text) => {
  const r = text.slice(text.indexOf("const RELEASES")).match(/version:\s*"([^"]+)"/);
  return r && r[1];
};
let baseTop = null;
try {
  baseTop = topAt(git("show", `${base}:${CHANGELOG}`));
} catch {
  /* the file is new in this range */
}
if (baseTop && baseTop !== expected && !new RegExp(`version:\\s*"${baseTop.replace(/\./g, "\\.")}"`).test(releases.slice(top.index + top[0].length))) {
  fail([
    `The ${baseTop} entry is gone. It looks like it was renumbered to ${expected}.`,
    `Keep ${baseTop} as it was and add a new ${expected} entry above it.`,
  ]);
}

console.log(`✓ Changelog check: ${expected} entry found for ${work.length} commit(s).`);
