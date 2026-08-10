#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
⚡ 官方数值层自动采集器
============================================================
由 GitHub Actions 每日定时运行(00:17 北京时间 + 手动触发)。
职责: 抓取官方可机读信源 → 生成 data/auto-fetch.js + 中期公报快照。

铁律:
  1. 数值一律来自下方 sources 列出的官方源, 不得编造/推断;
  2. 任一源失败 → 该项 value 置 null 并在 fetchedAt 记录, 前端 typeof 守卫降级;
  3. 每个值都带观测日期与来源 URL(可审计)。

纯 Python 标准库实现, 无第三方依赖, Linux/Windows 均可运行。
"""
import urllib.request
import re
import html as html_mod
import os
from datetime import datetime, timezone, timedelta

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
SNAPSHOT_DIR = os.path.join(DATA_DIR, "midrange")
KEEP_SNAPSHOTS = 30          # 保留最近 N 期公报快照, 超出删除
BJ = timezone(timedelta(hours=8))
UA = "Mozilla/5.0 (daily-fetch bot; +https://github.com/CrazyLinzo/weather-panel)"


def now_bj():
    return datetime.now(BJ)


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


# ---------- 各源解析器: 失败抛异常, 由 main 捕获置 null ----------

def parse_cpc_nao():
    """NOAA CPC NAO 日值: 纯文本, 每行 '年 月 日 值', 末行为最新。"""
    d = fetch("ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.nao.index.b500101.current.ascii")
    lines = [l.split() for l in d.decode("ascii", "ignore").splitlines() if l.strip()]
    y, m, day, v = lines[-1][:4]
    return {
        "value": round(float(v), 3),
        "date": f"{y}-{int(m):02d}-{int(day):02d}",
    }


def parse_cpc_nino34():
    """CPC NINO 指数(周值按月归档): 表头 YR MON NINO1+2 ANOM NINO3 ANOM NINO4 ANOM NINO3.4 ANOM。"""
    d = fetch("https://www.cpc.ncep.noaa.gov/data/indices/sstoi.indices")
    rows = [l.split() for l in d.decode("utf-8", "ignore").splitlines() if l.strip() and l[0].isdigit()]
    last = rows[-1]
    y, m = int(last[0]), int(last[1])
    return {
        "value": round(float(last[8]), 2),   # NINO3.4 温度
        "anom": round(float(last[9]), 2),    # NINO3.4 距平
        "month": f"{y}-{m:02d}",
    }


def parse_nmc_midrange():
    """中央气象台《中期天气预报》公报全文快照(服务端渲染, 去脚本/样式后存正文)。"""
    d = fetch("http://www.nmc.cn/publish/bulletin/mid-range.htm")
    t = d.decode("utf-8", "ignore")
    t = re.sub(r"<script.*?</script>", "", t, flags=re.S)
    t = re.sub(r"<style.*?</style>", "", t, flags=re.S)
    body = html_mod.unescape(re.sub(r"<[^>]+>", "", t))
    body = re.sub(r"[ \t\xa0　]+", " ", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    # 发布时间: 页面含 '发布时间' 或 '预报员 ... 签发', 后跟 年/月/日/时
    issued = None
    m = re.search(r"(?:发布时间|预报员|签发)[^年]{0,50}(\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日\s*\d{1,2}\s*时)", body)
    if m:
        issued = re.sub(r"\s+", "", m.group(1))
    # 正文起点: 找首个 '未来10天'/'预计' 关键词(跳过导航)
    m = re.search(r"(预计|未来10天)", body)
    text = body[m.start():].strip() if m else body.strip()
    return {"text": text, "issued": issued}


# ---------- 快照与产物输出 ----------

def write_snapshot(parsed):
    """公报快照按抓取日期存档, 供审计与拾壹人工/未来LLM使用。"""
    os.makedirs(SNAPSHOT_DIR, exist_ok=True)
    stamp = now_bj()
    fname = f"midrange-{stamp:%Y-%m-%d}.txt"
    path = os.path.join(SNAPSHOT_DIR, fname)
    head = (
        f"# 中央气象台《中期天气预报》公报快照\n"
        f"# 抓取时间: {stamp:%Y-%m-%d %H:%M} (+08:00)\n"
        f"# 发布时间: {parsed.get('issued') or '未识别'}\n"
        f"# 来源: http://www.nmc.cn/publish/bulletin/mid-range.htm\n"
        f"# 用途: 拾壹影响推演的事实依据, 数值不得改写\n"
        f"# {'=' * 60}\n\n"
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(head + parsed["text"])
    # 清理超出保留期的旧快照
    snaps = sorted(f for f in os.listdir(SNAPSHOT_DIR) if f.startswith("midrange-"))
    for old in snaps[:-KEEP_SNAPSHOTS]:
        try:
            os.remove(os.path.join(SNAPSHOT_DIR, old))
        except OSError:
            pass
    return f"data/midrange/{fname}"


def write_auto_fetch(sources, fetched_at):
    os.makedirs(DATA_DIR, exist_ok=True)
    path = os.path.join(DATA_DIR, "auto-fetch.js")
    src_lines = []
    for key, s in sources.items():
        if s.get("ok"):
            payload = {k: v for k, v in s.items() if k != "ok"}
            src_lines.append(f"    {key}: {json_dumps(payload)}")
        else:
            err = (s.get("error") or "unknown").replace("\\", " ").replace('"', "'")
            src_lines.append(f"    {key}: {{ label: {json_dumps(s['label'])}, url: {json_dumps(s['url'])}, value: null, error: {json_dumps(err[:120])} }}")
    content = (
        "// ============================================================\n"
        "// ⚡ 官方数据自动采集层 — 由 GitHub Actions 每日自动生成, 勿手改\n"
        f"// 生成时间: {fetched_at:%Y-%m-%d %H:%M} (+08:00)\n"
        "// 数值来自官方源, 任一源失败 value=null; 前端 typeof AUTO_FETCH 守卫\n"
        "// ============================================================\n"
        "const AUTO_FETCH = {\n"
        f"  fetchedAt: {json_dumps(fetched_at.strftime('%Y-%m-%d %H:%M'))},\n"
        "  sources: {\n"
        + ",\n".join(src_lines) + "\n"
        "  }\n"
        "};\n"
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def json_dumps(v):
    return json.dumps(v, ensure_ascii=False)


import json  # noqa: E402


def main():
    sources = {
        "nao": {"label": "NOAA CPC NAO 日值", "url": "ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.nao.index.b500101.current.ascii"},
        "nino34": {"label": "CPC NINO3.4 周值", "url": "https://www.cpc.ncep.noaa.gov/data/indices/sstoi.indices"},
        "midrange": {"label": "中央气象台《中期天气预报》快照", "url": "http://www.nmc.cn/publish/bulletin/mid-range.htm"},
    }
    parsers = {
        "nao": parse_cpc_nao,
        "nino34": parse_cpc_nino34,
        "midrange": parse_nmc_midrange,
    }
    for key in sources:
        try:
            parsed = parsers[key]()
            if key == "midrange":
                snapshot_path = write_snapshot(parsed)
                sources[key].update({"ok": True, "snapshot": snapshot_path, "issued": parsed["issued"]})
            else:
                sources[key].update({"ok": True, **parsed})
        except Exception as e:
            sources[key].update({"ok": False, "error": str(e)})

    fetched_at = now_bj()
    out = write_auto_fetch(sources, fetched_at)
    print(f"[{fetched_at:%Y-%m-%d %H:%M}] auto-fetch done -> {out}")
    for key, s in sources.items():
        status = "OK" if s.get("ok") else f"FAIL({s.get('error','')})"
        print(f"  {key}: {status}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
