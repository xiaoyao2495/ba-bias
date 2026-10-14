# Facts 与 Knowledge 最小输入

本轮只读取代码、已保存包和已保存请求，不执行 buildFacts/verifiedFacts，不重新计算指标、不访问API。未来复用原验证逻辑，不另写计算引擎。

## 实际结构与可获得性

[src/market/facts-engine.js:95](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/facts-engine.js:95) buildFacts输出 BA_BIAS_FACTS_V1：runId、symbol、evaluationTime（times对象）、dataCutoff（ms）、identity、price、volume、openInterest、funding、longShortAccounts、longShort、evidence、warnings、dataCompleteness、sources。旧历史包可能没有longShort；实读 APR历史包即如此，不能把现代码新字段当成当时已保存字段。

每项evidence含 evidenceId、endpoint、params、raw、dataTimes、timestampMeaning、formula、result、phrase；账户序列还含scope/window/unit等。sources含 endpoint/params/raw/retrievedAt，可含error。包没有统一每Fact的availableAt、population、status或Source ID。

[src/analysis/market-bias-v2/input.js:7](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/input.js:7) registry投影为 originalId、category、scope、window、unit、denominator、value、dataTimes、sampleStart/sampleEnd、source、timestampMeaning、description、quality。部分标签由ID/公式推断，VERIFIED不是对全部推导标签语义的额外保证。

[audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/prepare.mjs:87](/Users/yaodebao/Desktop/git/ict03/ba-bias/audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/prepare.mjs:87) factView保存事实ID、分类、口径、窗口、单位、分母、值、时间、来源、公式、描述与质量。实读UNSENT_REQUESTS第一条：外层symbol/factsAsOf/factsAvailableAt/researchExecutedAt/facts；22项Facts；每项16个字段。这些保存的投影可作为兼容参考，不能整体宣称无语义风险。

| 语义维度 | 已存在字段/实现 | 可用性与限制 |
|---|---|---|
| 值与来源 | evidence.result、endpoint/params/raw；sources | 保留精度字符串、原始响应、来源参数，不把短文当原始证据 |
| 截止/采样 | dataCutoff/evaluationTime；dataTimes[].ms | 观察截止不等于请求结束。逐项采样保留，不统一改为研究时间 |
| availableAt | source.retrievedAt；buildInput参数factsAvailableAt | Fact包没有统一可用时刻；包完成上界由独立Run记录佐证，缺失返回未知，不用mtime假证因果资格 |
| 价格 | closedKlines/closedWindows；rolling24h；current | 闭合K线与ticker滚动窗独立；公式与原边界保留。ID解析window=null不代表没有时间语义 |
| OI | oiWindow（facts-engine:12–17） | 端点<=cutoff，严格精确h偏移，超1h过期，缺采样null。quantity乘数未验证，不写成实际币数；nominalValue不是数量增长 |
| 成交量 | relative（facts-engine:58–70） | 最近闭合1h/5m基础量除前24根均值；dataTimes含比较基准历史，不等于被解释的全部窗口。滚动24h成交额只有绝对量，不能推24h放量 |
| Funding | fundingRecords、settledLatest/sum24h/change/currentDisplay（19–22、77–86） | timestampMeaning和字段区分actual_settlement/display_snapshot_time；没有通用status。结算次数、真实interval配置保留；展示不冒充已支付或未来预测 |
| 账户/持仓 | parseLongShortSeries（long-short-facts:26–93） | scope独立；1h周期、采样相位、sum/ratio检查；严格精确1/4/24h样本，无插值；百分点不是涨跌百分比 |
| 质量与缺失 | warnings/dataCompleteness；longShort.*.quality/windows.reason | 顶部缺失可保留核心研究；关键缺失不伪装NO_EDGE。null/理由完整保留；不能把未取得当无异常 |
| 统计群体/分母 | scope、公式、来源与knowledge K1-06/07 | 顶部账户与持仓独立，全市场账户不代表资金，全OI双边量不能推单边；无实际群体资金规模 |

[src/clients/binance.js:6](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/binance.js:6) Binance.get保存retrievedAt；顶部接口要求已有marketDataKey（非交易权限）。本轮没有验证实际在线权限，历史缺失与源码接入均不证明今天接口可用。

## 时间安全

[src/analysis/market-bias-v2/input.js:21](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/input.js:21) buildInput检查factsAvailableAt>=dataCutoff、Fact采样不在未来、source检索时间不早于样本结束且不晚于可用上界；部分来源未知单独登记。[src/analysis/market-bias-v2/guard.js:85](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/guard.js:85) guardResearch另检查观察、可用、完成、验证顺序。这些不证明历史文件在原时刻已封存。

独立历史研究保留 originalEvaluationTime/dataCutoff、来源采样与真实researchExecutedAt；记录可用上界的证据与未知。未知采集可用性与确认含未来市场Fact分别处理：后者不能输入原观察时点研究。不得改evaluationTime制造资格。所有未来历史验证标记causalBacktestEligible=false，不计胜率、MFE/MAE或生产绩效。

## topGlobal.divergence：已确认输入展示缺陷

[src/market/long-short-facts.js:100](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/long-short-facts.js:100)真实值为同时间、同1h周期的顶部账户多方百分比减全市场账户多方百分比；result=gapPp，单位为**百分点**，两群体各自账户分母。不是顶部账户减顶部持仓，不是价格变化，不是全市场OI份额。

原evidence的phrase/formula/scope正确说明账户比较，但未显式定义unit。[src/analysis/market-bias-v2/input.js:15](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/input.js:15)默认unit=percent，16行无法识别复合scope而落入price observation definition；11行以组合endpoint匹配单来源失败，使retrievedAt=null，虽原e.sources包含两来源。这是展示/投影缺陷，不是此次确认计算数值错误。

影响：V2 currentFacts投影、实验factView、输出bindText渲染及引用此投影的证据页（[src/analysis/market-bias-v2/render.js:4](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/render.js:4)；[src/web/reader.js:62](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/web/reader.js:62)）。对原包中的gapPp和longShortText不能泛称都错；它们已有百分点描述。

未来单独批准最小语义Adapter：保留originalId/result/原包hash；依据已有scope/formula与两来源记录显式标注percentage_points、账户对账户及source列表，同时保留原标签与变换版本用于审计。补单位/分母/来源测试，不改算法/阈值、不篡改冻结输入。**缺陷未独立修复验收前，该复合Fact不进入新请求的可信Fact列表；以不可用原因保留在外围记录，独立global/topAccounts/positions事实继续保留。** 如任务需要此比较且无法可靠展示，应停止该案例准备，不用模型猜测。隔离不是永久删除研究信息。

## Knowledge复用

[src/analysis/market-bias-v2/knowledge.json:1](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/knowledge.json:1)版本MARKET_KNOWLEDGE_V2_20261012：启用K1-01…08（VERIFIED_MECHANISM）和K2-01…06（SUPPORTED_CONDITIONAL），K2-07/08停用UNVERIFIED，k3DecisionUse=false。

保留definition、applicationConditions、counterexamplesAndLimits、boundary、scope/sourceIds与登记版本。S01/S02/S04/S05/S07支持机制；S03传统参与背景不证明Crypto净资金流；S08只有出版摘要且不可外推Crypto预测；S06未取得公告正文、不可引用。登记checkedOn=2026-10-12，网页完整内容hash为空且已说明原因；本轮未联网复验，不把登记时间等同永久有效。

输入一次提供必要且不重复的K1/K2适用知识；以同一版本的确定性投影去掉停用条款和重复解释，不改知识内容。K3只保留“未证实情景不能决定Bias”的边界，不枚举全部故事。输入侧保存原register hash及实际Knowledge Context hash，不要求模型输出Knowledge ID全集。

## 未来最小输入Adapter

只负责读取通过已有验证的包/投影、保留缺失与时间、处理已审阅的语义标签、封存输入与hash。不重新计算、不自动选Bias。发送重要研究Facts与相关知识，不发送Selector分数、上轮答案、旧Guard规则、生产日志和后续收益。去重只去掉完全相同语义/窗口的展示副本，不能去掉真实竞争事实。

包bytes hash、投影canonical hash、知识register/实际context hash必须分别保存；不得将重建投影的hash冒充原文件hash。现有common.sha对对象用canonical、对bytes用原bytes，二者身份明确。新接口的可获得性成立，但topGlobal标签、历史时间封存、旧包缺longShort及因果资格仍需处理；本设计不宣布生产输入就绪。
