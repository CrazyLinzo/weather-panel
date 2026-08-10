// ============================================================
// 静态数据层 — 由定时任务/人工定期刷新
// 最后更新: 2026-08-10 (数据来源见各板块)
// ============================================================
const STATIC_UPDATED = '2026-08-10';

// ---------- ENSO 总览【静态/人工维护 · 官方指数快照，来源核对: 2026-08-10】 ----------
// 数值均取自下方各项 sources 列出的固定权威来源；无法核实者标注"未核实"，不凭记忆/模型生成
// 2026-08-10 核对结果：★El Niño 已达"极强"阈值——
//   相对NINO3.4 周值(至8/2) +2.02°C(2016年2月以来首破+2.0)、90天SOI约−21.4、IOD周值(至8/2)+0.63°C(连续两周高于+0.4正阈值)；
//   BOM ACCESS-S 预测月值峰值约+3.5°C(11月, 超1902年11月+2.65纪录)、事件料延续至2027年初；
//   NOAA 讨论仍为 7/9 期(下次 8/13)、JMA PDO 末行仍为 2026-06、CPC NAO 末行仍为 2026-06。
const SOURCE_CHECKED = '2026-08-10';
const ensoOverview = [
  { value:'+2.02°C', label:'相对NINO3.4 (BOM 至8/2)',        status:'★十年来首破"极强"阈值(+2.0)' },
  { value:'−21.4',   label:'SOI 90天 (BOM 至8/2)',           status:'强负值 · 海气耦合完整' },
  { value:'+0.63',   label:'IOD 周值 (至8/2)',               status:'连续两周高于+0.4正阈值' },
  { value:'极强',    label:'预测峰值 (BOM/ACCESS-S)',        status:'11月或达+3.5°C·超1902年纪录' },
];

// ---------- 气候概览分析【静态/人工维护 · 仅气候指数，每项须有来源+日期，需定期核对】 ----------
// 范围: 仅 ENSO/PDO/NAO/IOD 等气候指数; 天气事件(台风/高温/霜冻)见"伍 特殊天气事件"章节
const alerts = [
  {
    level:'danger', title:'🌊 ENSO 厄尔尼诺(El Niño)已确立并持续增强',
    observed:'★El Niño 已达"极强"阈值：BOM 相对 NINO3.4 周值(至8/2)升至 +2.02°C，为2016年2月以来首次突破 +2.0°C；90天 SOI 约 −21.4(持续低于−7为ENSO特征)，信风反转或偏弱、国际日期变更线附近对流增强而海洋性大陆受抑，海气耦合完整。NOAA(7/9讨论，未更新)周值 NINO3.4 +1.2°C、NINO1+2 +2.7°C、NINO4 +0.5°C，赤道次表层因下沉 Kelvin 波增暖。',
    outlook:'BOM ACCESS-S 模式预测月值峰值约 +3.5°C(11月)，将超越1902年11月 +2.65°C 的历史纪录；WMO/NOAA 等国际模式一致预期季节平均 SST 距平超 +2.9°C，事件料延续至2027年初。NOAA(7/9)：97% 概率维持到2027年初春，10-12月 81% 概率达强/极强。下次 NOAA 讨论 2026-08-13。',
    implication:'若"极强" El Niño 兑现，历史上*倾向于*东南亚/澳洲偏干、南美偏湿，对棕榈油、澳麦、南美大豆/玉米有潜在供给扰动；与正 IOD 叠加时区域风险放大(WMO 提示8-10月两者叠加影响全球气候)。BOM 同时提醒：NINO3.4 的强信号不必然等于对澳洲气候的强影响。条件性推断。',
    cadence:'每周指数更新 · 每月官方讨论', obsPeriod:'BOM周值至 2026-08-02 / NOAA讨论 2026-07-09', updated:'BOM 周值至8/2（媒体8/5确认）；NOAA 2026-07-09', checked:'2026-08-10',
    sources:[{l:'NOAA CPC ENSO讨论',u:'https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml'},{l:'NOAA CPC 指数',u:'https://www.cpc.ncep.noaa.gov/data/indices/'},{l:'BOM ENSO',u:'http://www.bom.gov.au/climate/enso/'}]
  },
  {
    level:'warn', title:'🌊 PDO 太平洋年代际振荡：负相位延续',
    observed:'JMA 月度 PDO 指数 2026年6月 −0.94（最新可得），较5月 −0.79 更负；2025年7月曾探底 −3.23。自2020年以来负相位主导。',
    outlook:'PDO 为月度指数、无逐日实时值；当前趋势维持负相位。注：NOAA PSL 的 PDO 序列目前仅更新至 2025年8月，故此处采用 JMA 月度官方值。',
    implication:'负 PDO *可能*增强冬季经向环流与西伯利亚高压，与 El Niño 叠加时冬季环流形势复杂。属长期背景因子，条件性推断。',
    cadence:'月度官方更新', obsPeriod:'月值 2026-06（最新可得）', updated:'JMA 2026-06 值', checked:'2026-08-10',
    sources:[{l:'JMA 月度PDO',u:'https://ds.data.jma.go.jp/tcc/tcc/products/elnino/decadal/pdo_month.html'}]
  },
  {
    level:'info', title:'🌀 NAO 北大西洋涛动：★7月转为弱负相位',
    observed:'NOAA CPC 月度 NAO 已发布 <b>2026年7月 −0.31</b>（本次核对新增）。回溯序列：3月 +2.69（春季高值）、4月 +1.39、5月 −0.74、6月 +0.10、7月 −0.31。即春季强正相位消退后，6月短暂回到近中性，7月再度转负。',
    outlook:'月度指数，8月值预计9月初发布。当前为弱负相位，绝对值不大（|NAO|<0.5），信号强度仍属偏弱一档，不宜过度解读单月波动。',
    implication:'负 NAO *倾向于*使北大西洋急流南压、欧洲西北部偏干而地中海-黑海一带降水机会增多。在欧盟已下调26/27谷物总产（−9.4%）的背景下，这一项属于需要跟踪但尚不足以独立支撑判断的边际因素。条件性推断。',
    cadence:'月度更新', obsPeriod:'月值 2026-07（本次新发布）', updated:'NOAA CPC 2026-07 值（8/10核对新增）', checked:'2026-08-10',
    sources:[{l:'NOAA CPC NAO',u:'https://www.cpc.ncep.noaa.gov/products/precip/CWlink/pna/nao.shtml'}]
  },
  {
    level:'warn', title:'🌏 IOD 印度洋偶极子：连续两周高于正阈值，事件趋向确立',
    observed:'周度 IOD 指数(至8/2) +0.63°C，已连续两周高于正 IOD 阈值(+0.4°C)。BOM 口径需"持续"高于阈值方算事件成立，官方现仍表述为中性/发展期；WMO 预测 ASO(8-10月)季节均值约 +0.6°C，正 IOD 事件或于南半球冬季正式确立。',
    outlook:'WMO(8月)：正 IOD 将于 8-10 月间确立，季节均值约 +0.6°C；BOM 强调需连续 7-8 周高于阈值方可正式判定事件成立。模式普遍预期南半球冬季-春季维持正相位，强度与持续期仍有分歧。',
    implication:'正 IOD 与极强 El Niño 叠加，历史上*倾向于*加剧东南亚/澳洲干旱、推升棕榈油与澳麦上行风险；WMO 提示两者8-10月叠加影响全球气候。事件尚未正式确立，条件性推断，建议继续观察周值能否维持。',
    cadence:'每两周更新', obsPeriod:'至 2026-08-02', updated:'BOM/Skymet 周值 2026-08-02', checked:'2026-08-10',
    sources:[{l:'BOM IOD',u:'https://www.bom.gov.au/climate/iod/'}]
  },
];

// ---------- 海洋指数【静态/人工维护 · ENSO/PDO/NAO/IOD, 每项标观测期与来源, 核对 2026-08-10】 ----------
const oceanIndices = [
  {
    name:'🌊 ENSO 厄尔尼诺-南方涛动', borderColor:'#ef4444',
    metrics:[{v:'+2.02°C',l:'相对NINO3.4(BOM 至8/2)',c:'hi-temp'},{v:'极强 El Niño',l:'当前相位',c:'hi-temp'},{v:'−21.4',l:'SOI 90天(至8/2)',c:'hi-temp'},{v:'+1.2°C',l:'NINO3.4(NOAA 7/9期)'}],
    risks:[{label:'高风险',cls:'risk-high'},{label:'极强·加速增强',cls:'risk-severe'}],
    dir:'★十年来首破"极强"阈值(+1.94→+2.02, 2016年2月来首次)',
    detail:'官方 El Niño Advisory。BOM 周值(至8/2):相对NINO3.4 +2.02°C、90天SOI约−21.4,信风反转/偏弱、日界线对流增强,为2016年2月以来首次突破+2.0°C"极强"阈值。BOM ACCESS-S 预测月值峰值约+3.5°C(11月),将超1902年11月+2.65°C纪录;WMO/NOAA 一致预期季节平均SST距平超+2.9°C、事件延续至2027年初。NOAA(7/9,未更新):NINO1+2 +2.7°C、NINO4 +0.5°C、次表层增暖(下沉Kelvin波),97%持续至27初春。',
    cadence:'每周指数 / 每月讨论', obsPeriod:'BOM周值至8/2 · NOAA讨论7/9', checked:'2026-08-10',
    sources:[{l:'BOM(周值至8/2)',u:'http://www.bom.gov.au/climate/enso/'},{l:'Weatherzone 极强阈值确认(8/5)',u:'https://www.weatherzone.com.au/news/very-strong-el-nino-threshold-reached-for-first-time-in-over-10-years/1891487'},{l:'NOAA CPC 指数',u:'https://www.cpc.ncep.noaa.gov/data/indices/'}]
  },
  {
    name:'🌊 PDO 太平洋年代际振荡', borderColor:'#f59e0b',
    metrics:[{v:'负相位',l:'当前相位'},{v:'−0.94',l:'2026年6月(JMA)',c:'hi-temp'},{v:'−0.79',l:'2026年5月'},{v:'−3.23',l:'2025年7月极值'}],
    risks:[{label:'中风险',cls:'risk-mid'},{label:'长期影响',cls:'risk-high'}],
    dir:'6月(−0.94)较5月(−0.79)更负',
    detail:'JMA 月度指数；负相位自2020年延续，负PDO通常增强西伯利亚高压、影响北太平洋风暴路径。(NOAA PSL 序列现止于2025-08，故采用 JMA 月度值)',
    cadence:'月度官方更新', obsPeriod:'月值 2026-06（最新可得）', checked:'2026-08-10',
    sources:[{l:'JMA 月度PDO',u:'https://ds.data.jma.go.jp/tcc/tcc/products/elnino/decadal/pdo_month.html'}]
  },
  {
    name:'🌀 NAO 北大西洋涛动', borderColor:'#8b5cf6',
    metrics:[{v:'弱负',l:'当前相位'},{v:'−0.31',l:'2026年7月(新)',c:'hi-temp'},{v:'+0.10',l:'2026年6月'},{v:'+2.69',l:'3月春季峰值'}],
    risks:[{label:'当前低风险',cls:'risk-low'},{label:'季节性',cls:'risk-mid'}],
    dir:'★6月+0.10 → 7月−0.31，转弱负',
    detail:'NOAA CPC 月度指数；7月值 −0.31 为本次核对新发布。3月强正(+2.69)后逐月回落，6月近中性、7月转负但绝对值仍小(<0.5)，属弱信号。负NAO倾向使北大西洋急流南压、欧洲西北偏干而地中海-黑海降水机会增多，对欧洲/黑海麦区为边际因素。',
    cadence:'月度更新', obsPeriod:'月值 2026-07（本次新发布）', checked:'2026-08-10',
    sources:[{l:'NOAA CPC NAO',u:'https://www.cpc.ncep.noaa.gov/products/precip/CWlink/pna/nao.shtml'}]
  },
  {
    name:'🌏 IOD 印度洋偶极子', borderColor:'#10b981',
    metrics:[{v:'发展期',l:'官方表述(事件未立)'},{v:'+0.63',l:'DMI (至8/2)',c:'hi-temp'},{v:'+0.4',l:'正IOD阈值(连续两周高于)'},{v:'7-8周',l:'事件成立需持续'}],
    risks:[{label:'趋向确立',cls:'risk-mid'},{label:'与EN叠加风险',cls:'risk-high'}],
    dir:'★连续两周高于阈值(+0.44→+0.63)，事件趋向确立',
    detail:'周值 +0.63(至8/2),已连续两周高于正IOD阈值(+0.4)。BOM口径需"持续"(7-8周)高于阈值方可判定事件成立,官方现表述为中性/发展期;WMO 预测正IOD将于ASO(8-10月)确立、季节均值约+0.6°C。模式普遍预期南半球冬季-春季维持正相位。正IOD+极强El Niño→东南亚/澳洲干旱潜在加剧,棕榈油/澳麦为潜在上行风险。',
    cadence:'每两周更新', obsPeriod:'至 2026-08-02', checked:'2026-08-10',
    sources:[{l:'BOM IOD',u:'https://www.bom.gov.au/climate/iod/'},{l:'Skymet 8/8 更新',u:'https://www.skymetweather.com/content/la-nina/el-nino-update-for-august-08-anomalies-breaking-the-scale-taking-canonical-shape'},{l:'WMO GSCU-ASO2026',u:'https://wmo.int/resources/publication-series/global-seasonal-climate-update/gscu-aso2026'}]
  },
];

// ============================================================
// 美国天气图集 — 全部 NOAA/官方稳定外链，无运行ID，免维护
// 【图源自动/近实时】图片由官方每日/近实时更新，前端直接引用固定URL，非静态文字，勿改URL逻辑
// ============================================================
const usWeatherImages = [
  { group:'🛰️ 实时卫星与雷达 (GOES / NWS)', source:'NOAA STAR GOES-East · NWS RIDGE · 近实时（约5-15分钟刷新）',
    images:[
      { title:'GOES-East 真彩云图 (CONUS)', url:'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/CONUS/GEOCOLOR/1250x750.jpg', note:'GOES-19 GeoColor 全美近实时真彩合成（约5分钟一帧），白天识别云系最直观' },
      { title:'GOES-East 红外云图 (CONUS)', url:'https://cdn.star.nesdis.noaa.gov/GOES19/ABI/CONUS/13/1250x750.jpg', note:'Band 13 洁净红外，昼夜可用，云顶越白代表对流越强' },
      { title:'全美雷达反射率拼图', url:'https://radar.weather.gov/ridge/standard/CONUS-LARGE_0.gif', note:'NWS RIDGE 全国雷达拼图，近实时降水回波（加载失败可点下方原图链接）' },
    ]
  },
  { group:'🌧️ 美国降水预报 (WPC QPF)', source:'NOAA Weather Prediction Center · 每日自动更新',
    images:[
      { title:'Day 1 累计降水', url:'https://www.wpc.ncep.noaa.gov/qpf/fill_94qwbg.gif', note:'未来24小时定量降水预报（彩色填充）' },
      { title:'Day 2 累计降水', url:'https://www.wpc.ncep.noaa.gov/qpf/fill_98qwbg.gif', note:'第2个24小时定量降水预报（彩色填充）' },
      { title:'Day 3 累计降水', url:'https://www.wpc.ncep.noaa.gov/qpf/fill_99qwbg.gif', note:'第3个24小时定量降水预报（彩色填充）' },
      { title:'7天累计降水', url:'https://www.wpc.ncep.noaa.gov/qpf/p168i.gif', note:'未来7天累计降水总量，玉米带墒情核心参考' },
    ]
  },
  { group:'🌡️ 美国温度预报 (NWS NDFD)', source:'National Weather Service · 每日自动更新',
    images:[
      { title:'Day 1 最高气温', url:'https://graphical.weather.gov/images/conus/MaxT1_conus.png', note:'全美最高气温格点预报' },
      { title:'Day 1 最低气温', url:'https://graphical.weather.gov/images/conus/MinT1_conus.png', note:'全美最低气温格点预报' },
      { title:'Day 3 最高气温', url:'https://graphical.weather.gov/images/conus/MaxT3_conus.png', note:'第3天最高气温' },
      { title:'Day 5 最高气温', url:'https://graphical.weather.gov/images/conus/MaxT5_conus.png', note:'第5天最高气温' },
    ]
  },
  { group:'⛈️ 美国强对流天气展望 (SPC)', source:'NOAA Storm Prediction Center · 每日自动更新',
    images:[
      { title:'Day 1 强对流风险', url:'https://www.spc.noaa.gov/products/outlook/day1otlk.png', note:'绿=雷暴/黄=轻微/橙=增强/红=中度/紫=高风险' },
      { title:'Day 2 强对流风险', url:'https://www.spc.noaa.gov/products/outlook/day2otlk.png', note:'未来第2天展望' },
      { title:'Day 3 强对流风险', url:'https://www.spc.noaa.gov/products/outlook/day3otlk.png', note:'未来第3天展望' },
      { title:'Day 1 龙卷概率', url:'https://www.spc.noaa.gov/products/outlook/day1probotlk_torn.png', note:'龙卷风发生概率 (%)' },
      { title:'Day 1 大风概率', url:'https://www.spc.noaa.gov/products/outlook/day1probotlk_wind.png', note:'灾害性大风概率 (%)' },
      { title:'Day 1 冰雹概率', url:'https://www.spc.noaa.gov/products/outlook/day1probotlk_hail.png', note:'大冰雹概率 (%)，收获期棉花/玉米重点关注' },
    ]
  },
  { group:'📅 美国中期展望 (CPC)', source:'NOAA Climate Prediction Center · 每日自动更新',
    images:[
      { title:'6-10天温度概率', url:'https://www.cpc.ncep.noaa.gov/products/predictions/610day/610temp.new.gif', note:'橙红=偏暖概率/蓝=偏冷概率' },
      { title:'6-10天降水概率', url:'https://www.cpc.ncep.noaa.gov/products/predictions/610day/610prcp.new.gif', note:'绿=偏湿概率/棕=偏干概率' },
      { title:'8-14天温度概率', url:'https://www.cpc.ncep.noaa.gov/products/predictions/814day/814temp.new.gif', note:'授粉期温度趋势前瞻' },
      { title:'8-14天降水概率', url:'https://www.cpc.ncep.noaa.gov/products/predictions/814day/814prcp.new.gif', note:'授粉期降水趋势前瞻' },
    ]
  },
  { group:'🏜️ 美国干旱监测 (USDM)', source:'US Drought Monitor · 每周四更新',
    images:[
      { title:'当前干旱监测图', url:'https://droughtmonitor.unl.edu/data/png/current/current_usdm.png', note:'D0异常干燥 → D4极端干旱，农业干旱定级权威图' },
    ]
  },
];

// ============================================================
// World Ag Weather — 美国预报图集 (imgnum 动态编号, 2026-08-10 重写)
// URL 依赖每日递增的 imgnum, 由服务端 probe_sources.py 每日解析
// getimglabs.pl + NOAA SPC 发布时次后, 生成 data/img-sources.js 的
// AUTO_IMG_SOURCES.waw.urls 完整映射; 前端直接消费, 不再浏览器探测。
// 图集结构对齐日报脚本 generate_report.py 的"美国天气"部分。
// ============================================================
const WAW_CONFIG = {
  groups: [
    { group:'⚡ NOAA SPC 强对流 & 洪水风险', source:'World Ag Weather · 服务端每日探测',
      items:[
        { key:'noaa_spc', title:'Day1 对流天气展望', note:'SPC 发布时次由服务端解析(见图块标题)' },
        { key:'us_flood', title:'National Flood Hazard Outlook', note:'weather.gov 全美洪水风险展望' },
      ]
    },
    { group:'🌡️ 美国气温距平 (GEFS 集合)', source:'World Ag Weather · 服务端每日探测',
      items:[
        { key:'us_temp_w1', title:'第1周气温距平', note:'GEFS 集合预报 · 未来7天' },
        { key:'us_temp_w2', title:'第2周气温距平', note:'GEFS 集合预报 · 未来8-14天' },
      ]
    },
    { group:'🌧️ 美国降水预报 (GEFS 集合 Q50)', source:'World Ag Weather · 服务端每日探测',
      items:[
        { key:'us_pcp_w1', title:'GEFS 第1周降水', note:'集合中位数(Q50) · 未来7天' },
        { key:'us_pcp_w2', title:'GEFS 第2周降水', note:'集合中位数(Q50) · 未来8-14天' },
      ]
    },
    { group:'🌧️ 美国降水预报 (EC 集合 Q50)', source:'World Ag Weather · 服务端每日探测',
      items:[
        { key:'ec_pcp_w1', title:'EC 第1周降水', note:'欧洲中心集合中位数(Q50) · 未来7天' },
        { key:'ec_pcp_w2', title:'EC 第2周降水', note:'欧洲中心集合中位数(Q50) · 未来8-14天' },
      ]
    },
    { group:'📡 GEFS 一周前预报', source:'World Ag Weather · 服务端每日探测',
      items:[
        { key:'us_pcp_w1ago', title:'一周前降水预报 (GEFS Q50)', note:'当周 imgnum-7, 与实际对照检验' },
        { key:'us_tmp_w1ago', title:'一周前气温预报 (GEFS)', note:'当周 imgnum-7, 与实际对照检验' },
      ]
    },
    { group:'📊 美国降雨距平', source:'World Ag Weather · 服务端每日探测',
      items:[
        { key:'us_pcp_anom', title:'GEFS 15天降雨距平 (Q50)', note:'红=偏干 / 蓝=偏湿' },
        { key:'us_pcp_anom_ec', title:'EC 15天降雨距平 (Q50)', note:'红=偏干 / 蓝=偏湿' },
      ]
    },
  ]
};

// ---------- 生育期日历【静态/人工维护 · 发育阶段与风险为人工评估；表内"实时气象"列由前端按代表站Open-Meteo数据自动填充】 ----------
// ⚠️ 2026-08-10 重构（对齐原仓库）：
//   本表每一行的"当前生长阶段"改为<b>必须有外部权威来源</b>，并在行内记录来源、发布日与核实状态：
//     src / srcUrl / srcDate = 该行阶段判断的出处；verified:true = 已逐站核实到官方原始统计；
//     verified:false = 官方未发布对应逐站物候，阶段为常规农学判断，已在 season 中标注"未逐站核实"。
//   中国各行来源：中央气象台《全国农业气象周报》(2026-08-10发布，统计周2026-08-02至08-08，
//     预报李轩/签发郑昌玲) 附表2春玉米、附表3夏玉米、附表4大豆、附表5棉花 的逐省测站发育期统计。
//   美国各行来源：USDA Crop Progress 原始件(截至2026-08-02，8/3发布)，Good+Excellent 由本站自行相加。
//   "核心风险"列 = 官方来源的实况/预报 + 本站气象分析的结合，不得凭空推断阶段。
//   下期更新：NMC周报每周一发布、USDA Crop Progress 8/10发布(数据截至8/9)。
const CALENDAR_SOURCES = [
  { l:'中央气象台《全国农业气象周报》(2026-08-10发布 · 周期8/2-8/8 · 附表2-5逐省测站发育期统计)', u:'http://www.nmc.cn/publish/agro/ten-week/index.html' },
  { l:'中央气象台《作物发育期监测》(大豆/玉米/棉花发育期分布图)', u:'http://www.nmc.cn/publish/agro/information/soybean.html' },
  { l:'USDA Crop Progress 原始件(2026-08-03发布 · 数据截至8/2)', u:'https://esmis.nal.usda.gov/publication/crop-progress' },
  { l:'中央气象台《中期天气预报》(未来10-14天量化落区)', u:'http://www.nmc.cn/publish/bulletin/mid-range.htm' },
  { l:'中央气象台《农业干旱综合监测》', u:'http://www.nmc.cn/publish/agro/disastersmonitoring/Agricultural_Drought_Monitoring.htm' },
  { l:'BOM 气候驱动因子更新(ENSO/IOD)', u:'http://www.bom.gov.au/climate/enso/' },
  { l:'CONAB 巴西作物调查(咖啡采收进度，本行待逐期核实)', u:'https://www.conab.gov.br/info-agro/safras' },
  { l:'MPOB 马来西亚棕榈油局(产量与库存月报，本行待逐期核实)', u:'https://bepi.mpob.gov.my/' },
  { l:'ABARES 澳大利亚农作物报告(澳麦，本行待逐期核实)', u:'https://www.agriculture.gov.au/abares/research-topics/agricultural-outlook/australian-crop-report' },
];
const cropCalendar = [
  { crop:'🌴 棕榈油', region:'马来西亚/印尼', season:'全年抽穗结果（未逐站核实）', sensitive:'果实膨大/授粉', risk:'厄尔尼诺干旱→果粒变小、含油率下降（滞后6-12个月显现）。本行阶段为常规农学判断，MPOB 只发布产量/库存月报、不发布物候周报', enso:'EN已确立(BOM 至8/2 相对NINO3.4 +2.02 达极强)+IOD连续两周高于正阈值(+0.63)→东南亚干旱风险组合最强',
    src:'MPOB 月报（无物候周报）', srcUrl:'https://bepi.mpob.gov.my/', srcDate:'—', verified:false },
  { crop:'🧵 棉花', region:'中国新疆', season:'<b>开花盛期</b>（29站中14站，另1站已裂铃）', sensitive:'高温与灌溉水源', risk:'NMC周报：本周新疆等地出现3-6天日最高气温≥35℃，"持续高温影响…棉花花铃生长"。本站补充：新疆以灌溉农业为主，天然降水权重低，约束在灌溉保障与极端高温逼熟', enso:'北半球夏季偏暖；印度季风受EN压制为外部比价因素',
    src:'NMC农业气象周报 附表5', srcUrl:'http://www.nmc.cn/publish/agro/ten-week/index.html', srcDate:'2026-08-10发布（周期8/2-8/8）', verified:true },
  { crop:'🌽 玉米', region:'中国东北(春玉米)', season:'<b>吐丝期</b>（内蒙17/17、吉林11/19、黑龙江8/22、辽宁9/19站）', sensitive:'吐丝授粉期水分与日照', risk:'NMC周报：东北大部气温偏高、日照正常偏多、墒情适宜，"总体利于春玉米…生长发育和产量形成"；但黑龙江西南部、吉林西北部降水50-100毫米、局地超100毫米，降水日数5-6天，"部分农田土壤过湿加重，影响春玉米开花吐丝"。本站补充：未来10天东北中南部再有70-180毫米、12-16日南部大到暴雨，涝渍与倒伏为主要下行风险', enso:'东北积温正常偏有利',
    src:'NMC农业气象周报 附表2 + 正文1.2', srcUrl:'http://www.nmc.cn/publish/agro/ten-week/index.html', srcDate:'2026-08-10发布（周期8/2-8/8）', verified:true },
  { crop:'🌽 玉米', region:'黄淮海(夏玉米)', season:'<b>吐丝期为主</b>（河南21/23站吐丝、山东5/11、江苏3/5、安徽2/2；河北偏晚，16站中拔节5、吐丝3）', sensitive:'抽雄吐丝期高温与寡照', risk:'NMC周报：华北东部、黄淮东部本周出现3-6天日最高气温≥35℃，"持续高温影响玉米抽雄开花"；陕西大部、山西西南部、河南西部累计降水50-250毫米、日照偏少3-8成，"部分农田土壤持续过湿，对玉米开花吐丝…不利"。本站补充：中期公报指12-16日黄淮华北再遇大到暴雨、局地特大暴雨，与吐丝授粉窗口重合，倒伏与授粉不良风险高', enso:'黄淮盛夏偏热风险',
    src:'NMC农业气象周报 附表3 + 正文1.2', srcUrl:'http://www.nmc.cn/publish/agro/ten-week/index.html', srcDate:'2026-08-10发布（周期8/2-8/8）', verified:true },
  { crop:'🌽 玉米', region:'美国玉米带', season:'乳熟43%、凹陷6%（截至8/2，均快于5年均值38%/5%）', sensitive:'灌浆定粒期水分与高温', risk:'USDA：优良率61%(8/2)创季内新低、低于去年73%；48州表层墒情短缺48%未改善。本站补充：授粉已收尾，粒重由8月水分与灌浆期温度共同决定；饲牛/活牛8/6重挫后8/7已收复部分，饲用需求担忧暂缓', enso:'CPC最新一期(8/9发布)偏热区收窄至西北与南部两端，玉米带退出核心区，天气端上行风险弱于一周前',
    src:'USDA Crop Progress', srcUrl:'https://esmis.nal.usda.gov/publication/crop-progress', srcDate:'2026-08-03发布（数据截至8/2）', verified:true },
  { crop:'🫘 大豆', region:'中国东北', season:'<b>结荚期</b>（黑龙江11/25、吉林4/6、内蒙3/4站；黄淮的河南/安徽/江苏仍为开花期）', sensitive:'结荚鼓粒期水分与日照', risk:'NMC周报：黑龙江西南部、吉林西北部降水50-100毫米、局地超100毫米，降水日数5-6天，"部分农田土壤过湿加重，影响…大豆开花结荚"；陕西大部、山西西南部、河南西部日照偏少3-8成，"对…大豆开花结荚不利"。本站补充：大豆较玉米更忌涝，未来10天东北中南部再迎70-180毫米，需重点看低洼地块排水与连续寡照天数', enso:'关注8月水分分布而非总量',
    src:'NMC农业气象周报 附表4 + 正文1.2', srcUrl:'http://www.nmc.cn/publish/agro/ten-week/index.html', srcDate:'2026-08-10发布（周期8/2-8/8）', verified:true },
  { crop:'🫘 大豆', region:'美国中西部', season:'结荚62%（截至8/2，快于5年均值55%）', sensitive:'鼓粒期温度与水分', risk:'USDA：优良率63%(8/2)持平前周、未随玉米下滑。本站补充：<b>8/10下调风险</b>——CPC最新一期(8/9发布)已将偏热区收窄至西北与南部两端，中西部退出核心区，此前"偏热窗口覆盖鼓粒期"的判断权重下调；今晚评级为下一验证点', enso:'中国新作累计采购278万吨、承诺2500万吨提供需求支撑；巴西出口纪录1.154亿吨压制',
    src:'USDA Crop Progress', srcUrl:'https://esmis.nal.usda.gov/publication/crop-progress', srcDate:'2026-08-03发布（数据截至8/2）', verified:true },
  { crop:'🌾 小麦', region:'中国黄淮海', season:'已收获（夏播作物接茬）', sensitive:'—', risk:'收获完毕，腾茬夏播；当前该区域农业气象关注点已转移至夏玉米吐丝期(见上行)', enso:'新麦上市，关注质量',
    src:'NMC农业气象周报（本周期无冬麦物候表，属正常）', srcUrl:'http://www.nmc.cn/publish/agro/ten-week/index.html', srcDate:'2026-08-10发布', verified:true },
  { crop:'🌾 小麦', region:'美国春麦', season:'收获5%（截至8/2，慢于5年均值8%）', sensitive:'收获期降水与旱区分布', risk:'USDA：优良率55%(8/2)较前周回升2点且高于去年48%；但干旱面积口径(7/28)仍达42%。本站补充：两口径背离时应以评级与收获进度为准，干旱面积仅作背景', enso:'—',
    src:'USDA Crop Progress', srcUrl:'https://esmis.nal.usda.gov/publication/crop-progress', srcDate:'2026-08-03发布（数据截至8/2）', verified:true },
  { crop:'🌾 小麦', region:'澳大利亚', season:'冬麦营养生长-分蘖期（未逐站核实）', sensitive:'冬春降水', risk:'本行阶段为南半球冬麦常规农学判断，ABARES 作物报告为季度发布、当前无最新逐期物候。可核实事实：美国驻澳农业参赞已上调澳麦26/27产量至3100万吨(较十年均值高10%)', enso:'BOM已上修EN峰值"11月或达+3.5°C·超1902年纪录"，澳麦下半程干旱风险不宜提前解除',
    src:'ABARES 作物报告（季度）', srcUrl:'https://www.agriculture.gov.au/abares/research-topics/agricultural-outlook/australian-crop-report', srcDate:'待下期', verified:false },
  { crop:'🌾 小麦', region:'黑海(俄/乌)', season:'收获推进期（未逐站核实）', sensitive:'收获与出口物流', risk:'风险主体已由天气转为战争：俄乌互袭港口、粮食码头与船只，黑海部分码头限制接粮；Rusagrotrans 下调俄罗斯7月小麦出口至190万吨、8月预估300-350万吨。本行物候无公开逐期统计，以出口与物流指标替代跟踪', enso:'间接影响较弱；NAO 7月转弱负(−0.31)倾向地中海-黑海降水增多，为边际因素',
    src:'Rusagrotrans / 市场机构（无官方物候周报）', srcUrl:'http://www.nmc.cn/publish/bulletin/abroadweather.html', srcDate:'—', verified:false },
  { crop:'☕ 咖啡', region:'巴西米纳斯', season:'采收期后段(5-9月)（未逐站核实）', sensitive:'霜冻窗口 / 9-10月开花期降水', risk:'本行阶段为常规农学判断；CONAB 采收进度为不定期发布，本站尚未取得最新一期。当前可核实的仅为价格与季节窗口：7-8月南部霜冻窗口仍开、近期预报无重大霜冻', enso:'EN或令9-10月(下季)开花期偏干，为中期支撑',
    src:'CONAB 作物调查', srcUrl:'https://www.conab.gov.br/info-agro/safras', srcDate:'待核实', verified:false },
  { crop:'🍬 白糖', region:'中国广西', season:'甘蔗伸长期（未逐站核实：NMC周报无甘蔗物候表，同区晚稻为分蘖/返青期可作物候参照）', sensitive:'7-9月需水关键期', risk:'本行阶段为常规农学判断。可核实的气象事实：中期公报指未来10天华南西南部累计降水70-180毫米、11-14天(8/19-22)华南中南部40-90毫米部分超100毫米；广西不在本轮台风主要登陆影响区。本站判断：伸长期需水获满足，属"有水无灾"组合', enso:'EN年华南秋冬偏干需警惕，但当前尚未体现',
    src:'NMC农业气象周报（无甘蔗表）+ 中期天气预报', srcUrl:'http://www.nmc.cn/publish/bulletin/mid-range.htm', srcDate:'2026-08-09 10时', verified:false },
  { crop:'🍬 白糖', region:'印度/泰国', season:'季风生长期（未逐站核实）', sensitive:'季风降水', risk:'本行为境外产区，中央气象台《国外农业气象月报》为月度发布，本站尚未取得最新一期逐月数据；此前记录为印度7月初季风转入降水盈余、泰国仍偏干，<b>该表述已逾一月未复核，请勿据此做方向判断</b>', enso:'BOM已上修EN强度，EN年季风后期仍可能转弱，中期风险未除',
    src:'中央气象台《国外农业气象月报》', srcUrl:'https://www.nmc.cn/publish/nongyeqixiang/guowainongyeqixiangyuebao/index.html', srcDate:'待核实（上次记录逾一月）', verified:false },
];

// ============================================================
// 产区配置 — 按省份/国家分组; gddStart=生长季起始日(null=多年生/非生长季, 用滚动37天)
// 【坐标/gddStart 为固定配置，勿增删产区】phase 字段为静态人工描述；各产区的气温/降水/积温/风险标签由前端按 Open-Meteo 实况+预报【自动计算】(见 calcMetrics/assessRisks)
// ============================================================
const cropRegions = [
  { crop:'palm', icon:'🌴', name:'棕榈油产区气象监测', color:'#f59e0b',
    groups:[
      { province:'马来西亚', regions:[
        { name:'马来半岛(彭亨/雪兰莪)', lat:3.14, lon:101.69, gddStart:null, phase:'<b>物候</b>：多年生全年结果。厄尔尼诺干旱对产量的冲击滞后6-12个月显现。' },
        { name:'沙巴(山打根)', lat:5.84, lon:118.12, gddStart:null, phase:'<b>物候</b>：东马主产区，沙巴占马来西亚产量约1/4。' },
        { name:'砂拉越(民都鲁)', lat:3.17, lon:113.04, gddStart:null, phase:'<b>物候</b>：东马新兴种植区。' },
      ]},
      { province:'印度尼西亚', regions:[
        { name:'苏门答腊(北干巴鲁)', lat:0.53, lon:101.45, gddStart:null, phase:'<b>物候</b>：印尼第一大产区。EN年干旱+烟霾风险最高。' },
        { name:'加里曼丹(帕朗卡拉亚)', lat:-2.21, lon:113.92, gddStart:null, phase:'<b>物候</b>：印尼第二大产区。EN年泥炭地火灾/烟霾风险。' },
      ]},
      { province:'泰国', regions:[ { name:'泰国南部(合艾)', lat:7.01, lon:100.47, gddStart:null, phase:'' } ]},
    ]
  },
  { crop:'cotton', icon:'🧵', name:'棉花产区气象监测', color:'#8b5cf6',
    groups:[
      { province:'新疆', regions:[ { name:'阿克苏', lat:41.17, lon:80.26, gddStart:'2026-04-15', phase:'<b>发育期</b>：花铃期关键阶段。<b>风险</b>：高温影响授粉坐铃，关注膜下滴灌水源。' } ]},
      { province:'河北', regions:[ { name:'石家庄', lat:38.04, lon:114.51, gddStart:'2026-04-25', phase:'<b>发育期</b>：现蕾-开花期。' } ]},
      { province:'山东', regions:[ { name:'济南', lat:36.65, lon:117.12, gddStart:'2026-04-25', phase:'<b>发育期</b>：现蕾-开花期。' } ]},
      { province:'河南', regions:[ { name:'郑州', lat:34.75, lon:113.63, gddStart:'2026-04-25', phase:'<b>发育期</b>：现蕾-开花期。' } ]},
      { province:'印度·马哈拉施特拉邦', regions:[
        { name:'那格浦尔', lat:21.15, lon:79.09, gddStart:'2026-06-15', phase:'<b>发育期</b>：维达巴雨养棉，季风播种-苗期。EN年季风偏弱是最大风险。' },
        { name:'阿科拉', lat:20.70, lon:77.02, gddStart:'2026-06-15', phase:'<b>发育期</b>：维达巴棉区，季风播种-苗期。' },
        { name:'亚沃特马尔', lat:20.39, lon:78.13, gddStart:'2026-06-15', phase:'<b>发育期</b>：维达巴核心棉区，季风播种-苗期。' },
      ]},
      { province:'印度·古吉拉特邦', regions:[
        { name:'拉杰果德', lat:22.30, lon:70.80, gddStart:'2026-06-15', phase:'<b>发育期</b>：索拉施特拉主产棉区，季风播种-苗期。' },
        { name:'艾哈迈达巴德', lat:23.03, lon:72.58, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。' },
        { name:'巴夫纳加尔', lat:21.76, lon:72.15, gddStart:'2026-06-15', phase:'<b>发育期</b>：索拉施特拉棉区，季风播种-苗期。' },
      ]},
      { province:'印度·特伦甘纳邦', regions:[
        { name:'瓦朗加尔', lat:17.97, lon:79.59, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。' },
        { name:'阿迪拉巴德', lat:19.67, lon:78.53, gddStart:'2026-06-15', phase:'<b>发育期</b>：北特伦甘纳棉区，季风播种-苗期。' },
        { name:'海得拉巴', lat:17.38, lon:78.49, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。' },
      ]},
      { province:'印度·安得拉邦', regions:[
        { name:'贡土尔', lat:16.31, lon:80.44, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。' },
        { name:'库努尔', lat:15.83, lon:78.04, gddStart:'2026-06-15', phase:'<b>发育期</b>：拉亚拉西马棉区，季风播种-苗期。' },
      ]},
      { province:'印度·卡纳塔克邦', regions:[
        { name:'胡布利', lat:15.36, lon:75.12, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。' },
        { name:'赖久尔', lat:16.21, lon:77.36, gddStart:'2026-06-15', phase:'<b>发育期</b>：北卡棉区，季风播种-苗期。' },
      ]},
      { province:'印度·中央邦', regions:[
        { name:'印多尔', lat:22.72, lon:75.86, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。' },
        { name:'肯德瓦', lat:21.83, lon:76.35, gddStart:'2026-06-15', phase:'<b>发育期</b>：尼马尔棉区，季风播种-苗期。' },
      ]},
      { province:'印度·拉贾斯坦邦', regions:[
        { name:'斯里根根格尔', lat:29.92, lon:73.88, gddStart:'2026-05-01', phase:'<b>发育期</b>：北部灌溉棉，现蕾-开花期。' },
        { name:'科塔', lat:25.21, lon:75.86, gddStart:'2026-05-15', phase:'<b>发育期</b>：现蕾-开花期。' },
      ]},
      { province:'印度·旁遮普-哈里亚纳', regions:[
        { name:'巴丁达(旁遮普)', lat:30.21, lon:74.95, gddStart:'2026-05-01', phase:'<b>发育期</b>：北部灌溉棉，现蕾-花铃期。' },
        { name:'希萨尔(哈里亚纳)', lat:29.15, lon:75.72, gddStart:'2026-05-01', phase:'<b>发育期</b>：北部灌溉棉，现蕾-花铃期。' },
      ]},
      { province:'巴西', regions:[ { name:'马托格罗索(库亚巴)', lat:-15.60, lon:-56.10, gddStart:null, phase:'<b>发育期</b>：二季棉吐絮-采收期，干燥天气有利收获。' } ]},
      { province:'美国', regions:[ { name:'密西西比河谷(阿肯色)', lat:34.75, lon:-92.29, gddStart:'2026-05-05', phase:'<b>发育期</b>：现蕾期。' } ]},
    ]
  },
  { crop:'corn', icon:'🌽', name:'玉米产区气象监测', color:'#eab308',
    groups:[
      { province:'黑龙江', regions:[
        { name:'哈尔滨', lat:45.75, lon:126.63, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。<b>墒情</b>：东北光热适宜，大部墒情适宜。' },
        { name:'齐齐哈尔', lat:47.35, lon:123.92, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。' },
        { name:'佳木斯', lat:46.81, lon:130.33, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。' },
      ]},
      { province:'吉林', regions:[
        { name:'长春', lat:43.88, lon:125.32, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。' },
        { name:'白城', lat:45.62, lon:122.84, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。吉林西部易旱区，重点监测降水。' },
      ]},
      { province:'辽宁', regions:[
        { name:'沈阳', lat:41.80, lon:123.43, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。' },
        { name:'铁岭', lat:42.29, lon:123.84, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。辽北主产区。' },
      ]},
      { province:'内蒙古', regions:[
        { name:'通辽', lat:43.62, lon:122.26, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。西辽河灌区，"内蒙古粮仓"，易旱区。' },
        { name:'兴安盟(乌兰浩特)', lat:46.08, lon:122.05, gddStart:'2026-05-01', phase:'<b>发育期</b>：春玉米拔节期。' },
      ]},
      { province:'河北', regions:[
        { name:'石家庄', lat:38.04, lon:114.51, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米出苗-三叶期。' },
        { name:'衡水', lat:37.74, lon:115.67, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米出苗-三叶期。黑龙港流域，地下水限采区。' },
        { name:'邢台', lat:37.07, lon:114.49, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米出苗-三叶期。' },
      ]},
      { province:'山东', regions:[
        { name:'济南', lat:36.65, lon:117.12, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。<b>风险</b>：35°C+高温不利壮苗。' },
        { name:'菏泽', lat:35.23, lon:115.48, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'聊城', lat:36.46, lon:115.99, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'德州', lat:37.44, lon:116.36, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'枣庄', lat:34.81, lon:117.32, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
      ]},
      { province:'河南', regions:[
        { name:'郑州', lat:34.75, lon:113.63, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'新乡', lat:35.30, lon:113.93, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'南阳', lat:32.99, lon:112.53, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'周口', lat:33.63, lon:114.70, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
        { name:'驻马店', lat:32.98, lon:114.03, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米三叶-七叶期。' },
      ]},
      { province:'安徽', regions:[
        { name:'亳州', lat:33.88, lon:115.78, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米出苗-三叶期。' },
        { name:'阜阳', lat:32.90, lon:115.81, gddStart:'2026-06-10', phase:'<b>发育期</b>：夏玉米出苗-三叶期。' },
      ]},
      { province:'美国', regions:[
        { name:'爱荷华(得梅因)', lat:41.59, lon:-93.62, gddStart:'2026-05-01', phase:'<b>发育期</b>：8%已吐丝，7月中下旬进入授粉关键期。<b>墒情</b>：近日强降雨补墒，优良率约78%。' },
        { name:'伊利诺伊(斯普林菲尔德)', lat:39.78, lon:-89.65, gddStart:'2026-05-01', phase:'<b>发育期</b>：17%已吐丝。优良率约58%(好+优)。' },
        { name:'内布拉斯加(奥马哈)', lat:41.26, lon:-96.01, gddStart:'2026-05-01', phase:'<b>发育期</b>：拔节-抽雄前期。' },
      ]},
      { province:'乌克兰', regions:[
        { name:'基辅', lat:50.45, lon:30.52, gddStart:'2026-04-25', phase:'<b>发育期</b>：拔节-抽雄前。' },
      ]},
      { province:'巴西', regions:[
        { name:'马托格罗索(库亚巴)', lat:-15.60, lon:-56.10, gddStart:null, phase:'<b>发育期</b>：二季玉米(Safrinha)成熟-收获期，干燥有利收割。' },
      ]},
    ]
  },
  { crop:'soybean', icon:'🫘', name:'大豆产区气象监测', color:'#10b981',
    groups:[
      { province:'黑龙江', regions:[
        { name:'哈尔滨', lat:45.75, lon:126.63, gddStart:'2026-05-05', phase:'<b>发育期</b>：分枝-初花期。<b>墒情</b>：大部适宜。' },
        { name:'绥化', lat:46.65, lon:126.98, gddStart:'2026-05-05', phase:'<b>发育期</b>：分枝-初花期。全国大豆主产核心区。' },
        { name:'黑河', lat:50.25, lon:127.53, gddStart:'2026-05-05', phase:'<b>发育期</b>：分枝期。高纬产区，积温是关键限制因子。' },
        { name:'齐齐哈尔', lat:47.35, lon:123.92, gddStart:'2026-05-05', phase:'<b>发育期</b>：分枝-初花期。' },
      ]},
      { province:'内蒙古', regions:[
        { name:'兴安盟(乌兰浩特)', lat:46.08, lon:122.05, gddStart:'2026-05-05', phase:'<b>发育期</b>：分枝期。' },
        { name:'呼伦贝尔(海拉尔)', lat:49.21, lon:119.77, gddStart:'2026-05-05', phase:'<b>发育期</b>：分枝期。高纬产区，警惕低温。' },
      ]},
      { province:'安徽', regions:[
        { name:'宿州', lat:33.65, lon:116.96, gddStart:'2026-06-15', phase:'<b>发育期</b>：夏大豆出苗-真叶期。' },
        { name:'亳州', lat:33.88, lon:115.78, gddStart:'2026-06-15', phase:'<b>发育期</b>：夏大豆出苗-真叶期。' },
        { name:'阜阳', lat:32.90, lon:115.81, gddStart:'2026-06-15', phase:'<b>发育期</b>：夏大豆出苗-真叶期。' },
      ]},
      { province:'河南', regions:[
        { name:'周口', lat:33.63, lon:114.70, gddStart:'2026-06-15', phase:'<b>发育期</b>：夏大豆出苗-真叶期。' },
      ]},
      { province:'美国', regions:[
        { name:'伊利诺伊', lat:39.78, lon:-89.65, gddStart:'2026-05-10', phase:'<b>发育期</b>：开花期(R1)，33%开花8%结荚。近日降雨改善墒情。' },
        { name:'爱荷华', lat:41.59, lon:-93.62, gddStart:'2026-05-10', phase:'<b>发育期</b>：开花期(R1)，约37%开花。' },
        { name:'印第安纳', lat:39.77, lon:-86.16, gddStart:'2026-05-10', phase:'' },
        { name:'俄亥俄', lat:39.96, lon:-83.00, gddStart:'2026-05-10', phase:'' },
        { name:'明尼苏达', lat:44.98, lon:-93.27, gddStart:'2026-05-10', phase:'' },
        { name:'内布拉斯加', lat:41.26, lon:-96.01, gddStart:'2026-05-10', phase:'' },
        { name:'密苏里', lat:38.58, lon:-92.17, gddStart:'2026-05-10', phase:'' },
        { name:'南达科他', lat:44.37, lon:-100.35, gddStart:'2026-05-10', phase:'' },
      ]},
      { province:'巴西', regions:[
        { name:'马托格罗索', lat:-15.60, lon:-56.10, gddStart:null, phase:'<b>发育期</b>：已收获（休耕/二季作物季），监测供下季播种参考。' },
        { name:'帕拉纳', lat:-25.43, lon:-49.27, gddStart:null, phase:'' },
        { name:'南里奥格兰德', lat:-30.03, lon:-51.23, gddStart:null, phase:'' },
      ]},
      { province:'阿根廷', regions:[
        { name:'布宜诺斯艾利斯省', lat:-34.60, lon:-58.38, gddStart:null, phase:'<b>发育期</b>：已收获（南半球冬季）。' },
        { name:'科尔多瓦省', lat:-31.42, lon:-64.18, gddStart:null, phase:'' },
      ]},
    ]
  },
  { crop:'wheat', icon:'🌾', name:'小麦产区气象监测', color:'#d97706',
    groups:[
      { province:'河北', regions:[
        { name:'衡水', lat:37.74, lon:115.67, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获，腾茬夏播。监测墒情供夏玉米/秋播参考。' },
        { name:'邢台', lat:37.07, lon:114.49, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
      ]},
      { province:'山东', regions:[
        { name:'济南', lat:36.65, lon:117.12, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'聊城', lat:36.46, lon:115.99, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'德州', lat:37.44, lon:116.36, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'枣庄', lat:34.81, lon:117.32, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
      ]},
      { province:'河南', regions:[
        { name:'郑州', lat:34.75, lon:113.63, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获，新麦上市。' },
        { name:'新乡', lat:35.30, lon:113.93, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'南阳', lat:32.99, lon:112.53, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'周口', lat:33.63, lon:114.70, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'驻马店', lat:32.98, lon:114.03, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
      ]},
      { province:'安徽', regions:[
        { name:'亳州', lat:33.88, lon:115.78, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
        { name:'阜阳', lat:32.90, lon:115.81, gddStart:null, phase:'<b>发育期</b>：冬小麦已收获。' },
      ]},
      { province:'俄罗斯', regions:[
        { name:'黑土带(沃罗涅日)', lat:51.67, lon:39.21, gddStart:'2026-04-05', phase:'<b>发育期</b>：冬小麦灌浆-成熟期，7月收获陆续展开。<b>风险</b>：收获期降水/干热风。' },
      ]},
      { province:'乌克兰', regions:[
        { name:'基辅', lat:50.45, lon:30.52, gddStart:'2026-04-05', phase:'<b>发育期</b>：冬小麦灌浆-成熟期。' },
      ]},
      { province:'加拿大', regions:[
        { name:'萨斯喀彻温(萨斯卡通)', lat:52.13, lon:-106.67, gddStart:'2026-05-10', phase:'<b>发育期</b>：春小麦分蘖-拔节期。' },
        { name:'阿尔伯塔(埃德蒙顿)', lat:53.55, lon:-113.49, gddStart:'2026-05-10', phase:'<b>发育期</b>：春小麦分蘖-拔节期。' },
      ]},
      { province:'澳大利亚', regions:[
        { name:'新南威尔士(悉尼以西麦区)', lat:-33.87, lon:151.21, gddStart:'2026-05-15', phase:'<b>发育期</b>：播种-分蘖期。<b>风险</b>：厄尔尼诺→冬春干旱是澳麦最大威胁。' },
        { name:'维多利亚(墨尔本以北麦区)', lat:-37.81, lon:144.96, gddStart:'2026-05-15', phase:'<b>发育期</b>：播种-分蘖期。' },
        { name:'南澳(阿德莱德)', lat:-34.93, lon:138.60, gddStart:'2026-05-15', phase:'<b>发育期</b>：播种-分蘖期。' },
      ]},
    ]
  },
  { crop:'coffee', icon:'☕', name:'咖啡产区气象监测', color:'#78350f',
    groups:[
      { province:'中国云南', regions:[
        { name:'普洱', lat:22.78, lon:100.97, gddStart:null, phase:'<b>物候</b>：果实发育期（雨季）。' },
        { name:'保山', lat:25.11, lon:99.17, gddStart:null, phase:'<b>物候</b>：果实发育期。' },
      ]},
      { province:'巴西', regions:[
        { name:'米纳斯吉拉斯', lat:-19.92, lon:-43.94, gddStart:null, phase:'<b>物候</b>：采收期(5-9月)。<b>风险</b>：7-8月为霜冻高风险窗口，最低温是核心指标。' },
        { name:'圣保罗', lat:-23.55, lon:-46.63, gddStart:null, phase:'<b>物候</b>：采收期。警惕寒潮霜冻。' },
      ]},
      { province:'哥伦比亚', regions:[
        { name:'MAM产区(麦德林)', lat:6.25, lon:-75.56, gddStart:null, phase:'' },
        { name:'考卡省', lat:2.44, lon:-76.61, gddStart:null, phase:'' },
        { name:'娜玲珑省', lat:1.21, lon:-77.28, gddStart:null, phase:'' },
        { name:'慧兰省', lat:2.93, lon:-75.29, gddStart:null, phase:'' },
      ]},
      { province:'埃塞俄比亚', regions:[
        { name:'耶加雪菲', lat:6.16, lon:38.21, gddStart:null, phase:'<b>物候</b>：果实发育期（主雨季)。' },
        { name:'西达摩', lat:6.69, lon:38.42, gddStart:null, phase:'' },
        { name:'哈拉尔', lat:9.31, lon:42.13, gddStart:null, phase:'' },
      ]},
    ]
  },
  { crop:'sugar', icon:'🍬', name:'白糖(甘蔗)产区气象监测', color:'#ec4899',
    groups:[
      { province:'中国广西', regions:[
        { name:'崇左', lat:22.38, lon:107.36, gddStart:'2026-03-01', phase:'<b>发育期</b>：甘蔗伸长期，7-9月为需水最关键期。崇左为全国最大蔗区。' },
        { name:'南宁', lat:22.82, lon:108.37, gddStart:'2026-03-01', phase:'<b>发育期</b>：甘蔗伸长期。' },
        { name:'柳州', lat:24.31, lon:109.41, gddStart:'2026-03-01', phase:'<b>发育期</b>：甘蔗伸长期。' },
        { name:'来宾', lat:23.75, lon:109.23, gddStart:'2026-03-01', phase:'<b>发育期</b>：甘蔗伸长期。' },
      ]},
      { province:'巴西', regions:[
        { name:'圣保罗州(里贝朗普雷图)', lat:-21.18, lon:-47.81, gddStart:null, phase:'<b>物候</b>：压榨季(4-11月)。干燥利于收割与出糖率，但过旱损害下季宿根。' },
      ]},
      { province:'印度·北方邦', regions:[
        { name:'勒克瑙', lat:26.85, lon:80.95, gddStart:null, phase:'<b>物候</b>：季风生长期。印度最大产糖邦。<b>风险</b>：EN年季风偏弱→单产与出糖率下调。' },
        { name:'密拉特', lat:28.98, lon:77.71, gddStart:null, phase:'<b>物候</b>：西北方邦蔗区，季风生长期。' },
        { name:'戈勒克布尔', lat:26.76, lon:83.37, gddStart:null, phase:'<b>物候</b>：东方邦蔗区，季风生长期。' },
      ]},
      { province:'印度·马哈拉施特拉邦', regions:[
        { name:'科尔哈普尔', lat:16.70, lon:74.24, gddStart:null, phase:'<b>物候</b>：主产蔗区，季风生长期。<b>风险</b>：EN年季风偏弱→单产与出糖率下调。' },
        { name:'艾哈迈德讷格尔', lat:19.09, lon:74.74, gddStart:null, phase:'<b>物候</b>：主产蔗区，季风生长期。' },
        { name:'索拉普尔', lat:17.66, lon:75.91, gddStart:null, phase:'<b>物候</b>：季风生长期，易受干旱影响。' },
      ]},
      { province:'印度·卡纳塔克邦', regions:[
        { name:'贝尔高姆', lat:15.85, lon:74.50, gddStart:null, phase:'<b>物候</b>：北卡主产蔗区，季风生长期。' },
        { name:'曼迪亚', lat:12.52, lon:76.90, gddStart:null, phase:'<b>物候</b>：南卡灌溉蔗区，生长期。' },
      ]},
      { province:'印度·泰米尔纳德邦', regions:[
        { name:'哥印拜陀', lat:11.02, lon:76.96, gddStart:null, phase:'<b>物候</b>：灌溉蔗区，生长期。' },
        { name:'埃罗德', lat:11.34, lon:77.72, gddStart:null, phase:'<b>物候</b>：灌溉蔗区，生长期。' },
      ]},
      { province:'印度·古吉拉特邦', regions:[
        { name:'苏拉特', lat:21.17, lon:72.83, gddStart:null, phase:'<b>物候</b>：南古吉拉特蔗区，季风生长期。' },
        { name:'巴多利', lat:21.12, lon:73.11, gddStart:null, phase:'<b>物候</b>：南古吉拉特蔗区，季风生长期。' },
      ]},
      { province:'印度·比哈尔邦', regions:[
        { name:'穆扎法尔普尔', lat:26.12, lon:85.39, gddStart:null, phase:'<b>物候</b>：北比哈尔蔗区，季风生长期。' },
        { name:'西查姆帕兰(贝蒂亚)', lat:26.80, lon:84.50, gddStart:null, phase:'<b>物候</b>：蔗区，季风生长期。' },
      ]},
      { province:'泰国', regions:[
        { name:'东北部(孔敬)', lat:16.44, lon:102.84, gddStart:null, phase:'<b>物候</b>：雨季生长期。<b>风险</b>：EN年泰国降水偏少→出口量收缩。' },
        { name:'北部(甘烹碧)', lat:16.48, lon:99.52, gddStart:null, phase:'<b>物候</b>：雨季生长期。' },
        { name:'中部(北碧)', lat:14.02, lon:99.53, gddStart:null, phase:'<b>物候</b>：雨季生长期。' },
      ]},
    ]
  },
  // ---------- 菜籽/油菜籽 (Rapeseed/Canola) ----------
  // 产地依据: 加拿大 StatCan(SK>AB>MB 三省占全国绝大多数)；EU FR/DE/PL/RO/CZ 为主产国；澳洲 WA 占全国>50%(Esperance 单区最大), 次为 VIC/NSW/SA。
  // 物候: 加拿大春油菜(5月播/7月开花-结荚); 欧盟冬油菜(上年秋播/7月收获, gddStart=null 走滚动窗口); 澳洲冬油菜(4-5月播/8-9月开花, 当前营养-抽薹期)。代表点为各产带主要种植/气象站城市。
  { crop:'canola', icon:'🌼', name:'菜籽产区气象监测', color:'#facc15',
    groups:[
      { province:'加拿大·萨斯喀彻温', regions:[
        { name:'里贾纳', lat:50.45, lon:-104.62, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期(5月播种)。全国最大产省，7-8月花期高温(>30°C)/干旱影响结实与含油率。' },
        { name:'萨斯卡通', lat:52.13, lon:-106.67, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。中萨主产带。' },
        { name:'约克顿', lat:51.21, lon:-102.46, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。东萨油菜与压榨集散地。' },
        { name:'阿尔伯特王子城', lat:53.20, lon:-105.75, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。北部黑土带。' },
      ]},
      { province:'加拿大·艾伯塔', regions:[
        { name:'红鹿市', lat:52.27, lon:-113.81, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。中艾伯塔核心油菜带。' },
        { name:'大草原城', lat:55.17, lon:-118.80, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。北部和平河(Peace)主产区。' },
        { name:'莱斯布里奇', lat:49.69, lon:-112.83, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。南部(含灌溉)产区。' },
      ]},
      { province:'加拿大·马尼托巴', regions:[
        { name:'布兰登', lat:49.85, lon:-99.95, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。西南曼省主产带。' },
        { name:'波蒂奇拉普雷里', lat:49.97, lon:-98.29, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。红河谷产区。' },
        { name:'多芬', lat:51.15, lon:-100.05, gddStart:'2026-05-10', phase:'<b>发育期</b>：春油菜开花-结荚期。西北曼省产区。' },
      ]},
      { province:'法国', regions:[
        { name:'奥尔良(中央-卢瓦尔河谷)', lat:47.90, lon:1.90, gddStart:null, phase:'<b>物候</b>：冬油菜收获期(上年秋播)。法国主产带，关注收割窗口降水。' },
        { name:'沙特尔(博斯)', lat:48.44, lon:1.49, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。博斯(Beauce)大田油料带。' },
        { name:'第戎(勃艮第-弗朗什孔泰)', lat:47.32, lon:5.04, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。勃艮第油菜带。' },
      ]},
      { province:'德国', regions:[
        { name:'罗斯托克(梅前州)', lat:54.09, lon:12.14, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。梅克伦堡-前波美拉尼亚为德国第一大油菜州。' },
        { name:'马格德堡(萨安州)', lat:52.12, lon:11.63, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。萨克森-安哈尔特黑土油料带。' },
        { name:'科特布斯(勃兰登堡)', lat:51.76, lon:14.33, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。勃兰登堡产区。' },
      ]},
      { province:'波兰', regions:[
        { name:'波兹南(大波兰省)', lat:52.41, lon:16.93, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。大波兰为主产区之一。' },
        { name:'比得哥什(库亚瓦-滨海省)', lat:53.12, lon:18.01, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。库亚瓦油料带。' },
        { name:'弗罗茨瓦夫(下西里西亚)', lat:51.11, lon:17.03, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。下西里西亚肥沃产区。' },
      ]},
      { province:'罗马尼亚', regions:[
        { name:'蒂米什瓦拉(巴纳特)', lat:45.75, lon:21.23, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。西部巴纳特平原油料带。' },
        { name:'康斯坦察(多布罗加)', lat:44.18, lon:28.63, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。多布罗加(黑海沿岸)产区。' },
        { name:'克拉约瓦(奥尔特尼亚)', lat:44.33, lon:23.79, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。南部瓦拉几亚平原产区。' },
      ]},
      { province:'捷克', regions:[
        { name:'布尔诺(南摩拉维亚)', lat:49.20, lon:16.61, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。南摩拉维亚主产油料区。' },
        { name:'奥洛穆茨(哈纳)', lat:49.59, lon:17.25, gddStart:null, phase:'<b>物候</b>：冬油菜收获期。哈纳(Haná)肥沃平原。' },
      ]},
      { province:'澳大利亚·西澳', regions:[
        { name:'埃斯佩兰斯', lat:-33.86, lon:121.89, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期(4-5月播)。南海岸单区产量全国最大；需350-500mm冬春降水。' },
        { name:'卡塔宁(大南部)', lat:-33.69, lon:117.56, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。大南部主产带。' },
        { name:'杰拉尔顿', lat:-28.77, lon:114.61, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。北部麦区，早播早熟、旱情敏感。' },
        { name:'莫拉瓦', lat:-29.21, lon:116.01, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。北部内陆麦区。' },
      ]},
      { province:'澳大利亚·新南威尔士', regions:[
        { name:'沃加沃加(里韦里纳)', lat:-35.11, lon:147.37, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。里韦里纳为NSW油菜核心带。' },
        { name:'特莫拉', lat:-34.45, lon:147.53, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。南部坡地油菜带。' },
        { name:'达博', lat:-32.24, lon:148.60, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。中部西坡产区。' },
      ]},
      { province:'澳大利亚·维多利亚', regions:[
        { name:'霍舍姆(威默拉)', lat:-36.71, lon:142.20, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。威默拉大田油菜带。' },
        { name:'阿拉拉特(西南维州)', lat:-37.28, lon:142.93, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。西南维州为全州最大油菜产区。' },
      ]},
      { province:'澳大利亚·南澳', regions:[
        { name:'纳拉库特(石灰岩海岸)', lat:-36.96, lon:140.74, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。东南石灰岩海岸产区。' },
        { name:'克莱尔(中北部)', lat:-33.83, lon:138.61, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。中北部谷地产区。' },
        { name:'卡明斯(艾尔半岛)', lat:-34.26, lon:135.72, gddStart:'2026-05-01', phase:'<b>发育期</b>：冬油菜营养-抽薹期。艾尔半岛(Eyre)主产带。' },
      ]},
    ]
  },
];

// ============================================================
// 农业新闻【静态/人工维护】— 仅保留 12 小时内消息
// 渲染(renderNews)按 ts 实时过滤：距当前 > NEWS_WINDOW_HOURS 小时的条目自动隐藏；全部过期则显示空状态。
// 每条须含真实链接与 ISO 时间戳 ts(北京时 +08:00)；不得编造，无新消息则留空数组即可。
// ============================================================
const NEWS_WINDOW_HOURS = 12;
const AG_NEWS = [
  {
    title: '★台风"白海豚"(第13号)8/9傍晚在浙江两度登陆——台州玉环(17:30, 14级/42m/s)、温州乐清(18:40)，浙江防台风应急响应升至Ⅰ级。恰逢全省早稻抢收收官(截至8/6收割进度94%)，未收成熟稻面临倒伏、谷粒发芽霉变风险；9-10日浙东、上海中部特大暴雨，单点累计或超500mm，低洼农田渍涝风险高。残余环流北上与冷空气结合，预计8/12起华北平原(山东/河南/京津冀)现特大暴雨，威胁玉米/水稻等秋粮',
    link: 'https://m.gmw.cn/2026-08/08/content_1304544847.htm',
    ts: '2026-08-10T08:30:00+08:00', date: '8/10 08:30', source: '中央气象台/光明网', sourceClass: 'fao',
  },
  {
    title: '★BOM ENSO：相对NINO3.4 周值(至8/2)升至+2.02°C，为2016年2月以来首次突破"极强"阈值(+2.0°C)；90天SOI约−21.4，海气耦合完整。ACCESS-S 模式预测月值峰值约+3.5°C(11月)，将超1902年+2.65°C纪录，事件料延续至2027年初。IOD周值同步升至+0.63°C(连续两周高于+0.4阈值)，正IOD事件或于南半球冬季确立；WMO警告极强EN+正IOD叠加将影响8-10月全球气候',
    link: 'http://www.bom.gov.au/climate/enso/',
    ts: '2026-08-10T08:40:00+08:00', date: '8/10 08:40', source: 'BOM/Weatherzone/WMO', sourceClass: 'usda',
  },
  {
    title: '周五(8/7)CBOT收盘：小麦领涨——芝加哥9月+8¼¢收$6.3975、KC+12~14¢(美元走弱+黑海港口遭袭担忧)；玉米最活跃收$4.62持平、大豆最活跃−1.5¢至$11.7625。USDA当日闪电销售28.6万吨玉米至墨西哥(多为27/28年度)、23.8万吨大豆至中国，市场并传闻中国本周采购约10船美豆(与访美贸易预期相关)。周初市场整体观望，聚焦8/12 WASDE首次田间调查：路透预期玉米产量约159.34亿蒲(下修约6600万蒲)、单产预估区间180.8-184.8',
    link: 'https://www.680kfeq.com/2026/08/07/closing-markets-friday-august-7-2026/',
    ts: '2026-08-10T09:00:00+08:00', date: '8/10 09:00', source: 'CBOT/680KFEB/Grain Central', sourceClass: 'usda',
  },
  {
    title: '黑海小麦出口执行风险持续恶化：SovEcon——俄7月小麦出口仅160万吨，为2017/18以来同期最低(5年均值310万)；7/10起亚速海及刻赤海峡浅水港受无人机袭击限制，塔曼粮食码头受损、新罗西斯克靠泊锐减；乌方敖德萨/乔尔诺莫尔斯克/尤日内港7月商业交通大面积停摆，港口设施遭袭67次。俄26/27小麦出口预估下修至4460万吨；运保费大涨(运费$5→$8/吨、战争险升至船值约2%)，买家观望等待明朗，俄麦FOB约$223/吨',
    link: 'https://blog.sizov.report/russia-wheat-exports-in-july-lowest-since-2017-18/',
    ts: '2026-08-10T09:15:00+08:00', date: '8/10 09:15', source: 'SovEcon Sizov Report', sourceClass: 'usda',
  },
  {
    title: 'USDA作物进度(截至8/2)：玉米优良好率61%(周降2个点，上年73%)、大豆63%持平(上年69%)；玉米吐丝90%/乳熟43%/首批见齿6%，大豆开花88%/结荚62%，发育均快于5年均值，北达科他恶化最明显。8/10-14展望：中西部普遍偏暖，西玉米带(爱荷华/内布拉斯加/达科他)高温少雨、灌浆期快速干旱(ROD)风险上升，中央及东部玉米带有1-3英寸降雨缓解。市场等待8/12 WASDE对单产的首个田间调查修正',
    link: 'https://www.agrexinc.com/story-usda-corn-declines-61-soybeans-63-good-excellent-condition-8-267248',
    ts: '2026-08-10T09:30:00+08:00', date: '8/10 09:30', source: 'USDA/DTN/Brownfield', sourceClass: 'usda',
  },
  {
    title: '欧盟谷物供给收缩：法国玉米优良率降至31%，为1980年以来同期最差；USDA驻乌武官初步评估下调乌26/27小麦出口370万吨、玉米出口约900万吨(港口基础设施受损)。市场评价全球小麦供给由"舒适"转向"紧平衡"，欧洲与美国基准盘逐步计入物流风险溢价，关注8/12 WASDE',
    link: 'https://www.graincentral.com/markets/daily-market-wire-10-august-2026/',
    ts: '2026-08-10T09:45:00+08:00', date: '8/10 09:45', source: 'Grain Central/USDA', sourceClass: 'fao',
  },
  {
    title: '中国东北产区天气分化：黑龙江大部/吉林北部8/2-8降水50-100mm、墒情转好但低洼地块过湿渍涝，大豆根系缺氧、结荚受阻；辽宁及吉林南部遭遇35-38°C高温热浪(较常年偏高2-4°C)，玉米灌浆乳熟期热害、千粒重下降风险升。8/12-16"白海豚"残涡携冷空气将给东北南部带来大到暴雨。中央气象台提示未来10天中东部及西南多阴雨，需防范农田渍涝与病虫害',
    link: 'https://www.cma.gov.cn/2011xwzx/2011xqxxw/2011xtpxw/202608/t20260810_7978197.html',
    ts: '2026-08-10T10:00:00+08:00', date: '8/10 10:00', source: '中央气象台/黑龙江台', sourceClass: 'fao',
  },
];

// ============================================================
// 捌·策略观察 — 手写注记的数据截止日(每次更新策略注记时同步改这里)。
// 超过 STRATEGY_MAX_AGE_DAYS 天则整个"策略观察"板块隐藏(过时不展示)。
// ============================================================
const STRATEGY_NOTE_DATE = '2026-08-10';
const STRATEGY_MAX_AGE_DAYS = 2;

// ============================================================
// 特殊天气事件 — 台风/高温/强降水/霜冻等重大天气（静态参考, 更新于 2026-08-10）
// 规则: 每条带 date(发布/最近更新日), 只停留 EVENTS_MAX_AGE_DAYS(3) 天, 过期自动删除; 无事件则板块隐藏。
// severity 用 tag 分级: severe(白字红底)/high(红)/mid(琥珀)/low(墨绿)
// ============================================================
const SPECIAL_EVENTS = [
  {
    icon:'🌀', title:'台风"白海豚"8/9浙江两度登陆，早稻收官期遇强风雨', severity:'强台风·特大暴雨', cls:'high', status:'浙江防台Ⅰ级响应', date:'2026-08-09',
    region:'浙东/上海(特大暴雨) · 后续华北(8/12起特大暴雨风险)',
    time:'8/9登陆 · 8/10-12持续降雨',
    detail:'第13号台风"白海豚"8/9 17:30在台州玉环登陆(14级/42m/s)、18:40在温州乐清二次登陆，浙江防台风应急响应升至Ⅰ级。恰逢全省早稻抢收收官：截至8/6收获进度94%(208.3万亩)，未收成熟稻面临倒伏、谷粒发芽霉变风险，各地"人停机不停"抢收。9-10日浙东、上海中部出现暴雨至特大暴雨，单点累计或超500mm，低洼农田渍涝风险高。残余环流北上与冷空气结合，预计8/12起华北平原(山东/河南/京津冀)现特大暴雨，威胁玉米/水稻等秋粮。8/8-9一度与"灿鸿(第15号)""琵鹭(第16号)"构成三台共舞。',
    sources:[ { l:'CCTV 台风路径分析', u:'https://m.gmw.cn/2026-08/08/content_1304544847.htm' }, { l:'浙江农业系统防台', u:'https://agri.hangzhou.gov.cn/col/col1229708901/art/2026/art_49657d2c67a142329b5383d43905d07b.html' }, { l:'新华 浙江抢收一线', u:'http://www.zhejiang.xinhua.org/20260810/c36ecdb6b94b420598a1cb1eeb534391/c.html' } ],
  },
  {
    icon:'🌽', title:'美玉米带8月上旬"西旱东湿"分化，8/12 WASDE成关键节点', severity:'高温干旱·单产分歧', cls:'high', status:'优良率61%', date:'2026-08-10',
    region:'西玉米带(爱荷华/内布拉斯加/达科他·重) · 中央及东部(有雨)',
    time:'8/10-14 · 8/12 WASDE',
    detail:'USDA(截至8/2)：玉米优良好率61%(周降2个点、上年73%)、大豆63%持平(上年69%)，北达科他恶化最明显；发育快于均值(玉米吐丝90%/乳熟43%/首批见齿6%)。8/10-14中西部普遍偏暖，西玉米带高温少雨、灌浆期快速干旱(ROD)风险上升，中央及东部有1-3英寸降雨缓解。7月降水为2014年以来最少(3.42英寸)的干旱背景仍在，市场焦点转向8/12 WASDE首次田间调查：路透预期玉米产量下修约6600万蒲至159.34亿蒲、单产预估180.8-184.8区间分歧大。',
    sources:[ { l:'USDA Crop Progress 8/3(截至8/2)', u:'https://www.agrexinc.com/story-usda-corn-declines-61-soybeans-63-good-excellent-condition-8-267248' }, { l:'WASDE预期(路透)', u:'https://www.agcanada.com/daily/cbot-weekly-analysts-predict-smaller-corn-soy-crops-in-august-wasde-report' }, { l:'Climate Impact 西部风险', u:'https://climateimpactcompany.com/ag-market-hot-spot-rains-this-week-western-corn-belt-heat-dryness-to-follow-2/' } ],
  },
  {
    icon:'🏜️', title:'美国墒情偏紧延续：作物评级连降，西/北部平原重旱', severity:'墒情偏紧', cls:'high', status:'玉米优良率季内新低', date:'2026-08-03',
    region:'内布拉斯加 · 达科他 · 科罗拉多/怀俄明 · 冬麦带',
    time:'USDA口径 最新周报至8/2(墒情细项截至7/26)',
    detail:'USDA周度报告(截至8/2)作物评级连续第二周下滑，北达科他等旱区恶化最明显，Poor/Very Poor升至14%(上年同期7%)；墒情细项(截至7/26)：48州表层土壤"短缺+严重短缺"合计47%(一周前41%、上年26%)、深层45%，怀俄明86%/科罗拉多89%/南达科他75%/内布拉斯加72%处重旱。全美草场与牧地优良率29%(上年45%)。注：墒情为USDA调查口径，与US Drought Monitor(每周四发布)分级不同，可互相印证。',
    sources:[ { l:'USDA Crop Progress 8/3', u:'https://www.agrexinc.com/story-usda-corn-declines-61-soybeans-63-good-excellent-condition-8-267248' }, { l:'US Drought Monitor', u:'https://droughtmonitor.unl.edu/' } ],
  },
  {
    icon:'🌾', title:'欧洲麦类/玉米减产确认：法国玉米为1980年以来同期最差', severity:'减产确认', cls:'high', status:'法玉米优良率31%', date:'2026-08-10',
    region:'德国 · 法国 · 乌克兰(出口受损)',
    time:'2026收获季 · 8月持续跟踪',
    detail:'德国合作社DRV：2026年小麦产量预估同比-12%至19.9MMT(高温致早熟、粒重与单产下降)。法国受热浪减产(软麦单产估降约7%)，玉米优良率降至31%、为1980年以来同期最差；FranceAgriMer 上调25/26出口。乌克兰因港口基础设施受损，USDA驻乌武官初步评估下调26/27小麦出口370万吨、玉米出口约900万吨，进一步收紧欧盟及全球供给。',
    sources:[ { l:'Reuters/DRV', u:'https://www.reuters.com/markets/commodities/' }, { l:'Grain Central 8/10', u:'https://www.graincentral.com/markets/daily-market-wire-10-august-2026/' }, { l:'FranceAgriMer', u:'https://www.franceagrimer.fr/' } ],
  },
  {
    icon:'🌧️', title:'中国东北产区天气分化：北部过湿、南部高温', severity:'渍涝+高温热害', cls:'high', status:'一喷多促作业推进', date:'2026-08-10',
    region:'黑龙江/吉林北部(过湿) · 辽宁/吉林南部(高温)',
    time:'8月上旬 · 8/12-16残涡大雨',
    detail:'黑龙江大部/吉林北部8/2-8降水50-100mm(局地100mm+)，墒情转好但低洼地块过湿渍涝、大豆根系缺氧结荚受阻；辽宁及吉林南部2-8日气温偏高2-4°C、最高35-38°C，玉米灌浆乳熟期高温热害、千粒重下降风险升，大部墒情尚适宜。8/12-16"白海豚"残涡与冷空气将给东北南部带来大到暴雨，需防低洼农田渍涝。各地推进"一喷多促"并滚动发布墒情与灾害预警。',
    sources:[ { l:'中央气象台 未来10天提示(8/10)', u:'https://www.cma.gov.cn/2011xwzx/2011xqxxw/2011xtpxw/202608/t20260810_7978197.html' }, { l:'黑龙江多轮降雨', u:'https://zmt-m.hljtv.com/news_details.html?id=1149073&timestamp=1785976110389' } ],
  },
  {
    icon:'❄️', title:'巴西南部霜冻窗口(当前风险低)', severity:'霜冻窗口·尾部风险', cls:'mid', status:'当前风险低', date:'2026-07-16',
    region:'南米纳斯 · 塞拉多 · 圣保罗 · 巴拉那',
    time:'7-8月霜冻窗口',
    detail:'7-8月南部霜冻窗口仍开，但近期预报主产区无霜冻、严重寒潮风险低。采收恢复压制价格，阿拉比卡7/16跌约4%至约$3.14/磅后维持弱势。中期支撑更多转向 El Niño 对9-10月开花期(下季作物)可能偏干的影响——本轮 El Niño 已达"极强"，需持续跟踪。',
    sources:[ { l:'INMET(巴西气象)', u:'https://portal.inmet.gov.br/' }, { l:'TradingEconomics 咖啡', u:'https://tradingeconomics.com/commodity/coffee' } ],
  },
];

// ============================================================
// 中国·预报图 — 中央气象台全国降水量预报图 (URL时间戳自动探测)
// 样本1: .../2026/07/03/STFC/medium/SEVP_NMC_STFC_SFER_ER24_ACHN_L88_P9_20260703060002400.JPG (0600起报+024时效)
// 样本2: .../2026/06/17/STFC/medium/SEVP_NMC_STFC_SFER_ER24_ACHN_L88_P9_20260617000007200.JPG (0000起报+072时效)
// 规律: {日期}{起报HHmm(UTC)}{时效FFF}00, 产品代码固定 ER24
// ============================================================
const NMC_PRECIP_HOURS = [
  { fff:'024', label:'24小时 (第1天)' },
  { fff:'048', label:'48小时 (第2天)' },
  { fff:'072', label:'72小时 (第3天)' },
  { fff:'096', label:'96小时 (第4天)' },
  { fff:'120', label:'120小时 (第5天)' },
  { fff:'144', label:'144小时 (第6天)' },
  { fff:'168', label:'168小时 (第7天)' },
];
const NMC_INIT_TIMES = ['1200', '0600', '0000']; // UTC起报时次, 对应北京时20/14/08时, 新→旧探测
function nmcPrecipUrl(y, m, d, hhmm, fff) {
  return `https://image.nmc.cn/product/${y}/${m}/${d}/STFC/medium/SEVP_NMC_STFC_SFER_ER24_ACHN_L88_P9_${y}${m}${d}${hhmm}${fff}00.JPG`;
}

// ---------- 中央气象台官方预报图导航 (国内直连, 图片URL带时间戳无法外链, 故做一键直达) ----------
const CN_OFFICIAL_LINKS = [
  { t:'24小时降水量预报', u:'http://www.nmc.cn/publish/precipitation/1-day.html', d:'每日约08/20时更新 · 页内可切换6h分段' },
  { t:'48–168小时降水预报', u:'http://www.nmc.cn/publish/precipitation/2-day.html', d:'页内可切换48/72/96/120/144/168小时' },
  { t:'最高气温预报', u:'http://www.nmc.cn/publish/temperature/hight/24hour.html', d:'高温热害监控 · 黄淮夏玉米/新疆棉区重点' },
  { t:'强对流天气预报', u:'http://www.nmc.cn/publish/bulletin/swpc.html', d:'雷暴大风/冰雹落区' },
  { t:'台风路径预报', u:'http://typhoon.nmc.cn', d:'台风综合信息 · EN年台风偏强关注华东' },
  { t:'中期天气公报(4-10天)', u:'http://www.nmc.cn/publish/bulletin/mid-range.htm', d:'环流趋势与过程预报' },
  { t:'农业干旱综合监测', u:'http://www.nmc.cn/publish/agro/disastersmonitoring/Agricultural_Drought_Monitoring.htm', d:'农业气象板块 · 每周更新' },
  { t:'土壤水分监测(10cm)', u:'http://www.nmc.cn/publish/agro/soil-moisture-monitoring-10cm.html', d:'产区墒情实况' },
  { t:'作物发育期监测', u:'http://www.nmc.cn/publish/agro/information/soybean.html', d:'大豆/玉米/棉花发育期地图' },
  { t:'农业气象周报', u:'http://www.nmc.cn/publish/agro/ten-week/index.html', d:'生育期表静态描述的官方来源' },
  { t:'雷达拼图(实况)', u:'http://www.nmc.cn/publish/radar/chinaall.html', d:'全国雷达回波' },
  { t:'FY-4B卫星云图', u:'http://www.nmc.cn/publish/satellite/fy4b-visible.htm', d:'可见光云图' },
];

// ---------- 中国强对流天气监测【图像自动探测 · 近实时】 ----------
// 三类NMC真实产品图，前端用 probeImage/pool 探测最新可用时次(与降水图同源逻辑；时间戳均为UTC)：
//  · CSPB 强对流预报(4张 base64_1..4；UTC起报 0000/0600/1000/2200)
//  · RDCP 全国雷达拼图(约6分钟一帧 → 多帧动画)
//  · WXBL FY-4B可见光云图(约15分钟一帧 → 多帧动画；夜间可能缺测)
// 图片URL仅前端引用官方公开地址，不本地缓存；官方源链接仅作兜底(小字"查看来源")。
const CN_CONV_CONFIG = {
  convective: { title:'强对流天气预报', srcPage:'http://www.nmc.cn/publish/bulletin/swpc.html',
    issues:['2200','1000','0600','0000'], count:4,
    labels:['强对流预报图 1','强对流预报图 2','强对流预报图 3','强对流预报图 4'] },
  radar:     { title:'全国雷达拼图（实况）', srcPage:'http://www.nmc.cn/publish/radar/chinaall.html',
    stepMin:6, lookbackMin:180, maxFrames:12 },
  satellite: { title:'FY-4B 可见光云图', srcPage:'http://www.nmc.cn/publish/satellite/fy4b-visible.htm',
    stepMin:15, lookbackMin:420, maxFrames:8 },
};

// ---------- 中国农业实况：土壤墒情 + 逐时气温【图像自动探测 · 近实时】 ----------
// 与降水/雷达同源(image.nmc.cn)，时间戳同一规律：{日期}{起报HHmm(UTC)}{时效FFF}00
//  · AMSM 土壤相对湿度(墒情)：每日 0000UTC(北京时08时)一张，分 10/20/30/40/50cm 五个层次
//    样本: .../2026/07/27/AMSM/medium/SEVP_NMC_AMSM_CAGMSS_ESRH_ACHN_L10CM_PS_20260727000000000.jpg
//  · STFC/ET0 全国逐时气温实况：每小时一张(UTC整点) → 多帧动画
//    样本: .../2026/05/16/STFC/medium/SEVP_NMC_STFC_SFER_ET0_ACHN_L88_PB_20260516030000000.jpg
// 图片URL仅前端引用官方公开地址，不本地缓存；官方源链接作兜底。
const CN_OBS_CONFIG = {
  soil: {
    title:'全国土壤相对湿度（墒情）实况',
    srcPage:'https://www.nmc.cn/publish/soil-moisture/10cm.html',
    depths:[
      { cm:'10', label:'10 厘米（表层墒情）', page:'https://www.nmc.cn/publish/soil-moisture/10cm.html' },
      { cm:'20', label:'20 厘米', page:'https://www.nmc.cn/publish/soil-moisture/20cm.html' },
      { cm:'30', label:'30 厘米（根层墒情）', page:'https://www.nmc.cn/publish/soil-moisture/30cm.html' },
      { cm:'40', label:'40 厘米', page:'https://www.nmc.cn/publish/soil-moisture/40cm.html' },
      { cm:'50', label:'50 厘米（深层墒情）', page:'https://www.nmc.cn/publish/soil-moisture/50cm.html' },
    ],
    lookbackDays:8,   // 逐日发布, 遇缺测向前回溯
    note:'土壤相对湿度＝实测土壤含水量占田间持水量的百分比。一般 <40% 为重旱、40–60% 偏旱、60–90% 适宜、>90% 偏涝(渍害风险)。表层(10cm)反映近期降水与蒸发,30–50cm 反映根层可用水,判断旱情持续性应以深层为准。',
  },
  // 气温预报(1-7天)：与降水预报图同构的7宫格。产品 RFFC/ETM(最高气温)，每日北京时08/20时起报。
  // 样本 24h : .../2026/07/28/RFFC/medium/SEVP_NMC_RFFC_SNWFD_ETM_ACHN_L88_P9_20260728080002412.jpg
  // 样本 168h: .../2026/07/28/RFFC/medium/SEVP_NMC_RFFC_SNWFD_ETM_ACHN_L88_P9_20260728080016812.jpg
  // 规律 {日期}{起报HHmm(北京时)}{时效FFF}12 —— 与降水图同长(17位)，仅末两位常量由 00 变 12。
  // ⚠️ 此产品起报时次写的是北京时(非UTC)，故日期须按北京时计算，勿套用降水/雷达的 UTC 逻辑。
  tempFc: {
    title:'全国最高气温预报',
    srcPage:'https://www.nmc.cn/publish/temperature/hight/24hour.html',
    inits:['2000','0800'],  // 北京时起报时次, 新→旧探测
    lookbackDays:1,
    hours:[
      { fff:'024', label:'24小时 (第1天)' },
      { fff:'048', label:'48小时 (第2天)' },
      { fff:'072', label:'72小时 (第3天)' },
      { fff:'096', label:'96小时 (第4天)' },
      { fff:'120', label:'120小时 (第5天)' },
      { fff:'144', label:'144小时 (第6天)' },
      { fff:'168', label:'168小时 (第7天)' },
    ],
    note:'中央气象台最高气温预报，逐日北京时08/20时起报，图片时次由前端自动探测。农业关注：黄淮/华北夏玉米授粉期连续 35°C 以上高温会显著影响结实率；新疆棉区花铃期高温与昼夜温差；长江流域伏旱高温叠加。',
  },
  temp: {
    title:'全国逐时气温实况',
    srcPage:'https://www.nmc.cn/publish/observations/hourly-temperature.html',
    stepMin:60, lookbackMin:900, maxFrames:12,
    links:[
      { t:'全国逐日气温', u:'https://www.nmc.cn/publish/observations/day-temperature/avg.html' },
      { t:'近30天最高气温', u:'https://www.nmc.cn/publish/observations/high-30days.html' },
      { t:'近30天最低气温', u:'https://www.nmc.cn/publish/observations/low-30days.html' },
      { t:'近30天平均气温距平', u:'https://www.nmc.cn/publish/observations/mta-30days.html' },
    ],
    note:'逐小时实况气温(非预报)。夏季关注黄淮/华北夏玉米授粉期 35°C 以上高温时段、以及新疆棉区昼夜温差;冬季关注冬麦区霜冻与越冬条件。距平类产品见下方链接。',
  },
};

// ---------- 台风监测面板【嵌入动画/交互地图 · 图层切换】 ----------
// 主体为真实嵌入地图(iframe/动图)，非链接卡；顶部工具栏切换图层，链接仅兜底。
// 图层顺序：Ventusky风场 → Ventusky雨/雷达 → 中央气象台台风路径(交互) → JTWC警报图(静态兜底)。
// 注：Zoom Earth 用 SAMEORIGIN 禁止跨站iframe，故不作嵌入源(仅可外链)。
const TYPHOON_MONITOR = {
  note:'台风路径与强度以官方发布为准。面板嵌入实时/交互地图；若某图层空白或被浏览器拦截，请切换其他图层或点“打开来源”。JTWC 警报图为静态兜底(风暴消散后会失效)。',
  defaultLayer:'wind',
  layers:[
    { key:'wind', label:'风场', type:'iframe', title:'Ventusky 西北太平洋 风场(动画)',
      src:'https://www.ventusky.com/?p=23;125;4&l=wind-10m', srcName:'Ventusky', srcUrl:'https://www.ventusky.com/?p=23;125;4&l=wind-10m',
      alt:{ name:'earth.nullschool 风场动画', url:'https://earth.nullschool.net/#current/wind/surface/level/orthographic=125.00,23.00,1200' } },
    { key:'rain', label:'雨 · 雷达', type:'iframe', title:'Ventusky 西北太平洋 降水/雷达(动画)',
      src:'https://www.ventusky.com/?p=23;125;4&l=rain-3h', srcName:'Ventusky', srcUrl:'https://www.ventusky.com/?p=23;125;4&l=rain-3h' },
    { key:'track', label:'官方路径', type:'iframe', title:'中央气象台 台风路径(交互地图)',
      src:'https://typhoon.nmc.cn/web.html', srcName:'中央气象台台风网', srcUrl:'https://typhoon.nmc.cn/web.html' },
    { key:'warn', label:'静态警报图', type:'image', title:'JTWC 西北太平洋 活动风暴警报图',
      src:'https://www.metoc.navy.mil/jtwc/products/wp0926.gif', srcName:'JTWC', srcUrl:'https://www.metoc.navy.mil/jtwc/jtwc.html',
      note:'联合台风警报中心警报图，随每报更新。当前西北太平洋无命名活动风暴(台风"巴威"已于7月中消散)，此图可能为空，请以"官方路径"图层及来源为准' },
  ],
  cards:[
    { icon:'🌀', t:'中央气象台台风网', kind:'官方 · 实时路径/预报/集合', u:'http://typhoon.nmc.cn', d:'国内直连：实时定位、强度、预报路径与集合预报、警报信息', primary:true },
    { icon:'💨', t:'earth.nullschool 风场', kind:'全球风场动画', u:'https://earth.nullschool.net/#current/wind/surface/level/orthographic=125.00,23.00,1200', d:'西北太平洋近地面风场动画(备用)' },
    { icon:'🛰️', t:'JTWC 联合台风警报中心', kind:'西北太平洋警报图(英文)', u:'https://www.metoc.navy.mil/jtwc/jtwc.html', d:'警报、路径图与技术报文' },
  ],
};

// ============================================================
// 拾壹 · 极端天气 → 中国农产品影响推演【静态/人工维护 · 以官方预报为据，影响判断为本站条件性推断】
//   官方事实字段（srcName/official[]）必须逐字取自最新中期公报原文，本站不得改写/润色官方口径；
//   north[]/south[] 推演行中的"影响判断/机制/关注点"为本站分析，但所引官方事实必须与 official[] 一致；
//   level 高/中/低 = 官方预报对该产区覆盖的明确度；conf 高/中/低 = 本站推演的置信度。
//   影响判断一律用"偏有利/中性/偏不利"给方向、再给量级与置信度——
//      <b>不给单产百分比</b>——除非官方(中央气象台/农业农村部)自行发布了影响数字并注明出处。
//   置信度定义：高=官方预报已明确覆盖该产区且量级清晰；中=落区覆盖但强度或分布仍有分歧；
//              低=官方预报未明确覆盖该产区，仅由"其余大部偏少"等反推，指示性弱。
// 更新方式：每日随中期公报重新发布而刷新 issuedAt 与 official[]，再据此复核推演行。
// ============================================================
const CN_AGRI_OUTLOOK = {
  srcName:'中央气象台《中期天气预报》',
  srcUrl:'http://www.nmc.cn/publish/bulletin/mid-range.htm',
  issuedAt:'2026年8月9日 10时',
  forecaster:'预报：霍达 · 签发：鲍媛媛',
  checked:'2026-08-10',
  horizon:'未来10天(8/9-8/18) + 11-14天展望(8/19-8/22)',
  // 干旱严重程度指标图：农业干旱综合监测(AMDF)，逐日08时(0000UTC)，与土壤墒情同源探测逻辑
  droughtImg:{ label:'全国农业干旱综合监测', product:'AMDF',
    tpl:'https://image.nmc.cn/product/{Y}/{M}/{D}/AMDF/medium/SEVP_NMC_AMDF_SFER_EDRF_ACHN_L88_P9_{Y}{M}{D}000000000.jpg',
    srcPage:'http://www.nmc.cn/publish/agro/disastersmonitoring/Agricultural_Drought_Monitoring.htm',
    lookbackDays:5 },
  official:[
    { t:'过去10天实况 (7/30-8/8)', d:'西北地区东南部、东北地区中北部、黄淮西部、四川盆地、江汉、华南地区南部及云南南部累计降水 70～150毫米，部分超过200毫米，四川盆地北部与广东南部局地超过300毫米，上述大部较常年同期偏多；<b>我国其余大部降水偏少</b>。' },
    { t:'未来10天 (8/9-8/18)', d:'江南东北部、江淮、黄淮、华北、东北地区中南部、华南地区西南部及云南、西藏东南部累计降水 70～180毫米；部分地区160～300毫米，局地超过400毫米，浙江东部局地超过600毫米。<b>上述大部较常年同期偏多1～2倍，部分地区偏多3倍以上。</b>' },
    { t:'过程一：9-11日 台风"白海豚"', d:'浙江、上海、福建北部、江西北部、江苏、安徽、湖北东部、河南中东部、山东南部、河北南部有暴雨到大暴雨、局地特大暴雨，并伴雷暴大风等强对流；累计降水 200～400毫米，浙江东部局地可超600毫米。台风于9日晚至10日早晨在浙江舟山到福建福鼎一带沿海登陆（台风级或强台风级），登陆后向西偏北移动并逐渐减弱。' },
    { t:'过程二：12-16日 残涡+冷空气', d:'受台风减弱残涡和冷空气共同影响，<b>黄淮、华北、东北地区南部将有大到暴雨，部分大暴雨、局地特大暴雨</b>。' },
    { t:'11-14天展望 (8/19-8/22)', d:'华北东部、东北地区、黄淮东部、江淮、江南东部和南部、华南北部累计降雨 15～40毫米；华南中南部 40～90毫米，部分地区100毫米以上。' },
    { t:'其他台风', d:'第15号台风"灿鸿"将向日本东部沿海靠近，对我国无影响。' },
  ],
  north:[
    { crop:'🌽 玉米', region:'黄淮海（夏玉米）', stage:'吐丝期为主（NMC周报：河南21/23站吐丝）',
      driver:'9-11日豫中东/鲁南/冀南暴雨到大暴雨；12-16日黄淮、华北再遇大到暴雨、局地特大暴雨',
      impact:'偏不利', level:'高', conf:'中',
      mech:'两轮强降水与吐丝授粉窗口高度重合（生育期已由NMC周报核实：河南21/23站处吐丝期）。风险有三：①强降水+大风易致倒伏，吐丝期倒伏难以恢复；②持续阴雨寡照影响花粉活力与散粉，授粉不良直接减少穗粒数——NMC周报已指出本周华北东部/黄淮东部3-6天≥35℃"持续高温影响玉米抽雄开花"，热害与随后的涝渍形成连续胁迫；③低洼地块渍涝导致根系缺氧。对冲因素是前期黄淮偏旱得到彻底缓解。',
      watch:'重点看降水是否集中于抽雄盛期、以及雨后是否迅速转晴；若12-16日过程偏北或偏弱，风险等级可下调' },
    { crop:'🌽 玉米', region:'东北（春玉米）', stage:'抽雄吐丝-灌浆初期',
      driver:'未来10天东北中南部累计70～180毫米；12-16日东北南部大到暴雨',
      impact:'中性偏有利', level:'中', conf:'中',
      mech:'灌浆期需水量大，偏多降水总体利于籽粒建成与粒重累积，可延长灌浆有效期。但若局地出现大暴雨则转为涝渍与倒伏风险，且持续阴雨会压低日照时数、削弱光合与干物质积累。总体判断为"水分利好为主、局地涝渍为次"。',
      watch:'关注降水在东北南部与中部的分配；辽宁/吉林南部若出现集中特大暴雨，则该行需即时转为偏不利' },
    { crop:'🫘 大豆', region:'东北', stage:'结荚-鼓粒',
      driver:'同上：未来10天东北中南部70～180毫米，12-16日南部大到暴雨',
      impact:'中性', level:'中', conf:'中',
      mech:'鼓粒期为大豆产量形成最关键需水阶段，充沛降水利于荚粒充实、减少瘪粒。但大豆较玉米更忌涝，田间积水超时会引发落花落荚与根腐；且寡照对鼓粒的抑制强于玉米。利弊双向，净影响取决于降水强度分布而非总量。',
      watch:'关注是否出现连续3天以上阴雨寡照，以及低洼地块排水情况' },
    { crop:'🧵 棉花', region:'新疆', stage:'花铃期（盛铃）',
      driver:'官方未来10天预报落区<b>未包含新疆</b>；过去10天口径为"我国其余大部降水偏少"',
      impact:'中性偏有利', level:'低', conf:'低',
      mech:'新疆棉区以灌溉农业为主，天然降水权重低。晴热少雨在盛铃期通常利于成铃与减少烂铃，主要约束转为灌溉水源供给与是否出现极端高温逼熟。',
      watch:'因官方中期公报未明确覆盖新疆，本行置信度标为低；建议以"叁 中国预报图"的逐时气温与土壤墒情图自行校验，勿据本行做方向性结论' },
  ],
  south:[
    { crop:'🍬 白糖', region:'广西（甘蔗）', stage:'伸长期（需水关键期）',
      driver:'未来10天华南西南部累计70～180毫米；11-14天(8/19-22)华南中南部40～90毫米、部分超100毫米',
      impact:'偏有利', level:'中', conf:'中',
      mech:'甘蔗伸长期是全生育期需水最集中的阶段，此期水分充足直接决定蔗茎伸长与最终蔗产量。连续两个时段均有可观降水，且华南非本轮台风主要登陆影响区，属"有水无灾"的较优组合。',
      watch:'若后续台风路径西调至华南沿海，则风灾倒伏风险将取代水分利好成为主导项' },
  ],
  // 非本站常规监测品种，但本轮台风农业影响集中于此，单独作提示，不计入上方推演表
  note:'⚠️ 台风登陆区补充提示（非本站常规监测品种，仅作背景）：浙江、上海、江苏、安徽、江西北部为本轮 200～400毫米（浙东局地>600毫米）强降水核心区，当地单季稻/晚稻正处孕穗-抽穗期，设施蔬菜与柑橘等经济作物同步暴露于风雨双重胁迫，倒伏、淹涝与落果风险显著。该区域不在本面板监测作物清单内，故不列入上表，但其减产若成规模会经由国内粮价与蔬菜价格间接传导。',
};

// ---------- World Ag Weather 作物区15天预报图【图像 · ID自动探测】 ----------
// 仅对"当前 cropRegions 已存在 且 WAW 支持"的美国玉米/大豆产区嵌入(温度+降水两图)；不新增任何产区。
// key = `${crop}|${region.name}`（crop 用 cropRegions 的 crop 字段：玉米=corn、大豆=soybean）。
// 图片ID随时间变化：前端从锚点ID附近探测最新可用ID(probeImage)，失败则回退锚点。
const WAW_CROP_ANCHOR = { id:5095, margin:8, maxProbe:40 };
const WAW_CROP_CHARTS = {
  'corn|爱荷华(得梅因)':        { crop:'corn',     sub:'iowa' },
  'corn|伊利诺伊(斯普林菲尔德)': { crop:'corn',     sub:'illinois' },
  'corn|内布拉斯加(奥马哈)':     { crop:'corn',     sub:'nebraska' },
  'soybean|伊利诺伊':            { crop:'soybeans', sub:'illinois' },
  'soybean|爱荷华':              { crop:'soybeans', sub:'iowa' },
  'soybean|印第安纳':            { crop:'soybeans', sub:'indiana' },
  'soybean|明尼苏达':            { crop:'soybeans', sub:'minnesota' },
  'soybean|内布拉斯加':          { crop:'soybeans', sub:'nebraska' },
};
