// ============================================================
// 静态数据层 — 由定时任务/人工定期刷新
// 最后更新: 2026-07-08 (数据来源见各板块)
// ============================================================
const STATIC_UPDATED = '2026-07-08';

// ---------- ENSO 总览 ----------
const ensoOverview = [
  { value:'+1.7°C',   label:'NINO3.4 周值 (6/17当周)', status:'厄尔尼诺已确立，持续增强' },
  { value:'-21.9',    label:'SOI 30天值 (至6/20)',      status:'强负值，大气海洋耦合确认' },
  { value:'100%',     label:'JJA-SON 厄尔尼诺概率',      status:'OND-DJF 仍高达99%' },
  { value:'中-强',    label:'预测峰值强度',              status:'次表层暖异常最高达+6°C' },
];

// ---------- 异常提醒 ----------
const alerts = [
  { level:'danger', title:'🔥 厄尔尼诺已确立并持续增强', detail:'NINO3.4周值已升至+1.7°C（6月17日当周），SOI 30天值-21.9，大气-海洋耦合确认。150°W-80°W次表层50-150m暖异常最高达+6°C，为持续增强提供能量。JJA-SON厄尔尼诺概率100%，预计至少持续至2026年10月，强度中等至强。', hint:'关注东南亚/澳洲干旱、印度季风减弱、南美异常降水对棕榈油、小麦、咖啡的供给冲击；峰值预计2026年秋冬' },
  { level:'warn', title:'🌽 美玉米进入吐丝授粉期，强降雨补墒但上部产区旱情扩大', detail:'USDA 7月6日作物进度：玉米优良率67%持平，16%已进入吐丝期、3%进入乳熟期；大豆优良率64%（降1个百分点），34%开花、9%结荚。未来数日爱荷华、南明尼苏达、西南威斯康星及北伊利诺伊有1.25-3英寸强降雨，利授粉期墒情；但中西部上部(upper Corn Belt)旱区扩大、南部新增异常干燥。气温虽有波动，NWS预计中西部大部气温偏高但少数地区才触及95°F胁迫阈值，多数产区墒情适宜至局部偏多。', hint:'授粉期（7月中下旬）雨热格局仍是美玉米单产定价核心；关注上部产区旱情扩张与周度优良率变化' },
  { level:'warn', title:'☕ 巴西霜冻担忧升温，阿拉比卡单日跳涨约10%重上$3/磅', detail:'巴西2026/27采收进度偏慢，截至7月初仅约52%采收完成（落后去年及五年均值），近期强降雨扰乱采收并或影响豆质，中旬预计再有降水。叠加7-8月南部霜冻高风险窗口（南米纳斯/塞拉多/圣保罗/巴拉那），投机资金对寒潮高度敏感，阿拉比卡期价单日跳涨近10%、创年初以来新高并重上$3/磅。', hint:'逐日跟踪巴西南部最低气温预报；EN年南部霜冻概率变化叠加缓慢采收是当前咖啡定价主线' },
  { level:'warn', title:'🌊 PDO 持续负相位', detail:'JMA月度PDO指数2026年5月为-0.83，自2020年以来负相位主导；2025年7月曾探底-3.23。负相位叠加厄尔尼诺，冬季环流形势复杂。', hint:'负PDO增强西伯利亚高压，冬季冷空气南下频率可能增加' },
  { level:'warn', title:'⚠️ IOD 中性但冬春转正风险', detail:'IOD指数-0.02（6月27日），当前中性。BOM等模型预测南半球冬春季（7-11月）可能发展为正IOD事件，与厄尔尼诺叠加。', hint:'正IOD+厄尔尼诺→东南亚/澳洲干旱加剧，棕榈油、澳麦风险放大' },
  { level:'danger', title:'🌀 超强台风"巴威"逼近吕宋海峡，本周五六(7/10-11)最接近台湾、周六夜趋向华东近上海登陆', detail:'第9号超强台风"巴威"（2026年第3个五级台风）7月6日在关岛附近罗塔岛登陆后西北行，7日已进入菲律宾责任区。7日联合台风警报中心显示其近中心风速仍达约240km/h(130kt)，未来12小时维持后因东北向切变逐步减弱，但风圈庞大(暴风圈直径约900km)。最新路径：10-11日经吕宋海峡走廊，周五(7/10)夜先掠过日本西南先岛群岛，周五至周六最接近台湾东北部（台湾中央气象署预计发布海上警报），周六(7/11)夜可能以热带风暴至弱台风强度在华东近上海一带登陆。华东沿海须自本周中后段起逐日跟踪。第10号"美莎克"已于7月3-4日登陆海南、越南后消散。', hint:'EN年台风偏强：华东关注棉花/水稻/物流与港口风险，登陆点与强度仍有变数需逐日核对；台湾东部、琉球、吕宋北部10-11日面临强降雨大风与风暴潮' },
];

// ---------- 海洋指数 ----------
const oceanIndices = [
  {
    name:'🔥 ENSO 厄尔尼诺-南方涛动', borderColor:'#ef4444',
    metrics:[{v:'+1.7°C',l:'NINO3.4 周值 6/17',c:'hi-temp'},{v:'厄尔尼诺',l:'当前相位',c:'hi-temp'},{v:'-21.9',l:'SOI (至6/20)',c:'hi-temp'},{v:'100%',l:'JJA-SON概率'}],
    risks:[{label:'高风险',cls:'risk-high'},{label:'持续增强',cls:'risk-severe'}],
    detail:'2026年6-7月完成向厄尔尼诺转换，多数模式预测中等至强事件，至少持续至10月，大概率跨入2027年初。次表层暖异常（最高+6°C）支撑继续增强。',
    sources:[{l:'IRI ENSO Forecast',u:'https://iri.columbia.edu/our-expertise/climate/forecasts/enso/current/'},{l:'NOAA CPC',u:'https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml'},{l:'BOM',u:'https://www.bom.gov.au/climate/enso/'}]
  },
  {
    name:'🌊 PDO 太平洋年代际振荡', borderColor:'#f59e0b',
    metrics:[{v:'负相位',l:'当前相位'},{v:'-0.83',l:'2026年5月 (JMA)',c:'hi-temp'},{v:'-3.23',l:'2025年7月极值'},{v:'2020年起',l:'负相位主导'}],
    risks:[{label:'中风险',cls:'risk-mid'},{label:'长期影响',cls:'risk-high'}],
    detail:'JMA月度指数2026年1-5月为-0.57/-0.27/-0.53/-0.47/-0.83，负相位延续。负PDO通常增强西伯利亚高压、影响北太平洋风暴路径。',
    sources:[{l:'JMA PDO',u:'https://ds.data.jma.go.jp/tcc/tcc/products/elnino/decadal/pdo_month.html'},{l:'NOAA NCEI PDO',u:'https://www.ncei.noaa.gov/access/monitoring/pdo/'}]
  },
  {
    name:'🌀 NAO 北大西洋振荡', borderColor:'#8b5cf6',
    metrics:[{v:'正相位',l:'2026年春季'},{v:'+2.69',l:'2026年3月'},{v:'+1.39',l:'2026年4月'},{v:'关注',l:'夏季走向'}],
    risks:[{label:'中风险',cls:'risk-mid'},{label:'季节性',cls:'risk-low'}],
    detail:'2026年春季NAO强正相位（3月+2.69为近年高值）。正NAO→美东偏暖、南欧偏干；对黑海、欧洲麦区降水格局有间接影响。',
    sources:[{l:'NOAA CPC NAO',u:'https://www.cpc.ncep.noaa.gov/products/precip/CWlink/pna/nao.shtml'}]
  },
  {
    name:'🌏 IOD 印度洋偶极子', borderColor:'#10b981',
    metrics:[{v:'中性',l:'当前相位'},{v:'-0.02',l:'DMI (6/27)'},{v:'冬春季',l:'或转正相位'},{v:'需关注',l:'与EN叠加'}],
    risks:[{label:'当前低风险',cls:'risk-low'},{label:'潜在风险',cls:'risk-mid'}],
    detail:'当前中性，但模型预测南半球冬春季可能发展为正IOD，时间与强度分歧较大。正IOD+厄尔尼诺→东南亚/澳洲干旱显著加剧。',
    sources:[{l:'BOM IOD',u:'https://www.bom.gov.au/climate/iod/'}]
  },
];

// ============================================================
// 美国天气图集 — 全部 NOAA/官方稳定外链，无运行ID，免维护
// ============================================================
const usWeatherImages = [
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
// World Ag Weather — GEFS 集合预报图 (运行ID自动探测)
// 锚点: 2026-07-02 时 ID=3121; 每天约递增2-4个, 旧图保留
// 页面加载时从估算上界向下探测第一个可用ID
// ============================================================
const WAW_CONFIG = {
  anchorId: 3121,
  anchorDate: '2026-07-02',
  perDay: 4,        // 每日ID增量上限估计
  margin: 6,        // 探测上界额外余量
  maxProbe: 60,     // 最多向下探测次数
  probeTpl: 'https://www.worldagweather.com/fcstwx/pcp_gefs_day1_q50_us_{ID}.png',
  groups: [
    { group:'🌧️ 美国7天降水预报 (GEFS集合)', source:'World Ag Weather · 运行ID自动探测',
      images:[
        { title:'第1天累计降水', tpl:'https://www.worldagweather.com/fcstwx/pcp_gefs_day1_q50_us_{ID}.png', note:'GEFS 21成员集合预报中位数' },
        { title:'第3天累计降水', tpl:'https://www.worldagweather.com/fcstwx/pcp_gefs_day3_q50_us_{ID}.png', note:'GEFS 集合预报第3天' },
        { title:'第7天累计降水', tpl:'https://www.worldagweather.com/fcstwx/pcp_gefs_day7_q50_us_{ID}.png', note:'GEFS 集合预报第7天' },
      ]
    },
    { group:'🌡️ 美国7天温度预报 (GEFS集合)', source:'World Ag Weather · 运行ID自动探测',
      images:[
        { title:'7天平均温度', tpl:'https://www.worldagweather.com/fcstwx/tmp_gefs_day7_us_{ID}.png', note:'GEFS 集合预报平均温度' },
        { title:'7天最高温度', tpl:'https://www.worldagweather.com/fcstwx/tmax_gefs_day7_us_{ID}.png', note:'GEFS 集合预报最高温' },
        { title:'7天最低温度', tpl:'https://www.worldagweather.com/fcstwx/tmin_gefs_day7_us_{ID}.png', note:'GEFS 集合预报最低温' },
      ]
    },
    { group:'📊 美国降水距平 (GFS)', source:'World Ag Weather · 固定URL无需ID',
      images:[
        { title:'GFS 降水距平', tpl:'https://www.worldagweather.com/fcstwx/fcstpcp_anom_gfs_us.png', note:'GFS模型降水与气候态对比，红=偏干/蓝=偏湿' },
      ]
    },
  ]
};

// ---------- 生育期日历 ----------
const cropCalendar = [
  { crop:'🌴 棕榈油', region:'马来西亚/印尼', season:'全年生长', sensitive:'果实膨大/授粉', risk:'厄尔尼诺干旱→果粒变小、含油率下降（滞后6-12个月显现）', enso:'EN已确立→东南亚干旱风险最高' },
  { crop:'🧵 棉花', region:'中国新疆', season:'花铃期', sensitive:'高温干旱', risk:'花铃期高温影响授粉与铃重', enso:'北半球夏季偏暖' },
  { crop:'🌽 玉米', region:'中国东北', season:'拔节期', sensitive:'7月下旬抽雄授粉', risk:'当前光热适宜，关注后期高温', enso:'东北积温正常有利' },
  { crop:'🌽 玉米', region:'黄淮海', season:'苗期(三叶-七叶)', sensitive:'高温影响幼苗', risk:'35°C+高温不利壮苗', enso:'黄淮盛夏偏热风险' },
  { crop:'🌽 玉米', region:'美国玉米带', season:'抽雄-吐丝期(16%已吐丝)', sensitive:'7月中下旬授粉', risk:'优良率67%持平；上部产区旱情扩大，强降雨将补墒', enso:'气温偏高但少数才达95°F胁迫；近日1.25-3英寸降雨' },
  { crop:'🫘 大豆', region:'中国东北', season:'分枝-初花期', sensitive:'开花结荚期水分', risk:'当前墒情适宜', enso:'关注8月干旱风险' },
  { crop:'🫘 大豆', region:'美国中西部', season:'开花初期', sensitive:'高温干旱', risk:'热浪影响开花', enso:'当前整体有利，后期关注' },
  { crop:'🌾 小麦', region:'中国黄淮海', season:'已收获', sensitive:'—', risk:'收获完毕，腾茬夏播', enso:'新麦上市，关注质量' },
  { crop:'🌾 小麦', region:'澳大利亚', season:'播种-分蘖期', sensitive:'冬春降水', risk:'厄尔尼诺→澳洲干旱是最大风险', enso:'EN年澳麦减产概率大' },
  { crop:'🌾 小麦', region:'黑海(俄/乌)', season:'灌浆-收获期', sensitive:'收获期降水/高温', risk:'收获窗口天气', enso:'间接影响较弱' },
  { crop:'☕ 咖啡', region:'巴西米纳斯', season:'采收期(5-9月，进度约52%偏慢)', sensitive:'霜冻', risk:'霜冻担忧升温，阿拉比卡单日跳涨约10%重上$3/磅；中旬再有降水扰动采收', enso:'EN年巴西南部霜冻概率变化需跟踪' },
  { crop:'🍬 白糖', region:'中国广西', season:'甘蔗伸长期', sensitive:'7-9月需水关键期', risk:'伸长期干旱直接损失蔗茎产量', enso:'EN年华南秋冬偏干需警惕' },
  { crop:'🍬 白糖', region:'印度/泰国', season:'季风生长期', sensitive:'季风降水', risk:'EN年季风偏弱→印泰糖产量下调', enso:'EN历史上利多国际糖价' },
];

// ============================================================
// 产区配置 — 按省份/国家分组; gddStart=生长季起始日(null=多年生/非生长季, 用滚动37天)
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
      { province:'印度', regions:[ { name:'德干高原(浦那)', lat:18.52, lon:73.86, gddStart:'2026-06-15', phase:'<b>发育期</b>：季风播种-苗期。EN年季风偏弱是最大风险。' } ]},
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
      { province:'印度', regions:[
        { name:'马哈拉施特拉邦(科尔哈普尔)', lat:16.70, lon:74.24, gddStart:null, phase:'<b>物候</b>：季风生长期。<b>风险</b>：EN年季风偏弱→单产与出糖率下调。' },
        { name:'卡纳塔克邦(贝尔高姆)', lat:15.85, lon:74.50, gddStart:null, phase:'<b>物候</b>：季风生长期。' },
        { name:'北方邦(勒克瑙)', lat:26.85, lon:80.95, gddStart:null, phase:'<b>物候</b>：季风生长期。印度最大产糖邦。' },
      ]},
      { province:'泰国', regions:[
        { name:'东北部(孔敬)', lat:16.44, lon:102.84, gddStart:null, phase:'<b>物候</b>：雨季生长期。<b>风险</b>：EN年泰国降水偏少→出口量收缩。' },
        { name:'北部(甘烹碧)', lat:16.48, lon:99.52, gddStart:null, phase:'<b>物候</b>：雨季生长期。' },
        { name:'中部(北碧)', lat:14.02, lon:99.53, gddStart:null, phase:'<b>物候</b>：雨季生长期。' },
      ]},
    ]
  },
];

// ============================================================
// 农业新闻 — 仅保留 24-48 小时内消息（定期刷新, 更新于 2026-07-08）
// ============================================================
const AG_NEWS = [
  {
    title: '超强台风"巴威"锁定台湾与华东：周五六(7/10-11)最接近台湾，周六夜或近上海登陆，沿途减弱但风圈庞大',
    link: 'https://weather.com/2026/07/07/storms/hurricane/super-typhoon-bavi-northern-marianas-guam-taiwan-china-forecast',
    date: '7月7日',
    source: 'The Weather Channel',
    sourceClass: 'fao',
  },
  {
    title: '巴西霜冻担忧升温：阿拉比卡单日跳涨约10%重上$3/磅，采收仅约52%落后进度、中旬再有降水',
    link: 'https://www.riotimesonline.com/coffee-prices-2026-brazil-weather-spike/',
    date: '7月7日',
    source: 'Rio Times',
    sourceClass: 'agweb',
  },
  {
    title: 'CBOT大豆升破$11.8/蒲创五周新高：中储粮/中粮补订美豆船货、美中西部天气分歧提供支撑',
    link: 'https://tradingeconomics.com/commodity/soybeans',
    date: '7月7日',
    source: 'Trading Economics',
    sourceClass: 'agweb',
  },
  {
    title: '马棕油期货跌破4,500林吉特：印尼B50生物柴油7月1日生效、7月1-5日出口环比增10.6-11.1%提供支撑',
    link: 'https://www.brecorder.com/news/amp/40425700',
    date: '7月6日',
    source: 'Business Recorder',
    sourceClass: 'fao',
  },
  {
    title: 'USDA作物进度(截至7/5)：美玉米优良率67%持平、16%吐丝3%乳熟；大豆64%优良、34%开花',
    link: 'https://www.brownfieldagnews.com/news/67-of-u-s-corn-64-of-soybeans-good-to-excellent/',
    date: '7月6日',
    source: 'Brownfield/USDA',
    sourceClass: 'usda',
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
