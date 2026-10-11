# BA_BIAS_ANALYST_SEMANTIC_GROUNDING_DECISION

ROUTE_B_SELECTED — 决策先于V4代码实施。

真实错误归因见 validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/audit.json；冻结集合见 dataset-freeze.json。否定后置、跨窗口机制和相邻指标绑定反复失败；XPL和MINA正式通过的情景仍引用不存在的区间下沿。

现有isDenied需要枚举中文/英文词形和作用域长度，numeric validator需要重建最近指标、携带窗口、列表配对、相邻引用。不是一个局部比较或舍入Bug。通用关系在自由文本中未被声明，修复必须扩大语言文法；特别是“不设结构失效”与“回落到此前区间下沿”需要不同对象语义。ROUTE A条件3、5、6、7无法可靠满足。少量新正则无法同时证明复杂否定安全和结构溯源。

选择独立结构化V4实验：显式Evidence与规则引用，程序渲染事实；保留模型选择方向、冲突、机制和未来条件的职责。放弃A，不修改生产Prompt/Validator/Schema。B不证明预测优势，不解除生产时间可用性阻断。所有不确定旧错误保留UNDETERMINED，不能将合同PASS当作质量真值。无第二LLM裁判、无外部请求。
