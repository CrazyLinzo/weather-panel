#!/usr/bin/env node
/**
 * 前端渲染回归测试（node vm）
 * 加载 fieldsight-data.js + data/crop-progress.js(+auto-fetch/history)，
 * 从 fieldsight.html 提取 renderCalendar 函数体执行，断言美国三行的自动同步输出。
 * 用法: node scripts/_test_render.js
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

// 1) 数据层 + calendarMatch
const data = [
  'fieldsight-data.js',
  'data/crop-progress.js',
  'data/auto-fetch.js',
  'data/history.js',
].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');

const html = fs.readFileSync(htmlPath, 'utf8');
const cmStart = html.indexOf('const calendarMatch = [');
const cmEnd = html.indexOf('];', cmStart) + 2;
const calendarMatch = html.slice(cmStart, cmEnd);

// 2) 提取 renderCalendar 完整函数
const fn = extractFunc(html, 'renderCalendar');

// 3) 组装可执行代码
let code = data + '\n' + calendarMatch + '\n' + fn + `
var __cal = (function () {
  try {
    renderCalendar([]);
    return document.getElementById('calendarSection').innerHTML;
  } catch (e) { return 'ERROR: ' + e.message + '\\n' + (e.stack || ''); }
})();
this.__cal = __cal;
`;

// 4) DOM mock
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

const out = sandbox.__cal;
if (!out || out.startsWith('ERROR')) {
  console.error(out || '(empty output)');
  process.exit(1);
}

// 5) 断言
const checks = [
  // season 自动注入
  ['玉米带 season', out.includes('⚡ 乳熟61%、凹陷16%（8/9，5年均55%/12%）')],
  ['大豆 season', out.includes('⚡ 结荚74%（8/9，5年均69%）')],
  ['春麦 season', out.includes('⚡ 收获24%（8/9，5年均19%）')],
  // risk USDA 句重建 + 保留本站补充
  ['玉米带 risk', out.includes('USDA：优良率61%（8/9，自动同步）') && out.includes('本站补充') && out.includes('授粉已收尾')],
  ['大豆 risk', out.includes('USDA：优良率62%（8/9，自动同步）') && out.includes('8/10下调风险')],
  ['春麦 risk', out.includes('USDA：优良率51%（8/9，自动同步）') && out.includes('两口径背离')],
  // srcDate 自动覆盖
  ['玉米带 srcDate', out.includes('USDA August 10, 2026发布（自动，数据至8/9）')],
  // 失效对比表述必须删除（列事实原则）
  ['大豆对比删除', !out.includes('持平前周')],
  ['春麦对比删除', !out.includes('较前周回升')],
  ['玉米带对比删除', !out.includes('创季内新低')],
  // 中国行不受影响（仍为人工文本）
  ['中国东北保留', out.includes('吐丝期')],
  ['棕榈油保留', out.includes('全年抽穗结果')],
];

let pass = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? '✅' : '❌'} ${name}`);
  if (ok) pass++;
  else {
    const probe = typeof out === 'string' && out.length < 60000 ? out : '(too long)';
    if (probe !== '(too long)') { /* 打印相关行便于定位 */
    }
  }
}
console.log(`\n${pass}/${checks.length} 通过`);
process.exit(pass === checks.length ? 0 : 1);
