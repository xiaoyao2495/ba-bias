# BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1

## 1. Executive Summary

**CUTOVER_COMPLETE**。正式代码与默认入口已切换至唯一V4，V3仅为显式人工回滚保留。原649测试全部保留，新增63，总712/712；静态81/81。生产数据与.env未改。

**LIVE_PRODUCTION_RUN_NOT_YET_OBSERVED**。本轮没有真实Binance、DeepSeek、钉钉请求，也未启动Scanner、Shadow或后台。没有可证明的正常运行触发条件，因此停止在已验证切换状态。

## 2. V4 Live Probe Evidence

前一轮10独立历史样本、11真实DeepSeek请求；Schema首次10/10、完整首次9/10、恢复后10/10，70事实行可溯源。仅证明生成合同与观察到的事实安全，不证明方向统计优势。此次额外离线复用这10份Facts/真实业务输出，只提升version/status元数据，经过生产完整Validator及Packet；10/10通过。该回放来源仍MOCK/SYNTHETIC_OR_CONVERTED，不计为新的真实请求。

[BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN.md)；[promotion-replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/promotion-replay.json)

## 3. Existing V3 Production Entry

旧src/main.js在Story Judge通过后调用analyzeDirectional（generation V3，业务JSON版本DIRECTIONAL_ANALYST_V2）；之后写快照、比较事实更新、创建Packet/Outbox、最终投递。Packet和Compact消费marketBias、rendered.marketThesis、invalidation.ruleIds等旧字段；directional-history使用旧观察价格及原截止时间进行描述性跟踪。以上均实际审查。旧main与所有src/test JS已备份；Git commit=null（非Git仓库），没有复制.env。

[切换前main代码](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/code-backup/src/main.js)；[before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/before-hashes.json)

## 4. V4 Production Mapping

正式函数analyzeV4连接冻结Facts→production typed Input→受控Adapter→Envelope→完整V4 Guard→Deterministic Renderer→业务映射。rawAnalysis/Envelope.analysis是真实模型结构化JSON；兼容analysis视图保留全部V4字段并提供marketBias=direction和invalidation别名，不重新作为模型Schema输入。支持/冲突/机制/条件/结构IDs保持原义。

生产Schema仅从已验证modelOutputSchema派生version=STRUCTURED_ANALYST_V4、status=PRODUCTION；方向、机制、条件和数值规则不变。Prompt仅提升首段运行语义和Schema两个元数据const，其余规则段及Recovery逐字保留，没有优化试验。

[src/analysis/structured-v4-production.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/structured-v4-production.js)；[src/analysis/structured-v4-prompt.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/structured-v4-prompt.json)

## 5. Changed Files

修改18个既存文件：

- [test/analyst-generation.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-generation.test.js)
- [test/structured-v4.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4.test.js)
- [test/compact.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/compact.test.js)
- [test/validation-recovery.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/validation-recovery.test.js)
- [test/structured-v4-live-preflight.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-live-preflight.test.js)
- [test/analyst-alignment.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-alignment.test.js)
- [test/long-short.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/long-short.test.js)
- [test/directional-fixture.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/directional-fixture.js)
- [test/hourly.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/hourly.test.js)
- [src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js)
- [src/analysis/directional-history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-history.js)
- [src/intelligence/compact-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/compact-renderer.js)
- [src/intelligence/packet.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js)
- [src/analysis/experimental/structured-v4-schema.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-schema.js)
- [src/analysis/experimental/structured-v4-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-renderer.js)
- [src/analysis/experimental/structured-v4-input.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-input.js)
- [src/analysis/experimental/structured-v4-provenance.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-provenance.js)
- [src/analysis/experimental/structured-v4-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-guard.js)

新增7个代码/配置/测试文件：

- [src/analysis/active-analyst.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/active-analyst.js)
- [src/analysis/active-analyst.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/active-analyst.json)
- [src/analysis/structured-v4-production.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/structured-v4-production.js)
- [src/analysis/structured-v4-prompt.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/structured-v4-prompt.json)
- [scripts/analyst-version.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-version.js)
- [test/cutover-authorization.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/cutover-authorization.js)
- [test/v4-production.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/v4-production.test.js)

六个历史哈希验收测试按本次明确授权范围增加例外；原649业务断言和测试仍保留，未授权文件继续逐字校验，新测试另对本次基线完整保护。[modified-files.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/modified-files.json)

## 6. Single Active Analyst Guarantee

每轮开始读取active-analyst.json并固定单一selectedAnalyst。当前activeAnalyst=V4、automaticFallback=false。V4失败不调用V3，不增加第二LLM裁判、队列或Scanner。现有运行锁、超时与重叠保护保持。当前两次只读进程检查未发现BA-BIAS生产进程；没有启动新进程。V3分支仅在人工将唯一选择改成V3后供未来运行执行。

[src/analysis/active-analyst.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/active-analyst.json)；[src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js)

## 7. Trusted Provenance Integration

生产LIVE factory私有持有既有DeepSeek+Http，拒绝transport注入、核验https api.deepseek.com并禁止重定向；私有receipt绑定requestHash/inputHash/responseHash及模型、本地UUID与签收时刻。Mock注入只能生成SYNTHETIC_OR_CONVERTED，不能伪称LIVE。模型业务自报来源被拒绝。Provenance验证与完整业务验证独立执行。每次attempt保存原API响应、业务JSON、验证与来源，不保存鉴权头/Key。

服务端raw.id仅responseId，不冒充认证requestId；现有Http不暴露完整成功状态码及服务端请求头，保持UNKNOWN/null。生产网络链路已接入，但本次未调用真实API；正式LIVE成功仍待正常运行观察。

## 8. Facts and Evidence Grounding

Input由原verifiedFacts/现有Facts Engine重建，冻结前深拷贝，仍过滤未来样本；原Facts未改。Packet再次执行完整V4 Guard并核对symbol、cutoff和来源SHA。不存在/外币种ID、虚构结构、错误反转、机制符号错全部保持拒绝。代码证明：业务Guard仅增加生产Schema选择，归一后函数体SHA与切换前相同。[modified-files.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/modified-files.json)

## 9. Deterministic Rendering

保留完整确定性事实文本在快照，本地可追溯精确值/单位/窗口/端点/原Facts描述。生产Packet里的自然中文判断、机制、替代情景及条件来自有限已验证枚举与程序规则，不请求模型再写自由事实文本。版本与运行语义提升为PRODUCTION、LIVE_CAUSAL_INCOMPLETE，历史实验默认路径保持原样。

## 10. Direction and Trade Opportunity Semantics

五类方向及三个horizon/三档conviction原样映射，REVERSAL不降级。未来horizon与已闭合历史观察窗口区分，不生成胜率。方向仅条件性研究；WAIT_FOR_CONFIRMATION/WAIT_FOR_PULLBACK/NO_ACTIONABLE_SETUP与方向分离，禁止把方向直接当开仓指令。

## 11. Analyst Failure and NO_EDGE Handling

失败analysis=null、rendered=null、ANALYST_UNAVAILABLE；合法NO_EDGE为VALID_NO_EDGE。输入构建失败、请求或最终验证失败保留明确原因，不调用V3，不自动升级不合格Judge候选。快照保存失败也降级方向并记录directional-persist错误，合法Facts仍可建立Outbox；如果连Facts/Outbox本身无法持久化，则保持原安全失败流程，不假装已投递。

## 12. Intelligence Packet Compatibility

新V4分支使用groundedV4/consumeV4生成旧展示字段与全部结构化字段，Packet仍version=1，原事实、newsworthiness、核心Evidence、WHAT_CHANGED、NEW_EVIDENCE、WHY_MATERIAL与Claim Guard保持。旧V3分支仍读取原旧合同；新运行不使用旧生成器。[pipeline-proof.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/pipeline-proof.json)

## 13. Compact DingTalk Compatibility

Compact保留“检测”、关键事实、方向（V4）、周期/定性强度、条件性机制、全部冲突事实、失效/复核及风险。没有发送大段JSON；精确市场值仍由Facts渲染，中文机制不确认单侧加仓、爆仓或资金流向。完整研究本地保存；已有1800-byte无损分片和独立part deliveryId未改，过长不截断。

## 14. History Versioning

旧DIRECTIONAL_SNAPSHOT_V1/V3业务JSON、原始输出、时间、Evidence、验证、评价语义不重写。新DIRECTIONAL_SNAPSHOT_V4显式analystVersion=V4，保存合同、原始分析、attempt原响应、验证、完整input、确定性文本、来源和time。既有History接口只添加新版本记录；没有第二份History。原V3快照仍可读取，新的跟踪结果标V3/V4，未静默转换旧记录。

## 15. Causal Time and Prediction Commit Semantics

记录evaluationTime（观察截止）、marketEventTime（逐Evidence末观测时刻）、sourceDataTime（原采样序列时间）、firstObservedAt（来源客户端直接记录的retrievedAt，缺失null，不猜历史首次公开可用时间）、factsFrozenAt（真实本地冻结时刻）、analystRequestedAt/CompletedAt（受控客户端时刻）。

先不可覆盖写入并读回核对快照，随后记录实际ack之后的predictionCommittedAt到独立directional-commits回执，回执绑定快照SHA。原不可变快照里字段仍null并指向回执，History索引存回执时间；不是事后改写快照。预测起点使用predictionStartTime，必须不早于真实完成/持久化确认；时钟顺序异常则起点和horizonEndTime=null。失败不生成预测起点。

## 16. Prediction Evaluation Eligibility

当前没有可靠提交后的入场基准价格及完整严格时间资格，因此所有新V4记录明确LIVE_CAUSAL_INCOMPLETE、causalBacktestEligible=false，entryReferencePrice=null。后续跟踪可凭真实提交回执计算条件观察和HORIZON_EXPIRED，但resultStatus=INELIGIBLE_CAUSAL，胜率、净变化、MFE/MAE为空；不能拿扫描时的价格当发布时价格。缺失回执或SHA错误不能制造起点。事实情报不会因此被丢弃。未实现LIVE_CAUSAL_ELIGIBLE成绩统计，也未建立Shadow。

## 17. Outbox Identity and Delivery Safety

storage/history.compare、storyKey、reconcile、deliveryId、Outbox队列、钉钉业务码、发送事务与所有阈值未改。V4仅进入directional展示/快照字段，story身份继续基于真实事实摘要与原RunId等既有字段，版本不参与新故事/实质更新判定。当前旧投递为103 SENT、2 SHADOW，无PENDING/UNKNOWN/SENDING；全部原样。[outbox-before.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/outbox-before.json)

## 18. No Duplicate Notifications

实际Mock Pipeline证明同RunId不再分析/提交，下一RunId相同Facts不再提交，失败Analyst的事实情报同样去重。仅事实compare.eligible=true时才允许保留既有方向变化原因；版本变化不独立产生NEW_STORY或MATERIAL_UPDATE。SENT不重发，UNKNOWN不盲目重试，已SENT分片保持。所有真实生产旧文件保持不变。

## 19. Rollback Procedure

1. 前台Ctrl+C，等待STOPPED；确认无活跃进程和run.lock/run.lease，不强杀写状态的进程。
2. 在项目目录执行`node scripts/analyst-version.js --set V3`，再`node scripts/analyst-version.js --status`确认V3。选择脚本遇到锁直接拒绝，原子更新唯一版本文件。
3. 沿用`npm run scan`启动后续正常时点运行；不得补跑旧RunId、清History/Outbox、重发SENT或UNKNOWN。
4. 后续如获授权恢复V4，停稳后`node scripts/analyst-version.js --set V4`。

回滚不恢复数据库、不删除V4快照或commit回执。实际测试覆盖selector V4→V3→V4、锁拒绝、旧状态原样和main仅执行V3。备份原代码可供恢复审阅，但正常回滚使用兼容现有双版本历史的唯一选择器。[scripts/analyst-version.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-version.js)

## 20. Production Entry Tests

真正执行runResearch，模拟全部Binance端点、真实原Scanner/Facts/Judge逻辑、V4、完整Guard、Packet、History快照/回执、Outbox与mock SENT。63新增测试另覆盖失败、Schema/来源注入、错误证据/机制/结构/反转、NO_EDGE、七候选、31个模型调用无实验配额、生产doctor、旧快照、提交时序/篡改、生命周期、存储失败、部分投递失败、回滚。测试不是仅实验模块Mock。[test/v4-production.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/v4-production.test.js)

## 21. Full Regression Test Results

npm test：712/712，原649保留、新63，失败/跳过0。node --check：81/81，原76保留、新5个JS。全部网络为Mock，不发送真实消息。测试报告列出完整实际链路与用例证据。[test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/test-output.txt)；[static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/static-checks.json)

## 22. Production State Integrity

切换前2678既存文件冻结SHA；18授权代码/测试变更，其余2660旧文件保持。生产data原2103文件全部不变且无新增；.env、旧实验、原V3生成/Validator/schema/context、Scanner/Detector/Facts/Judge、运行锁/队列/钉钉/调度/配置原样。Git不存在，以code-backup+哈希和唯一version selector提供回滚。[final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/final-integrity.json)

## 23. Cutover Execution Status

当前src/analysis/active-analyst.json明确V4。npm run scan与npm run once都沿原main入口选择V4；doctor增加V4依赖/Schema检查。DeepSeek Key和DingTalk配置存在（只保存布尔状态），Binance配置不变，当前无RUNNING历史任务、无锁或生产进程。没有人为构造真实通知或补跑整点。正式扫描RunId=null，真实钉钉0。[readiness.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/readiness.json)

## 24. Remaining Risks

真实正式运行尚未观察；生产元数据提升后真实模型的通过率仍需正常时点观察，失败将安全降级事实情报而非回退V3。旧V4实验成功不是预测优势，有限枚举的证据相关性/方向质量仍不确定。严格因果基准未具备，绩效明确排除；接口成功HTTP状态/服务端请求头当前仍不可获取。没有借切换加入新指标、优化Prompt/阈值或改变Story Judge合同。

## 25. Final Verdict

**CUTOVER_COMPLETE — LIVE_PRODUCTION_RUN_NOT_YET_OBSERVED**。默认V4唯一研判、完整验证/确定性渲染已接入，旧历史兼容、Outbox身份和状态保留、回滚可验证、全部测试通过且生产数据完整。无阻断本次代码切换的安全或兼容性问题。正常后续前台运行仍用`npm run scan`，本任务完成后停止，不自动开始扫描或新优化。
