# BA-BIAS V1

独立 Binance USDⓈ-M Crypto 永续市场情报系统。程序验证事实，DeepSeek 判断实质新闻价值，合格、非重复情报保存到 Outbox 并通知用户。Writer 作为可选能力，文案质量不决定情报能否输出。无下单、自动发布或 AI Pro 结果依赖。

## 启动

Node.js >=22。在本项目目录运行：

```sh
npm ci
npm test
npm run doctor
npm run scan:once
npm run once
# 以下命令明确消耗少量 DeepSeek token：
npm run doctor:deepseek
# 单次完整研究并允许投递：
npm run once -- --send
```

自动 runId 为 `scan_YYYYMMDDHH` 或 `once_YYYYMMDDHH`，使用北京时间小时。同一模式同一小时只能启动一次；重复 runId 不再扫描、写稿或投递。需要独立人工复查时：`npm run once -- --run-id manual_20261010_01`。scan 与 once 分别记录，不互相阻止。

当前机器的默认 npm registry 为不可访问的内网地址；如需重新安装，可显式使用 `npm ci --registry=https://registry.npmjs.org`，不必修改全局配置。

`.env` 不纳入 Git，不会覆盖。已有 `ICT_PROXY_HOST` + `ICT_PROXY_PORT` 自动启用 HTTP 本地代理；`ICT_PROXY_ENABLED=0` 强制直连，`=1` 强制代理。DeepSeek 沿用旧项目直连方式，可显式设置 `DEEPSEEK_PROXY_ENABLED=1`。读取 `DEEPSEEK_API_KEY`、`DINGTALK_WEBHOOK`。钉钉使用旧项目的关键词模式：原样使用 Webhook，不读取签名密钥、不添加 timestamp/sign，消息包含关键词「检测」。钉钉默认直连，可用 `DINGTALK_PROXY_ENABLED=1` 显式启用当前代理。

新配置见 `.env.example`：默认 DeepSeek 模型 `deepseek-flash`，可用 `DEEPSEEK_MODEL` 覆盖；保留默认最多深查24个的 API 请求预算；所有深查后有效候选均进入 Judge。已取消前6名 LLM截断、每轮2篇和每日30篇业务配额，没有替换为更大的输出上限。阈值位于 `src/config.js`：24h价格8%、1h价格3%、4h OI数量10%、历史结算Funding绝对值0.1%、费率变化0.05个百分点、相对量2倍。它们是研究启发条件。

## 工作流程与事实口径

1. 官方合约元数据、批量滚动24h ticker、批量 Funding 展示快照初筛。
2. 候选名额一半用于价格/Funding异常，余下名额按成交额排序轮换探测；在探测组中价格1h、OI4h、成交量、费率翻转可独立触发。
3. 仅候选获取1h/5m K线、1h OI统计、真实Funding结算历史和全市场账户比例。最多3个并行 HTTP 请求、150ms启动间隔。
4. Facts保存UTC毫秒、UTC/上海文本时间、原始值、请求参数、端点、公式及稳定证据ID。固定该轮服务器evaluationTime，所有历史请求指定endTime，未收盘K线与未来样本过滤。
5. 所有本轮有效深查候选逐一进入 Judge，严格JSON/JSON Schema，0–100分，65分通过，证据ID必须存在；缺失核心价格/成交量/OI/Funding或无深度异常的候选不交给LLM，并保留明确状态与原因。
6. 合格情报从原始API响应重新构建 Facts，检查原生Crypto身份、有效时间、核心指标、异常与关键证据。保留原 Claim Guard，对程序证据占位符再次验证；输出所有有证据的价格/OI/Funding/成交量/账户数据及 WHAT_CHANGED、NEW_EVIDENCE、WHY_MATERIAL、数据时间/来源、未确认事项与观察点。模型的因果解释不会被当作确定事实推送；没有权威来源的项目全名标为未核实。
7. 全部合格情报原子落盘，再投递；没有合格情报不产生钉钉状态消息。手动默认不发送，`--send` 或常驻模式启用发送。每条情报与各分片有稳定 deliveryId，明确 `errcode=0` 才记 SENT。发送失败不影响后续情报；未知结果记 UNKNOWN，不自动重试。
8. `npm run once -- --write-drafts` 可额外调用 Writer，保留原2–4证据句、原Claim Guard和一次受控修稿规则。可选文章失败只记录 optionalDraft，不撤销已经审核通过的情报；默认只调用 Judge。


已收盘1h/4h/24h涨幅由连续完整K线起始open到最终close计算；与ticker滚动24h涨幅及区间low/high幅度分别存储。成交量比较上一个完整bar与其前24个bar均值；成交额使用K线字段7。量是该交易对API单位，不擅自换算1000/1000000合约为标的币。

OI变化仅使用 `sumOpenInterest`，窗口两端必须相差整1h/4h/24h，保留实际两端采样时间，解释为周期结束统计。`sumOpenInterestValue`只作USDT名义价值辅助，单位乘数未知时不称标的币数量。OI不能证明资金净流入、持仓方向或强平。

Funding保留实际每次结算时间与原费率，百分比=原值×100；过去24h仅对实际存在记录求和，不假设8h间隔，不称收益率。正费率多头支付空头、负费率空头支付多头。当前展示单独标记，不作为历史结算。账户比例只代表统计口径下的净多/净空账户比例。

Crypto筛选联合官方`underlyingType=COIN`、`underlyingSubType`、base/symbol一致及TradFi/特殊跟踪标记。硬排除股票、指数、商品、外汇、PAXG/XAUT等传统资产跟踪品种；未知类型/不匹配排除。项目全名不猜测，仅输出symbol。

## 持久化与运行保护

```text
data/runs/<runId>/
  scan.json                       # 排序、拒绝、覆盖范围
  facts/<symbol>.json             # 可复核事实及最小候选原始响应
  stories/<symbol>.judge.json
  evaluations/<symbol>.json       # 每候选终态 / 原因 / Judge
  intelligence/<symbol>.json      # 重新验证的情报包
  stories/<symbol>.draft.json      # 仅 --write-drafts
  stories/<symbol>.guard.json      # 可选文章审核
  deepseek-calls.json              # API返回、token usage，无密钥
  result.json                     # 状态、输出数、投递数、错误、耗时

data/outbox/<runId>_<symbol>.json  # 合格情报及全部分片、投递状态
data/state/history.json           # 历史故事、轮换进度、runId及计数
data/state/dingtalk-rate.json     # 持久化发送节奏 / 冷却时间
data/state/run.lock               # 整轮锁 PID / 持有者 token
data/state/run.lease/             # proper-lockfile 心跳租约
```

Outbox是情报计数和历史的可恢复来源，每次启动对账。每日计数只用于统计，绝不用于提前停止研究。已发送与已预留的情报参与去重；dry-run档案不阻止未来轮次首次真实通知，也不会被队列补发。历史可产生实质更新：异常种类/符号翻转、滚动价格变化差>=15个百分点、OI 1h/4h/24h变化差>=10个百分点、Funding差>=0.05个百分点、显著相对量变化；+40%到+42%不会仅因此重复。Judge仍要确认新闻价值。同一symbol无硬性24h禁发。

文件损坏时失败关闭，不回退空状态。运行锁结合原子心跳租约和 PID 存活检查：崩溃留下的租约过期（5秒）且旧 PID 已退出后自动恢复；存活进程的锁不会被抢占。失败/中断runId不自动重跑；查明原因后使用新runId。网络临时失败最多2次退避重试，429尊重Retry-After且至少全局冷却60秒，418停止重试并冷却5分钟，权重达到官方上限80%冷却60秒。扫描阶段默认3分钟独立AbortSignal预算，预算到期保留已完成事实并使用合格候选继续研究（结果记录scanBudgetExceeded及未覆盖原因）；整轮默认15分钟AbortSignal，DeepSeek单请求60秒，行情15秒。单个候选失败被记录，不影响其他候选。

## 前台常驻调度

```sh
npm run scan
# 等价直接入口：
node src/scan-daemon.js
```

两种入口调用相同程序，终端保持运行。使用 node-cron，明确 `timezone: Asia/Shanghai`、`0 9-23 * * *`，每日09:00–23:00共15个计划小时。启动只显示配置和下一轮时间，不立即扫描或补跑历史；计划整点延迟10秒获取已收盘行情。稳定 runId 为 `hourly_YYYYMMDD_HH00`，归属计划小时。

常驻与手动研究共享 `runResearch`，保留事实口径和阈值；逐一评估全部有效深查候选，输出全部合格新情报，不限制输出数量。没有合格新情报只记本地日志。`npm run scan:once` 只读取市场/Facts，不调用 DeepSeek 或钉钉；`npm run once` 完整研究但不发送，`npm run once -- --send` 允许发送。`npm run scheduler` 保留为常驻入口兼容别名。

运行中显示研究阶段和发送结果，结束等待下一小时。重复小时不执行，重启读取持久化结果；重叠记 `SKIPPED_OVERLAP`，迟到一分钟及以上记 `SKIPPED_MISSED`，均不补跑。每轮保存 result.json，包括零文章、失败、中断与跳过轮次；记录计划/实际开始/评估/数据截止/结束时间、扫描/研究/稿件/投递数量、拒绝原因、token与耗时。每日生成与确认发送计数分别保存在 history.daily。

候选终态保存在 result.candidateEvaluations 和 evaluations 文件：ELIGIBLE、MATERIAL_UPDATE、DUPLICATE、NOT_NEWSWORTHY、INSUFFICIENT_EVIDENCE、JUDGE_FAILED、DATA_ERROR。超时/中断/扫描预算未覆盖项单独记 NOT_EVALUATED 和原因，不冒充已完成研究。各候选评估后保存检查点；崩溃恢复保留已完成评估，标明未完成项，不自动重跑该小时。

钉钉情报按UTF-8字节无损分片（每片≤1800字节，含关键词、symbol、deliveryId、分片序号），所有分片先保存。每个分片分别记录状态与确认；已SENT片不重发，只有全部分片确认成功才将整条情报记SENT。每次请求至少间隔3.5秒，并持久化节奏，依据[钉钉官方说明](https://www.dingtalk.com/qidian/page-jqSgmWOb.html)的每分钟20条频率上限留出余量。遇HTTP429或明确业务频率拒绝，保留PENDING并至少冷却10分钟，尊重更长Retry-After；明确临时失败每分片总计最多5次尝试，永久失败保留FAILED，不静默删除。

常驻进程每5秒检查新版、明确开启发送的情报队列（此计时器仅用于投递，不决定研究时刻）。每次队列处理有2分钟预算；预算到期仍保留PENDING，下次继续。该队列可以跨重启恢复，旧版文章/dry-run不会进入；UNKNOWN不盲目重发。研究与队列共享运行锁，整点研究会取消并等待当前队列处理释放锁，然后优先研究。生成数与全部分片确认后的发送数分别统计。

按 Ctrl+C（SIGINT）或 SIGTERM：停止新任务，取消当前请求/等待，保存摘要与投递状态，释放运行锁后退出。关闭终端即可结束；没有安装任何后台服务或开机启动。本次验证没有实际启动常驻进程，也没有发送真实钉钉。

## 测试与现场验证

`npm test`仅使用明确标记TEST FIXTURE的合成数据和mock，不联网、不消耗token、不使用webhook。覆盖关键事实、JSON Schema、禁止语义、API重试/并发、默认不发送、锁与runId、实质性更新、原子存储、完整模拟流程。原版现场结果见`data/`与`VALIDATION.md`，历史调度验收见 `HOURLY_VALIDATION.md`，取消配额验收见 `INTELLIGENCE_VALIDATION.md`，本次多空研究验收见 `LONG_SHORT_VALIDATION.md`；离线测试不能证明真实文章质量。

## V1限制

- 有限探测意味着全市场仅1h/OI/量异常可能暂时漏报，轮换在后续运行扩大覆盖；不声称每轮完整遍历全部深度指标。
- 分类依赖官方元数据与保守规则。元数据误标、全新传统跟踪ticker仍需人工核对；规则可维护，未知类型排除。
- 非数值语义拦截是保守规则，不能证明因果解释正确，最终必须人工审核。
- 精确窗口缺失不补相近样本；新上线、低流动性、接口不完整候选可能被拒绝。
- 生成数与已确认钉钉发送数独立；投递不确定不自动重试。未实现独立`send-outbox`补发命令。
- 未开发新闻/链上/社交验证、前端、数据库、自动比较评分、交易和自动发布。没有启动Shadow定时运行。

## 来源与迁移

旧项目严格只读检查了`package.json`、`data/binanceRest.js`、`data/binanceHttpTransportV1.js`、`data/binanceRateLimitGovernorV1.js`、`config/network.js`、`ai/deepseekClient.js`、`notify/dingTalk.js`。复用Axios客户端/显式proxy方式、严格合约源思路、已收盘过滤、权重/429冷却方式、DeepSeek JSON模式与直连/关闭thinking、钉钉关键词模式的原始Webhook/text消息与errcode校验方式；不整体复制旧项目，不依赖其运行时文件，未迁移现货回退或交易实现。

实现时核对[Binance官方Market Data接口](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data)的元数据和原始字段；DeepSeek默认模型与关闭thinking方式参考[官方首次调用](https://api-docs.deepseek.com/)及[Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode/)。旧模型名可通过环境变量保留。


## 多空分布情报 V1

保留原价格/OI/Funding/成交量探测，新增全市场账户变化发现通道，研究范围为官方元数据通过原生 Crypto 过滤的全部 USDT 永续合约。每币查询 `globalLongShortAccountRatio` 的 `period=1h, limit=30, endTime=evaluationTime`；异常币种与原候选按 Symbol 合并，账户异常追加不受原24个探测名额限制。使用现有请求代理、3并发、150ms请求间隔、超时和重试；统计接口额外执行本进程共享的1000请求/5分钟上限（其他程序共用IP时仍以服务器429冷却为准）。发现阶段默认最多90秒且不超过原扫描预算的一半，为深查留出预算；不限制每轮/每日合格情报输出。预算不足属于工程中断，覆盖报告列出未请求/不完整符号与原因，并将未请求后缀优先轮换到下一轮。

深查复用全市场序列，并查询顶部账户 `topLongShortAccountRatio` 与顶部持仓 `topLongShortPositionRatio` 的30个1h样本。顶部接口按当前官方文档需要 `X-MBX-APIKEY`；仅支持已有环境中的 `BINANCE_FUTURES_API_KEY` 或 `BINANCE_API_KEY`，无需 Secret、签名或交易权限，不在档案中保存请求头。本次环境没有 Binance Key，运行时将记 `BINANCE_MARKET_DATA_KEY_MISSING`；未补写 `.env`、未联网验证顶部访问。权限/限流/空数据不阻止其他合格指标研究。

`facts.longShort` 包含 `global`（GLOBAL_ACCOUNTS）、`topAccounts`（TOP_TRADER_ACCOUNTS）、`topPositions`（TOP_TRADER_POSITIONS），原响应及查询参数保留在 sources/raw。占比单位为 percent，变化为 percentage_points；顶部持仓是其统计样本内的持仓份额，绝非账户比例或全市场OI多空拆分。最新样本必须不晚于 evaluationTime 且年龄小于1h，1/4/24h变化需精确时间差且中间样本连续；不插值、不采用近似起点，缺失返回null及原因。允许接口具有固定非整点采样相位，但跨来源比较必须精确同时间。

独立规则集中在 config.longShort：1h/4h/24h变化分别达到5/10/15个百分点；主导侧严格跨越50%，1个样本为SINGLE_SAMPLE、至少2个连续新侧样本为CONFIRMED，单小时返回标注TRANSIENT_RETURN；50/50或缺口不确认。顶部/全市场账户背离为同一采样时刻多头账户占比差绝对值>=15个百分点，或同一精确4h窗口反向变化且双方绝对变化都>=5个百分点。顶部持仓不参与账户对账户背离判定。这些规则用于异常发现，仍需完整Judge判断新闻价值。

证据ID采用 `SYMBOL:global.long.change4h`、`SYMBOL:global.short.change4h`、`SYMBOL:global.flip`、`SYMBOL:topAccounts.long.change4h`、`SYMBOL:topPositions.long.change4h`、`SYMBOL:topGlobal.divergence` 等稳定命名。Facts、Judge、情报包、Outbox及History均保留研究结果。History增加占比/变化/主导侧/翻转状态/背离摘要；对应可验证数值较已输出变化>=5个百分点、主导侧变化、新翻转或SINGLE_SAMPLE到CONFIRMED可构成MATERIAL_UPDATE；新增异常类型仍沿用原判断。时间戳前移或确认样本数继续增长不构成重复发送理由，缺失值不参与数值变化比较。

每轮覆盖证据在 `data/runs/<runId>/accounts-coverage.json` 与 `accounts-discovery/<symbol>.json`，扫描汇总在 `scan.json`，历史覆盖/轮换状态在 `data/state/history.json`。完整度统计区分 requested、fullyEvaluated、insufficientData、unrequested、uncovered；已有有效短窗异常可入选但缺失长窗仍标未完成覆盖。深查超时且核心数据不足记NOT_EVALUATED，不记无新闻价值。INTELLIGENCE_FIRST钉钉正文分组展示三种口径、精确区间和百分点变化、翻转确认与背离判断；原UTF-8无损分片、独立deliveryId、有限重试、持久化队列及UNKNOWN保护不变。


## Directional Analyst V1

新闻价值与方向判断分离：Scanner → 已验证Facts → Story Judge → 独立Directional Analyst → Intelligence Packet → History/Outbox → 原钉钉队列。保留价格/OI/Funding/账户比阈值、原扫描及投递实现。支持BULLISH、BEARISH、BULLISH_REVERSAL、BEARISH_REVERSAL、NO_EDGE五类，观察周期1h/4h/24h；marketBias与tradeOpportunity独立。当前没有可靠结构、CVD、主动买卖量、Basis或OI/流通市值，因此不会生成立即执行的LONG_SETUP/SHORT_SETUP或虚构结构价位。

输入只取截止时间内可见的确定性证据。同长度前一段价格窗口由已有已收盘K线算出并单独标记证据，用来核对反转依据；这不是支撑阻力检测。模型Schema和专用Guard严格检查枚举、Evidence IDs、窗口和采样时间、价格方向一致性、未经证实的交易行为及数值。事实优先使用证据占位符由程序渲染；文字数值也可通过已声明证据的指标、单位、窗口、统计口径、符号和严格舍入验证。程序失效阈值只能引用当前周期已选规则。Funding支付关系须与已结算证据一致；否定说明按局部断言处理，不能掩盖未经证实的肯定断言。一次受控修复后仍失败，通知明确写研判未通过验证并保留事实；NO_EDGE也不会否决新闻事件。Analyst使用同一DeepSeek客户端、代理、超时和网络重试，独立请求输出预算6000tokens，其他调用默认仍2400，不设候选或情报数量配额。

每次新闻合格的研究（包括去重后不通知的判断）保存不可覆盖快照到data/directional/<id>.json，包含当时价格/时间、原始协议、证据登记表、失效规则和验证尝试。History记录索引，Outbox保存对应ID。事实达到已有MATERIAL_UPDATE条件且同一horizon的有效方向改变时，标注MATERIAL_EVIDENCE_AND_DIRECTION_CHANGE；仅措辞或主观置信度改变不推送。

新收盘滚动价格窗口的显著反向变化为预先定义的方向命题INVALIDATED；精确OI变化反向仅THESIS_WARNING，不代表某一侧爆仓。观察期结束为HORIZON_EXPIRED。后续研究复用当轮及已有运行档案补充到期评价，不为追踪另请求行情。结果追加到data/directional-results/<id>/<asOf>.json，不覆盖原观点，也不传回原Analyst。到期前为PENDING；数据不足为INSUFFICIENT_DATA；有足够5m收盘样本时保存终点观察价、实际观察时间/滞后、净变化及方向一致性。只有完整覆盖边界时才声明完整MFE/MAE，其他情况只保存已观察区间的excursions，缺口明确披露。真实交易盈利始终NOT_EVALUATED。

npm run scan仍为原Node前台常驻；实现时没有启动进程、调用真实API或发送消息。完整输入/输出Schema、Mock示例、只读回放和测试验收见DIRECTIONAL_ANALYST_VALIDATION.md。

### 验证链路恢复（VALIDATION_RECOVERY_V1）

Judge仅缺storyAngle时最多执行一次字段补全，其他决定和评分保持原响应，再完整验证合同及事实。诊断保存在新运行stories/<symbol>.judge-validation.json。精简Packet标记CORE_EVENT_EVIDENCE，保留Judge选中的回撤、区间幅度和价格窗口事实；消息长度仍由原无损分片处理。历史消息不会重新投递。

离线验收与逐条回放见 BA_BIAS_VALIDATION_RECOVERY_V1.md、BA_BIAS_VALIDATION_RECOVERY_V1_REPLAY.md。`node scripts/validation-recovery-replay.js`仅读取保存数据并写独立验证报告，不扫描、不调用模型、不投递。该脚本保留本次任务前的只读快照，未来有意变更受保护文件后须另建验收快照，不能用旧快照判断新任务。

## Directional Analyst 合同对齐（V2）

未来运行使用 `DIRECTIONAL_ANALYST_V2`；输入保留 `DIRECTIONAL_INPUT_V1` 传输容器，并显式携带 `contractVersion=DIRECTIONAL_ANALYST_V2`。Prompt、输出Schema、验证器和Packet共用同一语义，旧V1快照按旧验证规则处理。事实、可能机制和未来方向假设分开验证；支持显式跨周期事实引用及基于此前同长度价格窗口的反转假设。Evidence只能证明预测依据，不能证明未来结果。

无可靠结构时可用 `METRIC_BASED_REASSESSMENT` 或 `INSUFFICIENT_STRUCTURE_DATA`，不编造价格失效位。只有已定义并实际选择的规则可以自动触发失效；OI规则只触发复核。首次合同失败最多一次受控模型修复，失败仍标记FAILED，Facts情报正常输出。

离线验收与逐样本证据见 `BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1.md`、`BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1_REPLAY.md`。本次没有启动扫描或调用真实接口；`npm run scan` 的前台常驻方式不变。
