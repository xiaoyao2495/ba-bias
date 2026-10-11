# BA_BIAS_STRUCTURED_ANALYST_V4_SPIKE

ROUTE_B_SELECTED。独立最小原型，禁止生产迁移。无真实LLM客户端，也不新增Prompt调优或第二LLM裁判。

## 合同及真实入口

buildStructuredInput(originalFacts) → guardStructuredAnalysis(output,input) → renderStructuredAnalysis(output,input)。正式verifiedFacts重新通过现有Facts Engine/Detector算术验证，接现有directionalInput算术。程序不会替模型生成方向；guard只验证模型提供的枚举、支持/冲突及一致性。离线脚本采用旧保存方向转成SYNTHETIC_OR_CONVERTED接口样例，不能当作真实V4生成。

输出保留五方向、三个周期、三置信度、支持/冲突ID、机制类型、未来假设与竞争情景、独立交易机会、结构引用及重新评估条件。directionalRationale采用未来假设枚举+Evidence关系：延续、转向、逆当前走势竞争、无清晰优势。最小实验刻意没有自由事实文本、概率、目标价或模型自填阈值；未知属性直接Schema拒绝，不扫描中文/英文句子。这验证接口安全，并不证明有限枚举已充分表达实际研究质量。

机制枚举为CO_MOVEMENT_ONLY、CONTRACT_EXPANSION_COMPATIBLE、CONTRACT_CONTRACTION_COMPATIBLE、UNDETERMINED。非UNKNOWN机制必须引用同周期、已对齐的主价格与OI ID，并满足实际OI符号。只描述相容关系，不确认杠杆、资金流向或某类参与者开平仓。PARTICIPANT_BEHAVIOR_UNCONFIRMED与CONDITIONAL_NOT_CONFIRMED是受约束语义，不允许模型把否定与主力注入的肯定句混合塞入说明。

Evidence保留evidenceId/symbol/metricType/value/unit/window/scope/observedAt/dataTimes/source/semanticDescription；数据来源端点、参数、公式可追溯。账户比例%与变化pp、顶部账户与顶部持仓份额分别命名；OI仅数量变化%，资金费率为已结算%及变动pp。无法可靠取得首次可用时间统一availableAt=UNKNOWN，不以observedAt或采集完成时间伪装首次可用。原evaluationTime不变，因果资格false。

registry是正式Facts重建后冻结的输入，WeakMap保存输入能力，模型不能自行携带伪造Registry/单位/窗口/时间/数值。反序列化的实验快照必须从原Facts重建才能再验证；程序不可将保存JSON直接当作可信Registry。离线样例wx不可覆盖保存，仅写独立validation目录。

## 条件与结构

PROGRAM_RULE仅选已有本周期ruleId，阈值、operator、baseline、warning/invalidation与说明由程序取得；不改变原阈值。ABSTRACT_REASSESSMENT只监控指定真实指标，REASSESS_ONLY，不能变成机械失效。INSUFFICIENT_STRUCTURE_DATA明确没有机械结构失效。结构条件只有提供真实结构ID才允许，不能把区间幅度百分比当价格边界。

默认真实Facts输入structures=[]，不新增生产结构指标。本实验的结构正例只允许调用方显式引用原已收盘单根K线的LOW/HIGH与openTime，程序在同symbol的正式验证小时源行中核对，值由程序取得，不允许传入自定价格。其类型是EXPLICIT_CLOSED_BAR_BOUNDARY_NOT_SUPPORT_RESISTANCE，不冒充区间下沿、支撑或阻力。来源行不存在、未来未收盘、错误类型、重复引用都不能成立；现有正式系统仍没有可靠区间/支撑对象。此选项仅供隔离结构引用实验，没有接生产。

有依据的结构条件也不是交易设置，LONG_SETUP/SHORT_SETUP继续拒绝：单根K线边界不足以证明可执行交易机会。WAIT_FOR_CONFIRMATION、WAIT_FOR_PULLBACK与NO_ACTIONABLE_SETUP与方向独立。REVERSAL必须同时引用此前等长价格窗口与近期价格，符号真实转向且方向相符；Funding极值不能单独产生反转。

## 事实渲染及隔离

程序按Evidence ID渲染精确值、指标、单位、窗口、时间、来源和原Facts语义；机制和未来段来自受约束类型标签。输出失败保持FAILED且text=null，不替换NO_EDGE。不写History/Outbox/通知/生产快照，不启动Scanner，不访问外部API。实验标记不可隐藏。

## 验收与局限

新增46项真实入口测试，原535项保留，581/581通过；67/67静态检查。10份真实Facts转为实验输入，10份明确转换/合成输出通过接口约束；199份旧响应重放零结果变化，18冻结例全部符合预期。真实首次通过率、真实方向分布、预测准确率、生产稳定性均UNKNOWN。没有调用真实V4模型，因此没有V4真实成功率可报告。

最小Spike完成后停止。下次需先独立审阅模型侧生成约束及新合同/研究枚举的表达能力；若授权小规模V4真实联调，也仅限隔离非因果合同测试。正式因果Shadow还需真实采集/首次可用时间和当时不可变快照，不能从本轮历史转换样例推导预测绩效。

## 新增代码文件

- [src/analysis/experimental/structured-v4-schema.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-schema.js:1)：独立严格输出Schema
- [src/analysis/experimental/structured-v4-input.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-input.js:1)：正式Facts重建、typed Registry、源行边界证明
- [src/analysis/experimental/structured-v4-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-guard.js:1)：ID/时间/机制/方向/条件验证
- [src/analysis/experimental/structured-v4-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-renderer.js:1)：确定性实验渲染器
- [scripts/analyst-semantic-grounding-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-semantic-grounding-replay.js:1)：离线199响应重放及10转换样例
- [test/structured-v4.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4.test.js:1)：46项实际入口测试

最终无副作用证据：[final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/final-integrity.json)。当前实验合同只接受SYNTHETIC_OR_CONVERTED来源，未提供真实模型入口。未来若授权真实V4联调，须先明确定义真实模型来源与生成协议，不能让真实响应冒充本轮合成来源。
