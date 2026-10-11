# BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1

## 1. Executive Summary

结论：FORENSIC_COMPLETE_RENDER_FIX_COMPLETE。四例完成取证，NO_EDGE展示完成最小修复。只改3个消费者展示文件，没有修改核心合同或生产状态。用户正常Ctrl+C后确认退出，未重启。

## 2. Production Run Evidence

hourly_20261011_1400：扫描924，Facts49、Judge42、保存Analyst19（15有效、4失败）；输出14（10有效、4不可用）。15有效中5条未输出为重复。运行PARTIAL，另有23条Judge ERR_BAD_REQUEST。4/14不能代表完整Analyst失败率。证据：[data/runs/hourly_20261011_1400/result.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/result.json)

## 3. Four Analyst Failure Cases

POL与LA：首次及RECOVERY_1均Schema/Provenance通过，完整验证拒绝UNKNOWN_OR_FOREIGN_EVIDENCE、UNSUPPORTED_STRUCTURE。IOST与INJ：各一次请求异常ERR_BAD_REQUEST，无响应、Schema、HTTP状态或服务端正文记录；具体原因UNKNOWN。详见[BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_20261011_1400.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_20261011_1400.md)

## 4. Schema vs Full Validation

POL/LA语法与字段类型合法不代表业务事实合格。structureEvidenceIds[0]=INSUFFICIENT_STRUCTURE_DATA；合法条件枚举被错误当成Evidence ID。完整Guard正确拒绝。IOST/INJ不应标记Schema失败或通过，应标记NOT_REACHED/MISSING_RECORD。

## 5. Evidence and Structure Failure Analysis

合法Evidence集合完整传入，funding.display与旧accounts.short为既有有意过滤，未发现其他遗漏。input.structures=[]，非法ID不在Evidence或结构集合。不是虚构具体支撑价格，而是错误填入结构引用。合法非结构复核条件本来存在，不强迫生成支撑阻力。Guard证据：[src/analysis/experimental/structured-v4-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-guard.js)

## 6. Recovery Behavior

POL/LA各执行一次恢复，得到真实Provider回复，仍重复同一非法ID。原请求按冻结SYSTEM、原input及记录模型重建，inputHash/requestHash/responseHash全匹配。没有独立HTTP请求全文文件，哈希重建与存储请求参数是证据。IOST/INJ异常路径未恢复；21条V4 usage均physicalRequests=1，与19份记录21次attempt对账：2/2/1/1。不能证明失败请求在服务端执行模型。

## 7. Common Failure Patterns

四例不存在共同Validator错误码或共同根因。POL/LA是重复合同生成错误，与12:00 CHIP同类；IOST/INJ是提供者调用异常，另23条Judge异常提供横向线索。不能据此确定额度、限流、参数、HTTP400或共同机制错误。成功STRK/CHIP结构引用为空且合法。

## 8. Model Failure vs Adapter Failure

已证实模型生成错误：POL/LA非法结构Evidence引用。已证实Validator正确拒绝：同两例。没有证据证明合法ID被截断、Envelope错误或合法响应被误传。已证实外围诊断损失：异常包装仅保存safeError文本，HTTP状态/正文没有留下；不能据此判定请求失败原因。本轮不改请求适配/错误策略。代码：[structured-v4-provenance.js:52](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/experimental/structured-v4-provenance.js)

## 9. NO_EDGE Root Cause

旧消费端presentationRule把原PRICE_OPPOSITE方向INVALIDATED统一改名REASSESSMENT_ONLY，不能改变源语义；每条带句号免责声明后再用分号拼接产生。；，同一ABSTRACT观察又放到后续字段。

## 10. Minimal Renderer Changes

修改src/intelligence/v4-conditions.js、compact-renderer.js、packet.js。仅NO_EDGE显示层过滤不适用方向失效，结构化条件去重、正确拼接和统一说明，避免重复后续。presentationRule本身和Adapter/History映射不变，原始快照保留。新增scripts/v4-failure-render-replay.js、test/no-edge-render-forensic.test.js；另3个既有测试文件调整新基线哈希、旧错误展示断言与隔离产物目录，保留原785项测试。

## 11. Invalid Condition Mapping Audit

源规则在directional-context.js:35明确outcome=INVALIDATED，OI规则:36为THESIS_WARNING。STRK/CHIP的PRICE_OPPOSITE_1h，LTE -1，仅展示过滤并返回诊断。OI各自±5的原operator/threshold保持。合法ABSTRACT观察保持。诊断作为displayConditions返回值并写入隔离after_render.json；没有向生产History/Outbox新增字段。

## 12. Deduplication Semantics

按conditionType、metricType、window、operator、threshold、evidenceId或原条件字段的排序规范化JSON判断身份，不按文本相似度。不同窗口/Evidence保留。正式followUpChecks由Adapter按ABSTRACT条件顺序生成，仅一一对应时去除已显示观察；无法证明对应的附加信息保留并返回FOLLOW_UP_IDENTITY_UNAVAILABLE。

## 13. Before/After Render

14条全覆盖，STRK/CHIP有效复核展示3→2，原始条件仍3条；合法OI/独立观察均保留。。；、；；与重复说明/观察清除。总分片25→25，正文还原无损。详细前后文：[BA_BIAS_V4_NO_EDGE_RENDER_REPLAY_20261011_1400.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_V4_NO_EDGE_RENDER_REPLAY_20261011_1400.md)

## 14. Directional Invalidation Regression

BULLISH/BEARISH及两类REVERSAL回归通过，真实结构和不同指标条件保留。8条真实有方向输出及4条失败输出的compact/full文本逐字与旧版本相同。新增第55项专门防止完整输出空后续行被顺手删除。

## 15. Production Data Integrity

基线4890个data/.env文件全部SHA-256一致，无新增生产文件。Facts、History、Outbox、旧V3/V4快照及SENT/UNKNOWN持久化不变；所有src除3个展示文件外逐字不变。包括Validator/Prompt/Schema、阈值、MATERIAL_UPDATE、调度/锁/投递实现。证据：[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/final-integrity.json)

## 16. Tests and Static Checks

原785项+新增55项，共840/840通过；89/89 JS node --check通过（原87+新脚本/新测试）。使用NODE_OPTIONS加载硬网络拦截器进行回放和npm test；Mock响应验证不计真实请求。详细：[BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1_TESTS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1_TESTS.md)

## 17. Remaining Risks

IOST/INJ的服务端根因因缺HTTP状态/正文仍UNKNOWN。POL/LA重复生成非法Evidence的质量问题仍存在。不能以本轮测试宣称模型一定生成合格输出或整体生产无故障。保留失败→ANALYST_UNAVAILABLE安全路径。诊断仅返回展示结果并记录在隔离回放，不改变历史业务状态。

## 18. Final Verdict

FORENSIC_COMPLETE_RENDER_FIX_COMPLETE。未知原因明确UNKNOWN，未通过放宽事实验证推进。未调用Binance、DeepSeek或DingTalk，没有真实扫描、重投、交易/发帖、Shadow或生产重启。

## 19. Minimal Next Action

本轮停止。V4保持唯一生产Analyst，既有验证与失败隔离保留；本次证据未证明必须改变核心合同。是否恢复扫描由用户决定。本轮不新增模型研究或自动启动任何进程。

## Q1–Q32

**Q1.** POL：structureEvidenceIds[0]非法标记，首次/恢复均UNKNOWN_OR_FOREIGN_EVIDENCE + UNSUPPORTED_STRUCTURE。

**Q2.** LA：同上，两次完整验证正确拒绝。

**Q3.** IOST：API_OR_TRANSPORT_FAILURE / ERR_BAD_REQUEST；HTTP状态及服务端原因UNKNOWN。

**Q4.** INJ：同IOST，无业务响应可判定。

**Q5.** 四者无共同Validator码；POL/LA共享两码，IOST/INJ共享请求异常。

**Q6.** POL/LA首次通过；IOST/INJ MISSING_RECORD/NOT_REACHED。

**Q7.** 历史物理transport尝试POL2、LA2、IOST1、INJ1；本轮真实请求0。

**Q8.** POL/LA各执行一次恢复仍失败；IOST/INJ未恢复。

**Q9.** POL/LA引用非法ID，且恢复继续引用。

**Q10.** POL/LA引用不在structures的标记；不是已证实虚构数值支撑。

**Q11.** 未发现导致合法输入/输出被破坏的生产Adapter Bug；确认异常详情记录不足，未改。

**Q12.** 有，POL/LA两次Schema合法但业务失败。

**Q13.** 无本组证据。

**Q14.** 无本组证据；不等于全局保证。

**Q15.** 没有证据证明必须修改核心合同；模型质量/请求异常需分别处理，不应放宽Validator。

**Q16.** PROGRAM_RULE指向PRICE_OPPOSITE_1h；源outcome INVALIDATED，旧消费端重新命名。

**Q17.** 本次NO_EDGE路径不会显示方向失效条件；原始条件保留，合法复核保留。

**Q18.** 真实两样本已消除。；、重复说明，专项测试覆盖；不是对任意外部自由文本的保证。

**Q19.** 有绑定身份的观察已去重复；不明身份的独立后续信息保留。

**Q20.** 两真实样本合法OI及独立观察全部保留，不同窗口/证据不合并。

**Q21.** 保持，四类方向/结构保护测试通过，8条真实有方向全文不变。

**Q22.** 全部不变，原始条件也不变。

**Q23.** 未改变。

**Q24.** 未改变，未新增生产投递任务。

**Q25.** 未改变。

**Q26.** 没有，仅冻结Facts/研究快照。

**Q27.** 14条总25→25；STRK/CHIP各2→2。

**Q28.** 新增55；总840通过，无失败/跳过。

**Q29.** 89/89。

**Q30.** 均无；扫描已停止，未重启。

**Q31.** 有，POL/LA重复合同字段错误尚需单独处理，当前继续拒绝。

**Q32.** 可以保留V4为唯一Analyst并使用现有失败隔离；本轮不证明实时可用性、模型质量或服务端请求已恢复，也不自动恢复运行。

证据索引：[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/failure-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/failure-audit.json)；[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/after_render.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/after_render.json)
