// ============================================================
// ⚡ 官方数据自动采集层 — 由 GitHub Actions 每日自动生成, 勿手改
// 生成时间: 2026-08-10 20:15 (+08:00)
// 数值来自官方源, 任一源失败 value=null; 前端 typeof AUTO_FETCH 守卫
// ============================================================
const AUTO_FETCH = {
  fetchedAt: "2026-08-10 20:15",
  sources: {
    nao: {"label": "NOAA CPC NAO 日值", "url": "ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.nao.index.b500101.current.ascii", "value": -1.277, "date": "2026-07-31"},
    nino34: {"label": "CPC NINO3.4 周值", "url": "https://www.cpc.ncep.noaa.gov/data/indices/sstoi.indices", "value": 29.33, "anom": 2.03, "month": "2026-07", "phase": "极强厄尔尼诺"},
    pdo: {"label": "NOAA NCEI PDO (ERSST v5)", "url": "https://www.ncei.noaa.gov/pub/data/cmb/ersst/v5/index/ersst.v5.pdo.dat", "value": -2.03, "month": "2026-07", "phase": "负相位"},
    ao: {"label": "NOAA CPC AO 日值", "url": "ftp://ftp.cpc.ncep.noaa.gov/cwlinks/norm.daily.ao.index.b500101.current.ascii", "value": -0.355, "date": "2026-07-31", "phase": "中性"},
    iod: {"label": "NOAA PSL DMI (HadISST)", "url": "https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/dmi.had.long.data", "value": 0.146, "month": "2026-05", "phase": "中性", "prelim": true},
    midrange: {"label": "中央气象台《中期天气预报》快照", "url": "http://www.nmc.cn/publish/bulletin/mid-range.htm", "snapshot": "data/midrange/midrange-2026-08-10.txt", "issued": "2026年08月10日10时"},
    typhoon: {"label": "中央气象台台风网 实时台风", "url": "https://typhoon.nmc.cn/", "year": 2026, "count": 3, "list": [{"no": "2616", "en": "PEILOU", "cn": "琵鹭", "obs": "202608100900", "grade": "TS", "lon": 151.6, "lat": 21.4, "pressure": 995, "wind": 20, "gradeZh": "热带风暴", "fc24": {"lon": 157.6, "lat": 25.9, "wind": 18, "grade": "TS", "gradeZh": "热带风暴"}}, {"no": "2615", "en": "CHAN-HOM", "cn": "灿鸿", "obs": "202608100900", "grade": "TS", "lon": 148.3, "lat": 35.1, "pressure": 998, "wind": 18, "gradeZh": "热带风暴", "fc24": {"lon": 141.1, "lat": 36.5, "wind": 20, "grade": "TS", "gradeZh": "热带风暴"}, "fc48": {"lon": 133.8, "lat": 36.2, "wind": 15, "grade": "TD", "gradeZh": "热带低压"}}, {"no": "2613", "en": "DOLPHIN", "cn": "白海豚", "obs": "202608101100", "grade": "TS", "lon": 117.7, "lat": 29, "pressure": 990, "wind": 20, "gradeZh": "热带风暴", "fc24": {"lon": 115.2833, "lat": 30.55, "wind": 15, "grade": "TD", "gradeZh": "热带低压"}}]}
  }
};
