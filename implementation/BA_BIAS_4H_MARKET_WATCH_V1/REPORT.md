# BA-BIAS 4H Market Watch V1

日期：2026-10-18（Asia/Shanghai）。本地实现与离线验收完成；没有Git commit/push、生产服务启动或Windows部署。完整回归保留16项既有基线失败，不能称为全绿。

## 1. 审计与最小方案

完整审计见AUDIT.md。当前正式Scheduler为Asia/Shanghai全天每小时，RunId固定。原Reader.overview在找到最近一轮有效研究后break，再截3条；公开DTO也截3条，前端还会另取最近完成轮次。已有result/selection/facts/research/audit足以完成四槽聚合，无需外部查询或生产数据结构迁移。

对应代码位置：reader.js:28（索引）、:37（保存的Selector读取）、:63（研究与Facts绑定）、:82（新增marketWatch）、:124（保留overview旧字段）；market-watch.js:3（固定时槽）、:11（去重与排序）；public-dto.js:42–45（新字段白名单）；app.js:35（4H展示）、:65（Latest Scan保留）；presentation.js:51–53（显示标签及空状态）。原server/public-routes/security、index.html及CSS未修改。

## 2. 实际改动文件

| 文件 | 变更 |
|---|---|
| src/web/market-watch.js | 新增独立纯函数：固定北京时间四槽、跨轮Symbol去重、保存分数排序；不依赖业务Scanner/Selector/Storage |
| src/web/reader.js | 新增只读marketWatch，复用result/selections/research和Guard，固定4槽读取、跳过记录回退、时间校验及单飞缓存；扩展overview |
| src/web/public-dto.js | 显式投影marketWatch、时槽、币种、逐小时指标，不序列化原始记录 |
| web/assets/app.js | 增加4H主区、状态汇总、Top10、逐小时展开与原详情链接；保留Latest Scan、旧导航与页面 |
| web/assets/presentation.js | 新增展示标签和诚实空状态，无评分/交易规则 |
| test/market-watch.test.js | 新增36项Mock/Fake Clock/真实Reader及页面渲染用例 |
| test/public-web.test.js | 新增匿名overview边界回归，原用例保留 |
| test/web-dashboard.test.js | 新增认证overview和Latest Scan兼容回归，使用独立测试登录 |

另外新增本目录中的AUDIT.md、API_FIELDS.md、REPORT.md、TEST_RESULTS.json、STATIC_CHECKS.json、INTEGRITY.json、PROTECTED_HASHES.json、WEB_ONLY.patch及GIT_DIFF_STAT.txt作为交付证据。

## 3. 聚合与去重

14:10读取11:00、12:00、13:00、14:00；每个小时槽按精确hourly RunId读取。缺失/失败/跳过/运行中/未完成/时间无效都可见，绝不用10:00或更旧结果补四轮。当前没有夜间非运行时段，夜间同样应有24小时计划。

COMPLETE和PARTIAL必须真实结束且时间有效，PARTIAL单独计数，仅纳入其中通过既有research绑定和Guard的独立研究。过滤历史回放、未来事实、未来完成、异常Evidence缺失或未来样本。每个Symbol+Run只计一次有效研究；同Symbol主记录取最近有效研究的Bias、异常、metrics及dataCutoff，逐小时occurrences分别保留原始时间、分数、方向及指标，不跨Run拼接。

按窗口最高有效Selector分降序、最近有效研究完成时间降序、Symbol稳定字典序。缺分为null/MISSING而非补0；缺分组统一置后，再按时间及Symbol排序。最高分来源RunId单列，不能误当最新一轮分数。首页Top10，不足不凑数。重复次数不等于异常增强，Selector分不是概率/胜率/收益。研究技术有效不等于金融审阅批准。

## 4. API与前端兼容

扩展既有GET /api/overview.marketWatch，完整字段见API_FIELDS.md。旧latest/researchRun/cards/emptyState/lastSuccessfulAt/stale继续保留。旧cards的3条历史兼容限制没有被用于替代4H聚合，主展示使用新的items（最多10个）。

4H展示计划槽范围、观察时间、应运行4槽、完整/部分完成、失败/中断、跳过、缺失、运行中、未完成和无效计数，及最近有效扫描截止。每个币种显示最高分、最新方向、最近研究时间、首次出现时槽、有效研究次数、异常及截止时间。展开后查看每小时独立事实和详情/Evidence。全局和单币种分别提示过期。

这里windowStart/windowEnd是四个计划整点的首尾标签（如11:00–14:00），不是“连续3小时”行情截取；observedAt独立表示本次读取截至14:10。聚合仅包含这四个计划小时，不用旧cards回溯结果填入。

默认10秒衍生缓存、同窗口单飞、小时切换立即更换键；保持原文件读取上限、索引缓存、前端30秒刷新及失败保留缓存提示。公开模式保留原白名单、认证隔离、Host/Origin及1MiB响应限制；运行中只释放状态，不开放其研究或暂定评分。

## 5. 测试命令与真实结果

按先定向、后完整顺序运行。所有数据为临时Fixture/Mock，不调用Scanner、Binance、DeepSeek、DingTalk或交易接口。需要loopback/IPC权限的测试在允许本机回环的环境执行，并通过NODE_OPTIONS向子进程继承offline-guard；不以环境受限取消用例冒充通过。

```sh
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/market-watch.test.js test/public-web.test.js test/web-dashboard.test.js test/dashboard-simplification.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/*.test.js
```

| 检查 | 真实结果 |
|---|---|
| Web定向（含新增36+2用例） | 257/257 PASS，0取消、0跳过 |
| 修改前完整基线 | 1245项，1229 PASS / 16 FAIL，0取消、0跳过 |
| 修改后完整回归 | 1283项，1267 PASS / 16 FAIL，0取消、0跳过 |
| 新增失败 | 0；失败名称集合与基线相同 |
| JS静态语法 | 146/146 PASS，范围src/scripts/test/web/assets |
| 最终修改文件语法复核 | 8/8 PASS |
| Git差异空白检查 | git diff --check PASS |
| 回滚补丁可逆性 | git apply --reverse --check WEB_ONLY.patch PASS；未实际回滚 |

16项失败是本次实际复跑确认的旧源码/历史完整性基线断言（详情TEST_RESULTS.json），不是把历史报告的9或12项直接照抄。本轮没有更新旧Hash、删除用例、跳过测试或放宽校验。

覆盖四轮齐全、去重、稳定排序、缺分与0分、FAILED/INTERRUPTED/两种SKIPPED、空研究、少于四轮、跨日/夜间、过期、运行中、缺完成时间、计划时间错误、未来时间、PARTIAL、HISTORICAL_REPLAY排除、Top10、整点缓存、单飞、旧API、Latest Scan、公开嵌套字段隔离、篡改研究Guard拒绝、缺Selector文件、文件无写入，以及实际首页渲染函数的空状态和多小时历史。

## 6. 完整性与副作用

8412份保护文件前后SHA一致，新增/删除集合也无差异。保护范围包括src（排除本次src/web）、生产data、.env/.web.env、package.json/package-lock.json。Scanner/Detector/Selector、V2 Prompt/Schema/Guard/Knowledge、History/Outbox/Delivery及DingTalk未改动；生产Shadow目录未读取或写入。

无真实市场/LLM/钉钉请求，无交易、消息补投、生产状态写入，无生产进程启动、PM2操作、部署或Git提交推送。本任务开始前的package.json工作区改动原样保留。

## 7. 剩余风险和未验证项

- 尚未在腾讯云Windows或手机Safari现场部署/视觉验收，不能宣称线上已启用。离线已测实际渲染函数、HTTP公私模式和原响应式样式断言。
- 新聚合复用现有Guard的技术有效含义，不构成新的金融质量审阅或方向批准。
- 无历史补齐：缺失记录、无效输入、历史回放及缺分会诚实降级；4H为空时旧Latest Scan/历史仍可查看。
- 旧overview兼容字段保留原最多24轮回溯，只有新marketWatch严格固定4槽。新路径不扩大回溯。
- Web对照当前全天小时计划实现；若未来正式Scheduler改运行时段，需同步Web时槽计划及测试，当前没有擅自新增夜间休市规则。
- 新区保持10秒缓存和30秒刷新，非实时流；Windows真实数据规模及网络延迟尚未做现场性能基准。响应仍受原公开体积/并发保护。

## 8. 回滚方法

当前未提交、未部署。已生成只包含本次8个Web/测试文件的WEB_ONLY.patch，不包含原有package.json或其他工作区改动。需要回滚时先确保没有后续重叠修改，检查通过后仅反向应用本补丁：

```sh
git apply --reverse --check implementation/BA_BIAS_4H_MARKET_WATCH_V1/WEB_ONLY.patch
git apply --reverse implementation/BA_BIAS_4H_MARKET_WATCH_V1/WEB_ONLY.patch
```

这会恢复本次6个既有文件并移除本次新增的聚合模块/专项测试；不会触碰生产数据、凭据、旧报告或其他实验。报告和验证证据可继续保留。本轮只验证check，没有执行回滚。

## 9. Git状态

本次8个代码/测试文件（含2个未跟踪新增文件）和本目录报告未提交。另有任务开始前的package.json改动及大量未跟踪历史设计、审计、趋势实验、Shadow状态与验证目录，全部保留。

实际git diff --stat如下（Git默认不统计未跟踪新增文件；完整本任务8文件差异见WEB_ONLY.patch）：

```text
 package.json               |  5 ++++-
 src/web/public-dto.js      |  4 +++-
 src/web/reader.js          | 47 ++++++++++++++++++++++++++++++++++++++++++++--
 test/public-web.test.js    |  2 ++
 test/web-dashboard.test.js |  2 ++
 web/assets/app.js          | 21 ++++++++++++++++++++-
 web/assets/presentation.js |  5 +++++
 7 files changed, 81 insertions(+), 5 deletions(-)
```
