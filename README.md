# weather-panel

建发农产品 · 农业气象智能监测面板 · 8大品种 107个产区实时气象 + 季节性分析

## 📋 日常更新（从这里开始）

- **数据自动更新**：GitHub Actions 每日 00:17 生成 `data/*.js`，**无需操作**
- **每周人工维护**：改 `fieldsight-data.js`（影响推演 / 人工事件 / 策略 / 新闻）→ `git commit` + `git push`
- **台风候选审核**（可选）：`python scripts/review_events.py` → push `data/special-events.js`
- **改动前**：先 `git pull`（同步 Actions 自动提交）再改；改完 `node scripts/_test_render.js` 验证
- 完整流程见 **docs/项目说明.md →「更新流程」**；未来优化方向见 `memo8.10.md`

## 本地入口

- `fieldsight.html`：研究报告风完整版（10 个板块，含中国天气多维度、特殊天气事件和台风监测）
- `assets/logo.png` / `assets/logo_full.png`：建发农产品本地品牌资源

推荐在项目根目录启动静态服务后访问：

```bash
python -m http.server 8080
```

打开 [http://localhost:8080/fieldsight.html](http://localhost:8080/fieldsight.html)。

## 升级状态

- 本地复刻版本：已同步至远程最新版（2026-08-10）
- `fieldsight.html`：✅ 10 板块完整版；已完成建发农产品研究报告风视觉升级
- 数据层：人工静态层 `fieldsight-data.js` + 自动层 `data/*.js`（GitHub Actions 每日自动生成）
