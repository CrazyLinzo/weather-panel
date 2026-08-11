#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🌀 特殊天气事件候选审核 CLI(本地人工环节)
============================================================
候选由 scripts/probe_events.py 自动生成(data/event-candidates.js),
本脚本逐条人工审核 → 审核通过的写入 data/special-events.js(AUTO_EVENTS),
前端 renderSpecialEvents 合并展示。未经审核的候选不展示。

用法:
  python scripts/review_events.py            # 逐个交互: y=通过 n=拒绝 s=跳过 q=退出
  python scripts/review_events.py --all      # 全量通过(无人值守, 仅用于明确授权时)
  python scripts/review_events.py --dry-run  # 只打印候选与审核结果, 不写文件

铁律:
  1. 审核只确认"该官方事实属实且值得展示", 不改写 detail 原文(改需在人工层 SPECIAL_EVENTS);
  2. 通过事件 date=审核当日, 前端按3天窗口自动过期;
  3. AUTO_EVENTS 为空时仍生成空数组(前端隐藏板块)。

纯 Python 标准库。
"""
import os
import sys
import json
import argparse
from datetime import datetime, timezone, timedelta

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
CAND_PATH = os.path.join(DATA_DIR, "event-candidates.js")
OUT_PATH = os.path.join(DATA_DIR, "special-events.js")
BJ = timezone(timedelta(hours=8))


def read_candidates():
    with open(CAND_PATH, encoding="utf-8") as f:
        txt = f.read()
    i = txt.index("AUTO_EVENT_CANDIDATES = ") + len("AUTO_EVENT_CANDIDATES = ")
    j = txt.rindex("};") + 1
    return json.loads(txt[i:j])


def write_events(events, fetched_at):
    content = (
        "// ============================================================\n"
        "// 🌀 特殊天气事件(自动审核层) — 由 scripts/review_events.py 人工审核生成\n"
        f"// 审核时间: {fetched_at} (+08:00) · {len(events)} 条 · 前端与人工层 SPECIAL_EVENTS 合并展示\n"
        "// 数值来自官方源; 未经审核的 AUTO_EVENT_CANDIDATES 不在此文件\n"
        "// ============================================================\n"
        "const AUTO_EVENTS = " + json.dumps(events, ensure_ascii=False) + ";\n"
    )
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    return OUT_PATH


def main():
    ap = argparse.ArgumentParser(description="审核台风等自动候选事件")
    ap.add_argument("--all", action="store_true", help="全量通过(无人值守)")
    ap.add_argument("--dry-run", action="store_true", help="只打印不写文件")
    args = ap.parse_args()

    cand = read_candidates()
    cands = cand.get("list") or []
    if not cands:
        if not args.dry_run:
            write_events([], datetime.now(BJ).strftime("%Y-%m-%d %H:%M"))
        print("无候选事件 → AUTO_EVENTS 置空(前端隐藏板块)")
        return 0

    approved = []
    for e in cands:
        print("-" * 70)
        print(f"[{e.get('candidate_id')}] {e.get('title')}")
        print(f"  区域: {e.get('region')}")
        print(f"  时间: {e.get('time')}")
        print(f"  事实: {e.get('detail')}")
        srcs = " · ".join(s.get("l", "") for s in e.get("sources") or [])
        print(f"  来源: {srcs}")
        if args.all:
            print("  → 通过(--all)")
            approved.append(e)
            continue
        while True:
            try:
                r = input("  通过[y]/拒绝[n]/跳过[s]/退出[q]? ").strip().lower()
            except EOFError:
                r = "s"
            if r in ("y", ""):
                approved.append(e)
                break
            if r == "n":
                break
            if r == "s":
                break
            if r == "q":
                sys.exit(0)

    approved_clean = [{k: v for k, v in e.items() if k != "candidate_id"} for e in approved]
    if args.dry_run:
        print(f"\n[dry-run] 通过 {len(approved_clean)} 条, 未写文件")
        for e in approved_clean:
            print("  ✓", e["title"])
        return 0

    path = write_events(approved_clean, datetime.now(BJ).strftime("%Y-%m-%d %H:%M"))
    print(f"\n通过 {len(approved_clean)} 条 → {path}")
    for e in approved_clean:
        print("  ✓", e["title"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
