# BA_BIAS_ANALYST_GENERATION_QUALITY_V1

## 1. Executive Summary

实际接入 `DIRECTIONAL_ANALYST_GENERATION_V3`：重组未来输入展示、明确字段职责/方向/机制/失效规则，并提供逐诊断受控恢复。没有修改Schema、任何Validator或市场研究/通知链路。原464项全部保留，新增54项，总计518/518通过；JS静态57/57通过。

新真实首次通过率：**UNKNOWN — NOT_TESTED_LIVE**。新方向分布、NO_EDGE变化、预测优势及真实恢复质量均NOT_TESTED_LIVE。10份真实Facts的生产入口Mock通过是合同传输与验证测试，不是模型生成成功率。

## 2. 当前真实生成失败基线

原V2真实30响应在当前正式验证器下11通过；10独立研究首次2通过、最早第二次2通过、最早第三次1通过，总5通过。MAGIC、AIOT首次通过；US、AGT第二次通过；NIGHT第三次通过。ERA、APR、BAT、WIF、WLFI全部失败。原联调允许3总调用；生产保持2总调用，不能将5/10直接当作生产当前预算的恢复率。历史70研究/140响应仍26研究、32响应通过。18冻结保留例仍符合预期。

证据：[validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/diagnostics.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/diagnostics.json)、[validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/holdout-results.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/holdout-results.json)。30及140份完整guard对象与精度任务冻结结果逐一deepEqual，不重新解释旧响应。历史结果不是V3生成结果。

## 3. 首次输出失败分类

以下按响应计，可重叠，不能相加为事件数。首次8/10失败，9/10 Schema合法。

| 当前正式错误 | 首次响应数 |
|---|---:|
| UNVERIFIED_PARTICIPANT_STATE | 2 |
| UNSUPPORTED_CAUSE_OR_ORDER | 5 |
| UNAVAILABLE_INDICATOR_OR_STRUCTURE | 3 |
| REVERSAL_DIRECTION_NOT_SUPPORTED | 2 |
| INVALIDATION_RULE_DIRECTION_CONFLICT | 2 |
| UNTRUSTED_NUMBER_OR_PROBABILITY | 3 |
| DIRECTIONAL_SCHEMA_INVALID | 1 |

没有UNKNOWN_EVIDENCE错误；不能声称10样本主要问题是伪造ID。未知ID仍由未修改的guard及新增入口反例拦截。数值错误包含把快照价当未来价格与复杂表达边界，并非都属于伪造历史数字。

## 4. Prompt问题与修复依据

已读取指定7份报告/Schema、10份Facts、30份真实请求/响应/验证及恢复记录。逐案例全文与来源见 [BA_BIAS_ANALYST_GENERATION_QUALITY_V1_CASES.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_ANALYST_GENERATION_QUALITY_V1_CASES.md)。

对12个归因问题的结论：

1. 旧system含Schema共3599字符；首次input约14k字符、恢复约33k–41k字符。没有可证实的硬合同矛盾或长度致失败的因果证据；新展示增加输入体积，也不声称压缩Token。复写事实和恢复指令泛化是可观察风险。
2. 16个必填字段职责部分重叠，thesis混入机制、未来情景复写基线、跟踪项承诺识别具体交易行为。V3逐字段标明职责，并从实际Schema列出必填/长度/数组上限；不删必填字段。
3. 实际30份未出现UNKNOWN_EVIDENCE。ID选择仍需完整索引、论据/背景分工，不能据此假称旧ID问题普遍。
4. 多字段重复抄数真实存在，首次各样本有2–8类百分比token重复；成功样本也重复，重复本身不是失败充分原因。V3用已有ID或占位符，下游原Renderer展示精确数值。
5. 跨周期复杂列表增加绑定难度；首次3份有numeric错误，其中未来精确价位和表达歧义。显式比较不同窗口合法，不能为简化而丢弃背景。
6. ERA“不跌破近期已收盘结构”依赖未接入结构；WIF/WLFI快照价被用作未来精确情景。结构/参考价/预测目标明确分开。
7. APR和AGT首次文本为1h向上转向，却选BEARISH_REVERSAL，两份同时失效规则方向冲突。V3明确同长度负→正/正→负与双端ID；极端指标不构成转向。
8. ERA“追多拥挤”、BAT“抛压已现”，APR正OI却推断回补构成，US杠杆叙述、NIGHT在thesis确认减仓，均是实际文本缺陷或超出当前合同可验证范围。V3将有证据的可能机制放入机制字段，不能只加末尾免责声明。
9. 大多数模型会选真实程序rule，失效条件并非全面失败；APR/AGT的方向与规则不相容，定性复核与机械失效必须分开。OI只能warning，未来精确阈值只能引用已有rule。
10. 首次NO_EDGE只有WIF/WLFI 2/10，其余明确方向；历史26通过中22为NO_EDGE只是通过集分布，不证明模型被Prompt强迫NO_EDGE。V3无配额/比例/强制方向。
11. US删杠杆叙述、AGT更改周期/方向/规则、NIGHT先修长度再修相容表达是有效恢复轨迹。MAGIC/AIOT新guard下首次已合法，其旧恢复并非创造新合格案例；不能把全部改善归因恢复Prompt。
12. APR恢复181→397字仍保留错误机制；WLFI222→485字产生新Schema错误；ERA/BAT持续缺陷。旧恢复mustFix仅通用英文一句，诊断虽完整但未提供定向字段解释；部分新识别错误不在旧诊断中，不能声称模型忽视已明确提示。

没有对照的新真实模型调用，Prompt组织问题与模型遵循失败之间的因果贡献无法量化；明确违规文本属于生成行为，V3是针对这些风险的可泛化干预。

## 5. 输入Evidence组织改进

仅新增已有开放 `contentContract` / `evidenceGuide` 元数据，原输入容器V1、合同V2及canonical evidence保持一致。研究对象/时间/周期/异常证据先呈现，然后价格、OI数量、Funding、成交量、全市场账户、顶部账户、顶部持仓、顶部与全市场账户背离、其他证据分类索引；最后保留原窗口、当前参考价、能力、rules、缺失原因。

每个展示记录含完整ID、值、原phrase语义、单位、统计窗口、采样周期、全部dataTimes和端点；原evidence仍完整保留formula/params/scope。5m量只是背景，未增加预测周期。单位%/百分点/倍数/USDT/翻转状态分开。未知指标以原phrase为权威，不猜单位。历史等长价格仍由旧context计算；没有新增指标、重算价格/OI/Funding或改变异常阈值。

## 6. OBSERVATION/MECHANISM/FORECAST分层

OBSERVATION引用Registry；MECHANISM只在marketMechanism解释同期价格/OI的可能组合；FORECAST由marketThesis、主/竞争情景承担。证据验证过去输入，不能证明未来必然结果。每字段建议160字符、正式1..400字符不变，不要求模型填满长度。支持/冲突数组承担论据选择，背景可引用真实ID但不混同主周期。

## 7. 五类方向生成规则

BULLISH/BEARISH为有依据的延续假设；BULLISH_REVERSAL/BEARISH_REVERSAL要求真实转向；NO_EDGE说明真实冲突/不足。没有固定方向分布、每轮/每日输出配额，也未强迫NO_EDGE或明确方向。方向与tradeOpportunity独立，当前没有可靠结构，LONG_SETUP/SHORT_SETUP仍被guard拒绝。

## 8. REVERSAL误用预防

选择horizon后，核对该周期previousPriceId/currentPriceId实际符号，前负今正支持上转、前正今负支持下转，两端均必须引用。不需ICT，不可称结构反转已确认；Funding/账户翻转/巨大涨跌不能单独推出反转。原guard字节不变，入口正反转Mock与错误反转两次拒绝测试通过。

## 9. 失效条件生成策略

优先已验证结构，但当前capabilities.priceStructure=false，不能编结构失效。选择现有同周期rules：价格INVALIDATED、OI THESIS_WARNING，与预测方向必须相容。无适用机械规则可METRIC_BASED_REASSESSMENT且ruleIds=[]；不足则INSUFFICIENT_STRUCTURE_DATA且[]。不把定性描述自动失效，不新增Schema类型；到期仍由既有程序处理。两条空rule路径入口Mock均通过。

## 10. 受控恢复Prompt改进

恢复system追加明确指令；保留repairErrors完整代码、contractRepair原始input/response、完整preciseErrors和allowedEvidenceIds。开放metadata增加逐诊断guidance、原field/path/schemaErrors、字段职责、真实rules。按Schema、ID/对象、数值/窗口、反转/方向、机制/口径和失效条件针对性说明。原响应不是事实，允许重新研究方向，不程序改写答案或抹掉字段。

恢复后调用原完整guard，数值错误、未知ID、确定因果、假结构及错误反转均可继续拒绝。保持最多2总调用及maxTokens6000；JSON错误允许一次恢复，网络错误不无尽重试，Abort仍传播。保留所有错误会增加恢复输入体积，不能声称DeepSeek实际恢复已改善。

## 11. 生成V3版本定义

生成版本`DIRECTIONAL_ANALYST_GENERATION_V3`；输入展示`DIRECTIONAL_INPUT_PRESENTATION_V3`（容器仍V1）；输出`DIRECTIONAL_ANALYST_V2`；验证器标识`DIRECTIONAL_ANALYST_V2_PRECISION_V1`且逐文件SHA-256可追溯。新入口返回generationVersion，input metadata亦记录。旧V1/V2数据不改写，默认旧directionalInput不变。

冻结文件：[validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/frozen-contract.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/frozen-contract.json)，包含初次/恢复Prompt、源码/Schema/验证器/Client/config哈希、模型参数记录、预算。现有历史联调参数deepseek-flash、temperature0、thinking disabled、json_object、6000；实际后续运行须在调用前核对运行时模型配置，禁止中途改Prompt。此任务未授权真实联调。

## 12. 修改文件列表

- 修改 [src/analysis/directional-analyst.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js)：新生成输入/Prompt/恢复接入与版本追踪，guard路由/预算不变。
- 新增 [src/analysis/directional-generation.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-generation.js)：展示、Prompt、字段合同、恢复指引。
- 新增 [test/analyst-generation.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-generation.test.js)：54项专项测试，含真实入口Mock、严格拒绝与历史原文回归。
- 新增 [scripts/analyst-generation-offline.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-generation-offline.js)：只读实际历史回放/18保留例/10入口Mock/静态/合同冻结/完整性核查。
- 新增本报告、案例报告与独立validation目录；根目录初稿快照保留，最终证据以verified为准，均非新模型响应。

## 13. 原有合同与验证器不变证明

基线2352旧文件，唯一改变的既有文件是directional-analyst.js；其他2351文件字节一致。输入/输出导出Schema、directional-schema.js、旧context、V1/V2 guard、numeric/semantic evidence helper、Claim Guard全部原字节不变。没有最小合同修正。静态/Hash/旧30+140对象相等及18保留集共同证明未扩大Validator兼容范围；不据此证明预测优势。

## 14. 新增测试与全部测试

新增54，原464保留，总518/518；static57/57覆盖src/scripts/test。入口覆盖首次通过/失败恢复/精确Schema诊断/全错误携带/两次失败仍拒绝/JSON与网络预算/Abort/正确双向反转/NO_EDGE/定性复核与结构不足；验证器反例与完整Facts覆盖、符号、时间、单位、历史全部保持。10实际Facts另用明确MOCK经过生产analyzeDirectional传输并通过合同；不当作DeepSeek答案。

日志：[validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/test-output.txt)、[validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/static-checks.json)。

## 15. 生产数据完整性检查

2103生产文件未变，新增生产数据0；.env、旧Facts/Analyst原文、History/Outbox/投递状态、旧验证目录和原测试字节未变。Scanner/Universe/Detector/阈值/Judge/History/MATERIAL_UPDATE/Outbox/DingTalk/Scheduler/Clients/config/package均不变；未修改旧项目或Cron。全程真实Binance/DeepSeek/DingTalk调用0，发送0，未扫描、未后台进程、未下单或发帖。npm run scan仍 `node src/scan-daemon.js` 前台常驻，本次未启动。

证据：[validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/integrity.json) 和 [validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/before-hashes.json)。哈希未输出任何密钥内容。

## 16. 未解决问题

真实首次通过率、恢复质量、方向分布、减少NO_EDGE、预测优势均NOT_TESTED_LIVE。输入索引和完整恢复信息增加体积，实际模型注意力/延迟未测试；原验证器对复杂自然语言仍保守。18保留例有限且曾有历史审计曝光，不是独立未来预测集。仍无可靠结构或主动流，不能提供可执行入场价。Prompt可以预防风险，无法离线保证模型遵循。

## 17. 下一轮真实联调建议

本次完成后停止。后续须另有用户授权，先核对冻结Prompt/Schema/Validator/input版本及运行时模型参数，再在固定合同下记录首次与一次恢复分别统计，并保留全部失败原文。不在联调中临时改Prompt或根据币种调规则；合同符合率与方向事后预测评价分开，不据合同比例宣传优势。

## 最终Q1–Q15

| 问题 | 答复 |
|---|---|
| Q1 首次失败主因 | 未证实机制/参与者状态、错误反转及规则方向、未来精确价位、文本超长；分类详见第3、4节。 |
| Q2 Prompt/输入还是模型 | 字段职责和展示/恢复引导可优化；符号错标、造结构、超长是实际生成违规；无对照，因果贡献未知。 |
| Q3 ID错误 | 完整合法集合、分类语义索引、逐字段论据职责，不拼接ID；旧30没有UNKNOWN_EVIDENCE，未夸大此问题。 |
| Q4 数值/窗口 | ID/占位符优先，程序渲染；单位、原值、采样时间和窗口显式保留，区分过去观察与未来情景。 |
| Q5 REVERSAL | 同周期此前/当前真实反向符号、双端ID、方向一致；极端指标不独立支持。 |
| Q6 明确方向 | 允许有依据倾向，不强迫NO_EDGE或方向分布。 |
| Q7 失效结构 | 仅已有真实rules或空ID定性复核/结构不足，不编价。 |
| Q8 恢复 | 全诊断、原文、原input、合法ID/rules、逐字段指引，全对象再生成并完整guard。 |
| Q9 限制保留 | 是，全部事实验证限制原字节保留。 |
| Q10 Schema/Validator | 都未修改，无合同放宽。 |
| Q11 测试 | 新增54，518/518通过，static57/57。 |
| Q12 生产历史/Outbox/.env | 均未修改，2103生产文件相同。 |
| Q13 外部API | 本轮0真实外部API调用，0钉钉发送，未启动扫描。 |
| Q14 下一轮条件 | 固定版本/哈希/参数合同已具备；需另获真实联调授权并核对运行时模型。 |
| Q15 V3真实首次成功率 | **UNKNOWN — NOT_TESTED_LIVE**。 |
