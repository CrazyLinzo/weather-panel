#!/usr/bin/env python3
"""拉取菏泽近37天全量气象 + Iowa 2022全年降水 → CSV"""
import urllib.request, ssl, json, csv
from datetime import datetime, timedelta

UA = "Mozilla/5.0"
ctx = ssl.create_default_context()
HIGH_TEMP = 35
DROUGHT = 1.0

# ============================================================
# 1. 菏泽 (35.23, 115.48) — 近37天全量气象数据
# ============================================================
print("=== [1/2] Heze 37 days ===")
today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
start = today - timedelta(days=37)

url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    f"latitude=35.23&longitude=115.48"
    f"&start_date={start.strftime('%Y-%m-%d')}&end_date={today.strftime('%Y-%m-%d')}"
    "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
)

req = urllib.request.Request(url, headers={"User-Agent": UA})
d = json.loads(urllib.request.urlopen(req, timeout=30, context=ctx).read())["daily"]

tmax = d["temperature_2m_max"]
tmin = d["temperature_2m_min"]
precip = d["precipitation_sum"]
dates = d["time"]
n = len(dates)

means = []
high_temp_days = 0
drought_streak = 0
cur_drought = 0
sum_precip = 0
max_t = -999
min_t = 999

for i in range(n):
    tx = tmax[i] if tmax[i] is not None else 0
    tn = tmin[i] if tmin[i] is not None else 0
    pr = precip[i] if precip[i] is not None else 0
    tm = (tx + tn) / 2
    means.append(tm)
    sum_precip += pr
    if tx > max_t: max_t = tx
    if tn < min_t: min_t = tn
    if tx > HIGH_TEMP: high_temp_days += 1
    if pr < DROUGHT:
        cur_drought += 1
        if cur_drought > drought_streak: drought_streak = cur_drought
    else:
        cur_drought = 0

avg_temp = sum(means) / n
rec_means = means[-7:]
rec_temp = sum(rec_means) / len(rec_means) if rec_means else 0
rec_precip = sum(p if p is not None else 0 for p in precip[-7:])

path1 = "菏泽_近37天天气数据.csv"
with open(path1, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["日期", "最高气温(°C)", "最低气温(°C)", "日均温(°C)", "降水量(mm)", "高温日(>35°C)", "干旱日(<1mm)"])
    for i in range(n):
        tx = tmax[i] if tmax[i] is not None else ""
        tn = tmin[i] if tmin[i] is not None else ""
        pr = precip[i] if precip[i] is not None else ""
        is_hot = "Y" if (tx != "" and tx > HIGH_TEMP) else ""
        is_dry = "Y" if (pr != "" and pr < DROUGHT) else ""
        w.writerow([dates[i], tx, tn, f"{means[i]:.1f}", pr, is_hot, is_dry])

    w.writerow([])
    w.writerow(["── 面板汇总指标 ──", "", "", "", "", "", ""])
    w.writerow(["37天平均气温(°C)", f"{avg_temp:.1f}"])
    w.writerow(["最高气温(°C)", f"{max_t:.1f}"])
    w.writerow(["最低气温(°C)", f"{min_t:.1f}"])
    w.writerow(["37天累计降水(mm)", f"{sum_precip:.1f}"])
    w.writerow(["高温日数(>35°C)", f"{high_temp_days} 天"])
    w.writerow(["最长连续干旱(<1mm)", f"{drought_streak} 天"])
    w.writerow(["近7天均温(°C)", f"{rec_temp:.1f}"])
    w.writerow(["近7天降水(mm)", f"{rec_precip:.1f}"])

print(f"  [OK] {n} days -> {path1}")
print(f"       avgT={avg_temp:.1f}C | precip={sum_precip:.1f}mm | hotDays={high_temp_days} | drought={drought_streak}d")

# ============================================================
# 2. Iowa (41.59, -93.62) — 2022年全年降水
# ============================================================
print()
print("=== [2/2] Iowa 2022 full year precip ===")

url2 = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=41.59&longitude=-93.62"
    "&start_date=2022-01-01&end_date=2022-12-31"
    "&daily=precipitation_sum&timezone=auto"
)
req2 = urllib.request.Request(url2, headers={"User-Agent": UA})
d2 = json.loads(urllib.request.urlopen(req2, timeout=30, context=ctx).read())["daily"]
precip2 = d2["precipitation_sum"]
dates2 = d2["time"]
total = 0

path2 = "Iowa_2022年全年降水.csv"
with open(path2, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["日期", "降水量(mm)"])
    for i in range(len(dates2)):
        pr = precip2[i] if precip2[i] is not None else 0
        total += pr
        w.writerow([dates2[i], pr])
    w.writerow([])
    w.writerow(["全年累计降水(mm)", f"{total:.1f}"])

print(f"  [OK] {len(dates2)} days -> {path2}")
print(f"       2022 total precip: {total:.1f} mm")
print()
print("=== Done ===")
