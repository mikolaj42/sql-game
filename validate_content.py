#!/usr/bin/env python3
"""Checks the game's content before you deploy it.

Run from the project folder:   python3 tools/validate_content.py

What it checks
- every task has a unique id, a valid level and topic, and a solution that runs on SQLite and returns rows
- no two tasks share the same solution on the same database
- exercises.js: gap exercises have as many blanks as answers and accept exactly one combination of the word bank,
  bug exercises start with a query that is really broken (errors or returns the wrong rows)
- path.js: every lesson item exists, no item is used twice, and every example query runs
Exit code is 1 when something is wrong, so it can also be used in automation.
"""
import itertools, json, re, sqlite3, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
tasks_js = (root / "tasks.js").read_text(encoding="utf-8")
path_js = (root / "path.js").read_text(encoding="utf-8")
ex_js = (root / "exercises.js").read_text(encoding="utf-8")
problems = []

def bad(msg):
    problems.append(msg); print("  PROBLEM:", msg)

# --- databases: the same SQL scripts the game loads in the browser ---
SCRIPTS = {"shop": "DB_SCRIPT", "hr": "HR_SCRIPT", "lib": "LIB_SCRIPT"}
dbs = {}
for name, var in SCRIPTS.items():
    m = re.search(var + r" = `(.*?)`;", tasks_js, re.S)
    if not m:
        bad(f"database script {var} not found in tasks.js"); continue
    con = sqlite3.connect(":memory:"); con.executescript(m.group(1)); dbs[name] = con
print(f"SQLite {sqlite3.sqlite_version} here (the browser uses an older one, about 3.39: avoid brand-new syntax)")

topics = set(re.findall(r"^\s{2}(\w+):\s+\{ label:", tasks_js.split("const TOPICS")[1], re.M))
levels = {"easy", "medium", "hard"}

# --- tasks ---
tasks, seen_ids, seen_sol = [], set(), set()
for block in tasks_js.split("{ id:")[1:]:
    tid = re.match(r' "([^"]+)"', block).group(1)
    head = block.split("text:")[0]
    db = "lib" if 'db: "lib"' in head else "hr" if 'db: "hr"' in head else "shop"
    level = re.search(r'level: "(\w+)"', head).group(1)
    topic = re.search(r'topic: "(\w+)"', head).group(1)
    sol = re.search(r'solution: "(.*?)",\n', block, re.S).group(1)
    tasks.append(tid)
    if tid in seen_ids: bad(f"duplicate task id {tid}")
    seen_ids.add(tid)
    if level not in levels: bad(f"{tid}: unknown level {level}")
    if topic not in topics: bad(f"{tid}: unknown topic {topic}")
    if (db, sol) in seen_sol: bad(f"{tid}: same solution as another task on the {db} database")
    seen_sol.add((db, sol))
    try:
        if not dbs[db].execute(sol).fetchall(): bad(f"{tid}: solution returns no rows")
    except Exception as e:
        bad(f"{tid}: solution fails on {db}: {e}")
print(f"{len(tasks)} tasks checked")

# --- extra exercises (gap and bug) ---
def rows(db, q, ordered):
    r = [tuple(round(v, 2) if isinstance(v, float) else v for v in row) for row in dbs[db].execute(q).fetchall()]
    return r if ordered else sorted(r, key=repr)

try:
    exercises = json.loads(re.search(r"const EXERCISES = (.*);\s*$", ex_js, re.S).group(1))
except Exception as e:
    exercises = []; bad(f"exercises.js is not strict JSON (this checker needs that): {e}")
for e in exercises:
    eid = e["id"]
    if eid in seen_ids: bad(f"duplicate id {eid}")
    seen_ids.add(eid)
    if e["level"] not in levels: bad(f"{eid}: unknown level {e['level']}")
    if e["topic"] not in topics: bad(f"{eid}: unknown topic {e['topic']}")
    db, ordered = e["db"], e["ordered"]
    try:
        if e["type"] == "gap":
            if e["template"].count("___") != len(e["answers"]): bad(f"{eid}: number of blanks and answers differ"); continue
            sol = e["template"]
            for a in e["answers"]: sol = sol.replace("___", a, 1)
            good = rows(db, sol, ordered)
            if not good: bad(f"{eid}: filled solution returns no rows")
            missing = [a for a in e["answers"] if e["options"].count(a) < e["answers"].count(a)]
            if missing: bad(f"{eid}: answers missing from the word bank: {missing}")
            accepted = 0
            for combo in itertools.permutations(e["options"], len(e["answers"])):
                q = e["template"]
                for w in combo: q = q.replace("___", w, 1)
                try:
                    if rows(db, q, ordered) == good: accepted += 1
                except Exception: pass
            if accepted != 1: bad(f"{eid}: {accepted} combinations of the word bank give the right result (should be exactly 1)")
        elif e["type"] == "bug":
            good = rows(db, e["solution"], ordered)
            if not good: bad(f"{eid}: solution returns no rows")
            try: broken = rows(db, e["starter"], ordered) != good
            except Exception: broken = True
            if not broken: bad(f"{eid}: the starter query already gives the right result, so there is no bug")
        else:
            bad(f"{eid}: unknown exercise type {e['type']}")
    except Exception as err:
        bad(f"{eid}: {err}")
print(f"{len(exercises)} extra exercises checked")

# --- learning path ---
m = re.search(r"const PATH = (.*);\s*$", path_js, re.S)
try:
    path = json.loads(m.group(1))
except Exception as e:
    path = []; bad(f"path.js is not strict JSON (this checker needs that): {e}")
used = {}
for unit in path:
    for lesson in unit["lessons"]:
        for t in lesson["tasks"]:
            if t not in seen_ids: bad(f"{lesson['id']}: unknown task {t}")
            if t in used: bad(f"{lesson['id']}: task {t} already used in {used[t]}")
            used[t] = lesson["id"]
        ran = False
        for con in dbs.values():
            try: con.execute(lesson["example"].rstrip().rstrip(";")).fetchall(); ran = True; break
            except Exception: pass
        if not ran: bad(f"{lesson['id']}: example query does not run on any database")
unused = [t for t in tasks if t not in used]
print(f"{sum(len(u['lessons']) for u in path)} lessons in {len(path)} units, {len(used)} items used by the path")
if unused: print(f"  note: {len(unused)} tasks are not part of any lesson (fine, they still appear in Career and Endless)")
unused_ex = [e["id"] for e in exercises if e["id"] not in used]
if unused_ex: print(f"  note: {len(unused_ex)} exercises are not used by any lesson: {unused_ex}")

print("\nALL GOOD" if not problems else f"\n{len(problems)} problem(s) found")
sys.exit(1 if problems else 0)
