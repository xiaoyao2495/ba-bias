# BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1

## 1. Executive Summary

**V4_CONTRACT_FIX_REQUIRED**。在阶段A发现固定核心合同不支持真实模型来源，按任务明确停止条款中止；真实DeepSeek请求0、实际样本0。未修改核心合同，未伪装已执行固定合同联调。新增9项预检测试，590/590通过，69/69静态通过。

## 2. Current V4 Spike Baseline

阅读6份指定报告及实际V4四模块。原581项测试/67静态文件保留。结构化输入、完整实验Schema、真实Evidence/机制/方向/条件验证器及确定性Renderer已实现；Prompt、真实调用入口、受控恢复协议尚未实现。没有复用V3自由文本语义扫描；默认结构集合为空，不误称已有支撑/阻力能力。

## 3. Fixed Contract Manifest

[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/contract_manifest.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/contract_manifest.json)记录原Schema/Guard/Renderer/Builder哈希、Node运行环境和允许预算；状态PRECHECK_BLOCKED_NOT_LIVE_FROZEN。Git不存在，commit=null。Prompt版本/哈希、模型参数及恢复提示均null/NOT_SELECTED，没有编造已冻结的真实合同。未进入请求阶段。

## 4. Experiment Isolation

仅新增预检脚本、测试及独立validation目录/报告。实际入口只构建历史输入、执行已有Validator/Renderer并生成阻断结果，不能调用传入request函数，不是未完成的真实调用适配层冒充完整实现。未导入生产写入入口/Scanner/History/Outbox/网络客户端。

## 5. Historical Sample Selection

计划10样本；selected=[]，实际执行0，10未执行。停止在样本选择前。复现使用上一任务明确转换的一个离线对照与其真实Facts，不将该对照计为本轮独立真实研判，不声称新保留集/场景覆盖。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/selected_samples.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/selected_samples.json)

## 6. Post-Collection Time Semantics

复现入口保留原evaluationTime及originalEvaluationTime，Evidence实际时间<=原截止时点；availableAt=UNKNOWN、POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。没有选定真实请求样本，因此collectionCompletedAt/researchExecutedAt为NOT_APPLICABLE，不以当前预检时间冒充历史采集或模型执行时间。严格实时因果资格仍未证明。

## 7. First Batch Results

NOT_EXECUTED_PRECHECK_BLOCKED；0样本、0首次响应、0请求。

## 8. First Batch Safety Gate

NOT_APPLICABLE：没有第一批模型结果。预检拒绝发生在请求前，不把“第一批安全门槛通过”作为已执行结论。

## 9. Second Batch Results

NOT_EXECUTED_PRECHECK_BLOCKED；未越过预检，不进入第二批。

## 10. First-Pass Schema Results

0首次响应；通过率UNKNOWN/NOT_TESTED，JSON统计null，不使用0/0百分比。离线真实来源反例由现有Schema拒绝不是模型Schema失败样本。

## 11. Full Validation Results

实际新模型完整验证0次；成功率UNKNOWN。复现真实运行Facts Builder→完整实验Guard→Renderer：SYNTHETIC_OR_CONVERTED对照通过；仅改来源为REAL_MODEL_OUTPUT后V4_SCHEMA_INVALID，Ajv instancePath=/provenance、keyword=const，Renderer text=null。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/preflight.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/preflight.json)

## 12. Controlled Recovery Results

NOT_TESTED。未写真实恢复Prompt，也没有请求。默认DeepSeek Client的HTTP内部retries=1不能直接用于未来30物理请求预算；未来隔离适配层需注入retries=0或统一计数，必须先完成测试再调用。此处是未执行的适配要求，不是本轮实际预算超限。

## 13. Evidence Binding Integrity

离线复现通过现有正式Facts验证与V4输入构建，不跳过Facts；原Evidence数量/时间保存在preflight.json。真实模型引用是否合法UNKNOWN，没有真实结果用于本轮统计。已有581测试继续覆盖原V4各种ID/机制/反转反例，新增预检测试不代替真实模型验证。

## 14. Deterministic Renderer Audit

原Renderer第13行固定输出SYNTHETIC_OR_CONVERTED；真实模型即使强行输出该标记也会造成来源语义错误。没有新有效模型文本或市场数字，渲染数值真实性实测分母为0/NOT_TESTED。离线对照可渲染，但明确保持合成来源，不冒充真实响应。真实渲染claim→原FactsField映射尚未建立，需未来安全适配层完成。

## 15. Unsupported Structure Detection

无真实模型结构引用，提出/支持/拒绝/漏检/未知数量均NOT_TESTED（统计null），不能把没有执行称为零漏检。现有原型结构ID检查保留；具体区间、支撑或阻力并未接入。

## 16. Market Mechanism Validation

现有机制相容关系、同周期价格/OI绑定、正负号条件仍由完整Guard处理，未降低标准。本轮无真实机制生成，枚举实际语义误用UNKNOWN。

## 17. Direction Distribution

五方向有效分布UNKNOWN/NOT_TESTED；没有独立有效研判，不能将所有方向填零来暗示完成预测实验。

## 18. Reversal Quality

NOT_TESTED_LIVE；已有前期/近期相反价格方向及对应证据检查保持不变。

## 19. NO_EDGE Quality

NOT_TESTED_LIVE；未通过自动NO_EDGE或机械方向来掩盖合同阻断。

## 20. Invalidation and Reassessment Quality

原PROGRAM_RULE区分INVALIDATED与THESIS_WARNING，抽象观察仅REASSESS_ONLY，结构不足不构造阈值。当前实验未实现运行生命周期的HORIZON_EXPIRED状态；horizon只是观察周期枚举，不能宣称已验证期满评价。本轮无真实条件生成，质量UNKNOWN。

## 21. V3/V4 Descriptive Comparison

UNPAIRED_DESCRIPTIVE_COMPARISON。旧V3首次完整0/10、最终2/10及结构质量疑点仍是历史参考；V4本轮0执行，不可作成功率或架构真实效果比较。不同合同及样本的研究标准需要另行明确。

## 22. Actual Requests and Token Usage

物理DeepSeek请求0、有效响应0、API失败0、Token消耗NOT_APPLICABLE/未发生调用。未探测网络/密钥，代理/Key实际可用性UNKNOWN；没有将合同阻断归因于密钥问题。Binance/DingTalk/交易/外部服务调用均0。

## 23. Tests and Static Checks

npm test：590/590通过，0失败/跳过；原581保留，新增9验证真正预检入口、实际Schema/Guard/Renderer、禁止请求分发、原时间、合成来源隔离和既存文件哈希。node --check：69/69，原67保留。真实调用预算/重试/第一批结果门槛测试尚未实施，因为合同预检先阻断；不声称9项测试证明尚不存在的真实适配层。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/test-output.txt)；[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/static-checks.json)

## 24. Production State Integrity

冻结2519个既存文件，包含.env、History、Outbox、投递状态、Facts、旧模型响应/快照、原V3及四个V4模块。任务后changed=[]，data原2103文件无新增；生产/旧实验合同保持字节一致。npm run scan前台常驻方式不变且未启动。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/integrity.json)

## 25. Remaining Risks

最小阻断是来源合同：Schema只允许合成，Renderer硬编码合成。需要先单独授权一个真实模型来源合同版本，更新来源元数据和渲染标签，同时维持Evidence/事实/结构/方向全部验证语义。之后还需最小Prompt/恢复提示、受计数传输、Facts字段映射、两批门槛、隔离测试。当前不修改这些核心文件，不绕过Validator、不在外层伪装真实来源。

## 26. Readiness Verdict

**V4_CONTRACT_FIX_REQUIRED**。CONTRACT_RELIABILITY=BLOCKED_LIVE_PROVENANCE；FACTUAL_SAFETY=NOT_TESTED_LIVE；DIRECTIONAL_USEFULNESS=UNKNOWN；PRODUCTION_INTEGRATION=NOT_TESTED。不是事实架构已被真实模型证明失败，也不是V4_PROBE_PASSED。没有进入Shadow条件。

## 27. Minimal Next Action

先单独修复并冻结来源合同，让真实生成可如实表示，Renderer相应输出真实来源；不改变市场验证规则。然后独立完成真实调用适配层测试，重新授权固定合同5+5小规模联调。严格因果Shadow仍须真实记录采集、可用与研究时刻及当时不可变预测。完成本报告后停止，不调用模型、不迁移生产。

## 停止依据

任务附件第五部分明确规定：“如需改变核心合同才能运行，停止并报告阻断，不要声称已执行固定合同联调。”这适用于Schema provenance与Renderer标签的核心来源语义冲突。建立外层真实来源标签却让正式输出仍声称合成，不能解决这个冲突。

代码证据：[Schema provenance常量](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-schema.js:6)；[Renderer固定来源标签](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-renderer.js:13)；[新增预检入口](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/structured-v4-live-preflight.js)；[9项预检测试](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-live-preflight.test.js)

