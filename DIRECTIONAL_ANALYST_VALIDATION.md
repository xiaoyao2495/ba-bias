# BA_BIAS_DIRECTIONAL_ANALYST_V1 验收

日期：2026-10-10。实际实现和测试，无真实市场扫描、模型调用或通知。本任务所列“五种标准结论”与“六类”文字不一致，用户已明确不需要第六类，实施五类。

## 1. 新增及修改文件

新增实现：

- `src/analysis/directional-schema.js`：严格输入/输出Schema、五类方向/三种horizon/六种交易机会枚举、Ajv校验。
- `src/analysis/directional-context.js`：可见事实登记表、同长度前段价格证据、时间匹配、兼容方向与预先定义的失效规则。
- `src/analysis/directional-analyst.js`：独立LLM研判、专用Guard、一次修复与明确失败降级。
- `src/analysis/directional-history.js`：不可覆盖快照、已有运行档案复用、生命周期及追加到期评价。
- `test/directional-fixture.js`、`test/directional.test.js`：Mock协议与60项新增专项测试。

修改：

- `src/main.js`：Judge之后接入Analyst、保存快照/档案、Outbox关联ID、方向变化标记、已有快照结果更新。
- `src/intelligence/packet.js`：从原始事实重建Analyst输入再验证；仅展示验证通过的研判，失败不携带模型坏JSON到正式Packet；通知添加方向段及首段RunId。
- `src/storage/history.js`：已输出故事记录增加对应directional链接，原市场事实summary/compare规则不变。
- `src/clients/deepseek.js`：json新增可选maxTokens参数；Analyst用6000，其他调用默认2400保持不变。60秒超时、JSON模式、网络重试及调用档案复用原实现。
- `test/core.test.js`、`test/hourly.test.js`、`test/long-short.test.js`：仅路由新增Mock协议并更新总LLM调用计数，不放宽生成数量、去重、投递或质量业务断言。
- `README.md`：新链路与追踪说明。

新增交付：本验收文件、DIRECTIONAL_ANALYST_INPUT_SCHEMA.json、DIRECTIONAL_ANALYST_OUTPUT_SCHEMA.json、DIRECTIONAL_ANALYST_EXAMPLES.md/.json、DIRECTIONAL_ANALYST_TEST_RESULTS.txt、DIRECTIONAL_ANALYST_STATIC_CHECK.json、DIRECTIONAL_ANALYST_OFFLINE_CHECK.json。

没有修改Scanner、Facts Engine、Detector、config阈值、Story Judge、Writer、原Claim Guard、Binance Client、Scheduler或DingTalk/投递队列。没有重构现有基础设施，文件保存复用atomicWrite/readJson和运行锁。

## 2. 架构核对及最终链路

原Story Judge通过严格Schema、真实Evidence IDs和newsworthinessScore>=65判断新闻价值；比较历史实质变化后判断重复。原Judge没有方向字段。Facts有稳定Evidence IDs、原响应、公式、数据时间及来源；有已收盘价格、区间及OI/Funding/量/账户指标，但没有确认过的结构位、突破、MSS/BOS/FVG。主动买卖量、CVD、Basis和OI/流通市值未实际接入，当前Analyst能力字段全部标false。原JSON客户端使用json_object、解析异常、60秒超时及Http受控重试；新模块复用它。

最终研究：原扫描/独立账户发现 → Facts → 从保存来源重建验证 → 原Story Judge → 独立Directional Analyst → 专用Guard → 不可覆盖研判快照 → Intelligence Packet再次从原来源复核 → 既有History/Outbox → 既有无损分片及持久化钉钉投递。

新闻合格但事实重复的候选也可保存本次研判，之后仍不推送。NO_EDGE不改变Judge新闻结论；Analyst失败不丢掉已合格事实。scan-only模式不调用Analyst，常驻方式及原运行预算不变。

## 3. 输入Schema

完整机器可读定义见 `DIRECTIONAL_ANALYST_INPUT_SCHEMA.json`；运行函数directionalInput(f)只接受当前截止时刻的证据。根对象禁止未知字段，字段为：

- version=DIRECTIONAL_INPUT_V1、symbol、evaluationTime（UTC ISO）。
- entryReference：真实快照price、timestamp、evidenceId；不是模拟下单价格。
- capabilities：priceStructure/takerFlow/cvd/basis/oiMarketCap明确不可用。
- evidence：ID、原结果、可信句、数据时间、计算公式、endpoint/params、scope、统计window。
- windows：1h/4h/24h的priceId、oiId、previousPriceId、时间是否匹配、与事实兼容的方向和强延续条件。
- rules：可选择的同horizon失效/复核条件，包括metric/operator/threshold/outcome及原始依据ID。
- unavailable：未接入指标和顶部接口具体缺失原因；不把缺失当成中性。
- repairErrors：仅修复请求可选，内容为程序验证错误码。

同长度前段价格由现有已收盘1h K线确定性算出，证据例如SYMBOL:directional.price.previous1h；它保留来源和起止时间，原始K线在snapshot.factsPath所指的当轮Facts。不会重写Facts Engine或编造结构。输入不包含后来的研判结果，也不包含未来样本。

## 4. 输出Schema及方向/交易机会

完整严格JSON定义见 `DIRECTIONAL_ANALYST_OUTPUT_SCHEMA.json`，additionalProperties=false：

```json
{
  "version": "DIRECTIONAL_ANALYST_V1",
  "symbol": "TESTUSDT",
  "evaluationTime": "2026-10-10T04:30:00.000Z",
  "marketBias": "BULLISH",
  "horizon": "4h",
  "horizonReason": "采用已验证价格和敞口变化支持的观察尺度。",
  "conviction": "MODERATE",
  "marketThesis": "短线偏多，仍需后续行情检验。",
  "marketMechanism": "价格与未平仓规模变化同时发生，因果仍未确认。",
  "supportingEvidenceIds": ["TESTUSDT:price.closed4h", "TESTUSDT:oi.4h"],
  "conflictingEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_PULLBACK",
  "preferredScenario": "观察价格变化是否延续。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": ["PRICE_OPPOSITE_4h", "OI_REVERSED_4h"],
    "description": "采用程序预先定义的方向失效和证据复核条件。"
  },
  "alternativeScenario": "延续失败并进入回落或震荡。",
  "followUpChecks": ["复核后续价格与OI。"]
}
```

这是协议Mock示例，不代表真实TESTUSDT。

marketBias为BULLISH/BEARISH/BULLISH_REVERSAL/BEARISH_REVERSAL/NO_EDGE，horizon为1h/4h/24h。交易机会独立，枚举LONG_SETUP/SHORT_SETUP/WAIT_FOR_PULLBACK/WAIT_FOR_CONFIRMATION/AVOID_CHASING/NO_ACTIONABLE_SETUP。当前无已验证结构，Guard不允许LONG_SETUP/SHORT_SETUP；方向可明确偏多或偏空，机会仍是等待或无可执行方案。不输出仓位、杠杆、下单指令。

NO_EDGE允许正常生成事实情报。明确价格与OI同时间且价格绝对变化>=1%、OI扩张>=5%、前段没有反向价格走势时，NO_EDGE需要真实竞争证据；不能因Funding或账户分布单独制造冲突逃避方向。该规则只是新Analyst验证边界，不修改Detector阈值或强制所有候选同horizon。反转必须引用同长度的先前相反走势和当前价格转向，不因涨跌过大或Funding极端直接反向判断。

LOW/MODERATE/HIGH是定性证据标签。HIGH仅允许强一致的1h价格/同时间OI扩张和实际相对成交量>=2、没有相反价格背景或竞争证据；没有对Funding和其他相关统计重复计分。OI缺失或时间不匹配必须LOW。没有统计胜率、准确率或预测概率输出。

## 5. 失效条件与生命周期

不编造结构价位。输入提前定义可选规则，模型只能引用规则ID，不能自创门槛：

- PRICE_OPPOSITE_<horizon>：后续新收盘滚动同周期价格变化明显反向。阈值为当前幅度一半与1个百分点的较大值，方向相反；满足则INVALIDATED。这是对方向假设预先约定的机械失效，不宣称结构支撑失守。
- OI_REVERSED_<horizon>：后续精确同周期OI数量变化明显反向。阈值为当前幅度一半与5个百分点的较大值；满足只THESIS_WARNING，不能说某一侧爆仓，也不把小幅变化当失效。
- 无可靠方向/结构可用INSUFFICIENT_STRUCTURE_DATA，说明需要后续完整价格/OI与可靠结构数据；它不能携带假的ruleIds。
- 观察期结束为HORIZON_EXPIRED。INVALIDATED一旦有真实记录不会因后来的价格恢复或历史索引重建而撤销。

检查只用在发布后新收盘/新采样、且不超过horizonEndTime的窗口；滚动窗口起点可在发布前，含义在通知中明确。OI检查需精确端点和连续序列。缺失时不声称“未触发”，invalidationTriggered为null；确实触发为true。价格终点结果、失效与策略收益分开。

## 6. 如何阻止编造和错误解释

专用Guard检查严格JSON、Symbol/evaluationTime、真实且已声明ID、数据不晚于截止时刻、同horizon依据和同时间端点（K线close与OI统计边界允许1ms差）。此前走势证据作为明确的PRIOR_TREND例外。价格方向必须与marketBias兼容，反转必须有相反前段和当前转向；正文与方向矛盾拒绝。未接入指标、结构价位、强平/庄家/聪明钱/资金流/具体开平仓、手写数值/周期/历史概率均拒绝。

数字与Funding支付关系只能通过{{真实evidenceId}}由程序渲染，所以不会把账户比例解释成仓位，或把OI数量增加解释成新增多头。Funding使用真实历史结算，展示Funding不进入Analyst。

模型最多两次语义尝试（初次+一次修复），网络重试/超时仍由既有Http负责；失败明确status=FAILED、方向不可用、保留事实。原始无效响应仅保存研究档案和快照attempts，不进入正式Packet。Packet重建原事实再检验，即使外部传入VALIDATED但篡改的研判也会降级。

## 7. History、MATERIAL_UPDATE与持久化

`data/directional/<32位ID>.json`不可覆盖，保存runId、Symbol、evaluationTime、horizonEndTime、真实参考price及其采样时间、direction/horizon/conviction、originalEvidenceIds、原协议/渲染文本、输入登记表、规则、验证尝试及初始生命周期；factsPath指向原Facts。

History.directionalSnapshots保存索引，已输出故事和Outbox引用对应snapshotId。每次新研判保留独立版本；不覆盖过去观点。原市场事实summary/compare阈值不变：事实重大变化且前后均验证通过、同horizon的方向改变时，标MATERIAL_EVIDENCE_AND_DIRECTION_CHANGE。只有措辞、主观置信度或模型方向选择变化而事实不实质变化时仍DUPLICATE。

原Outbox和分片/投递未改；无每轮/每日输出配额，原7条全量输出及同日38条投递回归继续通过。

## 8. 最小到期评价

研究开始时读取已有快照，使用当前保存Facts及History索引对应的已存运行Facts拼接后续数据；按时间去重，价格冲突的样本排除，不另调用行情接口，不把未来样本交回原Analyst。没有本轮同Symbol后续数据时保留待评价，不声称全市场实时追踪。

追加 `data/directional-results/<snapshotId>/<asOf>.json`，原观点和原输入不改。到期前resultStatus=PENDING且不计算终点净变化/MFE/MAE/方向一致性；到期后不足则INSUFFICIENT_DATA。样本足够时保存：

- endPrice、其真实close时间、相对观察期终点滞后（小于5m且披露）。这是闭合5m样本的终点观察价，不假装任意毫秒的实际成交价。
- netPriceChangePct、directionConsistent（NO_EDGE为null）。
- 完整边界覆盖才保存mfePct/maePct；非整点发布时边界K线排除，仅observedMfePct/observedMaePct，并显示start/end缺口，完整MFE/MAE为null。
- 原规则触发记录、生命周期、使用的来源runIds。
- tradingProfitability永远NOT_EVALUATED，不计算真实策略P&L。

现有5m单次40样本不足完整4h/24h，使用已有小时运行档案补足，Mock验证4h档案拼接可完成；实际未覆盖/档案缺失时仍INSUFFICIENT_DATA。追踪文件损坏隔离为TRACKING_FAILED，不中止其他事实研究。没有大型回测平台或统计胜率。

## 9. 测试、静态及只读离线验证

npm test：199/199通过，原139项保留，新60项，0失败/取消/跳过。原合理业务断言没有放宽；因每个新闻合格候选新增独立模型调用，Mock增加DIRECTIONAL_INPUT_V1路由，精确总LLM次数随之更新（例如7个候选由7改14，19个Judge且7个新闻合格由19改26）。新增专项覆盖用户要求的方向/周期、独立交易机会、NO_EDGE、充分证据、语义边界、Funding、缺失顶部/未知指标、无结构、ID/数值/时间、定性置信度、持久化/实质更新、失败不丢情报、到期前后、原观点不可覆盖、无输出配额及投递。

node --check：33个src/test JS文件全部通过；Ajv Schema编译和运行校验也通过。证据：DIRECTIONAL_ANALYST_TEST_RESULTS.txt、DIRECTIONAL_ANALYST_STATIC_CHECK.json。

只读检查 `data/runs/hourly_20261010_1200/facts/{MAGICUSDT,PIXELUSDT,XMRUSDT}.json`：重新验证Facts并构建输入，三条均通过Schema，未来证据=false，原档案SHA-256前后一致。没有对这三条生成真实预测，没有调阈值或真实模型调用。见DIRECTIONAL_ANALYST_OFFLINE_CHECK.json。

## 10. 三条Mock情报

全部为TESTUSDT合成数据，不是实际币种行情，未发送；完整程序生成通知摘录见DIRECTIONAL_ANALYST_EXAMPLES.md，协议JSON见DIRECTIONAL_ANALYST_EXAMPLES.json。

- BULLISH / 4h / MODERATE / WAIT_FOR_PULLBACK：已收盘4h价格+10.00%、OI数量+5.63%，偏多延续假设但等待回踩。后续新收盘滚动4h价格<=-5%为命题失效，OI<=-5%仅复核。
- BEARISH_REVERSAL / 1h / MODERATE / WAIT_FOR_CONFIRMATION：前一已收盘1h+10.00%，当前1h-10.00%，此前偏强而当前转弱，可能回落。后续新收盘滚动1h价格>=+5%失效。
- NO_EDGE / 1h / LOW / NO_ACTIONABLE_SETUP：所选价格和OI均0%，无明确方向优势；Funding/成交量事实异常仍可输出，等待后续事实。

三例均经过生产专用Guard和Packet的原来源重建复核。它们不表示模型已经经过预测准确率回测。

## 11. 执行边界

没有实际访问Binance、DeepSeek或DingTalk，没有发送真实消息、下单、自动发帖或启动扫描进程；仅Node Mock测试、静态检查和已有档案只读验证。没有修改旧ict-market-context、AI Pro Cron或.env，没有安装PM2/Docker/launchd。原npm run scan仍指向node src/scan-daemon.js，前台常驻和原09:00–23:00小时计划不变。

.env SHA-256仍为8e56336d9f7d53c0b6ebe0da25709b37a213a86fe07463c065a946cfd0ad4adf，仅用于完整性核对，未输出任何敏感值。
