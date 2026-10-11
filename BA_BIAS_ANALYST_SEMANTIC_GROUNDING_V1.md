# BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1



## 1. Executive Summary



ROUTE_B_SELECTED。完成一次真实归因，直接选择隔离V4最小原型；未尝试A、未替换生产V3。新增46测试，581/581通过，67/67静态通过。冻结2499文件，2103生产数据均保持不变。



## 2. 当前真实失败基线



V3首次Schema10/10、首次完整0/10、恢复2/10、API失败0（已有29真实调用，本轮新增0）；V2真实30响应11通过、5/10研判可恢复；历史70研判26可恢复，32/140响应通过。不同采样时间和合同不是因果效果比较。



## 3. 29份真实响应分析



29 Response/Attempt、10 Independent Analysis及10市场事件。10样本原Facts/实际输入/原响应/原诊断完整，逐条归因保存原文。新V3均POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/audit.json)



## 4. 30份旧真实响应回归



30/30逐对象结果一致，完整11/30、可恢复5/10。既有独立审计标签在精确对应时复用；复杂残余无法证实则UNDETERMINED。



## 5. 70次历史研判回归



140响应、70研判，95份旧Schema通过；完整32/140、可恢复26/70。7份无法解析JSON继续拒绝，不修复原文。V2与历史交集7，三集合联合83市场事件。



## 6. 否定语义问题



“具体开平仓行为无法区分”等后置否定误拒，与“不指示单侧加仓”“不设结构失效”同属关系重建问题。不能用整句含否定词豁免转折后的肯定。V4把未证实行为限制为枚举并确定性渲染，不让复杂自由断言进入事实合同。



## 7. 数字Evidence绑定问题



XLM -2.21%已有此前价格ID，却被近邻OI绑定；BAT/RAYSOL多窗口列表错误携带窗口。缺失标签及新增未来阈值不能因与某个Facts值相同自动放行。V4显式typed IDs、窗口/单位/数值/来源与program rule引用，省去全文猜测。



## 8. 未定义结构与区间问题



区间幅度%不是具体边界USDT价。必须存在可定位对象ID；普通“观察指标变化、重新评估”属于ABSTRACT_REASSESSMENT，不自动失效。具体回到区间下沿属于UNSUPPORTED_STRUCTURE；模糊结构称呼应AMBIGUOUS_REFERENCE保守处理，不机械拒绝一切“区间”字样。



## 9. 两条BULLISH质量复核



XPL preferredScenario“回踩不破近期已收盘区间下沿”、MINA alternativeScenario“回落至此前等长4h区间下沿”无对应对象，属于漏检而非仅遗漏数字。两者质量从可疑提升为明确FAIL_UNSUPPORTED_STRUCTURE，不能称高质量PASS。PRICE_OPPOSITE/OI_REVERSED仍可执行，但无法执行区间情景，不混淆。旧2/10记录保留，只追加质量审计。



## 10. ROUTE A / ROUTE B决策



[BA_BIAS_ANALYST_SEMANTIC_GROUNDING_DECISION.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_DECISION.md)在模块实施前已记录。否定/数字/结构三类均需重建非显式语义关系，有限通用规则无法安全覆盖；直接B，无符号特例、无新LLM裁判。



## 11. 实际代码修改



仅新增4个独立experimental模块（schema/input/guard/renderer）、1个离线回放脚本、1个46项测试文件，以及本任务报告/独立验证目录。未修改任何既存代码或配置。详见[BA_BIAS_STRUCTURED_ANALYST_V4_SPIKE.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_STRUCTURED_ANALYST_V4_SPIKE.md)。



## 12. 真实样本离线结果



V3 2→2/29；V2 11→11/30；历史32→32/140。10真实Facts V4输入与10转换样例合格；转换舍弃旧无证据文本，不是旧研判恢复，不是V4真实生成成功率。[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/v4-offline-experiments.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/v4-offline-experiments.json)



## 13. 错误放行检查



V4额外自由数值/目标价/无证据结构/参与者肯定断言、错误窗口/ID/符号机制/反转/机械失效注入均在入口拒绝；失败保持FAILED。生产正式guard未改，所以原两条漏检仍存在，已单独质量FAIL标注，不声称修好V3。旧集合复杂质量仍UNKNOWN，分类中UNDETERMINED不是安全证明。



## 14. 冻结保留集结果



原10真实+8语言18/18预期匹配，不修改保留集或历史期望。保留例与历史真实集重叠，不重复计事件。



## 15. 自动化测试与静态检查



npm test：581测试、581通过、0失败/跳过，原535保留；node --check：67/67，原61保留。专项46测试真实经过Facts→V4输入→Guard→Renderer，而非只测正则。[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/test-output.txt)；[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/static-checks.json)



## 16. 生产完整性检查



任务前哈希2499个既存文件（包含.env、History、Outbox、Analyst快照、投递状态、全部旧验证证据）；任务后无变化。2103数据无新增；npm run scan仍node src/scan-daemon.js。所有新输出在独立目录，未联网/发送/启动进程。[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/before-hashes.json)；[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/integrity.json)



## 17. 未解决问题



真实V4首通过率/方向分布/预测准确率/稳定性UNKNOWN；有限研究枚举的实际表达能力未由真实模型验证。历史首次可用时间UNKNOWN；结构正例只是显式源行单根边界，不生产区间/ICT能力。复杂旧错误保守未确定，不声称完成所有自然语言事实证明。



## 18. 后续最小建议



本任务已完成停止。若另行授权，先审阅结构化生成合同的模型侧要求，再少量隔离真实V4合同验证；严格因果Shadow仍必须证明每项输入当时可用，保存当时实时输出，不能把本轮后采集历史研究计入预测成绩。



## 最终Q1–Q20



Q1：明确否定具体开平仓、KAIA“不指示单侧加仓”、BAT“不设结构失效”；XLM previous24h价格数字被最近OI抢占，BAT/RAYSOL多窗口配对绑定错误。逐诊断见audit.json。

Q2：共同根因是自由文本断言作用域重建；个别误拒局部可修，但有限词法无法可靠覆盖复杂否定/转折/双重否定，不能满足ROUTE A全部条件。

Q3：结构化Evidence引用可通用绑定。现有自由文本仍须猜测相邻指标/窗口，不宜继续扩大语法。

Q4：XPL与MINA的具体区间下沿不存在可用结构对象/ID。

Q5：是，两条正式PASS情景存在无证据结构断言，FALSE_ACCEPTANCE；质量FAIL_UNSUPPORTED_STRUCTURE。原预定义指标规则仍可执行，与无证据情景分开。

Q6：不满足本轮有限低风险修复条件；不继续自由文本补丁。

Q7：ROUTE_B_SELECTED。A条件3/5/6/7无法证明，直接B，无A尝试。

Q8：不适用；未修A，V3正式结果2/29保持，不以质量降级重写旧合同结果。

Q9：不适用；旧10样本正式恢复仍2/10。

Q10：不适用A；离线旧70研判26可恢复，32/140响应通过，逐对象一致。

Q11：未新增生产放行；原两条质量漏检保留独立复核证据。V4专项反例未放行，但未知任意真实V4生成质量不能宣称为零风险。

Q12：V4输出证据ID与类型关系，市场数字只取可信输入；规则阈值也由程序取得，不做全文数字推断。

Q13：guard接受外部给定方向/机制/竞争情景，未加入自动方向生成器；同一Facts可通过偏多或合理NO_EDGE。合成脚本不是生产判断模型。

Q14：可以验证已有Evidence和显式源行结构对象存在。默认无区间结构；实验BAR_LOW/HIGH只代表已收盘单根边界，不能冒充支撑/阻力或交易设置。

Q15：原V3入口、Prompt、全部Validator/Schema、通知与生产调度均字节不变。

Q16：新增46，581/581全部通过；61原静态文件保留，新总67/67。

Q17：否；2499既存文件哈希无变化，2103生产数据无新增，History/Outbox/.env/投递状态/旧快照不变。

Q18：外部API0，真实通知0；未运行scan/once/Shadow/常驻服务。

Q19：现有自由文本V3不宜仅凭本轮继续联调提高通过率。V4真实模型合同是否可用UNKNOWN；完成独立新合同生成约束审阅后，才可另行授权小规模隔离联调。本轮不执行。

Q20：先补齐模型侧结构化生成合同表达能力/时间可用性审阅，再小规模V4合同联调；正式Shadow须证明当时可用数据并记录不可变实时预测，历史采集后研究不能替代。



明确结论：**ROUTE_B_SELECTED**。所有结果NOT_PRODUCTION；本轮停止。
