# BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RESULTS

**V4_CONTRACT_FIX_REQUIRED — REQUESTS=0**

## 样本与逐请求结果

planned=10，selected=0，executed=0，requests=0，apiFailures=0，notExecuted=10，failedIndependentAnalyses=0。不存在可逐样本报告的真实输出；方向、周期、机制、支持/冲突/结构IDs、条件、原始响应路径及Token用量均NOT_APPLICABLE，不伪造模板行。

## 实际预检复现

一个此前明确SYNTHETIC_OR_CONVERTED的对照，仅用于诊断，不计入选定真实样本。原Facts经正式重建进入当前完整V4 Guard与Renderer。真实来源反例仅改变provenance为REAL_MODEL_OUTPUT：Schema拒绝/provenance，Renderer text=null；合成对照通过并仍显示合成标记。反例不是DeepSeek响应。

[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/preflight.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/preflight.json)；[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/summary.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/summary.json)；[validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/contract_manifest.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/contract_manifest.json)

## Q1–Q25

Q1. 0个，计划10个均未执行。

Q2. 0次真实请求，API失败0次；没有产生API响应。

Q3. 第一批未执行，安全门槛NOT_APPLICABLE。

Q4. 没有第二批；请求前固定Schema/Renderer只接受并输出合成来源。

Q5. NOT_TESTED，首次响应0。

Q6. NOT_TESTED，首次响应0。

Q7. 0个实际有效研判；成功率NOT_TESTED，未执行不计失败。

Q8. UNKNOWN，没有真实有效方向分布。

Q9. UNKNOWN，没有真实V4响应，不能宣称显著改善。

Q10. 无有效真实文本，数值溯源实测NOT_TESTED；不能宣称已完成真实Renderer审计。

Q11. UNKNOWN_LIVE；离线旧检查/测试保持。

Q12. UNKNOWN_LIVE；无真实结构引用。

Q13. NOT_TESTED，不把没有调用视为全部拦截。

Q14. UNKNOWN_LIVE。

Q15. UNKNOWN_LIVE；原结构化关系验证仍存在。

Q16. UNKNOWN_LIVE，无有效新研判。

Q17. UNKNOWN_LIVE；原规则、警告与抽象观察语义不变，期满状态尚未实现。

Q18. UNKNOWN_LIVE；没有新方向或NO_EDGE。

Q19. 设计层面显式证据/确定性渲染减少反向文本解析；真实效果本轮未测，不能与V3成功率比较。

Q20. UNKNOWN_LIVE。离线对照来源冲突已复现，不是本轮真实质量失败。

Q21. 新增9，全部590/590通过；69/69静态检查通过。

Q22. 没有；2519既存文件不变，2103数据文件无新增。

Q23. 没有；Binance/钉钉/扫描/交易/其他外部服务均未调用。

Q24. 不具备；真实生成合同未可执行、真实质量与因果可用时间未验证。

Q25. 先明确定义真实模型来源并更新Schema/Renderer来源标签；再完成最小隔离Prompt/预算/恢复/溯源适配层并冻结。不在本次边改核心合同边请求。

