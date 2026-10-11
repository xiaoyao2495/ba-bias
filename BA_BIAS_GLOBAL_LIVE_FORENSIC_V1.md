# BA_BIAS_GLOBAL_LIVE_FORENSIC_V1

## 1. Executive Summary

**22:00深查63个Symbol，55个有深查异常并全部进入Judge；35个Judge通过、35个Analyst全部验证失败，History去重4个，生成31条情报，确认发送31条物理消息。** 用户收集的25+5不是全部实际输出。21:00生成35条、最终140个分片全部SENT；result.json中的19已发/16待发是当轮结束快照。

方向失败的共同主障碍：**所有95份通过Schema的模型JSON均命中UNTRUSTED_NUMBER_OR_PROBABILITY**。模型在自由文本中手写1h/4h/24h、规则ID或数值，违反占位符以外禁止数字的合同；并叠加跨窗口、未声明引用和未经证实的开平仓解释。另有38次Schema、7次JSON解析失败。140次Analyst逻辑请求均保存模型返回内容，不支持网络整体失败归因。词法验证器也会把正确否定句当成违规：显式否定误命中至少涉及21:00的20个Symbol/27次尝试、22:00的19个Symbol/25次尝试；不意味着这些完整响应本来有效。

22:00有22条翻转相关输出，4条在22:00采样新跨界、18条以前跨界持续存在。12条只有账户翻转异常，其中11条历史已达3—23h；10个旧NEW_STORY对应21:00 Judge漏storyAngle拒绝后，22:00才首次输出。主要噪声来源是旧翻转持续进入候选、延迟首报、符号和异常标签无幅度的UPDATE，而不是精简格式增加了输出资格。

15条UPDATE独立审计：10条有较明确的新研究信息，1条滚动窗口主导、2条微小数值漂移、2条单点新跨界是否值得独立UPDATE仍不确定。另发现两轮27次Judge Schema失败全部缺storyAngle，其中26次原始模型写eligible:true；22:00还有1次Judge JSON失败。4条精简消息省略Judge选中的price.drawdown，例如MAGIC高点至快照-35.54%未展示；完整Facts仍保留。

本次只写审计报告及必要附录，未改代码、阈值、Prompt、Schema、.env、History、Outbox。未调用Binance/DeepSeek/钉钉，未运行测试、scan/once或重放消息；未调用会写回状态的loadOutbox/reconcile/flushDeliveryQueue，仅直接读文件并在独立进程内验证已有数据。

## 2. Actual Run Counts

| 阶段/数量 | 21:00 | 22:00 |
| --- | --- | --- |
| Universe / 原生Crypto | 924 / 518 | 924 / 518 |
| 原始触发槽+流动性探针 | 12+12 | 12+12 |
| 账户发现请求/完整评估 | 486 / 483 | 485 / 482 |
| 账户异常发现 | 46（翻转44、分布变化2） | 45（翻转43、分布变化2） |
| 账户额外深查 | 39 | 39 |
| Facts / 核心合格 | 63 / 63 | 63 / 63 |
| 有效异常 / 无深查异常 | 56 / 7 | 55 / 8 |
| Judge调用 / 合法结果 / Schema失败 / JSON失败 | 56 / 37 / 19 / 0 | 55 / 46 / 8 / 1 |
| Judge通过 / 不通过 | 35 / 2 | 35 / 11 |
| Analyst Symbol / 模型返回内容次数 | 35 / 70 | 35 / 70 |
| Analyst可解析JSON / 解析失败 | 67 / 3 | 66 / 4 |
| 有效方向 / 不可用 | 0 / 35 | 0 / 35 |
| History DUPLICATE | 0 | 4（ENS、MOVR、LA、PUMP） |
| Outbox / NEW_STORY / MATERIAL_UPDATE | 35 / 27 / 8 | 31 / 16 / 15 |
| 当轮结束已发情报 / 待发 | 19 / 16 | 31 / 0 |
| 读取时完整投递情报 / 物理分片 | 35 / 140 | 31 / 31 |
| 未评估深查候选 / 当前UNKNOWN | 0 / 0 | 0 / 0 |

证据：[data/runs/hourly_20261010_2100/result.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/result.json)、[data/runs/hourly_20261010_2200/result.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/result.json)、两轮scan.json/accounts-coverage.json及Outbox。21:00 PARTIAL、900015ms；22:00 PARTIAL、738108ms。PARTIAL包含Judge错误，并不表示未研究候选。

21:00全部研究已完成，900015ms整轮预算、16个PENDING和队列退出代码共同支持“超时发生在投递阶段”；没有独立RUN_TIMEOUT日志，精确中断事件日志为NOT_RECOVERABLE_FROM_CURRENT_ARTIFACTS。16条后续发送已确认；result快照未随异步完成更新。代码 [src/main.js:164](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:164)、[src/main.js:185](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:185)。

账户发现21:00未请求32+不足3=35；22:00未请求33+不足3=36。深查补采后，可用全市场账户覆盖分别485/518、483/518，仍有33/35个没有本轮可用账户研究，不得视为没有异常。63份Facts核心都可用；7/8份无深查异常有明确终态，不属于未评估。原始24个触发/轮转名额是工程覆盖机制，不是合格输出数量配额。

## 3. Directional Analyst Failure Analysis

### 真实执行链

[src/main.js:116](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:116)重建Facts → [src/content/story-judge.js:6](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/content/story-judge.js:6)Judge → main.js:121 Analyst → [src/analysis/directional-context.js:6](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-context.js:6)确定性输入/证据注册表 → [src/clients/deepseek.js:9](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/deepseek.js:9)模型返回 → :17 JSON.parse → [src/analysis/directional-analyst.js:7](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js:7)Schema → :8—25身份/时间/窗口/方向与反转依据/失效规则 → :28—40语义 → :54—59两次尝试、FAILED降级 → main.js:124保存尝试和独立Snapshot → [src/intelligence/packet.js:43](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js:43)再次验证进入Packet。

两轮70个输入均通过输入Schema；当前比例、历史变化、价格、OI、采样与来源注册表已传入。顶部接口因BINANCE_MARKET_DATA_KEY_MISSING不可用；priceStructure/takerFlow/CVD/Basis/OI市值比能力明确false，不允许补造。相同能力限制下Mock能通过，故不是全局缺必需Facts解释。

DeepSeek共251次逻辑返回（Judge111+Analyst140），全部finish_reason=stop。Analyst133份可解析JSON、7份解析失败；最终请求失败记录0。HTTP状态码/底层重试与网络尝试次数/供应商请求ID均UNKNOWN，不将逻辑返回数等同底层HTTP次数。按scan排序顺序及每Symbol尝试关联calls，126/126、125/125完全匹配；合法JSON重新在内存校验与保存错误一致，0差异。没有调用模型。

### 失败计数

按尝试计数，涉及Symbol数单列；类别和错误码可重叠，不能相加。Schema提前return，其他错误0不代表被提前拒绝的文本一定正确。

| 失败代码 | 21:00 尝试/涉及Symbol | 22:00 尝试/涉及Symbol |
| --- | --- | --- |
| UNTRUSTED_NUMBER_OR_PROBABILITY | 49 / 31 | 46 / 31 |
| DIRECTIONAL_SCHEMA_INVALID | 18 / 15 | 20 / 19 |
| UNDECLARED_TEXT_EVIDENCE | 39 / 25 | 38 / 29 |
| MIXED_SUPPORT_WINDOWS | 25 / 21 | 31 / 25 |
| SUPPORT_SAMPLES_NOT_ALIGNED | 11 / 10 | 5 / 5 |
| UNSUPPORTED_CAUSE_OR_ORDER | 19 / 17 | 27 / 21 |
| WRONG_ACCOUNT_OR_OI_SCOPE | 32 / 22 | 29 / 20 |
| FUNDING_DIRECTION_MUST_USE_EVIDENCE | 39 / 27 | 40 / 29 |
| UNAVAILABLE_INDICATOR_OR_STRUCTURE | 18 / 15 | 14 / 13 |
| UNTRUSTED_SYMBOL_OR_METRIC | 14 / 10 | 8 / 8 |
| INVALID_LLM_JSON | 3 / 3 | 4 / 4 |
| UNKNOWN_EVIDENCE | 0 / 0 | 0 / 0 |
| FUTURE_EVIDENCE | 0 / 0 | 0 / 0 |
| PRIOR_TREND_REQUIRED | 0 / 0 | 0 / 0 |
| UNKNOWN_OR_MIXED_INVALIDATION | 0 / 0 | 0 / 0 |

第二次尝试最后失败阶段：21:00 JSON_PARSE 1、SCHEMA 10、EVIDENCE_OR_SEMANTIC 24；22:00 SCHEMA 10、EVIDENCE_OR_SEMANTIC 25。有效BULLISH、BEARISH、BULLISH_REVERSAL、BEARISH_REVERSAL、NO_EDGE两轮全部0；ANALYST_UNAVAILABLE各35。22:00其中4个方向研究发生在之后被去重的Symbol。

原始合法JSON里的方向（不是有效结果）：21:00 BULLISH13/BEARISH8/NO_EDGE46；22:00 BULLISH13/BEARISH6/NO_EDGE47。7份非法JSON可从明确marketBias文本恢复为21:00 BULLISH2/BEARISH1，22:00 BULLISH1/BEARISH2/NO_EDGE1，仍未验证。fallbackAnalyst设置analysis.marketBias=NO_EDGE且status=FAILED，不是VALID_NO_EDGE。

### 原始样例与分类根因

1. **MODEL_OUTPUT_ERROR / SCHEMA_CONTRACT_MISMATCH**：95/95 Schema合格尝试被数字词法规则拒绝。AIOT22:00第一次horizonReason开头“4h窗口价格与OI同向且被标记为强延续”，支持ID混入1h；第二次仍混入24h价格/OI、1h量。[data/runs/hourly_20261010_2200/directional/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/directional/AIOTUSDT.json) #/attempts/0、1。模型原始偏多不等于整份合法偏多。
2. **MODEL_OUTPUT_ERROR（Schema）**：38次，常见额外horizonReasonNote/evaluationTimeNote/descriptionNote字段，alternativeScenario放入invalidation而非顶层，或文本超400。AJV具体错误条数：21/22 additionalProperties17/20、required2/5、maxLength1/1（同次可多个）。原attempt只记粗码，本次用既有raw在内存恢复instancePath/params，没有修复输出。
3. **VALIDATOR_FALSE_REJECTION（语句级确定）**：[src/analysis/directional-analyst.js:35](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js:35) /账户.{0,12}(持仓|仓位|资金)/ 同样匹配“账户比例不代表仓位或资金比例”。AR21:00第二次followUpChecks有此正确否定声明；第33行拒绝“未接入可靠价格结构，无法定义结构失效位”。至少52次显式否定误命中详细字段/引用见附录confirmedNegationFalsePositives；附近有否定字但确实推断建仓的不纳入52次。整份响应通常还存在真实错误，不宣称52次应直接通过。
4. **INVALID_MARKET_INFERENCE（合理拒绝）**：API3/AR原始机制写“价格下行与OI数量同步下降，更符合多头平仓/离场而非新空大举建仓”，确属无证据的具体开平仓解释。禁止因果保护不能为提高通过率删除。
5. **MODEL_OUTPUT_ERROR（JSON）**：7份已有content但JSON非法，finish_reason=stop；不是已证实的空响应、HTTP故障或Token预算截断。原文全部存在deepseek-calls.json；附录存精确JSON异常和局部片段，可脱敏复核。
6. **ERROR_OBSERVABILITY_GAP**：[src/analysis/directional-analyst.js:57](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js:57)只存safeError；[src/config.js:27](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/config.js:27)压缩异常，未留完整字段路径/HTTP详情。deepseek.js:15在HTTP返回后才写calls，请求失败没有call条目；[src/main.js:193](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:193)finally统一落盘，硬退出前可能没有已完成响应的持久副本。本批可全部恢复不代表所有未来中断也能恢复。

结论是同一模型输出合同与词法验证系统性不相容，重试只收到粗码而反复犯错。没有证据支持全局LLM_API_ERROR或未调用Analyst。**原本完全有效的BULLISH/BEARISH被误拒绝数量UNKNOWN/无法证明**：有语句级误拒绝，但完整原响应均还有其他违约；禁止把它们自动改判为有效方向。

## 4. Account Dominance Flip Forensics

[src/market/long-short-facts.js:70](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/long-short-facts.js:70)按longAccount与50%比较LONG/SHORT，正好50为BALANCED；没有迟滞带、最低跨界幅度。:79—89从最新采样往前找相邻连续同侧段，前一反侧采样确定该连续段首次跨界时间。2个及以上CONFIRMED，1个SINGLE_SAMPLE；若再前一小时已是当前侧则TRANSIENT_RETURN。不是仅对比24小时前端点，缺口/50平衡会打断确认。count<=24保持dominanceFlip=true。

[src/market/long-short-detector.js:9](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/long-short-detector.js:9)对所有仍true的全市场翻转每轮继续加异常，CONFIRMED strength2即20分，单点/短暂strength1。没有只在新发生时触发限制。1/4/24h变化独立用精确连续样本算百分点；分布shift阈值5/10/15pp。顶部账户与顶部持仓口径分离，背离只用同周期、同采样时刻的账户对账户。

**五个时刻不能混用：**

- 跨界时间是连续段首次跨界的小时统计采样时间；变化实际发生在相邻两点之间，不是逐笔成交时刻；也不是Symbol历史上第一次翻转。
- 首次检测是现存同事件文件最早source.retrievedAt，之前没有保存的观察NOT_RECOVERABLE_FROM_CURRENT_ARTIFACTS。
- 第二个新侧样本是样本层面的可确认时刻；系统第一次看到CONFIRMED另用最早retrievedAt。
- 本轮研究为evaluationTime；情报持久化为generatedAt；实际通知为每part.acknowledgedAt。

WIF：03:00多49.94%→04:00多50.06%，跨界仅0.12pp；05:00样本已可确认，但现存系统第一次看到CONFIRMED是21:00:44.521（18样本）。21:07:59生成NEW_STORY，末分片21:18:48.467确认。22:00同一04:00事件、19样本，距跨界18h；本轮Judge缺storyAngle，没有22:00新Outbox。NEW_STORY表示没有此前真实输出，不表示翻转刚发生。

| Symbol | 最新连续段跨界采样（北京） | 22:00年龄/状态/确认样本 | 本轮新跨界？ | 输出结果 |
| --- | --- | --- | --- | --- |
| WIFUSDT | 2026-10-10 04:00:00 | 18h / CONFIRMED / 19 | 否 | JUDGE_FAILED（缺storyAngle），无22:00输出 |
| MAGICUSDT | 2026-10-10 22:00:00 | 0h / SINGLE_SAMPLE / 1 | 是（新采样） | MATERIAL_UPDATE / SENT |
| MINAUSDT | 2026-10-10 21:00:00 | 1h / CONFIRMED / 2 | 否 | MATERIAL_UPDATE / SENT |
| STRKUSDT | 2026-10-10 07:00:00 | 15h / CONFIRMED / 16 | 否 | MATERIAL_UPDATE / SENT |
| HEIUSDT | 2026-10-10 14:00:00 | 8h / CONFIRMED / 9 | 否 | MATERIAL_UPDATE / SENT |
| KAITOUSDT | 2026-10-10 19:00:00 | 3h / CONFIRMED / 4 | 否 | NEW_STORY / SENT |
| BABYUSDT | 2026-10-10 08:00:00 | 14h / CONFIRMED / 15 | 否 | NEW_STORY / SENT |
| SPKUSDT | 2026-10-09 23:00:00 | 23h / CONFIRMED / 24 | 否 | NEW_STORY / SENT |
| ALGOUSDT | 2026-10-10 07:00:00 | 15h / CONFIRMED / 16 | 否 | NEW_STORY / SENT |
| SEIUSDT | 2026-10-09 23:00:00 | 23h / CONFIRMED / 24 | 否 | NEW_STORY / SENT |
| ZROUSDT | 2026-10-10 14:00:00 | 8h / CONFIRMED / 9 | 否 | NEW_STORY / SENT |

完整44+44个Facts翻转（含未输出）的前后跨界数据、最早可见检测/确认、同事件旧历史见附录flips；所有22条已输出翻转见表B，未只挑定位案例。

22:00账户发现43翻转+2分布变化，US不在账户覆盖但原始深查补采新翻转，因此Facts共44翻转。30份Facts只有翻转异常，仍全部进入Judge。账户通道增加39深查（24→63）；无法逐Symbol精确归属这39名额，因原始触发/轮转名单未单独保存。不能伪造删掉账户通道后的精确Judge/发送反事实。

22条翻转输出=4个22:00新跨界（MAGIC、US、RLC、SAHARA）+3个21:00跨界（MINA、QNT、SUPER）+15个更旧。9条同时有价格/OI/Funding检测异常，另1条SUPER有成交量异常；12条没有其他异常，占31条38.71%。纯ACCOUNT_DISTRIBUTION_SHIFT输出0。

12条纯翻转中11条历史3—23h，只有SAHARA新跨界；其中10条跨界不到1pp，ZRO约1.52pp、XMR约6.57pp，不能概括为全部微变化。10个旧NEW_STORY（XMR、ALGO、SEI、ZRO、GRASS、KAITO、BABY、SPK、WLFI、MET）都对应21:00 Judge缺storyAngle，22:00才有效首报。确认计数18→19不进入History flip对象，通常不触发UPDATE；单点→CONFIRMED会改变status触发。旧翻转和新价格/量异常可共存，不能因含翻转自动降整条价值。

## 5. MATERIAL_UPDATE Forensics

[src/storage/history.js:50](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js:50)摘要保存三类占比、1/4/24h变化率、dominantSide、flip.status/from/to/timestamp（不含确认样本数），另含滚动24h价格、OI1/4/24h、最新结算Funding、1h量倍数、排序anomaly数组。history.snapshot仅展示费率/时间，供初筛，不能代替已推送历史。

[src/storage/history.js:75](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js:75)为OR：分布占比/变化率差>=5pp、dominantSide改变、flip对象改变、异常数组改变、滚动价格/OI4h/Funding符号改变、滚动价格差>=15pp、OI各窗口差>=10pp、Funding差>=0.05pp、当前量>=2且倍数差>=2。符号/标签变化无幅度/迟滞门槛。anomaly数组保留1h与5m两个VOLUME_SPIKE，变化不一定是新增一种异常。未拆分窗口新终点与旧基准出窗；4h变化率差5pp不等于最新账户占比变化5pp。

同Evidence ID再现、截止刷新不是直接UPDATE条件，newEvidence只展示；已确认同事件计数增长不触发，单点→确认或新跨界时间会触发。首次无真实输出为NEW_STORY。APR/AIOT/MINA对比20:00，因21:00没有有效Outbox；不能默认对比上一小时研究。SHADOW不抑制真实首报，PENDING/UNKNOWN保留去重。格式升级未改变History；70次方向均FAILED，也没触发有效方向更新分支。

| Symbol | 上一实际输出 | 命中条件 | 主审计分类 | 判断依据 |
| --- | --- | --- | --- | --- |
| ERAUSDT | hourly_20261010_2100 | LS_global.4h_DELTA>=5pp；ANOMALY_SET_CHANGED | MEANINGFUL_ESCALATION | 量2.20→3.33倍且账户本小时-3.63pp，有新组合信息；Funding极端值本身并非本轮新结算。 |
| MAGICUSDT | hourly_20261010_2100 | LS_global_DOMINANT_SIDE_CHANGED；LS_global_FLIP_METADATA_CHANGED；ANOMALY_SET_CHANGED | UNDETERMINED | 新跨界仅0.75pp且单样本；历史极端Funding和大涨延续，是否应作为独立重要UPDATE仍不确定。 |
| USUSDT | hourly_20261010_2100 | LS_global_DOMINANT_SIDE_CHANGED；LS_global_FLIP_METADATA_CHANGED；ANOMALY_SET_CHANGED | MARKET_REGIME_CHANGE | 账户本小时明显偏移并跨界，价格继续即时回落；指账户/参与组合改变，不指已验证价格方向反转。 |
| APRUSDT | hourly_20261010_2000 | ANOMALY_SET_CHANGED；OI_DELTA>=10；OI1_DELTA>=10 | MARKET_REGIME_CHANGE | 相较20:00，OI1h 24.67%→2.20%，OI4h51.33%→37.00%，极端放量退潮；扩张阶段明显降温。 |
| MINAUSDT | hourly_20261010_2000 | ANOMALY_SET_CHANGED；OI_SIGN_CHANGED | EVENT_CONFIRMATION | 21:00首次跨界在22:00获第二样本；上次发布为20:00，21:00因Judge字段缺失没有输出。 |
| BATUSDT | hourly_20261010_2100 | LS_global.longPct_DELTA>=5pp；LS_global.shortPct_DELTA>=5pp；LS_global.4h_DELTA>=5pp；LS_global.24h_DELTA>=5pp；ANOMALY_SET_CHANGED；VOLUME_DELTA>=2 | MEANINGFUL_ESCALATION | 本小时新增+5.60pp账户变化，伴随价格回撤与放量；OI4h异常退潮不掩盖账户真实新变化。 |
| STRKUSDT | hourly_20261010_2100 | ANOMALY_SET_CHANGED；PRICE_SIGN_CHANGED | NEW_EXTREME_EVENT | 新增即时1h价格+4.89%及5m成交量异常，旧账户翻转不作为新事件。 |
| RLCUSDT | hourly_20261010_2100 | LS_global_DOMINANT_SIDE_CHANGED；LS_global_FLIP_METADATA_CHANGED | UNDETERMINED | 新翻转只单点，1.53pp附近账户边界波动不足以直接认定市场阶段改变；极端Funding此前已存在。 |
| JCTUSDT | hourly_20261010_2100 | LS_global.4h_DELTA>=5pp；ANOMALY_SET_CHANGED；PRICE_DELTA>=15 | NEW_EXTREME_EVENT | 新增即时1h-7.50%价格异常；滚动24h由22.88%回落至5.71%并非唯一依据。 |
| CAPUSDT | hourly_20261010_2100 | LS_global.4h_DELTA>=5pp；ANOMALY_SET_CHANGED | MEANINGFUL_ESCALATION | 1h量1.05→2.32倍、4h价格+9.07%，量价组合增强；账户4h变化率差含窗口移动。 |
| AIOTUSDT | hourly_20261010_2000 | ANOMALY_SET_CHANGED；OI1_DELTA>=10 | MARKET_REGIME_CHANGE | 与20:00比，OI1h16.49%→0.77%，但OI4h14.35%→19.69%；扩张速度改变，不能误称全部去杠杆。 |
| ARPAUSDT | hourly_20261010_2100 | ANOMALY_SET_CHANGED；OI_DELTA>=10 | MARKET_REGIME_CHANGE | OI4h46.72%→19.37%、1h5.11%→-0.01%，放量退潮，参与扩张明显降温。 |
| CELRUSDT | hourly_20261010_2100 | ANOMALY_SET_CHANGED | ROLLING_WINDOW_ONLY | 审计主导归因：旧翻转未变；仅滚动涨幅跨8%新增标签。快照价只+0.224%，基准价-0.995%，窗口基准移动影响更大；非断言价格完全没动。 |
| ARUSDT | hourly_20261010_2100 | PRICE_SIGN_CHANGED；OI_SIGN_CHANGED | MINOR_NUMERIC_DRIFT | 滚动价格和4h OI仅小幅零附近变号；旧Funding/翻转未变，缺乏新显著事件。 |
| HEIUSDT | hourly_20261010_2100 | OI_SIGN_CHANGED | MINOR_NUMERIC_DRIFT | 唯一更新条件是4h OI零附近符号变化，幅度约0.199pp；历史翻转未变。 |

| UPDATE主审计分类 | 数量 |
| --- | --- |
| NEW_EXTREME_EVENT | 2 |
| MEANINGFUL_ESCALATION | 3 |
| MARKET_REGIME_CHANGE | 4 |
| DIRECTIONAL_REVERSAL | 0 |
| EVENT_CONFIRMATION | 1 |
| ROLLING_WINDOW_ONLY | 1 |
| MINOR_NUMERIC_DRIFT | 2 |
| POSSIBLE_DUPLICATE | 0 |
| UNDETERMINED | 2 |

15条互斥主分类：10较明确研究增量、3低增量、2不确定。“MARKET_REGIME_CHANGE”包括参与扩张速度或账户分布改变，不是已验证价格趋势逆转。MAGIC事实研究价值HIGH和UPDATE新颖性UNDETERMINED可以同时成立。分类具有人工判断性，不是新生产阈值。

CELR：滚动24h7.2066%→8.5269%新增标签，快照价实际仅+0.2241%、滚动基准-0.9952%，旧04:00事件不变；窗口基准移动主导，不是断言市场价格完全没动。AR滚动涨幅-0.0976%→+0.3925%，快照价反而-0.0489%（基准-0.5368%）；不能说即时价格反转。OI4h-0.2598%→+0.5683%。HEI唯一UPDATE条件OI4h+0.06664576%→-0.13221197%，约0.1989pp漂移，旧事件不变。不能因这3条过敏否定其他重要OI/Funding/即时价格变化。

## 6. Notification Funnel

22:00：924→原生518→原始24+账户新增39=63深查→异常55全部Judge→35通过→35Analyst不可用→History重复4→31Outbox→31业务码0确认的物理消息。四个重复为ENS/MOVR/LA/PUMP，在去重前也完整做过Analyst；这是现有执行顺序，不是遗漏后续候选。

31=16 NEW_STORY+15 MATERIAL_UPDATE。无未评估、同Symbol本轮二次入队、同deliveryId/storyKey本轮重复。当前PENDING/SENDING/FAILED/UNKNOWN均0，31个part全部attempts=1；21:00 140个part也都1次，未见应用层重复投递。设备侧或供应商侧重复无法仅凭本地证明，NOT_RECOVERABLE_FROM_CURRENT_ARTIFACTS。

ERA、MAGIC、US、APR均完整Facts/Judge/Analyst尝试、Outbox和ack，实际发送前四，从2026-10-10 22:10:42开始；没有排在弱账户事件之后，但总量31仍带来大量打断。21:00情报35/物理140→22:00情报31/物理31，精简减少分片，没有增加资格。

## 7. Intelligence Value Review

按当时事实的幅度、时效、参与度与相对旧输出的信息量逐条人工判断，不猜项目名，不预设HIGH数量。HIGH9、MEDIUM9、LOW13；完整依据见 [BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_INTELLIGENCE_DETAILS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_INTELLIGENCE_DETAILS.md)。

HIGH：ERAUSDT、MAGICUSDT、USUSDT、APRUSDT、BATUSDT、STRKUSDT、JCTUSDT、CAPUSDT、AIOTUSDT。

MEDIUM：MINAUSDT、RLCUSDT、QNTUSDT、ARPAUSDT、SUPERUSDT、XMRUSDT、METUSDT、OPGUSDT、STABLEUSDT。

LOW：CELRUSDT、ARUSDT、ALGOUSDT、SEIUSDT、ZROUSDT、GRASSUSDT、HEIUSDT、KAITOUSDT、BABYUSDT、SPKUSDT、WLFIUSDT、MANAUSDT、SAHARAUSDT。

XMR旧跨界6.57pp和MET的OI24h-11.97%仍MEDIUM，说明旧事件不机械等于LOW。新SAHARA只有0.41pp、单点、量0.30倍而LOW，说明新事件不机械等于HIGH。MANA最新Funding正负翻转是16:00结算、最新0.0100%、相邻差0.0135pp，在22:00首次报道时已6小时且变化小。

离线模拟：9 HIGH独立通知+9 MEDIUM一份分组摘要+13 LOW本地保存，理论10个逻辑通知包，比31减少21（67.74%）。摘要真实物理分片UNKNOWN，MEDIUM完整原文合计9923字节，不能声称1800字节现有限制下一条足够。若全部31保留摘要追溯，也可9独立+1摘要入口但物理条数仍待设计。按本轮证据动态得出，不是每轮固定9或10条配额；全部HIGH仍应全发。未改变任何研究或推送。

## 8. Compact Renderer / Delivery Safety

[src/storage/delivery-queue.js:19](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/delivery-queue.js:19)只在新消息prepareDelivery渲染；已有part.content第54行直接发送。SENT/UNKNOWN不满足queueEligible，SENDING在 [src/storage/history.js:83](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js:83)恢复UNKNOWN。31/140分片均SENT且每part一次。Http成功状态返回业务body后，[src/clients/dingtalk.js:23](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/dingtalk.js:23)校验整数errcode及0，队列:55再检status/errcode；本批全部保存业务码0。

全部Facts、sources、输入及Analyst原始响应/错误、独立snapshot仍在。22:00 31条均含截止、RunId、研判不可用；相关Funding/翻转时刻保留。“已有翻转记录”和单点/未确认不会写旧事件刚发生；首次情报是首次输出，不保证新事件价值。21:00旧快照35条用NO_EDGE描述失败，是旧语义误导，不是VALID_NO_EDGE；本次没有替换或重发。

原Unicode逐字符UTF-8分片:14—17未变，本批全部payload<=1800，未发现字节截断/顺序错误。COMPACT_REPLAY保存21:00 WIF对照，现存四payload正文码点3842与此前记录一致。其他旧Outbox没有升级前逐字节快照，不能宣称全库前后字节证明；代码无重渲染旧队列路径且本批无多次尝试。

**语义展示缺口：** [src/intelligence/packet.js:29](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js:29)固定metricKeys+多空证据，未并入全部Judge.keyEvidenceIds。MAGIC -35.54%、MINA -9.80%、BAT -18.34%、JCT -10.23%的高点至快照drawdown均被Judge选为核心，但不在Packet/精简正文。仍在Facts/Judge及article模板，不是原始完整数据丢失；却是故事关键风险背景遗漏。历史article的Claim Guard通过不保证新正文覆盖Judge核心证据。先前“所有P0无损”的泛化结论应限定；字节无损不等于语义完整。

现有240/240 Mock报告 [COMPACT_TEST_RESULTS.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/COMPACT_TEST_RESULTS.txt)已读取，本次没有重跑；不能把Mock成功当真实模型合同验证通过。

## 9. Root Causes and Evidence

- MODEL_OUTPUT_ERROR / SCHEMA_CONTRACT_MISMATCH：95次数字文本、38次Schema、7次JSON导致70个组合全部FAILED；directional-analyst.js:7,32,54及两轮directional/calls。
- VALIDATOR_FALSE_REJECTION：否定边界句被关键词拒绝，显式52次尝试；directional-analyst.js:33—35、AR21:00第二次followUpChecks。与其他真实错误并存。
- MODEL_OUTPUT_ERROR / ERROR_OBSERVABILITY_GAP：27次Judge漏storyAngle，26次raw eligible=true；22另1次JSON失败；[src/content/schemas.js:5](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/content/schemas.js:5)、story-judge.js:10及calls原始响应。
- EVENT_FRESHNESS：24样本以内旧翻转持续异常，22输出中18条历史、12条纯翻转；long-short-facts.js:83、long-short-detector.js:9。
- MATERIAL_SENSITIVITY：零附近符号/标签变化、滚动窗口率差未拆端点；15 UPDATE中3低增量、2不确定；history.js:64,66,75及HEI/AR/CELR。
- PRESENTATION_EVIDENCE_GAP：固定名单遗漏4条Judge核心drawdown；packet.js:29及四条Facts/Judge/Outbox。
- ENGINEERING_COVERAGE_LIMIT：90秒账户预算结束，深查后仍33/35个未具备本轮账户研究；accounts-coverage、scanner.js:41,58。
- ERROR_OBSERVABILITY_GAP：HTTP详情未知、角色/Symbol无稳定callId，21异步SENT未同步result；deepseek.js:15、http.js:53、main.js:193、delivery-queue.js:76。

## 10. Minimal Fix Recommendations（仅建议，未实施）

### P0-1：Analyst合同、精确否定语义及错误反馈

问题：70/70失败，95份Schema合格均词法失败，显式否定52次误命中。根因是自由文本合同与模型实际习惯不兼容、粗码重试反复犯错。影响两轮全部方向与22:00全部31条方向展示。

最小改动位置：directional-analyst.js纯校验/受控文本渲染及repairErrors具体字段路径。给已验证horizon/现有ruleId安全表达路径，行情数字仍只能证据引用；精确识别否定子句，不全面取消禁词。预期合法输出可通过、非法推断仍拒绝，真实通过率须后续授权验证。

回归：现存140回复离线；正确否定、有效NO_EDGE、非法JSON/Schema/未来数据/混合窗口/未声明引用/数字/开平仓推断分别覆盖。潜在副作用：宽泛否定白名单掩盖同句后半的肯定推断；必须按子句限定，不关Guard。

### P0-2：Judge缺必需字段的有限修复及可观测性

问题：27次漏storyAngle导致合同拒绝，26份raw eligible=true，LUMIA/WIF22因此没有有效结果。根因是模型漏展示字段+强制合同+没有定向修复，非新闻阈值过高。

最小位置：story-judge.js Schema校验处具体AJV错误反馈和有限重试；评估INTELLIGENCE_FIRST是否必须storyAngle，但不能把未校验响应自动当合格。预期减少与事实价值无关的研究失败，保留完整审核。回归27漏字段、非法证据、低分、JSON错误、重试耗尽终态。副作用是运行时长变长，必须记录未完成而不减少其他候选或限制输出。

### P1-1：账户事件时效及低增量UPDATE

问题：18历史翻转输出、12纯翻转；10旧首报来自前轮合同失败；HEI/AR/CELR微更新。根因是持续翻转状态被当异常，首次输出不区分历史事件，符号/标签改变无幅度，窗口率差未拆新事实。

最小位置：保留全市场discover/Facts研究，以(Symbol,scope,from,to,跨界样本)事件ID记录首次观察/确认，在History与通知层区分新跨界、历史首报、确认、窗口漂移。预期不减少研究，仅减少稳定旧事件独立打断，重要同期异常仍升级。

回归本轮44翻转、50抖动/返回/持续、不同幅度、数据缺口、确认增长、旧事件遇PRICE_1H、零附近OI、Funding新极端结算与稳定极端、滚动窗口变化。副作用是过强时效规则漏独立账户信号；保留研究与明确升级规则，禁止机械删旧事件。

### P1-2：恢复Judge核心风险证据的可见覆盖

问题/证据：4条drawdown遗漏，MAGIC大涨百分比和大幅高点回撤共存的背景不完整。根因：Packet固定metricKeys。

最小位置：packet.js已验证Judge关键ID展示映射，Renderer显示重要回撤，不修改触发/评分。预期核心事实仍可见，长消息继续无损分片。回归四真实例子、未知ID、长风险及Judge核心事实覆盖。副作用是正文变长，不能为强行一条截掉风险。

### P2：高价值单独，普通摘要，低价值本地

本轮人工9 HIGH/9 MEDIUM/13 LOW，HIGH先发送但31打断仍多。最小位置通知优先序/呈现层，保留独立deliveryId、完整研究与持久化资格；根据新证据升级而非固定数量。预期约10逻辑包，摘要物理分片待评估。

回归全部HIGH全发送、摘要无丢失、重要UPDATE升级、重启/UNKNOWN/消息失败与多Symbol映射。潜在副作用：主观分级遗漏独立账户变化，必须保留本地全量与可追溯升级条件；不得因为方向失败丢新闻Facts，也不以Token节省或2/5/10硬限为目标。

### P3：补充失败与异步投递可观测性

问题：Mock240通过但真实70全部失败，粗码与未持久关联迫使数组恢复。最小位置：attempt/call日志加入角色、Symbol、稳定请求ID、failureStage、AJV路径、raw reference；响应逐次持久关联；报告区分运行结束与当前投递状态。预期不再混淆fallback/有效NO_EDGE/未返回/JSON/引用/语义。

回归请求失败、非法JSON、Schema、引用、语义、有效NO_EDGE、硬中断都有可恢复证据，用脱敏历史合同样本离线。副作用空间/隐私成本，必须脱敏不存Authorization、Webhook和密钥。

## 11. Unresolved Questions / Observability

| 需要观测的字段 | 实际字段/文件 | 局限 |
| --- | --- | --- |
| analystAttempted | result.directionalAnalyses、directional文件、attempts | 无原生逐Symbol布尔，本批可恢复 |
| analystCompleted | 文件status与attempts | 硬退出未落盘UNKNOWN |
| analystValidated | status=VALIDATED/FAILED、Packet.directional.status | fallback analysis.NO_EDGE非有效 |
| analystFailureStage | attempts.error/errors可推断 | 原生没有细化phase；Schema先return |
| analystFailureCode | attempts.errors、failureReason | 整体reason通用 |
| analystFailureDetails | attempts.raw、saved input、calls content | AJV详情需本次恢复，HTTP异常详情丢失 |
| rawResponseReference | calls完整响应和attempts.raw | 无稳定callId，本次序列完全匹配 |
| validatedDirection | status+analysis、Packet.analysis | 仅VALIDATED才有效，本批0 |
| fallbackReason | ANALYST_VALIDATION_OR_REQUEST_FAILED | fallbackAnalyst reason参数未使用，NO_EDGE不能解释阶段 |

HTTP底层尝试/重试、精确统计点间微观跨界时间、现存记录以前首次检测、供应商/设备外部重复、用户25+5文本与31实际消息逐一对应、升级前全库字节快照、逐Symbol原始触发/轮转归属，均NOT_RECOVERABLE_FROM_CURRENT_ARTIFACTS。

本批已有全部原始模型content，不使用“原始响应未保存”掩盖可恢复内容；但没有能证明完整原始偏多/偏空仅因误拒绝而损失的有效方向。语句级误拒绝和整体有效方向须严格区别。未来修复后的真实通过率、预测正确性未知，不提出未经验证数值。

没有独立21:00 RUN_TIMEOUT事件日志；精确900015ms和16个待发构成强证据推断，终态明确没有未评估研究。240通过只针对Mock。人工价值/UPDATE分类有判断性，不成为生产配置。


## 12. Final Verdict — Q1至Q12

1. Q1：22:00深查63，Judge55，Analyst35，生成31，确认31条物理消息；无未评估深查候选。
2. Q2：两轮Analyst各35全部FAILED；95/95 Schema合格文本词法数字失败，叠加Schema/引用/窗口/推断错误和合规否定误拒绝；模型确实有返回。
3. Q3：可恢复原始BULLISH/BEARISH，语句级误拒绝确认；没有证据证明完整原响应原本有效而仅被误拒绝，不猜最终方向。
4. Q4：22条翻转输出：本轮22:00新采样4、历史18（21:00的3、更早15）；全部深查44翻转同样只有4个22:00新跨界。
5. Q5：12条仅翻转、无其他检测异常；11条历史3—23h，10条跨界不足1pp。账户独立价值仍须保留，不能把XMR大幅变化也概括成噪声。
6. Q6：15 UPDATE，人工10较明确增量、1滚动主导+2微漂移、2不确定；无有效Analyst方向反转UPDATE。
7. Q7：旧翻转持续触发/合同失败延迟首报、Judge按状态给通过、History零附近符号与标签变化。精简物理140→31、情报35→31，未增加资格。
8. Q8：ERA/MAGIC/US/APR完整研究与输出，发送前四；均方向不可用。另LUMIA22被Judge漏storyAngle拒绝，是重要合同判断缺口。
9. Q9：已合格31条无队列截断、丢失、重复投递迹象；4个重复候选正确过滤；无未研究。9个Judge失败不是完成有效新闻判断；4条drawdown展示缺口不等于完整Facts丢失。
10. Q10：离线9独立+9摘要+13本地，理论10逻辑包；物理分片数UNKNOWN，未实施。
11. Q11：保留完整研究，以事件新鲜度/幅度/确认与具体新证据动态分级，稳定普通/低价值摘要或本地、重要升级；不用数量硬限或Token目标，不因方向失败丢Facts。
12. Q12：模型违约、否定误拒绝、缺storyAngle、旧事件候选、微漂移UPDATE、drawdown漏展示、已保存投递次数可确认；微观事件时刻、底层HTTP、全库格式升级前快照、未来修复后的方向质量仍未知。

最优先另立修复任务的三项：①Analyst受控合同与否定句误拒绝；②Judge必需字段有限修复与错误详情；③账户时效及低增量UPDATE语义。本次未实施任何修复。


## 附录及只读验证

[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYST_DETAILS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYST_DETAILS.md)：表A，126个候选终态，70个Analyst组合全部尝试。

[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_INTELLIGENCE_DETAILS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_INTELLIGENCE_DETAILS.md)：表B，31条全部情报、命中条件和逐条人工依据。

[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYSIS.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYSIS.json)：140次尝试验证、调用关联、Judge拒绝、44+44翻转全部历史及hash。

读取时刻2026-10-10T14:32:01.489Z；取样到结束30个源/配置hash和133个History/Outbox/Facts取样hash不变。source变化=[]，state变化=[]。本次只新建审计报告/附录，生产写0、外部API0、真实钉钉0、测试运行0，未改旧项目或AI Pro Cron。

