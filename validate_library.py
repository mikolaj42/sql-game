#!/usr/bin/env python3
"""Validates library.js: unique names, known categories, related entries and lessons exist,
every live example runs on its database and returns rows. Exit code 1 on problems.
Run from the project folder:  python3 tools/validate_library.py [--show]"""
import json, re, sqlite3, subprocess, sys
show = "--show" in sys.argv
src = "".join(open(f, encoding="utf-8").read() + "\n" for f in ("tasks.js", "career.js", "library.js"))
out = subprocess.run(["node", "-e", "const s=require('fs').readFileSync(0,'utf8');const d=new Function(s+';return {LIBRARY,LIB_CATS,CONCEPTS,DB_SCRIPT,HR_SCRIPT,LIB_SCRIPT}')();console.log(JSON.stringify(d))"],
                     input=src, capture_output=True, text=True)
if out.returncode: print(out.stderr); sys.exit(1)
D = json.loads(out.stdout)
scripts = {"shop": D["DB_SCRIPT"], "hr": D["HR_SCRIPT"], "lib": D["LIB_SCRIPT"]}
problems = []
def bad(m): problems.append(m); print("PROBLEM:", m)
names = [e["n"] for e in D["LIBRARY"]]
for n in {n for n in names if names.count(n) > 1}: bad(f"duplicate entry {n}")
live = static = 0
for e in D["LIBRARY"]:
    n = e["n"]
    if e["c"] not in D["LIB_CATS"]: bad(f"{n}: unknown category {e['c']}")
    for key in ("d", "s", "x"):
        if not e.get(key): bad(f"{n}: missing {key}")
    for r in e.get("r", []):
        if r not in names: bad(f"{n}: related entry '{r}' does not exist")
    if e.get("l") and e["l"] not in D["CONCEPTS"]: bad(f"{n}: unknown lesson {e['l']}")
    if e.get("b", "shop") not in scripts: bad(f"{n}: unknown database")
    for sql, note in e["x"]:
        if not note: bad(f"{n}: an example has no note")
        if e.get("live") is False: static += 1; continue
        live += 1
        try:
            con = sqlite3.connect(":memory:"); con.executescript(scripts[e.get("b", "shop")])
            rows = con.execute(sql).fetchall()
        except Exception as ex: bad(f"{n}: example fails: {ex}\n   {sql}"); continue
        if not rows: bad(f"{n}: example returns no rows\n   {sql}")
        elif show: print(f"  {n:24} {len(rows):3} rows {rows[0]}")
for c in D["LIB_CATS"]:
    if not any(e["c"] == c for e in D["LIBRARY"]): bad(f"category {c} is empty")
print(f"{len(D['LIBRARY'])} entries in {len(D['LIB_CATS'])} categories, {live} live examples, {static} shown only")
print("OK" if not problems else f"{len(problems)} problem(s)")
sys.exit(1 if problems else 0)
