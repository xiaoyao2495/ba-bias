# BA_BIAS_ANALYST_V3_LIVE_PROBE_V1 — POST_COLLECTION_HISTORICAL_RESEARCH

## 1. Executive Summary

实际完成10个新历史时点、29次真实DeepSeek请求，API失败0；首次Schema10/10，首次完整0/10，恢复后2/10。两个有效结果都是BULLISH/4h/LOW，但各有未定义区间边界的质量疑点。固定V3合同能传输/解析并偶尔形成合格输出，**尚不能称为稳定可用**。严格因果实时预测仍未验证，不能进入完整Shadow Scan或生产。

## 2. Fixed V3 Contract Manifest

原冻结文件及模型配置逐请求前后核对；未改Prompt、Schema、Validator或温度/Token/模型。版本DIRECTIONAL_ANALYST_GENERATION_V3、输入展示V3、输出V2、Precision V1验证器；model=deepseek-flash，temperature=0，thinking=disabled，max_tokens=6000，json_object。Git不存在，commit=null。[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/manifest.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/manifest.json)记录内容及哈希；样本清单在首请求前冻结。生产最多2总调用保持不变；本隔离探针按显式授权最多3总请求。

## 3. Safety Isolation Verification

独立入口只读取历史Facts，调用生产V3生成器和正式guard，使用既有DeepSeek Client/Http代理/60秒超时；未实例化Binance、Scanner、Judge、History、Outbox、DingTalk或Scheduler。真实网络白名单仅POST https://api.deepseek.com/chat/completions，Http禁止redirect，retries=0且retry=false。每次发送前统一Budget计数并持久化，Ledger=Http metrics=29，内部重试0，每样本最多3。未保存Header/Key/完整env/代理凭据。

## 4. Historical Sample Selection

201个完整且未属于旧优化10样本/70历史时点的可用候选中，按原时点特征和文件排序选择10个新symbol+evaluationTime，无事后走势筛选。旧币种可以出现于不同新时间点；不是重复旧2100/2200研究。全部10场景标签有覆盖，不指定预期方向。[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/selected_samples.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/selected_samples.json)保存原Facts哈希、时间、来源、场景和选择原因。

## 5. True DeepSeek API Execution

29个实际请求和29个真实响应，全部原样持久化后解析/验证。10个完成首次模型响应，没有SKIPPED/API_ERROR。请求唯一ID及实际发出Ledger可审计，失败原文未删除；首次通过才停止，本轮首次均失败。所有结果/请求/响应显式probeMode=POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。

## 6. First-pass Validation Results

首次Schema通过10/10=100%；首次完整0/10=0%。完成首次响应分母10、实际尝试样本分母10，两种完整通过率一致；所有29响应均Schema合法，完整只2份。不是把29响应计为29个独立研究。

## 7. Controlled Recovery Results

MINA第二次通过、XPL第三次通过，第一恢复1/10、第二恢复1/10，最终2/10=20%；首次失败后的恢复成功率2/10=20%，最终失败8。第二恢复需第三请求，仅探针授权允许。若按生产原2总调用预算，这批原响应轨迹只能形成1/10；未因此改生产预算。

## 8. Direction Distribution

有效BULLISH=2、BEARISH=0、BULLISH_REVERSAL=0、BEARISH_REVERSAL=0、NO_EDGE=0。首次未经验证的原始分布BULLISH4/BEARISH4/NO_EDGE2；有效集偏多不等于强制偏多，未通过BEARISH和NO_EDGE不能展示为合格研究。

## 9. NO_EDGE Quality

BAT与XLM原始NO_EDGE有真实证据：长周期与短周期冲突、当前变化/参与量弱；不是仅因无ICT而机械NO_EDGE，均有后续核对条件。但两例没有完整通过，不能计为有效NO_EDGE。首次2/10不能单凭比例说模型过度保守。

## 10. Reversal Classification Review

没有真实输出选择REVERSAL。样本中多个等長价格窗口真实转向，但方向输出不强制使用反转标签；本轮未观察错误REVERSAL，也不能证明其真实识别能力。原自动化测试的双向合法/错误反转仍符合预期。

## 11. Evidence and Numeric Accuracy

UNKNOWN_EVIDENCE和Symbol mismatch为0；ID均来自实际Registry。数字/窗口绑定拒绝9响应/7样本：部分背景缺指标名、并列窗口解析、此前价格被绑定OI、负数表达及未提供的未来2倍量阈值。不能笼统称7样本虚构历史数字：有多个数字原值正确但绑定失败；没有发现虚构资金/强平金额。RAYSOL的drawdown快照末点与所选24h已收盘价相差9468ms，三次支持集合都未修精确对齐。

## 12. Market Mechanism Reasoning

因果guard拒绝23响应/8样本，含大量否定限制语句，例如“无法区分具体开平仓行为”“不指示单侧加仓”。这些原文不是确定性加仓断言，属于明显误拒疑点，正式仍INVALID，没有临时放宽。INJ跨周期机制与主周期绑定的约束亦影响恢复。模型可给可能机制，但当前自然语言合同/恢复对部分否定及跨周期解释不稳定。

## 13. Future Hypothesis Quality

两个合格marketThesis都明确“未来4h”，分别依据价格续涨/OI收缩及当前价格/OI扩张，承认反对证据并给竞争情景。它们是相对原观察截止时间的历史模拟假设，不是实际调用时刻开始的未来预测。独立质量评审保留Grounding/Actionability=UNCERTAIN，因为XPL主情景和MINA竞争情景仍指向未定义区间下沿；其余维度PASS是人工内容审查而非盈利或预测成绩。

## 14. Invalidation Quality

两个正式通过结果均引用已有同周期PRICE_OPPOSITE/OI_REVERSED，价格命题INVALIDATED、OI仅THESIS_WARNING，明确可观察，未构造数值入场/止损/目标价。正式条件合格不能证明所有情景结构描述安全；未定义区间下沿仍需质量复核。没有执行后续触发或HORIZON_EXPIRED评估。

## 15. Failure Root Causes

固定拒绝类别和响应/样本/首次/恢复/最终残留分别保存于 [validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/failure-categories.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/failure-categories.json)。重要区分：语义关键词被拒绝不等于模型确实声称已开平仓；numeric绑定失败不等于原值虚构。CAP Funding支付方向短语、KAIA/OGN/INJ/MAGIC否定解析、BAT“不设结构失效”、XLM此前price归属、RAY支持时间对齐在恢复中重复。恢复成功也有只换“跌破”词形仍保留结构语义的漏检。

## 16. Unpaired V2/V3 Comparison

UNPAIRED_DESCRIPTIVE_COMPARISON：V2历史首次2/10、最终5/10；V3本轮0/10、2/10，描述性数字较低，没有改善迹象可据此宣称。但样本、时间、历史研究模式/恢复范围不同，不能推导Prompt导致下降多少或预测能力更差；未额外发V2请求。

## 17. Total Requests, Tokens and Costs

实际29请求；prompt_tokens=564374（cache hit 56448 / miss 507926）、completion_tokens=20176、total_tokens=584550。按API usage累计，不猜额外调用。没有可核实单价/账单，estimatedCost=null；未访问任何价格或其他外部服务。

## 18. Regression Test Results

原525测试保持，新增10项历史时间语义、固定system、去重选样、物理总/单样本预算、完整guard拒绝、停止恢复、原响应传入恢复、三次失败不变NO_EDGE、API异常停止测试；合计535/535。静态61/61，保留原59并增加新脚本/测试。测试均Mock，无真实外部测试发送。

## 19. Production Data Integrity

真实请求前记录baseline，逐样本与每响应后检查；旧文件字节不变，生产2103文件无变化/新增，.env/History/Outbox/SENT/UNKNOWN/旧Facts/旧Analyst快照不变。旧阻断报告和原模型响应保留；本报告使用新后缀，不覆盖旧记录。没有Binance、钉钉、交易、发帖、Scanner或常驻进程。

## 20. Production Readiness Verdict

CONTRACT_RELIABILITY=NOT_READY（首次0/10、最终2/10）；FACTUAL_SAFETY=现有guard保持且严格拦截，但存在否定误拒/结构措辞漏检；DIRECTIONAL_USEFULNESS=PARTIAL/QUALIFIED（2个有期限假设，结构部分不确定）；PRODUCTION_INTEGRATION=NOT_TESTED。不具备直接进入完整Shadow Scan的可靠性依据，更不能宣布生产稳定。

## 21. Recommended Next Minimal Action

最小后续范围：先用这29份原文离线审查否定语义误拒、背景/此前数字绑定、Funding支付短语规则、drawdown支持对齐，以及区间下沿换词仍通过的语义漏检；严格区分真实错误、误拒、漏检后，另行授权有边界修复，不整体重构。本轮不修改合同、不追加请求、不启动Shadow。严格因果实时能力仍需真实采集availableAt、当时冻结输入及实际研究时刻，在未来Shadow中证明无延迟/补齐泄漏，再单独评价事后结果；本历史模式绝不计入胜率、MFE/MAE或生产绩效。

## 时间语义与合同兼容结论

原evaluationTime未变、source数据截止未变；collectionCompletedAt是原source.retrievedAt最大值，researchExecutedAt是本次每请求时间，两者均单列。正式input schema已有开放contentContract元数据容许probeContext，未增加顶层字段或改变输出语义。原始未来/未收盘raw记录由现有Facts引擎过滤，不进入Analyst evidence；所有实际输入dataTimes≤原截止时间。采集可见性不确定与市场事件晚于原时间分别记录，未用采集后时刻假装原时点可知。原正式guard照常运行，不要求原dataTimes等于实际研究执行时刻。

结果证据：[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/summary.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/summary.json)，逐样本原文：[BA_BIAS_ANALYST_V3_LIVE_PROBE_V1_RESULTS_POST_COLLECTION.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1_RESULTS_POST_COLLECTION.md)。

## Q1–Q20

| 问题 | 答复 |
|---|---|
| Q1 | 10个新时间点，未重复旧10/70优化时点。 |
| Q2 | 29真实请求，API失败0；内部重试0。 |
| Q3 | 首次10/10，全部29/29 Schema合法。 |
| Q4 | 首次0/10=0%。 |
| Q5 | 最终2/10=20%；恢复1和恢复2各1个。 |
| Q6 | BULLISH2，其余四类0。 |
| Q7 | 未知ID/Symbol错误0；存在支持对齐和引用/绑定的系统性合同问题。 |
| Q8 | 9响应有numeric/window绑定拒绝；不能全部称虚构数值。未见单侧仓位/资金金额被确认为事实。 |
| Q9 | 没有REVERSAL输出，未发现错误反转，真实能力覆盖不足。 |
| Q10 | 2份有效结果均提出相对原观察时间未来4h假设。 |
| Q11 | 原始2例有真实冲突，但均未完整通过；有效NO_EDGE=0。 |
| Q12 | 已选程序条件可观察且价格/OI角色分离；两份通过结果仍有未定义区间边界质量疑点。 |
| Q13 | 修复数字引用和结构触发词；否定语义、Funding短语、窗口绑定及对齐反复失败。 |
| Q14 | V3数字较低；明确UNPAIRED_DESCRIPTIVE_COMPARISON，不作因果归因。 |
| Q15 | 是，XPL/MINA保留未定义区间下沿，Grounding与Actionability=UNCERTAIN。 |
| Q16 | 535/535、61/61。 |
| Q17 | 均未修改/新增，旧记录与.env完整。 |
| Q18 | 未访问或启动；仅DeepSeek外部请求。 |
| Q19 | 不建议完整Shadow Scan，PRODUCTION_INTEGRATION=NOT_TESTED。 |
| Q20 | 最小阻断为固定自然语言合同的否定/绑定/结构语义可靠性；另行离线审查后再授权修复。 |

## 补充授权要求的两项回答

**V3真实模型合同是否可用：** 技术调用、JSON/Schema可用，严格全合同尚不稳定，不能作为可稳定产出研究的就绪系统。

**为何仍需严格因果Shadow：** 本轮在采集完成后执行，无法证明原观察时间输入已可得；且假设期限锚定历史evaluationTime。只有未来实际采集/冻结/调用时间均有证据，且后续结果单独记录，才能验证实时因果链、集成和预测表现。本轮causalBacktestEligible=false。
