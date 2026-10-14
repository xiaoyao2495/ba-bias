# 验证方案、停止规则及本轮离线核对

本文件不授权模型请求、样本准备、Holdout或Shadow。以下是一套待独立评审的有限方案；本轮没有执行。

## 已有原文作为五维质量标尺

只评 Facts忠实性、金融解释合理性、证据取舍、Bias可辩护性、不确定性，不求和、不计算预测准确率、不用方向标签当答案。以下是读取保存全文后对**研究回答**的定性评审，不是对该币唯一正确Bias的宣判。小范围引用用于说明标准，全部既有开发样本禁止作为新独立证据。

原文位置：旧O=[audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/RAW_RESPONSES.jsonl](/Users/yaodebao/Desktop/git/ict03/ba-bias/audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/RAW_RESPONSES.jsonl)；新R=[audit/BA_BIAS_V2_FINANCIAL_SEMANTIC_DISCIPLINE_RESUME_V1/RAW_RESPONSES.jsonl](/Users/yaodebao/Desktop/git/ict03/ba-bias/audit/BA_BIAS_V2_FINANCIAL_SEMANTIC_DISCIPLINE_RESUME_V1/RAW_RESPONSES.jsonl)。行号是JSONL物理行，全文在Provider message.content。Fact路径/hash、响应ID和精确命题位置由 [audit/BA_BIAS_V2_SEMANTIC_DISCIPLINE_FAILURE_FORENSICS_V1/PAIR_EVIDENCE.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/audit/BA_BIAS_V2_SEMANTIC_DISCIPLINE_FAILURE_FORENSICS_V1/PAIR_EVIDENCE.json)、EVENT_EVIDENCE.json保留。

| 回答/类别 | 原文与实际事实 | 五维审阅 | 裁决 |
|---|---|---|---|
| CHIP R行10：合理口径及竞争权衡 | “顶部持仓份额4小时反而多方 -1.59 个百分点”；原topAccounts.long.change4h=+7.42pp、topPositions.long.change4h=-1.59pp。同时权衡24h价+18.67%/OI+43.53%与4h价-10.85%/OI-8.83% | 事实/口径可靠；同窗关系合理；真实长短窗竞争；NO_EDGE可辩护；未确认行为保留。末段未来观察不是确定反转规律 | ACCEPTABLE，作为此轮基本标准参照，非生产批准 |
| US R行11：可审查取舍与未知 | “但这是未经证实的情景，不能作为事实”；24h价+67.45%/OI+24.58%，4h价-16.22%/OI-9.81%，1h价+6.17%/OI-3.55% | 事实较忠实；双边OI解释合理；长短窗竞争具体；NO_EDGE不是只有未知主动方；回补情景带明确保留但仍有措辞风险 | ACCEPTABLE，不把未证实回补当事实 |
| APR R行1：主研究可用但局部过强 | “说明多头持续付费”；实际仅最新结算+0.017339%、24h六次合计+0.042339%，不能证明每次正值。核心为多窗跌价与同窗1h量23.99x/OI+24.67% | 局部事实解释过强；主要参与背景和账户竞争仍可审查；BEARISH不据此必错；未知表达充分 | NEEDS_REVIEW，局部问题不触发新Prompt迭代 |
| RONIN O行16：虚假竞争/NO_EDGE依据 | “最新价回撤 18.08% 与展示 Funding 转负是重要竞争事实”；display=-0.021828%，settled=+0.004331%，状态/时间不同，无法证明转负 | 事实数值真实但关系错误；Funding知识误用；伪造重要竞争；NO_EDGE依据受损但不能证明改正后必需BULLISH；免责声明不救错误 | UNACCEPTABLE |
| ENS R行2：重要K2支持失真 | 原文“价格与 OI 同向扩张”；4h价-2.413%/OI+6.966%，24h价-3.197%/OI+2.185%，另用仅1h量5.53x支撑24h/4h同窗关系 | 数值真实但关系与量窗不忠实；K2条件误用；支持权重失真；BEARISH可另有依据却不能靠这一链；未知表达无法抵消 | UNACCEPTABLE |
| ERA R行3：总量推具体买盘 | “说明短窗口买盘活跃度下降”；只有5m总成交相对量0.6326x，无主动买量；长窗成交确认也不足 | 行为推断越界；K1-02违反；价格/OI同窗真实支持仍在；BULLISH并非被证明错误；部分未知与正文不一致 | UNACCEPTABLE（需事实/金融复核，不自动改Bias） |
| JCT R行4：残留跨窗错误 | “反弹发生在成交量显著低于近期均值的背景下”；4h价+7.58%，仅1h量0.25x/5m0.24x，1h价-0.35%，没有完整4h量基准；还推断账户翻转在大跌之后 | Facts组合不可靠；K2时间误读；真实跨窗冲突存在但量能竞争失真；NO_EDGE可能合理；未知没有指出这一缺口 | UNACCEPTABLE |

没有证据给某一独立答案判定唯一正确Bias；过度NO_EDGE只在虚假竞争或机械弃权可证时定位。完全缺少原文/Facts或关键身份时NOT_ASSESSABLE，不凑类型案例。

读过的历史依据：原实验REPORT、FULL_FACTS/PRICE_ONLY非价格价值报告及原始完整回答；错误归因ERROR_EVENTS的7条命题；纪律候选Prompt/协议；恢复REPORT与原响应；最新失败REPORT/METHOD_DECISION/CASE_BY_CASE_QUALITY_COMPARISON及事件索引。原报告正面评价不覆盖随后发现的语义错。7旧错4修正、3残留，ENS/ERA等新解释错仍存在，保持SEMANTIC_DISCIPLINE_MIXED_RESULTS。旧9、新6个NO_EDGE不是改善率；3改善、2混合、1退化、5不变也不是胜率。两轮非同期、底层权重版本未知、11例暴露，不能据此宣称Prompt因果效果。

## 一次冻结后的独立验证建议

1. 先独立批准本设计及topGlobal语义输入处理，不执行现在这5文档以外代码。准备独立历史Facts库存只读清单，审阅哈希/来源/时间；不访问外部行情选样。
2. 排除APR、ENS、ERA、JCT、FOLKS、MINA、ARPA、RONIN、CFX、CHIP、US的11个已暴露案例及重叠状态；LUMIA/PIXEL已调试案例、MAGIC及其他任务保留样本也排除。核对所有既有台账和reserved manifest；未看到请求不等于证明从未暴露。相同币重叠24h窗口不能假定独立，跨币同市场时段相关性仍需披露。
3. 按事先固定的可用时间/数据质量和状态分层选取最多8个新历史状态，目标至少6个非重叠可追溯状态；这是待评审的有限建议，不能为凑数降低标准。达不到独立性/可用性则报告不足并停止，不生成病例答案。分层可涵盖不同窗口关系、敞口扩张/收缩、Funding状态与账户缺失，不以未来收益或期待Bias选样。
4. 预冻结唯一候选代码块、Knowledge Context、事实投影、输出接口、model ID/参数、文件hash、案例列表顺序、五维审阅规则、费用/时间/输出预算及物理次数。模型参数尚未重新核实，不能宣称现支持规格或真实成本；未来授权时按已核实Provider约束定预算，不在本轮联网。
5. 为检验相对简单基线的实际优势，使用已归档原六段RESEARCH_PROMPT.md作为固定对照，绝不再设计第二个候选。同一新Facts和知识上下文，每状态候选一次、旧基线一次，最多2n<=16次真实生成；全部在未来授权预算中明示。两臂输出格式不同，人工按五维盲化比较，不按JSON加分。若未来仅授权n次单臂请求，则如实不能证明相对基线优势，不偷偷增加对照调用。
6. 单案/臂一次、自动重试0。先记录STARTED，封存请求、原文和COMPLETED；超时、网络、截断、无效JSON记技术失败，保留原文并停止后续请求待审，不补写或重试到成功。不要独立ping模型消耗隐含调用预算。费用达到冻结上限、文件hash改变、身份错配、未来Fact或生产隔离失败立即停止。
7. 历史研究保留事实截止/可用/实际执行时间，causalBacktestEligible=false，不读取后来行情。模型不得看到既有Case答案、人工裁决或前次Bias。结果只封存在EXPERIMENTAL_MARKET_RESEARCHER隔离路径。
8. 对完整响应先技术核对，再逐句事实与金融审阅。揭盲前完成候选/基线的五维意见及具体命题证据，难判断就NEEDS_REVIEW/NOT_ASSESSABLE，不硬造正确标签。研究价值需说明非价格事实实际改变了参与/风险/取舍信息，不能仅看提到指标多、方向多或文字短。

## 预先停止规则

基本标准：可评估样本的核心事实、K1/K2适用和决定性取舍无未解决的重要错误；每份分析有具体依据与重要未知，整体不成为免责声明；相关非价格信息具有实际而非装饰性贡献。相对固定简单基线有明确逐例质性增益且无同等级关键退化，才建议EXPERIMENTAL_SHADOW_REVIEW；小样本优势仍是有限证据，不是统计证明。

少量不影响核心依据的措辞问题可以NEEDS_REVIEW，记录即可，不为了完美追加Prompt。单例重大问题须先人工确认，未解决不能推荐Shadow；同类核心账户/Funding/虚假竞争/K2窗口错误在两个独立案例反复发生，停止生产迁移研究，不堆叠规则。若只输出保守限制、无有价值解释，或缺乏优于简单基线的证据，则停止路线、保留现系统。样本不足/技术失败/审阅争议使结论不足，报告不足后停止，不自动启动第二轮。

本轮只有一次最小设计，未来只有一次冻结独立验证；不通过或不确定均不自动调参重跑，不以增加Guard/LLM Judge修饰失败。实验通过只可建议独立授权Shadow；生产合同兼容、实时可用性、持续研究变化、部署及投递仍需另行审阅授权。

## 本轮静态可行性与反复杂化核对

- 输入：读取实际Facts代码和APR原包、冻结UNSENT_REQUESTS，存在值/源/采样/观察时间；统一Fact availableAt与population/status不存在，未发明。复合divergence标签不可靠，设计阻止未解释输入，独立修复待授权。
- 知识：读完整registry，8项K1+6项K2启用、2项K2停用，K3不能决定方向；不假设全部来源正文已取得。
- 输出：7个浅层字段覆盖六职责，示意JSON可解析。自由文本追溯需要人工，现生产Renderer/Schema不能直接使用，已列最小Adapter。
- 身份：既有调用原文/台账可保存必要元数据；ModelId不等于权重版本，原文件bytes与投影hash不同，均明确。
- 反复杂化12项：没有创建实现模块、复制Facts/Knowledge、金融规则引擎、大量强制引用、固定指标篇幅、未知自动NO_EDGE、竞争/限制混淆、字符串金融Judge、模型自证过程、第二LLM或无限优化。仅5文档；实现数量0。
- 文档间统一：六职责、三Bias、1Prompt、独立实验、历史非因果、零生产写入一致。Frozen Spec §7字段责任差异显式登记，未宣布生产替换兼容。
- 本轮不运行自动化市场/模型实验，也不将之前测试数字当本轮测试。仅做本地文档/JSON/文件哈希/Git差异静态检查；没有新增源码，因此未运行整套生产回归或改旧哈希断言。

## Git及完整性证据

HEAD=52e7f19f55d3da4dcb55a39b3b6d47bf128ebdcd，main；起始tracked diff：44 files changed, 410 insertions(+), 471 deletions(-)，cached diff为空。起始status见RESEARCHER_CONTRACT，全部保留原样。

起始SHA256覆盖**9814个既有文件**（包括生产数据、env、全部已有audit/design/implementation；排除.git和node_modules，仅本轮新目录不在既有集合）。按起始relative-path→bytes SHA256逐文件末尾复核；敏感配置只核对摘要，不打印值。以下关键类目before hash，after以SAME表示逐项相同；完整集合对比结果在末尾。

| 原文件/类目 | Before SHA256 | After |
|---|---|---|
| BA_BIAS_MARKET_BIAS_SPEC_V1.md | `4d7a41c7f6a709264b6507d743f1194649cd4c510d341c7e7ee7ea174bde4616` | SAME |
| src/market/facts-engine.js | `7d3cb1c1a7aff77cbef6165a923c9caddd60f35d03a2f18f92e04282ae60a5cc` | SAME |
| src/market/long-short-facts.js | `56ae70378bc08efd7a335d9fd624ac3f9d2e1ac40b0dc06037154a8b152f49ff` | SAME |
| src/intelligence/packet.js | `4be46f99c5cd22d332d41abfbd878cd1fac61c42d14e842c7dd2fa72f6597ae0` | SAME |
| src/analysis/market-bias-v2/knowledge.json | `4bbc53541b41ac1081810772337ea350c26b44416787e6d8a35cbac151148ce2` | SAME |
| src/analysis/market-bias-v2/input.js | `e0ee6ac1033764c601f7a7d3e963aa1da5a53dd0f69c5b51dab70402190a88c6` | SAME |
| src/analysis/market-bias-v2/prompt.json | `6ddc6eb8e7994386e54e7750a4a2fb21b4d617b9f82c9c96ce89a463fcf0c08d` | SAME |
| src/analysis/market-bias-v2/schema.json | `39582a9e9732657979fdae04758e3c2f1aae507c72d22f11be292b71dbc9ee76` | SAME |
| src/analysis/market-bias-v2/parser.js | `f5855dbf759316030d3b4c824210f60cb14ab9a514cebe4741f5a9541c97b2f4` | SAME |
| src/analysis/market-bias-v2/guard.js | `13b42687ece6533a0dc3033be5b40885a8f818416a26959e9b6c054ff6163b8f` | SAME |
| src/analysis/market-bias-v2/executor.js | `2dc17224f28485c70edeecd3df10b7ea117f46aaae0b052de168f6ac97793f69` | SAME |
| src/clients/deepseek.js | `1cb36a44426e97d1a4b93f27b5fd217525420b63fd05d5e78b623ba45071f73d` | SAME |
| src/market/opportunity-selector.js | `0d96f55cafba6c73df6fa1603cd5937b2ae15ee6e03f1cbfee79a256668d8c26` | SAME |
| src/main.js | `6f33e77a47c6e359877adccbd41b54d838ce6bfab969c3ad2195b0fa65564387` | SAME |
| src/scan-daemon.js | `139889c1ab0d86a9d2db7dc5465cefd660b5880a314633da92770fe23bf2734f` | SAME |
| src/storage/history.js | `22a16fec688f310a10ef831f5153dfe0d92226e7b063246bb06502767f203c21` | SAME |
| src/storage/market-bias-v2-state.js | `3bb60c8dd0b989efc82be423047dc976d665f225c29c264ff5f140ed3145bcac` | SAME |
| src/storage/delivery-queue.js | `546f88df8e0eaa564f6cc89dc1f1abd660acae4140b0677cd87d0fd28adf9b71` | SAME |
| audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/RESEARCH_PROMPT.md | `e8b895c71469b44c16242210f9bfe0c22755bea1d6442a4c2e4c4a6c71c35a51` | SAME |
| audit/BA_BIAS_V2_FINANCIAL_REASONING_EXPERIMENT_V1/RAW_RESPONSES.jsonl | `5fa375aaf95c3b91ba0fb5cb82cc5b211f51d4c4c8e129cba95316fc45da8404` | SAME |
| audit/BA_BIAS_V2_FINANCIAL_SEMANTIC_DISCIPLINE_V1/RESEARCH_PROMPT_V1.md | `76f82e3d7f975a628688c73de4babf5bf1fbe0fb93eb76a2a82ec3e3b3db0f29` | SAME |
| audit/BA_BIAS_V2_FINANCIAL_SEMANTIC_DISCIPLINE_RESUME_V1/RAW_RESPONSES.jsonl | `2b696357058cac0155e361f8887e79b652bec7da54d7fa92b698a81c95760fc6` | SAME |

环境文件若存在纳入全量集合，本轮不公开其内容或摘要以免产生不必要传播。KnowledgeRegister与实际上下文hash分开；上表原文件bytes hash不替代canonical知识对象hash。

本轮最终验收结果将在下方记录。没有Git commit/push、外部模型/API、扫描、钉钉、部署或PM2操作。设计完成后停止。

## 实际验收结果

- 五份文档：5/5；新增文件仅此5份，新增实现框架0。
- 唯一Prompt代码块：1；输出示意JSON可解析、7字段与六职责映射通过。
- 本地源码/证据链接存在性：通过；新文档无行末空白；敏感配置实际值未出现在新文档。
- 9814个起始既有文件：SHA256变化0、缺失0。完整起始路径/hash映射摘要：`b312afa363db2a656c7405e1e90bf1bb5b83c56359fa493cb724db15c65c6388`；末尾同集合摘要相同。逐文件核对，不以Git ignore代替数据检查。
- Git HEAD、tracked diff/stat、cached diff和原status均与起始相同；本设计所在design/原已untracked，Git目录级status不显示其新增5文件，实际文件集合已另行核对。
- ProductionFilesChanged=0；ExternalModelCalls=0；外部API/Scanner/DingTalk/交易/部署/Git提交或推送=0。
- ExecutionStatus=BA_BIAS_MARKET_RESEARCHER_MINIMAL_DESIGN_V1_COMPLETE。
- DesignReady=YES；MINIMAL_RESEARCHER_DESIGN_READY=YES，仅供下一轮独立评审，非模型、Shadow或生产批准。
- ExistingModulesReusable=Facts Engine/LongShort Facts、原Knowledge Register、Http/DeepSeek、纯hash工具；具体边界见模块表。
- MinimalAdaptersRequired=输入投影、隔离调用/记录及浅层技术检查；实验只读展示按需单独批准，均未实施。
- KnownInputSemanticRisks=topGlobal单位/分母及组合来源标签、历史可用时间/内容封存不足、旧包字段缺失、短窗成交基准不能外推长窗。
- PromptCandidateCount=1；ProtectedFileHashDifferences=0。
- RecommendedNextAction=独立评审此5文档与topGlobal最小语义处理，再单独决定是否授权一次冻结的新样本验证；现在停止。
