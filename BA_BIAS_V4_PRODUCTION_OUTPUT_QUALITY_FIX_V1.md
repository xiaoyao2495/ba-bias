# BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1

## 1. Executive Summary

**OUTPUT_QUALITY_FIX_COMPLETE**。仅修复生产输出消费、分片和可证明的更新证据错误。当前 V4 唯一入口不变；本轮不启动扫描，不重投旧消息。原712项测试保留，新增73项，785/785通过，静态87/87通过。44条冻结生产输出回放前后均保留资格，分片总数82→82。

## 2. Actual Production Run Evidence

实际 RunId `hourly_20261011_1200`：924合约、53 Facts、47 Judge、45 Analyst（3失败）、44情报（17 NEW_STORY、27 MATERIAL_UPDATE），44 SENT、0失败/UNKNOWN。运行元数据状态为 PARTIAL，研究终态另含6 NOT_NEWSWORTHY、2 JUDGE_FAILED、1 DUPLICATE；不能把本次输出修复解释为该轮所有研究均成功。证据：[data/runs/hourly_20261011_1200/result.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1200/result.json)，[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/initial-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/initial-audit.json)。复制文本27个币种不是完整轮次，审计覆盖全部44条输出及45条保存的 Analyst。

## 3. Scope and Immutable Boundaries

不修改 V4 Prompt/Schema/全部核心Validator/枚举/数值计算/模型参数，不修改 Scanner/Detector/Judge阈值、V3核心、调度、投递业务码及.env。当前目录无Git仓库，commit=UNKNOWN/NOT_A_GIT_REPOSITORY，不伪造commit。起始扫描进程73752存在，经用户Ctrl+C暂停后只读确认退出。开始哈希与暂停后哈希一致。证据：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before-hashes.json)，[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/final-integrity.json)。旧项目及AI Pro Cron没有访问或修改；未建立它们的独立前后哈希，所以不声称其独立哈希审计完成。

## 4. Root Cause of NO_EDGE Invalidation

四个合法NO_EDGE：MAGIC、LUMIA、JCT、GENIUS。原模型确实选择了 PROGRAM_RULE PRICE_OPPOSITE_1h；核心Guard允许NO_EDGE引用该规则，并且禁止NO_EDGE的结构边界INVALIDATED。输入规则由已有 directional-context 定义为 INVALIDATED；V4 Adapter直接复制description，Compact优先显示rules，因而出现“方向命题失效”。错误层级为 **V4_ADAPTER / INTELLIGENCE_RENDERER**，不是模型方向被改写。原始证据：[data/runs/hourly_20261011_1200/directional/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1200/directional/MAGICUSDT.json)，[src/analysis/directional-context.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-context.js:35)。

## 5. NO_EDGE Semantic Correction

消费映射 `[src/intelligence/v4-conditions.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/v4-conditions.js:2)` 保留id、horizon、metric、operator、threshold、baselineEvidenceId，只对NO_EDGE的消费副本改为 REASSESSMENT_ONLY、明确重新评估文字。模型rawAnalysis和冻结input不变。Compact与完整文本均使用同一映射，有方向的规则description及outcome保持原样。未来V4状态消费同样映射NO_EDGE规则，触发复核不进入INVALIDATED；HORIZON_EXPIRED仍独立。V3分支不改，因果成绩排除规则不改，不重算旧数据。证据：[src/analysis/structured-v4-production.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/structured-v4-production.js:23)，[src/analysis/directional-history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-history.js:58)。

## 6. Fragmentation Root Cause

原splitMessage按每个Unicode码点累加字节，预算耗尽即截断；UTF-8完整但没有数字/字段/词语边界。保存的历史正文与旧Renderer完全重建匹配。实际保护token跨片问题确认于2Z、ARX、ENS、LUMIA、PENGU、RLC；不是字节丢失，也不是ACK失败。证据：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before_output_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before_output_audit.json) 的oldBoundaryViolations及原Outbox.parts.content。ONE复制遗漏不作为故障。

## 7. Fragmentation Fix

[src/storage/message-boundaries.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/message-boundaries.js) 按完整字段换行、句末标点、Intl中文词边界选切点；数值、负号、小数、百分数、时间戳、ASCII身份和固定字段标题为保护区。极端不可分超长字段才按grapheme安全截断，持久化 boundaryDiagnostics，超预算grapheme明确失败。保持1800字节上限及原80字节安全余量、运输header、DeliveryId、序号总数、“检测”、顺序。移除每片3行运输头并拼接正文严格等于输入；所有44条新输出无保护token跨片，无fallback。短消息不增加无意义分片。

## 8. Account Flip Freshness Audit

新增角色 NEW_FLIP_EVENT（本次首次收录，不声称本小时形成）、PREVIOUSLY_KNOWN_FLIP_CONTEXT、FLIP_STATE_UPDATE。明确使用timestamp/from/to标识事件，status标识状态；确认后样本数增长不构成新状态。已知历史事件字段顺序变化不构成变化；旧翻转退出滚动样本窗口不独立触发更新。新的后续翻转、首次确认及真实分布变化保留。形成统计时间、当前采集时间、首次保留检测记录及之前输出RunId分别记录；最早保留文件不冒充全系统真实首次可用时间。证据：[src/intelligence/notification-evidence.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/notification-evidence.js:2)，[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/event-material-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/event-material-audit.json)。

## 9. MATERIAL_UPDATE Evidence Audit

27条均具有已保存前次Outbox/Story基准和此前Facts，27条均能匹配原有规则触发证据，不能认定旧翻转继续存在导致这27条都是重复。修复代码可复现的错误：缺失数值null被Math.sign/算术当0、仅旧翻转消失、仅事件JSON键顺序变化；不改变15/10/0.05等既有delta、符号变化、账户materialChangePp、成交量规则。仍保留异动集其他种类变化的原策略（包括消失）；极小符号变化仍可能按已有规则满足更新，本次不改策略。所有44条 OldDecision/NewDecision 相同。证据：[src/storage/history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js:60)，[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/after_output_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/after_output_audit.json)，逐币种表见回放报告。

## 10. Previous Snapshot Comparison Semantics

“上一轮”实际是上一个已经持久化的输出Story快照，经Outbox.reconcile得到lastResearchTime；不是上一个小时扫描，也不是上一次发送ACK时间。记录comparisonSnapshotId、previousRunId、previousObservedAt、currentObservedAt、previousOutputAt；标签“相较上次有效快照（MM-DD HH:mm，北京）”。未知时间显示“相较此前记录（比较时间未知）”，不伪造小时邻接。27条历史更新基准时间全部可追溯，Funding与OI和滚动24h价格口径没有变。证据：[src/intelligence/packet.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js:49)，[src/intelligence/compact-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/compact-renderer.js:67)。

## 11. V4 Direction Fidelity Audit

44输出中41 VALIDATED：34 BEARISH、3 BULLISH、4 NO_EDGE；3 INVALID；45个保存Analyst多一个未输出的BEARISH。41条horizon均为原模型1h；40 LOW、1 MODERATE。37条有方向与当时已收盘1h价格符号同向，0反向；这不是未来命中率。Adapter/Renderer不强制1h/LOW、不改写方向、不降级REVERSAL，合同仍允许1h/4h/24h。方向机制重复来自有限枚举的确定性说明；不是新增Prompt问题。Packet保留全部supporting/conflicting/机制/条件引用；Compact逐条展示竞争证据，但不会逐条重复展开全部supporting描述，详细文本和本地Packet保留。交易观察与方向分离。证据：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/direction-output-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/direction-output-audit.json)，[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/direction-fidelity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/direction-fidelity.json)。

## 12. CHIPUSDT Failure Forensics

FailureStage=V4完整Evidence/Structure业务验证；ErrorCode最终 UNKNOWN_OR_FOREIGN_EVIDENCE、UNSUPPORTED_STRUCTURE。Attempts=2（首次+一次Recovery），两次真实历史响应JSON合法、Schema=true、可信来源=true。structureEvidenceIds错误包含文字 `INSUFFICIENT_STRUCTURE_DATA`，该文字不是输入Evidence ID；首次另把OI +0.81167525%扩张解释为CONTRACT_CONTRACTION_COMPATIBLE，产生MECHANISM_SIGN_MISMATCH；恢复改正机制但仍保留错误结构引用。无已记录网络/Adapter/Snapshot错误，不是已证实系统合同Bug；ROSE、WLFI也有同类引用错误，ROSE恢复后还保留机制错误。保存FAILED，不改为NO_EDGE、不重试真实模型、不添加特例。原响应及两次完整诊断：[data/runs/hourly_20261011_1200/directional/CHIPUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1200/directional/CHIPUSDT.json)。

## 13. Modified Code Files

现有文件修改：

- [src/analysis/directional-history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-history.js)
- [src/analysis/structured-v4-production.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/structured-v4-production.js)
- [src/intelligence/compact-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/compact-renderer.js)
- [src/intelligence/packet.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js)
- [src/storage/delivery-queue.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/delivery-queue.js)
- [src/storage/history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js)
- [test/analyst-generation.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-generation.test.js)
- [test/structured-v4.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4.test.js)
- [test/compact.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/compact.test.js)
- [test/structured-v4-live-preflight.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-live-preflight.test.js)
- [test/analyst-alignment.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-alignment.test.js)
- [test/cutover-authorization.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/cutover-authorization.js)
- [test/v4-production.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/v4-production.test.js)
- [test/analyst-precision.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-precision.test.js)

新增：

- [src/intelligence/v4-conditions.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/v4-conditions.js)
- [src/intelligence/notification-evidence.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/notification-evidence.js)
- [src/storage/message-boundaries.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/message-boundaries.js)
- [scripts/v4-output-quality-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/v4-output-quality-replay.js)
- [test/output-quality.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/output-quality.test.js)
- [test/output-quality-authorization.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/output-quality-authorization.js)

既有测试的历史哈希基准因授权真实生产运行已更新：data/.env仍做完整哈希检查，但对照本任务开始时冻结基准，不能要求恢复至上次任务旧状态。所有712项测试保留；旧V3读取测试改为按版本选V3快照，而非按目录第一个文件。测试产生的cutover模拟证据改写本任务validation目录，避免覆盖旧联调证据。

## 14. Before/After Output Comparison

同一冻结Facts、原V4输出及前次Story：44条；NO_EDGE4条改复核语义；6条可证实保护token截断消失。分片82→82（每币分片数不变），无正文丢失/重复，所有片≤1800字节。完整新旧正文及分片：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before_output_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before_output_audit.json)、[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/after_output_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/after_output_audit.json)。

## 15. Notification Eligibility Changes

历史44条资格变化0，27条MATERIAL_UPDATE均保留。没有将整批旧事件背景判为重复，没有围绕目标数量调参数。防重复缺陷通过构造与原规则一一对应的离线专项案例验证；不声称已经找到这44条中某条必然是错误重复投递。

## 16. Important Stories Preservation

ONE：先前20:00 LONG→SHORT与此次05:00事件身份不同，OI4h由+2.4461%转-0.9974%；两分片真实SENT，保持原记录。POL：此前LONG→SHORT与本次03:00 SHORT→LONG是不同事件，还有新异动集变化。HEI：10-10 14:00翻转已在21:00/22:00输出，明确背景；新成交量3.0798倍以及价格符号变化仍支持更新。GENIUS：12:00单点翻转，本轮无前次输出；原Detector明确允许单点进候选、原Judge评分达标，因此NEW_STORY保留，不擅自提高持续确认要求。

## 17. Full Test Results

原712项全部保留，新增73项，`npm test` 785/785，0失败、0跳过；全过程NODE_OPTIONS预加载no-network.js，阻断http/https/net/tls/fetch真实网络。Mock队列和历史回放不会连接真实投递。测试日志：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/all-tests.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/all-tests.txt)；专项用例：[test/output-quality.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/output-quality.test.js)。

## 18. Static Check Results

对src/scripts/test中87个JS逐一node --check，87/87通过。静态记录：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/static-checks.json)。

## 19. Production Data Integrity

本任务4251个既有文件基线中4167个生产data文件均未变化，无新增生产data文件；.env哈希不变。169条原Outbox（167 SENT、2 SHADOW）保持原字节及身份。UNKNOWN分支通过Mock验证不自动重发，当前真实Outbox没有UNKNOWN，不虚构真实UNKNOWN样本。核心合同、main、config、market、Judge、scheduler未变。证据：[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/final-integrity.json)。

## 20. Remaining Risks

极端单个token或grapheme超过平台消息预算时，无法同时满足原子性和长度；token采取显式记录的安全字符fallback，grapheme直接报错，无静默丢字。不存在本轮实样fallback。既有符号变化规则和机械机制枚举文本仍可能产生较多消息或模板重复，本次不改新闻策略/模型。保存的firstRetainedDetection不证明更早文件不存在。历史运行PARTIAL中的Judge失败不属于本次修复，不重跑。

## 21. Final Verdict

**OUTPUT_QUALITY_FIX_COMPLETE**。消费语义、无损分片、事件角色与比较基准修复已验证。已证实的代码级虚假更新条件被限制；真实回放没有更改任何原通知资格。V4核心合同和生产数据保持完整，全部测试通过。

## 22. Minimal Next Action

本轮到此停止。扫描保持暂停，未自动重启；由用户决定何时在原前台恢复 `npm run scan`。现有SENT/UNKNOWN及持久化旧分片不重新生成、不补发。
