# Working in the HeartStamp Design System

Instructions for every contributor, human or code agent (Claude Code, Codex,
Cursor, Copilot and others).

## Rule: every change updates the changelog

Every push to this repo, and every pull request, must add an entry to the
design system changelog page:

    src/app/pages/page-changelog.tsx

This is enforced, not optional:

- The **Changelog updated** check in CI fails on any push or pull request
  without a new entry.
- `publish.yml` and `deploy.yml` run the same check first, so a push without
  an entry is never released to npm or deployed to the website.
- A pre-push hook (installed by `npm install`) runs it on your machine before
  the push leaves it. Run it yourself any time with `npm run check:changelog`.

The rule lives in `scripts/check-changelog.mjs`.

## How to add the entry

1. Read `version` in `package.json`. Your entry's version is that plus one
   patch: `2.1.73` becomes `2.1.74`. CI bumps the patch on every push to
   `main`, so that is the version your push will be released as.
2. Add a new object at the **top** of the `RELEASES` array. Do not renumber
   or edit older entries.
3. Commit it in the same push as the change it describes.

```ts
{
  version: "2.1.74", date: "21 Nov 2026",
  title: "Short summary of what changed",
  tags: ["feature"],          // feature, fix, tokens, design, docs, perf, major
  items: [
    "One sentence per change, saying what changed and why it matters.",
    "Name the component, prop or token, for example Btn size=\"xxl\".",
  ],
},
```

If `main` moved on while you worked (someone else released), pull, then
renumber **your** entry to the new `package.json` version plus one.

If you push to the same branch again before it is released (for example
several pushes to `development`), add items to your existing unreleased
entry instead of making a second one.

## Writing style for entries

- Simple, basic English. Short sentences.
- No em dashes or en dashes. Use a comma, a full stop, or "to" for ranges.
- Say what a user of the design system will notice, then any detail.

## Before you push

```bash
npm run typecheck
npm run test
npm run check:changelog
```
