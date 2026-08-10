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
import re
from datetime import datetime, timedelta, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, "data")
IMG_SOURCES_PATH = os.path.join(DATA_DIR, "img-sources.js")
BJ = timezone(timedelta(hours=8))
UA = "Mozilla/5.0 (img-probe bot; +https://github.com/CrazyLinzo/weather-panel)"
# worldagweather 会拒绝非浏览器请求, imgnum 抓取使用浏览器 UA(同日报脚本)
UA_BROWSER = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
              "AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/120.0.0.0 Safari/537.36")

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

# ---------- WAW imgnum 动态图编号(2026-08-10 起 URL 模板已改, 弃用递增ID猜测) ----------
# worldagweather 所有预报图 URL 依赖每日递增的 imgnum, 经 /cgi-bin/ag/getimglabs.pl 获取:
#   返回 '|' 分隔的 9 字段: radar|trmm|unknown|pcp|uspcp|gfs|cmc|ecmwf|txn
# 本模块按日报脚本 generate_report.py 的 build_image_urls 重建"美国·预报图集"全部URL,
# 前端直接消费服务端拼好的 urls 映射, 不再浏览器逐个探测。
WA_BASE = "https://www.worldagweather.com"
WA_IMGNUM_URL = f"{WA_BASE}/cgi-bin/ag/getimglabs.pl"
WA_IMGNUM_KEYS = ["radar", "trmm", "unknown", "pcp", "uspcp", "gfs", "cmc", "ecmwf", "txn"]
NOAA_SPC_PAGE = "https://www.spc.noaa.gov/products/outlook/day1otlk.html"
NOAA_SPC_IMG = "https://www.spc.noaa.gov/products/outlook"
US_FLOOD_URL = "https://www.weather.gov/images/owp/FHO/National/National_FHO.png"
# 命中判定以其中3类代表性URL为探针(温度无q50; 距平; EC集合)
WAW_KEY_PROBES = [
    "us_temp_w1",
    "us_pcp_w1",
    "ec_pcp_w1",
]


def http_get(url, timeout=20):
    """GET 并返回 bytes; 带浏览器 UA(worldagweather 拒绝非浏览器)。SSL 证书问题降级不校验。"""
    req = urllib.request.Request(url, headers={"User-Agent": UA_BROWSER})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except urllib.error.URLError as e:
        if isinstance(e.reason, ssl.SSLCertVerificationError):
            with urllib.request.urlopen(req, timeout=timeout, context=ssl._create_unverified_context()) as r:
                return r.read()
        raise


def waw_build_us_urls(g, e, noaa_time):
    """与日报脚本 build_image_urls 的美国部分一致(键名对齐前端 WAW_CONFIG.items[].key)。"""
    return {
        "noaa_spc":    f"{NOAA_SPC_IMG}/day1otlk_{noaa_time}.png",
        "us_flood":    US_FLOOD_URL,
        "us_temp_w1":  f"{WA_BASE}/fcstwx/tmp_gefs_day7_us_{g}.png",
        "us_temp_w2":  f"{WA_BASE}/fcstwx/tmp_gefs_day8_us_{g}.png",
        "us_pcp_w1":   f"{WA_BASE}/fcstwx/pcp_gefs_day7_q50_us_{g}.png",
        "us_pcp_w2":   f"{WA_BASE}/fcstwx/pcp_gefs_day8_q50_us_{g}.png",
        "ec_pcp_w1":   f"{WA_BASE}/fcstwx/pcp_ens_day7_q50_us_{e}.png",
        "ec_pcp_w2":   f"{WA_BASE}/fcstwx/pcp_ens_day8_q50_us_{e}.png",
        "us_pcp_anom":    f"{WA_BASE}/fcstwx/pcp_gefs_anom_q50_us_{g}.png",
        "us_pcp_anom_ec": f"{WA_BASE}/fcstwx/pcp_ens_anom_q50_us_{e}.png",
        "us_pcp_w1ago": f"{WA_BASE}/fcstwx/pcp_gefs_day7_q50_us_{int(g) - 7}.png",
        "us_tmp_w1ago": f"{WA_BASE}/fcstwx/tmp_gefs_day7_us_{int(g) - 7}.png",
    }


def probe_waw(today):
    """通过 getimglabs.pl 取当日 imgnum(GFS/GEFS 共用 gfs 字段, EC 用 ecmwf 字段),
    解析 SPC 发布时次, 拼出美国图集全部 URL 并抽样验证。返回 {ok, gfs, ecmwf, noaaTime, probedAt, urls}。"""
    try:
        raw = http_get(WA_IMGNUM_URL).decode("utf-8", "ignore").strip()
        parts = raw.split("|")
        if len(parts) < len(WA_IMGNUM_KEYS):
            return {"ok": False, "note": f"getimglabs.pl 返回字段异常: {parts[:3]}"}
        imgnum = dict(zip(WA_IMGNUM_KEYS, parts))
        g, e = imgnum["gfs"], imgnum["ecmwf"]

        # SPC 发布时次: 从 Day1 页面解析 day1otlk_(\d{4})_prt.html
        noaa_time = None
        try:
            page = http_get(NOAA_SPC_PAGE).decode("utf-8", "ignore")
            m = re.search(r"day1otlk_(\d{4})_prt\.html", page)
            if m:
                noaa_time = m.group(1)
        except Exception:
            noaa_time = None

        urls = waw_build_us_urls(g, e, noaa_time or "1200")
        # 抽样验证 3 类代表性 URL(温度/降水/EC集合), 全中才判定可用
        bad = [k for k in WAW_KEY_PROBES if not probe(urls[k])]
        if bad:
            return {"ok": False, "note": f"imgnum 解析成功(gfs={g})但抽样URL失效: {bad}"}
        return {
            "ok": True,
            "gfs": g,
            "ecmwf": e,
            "noaaTime": noaa_time,
            "probedAt": today.strftime("%Y-%m-%d %H:%M"),
            "urls": urls,
        }
    except Exception as ex:
        return {"ok": False, "note": f"WAW imgnum 获取失败: {str(ex)[:120]}"}

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
    if out["waw"].get("ok"):
        print(f"  waw: ok gfs={out['waw']['gfs']} ecmwf={out['waw']['ecmwf']} spc={out['waw'].get('noaaTime')}Z 图集 {len(out['waw']['urls'])} 张")
    else:
        print(f"  waw: {out['waw']['note']}")
    print(f"  fixed: {out['fixed']['ok']}/{out['fixed']['total']} 可用")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
