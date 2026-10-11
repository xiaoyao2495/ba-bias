# BA_BIAS_ANALYST_VALIDATION_PRECISION_V1

## 1. Executive Summary

已实际实现V2验证精度修复，严格离线。最终 **11/30响应、5/10独立样本**恢复；旧70研判 **25→26**，原25全部保留。新增81测试，**464/464**通过，静态 **54/54**通过。冻结保留集真实10+语言8全部符合预期。没有新API调用、生产数据变化、扫描进程或真实发送。

最终结果以 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/summary.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/summary.json) 和 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 为准。开发期各次独立快照保留在本任务目录根、final、accepted、release；它们不是新增模型响应或额外独立事件。逐条报告 [BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY.md)。

## 2. Scope and Non-Changes

唯一被修改的既有生产文件为 [src/analysis/directional-alignment-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-alignment-guard.js)，新增独立V2 helper。V1 [src/analysis/evidence-text-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-text-validator.js) 保持字节不变。未修改Scanner、Detector、价格/OI/Funding/账户阈值、Judge、storyAngle、Prompt、Schema、模型参数、History、MATERIAL_UPDATE、Outbox、钉钉模板、调度、.env、旧ict项目或Cron。没有每轮/每日配额回归；npm run scan前台方式原样保留，未启动。

## 3. Original Live Probe Failure Baseline

核对10个Facts、10个原始输入、30请求/响应/解析/验证记录，完整且可恢复。旧首次Schema9/10、首次完整0/10、所有30完整0，所有五类有效数0。30份不是30个市场事件。与70历史重叠7个Symbol-Run事件，市场事件并集73而非80。70历史140响应，其中7份原始文本存在但JSON不合法，明确INVALID_LLM_JSON，并非数据缺失。其余Schema/完整链路按原文运行，不拼接修复。来源 [validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/results.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/results.json)、[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/replay.json)。

## 4. Independent Error Classification

修复前冻结 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/independent-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/independent-classification.json)、[validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/holdout.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/holdout.json)、[validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/before-hashes.json)。按真实字段、Facts、采样窗口、Schema和开平仓含义逐项核查，不将错误码当真值。预分类器漏查程序rule、回撤绝对值、账户起止/补集、5m标识，错标51项为TRUE；本报告保留预分类并附 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 的明确更正与原始request算术证据，未悄悄改写冻结标准。51项不是“正确错误被放行”，是审计初标本身错误。剩余争议仍UNDETERMINED，不把“可能”当事实证明。

以下以**诊断实例**计数，包含重复词法诊断及根错误，不是响应/事件数量：

| 性质 | 原诊断 | 不再出现 | 仍出现 |
|---|---:|---:|---:|
| FALSE_REJECTION | 456 | 456 | 0 |
| TRUE_REJECTION | 15 | 0 | 15 |
| CONTRACT_MISMATCH | 103 | 95 | 8 |
| UNDETERMINED | 43 | 25 | 18 |

这些诊断发生位置可在逐条JSON复核。新识别的ERA拥挤/BAT抛压断言独立阻断，即使原数字/Symbol误拒绝解除，也不算完整恢复。

## 5. Numeric Precision Fix

[src/analysis/evidence-precision-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-precision-validator.js) 保持Big HalfUp按文本小数位舍入，先规范前导+，没有epsilon扩容。全字段扫描，按指标、单位、当前/前段/滚动、账户/持仓口径和窗口绑定；完整Registry可作已验证背景，argumentative arrays仍独立决定主周期证据，不能替换primary price/OI。

支持中英常见数值、百分之/全角形式、1h/4h/24h、5m仅相对量背景、日期/ISO/毫秒时间（必须匹配evaluation/source且<=cutoff）、Symbol/ID/version数字、实际Funding结算次数。账户起止百分比从该条已验证证据的源表达复核；“从/到”绑定不同采样端点。严格区分百分比与pp。支持有显式顺序的price/OI及两周期配对，共享单位必须由明确结构提供；先前数值的后置ID不能借到下一数值。

预定义rule裸阈值/比较表达仍须正确单位、周期、指标、选定rule及舍入；不添加机械失效规则。“相对量回到1倍”只指有前24均值公式的归一化基线，不冒充当前读数或新增自动触发阈值。未来字段可明确重述历史基线，未来特定涨幅、价格目标、胜率、强平金额、虚构账户数量仍拒绝。数字分类记录在诊断中，包括TIMESTAMP、SYMBOL_IDENTIFIER、EVIDENCE_IDENTIFIER、VERSION_IDENTIFIER、COUNT、PERCENT_CHANGE、PERCENTAGE_POINT、MARKET_VALUE、OTHER；概率仍阻断。

旧数字错误完全清除 **22/27响应**，241旧逐项诊断不再出现；剩余复杂表达说明见17节。真实例AIOT +11.53%/+19.69%、6次结算/0.0737%、回落2.92%均能校验，但未来目标价仍失败。

## 6. Symbol Recognition Fix

动态精确匹配input.symbol与实际Registry；无硬编码币种名单。支持1000SHIBUSDT、1INCHUSDT的数字部分；正确裸ID和placeholder均计入used集合。未知ID、其他币种、相似后缀、大小写身份变体拒绝。已知协议枚举与USDT单位不被误当币种。原23响应/8事件的Symbol错误全部解除，不跳过数值扫描。

## 7. Negation Scope Fix

断言按逗号、转折、并列及明确推论连接词分开，局部检查否定前缀/作用后缀；支持无法据此确认、不保证、不证明必然、cannot confirm。拒绝“不是不能”“不能否认”等双否定；否定不能遮挡后续资金/强平肯定。条件性风险的后置“可能”与已发生参与者状态分开。9明确误拒绝诊断解除；ERA仍有另外的具体回补假设，不能借“无法确认”遮蔽它。

## 8. Reversal Validation Review

五类和1/4/24h原样保留。主周期当前price、此前**等长**price、真实异号、REVERSAL标签与当前转向符号一致仍必须成立。APR首次当前+2.06%、此前-3.96%；AGT首次当前+0.89%、此前-0.68%，都不是BEARISH_REVERSAL。正式入口仍拒绝，不自动改标签；合法向上/下反转Mock通过且无ICT要求，结构已确认反转仍拒绝。

## 9. Fact / Mechanism / Forecast Boundary

事实须Registry匹配；机制仍要求有界/同期price-OI链路，不能把总OI定为单边开仓、资金流或强平。既有net-OI机制边界没有放宽，混合回补/新开在OI净增长中仅理论可行，不足以证明具体行为，保守保留争议。未来方向是可检验假设，不要求未来已经成为事实。新语义检查限制无来源的已现抛压和确定拥挤；不删除研究信息或原输出字段。没有结构时保持指标复核/不足结构，THESIS_WARNING/INVALIDATED/HORIZON_EXPIRED机器语义不改。

## 10. Modified Files

| 文件 | 动作 | 作用 |
|---|---|---|
| [src/analysis/evidence-precision-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-precision-validator.js) | 新增 | 仅V2数值、标识、局部否定；严格指标/单位/窗口/舍入。 |
| [src/analysis/directional-alignment-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-alignment-guard.js) | 修改 | 接入V2 helper、裸ID引用、已知枚举、Funding口径、局部断言；保留原反转/强度/失效机器规则。 |
| [test/analyst-precision.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-precision.test.js) | 新增 | 正式生产guard入口正反例和Mock整链路，81项。 |
| [scripts/analyst-precision-prepare.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-precision-prepare.js) | 新增 | 修复前冻结数据、初始错误分类及保留集，仅运行一次。 |
| [scripts/analyst-precision-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-precision-replay.js) | 新增 | 只读原始响应正式离线回放，exclusive输出，不覆写旧记录。 |
| [scripts/analyst-precision-report.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/analyst-precision-report.js) | 新增 | 独立审计补充、静态/哈希复核及文档。 |

另新增两个验收Markdown及独立validation目录。既有测试文件均未修改。Prompt/Schema一致性没有发现需要修改核心Prompt的字段矛盾，故没有Prompt修改。

## 11. Real 30-Response Replay

30原始响应完整可读，Schema27/30，完整11/30，失败19/30。按最早合法响应选择，5/10事件有效，首次2、恢复1次2、恢复2次1；累计2/10→4/10→5/10。**本次没有实际重试请求**，选择的是上一任务保存的请求1/2/3原文。生产Analyst重试预算保持不变，NIGHT第三份离线合格不表示生产重试次数已扩张。

| Symbol | RunId | 终态 | 最早有效方向 | 最早有效attempt | 所有有效attempt |
|---|---|---|---|---:|---|
| ERAUSDT | hourly_20261010_2100 | FAILED | — | — | — |
| MAGICUSDT | hourly_20261010_2100 | VALIDATED | BEARISH | 1 | 1,2,3 |
| APRUSDT | hourly_20261010_2100 | FAILED | — | — | — |
| USUSDT | hourly_20261010_2100 | VALIDATED | BEARISH | 2 | 2,3 |
| BATUSDT | hourly_20261010_2100 | FAILED | — | — | — |
| WIFUSDT | hourly_20261010_2100 | FAILED | — | — | — |
| AIOTUSDT | hourly_20261010_2200 | VALIDATED | BULLISH | 1 | 1,2,3 |
| AGTUSDT | hourly_20261010_2100 | VALIDATED | BEARISH | 2 | 2,3 |
| NIGHTUSDT | hourly_20261010_2100 | VALIDATED | BEARISH | 3 | 3 |
| WLFIUSDT | hourly_20261010_2200 | FAILED | — | — | — |

独立方向BULLISH1、BEARISH4、两类REVERSAL0、NO_EDGE0；响应方向BULLISH3、BEARISH8。实际输入Evidence逐份与重建Facts核对相同，未增补未来证据。完整 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/live-replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/live-replay.json)。

## 12. Historical 70-Analysis Replay

140响应/70研判；Schema95/140、完整32/140；最早合格选26/70，44失败。BULLISH3、BEARISH1、两REVERSAL0、NO_EDGE22。原25/70保留，新增1个PEOPLE21:00 NO_EDGE。首次13，恢复13。没有覆盖历史文件。开发初次回归曾误伤CAP条件解释，通用修复后原25全部保留；不是因降低真实错误要求让它通过。完整 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/historical-replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/historical-replay.json)。

## 13. Holdout Validation

修复前冻结10个不同Symbol-Run，和本轮10事件不重叠；6合法条件研判通过、4错误断言拒绝。语言8例全部符合预期：合法4/4、反例4/4；误拒绝0、无依据漏拦截0。保留集内没有错误REVERSAL样本，故**真实保留集错误REVERSAL覆盖=0（NOT_COVERED）**，该项由真实APR/AGT及独立Mock正反例覆盖，不能假报保留集覆盖。历史时期/前次审计有曝光，独立性限于不同事件且修复前冻结，不是未知未来市场盲测。

首次和各次固定规则版本全部18例通过；没有根据保留集失败打补丁。后续迭代来自既有开发30例的单位/同句绑定与旧70回归CAP的通用否定作用域缺陷，每个新增反例都用Mock，不按Symbol决定通过。各阶段结果均保留，最终 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/holdout-results.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/holdout-results.json) 与 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/rule-freeze.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/rule-freeze.json)。

## 14. Correctly Rejected Counterexamples

正式guard入口拒绝错误价格/OI/Funding、pp混%、错误窗口（含5m伪称1h）、百分比阈值伪称USDT、虚构目标/胜率/概率/流入/账户数量、其他币种/未知ID/未来数据、双重否定与转折后肯定、未经证实OI单边行为、错误REVERSAL和结构确认。没有把“可能”统一豁免。失败Mock Analyst仍保留独立Facts情报，FAILED不会包装成有效NO_EDGE。

## 15. Tests and Static Checks

npm test：**464/464**，0失败/0跳过；383原测试保留，新增81。完整输出 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/test-output.txt)。node --check：**54/54**，[validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/static-checks.json)。新测试全部正式guardDirectional或Mock生产分析/Packet链路；原Facts/Claim Guard/去重/不限输出/DingTalk队列/调度测试仍通过。

## 16. Production Data Integrity

前后校验2277受保护文件，2103个生产data文件，新增生产data=0。唯一既有文件差异是获准alignment guard；原.env、模型响应、analyst快照、历史、Outbox和投递状态全部哈希一致。既有验证目录完整哈希保护。测试写入仅Mock临时目录或本任务独立验证目录。无扫描、真实Binance/DeepSeek/DingTalk、交易、发帖、补发、后台启动。最终 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/final-integrity.json)，基础 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/before-hashes.json)。

## 17. Remaining Failure Categories

ERA所有响应仍涉及未知结构、“追多拥挤”当前状态及净增长OI下回补解释；BAT所有响应“高位抛压已现”无独立证据。APR恢复后的回补+新开多混合机制仍有争议，继续失败。WIF未来精确价格及部分跨窗口/角色表达仍阻断；WLFI首份未来精确价位/边界表达，后两份marketThesis>400；NIGHT首次同样Schema超长，第二份Thesis具体减仓解释未落在允许的MECHANISM角色。US首份“杠杆”等行为概括仍保守拒绝。APR/AGT首次标签与当前转向反向，继续失败。

无法充分确定的机制/复杂表述保留UNDETERMINED或CONTRACT_MISMATCH，不声明它们都是真错。剩余8个合同诊断中包含合法数据值但缺乏可稳定绑定的配对/窗口或未来条件措辞；它们不是捏造数据的证据。当前语法尚不覆盖任意自然语言，不声称所有误拒绝已清零。

## 18. Production Readiness Verdict

已具备下一轮固定V2、受控真实DeepSeek联调的离线前提：通用误拒绝修复、原25回归无损、冻结保留集无观察到误拒绝或漏拦截、全部测试与完整数据安全校验通过。**全面生产可靠性仍未获新真实联调证明**，自然语言开放集漏拦截为UNKNOWN。本次没有安排/启动联调或扫描。保留npm run scan前台方式、无限制合格情报输出及全部安全边界。

## Q1–Q16

- **Q1** 11/30份真实响应完整恢复，27份Schema合格，19份仍失败。
- **Q2** 5/10个独立Symbol-Run样本形成有效研判。
- **Q3** 首次2/10（MAGIC、AIOT）；首次恢复响应2/10（US、AGT）；第二次恢复响应1/10（NIGHT）。累计2→4→5。这是历史已保存响应的离线选择，没有新模型重试。
- **Q4** 独立研判BULLISH=1、BEARISH=4、BULLISH_REVERSAL=0、BEARISH_REVERSAL=0、NO_EDGE=0；响应口径分别3、8、0、0、0。
- **Q5** 241个旧数值诊断不再出现；完整清除数字错误22/27份响应，涉及8个事件。不能把所有原数值诊断都等同虚构数字。
- **Q6** 23/23份原Symbol拒绝响应解除，涉及8个事件；298个重复词法诊断解除。
- **Q7** 9个明确否定误拒绝诊断解除，涉及6份响应、2个事件。某些响应仍因其他具体机制/结构失败。
- **Q8** 是。APR/AGT首次均BEARISH_REVERSAL但此前负、当前正，继续REVERSAL_DIRECTION_NOT_SUPPORTED及失效rule方向冲突；不改写标签。
- **Q9** 25/70→26/70，原25全部保留，额外PEOPLE 21:00 NO_EDGE恢复；32/140份响应通过。
- **Q10** Schema超长、无事实结构、未经确认的拥挤/抛压、具体回补机制、未来精确价位以及部分复杂数值/角色绑定仍拒绝。
- **Q11** 冻结真实10例+语言8例均符合预期，无新误拒绝/漏拦截。它们是同历史时期保留事件，有前次审计曝光，不等于前瞻盲测。
- **Q12** 已测试反例和冻结保留集未发现错误断言放行；新通过11份逐字段核查为有限假设/事实来源可核对。未来自然语言的零漏拦截能力UNKNOWN。
- **Q13** 464/464通过，新增81项，原383项原文件未改；54/54个JS静态检查通过。
- **Q14** 没有。.env、生产History、Outbox、快照、投递状态和原模型响应内容/数量/哈希不变。
- **Q15** 0个真实外部API；Binance、DeepSeek、钉钉均未调用，无真实消息。
- **Q16** 具备下一次固定V2合同、受控真实联调的离线前提；仍有复杂表达保守拒绝，不能据此宣布全面生产验证完成。本次不执行联调或启动扫描。
