#!/usr/bin/env python3
"""Validates career.js: every task id exists, every example runs, difficulty rises inside a project,
every lesson is used once, custom tasks give a non-empty result. Exit code 1 on problems.
Run from the project folder:  python3 tools/validate_career.py [--show]"""
import json, re, sqlite3, subprocess, sys
show = "--show" in sys.argv
js = "".join(open(f, encoding="utf-8").read() + "\n" for f in ("tasks.js", "exercises.js", "career.js"))
dump = subprocess.run(["node", "-e", "const d=new Function(process.argv[1]+';return {TASKS,EXERCISES,CAREER_TASKS,CONCEPTS,PROJECTS,DB_SCRIPT,HR_SCRIPT,LIB_SCRIPT}')(require('fs').readFileSync(0,'utf8')); console.log(JSON.stringify(d))" if False else
                       "const fs=require('fs');const src=fs.readFileSync(0,'utf8');const d=new Function(src+';return {TASKS,EXERCISES,CAREER_TASKS,CONCEPTS,PROJECTS,DB_SCRIPT,HR_SCRIPT,LIB_SCRIPT}')();console.log(JSON.stringify(d))"],
                      input=js, capture_output=True, text=True)
if dump.returncode: print(dump.stderr); sys.exit(1)
D = json.loads(dump.stdout)
scripts = {"shop": D["DB_SCRIPT"], "hr": D["HR_SCRIPT"], "lib": D["LIB_SCRIPT"]}
def con(db):
    c = sqlite3.connect(":memory:"); c.executescript(scripts[db]); return c
tasks = {t["id"]: t for t in D["TASKS"] + D["EXERCISES"] + D["CAREER_TASKS"]}
problems = []
def bad(m): problems.append(m); print("PROBLEM:", m)

# custom tasks
ids = [t["id"] for t in D["CAREER_TASKS"]]
if len(ids) != len(set(ids)): bad("duplicate career task ids")
for t in D["CAREER_TASKS"]:
    if t["id"] in {x["id"] for x in D["TASKS"] + D["EXERCISES"]}: bad(f"{t['id']} clashes with an existing id")
    try: rows = con(t["db"]).execute(t["solution"]).fetchall()
    except Exception as e: bad(f"{t['id']} solution fails: {e}"); continue
    if not rows: bad(f"{t['id']} returns no rows")
    if t.get("ordered"):
        # ordered tasks need a tie-free sort: compare with the reversed secondary order is hard, so just require distinct rows
        if len(set(map(tuple, rows))) != len(rows): bad(f"{t['id']} is ordered but has duplicate rows")
    if show: print(f"  {t['id']}: {len(rows)} rows {rows[:3]}")

# concepts
used = {}
for p in D["PROJECTS"]:
    last = 0
    if len({i["k"] for i in p["items"]}) != len(p["items"]): bad(f"{p['id']}: the same task twice")
    for n, it in enumerate(p["items"], 1):
        if it["k"] not in tasks: bad(f"{p['id']} item {n}: unknown task {it['k']}")
        if "c" in it:
            if it["c"] not in D["CONCEPTS"]: bad(f"{p['id']} item {n}: unknown concept {it['c']}")
            used[it["c"]] = used.get(it["c"], 0) + 1
        if not 1 <= it["d"] <= 5: bad(f"{p['id']} item {n}: difficulty {it['d']}")
        if it["d"] < last: bad(f"{p['id']} item {n}: difficulty falls ({last} -> {it['d']})")
        last = it["d"]
        for key in ("t", "b"):
            if not it.get(key): bad(f"{p['id']} item {n}: missing {key}")
    if not p["items"][0].get("c"): bad(f"{p['id']}: the first item has no lesson")
alltasks = [i["k"] for p in D["PROJECTS"] for i in p["items"]]
if len(alltasks) != len(set(alltasks)): bad("a task appears in two projects: " + ", ".join(sorted({k for k in alltasks if alltasks.count(k) > 1})))
for c in D["CONCEPTS"]:
    if used.get(c, 0) != 1: bad(f"concept {c} is used {used.get(c, 0)} times (expected exactly once)")
for cid, c in D["CONCEPTS"].items():
    for key in ("t", "intro", "syntax", "pts", "ex", "watch", "db"):
        if key not in c: bad(f"concept {cid}: missing {key}")
    try: cur = con(c["db"]).execute(c["ex"]["sql"]); rows = cur.fetchall()
    except Exception as e: bad(f"concept {cid}: example fails: {e}"); continue
    if not rows: bad(f"concept {cid}: example returns no rows")
    if show: print(f"  {cid:16} {len(rows):3} rows  {[tuple(r) for r in rows[:2]]}")
    # the syntax box must be runnable too when it is a full query
    if re.match(r"\s*(SELECT|WITH)", c["syntax"], re.I) and not re.search(r"table_name|column1", c["syntax"]):
        try: con(c["db"]).execute(c["syntax"].rstrip(";"))
        except Exception as e: bad(f"concept {cid}: syntax box does not run: {e}")
n = sum(len(p["items"]) for p in D["PROJECTS"])
print(f"{len(D['PROJECTS'])} projects, {n} items, {len(D['CONCEPTS'])} lessons, {len(D['CAREER_TASKS'])} custom tasks, {len(set(alltasks))} different tasks used")
print("OK" if not problems else f"{len(problems)} problem(s)")
sys.exit(1 if problems else 0)
