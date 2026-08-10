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
import urllib.error
import ssl
import re
import html as html_mod
import os
import json
from datetime import datetime, timezone, timedelta

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
SNAPSHOT_DIR = os.path.join(DATA_DIR, "midrange")
KEEP_SNAPSHOTS = 30          # 保留最近 N 期公报快照, 超出删除
HISTORY_PATH = os.path.join(DATA_DIR, "history.js")
HISTORY_MAX = 90             # 自动数据时间序列保留条数
TYPHOON_MAX = 6              # 最多抓取的活动台风详情数(防超时)
BJ = timezone(timedelta(hours=8))
UA = "Mozilla/5.0 (daily-fetch bot; +https://github.com/CrazyLinzo/weather-panel)"

GRADE_ZH = {"TD": "热带低压", "TS": "热带风暴", "STS": "强热带风暴", "TY": "台风", "STY": "强台风", "SuperTY": "超强台风"}


def enso_phase(anom):
    """按 CPC ONI 阈值对 NINO3.4 距平自动判相位(月度近似)。"""
    if anom >= 2.0: return "极强厄尔尼诺"
    if anom >= 1.5: return "强厄尔尼诺"
    if anom >= 1.0: return "中等厄尔尼诺"
    if anom >= 0.5: return "弱厄尔尼诺"
    if anom > -0.5: return "中性"
    if anom > -1.0: return "弱拉尼娜"
    if anom > -1.5: return "中等拉尼娜"
    return "强拉尼娜"


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
    anom = round(float(last[9]), 2)
    return {
        "value": round(float(last[8]), 2),   # NINO3.4 温度
        "anom": anom,                        # NINO3.4 距平
        "month": f"{y}-{m:02d}",
        "phase": enso_phase(anom),           # 自动判相位(替代人工核对)
    }


def pdo_phase(v):
    """PDO 以指数符号定相位(JMA口径), 绝对值<0.5 弱化标注。"""
    if v >= 0.5: return "正相位"
    if v > 0: return "弱正相位"
    if v <= -0.5: return "负相位"
    return "弱负相位"


def ao_phase(v):
    if v >= 1.0: return "正相位"
    if v <= -1.0: return "负相位"
    return "中性"


def iod_phase(v):
    """IOD 事件阈值 ±0.4 (BOM/常用口径)。"""
    if v >= 0.4: return "正IOD"
    if v <= -0.4: return "负IOD"
    return "中性"


def latest_month_from_wide(data, missing):
    """宽表 'Year m1 m2 ... m12' → (year, month, value), 跳过缺测占位(missing)。"""
    if isinstance(data, bytes):
        data = data.decode("utf-8", "ignore")
    rows = [l.split() for l in data.splitlines() if l.strip() and l[0].isdigit() and len(l) >= 13]
    last = rows[-1]
    y = int(last[0])
    vals = []
    for i, v in enumerate(last[1:13], 1):
        try:
            f = float(v)
        except ValueError:
            continue
        if f == missing:
            continue
        vals.append((i, f))
    if not vals:
        raise ValueError("宽表无有效月值")
    m, v = vals[-1]
    return y, m, v


def parse_ncei_pdo():
    """NOAA NCEI ERSST v5 PDO 指数: 宽表 'Year Jan..Dec', 99.99=缺测。"""
    d = fetch("https://www.ncei.noaa.gov/pub/data/cmb/ersst/v5/index/ersst.v5.pdo.dat")
    y, m, v = latest_month_from_wide(d, 99.99)
    return {"value": round(v, 2), "month": f"{y}-{m:02d}", "phase": pdo_phase(v)}


def parse_cpc_ao():
    """NOAA CPC AO 日值: 纯文本 '年 月 日 值', 与 NAO 同目录同构。"""
    d = fetch("ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.ao.index.b500101.current.ascii")
    lines = [l.split() for l in d.decode("ascii", "ignore").splitlines() if l.strip()]
    y, m, day, v = lines[-1][:4]
    return {"value": round(float(v), 3), "date": f"{y}-{int(m):02d}-{int(day):02d}", "phase": ao_phase(float(v))}


def parse_psl_iod():
    """NOAA PSL 印度洋偶极子 DMI(基于 HadISST1.1): 宽表, -9999=缺测, 官方标注 Preliminary(滞后约2月)。"""
    d = fetch("https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/dmi.had.long.data")
    y, m, v = latest_month_from_wide(d, -9999.0)
    return {"value": round(v, 3), "month": f"{y}-{m:02d}", "phase": iod_phase(v), "prelim": True}


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


def parse_cma_typhoon():
    """中央气象台台风网实时台风: 年度活动列表 + 每个活动台风的最新定位/强度/BABJ官方预报。

    端点: list_{年} → 活动列表; view_{tfId} → 单台风全量路径点与预报。
    返回 JSONP(typhoon_jsons_xxx(...)), 需剥壳; 证书为自签链, 失败时降级为不校验(只读公开数据)。
    """
    def get(url):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://typhoon.nmc.cn/"})
        try:
            return urllib.request.urlopen(req, timeout=25).read().decode("utf-8", "ignore")
        except urllib.error.URLError as e:
            # 台风网证书为自签链, 证书失败时降级为不校验(只读公开数据)
            if isinstance(e.reason, ssl.SSLCertVerificationError):
                return urllib.request.urlopen(req, timeout=25, context=ssl._create_unverified_context()).read().decode("utf-8", "ignore")
            raise

    year = now_bj().year
    raw = get(f"https://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_{year}")
    m = re.search(r"\((.*)\)\s*$", raw, re.S)
    data = json.loads(m.group(1))
    active = [t for t in data["typhoonList"] if t[7] == "start"]
    result = {"year": year, "count": len(active), "list": []}
    for t in active[:TYPHOON_MAX]:
        tfid, en, cn, no = t[0], t[1], t[2], t[3]
        item = {"no": no, "en": en, "cn": cn}
        try:
            v = get(f"https://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_{tfid}")
            vm = re.search(r"\((.*)\)\s*$", v, re.S)
            pts = json.loads(vm.group(1))["typhoon"][8]      # 第9项=路径点数组
            last = pts[-1]                                   # 末点=最新观测
            item.update({
                "obs": last[1], "grade": last[3], "lon": last[4], "lat": last[5],
                "pressure": last[6], "wind": last[7],
                "gradeZh": GRADE_ZH.get(last[3], last[3]),
            })
            babj = (last[11] or {}).get("BABJ", [])          # 官方集合预报
            for lead in (24, 48, 72):
                fc = next((x for x in babj if x[0] == lead), None)
                if fc:
                    item[f"fc{lead}"] = {"lon": fc[2], "lat": fc[3], "wind": fc[5], "grade": fc[7], "gradeZh": GRADE_ZH.get(fc[7], fc[7])}
        except Exception as e:
            item["error"] = str(e)[:60]
        result["list"].append(item)
    return result


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


def load_history():
    """读回 data/history.js 中的 AUTO_HISTORY 数组(纯 JSON 载荷)。"""
    try:
        with open(HISTORY_PATH, encoding="utf-8") as f:
            js = f.read().split("=", 1)[1].strip().rstrip(";")
        return json.loads(js)
    except Exception:
        return []


def write_history(entries):
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        f.write(
            "// ============================================================\n"
            "// ⚡ 自动数据时间序列 — 由 fetch_official.py 每日追加, 前端画趋势\n"
            "// ============================================================\n"
            "const AUTO_HISTORY = " + json.dumps(entries, ensure_ascii=False) + ";\n"
        )
    return HISTORY_PATH


def main():
    sources = {
        "nao": {"label": "NOAA CPC NAO 日值", "url": "ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.nao.index.b500101.current.ascii"},
        "nino34": {"label": "CPC NINO3.4 周值", "url": "https://www.cpc.ncep.noaa.gov/data/indices/sstoi.indices"},
        "pdo": {"label": "NOAA NCEI PDO (ERSST v5)", "url": "https://www.ncei.noaa.gov/pub/data/cmb/ersst/v5/index/ersst.v5.pdo.dat"},
        "ao": {"label": "NOAA CPC AO 日值", "url": "ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.ao.index.b500101.current.ascii"},
        "iod": {"label": "NOAA PSL DMI (HadISST)", "url": "https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/dmi.had.long.data"},
        "midrange": {"label": "中央气象台《中期天气预报》快照", "url": "http://www.nmc.cn/publish/bulletin/mid-range.htm"},
        "typhoon": {"label": "中央气象台台风网 实时台风", "url": "https://typhoon.nmc.cn/"},
    }
    parsers = {
        "nao": parse_cpc_nao,
        "nino34": parse_cpc_nino34,
        "pdo": parse_ncei_pdo,
        "ao": parse_cpc_ao,
        "iod": parse_psl_iod,
        "midrange": parse_nmc_midrange,
        "typhoon": parse_cma_typhoon,
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

    # 时间序列累积: 成功取到 NAO/NINO3.4 才追加当日值
    fetched_at = now_bj()
    entries = load_history()
    today = fetched_at.strftime("%Y-%m-%d")
    nao_v = sources["nao"].get("value")
    nino_v = sources["nino34"].get("anom")
    if nao_v is not None and nino_v is not None:
        if entries and entries[-1].get("d") == today:
            entries[-1].update({"nao": nao_v, "nino": nino_v})
        else:
            entries.append({"d": today, "nao": nao_v, "nino": nino_v})
        del entries[:-HISTORY_MAX]
        hist_path = write_history(entries)
        print(f"  history: {len(entries)} 条 -> {hist_path}")

    out = write_auto_fetch(sources, fetched_at)
    print(f"[{fetched_at:%Y-%m-%d %H:%M}] auto-fetch done -> {out}")
    for key, s in sources.items():
        status = "OK" if s.get("ok") else f"FAIL({s.get('error','')})"
        print(f"  {key}: {status}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
