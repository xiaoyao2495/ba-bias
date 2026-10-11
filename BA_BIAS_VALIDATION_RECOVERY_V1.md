# BA_BIAS_VALIDATION_RECOVERY_V1

## 1. Executive Summary

实际完成受控修复，全部308项测试通过（原240项保留，新增68项），40个JS静态检查通过。没有执行真实扫描或Binance、DeepSeek、钉钉调用，没有启动常驻进程。

真实数据恢复：70个独立Symbol-Run、140份模型响应、133份可解析JSON、95份Schema合格。新版完整验证通过1份响应，对应1个独立研判：hourly_20261010_2100/MAGICUSDT/attempt1，结论为有效NO_EDGE。其余69个研判仍不可用，没有默认方向补齐。95份中67份解除数字门槛误拦，但其中66份仍有其他错误，不能将67认定为有效研究数。

27个仅缺storyAngle的Judge样本：0个确定性恢复、27个REQUIRES_LLM_RETRY、0个完整合同通过。另有1份Judge原始JSON解析失败，单列而不混入27个Schema案例。

MAGICUSDT、MINAUSDT、BATUSDT、JCTUSDT四条精简消息均恢复核心回撤事实，仅离线渲染，没有重发。

## 2. Scope and Non-Changes

未修改Universe、扫描器、Facts Engine、Detector及阈值、newsworthinessScore>=65、五类方向/1h-4h-24h/交易机会、History/MATERIAL_UPDATE、翻转确认规则、通知优先级、调度、Binance请求策略、API并发/节流/超时、运行锁及跨小时保护、Outbox安全/1800字节分片/业务码确认/UNKNOWN处理。没有恢复每轮2篇或每日30篇配额。

运行前2141个文件建立SHA256快照；全部2103个生产data文件哈希相同，文件集合没有新增，.env与package.json相同，未授权源文件零变化。生产数据与源文件分别检查，回放没有调用loadOutbox、reconcile或投递函数。旧ict项目和AI Pro Cron未访问写入。

BINANCE_API_KEY存在，config.binanceMarketDataKey支持读取它（优先BINANCE_FUTURES_API_KEY，否则BINANCE_API_KEY）。只核对存在与代码绑定，没有输出密钥、覆盖.env或联网验证子账户权限。新增密钥不能改变历史接口缺失事实；顶部接口当前访问权限仍待下一次明确授权的真实联调确认。

保留npm run scan → node src/scan-daemon.js，前台常驻运行方式不变，本次没有启动它。

## 3. Original Failure Reproduction

先读取三份GLOBAL_LIVE_FORENSIC报告、Directional输入/输出Schema与验收文件、COMPACT验收文件，再以保存Facts、来源、原始模型响应和代码重验。来源：[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1.md)、[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYST_DETAILS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_ANALYST_DETAILS.md)、[BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_INTELLIGENCE_DETAILS.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_GLOBAL_LIVE_FORENSIC_V1_INTELLIGENCE_DETAILS.md)。

两轮70个保存input均与从原始Facts重建的directionalInput逐字段一致。140份原始响应由deepseek-calls.json中的choices[0].message.content读取；133个成功解析的JSON与directional记录中的raw一致，旧guard复现错误列表全部一致。38份Schema失败和7份JSON解析失败均保留原状，没有改写响应或用新Mock替代历史数据。

旧数字正则无差别匹配1h/4h/24h、失效规则ID和阈值。真实手写百分比主要为程序失效阈值，不能声称发现了大量手写价格/OI/Funding实际值。价格、OI、Funding、账户百分点的原始证据引用、时间窗口、否定片段与错误阈值都有逐条样例；没有找到虚构具体支撑价格/胜率/收益率的对应真实数值样本，明确标记NOT_FOUND_IN_SAVED_RESPONSES并用Mock对抗测试补足。

审计确认58个否定片段涉及52份尝试。对这58个片段重验，均不再误识别为肯定性关键词断言；不代表52份完整响应通过。

## 4. Directional Analyst Numeric Validation Fix

[src/analysis/evidence-text-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-text-validator.js)从已声明supporting/conflicting证据绑定指标、数值、单位、窗口、统计口径。不是从Facts任意寻找一个相同数字。价格区分已收盘与滚动及此前等长窗口，OI使用数量变化，Funding区分最新结算/实际和/相邻变化，账户比例与顶部持仓份额分开，百分比与百分点分开。

Big.js按文字小数位严格half-up舍入后相等，不设置宽泛误差容差。窗口显式写明时逐项匹配；同句逗号可继承前一窗口，句号/分号清空；没有另写窗口时使用输出合同的主horizon，绝不从相等数字挑选其他周期。价格/OI涨跌动词须与符号一致，OI价值/金额和Funding年化/收益不冒充原数量/结算指标。简单比较验证真实大小关系；未来具体百分比预测不按历史数值放行。

程序失效阈值必须为当前invalidation.ruleIds所选规则，并匹配指标、周期、比较方向和舍入数值。文字提到1h/4h/24h并不赋予其他窗口support权限，原MIXED_SUPPORT_WINDOWS、采样对齐及反转依据检查均保留。概率、胜率、收益、未知目标/支撑/资金金额/账户数/合约数仍拒绝。

占位符仍优先且原样由证据phrase渲染；新Prompt与验证合同同步，既有输入/输出结构、枚举、置信度与机会判定不改。每次失败保存具体字段索引、数值/单位/指标/窗口、Evidence绑定、规则ID及Schema路径。

## 5. Negation False-Rejection Fix

按标点和转折/并列切开断言。局部否定/缺失表达可限制相应关键词，不能把整个段落豁免。账户比例不代表仓位/资金是正确口径限制；资金流入不证明价格上涨仍包含未经验证的资金流入前提，继续拒绝。

“不能根据OI增长72%就断定多头加仓72%”仅在OI72%确有当前已声明证据且否定推断重复相同数字时通过；改成99%拒绝。“账户比例变化不证明空头正在持续开仓”“无法确认此次急跌全部来自多头强平”通过。“虽然不能完全确认，但主力已经注入5000万USDT”、肯定性回补/减仓推断与复杂双重否定继续拒绝。

对于含已经/必然/确定等正面断言的复杂语句采用保守拒绝，输出具体UNSUPPORTED_CAUSE_OR_ORDER等诊断，而不是删除信息。Funding支付关系须与同字段引用、已声明的最新已结算证据一致，接受语义相同的向/给支付措辞，不据Funding推断确定未来走势。

## 6. Story Judge Contract Recovery

旧Prompt已明确要求storyAngle，Schema已将其列required；不存在字段拼写不一致。保存响应无法证明模型漏字段的内在原因，合理归因为输出合同履行不稳定，不能归因于API未返回。原始调用档案只保存model/usage/durationMs/raw，没有完整请求上下文；上下文导致原因标UNKNOWN。

27份中19份来自21:00、8份来自22:00；26份eligible:true、1份false；20份NEW_STORY、7份MATERIAL_UPDATE。异常成员统计（可重叠）：22份含账户翻转，5份滚动价格，2份OI，3份量能，其他Funding/1h价格/账户分布亦出现；没有按币种或类别添加恢复特例。

只在AJV唯一错误为缺storyAngle时调用一次字段专用补全。模型仅返回{storyAngle:string}；不能修改eligible、评分、类型、理由、risks或证据。合并后重新执行完整Schema、关键证据、storyType及65分阈值，下游Facts重建和原Claim Guard仍必须通过。storyAngle维持required/maxLength1000并增加minLength1，与非空Prompt一致；draftSchema不变。不填默认“市场出现异常”，不把reason直接当角度。

诊断保存原始解析对象、精确Schema错误、补全过程与结果，失败具有REPAIR_EXHAUSTED和JUDGE_ANGLE_REPAIR_INVALID/REQUEST_FAILED。新运行单独写stories/<symbol>.judge-validation.json；成功/失败均有诊断，正式judge.json不塞额外模型字段。已有模型网络重试/超时复用不变，合同补全最多一次。

离线27份全部REQUIRES_LLM_RETRY：0份可确定性恢复，0份同时存在其他Schema错误，0份完整合同通过。现有Evidence模板的Facts/Claim Guard可验证结果逐条保留，但不等于合格故事。另1份JSON无法解析属于NOT_RECOVERABLE。原始comparison请求未归档，类型与当时comparison的完整重验证标ORIGINAL_REQUEST_NOT_ARCHIVED；真实补全时使用当轮comparison重验。没有调用DeepSeek验证补全成功率，没有自动将历史失败候选加入Outbox。

## 7. Compact Core Evidence Fix

旧Packet使用固定metricKeys，包含rangeLowHigh却未包含drawdown；Renderer也未从Judge选择补回它。四份完整Facts和原始article都含对应回撤，旧精简正文均没有，不是低优先级指标挤掉或硬截断。

新版从重建的canonical Facts选择Judge明确选中的价格事件（drawdown/rangeLowHigh/closed窗口/rolling窗口），加原异常触发Evidence，标为CORE_EVENT_EVIDENCE。其余SUPPORTING_EVIDENCE保持本地或既有展示；不把Judge所有ID强制列入正文。未显示核心价格事件优先在成本/成交量之前展示，数值直接使用程序验证phrase，缺失明确报缺，不编造价格、突破或结构反转。已存在的价格窗口反向信息保留各窗口，未接入的突破/结构依旧不推断。

| Symbol | 补回高点至快照变化 | 旧→新正文字符数 | 旧→新分片 | 核心与字节安全 |
|---|---|---|---|---|
| MAGICUSDT | -35.54% | 819 → 847 | 1 → 2 | 全部保留 / 无损 |
| MINAUSDT | -9.80% | 778 → 805 | 1 → 1 | 全部保留 / 无损 |
| BATUSDT | -18.34% | 665 → 693 | 1 → 1 | 全部保留 / 无损 |
| JCTUSDT | -10.23% | 671 → 699 | 1 → 1 | 全部保留 / 无损 |

新增约27–28字符是回撤事实。MAGIC跨1800字节含包头安全界限，使用既有无损两片，其他仍单片。字符数按Unicode码点，正文不含投递包头；分片按实际UTF-8字节且无硬截断。保留完整Facts/Packet、本地证据与有效方向/不可用区分，没有原始ID或接口列表入正文。

## 8. Historical Replay Results

[BA_BIAS_VALIDATION_RECOVERY_V1_REPLAY.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_VALIDATION_RECOVERY_V1_REPLAY.md)列出70个独立研判、140份尝试、27个合同失败及额外1个JSON失败、四条旧/新真实消息和证据位置。完整数值绑定、原文、Schema错误与noSideEffects见[validation/BA_BIAS_VALIDATION_RECOVERY_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_VALIDATION_RECOVERY_V1/replay.json)。

选取规则：每个Symbol-Run只取最早通过完整验证的原始尝试；其他通过尝试及方向分歧单列，不挑最好看的结论。唯一恢复是21:00 MAGIC attempt1有效NO_EDGE，原始响应位置data/runs/hourly_20261010_2100/deepseek-calls.json#/1/raw/choices/0/message/content。22:00恢复0个。没有新预测快照、History或Outbox写入。

## 9. Before/After Validation Counts

| 层级 | 原数量/状态 | 修复后 |
|---|---|---|
| 独立研判 | 70，全部FAILED | VALIDATED 1 / ANALYST_UNAVAILABLE 69 |
| 原响应 | 140 | 完整通过1 / 仍不通过139 |
| JSON解析 | 成功133，失败7 | 原样，不修JSON |
| Schema | 通过95，失败38 | 原样，不放宽额外字段 |
| 数字门槛 | 95拒绝 | 67解除 / 28仍拒绝 |
| Schema合格完整响应 | 0通过 | FALSE_REJECTION 1 / TRUE_REJECTION 94 |
| 格式/Schema响应 | 45失败 | CONTRACT_FAILURE 45 |
| 缺失记录 | 待核对 | 0；没有估算 |
| BULLISH/BEARISH/两类REVERSAL | 各0 | 各0 |
| 有效NO_EDGE | 0 | 1（响应级和研判级均为1） |
| Judge仅缺angle | 27 | 确定恢复0 / 需要模型27 / 完整通过0 |

FALSE_REJECTION按整份响应当前全通过定义；局部数字/否定错误另计。TRUE_REJECTION是仍违反现行合同或明确证据/语义规则，不声称94份全部包含虚构价格。UNDETERMINED分类保留给证据不足情形，本次记录齐全；模型产生漏字段的内部原因和未来修复成功率仍UNKNOWN。

Schema合格响应剩余错误计数可重叠，不能相加当人数：

| 错误 | 响应数 |
|---|---|
| UNDECLARED_TEXT_EVIDENCE | 77 |
| FUNDING_DIRECTION_MUST_USE_EVIDENCE | 54 |
| UNAVAILABLE_INDICATOR_OR_STRUCTURE | 22 |
| SUPPORT_SAMPLES_NOT_ALIGNED | 16 |
| UNSUPPORTED_CAUSE_OR_ORDER | 46 |
| MIXED_SUPPORT_WINDOWS | 56 |
| WRONG_ACCOUNT_OR_OI_SCOPE | 7 |
| UNTRUSTED_SYMBOL_OR_METRIC | 2 |
| UNTRUSTED_NUMBER_OR_PROBABILITY | 28 |
| NO_EDGE_NEEDS_REAL_CONFLICT | 1 |

## 10. Regression Test Results

npm test：308/308，零失败、零跳过；原240项全部保留，新增68项。数值/精确舍入/单位/窗口/口径/比较/未来数值/规则/否定/混合肯定/真实BULLISH和BEARISH/NO_EDGE分离均有Mock完整guard验证；95份Schema合格历史响应、27个缺angle样本和四个真实回撤有只读回归。

Judge测试覆盖完整合同、一次补全、修复字段不可改评分、修复失败与请求失败、其他缺失字段不修、unknown Evidence、低于65仍不合格、修复后Facts/Claim Guard、空angle不合格。既有Scanner、Detector、Funding/OI、五类方向、History/更新/重复、超过2和30合格输出、无合格静默、多条失败不丢失、PENDING/SENDING/SENT/FAILED/UNKNOWN、钉钉业务码、SENT不重发、超长无损分片及前台入口测试继续通过。

注意初始基线239/240：唯一失败是旧compact-only快照对.env的永久hash断言，与用户本次加入密钥后现状不符；不是功能测试失败。保留该测试，按本次授权边界排除修复文件和用户管理.env，继续验证其他保护文件；.env安全改由本次任务前后快照证明。没有更新旧COMPACT_PROTECTED_HASHES.json来隐藏改动。

静态node --check：src/test/scripts全部40个JS通过。证据：[validation/BA_BIAS_VALIDATION_RECOVERY_V1/test-results.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_VALIDATION_RECOVERY_V1/test-results.txt)、[validation/BA_BIAS_VALIDATION_RECOVERY_V1/static-results.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_VALIDATION_RECOVERY_V1/static-results.json)、[validation/BA_BIAS_VALIDATION_RECOVERY_V1/baseline-test-results.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_VALIDATION_RECOVERY_V1/baseline-test-results.txt)、[validation/BA_BIAS_VALIDATION_RECOVERY_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_VALIDATION_RECOVERY_V1/before-hashes.json)。

## 11. Files Changed

| 类型 | 文件 | 用途 |
|---|---|---|
| 新增 | [src/analysis/evidence-text-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-text-validator.js) | 字段/单位/窗口/口径/严格舍入与局部否定断言验证 |
| 修改 | [src/analysis/directional-analyst.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-analyst.js) | 同步文字数值合同；保留原方向规则；保存逐字段诊断 |
| 修改 | [src/content/story-judge.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/content/story-judge.js) | 只补storyAngle一次；完整重验；诊断成功/失败 |
| 修改 | [src/content/schemas.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/content/schemas.js) | storyAngle增加minLength:1；required/maxLength:1000不变；draftSchema不变 |
| 修改 | [src/intelligence/packet.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/packet.js) | 确定性核心Evidence选择与角色标记；从原始来源重建 |
| 修改 | [src/intelligence/compact-renderer.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/intelligence/compact-renderer.js) | 先展示未显示的核心价格事件事实，无截断 |
| 修改 | [src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js) | 仅新增两处保存Judge合同诊断，研究/投递流程保持 |
| 修改 | [test/compact.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/compact.test.js) | 旧任务hash测试排除本次授权文件及用户管理.env；受保护逻辑仍检查 |
| 新增 | [test/validation-recovery.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/validation-recovery.test.js) | 68项专项测试，包含真实历史回归和Mock对抗 |
| 新增 | [scripts/validation-recovery-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/validation-recovery-replay.js) | 严格离线、原响应不变的完整回放 |
| 修改 | [README.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/README.md) | 更新现行数字合同及离线验收入口 |

新增交付为本报告、REPLAY报告以及validation/BA_BIAS_VALIDATION_RECOVERY_V1/独立诊断目录。此前只读审计报告、旧运行Facts/Judge/Analyst/Outbox/History、.env均未改写。

## 12. Remaining Limitations

69个独立研判仍未完整恢复。模型需要遵守“正文引用均声明”“support只同horizon”“采样端点一致”“不能通过可能/假设推断单侧开平仓”“规则引用只当前已选规则”等现有约束；38个Schema与7个JSON坏响应仍无法凭原记录合法修复。本次没有为了通过率删除这些规则或重构Analyst研究策略。

数值解析是最小可解释语法，不是任意自然语言理解器。未接入指标、未支持的复杂数值表达/时间口径、复杂否定保守拒绝且保存原因；占位符为最可靠路径。没有新增支撑阻力/主动量/CVD/Basis数据，也没有用当前密钥回填历史顶部数据。

Judge一次字段补全是否能稳定得到有效角度仍需真实模型验证。旧请求上下文未完整归档，不能确定模型漏字段内部成因；未证明可以恢复26条eligible:true情报。核心价格事件展示已经离线证实，合法新研究质量与通过率不靠Mock推算。

原有旧翻转噪声、微小UPDATE、WIF时间问题与通知相关性均未实施，仍属后续独立任务。

## 13. Production Readiness Verdict

**具备下一次受控真实扫描的联调条件，但不等于已证明方向系统恢复稳定生产。** 代码与离线回归通过，错误数值/因果/结构/概率继续拦截；27次真实Judge修复和新Prompt响应合同合规率需要后续实测。本次不启动扫描、不调用外部服务，不重新投递旧故事。

Q1：70次中恢复1次有效NO_EDGE，69次不可用。

Q2：95份中整份验证器误拒绝且能完整恢复1份；67份解除数字门槛误拦，其中66份仍有其他错误，28份继续被数字/规则验证拒绝。58个已确认否定片段涉及52份尝试，局部误拦均解除，不能叠加当合格数。

Q3：27次已有数据确定性恢复0；需LLM补全27；无其他Schema错误；离线完整合格0。

Q4：4/4修复，MAGIC两片，其余一片，核心证据与无损重建全部通过。

Q5：是，针对错误值、单位、窗口、口径、目标/支撑、资金金额、概率/胜率/收益、未来具体百分比及肯定性单侧行为的对抗测试均拒绝；没有移除原Claim Guard或模型Schema。

Q6：仍存在模型合同合规问题（声明Evidence、跨窗口、Schema/JSON、无证据机制），不将全部失败归因网络。Judge补全真实成功率尚未确认。

Q7：可以进入用户后续安排的受控线上联调；本次未运行。npm run scan保持前台常驻，所有合格新情报继续无业务数量配额进入原安全投递链。
