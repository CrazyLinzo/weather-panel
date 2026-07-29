// ============================================================
// 静态数据层 — 由定时任务/人工定期刷新
// 最后更新: 2026-07-03 (数据来源见各板块)
// ============================================================
const STATIC_UPDATED = '2026-07-03';

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
  { level:'warn', title:'🌡️ 美国玉米带遭遇创纪录热浪', detail:'约1.75亿人在7月4日假期前后面临创纪录高温，覆盖玉米带大部。玉米即将进入授粉关键期，高温干旱或使优良率从当前68%回落。预计7月4日后热浪缓和，7月中旬有降温降雨。', hint:'授粉期（7月中下旬）天气是美玉米单产定价核心变量，关注CBOT天气升水' },
  { level:'warn', title:'🌊 PDO 持续负相位', detail:'JMA月度PDO指数2026年5月为-0.83，自2020年以来负相位主导；2025年7月曾探底-3.23。负相位叠加厄尔尼诺，冬季环流形势复杂。', hint:'负PDO增强西伯利亚高压，冬季冷空气南下频率可能增加' },
  { level:'warn', title:'⚠️ IOD 中性但冬春转正风险', detail:'IOD指数-0.02（6月27日），当前中性。BOM等模型预测南半球冬春季（7-11月）可能发展为正IOD事件，与厄尔尼诺叠加。', hint:'正IOD+厄尔尼诺→东南亚/澳洲干旱加剧，棕榈油、澳麦风险放大' },
  { level:'danger', title:'🌀 台风季启动：南海低压登陆海南', detail:'南海热带低压于7月3日下午至晚上在海南岛东部沿海登陆；菲律宾以东扰动96W预计发展为今年首个显著影响我国的台风。全年预计生成24-26个台风，7-9个登陆我国，来得晚、强度大。', hint:'厄尔尼诺年台风生成偏东偏强，盛夏警惕北上台风影响华东农业产区' },
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
  { crop:'🌽 玉米', region:'美国玉米带', season:'拔节-抽雄前', sensitive:'7月中下旬授粉', risk:'热浪正在经过，优良率68%持平', enso:'7月4日后热浪缓和，中旬多雨降温' },
  { crop:'🫘 大豆', region:'中国东北', season:'分枝-初花期', sensitive:'开花结荚期水分', risk:'当前墒情适宜', enso:'关注8月干旱风险' },
  { crop:'🫘 大豆', region:'美国中西部', season:'开花初期', sensitive:'高温干旱', risk:'热浪影响开花', enso:'当前整体有利，后期关注' },
  { crop:'🌾 小麦', region:'中国黄淮海', season:'已收获', sensitive:'—', risk:'收获完毕，腾茬夏播', enso:'新麦上市，关注质量' },
  { crop:'🌾 小麦', region:'澳大利亚', season:'播种-分蘖期', sensitive:'冬春降水', risk:'厄尔尼诺→澳洲干旱是最大风险', enso:'EN年澳麦减产概率大' },
  { crop:'🌾 小麦', region:'黑海(俄/乌)', season:'灌浆-收获期', sensitive:'收获期降水/高温', risk:'收获窗口天气', enso:'间接影响较弱' },
  { crop:'☕ 咖啡', region:'巴西米纳斯', season:'采收期(5-9月)', sensitive:'霜冻', risk:'7-8月为巴西霜冻高风险窗口', enso:'EN年巴西南部霜冻概率变化需跟踪' },
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
        { name:'爱荷华(得梅因)', lat:41.59, lon:-93.62, gddStart:'2026-05-01', phase:'<b>发育期</b>：拔节-抽雄前期，7月中下旬进入授粉关键期。<b>风险</b>：本周创纪录热浪。' },
        { name:'伊利诺伊(斯普林菲尔德)', lat:39.78, lon:-89.65, gddStart:'2026-05-01', phase:'<b>发育期</b>：拔节-抽雄前期。优良率68%持平。' },
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
        { name:'伊利诺伊', lat:39.78, lon:-89.65, gddStart:'2026-05-10', phase:'<b>发育期</b>：开花初期(R1)。<b>风险</b>：本周热浪。' },
        { name:'爱荷华', lat:41.59, lon:-93.62, gddStart:'2026-05-10', phase:'<b>发育期</b>：开花初期(R1)。' },
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
// 农业新闻 — 仅保留 24-48 小时内消息（定期刷新, 更新于 2026-07-03）
// ============================================================
const AG_NEWS = [
  {
    title: '美玉米带遭遇创纪录热浪：约1.75亿人受影响，授粉期临近推升天气升水',
    link: 'https://www.farmprogress.com/markets-and-quotes/afternoon-market-recap',
    date: '7月2日',
    source: 'Farm Progress',
    sourceClass: 'agweb',
  },
  {
    title: '南海热带低压今日登陆海南，2026年台风季正式启动（全年预计24-26个）',
    link: 'https://typhoon.nmc.cn/web.html',
    date: '7月3日',
    source: '中央气象台',
    sourceClass: 'fao',
  },
  {
    title: 'CBOT小麦延续涨势：7月芝加哥软红麦收于$5.92/蒲，堪萨斯硬红麦$6.23',
    link: 'https://www.farmprogress.com/markets-and-quotes/afternoon-market-recap',
    date: '7月2日',
    source: 'CBOT行情',
    sourceClass: 'usda',
  },
  {
    title: 'USDA作物评级：美玉米优良率68%持平，市场聚焦7月中旬授粉窗口',
    link: 'https://www.profarmer.com/pro-farmer-max/crops-analysis/crops-analysis-nearby-corn-forges-contract-low-close',
    date: '7月1日',
    source: 'USDA/Pro Farmer',
    sourceClass: 'usda',
  },
  {
    title: '美国乙醇日产量升至111.7万桶，创3月初以来新高，提振玉米工业需求',
    link: 'https://www.farmprogress.com/markets-and-quotes/morning-market-review',
    date: '7月2日',
    source: 'EIA/Farm Progress',
    sourceClass: 'agweb',
  },
  {
    title: '气象预报：7月4日假期后玉米带热浪缓和，中旬西太台风活动或拉低美国气温',
    link: 'https://www.farmprogress.com/marketing/july-heat-dry-periods-threaten-corn-pollination',
    date: '7月2日',
    source: 'Farm Progress',
    sourceClass: 'fao',
  },
];
