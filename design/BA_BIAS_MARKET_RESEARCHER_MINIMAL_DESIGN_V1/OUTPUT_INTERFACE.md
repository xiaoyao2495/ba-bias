# 最小研究输出与兼容性

以下仅为7字段接口形状示意，空字符串不是有效研究样例，也不是预设NO_EDGE答案。

```json
{
  "marketState": "",
  "financialInterpretation": "",
  "supportingEvidence": [],
  "competingEvidence": [],
  "decisionBasis": "",
  "bias": "NO_EDGE",
  "uncertainties": []
}
```

marketState、financialInterpretation、decisionBasis为非空字符串；bias为BULLISH/BEARISH/NO_EDGE。三个数组的元素为非空字符串，允许空数组、无固定证据数量。marketState/解释/支持/竞争/依据+Bias/未知覆盖六项职责。既无重要竞争事实时competingEvidence可空；decisionBasis应能说明为何仍有或没有优势，不新增强制noImportantConflictReason对象。NO_EDGE既可来自支持不足，也可来自未能解决真实冲突，不能强迫编造冲突。

竞争事实单独表达；数据适用条件、缺失、未知在uncertainties，decisionBasis说明其影响。不要用“不知道主动方”冒充相反事实。数组可写自然语言Fact标识，不强制深层引用、知识全集、固定篇幅或强度分数。

## 外围记录：程序生成，不由模型填充

独立标签EXPERIMENTAL_MARKET_RESEARCHER；未来独立研究ID不得复用V2的bias_recordId生成规则或正式RunId语义。

| 设计元数据 | 已有参考/最小映射 |
|---|---|
| ResearchId、Symbol、原RunId | V2 recordId不同命名空间；Symbol由请求绑定，不信任模型自报 |
| FactsAsOf、originalEvaluationTime | 原dataCutoff/evaluationTime；不改原时间 |
| FactsAvailableAt及证据/未知原因、researchExecutedAt | buildInput的factsAvailableAt与旧实验可用上界；真实研究起止独立保存 |
| FactsHash、InputHash、原包路径 | 对应factsPackageSha256与inputHash但明确bytes/canonical方法 |
| KnowledgeVersion、KnowledgeHash、KnowledgeContextHash | registryVersion、登记bytes/canonical与实际上下文分别保存 |
| PromptHash、ModelId、ModelParameters、RequestBodyHash | 参考既有请求台账；不混淆模型名与供应商底层权重版本 |
| 原Provider响应、RawResponseHash、请求/响应时间、finish_reason、usage、error | DeepSeek.calls保留raw；可用实验台账封存思想，不复制旧运行脚本 |
| 分析对象、技术结果、人工事实/金融审阅记录 | 外围描述性审查标签，与原响应独立；不修改模型原文 |
| causalBacktestEligible=false、实验标签 | 历史材料不冒充原观察时刻实时预测 |

若Provider未提供底层版本或usage，保存未知，不能由模型猜测。技术失败可保留无analysis的实验失败记录，绝不转成NO_EDGE。原始输出、审阅意见及后续修正建议分开保存，失败也有完整身份关联。

## 轻量技术检查与人工审阅

TECHNICALLY_VALID：响应非空，finish_reason不为length等未完成状态，JSON完整且无重复键，7个字段类型与Bias枚举正确，大小受工程上限控制，输入/请求/响应hash身份完整。现有parseAnalysis不能直接用：[src/analysis/market-bias-v2/parser.js:8](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/parser.js:8)同时执行正式Schema；未来仅使用相同安全解析思路的最小Adapter，不加载旧modelAnalysis合同。

FACTUALLY_REVIEWED：逐句重要数字、单位、观察窗口、状态、对象与已封存输入核对，未来可对明确Fact ID、明显外来Symbol或未知数值提示人工检查。自由文本包含四舍五入、组合数值和多窗口，简单匹配不能证明所有数字正确，更不能证明没遗漏重要竞争事实。无FactRef模板不等于允许无来源数值；无法确定时保持待审。

FINANCIALLY_REVIEWED：人工评审五维研究质量，尤其K2适用、竞争权重和Bias依据。正则不判Funding方向权重、OI联合解释正确性或NO_EDGE优劣。引用全部正确也可能金融解释错误。

PRODUCTION_APPROVED：另行独立授权与生产验收结果。本轮不会产生此标签。上述只是审查状态说明，不建立新的复杂状态机，前一等级不自动升级后一等级。

重要错误处理：封存、记录具体问题、不发布；无自动重试、补全截断JSON、第二个LLM Judge或自动增补事实。工程超时、有限网络策略保留，实验是否允许网络重试须预先冻结，不能掩盖物理次数。本设计推荐每案一次、无自动重试。

## 最小兼容Adapter（未来独立批准）

1. 输入Adapter：既有验证结果+事实语义投影+原知识上下文，参见FACTS_KNOWLEDGE_INPUT；不复制计算。
2. 研究记录Adapter：调用现DeepSeek/Http、封存独立请求原文与元数据、浅层技术检查，无正式V2 executor恢复流程。
3. 若需展示，独立只读实验DTO/页面：显示分析、来源链接、观察/研究时间、审阅标签，不能写正式History/Outbox，不能复用V2 VALIDATED标签。

[src/analysis/market-bias-v2/storage.js:13](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/storage.js:13) saveResearch写生产索引且要求V2 Schema；[src/analysis/market-bias-v2/render.js:6](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/market-bias-v2/render.js:6) publicAnalysis要求V2 envelope，renderResearch读取嵌套对象和模板；[src/web/reader.js:62](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/web/reader.js:62) Reader.research核对V2合同/hash/guard；[src/intelligence/packet.js:28](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js:28) buildIntelligence绑定正式研究。它们均不支持直接接收此对象，不调用它们替新实验发消息。

实验文件目录/服务路由尚未实施，未来确定独立root并验证路径白名单和只读权限。命名为Shadow也不够：不得把其记录登记到生产research/history、Outbox、delivery或正式Dashboard卡片；不得让实验数据改变Selector去重、Top3或扫描计划。Shadow必须另行批准。
