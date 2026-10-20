# Dev helper: deep-merges a JSON patch {"en": {...}, "it": {...}} into messages/*.json
import json, sys
def merge(a, b):
    for k, v in b.items():
        if isinstance(v, dict) and isinstance(a.get(k), dict): merge(a[k], v)
        else: a[k] = v
patch = json.load(open(sys.argv[1]))
for loc, data in patch.items():
    path = f"messages/{loc}.json"
    cur = json.load(open(path))
    merge(cur, data)
    json.dump(cur, open(path, "w"), ensure_ascii=False, indent=2)
    open(path, "a").write("\n")
