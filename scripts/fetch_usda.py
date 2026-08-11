#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🇺🇸 USDA Crop Progress 自动采集器
============================================================
由 GitHub Actions 每日定时运行(00:17 北京时间 + 手动触发)。
职责: 从 NAL esmis 页面找到最新一期纯文本周报(progNNNN.txt) → 解析各物候段
      → 生成 data/crop-progress.js, 供前端"作物生育期"美国行自动同步。

数据来源: USDA NASS Crop Progress(每周一美东16:00发布, 数据截至前一周日)。
链接发现: https://esmis.nal.usda.gov/publication/crop-progress 页面列出当期 txt/pdf。
解析规则: 每段标题 "作物 指标 - Selected States"; 国家汇总行 "N States ...: 列..."。
          进度表 4 列(去年/两周前/上周/5年均值); 优良率表 5 列(VeryPoor/Poor/Fair/Good/Excellent)。

铁律:
  1. 数值一律来自 USDA 原始周报, 不得编造;
  2. 任一环节失败 → 不生成/保留旧文件, 前端 typeof 守卫降级(美国行显示人工值);
  3. 每个值保留观测周(周终日期)与来源 URL(可审计)。

纯 Python 标准库实现, 无第三方依赖。
"""
import urllib.request
import ssl
import re
import os
import json
import time
from datetime import datetime, timezone, timedelta

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
OUT_PATH = os.path.join(DATA_DIR, "crop-progress.js")
INDEX_URL = "https://esmis.nal.usda.gov/publication/crop-progress"
BJ = timezone(timedelta(hours=8))
BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

# 作物多词名优先匹配(长词在前); 其余为指标。周报内单复数混用(Soybean Condition 用单数),
# 统一归一化为复数键, 供 build_output 查询。
CROPS = ["Winter Wheat", "Spring Wheat", "Soybean", "Soybeans", "Corn", "Cotton",
         "Peanuts", "Sorghum", "Rice", "Oats", "Barley"]
CANON = {"Soybean": "Soybeans", "Soybeans": "Soybeans"}
SECTION_RE = re.compile(r"^([A-Z][A-Za-z ]+?)\s*-\s*Selected States(?:\s*:.*)?$")
AGG_RE = re.compile(r"^(\d+)\s+States[\s.]+:+\s*(.+)$")   # 汇总行格式: "18 States .......: v v v v"


def fetch_retry(url, tries=3, timeout=45, delay=2):
    last = None
    for _ in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": BROWSER_UA})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", "ignore")
        except Exception as e:
            last = e
            time.sleep(delay)
    raise last


def find_latest_txt():
    """esmis 页面列出多期报告链接, 取 prog 编号最大(周次最新)的 txt。"""
    html = fetch_retry(INDEX_URL)
    nums = []
    for m in re.finditer(r'release-files/\d+/prog(\d+)\.txt', html):
        nums.append((int(m.group(1)), m.group(0)))
    if not nums:
        raise ValueError("esmis 页面未找到 progNNNN.txt 链接")
    _, path = max(nums, key=lambda x: x[0])
    return "https://esmis.nal.usda.gov" + path


def split_title(title):
    for c in sorted(CROPS, key=len, reverse=True):
        if title.startswith(c):
            return CANON.get(c, c), title[len(c):].strip()
    return title, ""


def clean(v):
    v = v.strip()
    if v in ("-", "(NA)", "NA", "--", "N/A"):
        return None
    try:
        return int(v)
    except ValueError:
        return None


MONTHS = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
          "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}


def _table_weekend(lines):
    """进度表两行表头取当周(第3列)日期: 列标题 'State : Aug 9, : Aug 2, : Aug 9, : 2021-2025'
    年份行 ': 2025 : 2026 : 2026 : Average' → 'August 9, 2026'。"""
    for i, l in enumerate(lines):
        if "Week ending" in l and i + 3 < len(lines):
            cols = [c.strip() for c in lines[i + 2].split(":")]
            years = [c.strip() for c in lines[i + 3].split(":")]
            if len(cols) >= 4 and len(years) >= 4:
                mm = re.match(r"([A-Za-z]+)\s+(\d{1,2}),$", cols[3])
                if mm and re.match(r"\d{4}$", years[3]):
                    return f"{mm.group(1)} {mm.group(2)}, {years[3]}"
    return None


def parse(text):
    """按段标题切分, 提取国家汇总行的最新周值与5年均值/优良率。"""
    sections = {}      # (crop, metric) -> {crop, metric, values, weekEnd, lines}
    cur = None
    for ln in text.splitlines():
        s = ln.strip()
        m = SECTION_RE.match(s)
        if m:
            title = m.group(1).strip()
            crop, metric = split_title(title)
            cur = {"crop": crop, "metric": metric, "values": None, "weekEnd": None, "lines": []}
            sections[(crop, metric)] = cur
            # condition 类段标题自带 "Week Ending Aug 9, 2026"
            wm = re.search(r"Week Ending\s+([A-Za-z]+ \d{1,2}, \d{4})", s)
            if wm:
                cur["weekEnd"] = wm.group(1)
            continue
        if not cur:
            continue
        cur["lines"].append(s)
        # 国家汇总行(表头后首个): "18 States .......: 去年 前周 当周 5年均值"
        ag = AGG_RE.match(s)
        if ag and ag.group(2).strip():
            cur["values"] = [clean(x) for x in re.split(r"\s+", ag.group(2).strip())]
            if cur["weekEnd"] is None:
                cur["weekEnd"] = _table_weekend(cur["lines"])
    return sections


def build_output(sections, released, release_file, fetched_at):
    out = {"fetchedAt": fetched_at, "released": released, "releaseFile": release_file, "sourceUrl": INDEX_URL, "crops": {}}

    def progress(crop, metric):
        sec = sections.get((crop, metric))
        if not sec or not sec["values"]:
            return None
        v = sec["values"]
        if len(v) >= 4 and v[2] is not None:      # 进度表: 去年/两周前/上周/5年均值
            return {"w": v[2], "avg": v[3], "weekEnd": sec["weekEnd"]}
        return None

    def condition(crop):
        sec = sections.get((crop, "Condition"))
        if not sec or not sec["values"]:
            return None
        v = sec["values"]                           # VeryPoor/Poor/Fair/Good/Excellent
        if len(v) < 5 or v[3] is None or v[4] is None:
            return None
        return {"goodExc": v[3] + v[4], "vp": v[0], "poor": v[1], "fair": v[2], "good": v[3], "exc": v[4], "weekEnd": sec["weekEnd"]}

    c = {}
    for metric in ("Silking", "Dough", "Dented"):
        p = progress("Corn", metric)
        if p:
            c[metric.lower()] = p
    cd = condition("Corn")
    if cd:
        c["condition"] = cd
    if c:
        out["crops"]["corn"] = c

    so = {}
    for metric in ("Blooming", "Setting Pods"):
        p = progress("Soybeans", metric)
        if p:
            so[metric.lower().replace(" ", "")] = p
    sd = condition("Soybeans")
    if sd:
        so["condition"] = sd
    if so:
        out["crops"]["soybeans"] = so

    ww = progress("Winter Wheat", "Harvested")
    if ww:
        out["crops"]["winterWheat"] = {"harvested": ww}

    sw = {}
    for metric in ("Headed", "Harvested"):
        p = progress("Spring Wheat", metric)
        if p:
            sw[metric.lower()] = p
    scd = condition("Spring Wheat")
    if scd:
        sw["condition"] = scd
    if sw:
        out["crops"]["springWheat"] = sw
    return out


def write_output(out):
    os.makedirs(DATA_DIR, exist_ok=True)
    content = (
        "// ============================================================\n"
        "// 🇺🇸 USDA Crop Progress 自动采集 — 由 GitHub Actions 每日生成, 勿手改\n"
        f"// 生成时间: {out['fetchedAt']} (+08:00) · 发布: {out['released']} ({out['releaseFile']})\n"
        "// 数值来自 USDA NASS 官方周报; 前端 typeof AUTO_CROP_PROGRESS 守卫, 缺失回退人工层\n"
        "// ============================================================\n"
        "const AUTO_CROP_PROGRESS = " + json.dumps(out, ensure_ascii=False) + ";\n"
    )
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    return OUT_PATH


def main():
    fetched_at = datetime.now(BJ).strftime("%Y-%m-%d %H:%M")
    txt_url = find_latest_txt()
    text = fetch_retry(txt_url)
    sections = parse(text)
    released_m = re.search(r"Released\s+([A-Za-z]+ \d{1,2}, \d{4})", text)
    released = released_m.group(1) if released_m else "?"
    out = build_output(sections, released, txt_url.rsplit("/", 1)[-1], fetched_at)
    path = write_output(out)
    print(f"[{fetched_at}] USDA Crop Progress done -> {path}")
    print(f"  released: {released} · crops: {', '.join(out['crops'].keys())}")
    for crop, d in out["crops"].items():
        items = []
        for k, v in d.items():
            if k == "condition":
                items.append(f"condition good+exc={v['goodExc']}%")
            else:
                items.append(f"{k}={v['w']}%(avg {v['avg']}%)")
        print(f"  {crop}: {' · '.join(items)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
