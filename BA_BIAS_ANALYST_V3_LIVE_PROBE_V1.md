# BA_BIAS_ANALYST_V3_LIVE_PROBE_V1

## 1. Executive Summary

**预检阻断，真实联调未执行。** 检查396份真实历史Facts，完整时点可见性合格0；没有擅自后移评价时间、删除核心证据或放宽验证。原518测试保留，新增7项预检安全测试，总525/525通过，静态59/59通过。真实DeepSeek首次成功率仍UNKNOWN — NOT_TESTED_LIVE。

## 2. Fixed V3 Contract Manifest

固定记录见 [validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/manifest.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/manifest.json)。原生成版本为DIRECTIONAL_ANALYST_GENERATION_V3（任务标题BA_BIAS_ANALYST_GENERATION_V3指同一升级）；输入展示V3、输出V2、Precision V1 guard及SHA-256固定。模型deepseek-flash、temperature0、thinking disabled、max_tokens6000、json_object；实际配置与旧冻结值一致。项目无Git仓库，commit=null并明确NOT_A_GIT_REPOSITORY。生产2总调用未改；本任务授权的隔离探针3总请求/样本、全局30物理请求未使用，不能将其改成生产上限。

## 3. Safety Isolation Verification

当前独立入口只做历史审计，不导入HTTP/DeepSeek/Binance实例、Scanner、Scheduler或Pipeline，不调用Writer/Judge/History/Outbox/DingTalk。只读config加载既有.env并记录Key存在性、代理布尔状态，不保存Authorization、密钥、Webhook或代理凭据。没有网络路径。若后续时间口径获明确授权，真实探针仍须另行完成统一物理请求预算和传输白名单安全测试，不能把本次预检测试当成尚未实现的真实传输预算验证。

## 4. Historical Sample Selection

冻结 [validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/selected_samples.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/selected_samples.json)：planned=10、actualExecutable=0。逐文件证据 [validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/sample_inventory.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/sample_inventory.json)。395份有核心来源retrievedAt晚于原evaluationTime，1份核心时间记录不完整；全396份均不能证明完整输入在原评价时间已可得。Scanner先固定cutoff，随后查询深查数据；Binance Client在请求完成后写retrievedAt。见 [scanner.js:19](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/market/scanner.js:19) 和 [binance.js:12](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/binance.js:12)。事件时间截断解决未来事件，却不等价于当时已发布/可获得。排除不确定核心数据后无法维持现有完整Facts要求，因此不虚构10个新样本。未按事后走势或模型结果选样，没有新样本被提交。

## 5. True DeepSeek API Execution

实际DeepSeek请求0，首次调用0，恢复0；未发送额外连接测试。没有伪造V3响应。任务要求真实调用与B5排除不可确认字段不能同时满足现有档案，所以停在预检而非绕过B5。

## 6. First-pass Validation Results

首次Schema数0、首次完整数0，但完成首次响应分母=0、尝试样本分母=0；成功率null/UNKNOWN，不是0%失败率。

## 7. Controlled Recovery Results

恢复成功0，没有恢复请求/响应，恢复有效率UNKNOWN。完整合同未改；未执行新Prompt修改、调参或模型答案程序重写。

## 8. Direction Distribution

有效五类方向各0，表示没有研究输出，不能解读为NO_EDGE率0%或方向覆盖失败。

## 9. NO_EDGE Quality

NOT_TESTED；没有NO_EDGE模型输出，不能判定过度保守、真实冲突或空洞套话。

## 10. Reversal Classification Review

NOT_TESTED；没有新REVERSAL输出，不得编造反转例。原回归的合法/非法反转仍通过预期断言。

## 11. Evidence and Numeric Accuracy

历史来源时间审计有明确不确定性；本轮没有新模型引用/数值结果，EVIDENCE_UNKNOWN、数值/窗口/口径误用率UNKNOWN。现有验证器未变化。

## 12. Market Mechanism Reasoning

NOT_TESTED_LIVE；没有新机制解释，不能判断系统性开平仓/资金流向断言是否减少。

## 13. Future Hypothesis Quality

NOT_TESTED_LIVE；没有未来方向假设，不能宣称研究价值或预测优势。

## 14. Invalidation Quality

NOT_TESTED_LIVE；未产生新失效条件、THESIS_WARNING或INVALIDATED事件；也未进行未来生命周期评估。

## 15. Failure Root Causes

当前是数据因果可见性预检阻断，不是JSON/Schema/数值或模型失败。retrievedAt是采集完成时间上界，不是交易所最初发布时间；现有档案缺少原时点之前的核心来源获取记录/可用时间证明。没有生成错误响应可分类。

## 16. Unpaired V2/V3 Comparison

UNPAIRED_DESCRIPTIVE_COMPARISON。V2历史参考首次2/10、最终5/10；本轮V3无执行分母，不能比较差值或改善迹象，也未额外调用V2。

## 17. Total Requests, Tokens and Costs

物理请求0、API失败0、有效响应0；没有Token usage返回，tokenUsage=null；无明确计价及用量，estimatedCost=null。没有实际模型请求费用记录。

## 18. Regression Test Results

525/525测试通过；原518项字节保留，新增7项检查时间可见性、无事件时间替代、冻结一致、无客户端进口及原样本身份。静态59/59。日志 [validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/test-output.txt) 和 [validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/static-checks.json)。真实传输路径/重试统一预算尚未运行测试，不能宣称已验证未实现链路。

## 19. Production Data Integrity

联调前后旧文件哈希比较，无既有文件修改、无新增生产data文件；Facts、History、Outbox、旧快照、SENT/UNKNOWN状态及.env字节相同。所有输出在validation独立目录；无Binance、钉钉、交易、后台进程或扫描启动。未修改旧项目/Cron。

## 20. Production Readiness Verdict

CONTRACT_RELIABILITY=UNKNOWN（本轮未联调）；FACTUAL_SAFETY=现有回归通过，新的真实响应NOT_TESTED；DIRECTIONAL_USEFULNESS=UNKNOWN；PRODUCTION_INTEGRATION=NOT_TESTED。尚无本轮依据建议完整Shadow Scan，更不能宣布生产就绪。

## 21. Recommended Next Minimal Action

最小阻断是时间口径与现有档案不匹配。已向用户询问是否允许改为“采集完成后对历史数据的研究”，分别记录研究时间和原市场截止时间；尚未获得该口径修改授权。保留B5则需具备原时点实际可见性证明的新历史档案。无需修改Prompt/Schema/Validator、市场阈值或整体重构。不要自动启动Shadow Scan或正式扫描。

## Q1–Q20

| 问题 | 答复 |
|---|---|
| Q1 | 0个执行样本；396份真实Facts已检查，严格合格0。 |
| Q2 | 0请求、0API失败；没有尝试连接。 |
| Q3 | 0；分母0，NOT_TESTED。 |
| Q4 | 0；成功率UNKNOWN，不能算0%。 |
| Q5 | 0独立研判；NOT_TESTED。 |
| Q6 | 五类各0；没有输出。 |
| Q7 | UNKNOWN，没有新响应。 |
| Q8 | UNKNOWN，没有新模型输出；历史可见性无法确认。 |
| Q9 | UNKNOWN，未真实生成；旧反转约束不变。 |
| Q10 | UNKNOWN，没有有效方向输出。 |
| Q11 | UNKNOWN，没有NO_EDGE输出。 |
| Q12 | UNKNOWN，没有新失效条件。 |
| Q13 | UNKNOWN，没有恢复调用。 |
| Q14 | 无法比较，UNPAIRED_DESCRIPTIVE_COMPARISON；V3分母0。 |
| Q15 | UNKNOWN，没有合同通过结果可评审。 |
| Q16 | 525/525，静态59/59。 |
| Q17 | 未修改，旧文件Hash全部一致。 |
| Q18 | 均未访问/启动/交易。 |
| Q19 | 尚无证据支持进入完整Shadow Scan；PRODUCTION_INTEGRATION=NOT_TESTED。 |
| Q20 | 需原时点可用性证明，或用户明确授权采集完成后历史研究的新时间口径。 |

逐样本排除明细：[BA_BIAS_ANALYST_V3_LIVE_PROBE_V1_RESULTS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1_RESULTS.md)。本报告不是已完成真实联调验收，状态明确BLOCKED_CAUSAL_AVAILABILITY。
