# Market Researcher 最小设计合同

日期：2026-10-13。模式：READ_ONLY_ARCHITECTURE_SIMPLIFICATION_DESIGN。仅供独立设计评审，未实施、未验证模型、未批准 Shadow 或生产替换。

## 定位与职责

Facts Engine 提供真实来源及可核验的既有市场事实，Knowledge Register 提供有来源、适用条件和反例的金融知识，DeepSeek 负责理解、解释、比较证据和形成当前市场判断。外围程序负责身份、版本、时间、原始响应与隔离存储。金融说服力仍需人工审阅，不能由合同通过率代替。

| 六项职责 | 最小输出 | 要求 |
|---|---|---|
| 市场状态 | marketState | 选择已发生的重要变化，不复述全部指标 |
| 金融解释 | financialInterpretation | 事实、条件解释与未证实机制分开 |
| 支持证据 | supportingEvidence | 对整体判断有实质意义，不凑数量 |
| 竞争证据与限制 | competingEvidence；uncertainties | 竞争事实与缺失、适用限制、一般未知分别说明 |
| 判断依据与当前偏向 | decisionBasis；bias | 解释取舍，不提供内部思维链 |
| 不确定性 | uncertainties | 保留重要未知，不堆砌免责声明 |

BULLISH 表示当前证据更支持多方偏向；BEARISH 表示更支持空方；NO_EDGE 表示不足以形成可辩护明确偏向。保持 [BA_BIAS_MARKET_BIAS_SPEC_V1.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_MARKET_BIAS_SPEC_V1.md) §1、§4、N1–N6 金融语义。价格符号不能独立决定方向；未知主动方也不自动否定有限判断。明确方向需有相关非价格事实对参与背景、证据质量或风险提供实质信息，不建立指标投票、权重或价格门。

资料无效、未来事实或关键缺失应保留技术/输入不可用结果，不能构造一个正常 NO_EDGE。当前 Bias 不等于预测、胜率、交易建议或自动执行。

## 当前真实调用链与复用裁决

当前源码工作区的调用链（不等于确认 Windows 已部署这一版本）：

```text
scan-daemon / runResearch
 → Binance.get → scanner.scan → buildFacts → detector.detect → 保存 Facts
 → selectOpportunities → selected（现有 Top 3）
 → verifiedFacts → previousResearch → V2 analyze/buildInput
 → SYSTEM = prompt.system + modelAnalysis Schema → createAdapter/DeepSeek.json
 → parseAnalysis / guardAnalysis / guardResearch（有限恢复）
 → saveResearch / V2 History → buildIntelligence / renderResearch
 → prepareDelivery / V2 Outbox → drainDeliveryQueue
Dashboard Reader 从保存的数据与 V2 合同读取，不重新调用模型。
```

| 模块及实际入口 | 分类 | 理由及未来边界 |
|---|---|---|
| [src/market/facts-engine.js:25](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/facts-engine.js:25) buildFacts；closedKlines、oiWindow、fundingRecords | REUSE_UNCHANGED | 保持价格/OI/成交量/Funding计算及缺失检查，禁止复制算法 |
| [src/market/long-short-facts.js:26](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/long-short-facts.js:26) parseLongShortSeries、buildLongShortFacts | REUSE_UNCHANGED | 复用原始样本、精确窗口、账户/持仓口径；不新增检测计算 |
| [src/intelligence/packet.js:11](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js:11) verifiedFacts | MINIMAL_ADAPTER_LATER | 已有再验证入口调用原 buildFacts/detect；还要求原生身份、完整核心及深查异常。新研究不能冒充任意历史包已过此门，不降低门槛；调用图依赖生产 render/guard，未来评审隔离导入边界 |
| [src/analysis/market-bias-v2/knowledge.json:1](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/knowledge.json:1) registryVersion、clauses、sources | REUSE_UNCHANGED | 原知识版本和来源保留，停用知识仍停用 |
| [src/analysis/market-bias-v2/input.js:21](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/input.js:21) buildInput / 私有 registry | MINIMAL_ADAPTER_LATER | 时间、身份、质量可借鉴；引用与标签推导不可整体照搬，topGlobal缺陷须独立处理 |
| [src/clients/http.js:4](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/http.js:4) Http.request；[src/clients/deepseek.js:5](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/deepseek.js:5) DeepSeek.json | REUSE_UNCHANGED | 请求代理、超时、限并发、记录Provider原文；实验调用时显式提供无重试Http并检查finish_reason，客户端自身不保证完整输出 |
| [src/analysis/market-bias-v2/executor.js:30](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/executor.js:30) analyze/createAdapter/SYSTEM | NOT_REQUIRED_FOR_RESEARCHER | 强耦合V2 Schema、引用、两次恢复、正式研究封装；新路径不得直接调用或照抄 |
| [src/analysis/market-bias-v2/parser.js:8](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/parser.js:8) parseAnalysis；schema.json | NOT_REQUIRED_FOR_RESEARCHER | parseAnalysis直接校验modelAnalysis；JSON安全解析思想可保留，不能声称兼容7字段输出 |
| [src/analysis/market-bias-v2/guard.js:38](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/guard.js:38) guardAnalysis / guardResearch | PRODUCTION_BOUNDARY_KEEP | 生产严格合同原样保留，新实验不伪装V2通过；guard明确承认仍需语义审阅 |
| [src/analysis/market-bias-v2/common.js:4](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/common.js:4) canonical/sha/freeze | REUSE_UNCHANGED | 纯工具可复用；recordId含V2合同，不能用于新ResearchId |
| [src/market/opportunity-selector.js:23](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/opportunity-selector.js:23) selectOpportunities；[src/main.js:103](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:103) runResearch；scan-daemon | PRODUCTION_BOUNDARY_KEEP | Top 3、资格、调度、RunId、去重、运行锁不变；独立实验不进入此链 |
| [src/analysis/market-bias-v2/storage.js:13](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/storage.js:13) saveResearch；market-bias-v2-state | PRODUCTION_BOUNDARY_KEEP | 写正式research/receipts/history，实验不得调用；仅借鉴内容封存/身份绑定 |
| [src/storage/history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js)；[src/storage/delivery-queue.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/delivery-queue.js) | PRODUCTION_BOUNDARY_KEEP | 不读写实验结果为生产故事，不建立投递记录 |
| [src/analysis/market-bias-v2/render.js:10](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/render.js:10) renderResearch / publicAnalysis；buildIntelligence | NOT_REQUIRED_FOR_RESEARCHER | 依赖V2嵌套字段及FactRef模板，不能将新JSON硬塞入生产Renderer |
| [src/web/reader.js:62](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/web/reader.js:62) Reader.research / public DTO | MINIMAL_ADAPTER_LATER | 未来独立只读实验入口，不改正式Bias、不合并生产统计 |
| [audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/run-experiment.mjs:1](/Users/yaodebao/Desktop/git/ict03/ba-bias/audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/run-experiment.mjs:1)；run-resume.mjs | NEEDS_FURTHER_REVIEW | 原台账、原文、预算机制值得复用思想，但脚本冻结旧案例/Prompt/路径，不可直接重跑 |

## 新路径与规范差异

```text
既有验证通过的 Facts + 原知识的可靠适用部分
 → 唯一最小 Prompt → 一次受控研究
 → 7字段分析 + 原始响应 → 轻量技术检查 → 人工事实/金融审阅
 → 独立 EXPERIMENTAL_MARKET_RESEARCHER 记录
```

不存在新的金融规则引擎、LLM Judge、自动修复或发布步骤。未来输入、调用/记录、技术检查/只读展示只需最小外围适配，本轮未创建这些模块。

Frozen Spec §7 的正式目标还有 knowledgeReferences、biasStrength、reassessmentTriggers、dataQuality/asOf。新实验将来源、质量、时间置于外围记录；金融知识仍从原登记输入且接受人工审阅，不要求模型引用全集；不新增强度、触发器等生产字段。这是**独立实验接口与正式V2合同的明确差异**，不是偷偷改变冻结金融语义或宣布生产兼容。若将来直接替换正式合同，必须单独批准字段责任迁移，不能将此设计视作批准。初期不比较前次Bias作为答案、不要求输出Bias转变；日后连续研究须再评审Frozen Spec R6追溯要求。

## 本轮基线

Git HEAD：52e7f19f55d3da4dcb55a39b3b6d47bf128ebdcd；分支：main。起始已存在44个 tracked文件改动、多个untracked目录；暂存区为空。未覆盖、撤销或接受旧改动。只新增本设计5文档。

<details><summary>起始WorkingTreeStatus原文</summary>

```text
 M README.md
 M scripts/analyst-live-probe.js
 M scripts/analyst-version.js
 M scripts/compact-replay.js
 M scripts/dashboard-replay.js
 M scripts/structured-v4-live-preflight.js
 M scripts/structured-v4-live-rerun.js
 M scripts/structured-v4-provenance-offline.js
 M scripts/structured-v4-provenance-replay.js
 M scripts/v4-failure-render-replay.js
 M scripts/v4-output-quality-replay.js
 M scripts/validation-recovery-replay.js
 M src/analysis/active-analyst.js
 M src/analysis/active-analyst.json
 M src/intelligence/compact-renderer.js
 M src/intelligence/packet.js
 M src/main.js
 M src/scan-daemon.js
 M src/storage/delivery-queue.js
 M src/web/public-dto.js
 M src/web/reader.js
 M src/web/server.js
 M test/analyst-alignment.test.js
 M test/analyst-generation.test.js
 M test/analyst-precision.test.js
 M test/compact-fixture.js
 M test/compact.test.js
 M test/core.test.js
 M test/cutover-authorization.js
 M test/dashboard-simplification.test.js
 M test/directional.test.js
 M test/hourly.test.js
 M test/long-short.test.js
 M test/no-edge-render-forensic.test.js
 M test/output-quality.test.js
 M test/pm2-entry-fixture.js
 M test/public-web.test.js
 M test/selector.test.js
 M test/v4-production.test.js
 M test/validation-recovery.test.js
 M test/web-dashboard.test.js
 M test/web-pm2-fixture.js
 M web/assets/app.js
 M web/assets/presentation.js
?? BA_BIAS_MARKET_BIAS_SPEC_V1.md
?? BA_BIAS_PUBLIC_WEB_GIT_RELEASE_V1.md
?? audit/
?? design/
?? implementation/
?? scripts/market-bias-v2-prepare.js
?? src/analysis/market-bias-v2/
?? src/storage/market-bias-v2-state.js
?? test/archive/
?? test/fixtures/
?? test/market-bias-v2-contract-guard-minimal.test.js
?? test/market-bias-v2-contract.test.js
?? test/market-bias-v2-e2e.test.js
?? test/market-bias-v2-fixture.js
?? test/market-bias-v2-knowledge-reference-fix.test.js
?? test/market-bias-v2-llm-contract-fix.test.js
?? test/market-bias-v2-output-budget.test.js
?? test/offline-guard.js
?? validation/BA_BIAS_24H_HOURLY_SCHEDULER_V1/
?? validation/BA_BIAS_DASHBOARD_SIMPLIFICATION_V1/
?? validation/BA_BIAS_MOBILE_WEB_DASHBOARD_V1/
?? validation/BA_BIAS_PM2_ENTRY_FIX_V1/
?? validation/BA_BIAS_PUBLIC_READONLY_WEB_V1/
?? validation/BA_BIAS_WEB_PM2_ENTRY_FIX_V1/
```

</details>

完整性与静态核对结果见 VALIDATION_AND_STOP_RULES.md。保留生产Facts、Knowledge、Prompt、Schema、Guard、Selector、Scanner、History、Outbox、Dashboard和配置。本轮结束后停止。
