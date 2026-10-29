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
- `supabase_setup.sql`, `supabase_usernames.sql`, `ACCOUNTS_SETUP.md`: database tables for cloud progress and for unique usernames, plus the setup steps (Google login too). Run the SQL files in that order (`supabase_setup.sql`, `supabase_usernames.sql`, `supabase_admins.sql`).
- `tools/validate_content.py`: content checker. Run it after every change to tasks or path.

## Login required
- When `config.js` has a Supabase URL and anon key, the page gets the class `gate` (script in `<head>`) and the game cannot be played without logging in: splash, then the login/register screen (`#auth`), then the home screen with the mode cards (`#intro`). Classes `authchecked` and `authed` on `<html>` drive what is visible (see the CSS block "login required").
- With empty keys there is no gate and the game runs as a guest. Use this for quick local tests.
- The gate is only a UI gate: everything runs in the browser, so a technical user can bypass it. Anything that must be protected (paid content, leaderboards) needs server-side checks.
- Usernames: unique, case-insensitive, 3-20 characters of letters, digits and `_`. Uniqueness is enforced in the database (unique index on `lower(username)`), the form only gives early feedback via the `username_available` function. Email sign-ups send the name in the sign-up metadata and a trigger creates the profile. Accounts without a profile (Google, older accounts) get the unskippable `#usernameDlg` after login. The name cannot be changed yet.
- The Google button is hidden in the home-screen app (`html.standalone`); email and password works there.

## Modes
- **Path**: guided lessons (default). Sequential unlock, stars, XP, daily goal.
- **Freeplay** (internal mode id `classic`, function `startCareer`, element `#mCareer`; it used to be called Career): random tasks by difficulty, XP, awards, daily task. Difficulties unlock by solving tasks, databases unlock by XP (`LEVEL_LOCK`, `UNLOCK`). The difficulty **Random** serves any question of any difficulty and is unlocked at exactly the same moment as Senior (`lockFor`, `isLevelUnlocked`). It has no task of the day, and it is also available in Endless.
- **Endless**: timed run, one mistake ends it. Does not change XP. Level and time are chosen in the `#endlessSetup` dialog.
- The home screen (`#intro`) lists the three modes as cards. `launchMode()` starts them.
- **Admin mode** (toggle bottom right) bypasses every lock. Use it to test. With accounts configured it is visible only to emails listed in the `admins` table (`supabase_admins.sql`), checked with the `is_admin()` function after login. Without keys (local development) it is always visible. It is a UI convenience: it only skips client-side locks, so real protection of paid content still needs server-side checks.

## Rules and gotchas
- Answers are compared by **result**, not by query text (`check()`); column names are ignored, numbers are rounded to 2 decimals. Tasks with `ordered: true` need a sort key without ties, or the check is unfair.
- Every solution must run on the browser's SQLite (about 3.39), not only on newer versions.
- The tables panel (`#dataPanel`, and `#schemaMini` on phones via the Tables button) shows the first rows of every table of the current task's database, read live from the sql.js databases. It sits under the chat, or in a third column from 1480 px.
- Gap and bug exercises are checked by **result** too. A gap must accept exactly one combination of its word bank (the validator brute-forces this), a bug starter must really be broken. Exercises are not in `TASKS`, so Freeplay, Endless and the skill map never see them.
- Player levels: total XP needed to reach level n is `25 * n * (n - 1)` (0, 50, 150, 300, 500, 750 ...), see `xpForLevel`, `levelOf`, `levelProgress`. Each level has a title (`TITLES`, level 10 and above is "Chief Data Officer"); `rankOf(points)` returns that title. The database unlocks (`UNLOCK`: HR 50 XP, Library 150 XP) match level 2 and level 3 on purpose, so change both together. Level-up messages come from `levelUpNote()`. The word "difficulty" always means Intern/Analyst/Senior (`LEVEL_NAMES`); "level" always means the player level.
- The logo in the header is the menu button (`#logoBtn` -> `goHome()`, which asks before abandoning a lesson).
- Path XP and Freeplay points are the same currency (`addPoints`), so rank and database thresholds (`UNLOCK`, rank steps) react to lesson XP too. Re-tune them if the path feels too fast.
- Progress is keyed by `tid(task)` = hash of database plus task text. Editing a task's text resets that task for existing players. `id` is the stable name used by `path.js`.
- Progress lives in `localStorage` key `sqlgame` and syncs to Supabase table `progress` by merging (max and union, see `mergeData`). A new stat field must be added in three places: the defaults (two spots), `mergeData`.
- `sw.js`: bump `VERSION` when cached files change and add new files to `SHELL`, otherwise phones keep the old version.
- CSS order matters: later rules override earlier ones. Start-screen (`#intro`) overrides are at the end of the stylesheet on purpose.
- Login with Google is hidden in the home-screen app (iOS keeps its storage separate); email and password works there.

## Phone layout (max-width 700px)
- On phones the page never scrolls. `#app` (wraps header, lesson bar, path map and `main#work`) is `position:fixed` and exactly as tall as the visible area (`--vvh`, `--vvtop` are set from `visualViewport` in `updateVV()`), so it shrinks above the iOS keyboard. Panes inside scroll on their own (path map, result table, tables, boss chat).
- The workspace shows one pane at a time through tabs Query, Result, Tables, Boss (`setTab()`, `main[data-tab]`). Run switches to Result, a new exercise switches to Query, new boss messages put a dot on Boss. Hints and results are also written to `#status` because the chat is on another tab.
- While typing (`body.typing`, set when the editor is focused) the header, lesson bar and tabs are hidden and the quick-symbols bar (`.keys`, inside `main`) sits directly above the keyboard in the normal layout. On touch screens wider than 700px (iPad) the bar is `position:fixed` and positioned from `visualViewport` (`placeKeys()`).
- The login and start screens are compacted so they fit one screen. Dialogs are bottom sheets.
- Everything above is CSS in the last `@media (max-width:700px)` block plus `isPhone()` checks in JS. Desktop layout is unchanged. Not verified on a real iPhone yet, so test there after changes.

## Career (story mode)
- Content lives in `career.js` (loaded before the main script, listed in `sw.js` SHELL): `PROJECTS` (11 chapters), `CONCEPTS` (37 lessons with a live example each), `CAREER_TASKS` (7 extra tasks, ids `cx-..`). Item fields: `t` checklist line, `c` lesson id (shown once, before the first task that needs it), `k` task id (TASKS, EXERCISES or CAREER_TASKS), `d` difficulty 1-5, `b` what the boss says.
- Rules the validator enforces (`python3 tools/validate_career.py`, run it after every change of `career.js`): every task exists, no task is used twice, difficulty never falls inside a project, every lesson is used exactly once, every lesson example and custom task runs and returns rows, a project starts with a lesson. Keep the order of concepts equal to the order in which SQL is taught.
- Progress is in `stats.career = { done: { "<projectId>:<taskId>": 1 }, seen: { "<conceptId>": 1 } }` (merged as a union across devices in `mergeData`). A project is open when the previous one is finished (admin mode opens everything); inside a project the lines are done in order.
- XP: the task's points the first time (x0.7 after a mistake, half with a hint, x0.3 after "Show answer"), nothing for repeats, plus `bonus` when the project is finished. Finished projects give awards (`proj_<id>`). Solving also calls `recordSolve`, so Freeplay unlocks and awards still count.
- Tasks with `names: true` also compare the column names (used for AS lessons): `check(user, expected, ordered, names)`.
- Mode id is `career`; the engine is the block "career mode" in `index.html` (`showBoard`, `showReport`, `showConcept`, `startItem`, `beginItem`, `careerSubmit`). Freeplay's internal id is still `classic` / `startFreeplay`.

## Wide screens
- Desktop layouts are fluid: side gutters are `--gut` (clamp of 2.6vw), content is capped only by `--wrap` (2000px), and columns use `clamp()` widths (see the block "wide screens" at the end of the stylesheet). Do not add fixed `max-width` values to page-level containers.
- Lesson nodes on the path map scale with the map width through container query units (`cqw` on `.nodes`); the zig-zag is a multiplier `--m` per node, not pixels.

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