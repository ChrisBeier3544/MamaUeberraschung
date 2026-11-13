#!/usr/bin/env python3
"""Setzt eine neue Versionskennung, damit Handys und die Home-Bildschirm-App
sofort den neuesten Stand laden. Vor jedem Veröffentlichen ausführen:
    python3 tools/bump-version.py
"""
import re, time, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
v = time.strftime("%Y%m%d%H%M%S")
(root / "version.txt").write_text(v + "\n")
p = root / "index.html"
s = p.read_text()
s = re.sub(r'const BUILD = "[^"]*"', f'const BUILD = "{v}"', s)
s = re.sub(r'((?:src|href)="(?:[a-z]+\.js|style\.css|manifest\.webmanifest))(?:\?v=[0-9]+)?"', rf'\1?v={v}"', s)
p.write_text(s)
print("Version", v)
