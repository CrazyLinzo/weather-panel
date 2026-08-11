#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🌀 特殊天气事件候选流水线 — 自动生成候选
============================================================
由 GitHub Actions 每日定时运行(00:17 北京时间 + 手动触发)。
职责: 从 data/auto-fetch.js(已由 fetch_official.py 抓取)提取活动台风等客观信号,
      生成 data/event-candidates.js 候选事件。候选须经人工 review_events.py 审核
      后才进入 data/special-events.js 并在前端展示; 未经审核的候选前端一律不显示。

铁律:
  1. 事件 detail 只含官方源客观字段(编号/等级/位置/气压/风速/24h预报), 不得编造影响;
  2. "近中国沿海"仅按经纬度阈值标记, 不作强度/登陆判断;
  3. 无活动台风/无信号 → 生成空列表(前端隐藏板块), 不保留旧候选;
  4. 任一环节失败 → 不生成文件, 前端 typeof 守卫回退。

纯 Python 标准库, 无第三方依赖。
"""
import os
import re
import json
from datetime import datetime, timezone, timedelta

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
AUTO_FETCH_PATH = os.path.join(DATA_DIR, "auto-fetch.js")
OUT_PATH = os.path.join(DATA_DIR, "event-candidates.js")
BJ = timezone(timedelta(hours=8))

TYPHOON_SRC = "https://typhoon.nmc.cn/"
# 近中国沿海粗略经纬框(东海/南海/西太近岸); 仅供标注, 非登陆判断
NEAR_CHINA = {"lon_min": 100, "lon_max": 135, "lat_min": 15, "lat_max": 45}
GRADE_CLS = {"强台风": "high", "超强台风": "high", "台风": "high",
             "强热带风暴": "mid", "热带风暴": "mid", "热带低压": "mid", "台风预警": "high"}


def read_auto_fetch():
    """auto-fetch.js 为 JS 对象字面量(键无引号), 转成 JSON 解析。
    值内 'https://...' 等冒号前缀是引号字符, 负向后顾排除, 不会误转。"""
    with open(AUTO_FETCH_PATH, encoding="utf-8") as f:
        txt = f.read()
    i = txt.index("AUTO_FETCH = ") + len("AUTO_FETCH = ")
    j = txt.rindex("};") + 1
    s = txt[i:j]
    s = re.sub(r"(?<![A-Za-z0-9_\"'])([A-Za-z_][A-Za-z0-9_]*)(?=\s*:)", r'"\1"', s)
    s = re.sub(r",\s*([}\]])", r"\1", s)
    return json.loads(s)


def fmt_obs(obs):
    """202608111200 → '2026-08-11 12时'。"""
    if not obs or len(obs) < 10:
        return obs or "?"
    return f"{obs[:4]}-{obs[4:6]}-{obs[6:8]} {obs[8:10]}时"


def typhoon_event(t, fetched_at):
    cn = t.get("cn") or t.get("en") or f"台风{t.get('no')}"
    grade_zh = t.get("gradeZh") or "台风"
    lon, lat = t.get("lon"), t.get("lat")
    near = bool(lon is not None and lat is not None and
                NEAR_CHINA["lon_min"] <= lon <= NEAR_CHINA["lon_max"] and
                NEAR_CHINA["lat_min"] <= lat <= NEAR_CHINA["lat_max"])
    region = f"西北太平洋（{lon}°E, {lat}°N" + ("，近中国沿海）" if near else "，远洋）")
    det = f"编号 {t.get('no')} · {grade_zh}。实测：{lon}°E, {lat}°N，中心气压 {t.get('pressure')} hPa，近中心最大风速 {t.get('wind')} m/s（观测 {fmt_obs(t.get('obs'))}）。"
    fc = t.get("fc24")
    if fc and fc.get("lon") is not None:
        det += f" 24小时预报：移至 {fc.get('lon')}°E, {fc.get('lat')}°N，风速 {fc.get('wind')} m/s（{fc.get('gradeZh') or fc.get('grade') or '—'}）。"
    det += " 强度与路径为官方客观数据，登陆/农业影响未作推断。"
    return {
        "icon": "🌀",
        "title": f'台风"{cn}"({t.get("no")}) {grade_zh}',
        "severity": grade_zh,
        "cls": GRADE_CLS.get(grade_zh, "mid"),
        "status": "活跃中（自动采集）",
        "date": fetched_at,
        "region": region,
        "time": f"观测 {fmt_obs(t.get('obs'))}",
        "detail": det,
        "sources": [{"l": "中央气象台台风网 实时台风", "u": TYPHOON_SRC}],
        "auto": True,
        "candidate_id": f"typhoon-{t.get('no')}",
    }


def build():
    af = read_auto_fetch()
    ty = (af.get("sources") or {}).get("typhoon") or {}
    today = datetime.now(BJ).strftime("%Y-%m-%d")
    events = [typhoon_event(t, today) for t in ty.get("list") or []] if ty.get("count") else []
    return {
        "fetchedAt": datetime.now(BJ).strftime("%Y-%m-%d %H:%M"),
        "date": today,
        "count": len(events),
        "note": "候选事件: 需经 scripts/review_events.py 人工审核后写入 data/special-events.js 才在前端展示",
        "list": events,
    }


def write_output(out):
    os.makedirs(DATA_DIR, exist_ok=True)
    content = (
        "// ============================================================\n"
        "// 🌀 特殊天气事件候选(自动) — 由 GitHub Actions 每日生成, 未经审核不展示\n"
        f"// 生成时间: {out['fetchedAt']} (+08:00) · 候选 {out['count']} 条\n"
        "// 审核: 本地运行 python scripts/review_events.py → 写 data/special-events.js\n"
        "// ============================================================\n"
        "const AUTO_EVENT_CANDIDATES = " + json.dumps(out, ensure_ascii=False) + ";\n"
    )
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    return OUT_PATH


def main():
    out = build()
    path = write_output(out)
    print(f"[{out['fetchedAt']}] event candidates done -> {path} ({out['count']} 条)")
    for e in out["list"]:
        print(f"  · {e['title']} | {e['region']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
