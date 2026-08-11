#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🇨🇳 中央气象台《中期天气预报》official 分段采集器
============================================================
由 GitHub Actions 每日定时运行(00:17 北京时间 + 手动触发)。
职责: 读取 data/midrange/midrange-YYYY-MM-DD.txt 快照 → 按锚点切分出
      "未来10天 / 主要天气过程 / 11-14天展望 / 高影响天气" 官方事实段
      → 生成 data/cn-outlook.js, 供前端"拾壹影响推演"的官方事实自动同步。

边界:
  - 只覆盖 CN_AGRI_OUTLOOK.official 中"未来10天"之后的各段(第1条"过去10天
    实况"公报正文不含, 由人工保留);
  - 数值一律来自公报原文, 不得改写; 标题(过程/高影响点)仅从原文短语提炼;
  - 任一环节失败 → 不生成/保留旧文件, 前端 typeof AUTO_CN_OUTLOOK 守卫回退人工。

纯 Python 标准库, 无第三方依赖。
"""
import os
import re
import json
from datetime import datetime, timezone, timedelta

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNAPSHOT_DIR = os.path.join(REPO_ROOT, "data", "midrange")
OUT_PATH = os.path.join(REPO_ROOT, "data", "cn-outlook.js")
BJ = timezone(timedelta(hours=8))

TIME_RE = re.compile(r"(?<!\d)\d{1,2}\s*[-～~至]\s*\d{1,2}\s*日|\d{1,2}\s*日")


def latest_snapshot():
    snaps = sorted(f for f in os.listdir(SNAPSHOT_DIR) if f.startswith("midrange-") and f.endswith(".txt"))
    if not snaps:
        raise ValueError("data/midrange 无快照文件")
    return os.path.join(SNAPSHOT_DIR, snaps[-1])


def read_issued(path):
    head = open(path, encoding="utf-8").read()
    m = re.search(r"发布时间\s*[:：]?\s*(\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日\s*\d{1,2}\s*时)", head)
    return re.sub(r"\s+", "", m.group(1)) if m else None


def body_of(path):
    lines = []
    for ln in open(path, encoding="utf-8"):
        s = ln.strip()
        if not s or s.startswith("#") or s.startswith("=="):
            continue
        lines.append(s)
    return re.sub(r"[ \t\xa0　]+", " ", "\n".join(lines)).strip()


def extract(text, start_kw, end_kws):
    """从 start_kw 之后取到最早 end_kw 之前的子串(清理空白)。找不到返回 None。"""
    i = text.find(start_kw)
    if i < 0:
        return None
    seg = text[i + len(start_kw):]
    for ek in end_kws:
        j = seg.find(ek)
        if j >= 0:
            seg = seg[:j]
            break
    return re.sub(r"\s+", " ", seg).strip() or None


def split_processes(procs):
    """主要天气过程段按时间短语(11-12日/16日)切分; 无时间短语的前缀并入第一段。
    负向后顾 (?<!数字) 防止 '11-12日' 被 lookahead 双重切分('11'前与第二个'1'前)。"""
    segs = [s.strip() for s in re.split(r"(?<!\d)(?=\d{1,2}\s*[-～~至]\s*\d{1,2}\s*日)", procs) if s.strip()]
    if not segs:
        return []
    if not TIME_RE.match(segs[0]) and len(segs) > 1:
        segs[0] = segs[0] + " " + segs[1]
        del segs[1]
    return segs


def split_high(high):
    """高影响段: 首点无编号, 其余按 ' N. ' / ' N、' 切分。"""
    parts = [p.strip() for p in re.split(r"(?=\s*\d\s*[\.、]\s*)", high) if p.strip()]
    return [re.sub(r"^\s*\d\s*[\.、]\s*", "", p).strip() for p in parts if p.strip()]


def head_title(seg, maxlen=16):
    """取首个连续中文/字母串作为标题(排除数字, 避免 '未来10天' 被截入标题)。"""
    m = re.match(r"^([一-龥A-Za-z]+)", seg)
    t = m.group(1).strip() if m else seg
    return t[:maxlen]


def parse():
    path = latest_snapshot()
    text = body_of(path)
    fname = os.path.basename(path)

    official = []

    future = extract(text, "未来10天", ("主要天气过程", "三、"))
    if future:
        official.append({"t": "未来10天", "d": future})

    procs = extract(text, "主要天气过程", ("三、", "四、"))
    if procs:
        procs = re.sub(r"^[:：]\s*", "", procs).strip()
        for i, seg in enumerate(split_processes(procs), 1):
            tm = re.search(r"(\d{1,2}\s*[-～~至]\s*\d{1,2}\s*日)", seg)
            t = f"过程：{tm.group(1)}" if tm else f"过程{i}"
            official.append({"t": t, "d": seg})

    outlook = extract(text, "未来11-14天", ("四、", "高影响"))
    if outlook:
        j = outlook.find("未来11-14天")          # 去掉 "三、未来11-14天天气展望 " 前缀
        if j > 0:
            outlook = outlook[j:]
        official.append({"t": "11-14天展望", "d": outlook})

    high = extract(text, "四、高影响天气与关注", ("预报：", "签发"))
    if high:
        for p in split_high(high):
            if not p:
                continue
            official.append({"t": head_title(p), "d": p})

    if not official:
        raise ValueError(f"{fname}: 未解析出任何 official 段")

    # horizon 摘要(仅摘要用, 详情在 d)
    horizon = None
    fm = re.search(r"未来10天\s*（?(\d{1,2}月\d{1,2}-\d{1,2}日)", text)
    om = re.search(r"未来11-14天\s*（?(\d{1,2}月\d{1,2}-\d{1,2}日)", text)
    if fm or om:
        horizon = (f"未来10天({fm.group(1)})" if fm else "") + \
                  (" + " if fm and om else "") + \
                  (f"11-14天展望({om.group(1)})" if om else "")

    forecaster = None
    fcm = re.search(r"预报\s*[:：]\s*([^\s，。；]+)\s*签发\s*[:：]\s*([^\s，。；]+)", text)
    if fcm:
        forecaster = f"预报：{fcm.group(1)} · 签发：{fcm.group(2)}"

    out = {
        "fetchedAt": datetime.now(BJ).strftime("%Y-%m-%d %H:%M"),
        "released": read_issued(path),
        "sourceFile": f"data/midrange/{fname}",
        "horizon": horizon,
        "forecaster": forecaster,
        "official": official,
    }
    return out


def write_output(out):
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    content = (
        "// ============================================================\n"
        "// 🇨🇳 中央气象台《中期天气预报》official 自动分段 — 由 GitHub Actions 每日生成, 勿手改\n"
        f"// 生成时间: {out['fetchedAt']} (+08:00) · 发布: {out['released']} ({out['sourceFile']})\n"
        "// 数值来自官方公报原文; 前端 typeof AUTO_CN_OUTLOOK 守卫, 缺失回退人工层(第1条实况人工保留)\n"
        "// ============================================================\n"
        "const AUTO_CN_OUTLOOK = " + json.dumps(out, ensure_ascii=False) + ";\n"
    )
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    return OUT_PATH


def main():
    out = parse()
    path = write_output(out)
    print(f"[{out['fetchedAt']}] CN midrange official done -> {path}")
    print(f"  released: {out['released']} · horizon: {out['horizon']} · 段数: {len(out['official'])}")
    for o in out["official"]:
        print(f"  · {o['t']}: {o['d'][:60]}…")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
