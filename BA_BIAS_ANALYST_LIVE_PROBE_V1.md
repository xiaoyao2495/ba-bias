# BA_BIAS_ANALYST_LIVE_PROBE_V1

## 1. Executive Summary

真实DeepSeek联调已完成，10计划样本/10实际提交/10首次响应，30个实际POST请求及30份模型响应，API失败0、HTTP自动重试0。首次Schema通过9/10（90%），首次完整通过0/10（0%）；恢复1成功0、恢复2成功0，最终完整通过0/10（0%），最终失败10。全部达3次上限后停止，无额外调用。不能宣布V2生产合同已稳定或恢复小时扫描。

本次发现真实模型错误与验证器误拦截同时存在；没有临时调整Prompt、Schema、Validator或阈值追求成功率。有效五类方向全部0。原始首次方向为BULLISH2、BEARISH4、BEARISH_REVERSAL2、BULLISH_REVERSAL0、NO_EDGE2，不能把这些未通过结果算成有效方向。

新增22项隔离脚本测试，原361项保留，383/383通过。

## 2. Probe Environment

运行时间北京时间2026-10-11 01:02:02.667 +08:00至2026-10-11 01:04:02.113 +08:00。Node.js v23.11.0；DeepSeek Key存在但未打印或保存。请求模型deepseek-flash；返回模型名deepseek-flash。沿用现有配置，DeepSeek代理启用=false、通用代理配置存在=true，实际DeepSeek直连。只允许POST https://api.deepseek.com/chat/completions；重定向禁用。

生成参数temperature=0、thinking.type=disabled、max_tokens=6000、response_format=json_object，每请求timeout=60000ms；串行执行。总API提供输入token=359312、输出token=29421，详见每响应usage，未推算费用。

## 3. Safety and Isolation

独立入口[scripts/analyst-live-probe.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-live-probe.js)只读原历史Facts，重建正式V2 Input并调用DeepSeek Client，完全不调用main/scan/once/Story Judge。复用现有Http和DeepSeek类，在隔离入口配置retries=0并request(retry:false)，避免隐藏重试突破30次预算。正式生产重试配置不变。恢复采用生产相同repairErrors/contractRepair语义；生产Analyst本身最多2次尝试，本次脚本按任务预算允许额外第2次恢复，总最多3次，不改生产配置。

所有新数据位于[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/manifest.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/manifest.json)所在独立validation目录，未写data/。请求、响应与validation以UUID唯一ID、wx独占写入；首次原raw先落盘再解析，不被恢复覆盖。请求保存模型payload/Prompt但不保存Authorization或环境变量。API失败只保存脱敏错误code/httpStatus并停止后续样本；本轮未发生。

## 4. Selected Real Facts Samples

读取两个指定小时的126份Facts，其中111份质量/异常合格，15份不合格原因保存selected_samples.json。6个优先Symbol全部存在并采用21时视角；另4个按当时4h价格/OI组合及平静1h排序选择，不读后续价格、快照到期结果或旧方向作为答案。不预设方向。

| Symbol | RunId | 4h价格% | 4h OI数量% | Evidence | 选择理由 | Facts |
|---|---|---|---|---|---|---|
| ERAUSDT | hourly_20261010_2100 | 3.17658829 | 11.4880653 | 27 | 任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向 | [data/runs/hourly_20261010_2100/facts/ERAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ERAUSDT.json) |
| MAGICUSDT | hourly_20261010_2100 | 1.32325142 | -4.62538359 | 28 | 任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向 | [data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json) |
| APRUSDT | hourly_20261010_2100 | -17.1368861 | 53.38728908 | 27 | 任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向 | [data/runs/hourly_20261010_2100/facts/APRUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/APRUSDT.json) |
| USUSDT | hourly_20261010_2100 | -6.03027546 | -3.60960785 | 27 | 任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向 | [data/runs/hourly_20261010_2100/facts/USUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/USUSDT.json) |
| BATUSDT | hourly_20261010_2100 | -0.95567154 | 13.49855314 | 27 | 任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向 | [data/runs/hourly_20261010_2100/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/BATUSDT.json) |
| WIFUSDT | hourly_20261010_2100 | -0.64102564 | -0.51629891 | 28 | 任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向 | [data/runs/hourly_20261010_2100/facts/WIFUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/WIFUSDT.json) |
| AIOTUSDT | hourly_20261010_2200 | 11.53184165 | 19.69227927 | 27 | 补充4h价格上涨/OI扩张：按已保存4h涨幅排序 | [data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json) |
| AGTUSDT | hourly_20261010_2100 | -21.6918304 | 7.49701641 | 27 | 补充4h价格下跌/OI扩张：按已保存4h跌幅排序 | [data/runs/hourly_20261010_2100/facts/AGTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/AGTUSDT.json) |
| NIGHTUSDT | hourly_20261010_2100 | -2.75415148 | -2.07765359 | 28 | 补充4h价格下跌/OI收缩：按已保存4h跌幅排序 | [data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json) |
| WLFIUSDT | hourly_20261010_2200 | -0.26242127 | -0.0786477 | 28 | 补充相对平静：仅按当时1h价格/OI绝对变化之和最小排序 | [data/runs/hourly_20261010_2200/facts/WLFIUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/WLFIUSDT.json) |


原始evaluationTime：21时样本2026-10-10T13:00:15.062Z，22时样本2026-10-10T14:00:12.629Z。全部可引用Evidence时间≤该样本evaluationTime。样本覆盖价格/OI同向与背离、ERA负Funding约-1%、MAGIC明显回撤、WIF/WLFI账户翻转/多周期冲突、APR等真实价格转向、WLFI平静走势。selection只决定场景，不能决定未来正确方向。

## 5. Model and V2 Contract Version

Prompt/Schema/Validator在10样本全过程冻结，manifest保存Prompt SHA=dadd3048cf55d22d5db6a956a9995b3b73d8f6406212cd48c452b804ab671939、Schema SHA=7590bc172f0d61a05ec49051afde1d11e615a967fdff05d9363c8f07910f75eb、Validator SHA=ddca8343e980d52b4263251c28d5ac83d0cb38decaefb283baf7dab42b52d502及所有analysis文件hash。DIRECTIONAL_INPUT_V1传输容器明确contractVersion=DIRECTIONAL_ANALYST_V2，输出严格V2。未修改任何生产源文件。每请求完整SYSTEM/输入/生成参数见requests，每次responseText/raw及token/时间见responses，完整Schema/正式guard诊断见validation。

## 6. First-pass Results

分母为10个实际完成首次模型响应样本，API失败单独0。JSON解析10/10，Schema9/10，完整验证0/10。NIGHT首次marketThesis>400字符，其他9个结构合格但事实/引用/语义合同失败。不是只有JSON/Schema成功就认为方向可用。

| Symbol | 首次Schema | 首次原始方向 | 首次完整状态 | 错误 |
|---|---|---|---|---|
| ERAUSDT | true | BULLISH | INVALID | UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| MAGICUSDT | true | BEARISH | INVALID | UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY |
| APRUSDT | true | BEARISH_REVERSAL | INVALID | REVERSAL_DIRECTION_NOT_SUPPORTED,INVALIDATION_RULE_DIRECTION_CONFLICT,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| USUSDT | true | BEARISH | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER,WRONG_ACCOUNT_OR_OI_SCOPE |
| BATUSDT | true | BEARISH | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| WIFUSDT | true | NO_EDGE | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER |
| AIOTUSDT | true | BULLISH | INVALID | UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED |
| AGTUSDT | true | BEARISH_REVERSAL | INVALID | REVERSAL_DIRECTION_NOT_SUPPORTED,INVALIDATION_RULE_DIRECTION_CONFLICT,UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| NIGHTUSDT | false | BEARISH | INVALID | DIRECTIONAL_SCHEMA_INVALID |
| WLFIUSDT | true | NO_EDGE | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY |

## 7. Controlled Recovery Results

20次恢复请求，0次完整恢复成功。每次沿用原固定SYSTEM、原Input、上一原response、精确错误/字段和允许IDs，正式guard重新验证。APR将错误BEARISH_REVERSAL改为有真实1h向上转向的BULLISH_REVERSAL，AGT后续改为4h BEARISH，NIGHT修复文本长度；这些是部分修复，不计完整成功。WLFI恢复反而连续超过400字符。许多恢复仍重复裸ID和数字表达；不自动清洗输出、不更换验证器、不降级为有效NO_EDGE。

## 8. Evidence and Numeric Accuracy

所有30响应支持/冲突及{{}}实际引用中，未知Evidence出现0次；Registry及模型evaluationTime未发现未来数据注入，Input未来Evidence=0。这只证明ID存在，不证明每个ID支持论点。正文大量采用裸Symbol:metric而非{{}}，当前文本规则将合法本Symbol/裸ID视为未知大写指标，Funding仅裸引用又未入支持/冲突列表时不进入验证器的used集合。ID集合稳定性较好，正文引用合同仍不稳定。

必须区分真实数值错误与UNVERIFIED_NUMERIC_FACT。人工核对例如ERA4h3.18%/11.49%、MAGIC1h-5.49%/-0.97%、APR1h+2.06%/+1.34%都与原Facts舍入相符；不能将全部27响应的数字拒绝解释为27份捏造事实。当前Big.js比较不接受前导+，指标别名“相对量”、此前窗口/回撤词法、5m数值、同句多指标、中文“以上”及未来情景中重述历史基线均存在解析/合同覆盖缺口。规则阈值多数实际存在，但脱离支持的比较表达仍拒绝。

[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/read-only-regressions.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/read-only-regressions.json)用真实ERA Input与明确标注的Mock诊断响应通过正式guard证明：去掉+事实能通过，加+同数值拒绝；合法本Symbol文本拒绝；“无法确认强平”通过而“无法据此确认强平”拒绝；“不保证未来方向”被判确定性/因果越界。辅助诊断不计入任何实时成功率，不改变原模型结果。

## 9. Direction Distribution and Forward Usefulness

有效方向五类均0。首次原始方向2偏多、4偏空、2向下反转、2NO_EDGE；末次原始分布{"BULLISH":2,"BEARISH":5,"BULLISH_REVERSAL":1,"BEARISH_REVERSAL":0,"NO_EDGE":2}。8条首次非NO_EDGE输出都在preferredScenario提供horizon与未来走强/走弱倾向，确有UNVALIDATED_FORWARD_HYPOTHESIS，不只是历史行情复述；但缺少完整合格结果，不能归类有效FORWARD_DIRECTIONAL_HYPOTHESIS，也未评估预测统计优势。两条原始NO_EDGE有竞争事实，但非VALID_NO_EDGE。

## 10. NO_EDGE Quality Assessment

WIF：24h价涨/OI降、1h/4h价弱与低相对量，确有周期冲突；WLFI：短线价格/OI近零及低量、4h偏弱与24h上行竞争，确有平静/参与不足理由。未观察到单纯因缺ICT或难造失效条件而统一NO_EDGE。原始2/10占20%，没有“模型一律不敢预测”的迹象；小样本及0有效NO_EDGE使总体是否过度使用仍UNKNOWN。未调整Prompt降低该比例。

## 11. Reversal Assessment

首次APR和AGT均选择1h BEARISH_REVERSAL，而该周期此前负、当前正，确定存在反转方向标签错误，正式guard拒绝；原价格转向真实，但应向上，不能把长期下行背景混作1h向下反转。APR恢复改BULLISH_REVERSAL后仍有数字/机制失败，没有有效反转。BAT也有真实1h向下转向，但模型选择普通BEARISH，未强迫使用REVERSAL。

## 12. Invalidation Quality

首次10响应均OBSERVABLE_CONDITION，多数实际选当前horizon PRICE_OPPOSITE/OI_REVERSED规则；没有要求模型生成MSS/FVG或具体结构支撑阻力。ERA及MAGIC价格阈值自动INVALIDATED、OI阈值THESIS_WARNING区分清晰；APR/AGT首次反向预测的规则会在错误方向失效，拒绝。WLFI把“价格或OI”描述为“失效或需复核”，没有明确分别映射，质量不足；WIF正文提OI规则却未选ruleIds，仅作文字参考不会机械触发。

很多可核对阈值在followUpChecks中文表达仍不符合解析合同；缺少结构不代表可以说已有“近期已收盘结构”。本轮没有完整通过的失效对象，不能宣布其端到端可靠；旧机器规则/生命周期模块未运行或修改。

## 13. Previous Historical Comparison

仅7个同Symbol/Run/evaluationTime有原历史Analyst响应，3个无保存响应，标NOT_AVAILABLE而非失败或猜造。对齐样本统计{"matchedSamples":7,"notAvailable":3,"oldFirstSchema":5,"oldFirstCompleteValid":1,"oldEventuallyValid":1,"v2OfflineEventuallyValid":3,"newFirstSchema":7,"newFirstCompleteValid":0,"newEventuallyValid":0}。

| Symbol | 旧首次Schema | 旧首次完整 | V2离线最终 | V2新首次Schema | 新首次完整 | 新最终 |
|---|---|---|---|---|---|---|
| ERAUSDT | false | false | ANALYST_UNAVAILABLE | true | INVALID | FINAL_INVALID |
| MAGICUSDT | true | true | VALIDATED/NO_EDGE | true | INVALID | FINAL_INVALID |
| APRUSDT | NOT_AVAILABLE | NOT_AVAILABLE | NOT_AVAILABLE | true | INVALID | FINAL_INVALID |
| USUSDT | true | false | ANALYST_UNAVAILABLE | true | INVALID | FINAL_INVALID |
| BATUSDT | true | false | ANALYST_UNAVAILABLE | true | INVALID | FINAL_INVALID |
| WIFUSDT | true | false | VALIDATED/NO_EDGE | true | INVALID | FINAL_INVALID |
| AIOTUSDT | true | false | VALIDATED/BULLISH | true | INVALID | FINAL_INVALID |
| AGTUSDT | NOT_AVAILABLE | NOT_AVAILABLE | NOT_AVAILABLE | true | INVALID | FINAL_INVALID |
| NIGHTUSDT | NOT_AVAILABLE | NOT_AVAILABLE | NOT_AVAILABLE | false | INVALID | FINAL_INVALID |
| WLFIUSDT | — | — | ANALYST_UNAVAILABLE | true | INVALID | FINAL_INVALID |


同7个样本新首次Schema7/7，旧首次Schema5/7，有结构合格率改善迹象；但新首次完整0/7、最终0/7，而旧响应新合同离线可恢复3/7，没有端到端改善证据。不能把历史25/70恢复率当新V2成功率，也不能将10样本0%直接推断全市场长期失败率。

## 14. Failure Root Causes

下表按30响应及10唯一研究分别计数，可重叠。

| 错误 | 响应数 | 独立样本数 |
|---|---|---|
| UNTRUSTED_SYMBOL_OR_METRIC | 23 | 8 |
| UNTRUSTED_NUMBER_OR_PROBABILITY | 27 | 10 |
| UNSUPPORTED_CAUSE_OR_ORDER | 15 | 7 |
| UNAVAILABLE_INDICATOR_OR_STRUCTURE | 5 | 3 |
| REVERSAL_DIRECTION_NOT_SUPPORTED | 2 | 2 |
| INVALIDATION_RULE_DIRECTION_CONFLICT | 2 | 2 |
| WRONG_ACCOUNT_OR_OI_SCOPE | 3 | 1 |
| FUNDING_DIRECTION_MUST_USE_EVIDENCE | 3 | 1 |
| FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED | 3 | 1 |
| DIRECTIONAL_SCHEMA_INVALID | 3 | 2 |


模型真实问题：APR/AGT反转方向错、ERA引用不存在可靠结构、一些拥挤/抛压或单侧敞口解释超过账户/OI统计依据、NIGHT/WLFI长度失控、未来观察随意添加相对量1倍阈值及失效/复核混用。

验证器/合同问题：真实本Symbol与裸Registry ID误标未知指标；正号舍入、部分当前/先前/复合数字无法绑定；合理否定“无法据此确认”“不保证”误当肯定；事实基线出现在未来情景时过度统一拒绝。两类问题必须分开修复，不能全放行或把全部失败归罪模型。

## 15. Test Results

原361项保留，新增22项，npm test 383/383通过、0失败/0跳过。新测试覆盖历史读取/未来保护/无事后选样/固定V2完整Registry、无Binance/DingTalk/Judge/Scheduler入口、无Outbox/History写入、首次/恢复分离保存、10/3/30预算、完整guard、失败不变有效NO_EDGE、API错误停止、JSON原文恢复及成功后不额外调用。原Claim Guard/Evidence测试继续通过。原始输出[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/tests.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/tests.txt)；JavaScript静态检查[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/static-checks.json)。Mock辅助诊断不伪装实时成功。

## 16. Production Safety Verification

请求前快照[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/before-hashes.json)；请求后[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/safety.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/diagnostics/safety.json)显示2157个受保护文件零变更、2103个生产data文件零变更、零新增data文件、HTTP requests30/retries0。生产src、原test、.env、Facts、LLM原response、快照、History、Outbox、SENT/UNKNOWN、旧报告均未修改；测试后的复核再次确认。未调用Binance、钉钉、Story Judge或完整扫描，没有常驻/后台进程、交易、发帖、AI Pro Cron及旧项目修改。新文件仅两个scripts、一个test、隔离validation内容及两个本次报告。

## 17. Production Readiness Verdict

CONTRACT_READINESS=FAIL：0/10完整首次及最终合格，恢复无完整成功。FACTUAL_SAFETY=PARTIAL_GUARD_ACTIVE_WITH_FALSE_REJECTIONS：真正越界仍拒绝，但误拦截明显，不能宣称已全面验证安全。DIRECTIONAL_USEFULNESS=NOT_ESTABLISHED_NO_VALID_LIVE_OUTPUT：原文有有意义未来假设，尚无有效结果。PRODUCTION_INTEGRATION=NOT_TESTED：未运行真实扫描、History/Outbox/钉钉链路。结论不适合恢复完整小时扫描，未自动恢复。

## 18. Recommended Minimal Next Actions

下一任务先用本次保存的30原始响应做只读逐断言归因，并增加缺陷回归，再最小修复已验证误拦截：前导+安全数值比较、本Symbol/稳定Registry文本引用、局部否定、future字段中的明确历史基线/规则引用。保留数字单位/时间/口径/未知ID边界及18类反例，绝不因0%而全放行。Prompt仅必要澄清{{}}引用与长度、反转horizon方向、THESIS_WARNING/INVALIDATED对应；生产规则不针对Symbol。

本次不实施这些生产修复，不消耗额外DeepSeek请求。修复并离线重新验收后再另轮冻结合同小样本联调；完整生产投递联调需独立验证，不能由本次替代。

## Q1–Q14

Q1：首次0/10。Q2：恢复后0/10。Q3：五类有效方向全部0，原始未合格方向另计。Q4：Schema总体27/30通过，3失败均marketThesis>400字符、涉及NIGHT/WLFI，仍有可重复长度失败但非普遍字段结构失败。Q5：真实引用ID存在稳定（未知0），正文引用格式仍不稳定。Q6：存在数字/口径/语法错误与误拦截；未见未来时间泄漏，不能将所有numeric error视为真实数值错误。Q7：原文能提出未来倾向，尚无完整合格方向预测。Q8：未见一律NO_EDGE，原始2/10有冲突/平静依据，总体过度使用UNKNOWN。Q9：多数用真实规则，但恢复/复核映射及解析不足，无完整合格失效对象。Q10：匹配7样本Schema5/7→7/7，但完整结果未改善。Q11：真实请求30，API失败0。Q12：没有Binance/钉钉/生产状态变更。Q13：新增22，总383通过。Q14：不适合恢复完整小时扫描，PRODUCTION_INTEGRATION NOT_TESTED。
