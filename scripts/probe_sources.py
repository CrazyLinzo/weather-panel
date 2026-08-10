#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🖼️ 图源时效自动探测器
============================================================
由 GitHub Actions 每日定时运行(与 fetch_official.py 同一工作流)。
职责: 服务端探测天气图源当前有效URL → 生成 data/img-sources.js。
前端读到该文件后直接使用服务端命中URL(免浏览器逐个探测); 缺失/失败时前端回退原有探测。

覆盖(逻辑与 fieldsight.html 前端探测一致, 勿改规律):
  · NMC 降水预报图 / 土壤墒情 / 最高气温预报 的最新可用起报时次
  · WAW GEFS 运行ID (或整源失效标记)
  · 美国固定图集(US/CPC/SPC/USDM/GOES等) 可用状态

任一图源失败 → 对应项置 null / ok:false, 前端守卫降级。
"""
import urllib.request
import urllib.error
import ssl
import os
import json
from datetime import datetime, timedelta, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
IMG_SOURCES_PATH = os.path.join(DATA_DIR, "img-sources.js")
BJ = timezone(timedelta(hours=8))
UA = "Mozilla/5.0 (img-probe bot; +https://github.com/CrazyLinzo/weather-panel)"

# ---------- NMC 图 URL 模板(与 fieldsight.html 完全一致) ----------
# 降水预报: 起报时次为 UTC(1200/0600/0000), 日期按北京时
NMC_INIT_TIMES = ["1200", "0600", "0000"]
NMC_PRECIP_FFF = ["024", "048", "072", "096", "120", "144", "168"]

def nmc_precip_url(y, m, d, hhmm, fff):
    return f"https://image.nmc.cn/product/{y}/{m}/{d}/STFC/medium/SEVP_NMC_STFC_SFER_ER24_ACHN_L88_P9_{y}{m}{d}{hhmm}{fff}00.JPG"

# 土壤墒情: 逐日 0000UTC(北京时08时), 日期按 UTC
NMC_SOIL_CM = ["10", "20", "30", "40", "50"]

def nmc_soil_url(y, m, d, cm):
    return f"https://image.nmc.cn/product/{y}/{m}/{d}/AMSM/medium/SEVP_NMC_AMSM_CAGMSS_ESRH_ACHN_L{cm}CM_PS_{y}{m}{d}000000000.jpg"

# 最高气温预报: 起报时次为北京时(2000/0800), 日期按北京时
NMC_TEMPF_INITS = ["2000", "0800"]
NMC_TEMPF_FFF = ["024", "048", "072", "096", "120", "144", "168"]

def nmc_tempfc_url(y, m, d, hhmm, fff):
    return f"https://image.nmc.cn/product/{y}/{m}/{d}/RFFC/medium/SEVP_NMC_RFFC_SNWFD_ETM_ACHN_L88_P9_{y}{m}{d}{hhmm}{fff}12.jpg"

# ---------- WAW GEFS 运行ID(与 fieldsight-data.js WAW_CONFIG 一致) ----------
WAW_ANCHOR_ID = 3121
WAW_ANCHOR_DATE = datetime(2026, 7, 2, tzinfo=BJ)
WAW_PER_DAY = 4
WAW_MARGIN = 6
WAW_MAX_PROBE = 60

def waw_probe_url(tid):
    return f"https://www.worldagweather.com/fcstwx/pcp_gefs_day1_q50_us_{tid}.png"

# ---------- 美国固定图集(与 fieldsight-data.js usWeatherImages 一致) ----------
FIXED_IMAGES = [
    {"group": "卫星/雷达", "title": "GOES-East 真彩云图", "url": "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/CONUS/GEOCOLOR/1250x750.jpg"},
    {"group": "卫星/雷达", "title": "GOES-East 红外云图", "url": "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/CONUS/13/1250x750.jpg"},
    {"group": "卫星/雷达", "title": "全国雷达拼图", "url": "https://radar.weather.gov/ridge/standard/CONUS-LARGE_0.gif"},
    {"group": "WPC 降水", "title": "Day1 累计降水", "url": "https://www.wpc.ncep.noaa.gov/qpf/fill_94qwbg.gif"},
    {"group": "WPC 降水", "title": "Day2 累计降水", "url": "https://www.wpc.ncep.noaa.gov/qpf/fill_98qwbg.gif"},
    {"group": "WPC 降水", "title": "Day3 累计降水", "url": "https://www.wpc.ncep.noaa.gov/qpf/fill_99qwbg.gif"},
    {"group": "WPC 降水", "title": "7天累计降水", "url": "https://www.wpc.ncep.noaa.gov/qpf/p168i.gif"},
    {"group": "NDFD 温度", "title": "Day1 最高气温", "url": "https://graphical.weather.gov/images/conus/MaxT1_conus.png"},
    {"group": "NDFD 温度", "title": "Day1 最低气温", "url": "https://graphical.weather.gov/images/conus/MinT1_conus.png"},
    {"group": "NDFD 温度", "title": "Day3 最高气温", "url": "https://graphical.weather.gov/images/conus/MaxT3_conus.png"},
    {"group": "NDFD 温度", "title": "Day5 最高气温", "url": "https://graphical.weather.gov/images/conus/MaxT5_conus.png"},
    {"group": "SPC 强对流", "title": "Day1 强对流风险", "url": "https://www.spc.noaa.gov/products/outlook/day1otlk.png"},
    {"group": "SPC 强对流", "title": "Day2 强对流风险", "url": "https://www.spc.noaa.gov/products/outlook/day2otlk.png"},
    {"group": "SPC 强对流", "title": "Day3 强对流风险", "url": "https://www.spc.noaa.gov/products/outlook/day3otlk.png"},
    {"group": "SPC 强对流", "title": "Day1 龙卷概率", "url": "https://www.spc.noaa.gov/products/outlook/day1probotlk_torn.png"},
    {"group": "SPC 强对流", "title": "Day1 大风概率", "url": "https://www.spc.noaa.gov/products/outlook/day1probotlk_wind.png"},
    {"group": "SPC 强对流", "title": "Day1 冰雹概率", "url": "https://www.spc.noaa.gov/products/outlook/day1probotlk_hail.png"},
    {"group": "CPC 中期", "title": "6-10天温度概率", "url": "https://www.cpc.ncep.noaa.gov/products/predictions/610day/610temp.new.gif"},
    {"group": "CPC 中期", "title": "6-10天降水概率", "url": "https://www.cpc.ncep.noaa.gov/products/predictions/610day/610prcp.new.gif"},
    {"group": "CPC 中期", "title": "8-14天温度概率", "url": "https://www.cpc.ncep.noaa.gov/products/predictions/814day/814temp.new.gif"},
    {"group": "CPC 中期", "title": "8-14天降水概率", "url": "https://www.cpc.ncep.noaa.gov/products/predictions/814day/814prcp.new.gif"},
    {"group": "USDM", "title": "当前干旱监测图", "url": "https://droughtmonitor.unl.edu/data/png/current/current_usdm.png"},
    {"group": "WAW", "title": "GFS 降水距平(固定)", "url": "https://www.worldagweather.com/fcstwx/fcstpcp_anom_gfs_us.png"},
]


def probe(url, timeout=15):
    """HEAD/GET 探测 URL 是否可用(200)。返回 bool; SSL 证书问题降级为不校验(只读公开图)。"""
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status == 200
    except urllib.error.URLError as e:
        if isinstance(e.reason, ssl.SSLCertVerificationError):
            try:
                with urllib.request.urlopen(req, timeout=timeout, context=ssl._create_unverified_context()) as r:
                    return r.status == 200
            except Exception:
                return False
        return False
    except Exception:
        return False


def probe_nmc_precip(now_bj):
    """降水图: 北京时日期 off[0,1] × UTC init[1200,0600,0000], 探测024时效, 命中后铺全部7时效。"""
    for off in range(2):
        d = now_bj - timedelta(days=off)
        y, m, dd = f"{d.year}", f"{d.month:02d}", f"{d.day:02d}"
        for hhmm in NMC_INIT_TIMES:
            if probe(nmc_precip_url(y, m, dd, hhmm, "024")):
                return {"date": f"{y}-{m}-{dd}", "init": hhmm,
                        "urls": {f: nmc_precip_url(y, m, dd, hhmm, f) for f in NMC_PRECIP_FFF}}
    return None


def probe_nmc_soil(now_utc):
    """土壤墒情: UTC 日期 off[0,8], 0000UTC, 10cm 探测, 命中后铺5层。"""
    for off in range(9):
        d = now_utc - timedelta(days=off)
        y, m, dd = f"{d.year}", f"{d.month:02d}", f"{d.day:02d}"
        if probe(nmc_soil_url(y, m, dd, "10")):
            return {"date": f"{y}-{m}-{dd}",
                    "urls": {cm: nmc_soil_url(y, m, dd, cm) for cm in NMC_SOIL_CM}}
    return None


def probe_nmc_tempfc(now_bj):
    """最高气温: 北京时日期 off[0,1] × init[2000,0800], 探测024, 命中后铺全部7时效。"""
    for off in range(2):
        d = now_bj - timedelta(days=off)
        y, m, dd = f"{d.year}", f"{d.month:02d}", f"{d.day:02d}"
        for hhmm in NMC_TEMPF_INITS:
            if probe(nmc_tempfc_url(y, m, dd, hhmm, "024")):
                return {"date": f"{y}-{m}-{dd}", "init": hhmm,
                        "urls": {f: nmc_tempfc_url(y, m, dd, hhmm, f) for f in NMC_TEMPF_FFF}}
    return None


def probe_waw(today):
    """WAW GEFS 运行ID: 从估算上界向下探测, 返回 {ok, id|note}。"""
    days = (today - WAW_ANCHOR_DATE).days
    top = WAW_ANCHOR_ID + max(days, 0) * WAW_PER_DAY + WAW_MARGIN
    tried = 0
    for tid in range(top, top - WAW_MAX_PROBE, -1):
        tried += 1
        if probe(waw_probe_url(tid)):
            return {"ok": True, "id": tid}
    return {"ok": False, "note": f"WAW GEFS 图源失效: 自ID {top} 向下探测 {tried} 次全404(含锚点), 疑似URL模板变更或停更", "top": top}


def main():
    now_bj = datetime.now(BJ)
    now_utc = datetime.now(timezone.utc)
    out = {
        "probedAt": now_bj.strftime("%Y-%m-%d %H:%M"),
        "nmc": {
            "precip": probe_nmc_precip(now_bj),
            "soil": probe_nmc_soil(now_utc),
            "tempFc": probe_nmc_tempfc(now_bj),
        },
        "waw": probe_waw(now_bj),
        "fixed": {"checked": []},
    }
    ok = 0
    for item in FIXED_IMAGES:
        item_ok = probe(item["url"])
        ok += 1 if item_ok else 0
        out["fixed"]["checked"].append({**item, "ok": item_ok})
    out["fixed"].update({"total": len(FIXED_IMAGES), "ok": ok})

    os.makedirs(DATA_DIR, exist_ok=True)
    content = (
        "// ============================================================\n"
        "// 🖼️ 图源时效服务端探测 — 由 GitHub Actions 每日自动生成, 勿手改\n"
        "// 前端读到命中URL后直接使用, 跳过浏览器逐个探测; 缺失项前端回退原逻辑\n"
        f"// 探测时间: {out['probedAt']} (+08:00)\n"
        "// ============================================================\n"
        "const AUTO_IMG_SOURCES = " + json.dumps(out, ensure_ascii=False) + ";\n"
    )
    with open(IMG_SOURCES_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[{out['probedAt']}] img-sources done -> {IMG_SOURCES_PATH}")
    print(f"  nmc.precip: {out['nmc']['precip']['date'] if out['nmc']['precip'] else '未命中'}")
    print(f"  nmc.soil:   {out['nmc']['soil']['date'] if out['nmc']['soil'] else '未命中'}")
    print(f"  nmc.tempFc: {out['nmc']['tempFc']['date'] if out['nmc']['tempFc'] else '未命中'}")
    print(f"  waw: {'ok id=' + str(out['waw']['id']) if out['waw']['ok'] else out['waw']['note']}")
    print(f"  fixed: {out['fixed']['ok']}/{out['fixed']['total']} 可用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
