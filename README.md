# weather-panel

建发农产品 · 农业气象智能监测面板 · 8大品种 107个产区实时气象 + 季节性分析

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
