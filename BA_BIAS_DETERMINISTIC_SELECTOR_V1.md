# BA_BIAS_DETERMINISTIC_SELECTOR_V1

交付状态：SELECTOR_V1_COMPLETE_OFFLINE_VALIDATED。

生产流程已改为Scanner/Facts → Deterministic Opportunity Selector → Top K → Structured Analyst V4/原完整Validator → 确定性Renderer → 原History/Outbox/DingTalk。默认最多3个V4研究候选，可以0个；没有每日篇数预算或凑满规则。未启动Scanner，等待用户审核离线结果。

## 职责审计与迁移

旧Judge的LLM语义职责：新闻价值eligible/score、reason、storyAngle；Schema/缺少storyAngle的Recovery。原compare/longShortMaterial、canonical storyKey、History/Outbox持久化、重试/幂等、发送均为程序职责。

新版Selector在V4前执行资格、实质更新、去重、排序；原History、storyKey公式及投递契约保持。旧Judge Prompt/Schema/Recovery模块和旧存档保留供历史读取与隔离Mock合同测试，正常生产不导入或执行它们。Writer LLM路径同时从main移除，--write-drafts拒绝，非V4生产研究拒绝；无V3回退。doctor --live-deepseek是显式诊断入口，非自动扫描业务环节。

## 硬门槛与数据来源

先verifiedFacts从原sources重新计算并验证原生Crypto/Facts/异常。Selector不相信传入手工异常分数。事件Evidence必须存在且dataTimes<=dataCutoff。已有Detector阈值、Funding/OI/价格逻辑不变。

按PRICE_EXTREMITY、OI_ABNORMALITY、FUNDING_EXTREMITY、VOLUME_ABNORMALITY、ACCOUNT_DISTRIBUTION五类聚合，每类只取原Detector最大strength。strength为事件值除既有阈值，沿用Detector原上限5；翻转类使用既有确定性强度。各类数据来自对应已验证Evidence ID。

研究门槛满足之一：任一类别strength>=3；或至少2个独立类别且最大strength>=1.5。这样极端单项能独立进入，普通成交量/轻微价格/低幅账户比单项不能全部进入。新规则集中config.selector，maxCandidates从MAX_ANALYST_CANDIDATES_PER_RUN读取（默认3，可为0），没有覆盖.env。这是研究资源门槛，不是交易胜率或新市场异常阈值。

## 评分与稳定排序

每类得分=weight×min(strength,3)/3；权重：价格20、OI20、Funding20、成交量10、账户15。多指标分=5×min(类别数−1,3)。新故事或实质更新资格加5分。历史稀有性无完整分母，UNKNOWN且不贡献分数。总分为这些可追溯项之和，不限定为概率或原LLM0–100分；不宣称校准胜率。

按总分降序，同分Symbol固定排序；同Symbol重复先评分再取最高合格项，排名较低重复仅记录审计。Top K之外记录QUALIFIED_BUT_NOT_SELECTED/RANK_BELOW_TOP_K，既不创建Outbox，也不自动积压下轮发送。不同类别不额外主观配额，不用主题偏好插入事件。

## 更新与历史兼容

NEW_STORY没有既有输出；已有故事要求截止时间严格晚于历史lastResearchTime，并提供具体变化证据。复用有效规则：滚动价格差>=15百分点、OI数量1h/4h/24h差>=10百分点、已结算Funding差>=0.05百分点、小时成交量倍数差>=2且当前>=2；多空分布幅度变化沿用既有5百分点规则，新确认翻转需要事件采样时间晚于旧历史。新异常类型需strength>=1.5及已知旧异常列表。

不将单点跨50%、轻微价格/OI符号变化、scanTime变化或仅出现新K线作为独立MATERIAL_UPDATE。源数据缺失不变成0；历史摘要/时间不完整记录INSUFFICIENT_HISTORICAL_EVIDENCE，不伪造新故事。旧规则是兼容基线，新研究资格更严格；没有修改旧History或旧Summary。

旧Intelligence Packet的judge形状通过eligibilityCompatibility确定性映射。新Packet/approval带eligibilitySource=DETERMINISTIC_SELECTOR_V1、分项/rank/gate/materialEvidence；approval.judgeEligible=true仅为原投递契约兼容字段，不表示调用或获得LLM Judge批准。原storyKey、DeliveryId函数未变；旧SENT/UNKNOWN不迁移、不重投。

## 唯一业务LLM与成本

main中不存在judgeStory/writeDraft/analyzeDirectional调用；只有选中项进入analyzeV4，V4的最多一次受控Recovery不变。事实入选不预设方向；失败仍使用原ANALYST_UNAVAILABLE，不转NO_EDGE。

未来Run保存analystCost：逻辑请求数、physicalRequests、Recovery次数和真实输入/输出/总Token。任一usage字段缺失，成本汇总标记UNKNOWN且Token为null，不以0代替未知；估算字段单独为null。本轮没有真实模型请求。旧tokenUsage保留已报告用量的兼容汇总，不能代替analystCost的完整性状态。

## 改动范围

新增：src/market/opportunity-selector.js、scripts/selector-replay.js、test/selector.test.js。

生产修改：src/main.js、src/config.js、src/intelligence/packet.js。Scanner/Facts/Detector、价格/OI/Funding原阈值、V4所有analysis合同文件、模型客户端/参数、Claim Guard、History、Outbox/分片/投递、Scheduler均逐字保持。

9个既有测试文件调整（完整清单见integrity.json）：旧Judge/Writer/V3调用及无限候选研究预期改成新合同；保持840项既有测试总数，未删套件。历史哈希测试以本轮生产状态作为基线，配置测试明确核对新增Selector以外内容与旧源码逐字相同，未将模型参数变化混入授权。旧测试产物重定向本轮隔离目录。

## 验证与生产边界

892/892测试通过：原840+新增52；92/92 JavaScript静态检查通过。回放及npm test通过硬网络拦截器运行，所有HTTP/LLM/DingTalk使用Mock，测试写入临时目录/本轮validation。生产数据和.env 6881文件哈希一致，无新增生产数据；既有core/clients/storage/market代码无差异。

开始与结束ps均没有BA-BIAS扫描进程；未发信号、未启动进程。保留npm run scan前台常驻方式，不加PM2/Cron，不修改旧项目或AI Pro。正式新运行将采用Selector，但本轮不启动。

## 不确定性与切换条件

离线实现和合同条件满足，可以提交用户审核新Selector的未来生产切换；不宣称DeepSeek额度/服务端错误已恢复，不宣称真实模型可用性或预测质量。阈值是简单初始研究规则，未经收益优化；Top K必然留下一些合格甚至单项极端事件，其完整排名/拒绝原因可审计。原扫描的工程预算与原深查探针覆盖局限保留，不承诺每轮所有合约都生成深查Facts。

完整历史筛选对照、每个入选解释及至少10个未入选原因见回放报告。历史分别使用当轮旧系统已发送历史；新系统连续运行时历史会发生变化，不能把回放Symbols保证为未来实际选择。

## 最终25项回答

**1.** 旧职责见审计：LLM价值/叙事，程序历史/更新/身份/持久化。

**2.** 资格、更新、去重、排名/选择迁移到Selector。

**3.** 生产main已完全移除Judge调用。

**4.** 正常扫描只有V4及其受控Recovery；Writer/V3业务路径移除，显式doctor诊断单列。

**5.** 任一强度>=3，或至少2类别且最大>=1.5，另事实/时间/新颖性门槛。

**6.** 五类加权封顶+多指标分+5分新颖性；上文列出完整公式。

**7.** 原Facts重建的事件Evidence IDs，分项JSON逐分可追溯。

**8.** 无既有真实通知历史时NEW_STORY。

**9.** 实际指标差、新重要异常、新确认事件；截止时间严格晚于历史。

**10.** 无实质更新在V4前拒绝，原storyKey/Outbox/UNKNOWN保护不变。

**11.** 用户指定的初始研究预算，可配置，不把3当必须输出条数。

**12.** 允许0，0个入选意味着0次V4/0条新情报消息。

**13.** 3：LA、MAGIC、STRK。

**14.** 3：LUMIA、ERA、JCT。

**15.** 3：CFX、LUMIA、ERA。

**16.** 实际选中项的极端/共振门槛和每项Evidence见回放。

**17.** 普通单指标或无深查异常被过滤；旧故事无实质更新被抑制，逐币种原因见回放。

**18.** 3轮旧193首次逻辑调用→预计9，减少184（95.34%）；其中Judge129→0；不声称同等Token节省。

**19.** 所有src/analysis文件及模型客户端/参数未变，完整V4合同保护。

**20.** 现有6881生产data/.env哈希不变，身份/状态/幂等实现不变。

**21.** 892/892（原840+新增52），静态92/92。

**22.** 0 Binance/DeepSeek/DingTalk。

**23.** 生产数据/.env不变；明确授权的3个既有生产源码有变化。

**24.** Provider可用性、预测效果、完整市场稀有性与新系统连续历史下选择变化未验证。

**25.** 满足离线实现切换条件：SELECTOR_V1_COMPLETE_OFFLINE_VALIDATED；正式运行由用户决定，不自动启动。

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/integrity.json)
