# BA-BIAS — Facts-Based Current Market Bias V2

独立 Binance USDⓈ-M 原生加密资产永续市场情报系统。程序验证 Facts，原 Deterministic Selector V1 选择最多 Top 5 研究对象；DeepSeek 使用冻结的 K1/K2 市场知识形成当前 `BULLISH / BEARISH / NO_EDGE`。没有未来预测 Horizon、价格命中式失效、交易指令、LLM Story Judge、自动发帖或旧合同回退。

本地代码已经硬切换，生产部署需要单独批准。**不要直接在仍运行旧 Scanner 的生产目录执行准备或启动。** Windows 现有环境不会被本地改动自动更新。

## 研究和事实边界

`Scheduler → Scanner/Facts → 原 Selector Top 5 → V2 Input → Prompt → Parser/Guards → V2 Research（待人工审阅）→ 只读 Dashboard；新研究不入 Outbox/Delivery`

价格已收盘窗口与 ticker 滚动窗口分开；OI 数量与名义价值分开；Funding 已结算与展示值分开，不假定统一8小时结算；全市场账户、顶部账户、顶部持仓分别保留统计分母、时间、来源和质量。数据采集、Facts算术、Selector评分/排序、阈值和原运行预算不变。

每个选中候选使用唯一冻结最小Prompt，模型只输出7字段：marketState、financialInterpretation、supportingEvidence、competingEvidence、decisionBasis、bias、uncertainties。没有强度评分、N标签、FactRef模板/全集、KnowledgeRef闭包或自动恢复循环。Parser只检查完整JSON、重复键、字段类型和三值Bias；输入保留原Facts源值/时间、Funding状态、账户/持仓对象、成交量观察与比较基准。topGlobal.divergence因已知标签缺陷明确排除，其他账户事实保留。

每份冻结输入只调用一次模型，HTTP retries=0；错误保存原响应且状态UNAVAILABLE，不自动改为NO_EDGE。技术有效VALIDATED不等于金融批准，所有新记录reviewStatus=PENDING_MANUAL_REVIEW；不创建Outbox，不自动投递。金融判断仍由模型和人工审阅负责，代码没有方向投票或符号门。过去OGN分析的NEEDS_REVIEW结论不因Parser通过而改变。

LIVE模式在请求前以真实采集完成记录检查新鲜度，默认5分钟，配置BA_MAX_SNAPSHOT_AGE_MINUTES（1–1440分钟），不是从24h窗口起点计算。来源时间无法证明、过期或未来数据停止研究，不局部刷新。HISTORICAL_REPLAY明确显示历史模式、事实观察/采集时间、研究请求/完成时间，不作为当前最新研判。

## 存储及启动准备

旧 `data/state/history.json`、`data/outbox`、`data/directional*`、旧运行/Facts及LLM档案保持原样，不转换、不重新发送。新界面读取新V2研究及旧V2档案，按格式区分，不重写旧记录。

```text
data/runs/<runId>/facts、scan、selection、evaluations、result   # 原路径及RunId
 data/market-bias-v2/research/<runId>/<symbol>.json              # MINIMAL_MARKET_RESEARCH_V1；旧envelope只读兼容
 data/market-bias-v2/receipts/<recordId>.json                    # 写入确认时间/hash
 data/market-bias-v2/audit/<runId>/                             # 输入/请求审计，非公开
 data/market-bias-v2/outbox/<runId>_<symbol>.json                # V2消息与分片状态
 data/market-bias-v2/state/history.json                         # V2研究/业务状态
 data/market-bias-v2/state/cutover-manifest.json                 # 停机准备及旧文件hash
 data/state/run.lock、run.lease、dingtalk-rate.json             # 原共享互斥/传输限流
```

停机后准备工具只复制Scanner轮换/快照、RunId账本、Selector去重所需的业务事实摘要；不复制旧研究标签、Horizon或文章。已知旧DeliveryId阻断索引保留，旧PENDING/SENDING/UNKNOWN/SENT不会进入V2队列。缺少可信历史账本会停止准备。

未来经批准在正确项目目录、确认Scanner与投递worker均停止后：

```sh
node scripts/market-bias-v2-prepare.js --plan   # 只读计划
node scripts/market-bias-v2-prepare.js --apply  # 显式创建新namespace，原档案不写
node scripts/market-bias-v2-prepare.js --check  # 旧文件完整性复核
```

没有准备好的manifest时，正式扫描入口以 `V2_CUTOVER_NOT_PREPARED` 失败退出。准备工具不会扫描、补跑、发送或启动进程。V2准备已存在则拒绝重复apply，不清空或重新覆盖状态。

## 保留的运行方式

Node.js >=22；package及依赖不变。正式启用后的前台常驻仍为 `npm run scan`。北京时间 `Asia/Shanghai` 的 `0 * * * *`，每日24个计划小时；整点10秒收盘采集延迟、RunId、SKIPPED_MISSED/SKIPPED_OVERLAP、锁和退出规则不变。启动不立即扫描、不补历史。

Windows现有专用PM2入口仍为 `src/scan-pm2-entry.js` 与 `src/web/pm2-entry.js`，单fork、不watch、不cluster。精确停机准备与未来发布步骤见 [Windows发布计划](implementation/BA_BIAS_MARKET_BIAS_V2_HARD_CUTOVER_V1/WINDOWS_RELEASE_PLAN.md)。本次未启动、部署或推送。

手动 `npm run once` 完整研究并保存待审记录，`--send` 不会恢复新研究投递；`npm run scan:once` 仅采集Facts。以上都访问外部服务，离线验收不要执行。doctor连通性命令也不是离线测试。

`.env`、`.web.env`不提交、不覆盖。默认模型仍为配置中的deepseek-flash，可用原DEEPSEEK_MODEL配置；代理与Web变量不变。新的研究不进入DingTalk；旧投递实现的分片、限流、有限重试与UNKNOWN边界保留。本地改造没有发消息。原Top 5研究预算保留，研究记录保存在同一V2 History；用于研究去重的事实摘要可更新，但没有伪造发送状态。

### 同一V2入口的离线Dry Run

```sh
node scripts/market-bias-v2-prepare.js --research --symbol OGNUSDT --from-snapshot audit/BA_BIAS_MARKET_RESEARCHER_FIRST_LIVE_RESEARCH_V1/VERIFIED_FACTS.json --mode HISTORICAL_REPLAY --dry-run
```

只读构造输入，零模型/History/消息写入。LIVE模式对该旧快照会返回SNAPSHOT_STALE。明确模型运行必须使用同一入口的`--execute`替代`--dry-run`、显式mode、已准备的现有V2存储；只保存待审记录，不发布。该命令访问DeepSeek，本轮未执行，也不要把本地代码验收当部署授权。参数缺失或同时dry-run/execute均拒绝。

## Dashboard安全

`npm run web`、8787默认端口、默认127.0.0.1监听保持。默认私有认证；只有原 `BA_BIAS_WEB_PUBLIC_READONLY=1` 才启用匿名模式。公网配置和独立`.web.env`优先级原样保留，不增加认证绕过。

观察、排名、历史及移动布局保持，研究展示市场状态、金融解释、支持/竞争、取舍、未知、当前Bias、实际观察/采集/研究时间和待审状态。旧合同只读显示，不要求新模型产生旧字段。公开GET白名单/DTO脱敏不变；不公开原始Prompt、LLM请求、诊断、内部日志、Outbox原件或凭证，不触发扫描/研究/投递。

## 离线测试

实际回归脚本 `npm test`。专项：

```sh
NODE_OPTIONS="--import=$(pwd)/test/offline-guard.js" node --test test/market-bias-v2*.test.js test/v4-production.test.js
NODE_OPTIONS="--import=$(pwd)/test/offline-guard.js" npm test
```

保护模块只允许本机loopback Web测试，阻止外部网络及生产数据/环境/冻结材料写入。测试用tmpdir、合成Facts、Mock模型和Mock投递；`test/archive`保留旧合同和旧快照的原始含义，生产源、Web和脚本不依赖它，不是运行兼容层。

`design/BA_BIAS_MARKET_RESEARCHER_MINIMAL_DESIGN_V1/`为现最小设计；旧`design/BA_BIAS_MARKET_BIAS_V2_HARD_CUTOVER/`为归档复杂合同；`implementation/BA_BIAS_MARKET_BIAS_V2_HARD_CUTOVER_V1/`为实际实施和测试证据。旧V4/Directional文档和审计报告为不可变历史材料，不是当前运行合同或部署指令；旧live/replay CLI已停用。本地离线验证不等于真实模型质量、未来收益或Windows现场验收。

V2 新研究输入使用 `V2_ACCOUNT_RATIOS_ONLY_V1` 投影：保留 Price、OI、Volume、Funding、全市场账户比和顶部交易员账户比；暂时排除顶部交易员持仓份额及其变化。共享采集、原始 Facts 和历史研究展示保留，旧记录不重写。

### 扫描流动性与研究名额

扫描只接纳 `/fapi/v1/ticker/24hr` 的 `quoteVolume > 10000000` USDT（滚动24小时成交额，不是基础币成交量）。恰好1000万、低于门槛或字段无效的合约不会进入深查，也不会通过账户异常通道绕过；`scan.json` 保存筛选口径及拒绝原因。

每轮默认最多研究5个合格候选，继续按原Selector评分、门槛和排序选择。已有环境变量 `MAX_ANALYST_CANDIDATES_PER_RUN` 优先于默认值；生产若显式配置为3，需要改为5，并检查PM2保存的同名环境变量。无需新增必填环境变量。本次未修改本地.env，不自动部署或重启。
