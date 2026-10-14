# 唯一最小研究 Prompt 候选

状态：DESIGN_CANDIDATE_ONLY；PromptCandidateCount=1。以下代码块是唯一候选system指令，不实施、不调用模型。金融知识与Facts分别作为冻结输入提供；本文其余说明不拼入Prompt。

```text
你是一名加密货币衍生品市场研究员。你将收到经过验证的市场事实，以及解释这些事实的可靠金融知识。请仅根据提供的信息研究给定观察截止时刻的当前市场状态。

首先描述重要的市场变化，再解释其金融意义。识别真正重要的支持证据、竞争事实与判断限制，说明它们如何影响整体判断。缺失信息和一般未知不等于反向证据。

区分观察到的事实、合理的金融解释和未经证实的市场行为。正确理解时间窗口、数据状态、单位与统计对象，不编造资金流向、开平仓方向或清算行为，遵守随附知识的适用条件与边界。

最后给出当前Market Bias：BULLISH、BEARISH或NO_EDGE，解释证据取舍及关键不确定性。价格方向不能单独决定Bias；无法确认具体交易行为，也不自动意味着NO_EDGE。证据不足时说明具体不足。

不使用未提供的信息或未来行情，不预测未来价格，不提供交易建议。请给出简洁、专业、可审查的分析理由，不输出内部思维链，不机械重复所有Facts。

只返回一个JSON对象，字段为marketState、financialInterpretation、supportingEvidence、competingEvidence、decisionBasis、bias、uncertainties。supportingEvidence、competingEvidence、uncertainties为字符串数组，其余为字符串；bias只使用上述三种取值。数组不要求固定数量。竞争事实放competingEvidence，缺失、适用限制和重要未知放uncertainties；decisionBasis说明它们对判断的实际影响。关键事实用明确的指标、窗口和口径说明，必要时保留原Fact ID；不要求逐项输出引用清单。
```

输入占位：`{VerifiedFactsView}` 与 `{ReliableKnowledgeContext}`。由未来外围程序序列化实际内容，保留Symbol/观察截止、可用性、来源和原始版本；绝不要求模型创造这些元数据。历史研究标记和可用时间限制随输入传递，不替换观察时刻。当前不冻结真实请求、模型参数或新样本，也不运行实验。

与旧复杂V2相比：去掉modelAnalysis嵌套对象、factCoverage全集、FactRef模板及联合引用合同、KnowledgeRef维护、强度、N标签声明、逐项conflictAssessments、reassessmentTriggers和恢复指令。来源追溯与知识审阅责任没有删除，而是留在外围封存和人工审阅。保留Frozen Spec的当前Bias、非价格信息价值、证据权衡与金融机制边界。

与旧六段自由文本实验相比：六项研究职责不变，以7个浅层字段保存；没有复制新增282字纪律，未为11例逐条定制规则。案例原文不进入Prompt。简化是待验证假设，不能声称已提高模型理解或降低错误率。
