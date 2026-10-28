# Report Due Yesterday: project guide

A gamified SQL-learning web game. The player is a junior data analyst, the boss sends report requests, and the player writes SQL that runs in the browser (SQLite via sql.js).
Live site (GitHub Pages): https://mikolaj42.github.io/sql-game/ · Repo: `sql-game`.

## About the owner
- Not a programmer. Works on a Mac with VS Code and git, tests on an iPhone.
- Talks in Polish: explain in Polish, keep code, UI text and comments in English.
- Always say which files changed and give the exact git commands (`git add .`, `git commit -m "..."`, `git push`).
- Plans to offer a paid version later. Keep free and premium content separable.

## Stack (no build step)
Plain HTML, CSS and JavaScript. Libraries come from CDNs with pinned versions: sql.js 1.8.0 (SQLite about 3.39), CodeMirror 5.65.16, supabase-js 2.45.4.
Hosting is GitHub Pages: deploying means `git push`, live after 1-2 minutes (hard refresh with Cmd+Shift+R).

## Files
- `index.html`: UI and all game logic (one file, scripts at the bottom). Section comments like `// --- learning path ---` mark the parts.
- `tasks.js`: the three databases (`DB_SCRIPT` shop, `HR_SCRIPT`, `LIB_SCRIPT`), `TASKS`, `TOPICS`, `SCHEMAS`.
- `path.js`: the learning path (`PATH`: units, lessons, intro text, example query, ids of tasks and exercises). Strict JSON-style data so `tools/validate_content.py` can read it.
- `exercises.js`: extra exercise types used only inside lessons: `gap` (fill blanks of a template from a word bank) and `bug` (editor starts with a broken query). Also strict JSON-style data.
- `config.js`: Supabase URL and the public anon key (safe to commit; never commit a `service_role` key).
- `sw.js`, `manifest.webmanifest`, icons, `logo-*.png`: offline mode and home-screen app (PWA).
- `supabase_setup.sql`, `ACCOUNTS_SETUP.md`: database table for cloud progress and the setup steps (Google and Facebook login too).
- `tools/validate_content.py`: content checker. Run it after every change to tasks or path.

## Modes
- **Path**: guided lessons (default). Sequential unlock, stars, XP, daily goal.
- **Career**: random tasks by level, points, ranks, awards, daily task. Levels unlock by solving tasks, databases unlock by points (`LEVEL_LOCK`, `UNLOCK`).
- **Endless**: timed run, one mistake ends it. Does not change Career points.
- **Admin mode** (toggle bottom right) bypasses every lock. Use it to test.

## Rules and gotchas
- Answers are compared by **result**, not by query text (`check()`); column names are ignored, numbers are rounded to 2 decimals. Tasks with `ordered: true` need a sort key without ties, or the check is unfair.
- Every solution must run on the browser's SQLite (about 3.39), not only on newer versions.
- Gap and bug exercises are checked by **result** too. A gap must accept exactly one combination of its word bank (the validator brute-forces this), a bug starter must really be broken. Exercises are not in `TASKS`, so Career, Endless and the skill map never see them.
- Path XP and Career points are the same currency (`addPoints`), so rank and database thresholds (`UNLOCK`, rank steps) react to lesson XP too. Re-tune them if the path feels too fast.
- Progress is keyed by `tid(task)` = hash of database plus task text. Editing a task's text resets that task for existing players. `id` is the stable name used by `path.js`.
- Progress lives in `localStorage` key `sqlgame` and syncs to Supabase table `progress` by merging (max and union, see `mergeData`). A new stat field must be added in three places: the defaults (two spots), `mergeData`.
- `sw.js`: bump `VERSION` when cached files change and add new files to `SHELL`, otherwise phones keep the old version.
- CSS order matters: later rules override earlier ones. Start-screen (`#intro`) overrides are at the end of the stylesheet on purpose.
- Login with Google and Facebook is hidden in the home-screen app (iOS keeps its storage separate); email and password works there.

## Testing
- `python3 tools/validate_content.py` for tasks and lessons.
- No automated UI tests yet. Open with Live Server (port 5500) on the Mac, and the live site on the iPhone.
- Phone layout is under `@media (max-width:700px)` and `(hover:none) and (pointer:coarse)`.

## Roadmap (agreed direction: Duolingo-style)
1. Done: path with lessons, XP, daily goal, awards, accounts, phone layout, PWA.
2. Next: more exercise types (done: gap and bug; to do: multiple choice and ordering blocks), task generators, more databases and units, spaced repetition of mistakes.
3. Then: streak freeze, missions, coins and shop, spaced repetition of mistakes.
4. Later: leagues and friends (needs server-side checks), split `index.html` into modules with a bundler, App Store and Google Play via a wrapper (Sign in with Apple needed), payments for the premium units (`premium: true` in `path.js`, `hasPremium()` in `index.html`).
5. Before a public launch: privacy policy and terms (the site collects emails).
