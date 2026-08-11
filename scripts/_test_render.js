#!/usr/bin/env node
/**
 * 前端渲染回归测试（node vm）
 * 加载数据层 + 从 fieldsight.html 提取关键 render 函数执行，断言自动同步输出。
 * 用法: node scripts/_test_render.js
 * 覆盖: renderCalendar(USDA 美国三行) / renderCnAgriOutlook(midrange official 分段)
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const htmlPath = path.join(ROOT, 'fieldsight.html');

function extractFunc(src, name) {
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`${name} not found`);
  const brace = src.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error(`${name} brace mismatch`);
}
function extractConst(src, name) {
  const start = src.indexOf(`const ${name} = [`);
  const end = src.indexOf('];', start) + 2;
  return src.slice(start, end);
}

const html = fs.readFileSync(htmlPath, 'utf8');

// 1) 数据层 + 辅助常量/函数
const data = [
  'fieldsight-data.js',
  'data/crop-progress.js',
  'data/cn-outlook.js',
  'data/special-events.js',
  'data/auto-fetch.js',
  'data/history.js',
].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const calendarMatch = extractConst(html, 'calendarMatch');
const outlookRow = extractFunc(html, 'outlookRow');
const hideSec = extractFunc(html, 'hideSec');
const renderCalendarFn = extractFunc(html, 'renderCalendar');
const renderCnAgriOutlookFn = extractFunc(html, 'renderCnAgriOutlook');
const renderSpecialEventsFn = extractFunc(html, 'renderSpecialEvents');

let code = data + '\n' + calendarMatch + '\n' + outlookRow + '\n' + hideSec + '\n'
  + 'var resolveOutlookDrought = async function () {};\n'
  + renderCalendarFn + '\n' + renderCnAgriOutlookFn + '\n' + renderSpecialEventsFn + `
var __cal = (function () { try { renderCalendar([]); return document.getElementById('calendarSection').innerHTML; } catch (e) { return 'ERR:' + e.message; } })();
var __cn = (function () { try { renderCnAgriOutlook(); return document.getElementById('cnOutlookSection').innerHTML; } catch (e) { return 'ERR:' + e.message; } })();
var __ev = (function () { try { renderSpecialEvents(); return document.getElementById('eventsSection').innerHTML; } catch (e) { return 'ERR:' + e.message; } })();
this.__cal = __cal; this.__cn = __cn; this.__ev = __ev;
`;

const els = {};
const documentMock = {
  getElementById: id => (els[id] || (els[id] = { innerHTML: '', style: {}, querySelector: () => null, querySelectorAll: () => [] })),
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }),
};
const sandbox = {
  document: documentMock,
  console,
  window: { location: { href: '' } },
  location: { href: '' },
  setTimeout, clearTimeout, setInterval, clearInterval,
  Chart: function () {},
  fetch: async () => ({ ok: false }),
  URLSearchParams, AbortController,
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: '_test_render.js' });

const cal = sandbox.__cal;
const cn = sandbox.__cn;
const ev = sandbox.__ev;
if (cal.startsWith('ERR') || cn.startsWith('ERR') || ev.startsWith('ERR')) {
  console.error('cal:', cal.slice(0, 300), '\ncn:', cn.slice(0, 300), '\nev:', ev.slice(0, 300));
  process.exit(1);
}

const checks = [
  // ---------- renderCalendar · USDA 美国三行 ----------
  ['玉米带 season', cal.includes('⚡ 乳熟61%、凹陷16%（8/9，5年均55%/12%）')],
  ['大豆 season', cal.includes('⚡ 结荚74%（8/9，5年均69%）')],
  ['春麦 season', cal.includes('⚡ 收获24%（8/9，5年均19%）')],
  ['玉米带 risk', cal.includes('USDA：优良率61%（8/9，自动同步）') && cal.includes('授粉已收尾')],
  ['大豆 risk', cal.includes('USDA：优良率62%（8/9，自动同步）') && cal.includes('8/10下调风险')],
  ['春麦 risk', cal.includes('USDA：优良率51%（8/9，自动同步）') && cal.includes('两口径背离')],
  ['失效对比已删', !cal.includes('创季内新低') && !cal.includes('持平前周') && !cal.includes('较前周回升')],
  ['中国行不受影响', cal.includes('吐丝期') && cal.includes('全年抽穗结果')],

  // ---------- renderCnAgriOutlook · midrange official ----------
  ['自动发布标注', cn.includes('2026年08月11日10时（⚡自动同步）')],
  ['第1条实况人工保留', cn.includes('过去10天实况')],
  ['自动段 未来10天', cn.includes('未来10天') && cn.includes('8月11-20日')],
  ['自动段 过程11-12日', cn.includes('过程：11-12日')],
  ['自动段 高影响', cn.includes('浙苏皖鄂豫冀鲁等地有强降雨')],
  ['自动段 台风预报', cn.includes('台风预报')],
  ['自动段带⚡标记', cn.includes('⚡自动</span>')],
  ['第1条无⚡标记', !cn.includes('过去10天实况</div><div class="ol-fact-d">')],
  ['forecaster 自动', cn.includes('预报：霍达 · 签发：鲍媛媛')],

  // ---------- renderSpecialEvents · 合并渲染 ----------
  ['自动台风事件已合并', ev.includes('台风"白海豚"(2613) 热带低压') && ev.includes('⚡自动')],
  ['人工事件保留(8/9)', ev.includes('台风"白海豚"8/9浙江两度登陆')],
  ['人工事件保留(8/10 WASDE)', ev.includes('WASDE成关键节点')],
  ['过期事件已过滤(8/3)', !ev.includes('墒情偏紧延续')],
  ['过期事件已过滤(7/16)', !ev.includes('巴西南部霜冻窗口')],
];

let pass = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? '✅' : '❌'} ${name}`);
  if (ok) pass++;
}
console.log(`\n${pass}/${checks.length} 通过`);
process.exit(pass === checks.length ? 0 : 1);
