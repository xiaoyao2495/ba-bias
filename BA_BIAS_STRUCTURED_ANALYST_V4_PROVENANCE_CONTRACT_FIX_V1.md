# BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1

## 1. Executive Summary

**V4_PROVENANCE_CONTRACT_READY**。已实际修复独立V4来源合同：保留旧合成记录，新增受控外层LIVE_MODEL_RESPONSE来源；来源与业务验证独立。Renderer读取已验证来源，原市场事实描述保持不变。新增42项测试，632/632通过；74/74静态通过。无真实API调用、无生产状态变化。

## 2. Original Blocking Evidence

原[业务Schema第6行](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-schema.js:6)要求provenance=SYNTHETIC_OR_CONVERTED；原Renderer第13行硬编码同标签。上一任务[BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1.md)及preflight.json确实为0请求。旧报告/结果不重写，保留原阻断时点语义。

## 3. Existing Source Contract

provenance原来是模型业务JSON必填字段；转换脚本和测试直接赋合成字符串，Renderer未读取字段而固定标签。旧Guard仅用Schema校验来源，并没有真实客户端签收证据。旧实验保存顶层及逐输出的合成来源；这类数据继续合成。

## 4. Root Cause

模型业务事实输出与运行来源元数据混在一个Schema中，来源const仅适合离线Spike。增加普通LIVE字符串不能证明调用来源；本次将真实来源授权移到客户端签收Envelope，未修改市场分析规则。

## 5. Minimal Schema Extension

旧outputSchema保留原有synthetic const，历史文件无需迁移。新modelOutputSchema由同一Schema确定性派生，只删除来源字段，其余版本/方向/机制/窗口/单位引用/条件约束保持。新envelopeSchema定义sourceType两类、executionKind、provider、model/requestedModel、本地requestId及类型、实际serverResponseId或null、requestedAt/receivedAt与请求/响应/输入哈希；analysis另经完整业务Schema验证，不能只凭Envelope Schema放行。

## 6. Trusted Provenance Boundary

私有WeakMap记录冻结Envelope的签收指纹、请求记录和输入指纹。只有模块内部受控dispatch接收原响应后创建receipt；没有公开“传JSON便签发LIVE”函数。LIVE工厂内部持有既有DeepSeek/Http，拒绝任意transport/client/respond注入，固定核验https api.deepseek.com、禁重定向（既有Http）、retries=0且单次在途保护。普通JSON、环境标记、克隆或反序列化Envelope不能获得receipt。未实现密码学或跨进程远程证明，不防任意代码攻陷整个运行进程。[LIVE受控入口](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-provenance.js:60)

## 7. Synthetic vs Live Source Semantics

MOCK和历史转换永远SYNTHETIC_OR_CONVERTED；使用真实历史API原文作为Mock返回也不会升级。LIVE_MODEL_RESPONSE只由拥有内部真实客户端的LIVE_API执行路径签收。缺少receipt=PROVENANCE_UNVERIFIED_REQUEST_RESPONSE；缺失旧来源=PROVENANCE_MISSING；旧业务JSON自报LIVE=UNTRUSTED_LIVE_PROVENANCE；未知值Schema拒绝。模型业务JSON来源键会触发BUSINESS_PROVENANCE_CONFLICT，只有Mock旧synthetic字段可作为兼容元数据审计删除，不改研判业务内容。真实路径任何来源自报均不静默删除。来源冲突不会把真实调用变成可信合成/真实有效研判。

## 8. Renderer Label Correction

Renderer先调用完整Guard，使用返回的可信provenance生成标签；非可信来源或分析失败text=null。LIVE只显示LIVE_MODEL_RESPONSE、NOT_PRODUCTION、causalBacktestEligible=false，不声明预测已证实或生产批准。市场数字/时间/来源/规则渲染实现未改；10个旧合成样例text逐字一致。LIVE格式函数离线通过；可信LIVE整链路渲染尚未真实联网执行，不拿手造LIVE Envelope冒充此验收。

## 9. Post-Collection Time Semantics

原Input Builder字节不变。executor保留originalEvaluationTime/evaluationTime、POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。collectionCompletedAt未验证则UNKNOWN；researchExecutedAt取调用器记录requestedAt，receivedAt独立记录。真实模型来源不改变市场事实观察截止或因果资格，也不进入回测/MFE/MAE/生产绩效。

## 10. V4 Experimental Adapter

实际入口[executeStructuredExperiment](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-executor.js:6)连接Facts→Builder→受控Adapter→Envelope→Guard→Renderer→独立结果。Mock与LIVE共享签收/校验路径，但只有LIVE私有客户端可发真实请求。响应包括原raw记录及SHA、本地UUID、配置模型与响应模型匹配、请求/输入SHA、签收时间；服务端无id则serverResponseId=null，不把本地UUID当服务端认证ID。Http统计物理请求，Mock=0真实请求，缺钥等请求前失败不凭逻辑尝试数冒算真实HTTP次数。30上限仅实验请求预算，不是生产情报业务配额。

## 11. Historical Compatibility

旧V4记录不改写、不重标LIVE。10份合成输出与新Envelope Mock结果兼容且市场渲染相同。199旧响应逐对象验证不变：V3 2/29、V2 11/30、历史32/140，对应2/10、5/10、26/70研判可恢复；18/18保留集仍符合预期。83去重市场事件，不把请求量当预测量。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/replay.json)

## 12. Modified Files

修改5个既存文件：Schema、Guard来源包装、Renderer标签、旧预检脚本与其对应测试。旧预检更新为来源合同READY，但不擅自dispatch；历史联调结果文件不改。其哈希测试只豁免本轮明确授权的5文件，继续核验所有其他文件。新增2模块、1测试、2离线脚本；见下方精确清单。V4 Input Builder、机制/方向/反转/结构业务实现、原DeepSeek/Http/config/模型参数、V3均未改。

## 13. Full Offline Validation

16个实际Mock案例全部符合预期：10历史兼容正例与6反例，经过真实executor/Schema/Guard/Renderer并以wx存入本任务mock-results。任何输出不是新真实模型响应。离线链路还验证私有receipt不能从保存JSON重建为LIVE。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/offline-chain.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/offline-chain.json)。原业务Guard函数体仅更名函数和Schema变量后逐字一致，SHA在报告证据中保存。

## 14. Rejected Forged Provenance Cases

模型source/sourceType/provenance自报LIVE、手改旧JSON、序列化伪Envelope、未知来源、元数据缺失/请求ID缺失或替换、模型名不匹配、跨Facts重放均拒绝。来源可信且业务错误分离返回provenanceValid=true、analysisValid=false；来源不可信返回false/false。真实来源无法通过普通JSON或Mock注入建立。

## 15. Evidence and Structure Safety Regression

完整业务校验对每份来源有效输出执行，不按sourceType选择弱校验分支。错误Evidence、Symbol/窗口、OI相容符号、无定义区间、错误反转、虚构目标/阈值、Funding必涨/账户规模解释仍拒绝。失败不改方向/机制、不会替换NO_EDGE；Renderer不删非法字段放行。旧业务Guard体等价是LIVE与Mock事实规则相同的代码证据，网络LIVE端到端仍待独立联调验证。

## 16. Tests and Static Checks

原590项保留，新增42，632/632通过、0失败/跳过；原69静态文件保留，新74/74通过。测试覆盖真实实验executor与独立存储、来源请求关联、兼容、反例、预算、单次在途保护与无副作用。LIVE schema表达/标签格式可离线检验，但Mock不能被算真实LIVE签收；本轮未真实执行LIVE网络分支，不声称真实成功率。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/test-output.txt)；[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/static-checks.json)

## 17. Production Data Integrity

修改前冻结2531个既存文件，生产data共2103文件；仅5个授权来源相关代码/测试文件变化，其余文件哈希一致，生产数据无新增。History、Outbox、投递状态、.env、Facts、V3快照、旧实验数据全部不变。测试存储拒绝production路径、符号链接和覆盖现有文件。没有Scanner/scan/once/Shadow/发送/交易。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/final-integrity.json)

## 18. Remaining Risks

真实网络、API Key/代理访问、实际响应模型名称是否与配置一致及真实生成质量UNKNOWN。跨进程JSON不作为可信LIVE receipt；后续回放若需认证历史LIVE记录，应独立设计归档验证，不因文件自报来源升级。来源合同READY不证明方向有统计优势。未编写/修改方向Prompt；下一轮需在请求前冻结Prompt/恢复提示及分批门槛、请求/Renderer事实映射记录。

## 19. Readiness for Fixed-Contract Live Probe

来源与最小受控调用接口已READY，无已知必须再修改来源/业务Schema才能表示真实输出的阻断。下一轮可在本合同之上先完成固定Prompt、受控恢复与5+5执行记录并离线检验，冻结所有哈希，再另行授权真实请求。LIVE业务JSON必须不自报来源；模型不遵守时拒绝，不通过改合同或悄悄删字段推进。本轮立即停止，未发请求、未开启Shadow、未迁移生产。

## 精确文件清单

- 修改 [test/structured-v4-live-preflight.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-live-preflight.test.js)
- 修改 [scripts/structured-v4-live-preflight.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/structured-v4-live-preflight.js)
- 修改 [src/analysis/experimental/structured-v4-schema.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-schema.js)
- 修改 [src/analysis/experimental/structured-v4-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-renderer.js)
- 修改 [src/analysis/experimental/structured-v4-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-guard.js)
- 新增 [src/analysis/experimental/structured-v4-provenance.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-provenance.js)
- 新增 [src/analysis/experimental/structured-v4-executor.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-executor.js)
- 新增 [test/structured-v4-provenance.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-provenance.test.js)
- 新增 [scripts/structured-v4-provenance-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/structured-v4-provenance-replay.js)
- 新增 [scripts/structured-v4-provenance-offline.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/structured-v4-provenance-offline.js)

## Q1–Q23

Q1. 原业务Schema第6行synthetic const与原Renderer第13行固定字符串；前者作为兼容Schema保留，新Envelope承担真实来源。

Q2. 保留；旧记录/旧输出/Mock都仍为SYNTHETIC_OR_CONVERTED。

Q3. LIVE_MODEL_RESPONSE，位于外层provenance.sourceType。

Q4. createLiveV4Adapter的私有DeepSeek+Http签收路径；外层request UUID与来源由运行器赋值，模型不能选择。

Q5. 不能；自报LIVE不提供receipt，业务来源冲突也拒绝。

Q6. 不能通过正常JSON/Mock接口；Mock永远合成。任意程序攻陷/猴子补丁破坏整个进程不在此进程内边界证明范围。

Q7. 有：本地UUID/LOCAL_TRACKING_ID、requestHash/inputHash/responseHash、记录模型与签收时间。

Q8. 服务端缺id保持serverResponseId=null；本地UUID明确是跟踪ID而非服务端认证ID。

Q9. 是，完整校验通过后按可信来源生成标签；LIVE标签格式离线测试，可信LIVE网络签收后的文本尚未实际生成。

Q10. 是，来源有效后无分支进入原完整业务Guard。

Q11. 仍拒绝；Mock executor反例实际运行，Guard原业务函数体等价，原测试全部保留。

Q12. 保持，10份旧V4合成市场文本逐字一致，旧文件无修改。

Q13. 完全不受影响，原V3及生产快照哈希不变。

Q14. 可以，来源描述客户端调用，历史模式描述研究时序，互不改变。

Q15. 是，input/业务Schema/实验result固定false，LIVE来源无提权逻辑。

Q16. 199响应逐对象一致；18/18符合预期。

Q17. 新增42，632/632通过，原590全部保留。

Q18. 74/74通过，原69文件保留。

Q19. 没有；仅授权5个来源相关既存代码/测试变化，生产data无新增/变化。

Q20. 真实DeepSeek/Binance/DingTalk均0；仅Mock。

Q21. 来源合同及受控调用接口已可用，不需再改变来源/业务合同；下一任务须先形成固定Prompt/恢复/分批记录并测试、冻结后才执行真实请求。网络可用性和生成质量UNKNOWN。

Q22. 未发现来源/市场业务核心合同需要再改变的阻断；真实联调所需的实验编排准备仍需在下一轮完成。

Q23. 冻结modelOutputSchema及Envelope/Guard/Renderer/Builder/Adapter和Prompt/恢复/参数；选择不重复10真实历史Facts并审计时间；离线安全测试和生产哈希；授权后顺序5+5且最多30物理请求，批间检查；保存原响应/溯源/质量报告并停止。

