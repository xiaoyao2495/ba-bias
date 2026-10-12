# BA_BIAS_DASHBOARD_SIMPLIFICATION_V1

最终状态：**DASHBOARD_SIMPLIFICATION_V1_PARTIAL**。

三入口界面已实施，新增展示及原有Web测试通过，实际浏览器渲染通过。完整套件仍有10项已存在的基线失败；指定23:00历史数据本地不存在，iPhone Safari实机尚未验证。没有把这些限制标记为通过。

## 页面与最小改动

原实现：概览、排名、运行档案、系统观察及Symbol研究子页面；底部4入口。新实现：

| 入口 | 内容 |
|---|---|
| `/` 观察 | 简洁扫描状态、最近完成运行真正SELECTED且V4 VALIDATED的研究，按保存排名显示最多3张卡片 |
| `/selector` 排名 | 原始排名、分数、主要异常类别、入选状态；评分与证据默认折叠，未通过候选单列折叠 |
| `/history` 历史 | 按币种搜索真实研究时间线 / 按运行查看档案 |
| `/symbol/:symbol` | 原有完整Facts、V4、支持/竞争Evidence、重新评估、方向失效、实际情报分片及跨轮记录 |
| `/runs`、`/runs/:runId` | 原有运行路由仍可访问，完整漏斗与技术详情保留 |
| `/system` | 顶部状态图标进入，摘要可见，Scanner技术诊断、Token、Outbox详情折叠 |

底部仅观察、排名、历史，固定导航与safe-area保留。所有时间使用北京时间。查询保存在URL，切换主入口保留先前查询；浏览器Back不新增历史项。缓存保存实际DOM节点与事件处理器，网络失败时仍保留已加载事实和可用控件，并明确提示数据已过期。30秒轮询沿用，仅用于观察及系统页。

### 修改 / 新增文件

- 修改 `web/index.html`：三导航及顶部诊断。
- 修改 `web/assets/app.js`：页面信息层级、观察卡片、资格分类、历史聚合、定性强度映射、缓存与导航状态。
- 修改 `web/assets/style.css`：紧凑卡片、三列指标、移动宽度与安全区。
- 新增 `web/assets/presentation.js`：纯展示校验、确定性标签、摘要及观察空状态适配；无网络、业务写入或评分。
- 修改 `src/web/server.js`：仅新增静态资源 `/assets/presentation.js` 映射和 `/history` 页面路由。所有API处理分支、响应字段、认证、限流、CSP原样保留。
- 新增 `test/dashboard-simplification.test.js`：38项自动化测试。
- 新增 `scripts/dashboard-simplification-visual.js`、`scripts/dashboard-simplification-scenarios.js`：显式执行的隔离浏览器验收工具，不属于服务端依赖，使用已有Playwright/Chrome，不新增运行依赖。
- 新增本报告、测试报告及独立validation证据目录。

没有修改Reader、Web认证、安全配置、package.json、依赖、.gitignore或任何原有测试。没有更新旧哈希或基线。

## 观察数据选择与缺失处理

通过现有API读取最新运行和最近24轮索引，选取最近一轮明确finished且非RUNNING的运行，读取其保存的Selector入选与研究详情。只显示同Run、SELECTED、V4 VALIDATED的研究，不把Outbox的上轮卡片当成本轮，不用现行Selector重算旧运行。完成索引与详情状态不一致时关闭卡片展示并提示重试。

最新运行未完成时明确提示，完成运行的卡片标注独立RunId。无合格候选、无入选对象、有入选但V4不可用、无历史、未完成、停止、过期均有独立文案。没有有效本轮卡片时，上次有效研究只作为独立历史链接，并标其原始RunId及时间。

最近24轮无完成记录时标注查询范围，不假称全历史无记录。历史Timeline沿用API最近500轮覆盖和分页，部分覆盖明确展示。旧Run没有Selector分数不重算；无有效V4不构成方向翻转。缺失Story Type、指标或Evidence明确未记录/暂无数据。

卡片最多3张是展示层上限，所有其余记录仍在排名/历史/详情可访问；未改变Selector Top K、业务输出数量或投递策略。

## 事实标签与摘要映射

| 展示 | 原始依据及约束 |
|---|---|
| 1h上涨/下跌、OI扩张/收缩 | 保存的price1h、oi1h数值符号；精确1h定义、对应Evidence值和采样时间必须一致。零只称未变，不创造“变化有限”的阈值 |
| 1h成交量倍数 | 已收盘1h成交量 / 前24根小时K线均值，`×`单位；不使用5m量替代 |
| 1h放量 | 保存的VOLUME_SPIKE必须引用该relative1h Evidence；不重新判断阈值，不根据倍数解释买卖盘 |
| 全市场账户偏多/偏空 | GLOBAL_ACCOUNTS、period=1h、quality.available、对应整点样本、有效百分比及global.long.latest Evidence；不把持仓份额或百分点当账户占比 |
| 账户分歧 | 已保存TOP_GLOBAL_DIVERGENCE，明确TOP_TRADER_ACCOUNTS_VS_GLOBAL_ACCOUNTS口径，两边样本同整点且质量有效，Evidence存在。不会仅凭差异自行判异常 |
| 正/负结算资金费率 | settledLatest、actual settlement、%单位、真实Evidence和非未来有效采样；不拿展示Funding代替结算 |
| 结算Funding异常 | 原有FUNDING_EXTREME必须引用同一已结算Evidence；不设新异常阈值 |

最多4标签；每个标签的Evidence IDs保留在链接title，可点击原Symbol详情Evidence。摘要直接组合这些可追溯标签，不调用Writer、不增加预测逻辑。没有可信依据就省略标签。成交量偏弱/无显著异常、价格/OI变化有限等未记录的分类不会按自创阈值补造。

指标值先检查数值、单位、定义、Evidence结果一致及全部采样不晚于原始dataCutoff。价格/OI窗口严格为1h；已收盘价格末点是整点前1ms，OI是整点。采集截止时间晚数秒时仍保留原始dataCutoff，通过实际已收盘小时边界核对，而非把截止时间改为采样时间。Funding旧于8h不作为首页当前标签，详情原始记录仍可读。不同窗口和未来样本不作为可靠首页指标。

V4只展示保存方向与强度：LOW低、MODERATE中等、HIGH高，无胜率换算。NO_EDGE仍是无清晰优势；ANALYST_UNAVAILABLE不变成NO_EDGE。观察点复用保存的tradeOpportunity，不生成新的形态。完整NO_EDGE重新评估语义保留，通用方向失效仍不展示。

## 真实历史验证

本地不存在 `data/runs/hourly_20261011_2300`，因此未声称SUSDT +4.98% / MAGICUSDT +3.40%等指定线索已验证，也没有创建这些记录。

实际读取19:00和20:00已有6个研究对象，价格、OI数量、成交量倍数、方向、强度、故事类型和标签与原始Facts/V4关联。证据见 `validation/BA_BIAS_DASHBOARD_SIMPLIFICATION_V1/real-replay.json`。

LUMIAUSDT：14:00保存BULLISH、1h、MODERATE → 19:00保存BEARISH、1h、LOW。时间线显示同周期研究演化，未宣称市场已确认反转。19:00实际1h价格-10.24358287%、OI数量-6.50802142%、成交量2.09553496×。20:00首页使用SENTUSDT、USUSDT、CFXUSDT的真实已保存研究。

## 验收与边界

- 完整测试：**1032项，1022通过，10失败，0取消，0跳过**。旧10项独立记录，不属于UI功能通过证明。
- 展示/Web专项：**140/140**，其中新增38项、原Web102项。
- 静态语法：**107/107**，覆盖全部src/scripts/test/web JS；未删旧检查。
- 实际浏览器：320、375、390、430、1280px，7路由共35组检查、38张截图；全局横向溢出0，底部留白大于固定导航高度，JS错误0、外部请求0。展开评分、Evidence、完整消息、筛选状态、Back及失败刷新保留事实均通过。
- 浏览器内存响应Mock：7项空状态/NO_EDGE/V4不可用等验证通过；未生成生产记录。
- 浏览器为macOS Chrome，不冒充真实iPhone Safari或Windows验收。iPhone安全区通过CSS支持，实际设备仍待用户验证。
- 冻结清单中**8394个受保护生产数据/配置/业务源码项零差异**，生产目录新增文件0。原有测试、package.json/package-lock、.gitignore在本轮未变；其余原有文件的变化只有3个前端文件和Web静态路由适配。
- 原自动化测试会写两个离线Selector证明文件，结束后已恢复本轮开始时内容，不改变生产数据或旧哈希断言。
- 服务端仍只读，认证与公网边界不变。没有调用Binance、DeepSeek或钉钉，没有启动Scanner、重投历史消息、修改History/Outbox/Facts/.env/.web.env，没有推送GitHub、部署Windows或修改防火墙。

所有本轮临时验收服务已关闭。现有本地启动方式仍为 `npm run web`，Scanner前台方式 `npm run scan` 未变；本轮没有启动常驻生产进程。

## 已知基线问题

Dashboard前一轮正式记录为984/994，10旧失败。当前1032项是在原994项上新增38项，旧10项仍存在，未更新历史History或限流状态哈希。逐项来源、原SHA、实际SHA与迁移限制继续参考 `BA_BIAS_WEB_DASHBOARD_V1_HASH_BASELINE_FORENSIC.md`。UI简化与基线迁移分开，本轮没有自动接受当前SHA。
