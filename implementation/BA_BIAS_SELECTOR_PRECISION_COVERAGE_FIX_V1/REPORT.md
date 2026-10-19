# BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1

完成日期：2026-10-19（北京时间）。本轮仅本地实施与离线验证。未提交、推送、部署或启动生产进程。

## 1. 修复摘要与边界

P1已修复：Detector仅对 FUNDING_EXTREME 使用现有 big.js，从实际结算Funding的十进制百分数字符串计算绝对值/阈值，再转Number并按原规则封顶5。研究Gate仍为1.5/3；异常阈值、分数权重、Top5、家族分数封顶3、MATERIAL_UPDATE、Scanner候选排序/轮转均不变。

P2已实现：Scanner旁路记录逐Symbol覆盖轨迹；主链路复用实际Selector决定和V2执行记录，保存独立Run诊断。没有重新扫描，没有增加市场请求，没有修改公开API或首页DTO。

测试合同收尾后：完整回归1342/1358通过，仅保留原有16项失败，无新增失败。Selector30保留原名称及测试项，调整为原版可信引用、差分语义及窄范围源码保护，不再要求授权精度修复后的整个Detector字节不变。旧SHA基线没有更新，其他断言没有修改、删除或跳过。新增40项功能测试继续通过。

## 2. 前置审计与冻结基线

修改前已执行 git status --short、git diff --check，读取实际 Scanner、Facts、Detector、Selector、账户发现、Packet、History、main、原子写入及相关测试。原有package.json修改与其他未跟踪资料见 status-before.txt / untracked-before.txt，全部保留且未暂存。

在修改任何生产源码之前，冻结8421个 src/data/.env/.web.env/package/lock 文件哈希及4份源码快照；修改前完整测试1318项，1302通过、16失败。首次受限运行因本机端口权限产生环境取消，随后在允许回环Mock端口的相同隔离环境重新冻结正式基线；所有正式前后比较均保留 offline-guard。

本轮没有将旧回放的Top3冒充当前Top5。运行配置为基础候选24、触发槽12、Top5；真实Windows当前运行数据 NOT_AVAILABLE。

## 3. 根因与Funding数学依据

- `src/market/facts-engine.js:19–22,82`：原始fundingRate小数乘100，保留8位十进制百分数；本轮未修改。
- `src/market/detector.js:13–17`：旧 Number(result)/0.1 可得到1.4999999999999998或2.9999999999999996。
- `src/market/opportunity-selector.js:33–34`：直接比较 >=1.5、>=3，导致边界误拒；本轮未修改。

十进制0.15000000 / 0.1 = 1.5，0.30000000 / 0.1 = 3。big.js对该有限十进制除法精确求值；1.5和3转Number可精确表示。没有epsilon，没有两位小数四舍五入，没有改阈值或Funding权重，也未改变实际结算与展示Funding的来源区分。

精度边界仍建立在现行Facts的8位百分数值上，没有扩展或改变Facts舍入合同。其他家族保留原计算路径，并测试价格1h/24h、OI、量能、账户的1.5与3上下边界。

### 原始Funding单位驱动的前后对照

以下正负对称，均从原始fundingRate经正式Facts、Detector、Selector计算；表中单位是百分数。

| 实际结算Funding绝对值 | 另一价格家族 | 修复前 | 修复后 | 修复后分数 |
|---|---:|---|---|---:|
| 0.149999% | 8.8% | Gate拒绝 | Gate拒绝 | null |
| 0.150000% | 8.8% | Gate误拒 | 通过 | 27.333333 |
| 0.150001% | 8.8% | 通过 | 通过 | 27.333400 |
| 0.299999% | 无 | Gate拒绝 | Gate拒绝 | null |
| 0.300000% | 无 | Gate误拒 | 通过 | 25 |
| 0.300001% | 无 | 通过 | 通过 | 25 |

12个边界Fixture中，仅正负0.15%和0.30%四项改变研究资格，这是授权的预期变化。其后排名、Mock模型调用资格可以改变，不能声称所有场景均不变。其余边界的Gate/分数不变，个别strength消除不可见浮点尾差。

## 4. 实际覆盖漏斗与存储

正式运行未来新增：

- `data/runs/<RunId>/scan-coverage.json`：扫描阶段逐Symbol覆盖、通道、深查轨迹与计数。
- `data/runs/<RunId>/run-diagnostics.json`：上述扫描轨迹加Selector及V2最终技术状态。
- 原 `scan.json` 增加 `coverageSummary` 聚合字段。
- 原 `result.json` 增加 `diagnostics.status/counts`，不塞逐币详情。
- 新日志事件 `Run coverage` 只输出阶段计数。

本轮仅在临时Mock目录生成上述产物，没有创建或修改真实data目录中的文件。新旧文件通过现有save→atomicWrite安全原子写入。没有写入旧Run的补算诊断。

### 计数定义

| 计数 | 来自的实际事件 |
|---|---|
| universe | exchangeInfo实际symbols数 |
| identityEligible | classify通过 |
| liquidityEligible | ticker有效且quoteVolume严格>1000万 |
| triggerMatched | 实际满足原触发条件 |
| triggerSelected | 原排序/截断后触发入选 |
| rotationSelected | 原轮转实际入选 |
| accountRequested | discovery返回的实际请求数量；未形成完整账本则null |
| accountAnomalies / accountInsufficient | 已返回discovery条目的状态；阶段未返回时null |
| accountNotEvaluated | NOT_EVALUATED/NOT_COVERED，不能当作无异常 |
| accountAdded | 只因账户异常增加、未在原通道的候选 |
| plannedDeep | 实际合并去重后的深查计划 |
| startedDeep | worker实际开始处理 |
| factsSaved | Facts成功保存，包括核心不完整的Facts包 |
| completeFacts | 核心Facts完整，包括无异常的情况 |
| factsIncomplete | 已保存但核心不完整 |
| noAnomaly | 核心完整、没有异常 |
| deepFailed | worker或Facts保存失败 |
| sourceRequestFailures | 深查源请求失败次数，可与Facts不完整重叠 |
| plannedNotStarted | 已计划但worker没有开始 |
| selectorInput | 核心完整且有异常的实际扫描结果 |
| selector.evaluated | 真正交给Selector评估的候选数 |
| selector.gatePassed | 研究强度Gate通过，可能仍被历史过滤 |
| selector.historyPassed | 新故事或materialEvidence通过 |
| selector.qualified / selected / qualifiedNotSelected | 复用Selector最终状态 |
| research.attempted | Adapter实际产生请求记录的候选数；与进入analyze不同 |
| research.succeeded | 技术VALIDATED且已经持久化/标记RESEARCH_READY |
| research.unavailable | 正式UNAVAILABLE结果 |
| research.failed | 异常中断或候选管线错误 |
| research.notEvaluated | 已选但未完成技术研究 |

上述是阶段计数，不是互斥分区；例如sourceRequestFailures是请求次数，不能与币种数量直接相加。

### 逐Symbol状态

- 身份、流动性各自保存 eligible/reason。
- trigger保存 matched/selected，未截取为 TRIGGER_RANK_BELOW_BUDGET。
- rotation独立保存 selected/reason，包括 NO_ROTATION_OPPORTUNITY；触发未截取仍可能经轮转或账户通道进入深查。
- accountDiscovery复用 ANOMALY、EVALUATED_NO_ANOMALY、INSUFFICIENT_DATA、NOT_COVERED；尚未完成则NOT_EVALUATED，池外NOT_APPLICABLE。
- deep保留计划通道数组、开始/结束时间、Facts保存/完整性、异常数、源失败代码。
- 深查终态区分 NOT_PLANNED、NOT_STARTED、INSUFFICIENT_EVIDENCE、COMPLETE_NO_ANOMALY、COMPLETE_WITH_ANOMALY、FAILED。
- 深查未开始时，扫描预算和父运行取消分别记录 SCAN_TIME_BUDGET_EXHAUSTED / SCAN_OR_RUN_ABORTED；保留原业务状态及原因不变。

每个诊断保存RunId、Symbol、scheduledAt、evaluationTime及阶段事件时间。未深查币没有伪造Selector Gate。扫描中断前能形成的内存诊断由main.finally保存；若账户发现阶段没有返回覆盖账本，实际请求/异常计数为null，不能将未知标成0或正常。已有 accounts-discovery 逐币文件仍可辅助取证。

## 5. Selector与研究诊断

每条真正评估候选保存：完整Facts标记、全部异常原值/阈值/Detector strength/Evidence IDs、家族最大strength、Gate、materialEvidence、原Selector分项/score/rank、TopK状态与原因。

Gate或历史失败时score/rank为null；未计算不写0。饱和事件保留原始指标值与Detector strength，分项保留原score cap，未创造新的严重度评分。

V2拆分字段：pipelineEntered、attempted、requestRecords、physicalRequests、technicalState、pipelineStatus、pipelineReason、persistedAndReady。输入准入失败可以UNAVAILABLE但没有模型请求；技术有效但持久化失败也不会计为成功研究。

Mock示例见 diagnostic-examples.json：

| Symbol | 状态 | Gate | score/rank | 模型 |
|---|---|---|---|---|
| GATEUSDT | BELOW_RESEARCH_GATE | 不通过 | null/null | 未请求 |
| HISTORYUSDT | NO_MATERIAL_CHANGE | 通过 | null/null | 未请求 |
| NEW0USDT | SELECTED | 通过 | 25/1 | 示例停在筛选阶段，尚未请求 |
| NEW5USDT | RANK_BELOW_TOP_K | 通过 | 25/6 | 未请求 |

独立完整Mock运行有6个合格候选：选5、实际5次Mock模型尝试、1次UNAVAILABLE、4次成功、无第6名递补，Outbox和发送次数为0。不能把Mock请求计为真实DeepSeek请求。

## 6. 新旧行为对照

修改前4份源码通过独立只读Node loader加载；相同Fixture及现成历史Facts分别调用旧/新正式函数，没有重写评分函数。复现入口为本目录 before-loader.mjs 和 behavior-replay.mjs；before/保留本轮修改前源码。

- 12个正负Funding边界，4个精确边界按预期恢复资格。
- 非边界合成候选的Gate结论、score、rank、状态完全一致。
- 三份旧运行现存Facts共75条（按当前成交额条件过滤后）：Gate布尔值、score、rank、状态、拒绝原因一致。
- WALUSDT两条历史记录 strongest 从3.1056699999999995变为3.10567，仅浮点尾差，Gate和分数均不变。
- Scanner计划候选、Facts顺序、候选输出、全部Mock请求端点与参数序列、轮转状态完全一致。
- 默认K=5、selector/config/history等受保护源码字节一致；没有递补或MATERIAL_UPDATE改动。
- 6个非边界合格候选的集成测试仍仅请求Top5，1个模型失败后也不递补。

BEHAVIOR_COMPARISON.json保存逐项差异；behavior-before/after.json保存实际函数输出。历史比较是旧Facts子集及当时已确认发送摘要的离线回放，不是当前Windows生产统计，未取得的生产统计为NOT_AVAILABLE。

## 7. 测试结果与旧失败

| 项目 | 总数 | 通过 | 失败 |
|---|---:|---:|---:|
| 修改前完整基线 | 1318 | 1302 | 16 |
| 新增专项 | 40 | 40 | 0 |
| 定向回归（收尾后） | 474 | 472 | 2 |
| JS/MJS静态检查 | 152 | 152 | 0 |
| 最终完整回归（收尾后） | 1358 | 1342 | 16 |

无取消、无跳过。新增功能失败0。旧16项逐项核对名称、位置、AssertionError原因、expected值均一致；其中Scanner旧断言的actual文件哈希因本次授权诊断插桩发生变化，不应说actual字节与基线相同。

首次精度修复后有17项失败，其中新增的Selector30实际比较整个detector.js SHA256。经单独授权，本轮将该项改为语义保护，保留旧基线验证冻结原版，不接受新整文件哈希。Selector30现已通过；定向仍失败的2项为既有Selector28/39。

原16项逐项对照名称、原因、expected及相对收尾前的actual均一致，见TEST_CONTRACT_CLOSURE.json。Selector测试包装函数的报告位置随新增import移动，不代表新增失败。首次17项失败证据保留在pre-contract-closure-full.txt、pre-contract-closure-TEST_RESULTS.json；当前full.txt、targeted.txt和TEST_RESULTS.json已更新为收尾后结果。详见TEST_CONTRACT_CLOSURE.md。

命令（项目根目录）：

```sh
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/selector-precision-coverage.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/selector-precision-coverage.test.js test/selector.test.js test/scan-liquidity.test.js test/long-short.test.js test/hourly.test.js test/market-watch.test.js test/market-watch-mobile.test.js test/public-web.test.js test/web-dashboard.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/*.test.js
```

静态逐文件执行 node --check，覆盖src/scripts/test/web/assets内.js/.mjs，见static.json。完整回归及Web定向需要本地回环端口权限，offline-guard持续阻断外网和生产目录写入。

复现新旧对照：

```sh
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --loader ./implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/before-loader.mjs ./implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/behavior-replay.mjs
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node ./implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/behavior-replay.mjs
```

Loader仅用于离线加载before源码，不应用补丁、不覆盖工作区，也不访问外网。Node可能输出标准experimental-loader提示。

### 场景覆盖

40个新增测试覆盖：12个Funding正负边界、10个其他家族上下边界、结算/展示区分、非边界Top5及历史规则、Top12截断、轮转/无机会、账户额外加入/通道重叠、身份/成交额拒绝、账户请求失败、核心OI/Funding缺失、无异常、预算耗尽、父中断未覆盖、诊断写失败、Gate/history/rank空值、10000币有界诊断、早期失败未知计数、公开DTO脱敏、5次模型尝试且失败不递补、Facts持久化失败、发现阶段中断的部分诊断保留。

## 8. 修改文件与完整性

修改既有源码：

1. src/market/detector.js：仅Funding极值strength十进制运算。
2. src/market/scanner.js：旁路覆盖观测、独立诊断文件及聚合字段。
3. src/main.js：挂接Selector/V2记录和最终诊断持久化。

新增代码与测试：

4. src/market/run-diagnostics.js：纯观测适配/汇总，不决策、不发请求。
5. test/selector-precision-fixture.js：原始Mock数据及请求Mock。
6. test/selector-precision-coverage.test.js：40项专项测试。

测试合同收尾额外修改 test/selector.test.js 中Selector30及其必要import；新增 test/fixtures/detector-pre-funding-precision.txt（旧源码纯测试引用，与原SHA基线一致）。本轮未修改任何src或前轮新增诊断业务实现。

新增交付资料仅在 implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/。Git输出见GIT_STATE.txt及UNTRACKED_AFTER.txt；git diff --stat不包括新增文件。package.json是任务前已有修改，本次字节未变，未暂存。其他未跟踪资料未覆盖、清理或暂存。

8421个原保护文件：8418个字节不变，仅上述3个授权源码改变；新增1个src诊断模块。data、.env/.web.env、package/lock、Selector、Config、Facts Engine、账户检测/发现、V2 Prompt/Knowledge/Schema/Guard、History/Outbox/Delivery、Web全部保持原字节。INTEGRITY.json及PROTECTED_BEFORE.json提供证据。

## 9. 性能、安全与剩余局限

- 新处理只遍历已取得的Universe/候选元数据，O(N)，不重算全市场Facts，不排序新的候选池，不加市场请求。
- 合成1000行创建+汇总+序列化约1.27ms、360511字节；10000行约9.29ms、3609513字节。仅本机单次性能取证，未测生产磁盘延迟，不保证Windows相同耗时。
- 每轮最多增加两份独立诊断文件的原子写入；真实极限时刻任何额外CPU/IO仍可能影响截止时间，未在生产做负载验证。
- 独立诊断不含请求header、密钥、Webhook、原始响应或生产绝对路径；无新增公开路由。公开DTO原样保留并通过注入测试及现有Web回归。
- 扫描诊断持久化失败时保留persistenceError；整轮诊断写失败在result.diagnostics及日志明确报告，不改变原业务成功/失败判定。
- 若进程被强杀、磁盘不可写，不能保证尚未持久化的内存诊断完整。账户发现未返回的阶段保持未知，不能以0异常代替。
- 本轮无真实Binance/DeepSeek/钉钉调用，无生产数据写入、PM2启动、部署或Git暂存/提交/推送。

## 10. 精确回滚与后续事项

CHANGES.patch包含完整任务的3个修改源码、1个修改测试及4个新增代码/测试引用文件，不含package.json、生产数据或其他任务资料。TEST_CONTRACT_CLOSURE.patch仅包含本轮测试调整及新增旧源码引用，可只撤回收尾而保留精度修复和诊断。已执行 reverse --check，通过；没有实际回滚。

```sh
git apply --reverse --check implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/CHANGES.patch
git apply --reverse implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/CHANGES.patch
```

如果此后同文件又被改动且检查不通过，停止并按变更块审阅，不强制覆盖、不reset、不清理整个工作区。报告目录可保留作为证据。

仅记录、未实施的讨论项：极端单项价格/OI独立优先级；价格1h进一步扩大的MATERIAL_UPDATE；Selector与V2 Facts范围对齐；Top5失败递补；强度封顶及家族权重；CROSS_METRIC_CONFIRMATION名称。旧哈希基线没有迁移；仅按本轮单独授权修正Selector30保护合同，其他16项旧失败仍独立保留。

交付状态：本地正确性、诊断功能及获授权的Selector30测试合同收尾完成；完整回归只剩原16项失败，无新增失败，等待人工审阅。
