# BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1

## 1. Executive Summary

已实际修复Analyst合同、验证和一次受控修复链路。新生产合同DIRECTIONAL_ANALYST_V2；旧V1合同仍保留原验证语义。仅离线读取原始Facts与DeepSeek响应，没有调用市场/LLM/通知服务。

70次独立研判、140份原始响应、95份Schema通过；旧完整通过1次。新合同明确离线回放后，25次独立研判可恢复（新增24次），30份响应通过；首次响应12份、历史重试响应18份。唯一研判按同Symbol/Run最早通过的原始尝试选取：BULLISH 3、BEARISH 1、两类REVERSAL 0、NO_EDGE 21。45次仍失败，缺失/NOT_RECOVERABLE 0。没有补发历史消息。

308项原有测试保留，新增53项，共361/361通过。合同通过不等于未来预测具有统计优势；首次线上输出质量仍UNKNOWN。

## 2. 原始失败基线与取证路径

重点hourly_20261010_2100与hourly_20261010_2200。[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYSIS.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYSIS.json)保存70份研判入口和140条原始response JSON pointer。Facts→保存的Analyst Input→旧Prompt→原response→JSON→Schema→Evidence→Numeric→Semantic→status逐尝试核查；本次逐一检查重新生成的旧输入与保存输入JSON完全相等，旧验证errors与上一轮replay完全相同。

原始基线：140响应=95 Schema通过+38 Schema失败+7 JSON失败；70研究=1有效NO_EDGE+69失败。不能把69失败称为缺失文件，所有记录可读。修改前保存的证据：[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/before-hashes.json)、[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-analyst.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-analyst.txt)、[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-context.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-context.txt)、[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-attribution.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-attribution.json)。旧导出Schema副本见[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/legacy-input-schema.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/legacy-input-schema.json)、[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/legacy-output-schema.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/legacy-output-schema.json)。

## 3. 69次失败完整归因

阶段A在修改代码之前完成路径归因并保留原文件。初始词法线索58响应/46研究被列为“假设误拒绝待逐分句复核”，不能解释为全部可放行；数值错误初始分类也包含观察规则阈值。最终按原始fieldIndex、局部断言和新角色验证复核，结果单独保存于[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/attribution-reviewed.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/attribution-reviewed.json)，不覆盖阶段A。下表覆盖原69次失败研究的138尝试，包括在Schema之前已失败而尚未触发的潜在引用问题；最后一列仅计旧验证实际阻断。类别重叠，不能相加为独立研究。

| 类别 | 响应尝试 | 独立研判 | 实际触发旧阻断的响应 / 研判 |
|---|---:|---:|---:|
| PROMPT_SCHEMA_CONFLICT | 109 | 65 | 77 / 54 |
| EVIDENCE_NOT_EXPOSED | 0 | 0 | 0 / 0 |
| EVIDENCE_HALLUCINATED | 2 | 2 | 0 / 0 |
| WINDOW_MISMATCH | 67 | 54 | 67 / 54 |
| NUMERIC_FACT_ERROR | 1 | 1 | 1 / 1 |
| HYPOTHESIS_FALSE_REJECTION | 28 | 23 | 28 / 23 |
| UNSUPPORTED_CAUSAL_CLAIM | 27 | 23 | 27 / 23 |
| INVALIDATION_CONTRACT_ERROR | 26 | 25 | 26 / 25 |
| OTHER | 106 | 66 | 106 / 66 |

PROMPT_SCHEMA_CONFLICT在此特指Prompt/Validator/列表容量的隐式引用合同冲突，未发现旧Prompt要求不存在的输出字段的字面结构冲突（该子类0）。旧Prompt允许背景描述、Schema最多8个支持/冲突ID，而Validator要求所有正文背景引用必须再列入这两列表。Schema失败中的潜在问题只作潜在归因，不宣称经过语义验证。

EVIDENCE_NOT_EXPOSED：历史实际引用未发现相关Facts证据被隐藏而导致失败（0）；检查发现已验证5m相对量被旧输入主动排除，新V2将其作为背景暴露。未验证accounts.short与funding.display仍不转为方向证据。EVIDENCE_HALLUCINATED两份是ERA21 attempt2、CAP22 attempt1把PRICE_OPPOSITE_4h/OI_REVERSED_4h当作Evidence占位符；这些是真实程序规则ID但不是Facts Evidence，属于引用命名空间错误，而非虚构市场数据。

数值分类区分已发生事实数字和未来复核阈值：失效/复核字段中的未验证数字归INVALIDATION_CONTRACT_ERROR。HYPOTHESIS_FALSE_REJECTION仅表示某局部假设被旧规则拦截、新角色边界放行，不保证该响应其他字段合格。严格可确认的整份误拒绝恢复为29响应，24次新增独立研究。

典型阻断路径：ARPA21 attempt1的合法24h背景支持被MIXED_SUPPORT_WINDOWS拒绝；AR21 attempt2的“假设…更符合多头平仓”被UNSUPPORTED_CAUSE_OR_ORDER拒绝；NEIRO21 attempt1、MET22 attempt1的空ruleIds配合法定指标参考被数字规则绑定拦截。实际修复前位置见[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-analyst.txt:13](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-analyst.txt:13)及[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-analyst.txt:30](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/baseline-analyst.txt:30)；旧冻结实现对应[src/analysis/directional-legacy-guard.js:13](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-legacy-guard.js:13)、[src/analysis/directional-legacy-guard.js:30](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-legacy-guard.js:30)。每份响应原错误、局部证据、分类及是否阻断见独立JSON，逐140条回放表见[BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1_REPLAY.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1_REPLAY.md)。

## 4. Prompt与Schema逐字段对齐

[src/analysis/directional-analyst.js:6](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js:6)直接提供全部V2 Schema；[src/analysis/directional-schema.js:9](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-schema.js:9)列16必填字段。version=V2；symbol/evaluationTime复制输入同名字段；方向实际字段marketBias；horizonReason为明确主周期理由；conviction LOW/MODERATE/HIGH；marketThesis、marketMechanism、preferredScenario、alternativeScenario非空字符串；supportingEvidenceIds至少1、conflictingEvidenceIds可空；tradeOpportunity保留原枚举；invalidation含type/ruleIds/description；followUpChecks一至两项。不接受null/空字符串替代必填文本或额外extraNotes。

输入传输容器version继续DIRECTIONAL_INPUT_V1以兼容现有调用，但明确增加contractVersion=DIRECTIONAL_ANALYST_V2，Prompt明确禁止复制输入容器version作为输出version。新输出导出Schema只接受V2，内部兼容Schema按version为V1保留原8-ID容量与旧失效类型。所有文本仍≤400字符；128-ID是有限JSON工程容量，不是情报输出数量配额。

[src/intelligence/packet.js:53](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js:53)按输出版本重建同一输入并重新验证。旧History/快照不改；V1默认走冻结旧guard，新V2生产走新guard，只有离线回放显式replayContractVersion可以用V2研究旧raw；旧raw不改写版本。FAILED保持失败状态，Packet不展示fallback为有效NO_EDGE，合格Facts继续输出。

## 5. Evidence输入与引用合同

[src/analysis/directional-context.js:6](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-context.js:6)只取重新验证Facts、不晚于evaluationTime的实际Registry，保留原文、公式、端点、参数、口径与时间。V2增加evidenceGuide稳定ID列表及主价格/此前价格映射，不节约Token而删事实。正文背景引用不必全部挤入支持/冲突列表，但必须真实Registry、Symbol一致、时间正确。未加入任意别名接受或自动修造ID。

[src/analysis/directional-alignment-guard.js:11](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-alignment-guard.js:11)统一审核支持/冲突与正文引用。跨周期事实保持各自window，不变成当前同期；同主窗口价格/OI仍严格对齐，滚动24h与已收盘24h不混淆。5m相对量可用占位符作为背景，未增加5m预测horizon；现有手写数字解析仍主要支持1h/4h/24h。

## 6. 事实、机制、未来假设边界

OBSERVATION严格数值/单位/窗口/口径与截止时间。数值helper [src/analysis/evidence-text-validator.js:33](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-text-validator.js:33)和通用Claim Guard未改。新guard识别事实同向变化与实际相反符号的矛盾。

MECHANISM在marketMechanism允许以对齐的价格/OI为依据、明确可能性的竞争机制：OI收缩可以与部分平仓/回补相容，OI扩张可以讨论开仓参与的可能性。不能确认单侧净增仓、强平、资金流向、动机或敞口方向；添加“假设”不能掩盖这些错误。Funding支付必须由真实最新结算佐证。

FORECAST_HYPOTHESIS允许未来horizon倾向，不要求事实证明未来正确，也不强制按当前价格符号定方向。当前走势相反的预测需真实参与/冲突逻辑；只有相关但不支持的Evidence或缺少主价格依据仍拒绝。HIGH继续有真实证据约束。合理NO_EDGE保留，文字声称“冲突”不能凭空制造冲突。

## 7. 反转与失效条件

反转必须当前/此前等长度闭合价格窗口真实符号转向，并实际选择该Evidence；不要求未计算ICT事件。不以涨多/跌多/Funding/账户翻转独立触发。只能称反转假设，不能确认结构反转。

PRICE_STRUCTURE_INVALIDATION当前可靠结构不可用，因此拒绝，不伪造价位；METRIC_BASED_REASSESSMENT允许可观察定性指标条件，ruleIds可空，不能选择INVALIDATED价格规则；INSUFFICIENT_STRUCTURE_DATA空ruleIds及诚实缺失说明；兼容OBSERVABLE_CONDITION仅真实已选程序规则能自动触发。反当前走势预测不能复用会在预测成功方向触发失效的旧价格规则。

[src/analysis/directional-history.js:50](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-history.js:50)原实现不改：OI为THESIS_WARNING，明确价格规则为INVALIDATED，到期为HORIZON_EXPIRED。空ruleIds文字参考不产生机械触发。

## 8. 一次受控恢复

[src/analysis/directional-analyst.js:21](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js:21)保留最多2次尝试：首次合同/JSON失败后一次修复，传原输入、可解析的原响应、精确Schema/局部诊断、允许IDs、修复说明。JSON解析失败时本层raw为null，原响应由现有调用日志保存；不编造原文。输出重新走完整guard；不自动删断言、填ID或造价格。网络失败不额外当作合同修复重试，原HTTP限流/超时/重试不改。validationRoute分别FIRST_PASS、CONTROLLED_RECOVERY_PASS、FINAL_FAILED。历史第二响应是当时保存的旧重试结果，不是本次真实受控恢复调用。

## 9. 修改文件

新增：src/analysis/directional-alignment-guard.js、src/analysis/directional-legacy-guard.js、test/analyst-alignment.test.js；scripts/analyst-alignment-attribution.js、analyst-alignment-replay.js、analyst-alignment-report.js；两个本次根报告和独立validation目录。

修改：src/analysis/directional-analyst.js、directional-context.js、directional-schema.js；src/intelligence/packet.js仅按版本选择重验证合同；DIRECTIONAL_ANALYST_INPUT_SCHEMA.json、DIRECTIONAL_ANALYST_OUTPUT_SCHEMA.json；README.md。

旧测试必要接口改动仅三文件：test/directional-fixture.js按输入contractVersion生成输出version；test/compact.test.js和test/validation-recovery.test.js将本次授权修改的context/schema/fixture加入旧验收文件hash例外。没有删除原308项测试、没有改业务期望；新验收hash测试独立覆盖所有禁止修改模块和2103个生产data文件，避免以旧hash例外隐藏越界修改。

## 10. 真实历史回放

70研究/140原响应使用同一明确V2新语义，原文原版本不变。12首次响应+18历史重试响应=30有效响应；25唯一研究（BULLISH3、BEARISH1、NO_EDGE21），45仍失败，NOT_RECOVERABLE0。95 Schema合格中29明确整份误拒绝恢复、65正确拒绝保留、1原本有效。另45 CONTRACT_FAILURE=38Schema+7JSON。UNDETERMINED0仅指程序边界分类确定，不声称全部机制与预测真实正确。

同研究多通过响应按最早尝试选择，不按偏好挑方向；各通过尝试和不同方向均保留于replay.json。基线1/70与上一轮完全一致，无数据集更换。

## 真实通过样本逐项人工复核

所有下述响应均保持原文、原方向和原时间，Facts由保存的原始API响应重建。方向合理性仅指可解释的条件假设。

### hourly_20261010_2100 / ARPAUSDT / attempt1 — 偏多、跨周期、程序阈值数值

4h价格+1.84864240%、OI数量+46.71783600%，此前4h+5.09239178%。24h价格/OI单独标注背景。未来维持上行倾向而非保证上涨；机制明确不证明单边资金流。-1.0000%与-23.3589%均为实际输入规则阈值，并非目标价。市场观点主要复述依据，未来假设由preferredScenario给出；未评估统计优势。

Evidence：`ARPAUSDT:price.closed4h`、`ARPAUSDT:oi.4h`、`ARPAUSDT:directional.price.previous4h`、`ARPAUSDT:price.closed24h`、`ARPAUSDT:oi.24h`、`ARPAUSDT:price.drawdown`、`ARPAUSDT:directional.price.previous1h`、`ARPAUSDT:price.rangeLowHigh`、`ARPAUSDT:funding.latest`、`ARPAUSDT:funding.sum24h`、`ARPAUSDT:price.last`。

Facts：[data/runs/hourly_20261010_2100/facts/ARPAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ARPAUSDT.json)；原始响应：data/runs/hourly_20261010_2100/deepseek-calls.json#/20/raw/choices/0/message/content；原始方向BULLISH，horizon=4h。

### hourly_20261010_2100 / ARUSDT / attempt2 — 偏空、可能平仓机制、冲突事实

4h价格-0.58294875%、OI-0.25984260%，24h价格-0.12201074%、OI-2.43614198%。1h OI+0.38392274%属于反向参与背景。更符合多头平仓是带“假设”的竞争机制，不是确认开平仓；LOW及4h温和走弱未来情景与证据匹配。选定价格规则失效，OI只作复核。

Evidence：`ARUSDT:price.closed4h`、`ARUSDT:oi.4h`、`ARUSDT:price.closed24h`、`ARUSDT:oi.24h`、`ARUSDT:price.closed1h`、`ARUSDT:oi.1h`、`ARUSDT:global.flip`、`ARUSDT:global.long.change24h`、`ARUSDT:funding.latest`。

Facts：[data/runs/hourly_20261010_2100/facts/ARUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ARUSDT.json)；原始响应：data/runs/hourly_20261010_2100/deepseek-calls.json#/39/raw/choices/0/message/content；原始方向BEARISH，horizon=4h。

### hourly_20261010_2200 / AIOTUSDT / attempt2 — 偏多、多空账户冲突

4h价格+11.53184165%、OI+19.69227927%，全市场多头账户62.14%、4h空头账户+6.17pp同时保留。机制否认OI能判断新增多空方向；未来回撤消化后走强为假设。attempt1把敞口说成“在上涨方向累积”仍拒绝，只选择attempt2。

Evidence：`AIOTUSDT:price.closed4h`、`AIOTUSDT:oi.4h`、`AIOTUSDT:price.closed24h`、`AIOTUSDT:oi.24h`、`AIOTUSDT:volume.relative1h`、`AIOTUSDT:price.drawdown`、`AIOTUSDT:global.short.change4h`、`AIOTUSDT:funding.latest`、`AIOTUSDT:global.long.latest`。

Facts：[data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json)；原始响应：data/runs/hourly_20261010_2200/deepseek-calls.json#/33/raw/choices/0/message/content；原始方向BULLISH，horizon=4h。

### hourly_20261010_2200 / CAPUSDT / attempt2 — 偏多、历史转向背景、指标阈值

此前4h-11.37981575%、当前4h+9.07372401%、OI+3.09905388%。原始方向是BULLISH，未改写成REVERSAL。账户多方1h-3.69pp是冲突背景。-4.5369%及-5%来自程序价格/OI规则。“多头拥挤可能带来回撤”属于条件风险假设，未验证真实持仓拥挤，不能引用为已发生事实；合同通过不验证此机制的实证解释力。

Evidence：`CAPUSDT:price.closed4h`、`CAPUSDT:oi.4h`、`CAPUSDT:directional.price.previous4h`、`CAPUSDT:price.closed24h`、`CAPUSDT:oi.24h`、`CAPUSDT:price.drawdown`、`CAPUSDT:global.long.change1h`、`CAPUSDT:global.short.change1h`、`CAPUSDT:funding.latest`。

Facts：[data/runs/hourly_20261010_2200/facts/CAPUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/CAPUSDT.json)；原始响应：data/runs/hourly_20261010_2200/deepseek-calls.json#/30/raw/choices/0/message/content；原始方向BULLISH，horizon=4h。

### hourly_20261010_2100 / NEIROUSDT / attempt1 — NO_EDGE、跨周期、数值、无结构

24h偏多背景与1h/4h弱价格、实际相对量0.33倍竞争；账户翻转不能当作结构反转。0.33倍合法舍入；-1.9679%为输入规则参考。INSUFFICIENT_STRUCTURE_DATA的ruleIds空，正文提及程序参考不自动激活失效。未来转强/转弱两种情景均为假设。

Evidence：`NEIROUSDT:price.closed24h`、`NEIROUSDT:oi.24h`、`NEIROUSDT:global.flip`、`NEIROUSDT:global.long.change24h`、`NEIROUSDT:price.closed1h`、`NEIROUSDT:price.closed4h`、`NEIROUSDT:volume.relative1h`、`NEIROUSDT:price.drawdown`、`NEIROUSDT:funding.latest`、`NEIROUSDT:funding.sum24h`、`NEIROUSDT:oi.1h`、`NEIROUSDT:oi.4h`。

Facts：[data/runs/hourly_20261010_2100/facts/NEIROUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NEIROUSDT.json)；原始响应：data/runs/hourly_20261010_2100/deepseek-calls.json#/89/raw/choices/0/message/content；原始方向NO_EDGE，horizon=24h。

### hourly_20261010_2200 / METUSDT / attempt1 — NO_EDGE、冲突、多源引用、复核

1h温和上涨及OI增加，与此前1h下降、4h/24h方向不一致竞争；实际相对量舍入0.85倍。Funding负结算空头支付多头有实际ID，账户空方变化及翻转只是背景。未来震荡/走弱属于条件情景。无结构、空ruleIds，文本中的已知规则只有人工复核意义。

Evidence：`METUSDT:price.closed1h`、`METUSDT:oi.1h`、`METUSDT:directional.price.previous1h`、`METUSDT:price.closed24h`、`METUSDT:oi.24h`、`METUSDT:volume.relative1h`、`METUSDT:price.closed4h`、`METUSDT:price.rangeLowHigh`、`METUSDT:price.drawdown`、`METUSDT:funding.latest`、`METUSDT:funding.sum24h`、`METUSDT:global.short.change24h`、`METUSDT:global.flip`。

Facts：[data/runs/hourly_20261010_2200/facts/METUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/METUSDT.json)；原始响应：data/runs/hourly_20261010_2200/deepseek-calls.json#/109/raw/choices/0/message/content；原始方向NO_EDGE，horizon=1h。

### hourly_20261010_2100 / MAGICUSDT / attempt1 — 原先有效NO_EDGE兼容

这是上一轮唯一完整有效响应。V1旧规则仍通过，新回放也通过；未重新生成或写回历史方向。

Evidence：`MAGICUSDT:price.closed1h`、`MAGICUSDT:oi.1h`、`MAGICUSDT:directional.price.previous1h`、`MAGICUSDT:price.closed4h`、`MAGICUSDT:price.closed24h`、`MAGICUSDT:oi.24h`、`MAGICUSDT:funding.latest`、`MAGICUSDT:global.flip`。

Facts：[data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json)；原始响应：data/runs/hourly_20261010_2100/deepseek-calls.json#/1/raw/choices/0/message/content；原始方向NO_EDGE，horizon=1h。

真实140份响应没有BULLISH_REVERSAL或BEARISH_REVERSAL；因此没有真实反转通过案例，不能编造。生产入口Mock覆盖先前等长窗口转向的两种反转、缺少此前窗口及Funding单独反转拒绝。原历史Schema也没有METRIC_BASED_REASSESSMENT类型；真实样本覆盖既有指标规则/空ruleIds人工参考，新类型自动生命周期边界用Mock覆盖。真实通过样本多用占位符，未找到“大量手写事实数字”的独立案例；ARPA、CAP、NEIRO、MET覆盖真实程序阈值、多数值占位符及合法舍入，不把它们冒充大量手写事实数值。


## 11. 仍正确拒绝的实际案例与剩余原因

CFX21 attempt1的“新增敞口与价格方向一致”、JCT21 attempt2同类表达、SUPER22 attempt1“敞口在偏多方向建立”、AIOT22 attempt1“敞口在上涨方向累积”仍拒绝；OI不能确定新增敞口的多空方向。MOVR22 attempt2价格下降/OI上升却写“价格与参与量同向扩张”，又声称空方更愿意持有敞口，拒绝事实矛盾和动机推断。HEMI21 attempt1在4h观察中使用未验证±1%阈值，即使该值常见也不能从别周期借用；仍拒绝。

下表响应数包含全部尝试；独立研究数只包括45次最终失败中的研究，类别重叠，因此不能相加。

| 新合同剩余错误 | 响应数 | 仍失败的独立研判数 |
|---|---:|---:|
| UNAVAILABLE_INDICATOR_OR_STRUCTURE | 22 | 14 |
| INVALID_LLM_JSON | 7 | 6 |
| SUPPORT_SAMPLES_NOT_ALIGNED | 9 | 7 |
| DIRECTIONAL_SCHEMA_INVALID | 38 | 30 |
| WRONG_ACCOUNT_OR_OI_SCOPE | 6 | 6 |
| QUALITATIVE_FACT_CONTRADICTION | 8 | 6 |
| UNSUPPORTED_CAUSE_OR_ORDER | 27 | 20 |
| OI_DIRECTION_OR_INTENT_UNSUPPORTED | 7 | 5 |
| UNTRUSTED_SYMBOL_OR_METRIC | 2 | 2 |
| UNTRUSTED_NUMBER_OR_PROBABILITY | 9 | 6 |
| FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED | 1 | 0 |
| FUNDING_DIRECTION_MUST_USE_EVIDENCE | 10 | 4 |

## 12. 测试与静态检查

原308项保留，新增53项，npm test 361/361通过、0失败/0跳过。正例覆盖合法数字/舍入、跨周期、事实机制、未来预测、反转、NO_EDGE、缺少结构及局部否定；反例通过guardDirectional生产入口覆盖用户18类错误，包括未证目标/概率/强平金额、账户/仓位/OI口径、Funding、未来时间、假ID、错窗口、单侧建仓、确认反转、错误失效位、否定遮掩、无关Evidence、高置信度、缺失中性。完整Mock Facts→Analyst→Packet及快照到期测试通过，没有真实发送。

测试原始输出：[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/tests.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/tests.txt)；46个JavaScript文件node --check全部通过，结果：[validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/static-checks.json)。

## 13. 无生产副作用

前后SHA256验证2103个生产data文件完全一致，无新增生产data文件；.env、Facts、LLM原response、快照、History、Outbox、SENT/UNKNOWN状态不变。未改变Universe/Scanner/Detector/阈值/Judge及storyAngle恢复、History/MATERIAL_UPDATE、API配置、限流、调度、投递、分片、数量规则。previous reports不覆盖。未调用真实Binance/DeepSeek/DingTalk，不下单、不补发、不启动npm run scan或后台进程。npm run scan前台常驻入口不变。

## 14. 未解决问题

45次失败仍保留；本次未重新向模型获取合法响应。Judge storyAngle受控补全仍是上一任务待处理问题，本次未顺手修复。原始历史数据没有反转输出及新失效类型，无法提供该类真实通过例。语义guard是可复核的程序规则，不是对自由语言解释力或预测优势的完整证明；未评估历史胜率/实盘收益。模型首次输出质量、真实新合同Token/延迟及未来预测表现UNKNOWN。

## 15. 受控线上联调结论与Q1–Q12

Q1：25/70可恢复（含原有效1、新增24）。Q2：BULLISH3、BEARISH1、BULLISH_REVERSAL0、BEARISH_REVERSAL0、NO_EDGE21。Q3：95中29份明确误拒绝恢复，其余65仍拒绝、1原有效；不能把58个词法候选当29之外已证误拒绝。Q4：45最终失败，各类别独立数见第11节。Q5：是，V2生产与V1历史显式分开，Prompt/Schema/Registry/guard/Packet一致。Q6：是，按观察、可能机制、未来假设分角色验证，并保留不确定性。Q7：是，真实此前/当前转向必须存在，不要求ICT；真实历史没有该方向类别。Q8：是，无结构不造价格，新类型不自动失效。Q9：是，18类反例与附加事实矛盾/敞口动机/失效方向反例通过。Q10：新增53，总361通过。Q11：无生产历史、Outbox、.env修改或真实接口/通知。Q12：离线合同与Mock验收具备少量受控DeepSeek联调条件；真实首次成功率与预测优势UNKNOWN，需另行授权并限定无通知/无市场扫描的原Facts合同联调。本次没有执行该联调。
