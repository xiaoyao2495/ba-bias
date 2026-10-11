# BA_BIAS_LONG_SHORT_INTELLIGENCE_V1 验收记录

实施日期：2026-10-10。实际修改代码；所有运行验证均使用合成 Mock 数据。

## 文件清单

新增：

- `src/market/long-short-facts.js`：三类口径解析、数值质量、精确窗口、翻转、跨来源比较及证据。
- `src/market/long-short-detector.js`：五类多空异常及可解释评分。
- `src/market/long-short-discovery.js`：全原生 Crypto 账户发现、覆盖档案及轮换。
- `test/long-short.test.js`：新增48项 Mock 验证。
- `LONG_SHORT_VALIDATION.md`、`LONG_SHORT_TEST_RESULTS.txt`：本验收记录和完整测试输出。

修改：

- `src/clients/binance.js`：顶部两个端点白名单、只读市场数据Key请求头；不持久化Key。
- `src/clients/http.js`：统计接口1000请求/5分钟共享计数限制，含重试请求。
- `src/config.js`：新增独立多空阈值、30样本、发现预算及已有环境Key读取。
- `src/market/scanner.js`：新增发现通道、候选并集、复用账户来源、获取顶部序列、覆盖汇总和深查中断状态。
- `src/market/facts-engine.js`：添加longShort及证据；新增账户数学校验，保留原价格/OI/Funding/成交量计算与核心完整度判定。
- `src/market/detector.js`：原规则计算之后追加多空异常，原阈值保持不变。
- `src/content/story-judge.js`：将三种口径、历史变化、时间/来源及价格OI交叉信息交给Judge；增加解释边界。
- `src/content/claim-guard.js`：追加具体开平仓、获利了结、聪明钱和确定性反转表达拦截。
- `src/intelligence/packet.js`：从原响应重建多空证据，分组展示比例/变化/翻转/背离/缺失原因及历史实质变化。
- `src/storage/history.js`：保存多空摘要及MATERIAL_UPDATE比较。
- `README.md`：运行方式、规则、覆盖、权限、失败及证据位置说明。

没有修改原两个测试文件、原测试fixture、Writer、main.js、Scheduler、Outbox或DingTalk投递实现；现有投递链路已满足全量输出和无损分片，直接复用。

## 数据源与权限结论

三个端点均已接入代码且完成Mock验证，使用period=1h、limit=30、endTime=evaluationTime。原响应、Symbol、查询参数、检索时间、有效采样序列、精确区间、公式及稳定Evidence IDs均保留。全市场/顶部账户与顶部持仓严格区分；顶部持仓字段topLongPositionShare等使用percent单位，不是全市场OI拆分。

以最新合法且年龄小于1h的统计样本作为锚点，计算准确1/4/24小时差；每个窗口必须存在全部连续小时样本。不替换最近点、不插值，缺失/断点返回null及原因。未来数据保留原响应审计用途，但不进入计算。固定非整点采样相位可用，跨来源必须精确同时间。重复、数值越界、无效分母、份额和不一致、ratio数学不一致、错Symbol/周期均有失败标识。份额和容差0.0002；独立四位小数公布带来的ratio舍入以abs(long-ratio*short)<=0.00015*(ratio+1)核对。

当前[Binance官方Market Data文档](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data)标注顶部两个接口需要X-MBX-APIKEY。本次只检查已有环境Key名称/是否存在，不读取打印Key内容：没有Binance Key，因此没有真实权限验证请求；不能声明真实顶部接口成功。代码在缺Key时记BINANCE_MARKET_DATA_KEY_MISSING且不请求顶部端点；已有Key可仅供这些市场数据请求使用，不需要Secret、签名或交易权限。401/403等返回保留安全错误码并降级。未修改.env。

## 覆盖和异常发现

研究目标集合是官方原生Crypto过滤后的全部USDT永续，包含ticker不合格的合约，后续核心事实仍须合格。原价格/Funding初筛及轮换探测通道保留，独立发现账户变化的币种追加到候选并集，不受原24个探测名额限制、不重复深查、不重复请求已获取的全市场来源。顶部指标在该深查并集内获取，并非声称每轮全市场顶部扫描。

原Http的3并发、150ms节流、代理、15秒请求超时、有限重试、429/418及权重冷却继续使用。新增统计接口共享1000请求/5分钟本进程计数。其他程序共用IP仍由服务器限流保护。发现阶段最多90秒且不超过扫描预算一半，为原深查留出预算；整轮和扫描预算、锁、跨小时重叠保护不变。

每轮保存accounts-coverage.json和accounts-discovery/<symbol>.json。requested表示实际发起采集；fullyEvaluated表示三个历史窗口完整；insufficientData包括已发现短窗异常但长窗缺失的情况；unrequested单列未请求后缀；uncovered列出所有未完整评估币种及原因。未知覆盖绝不记无异常。未请求后缀优先进入下轮，History保存轮换和覆盖摘要。深查预算中断且核心数据不足记NOT_EVALUATED。

Mock验证：4币种全覆盖、原探测名额2、账户异常候选合并去重后3个深查；原探测之外的账户异常能独立入选。7个仅有账户异常的币种，即使原探测名额为2，仍全部进入Judge并生成7条Outbox情报。

## 可解释规则与历史

集中于config.longShort.thresholds，与原价格/OI/Funding阈值隔离：

- 全市场账户、顶部账户、顶部持仓变化：1h>=5pp、4h>=10pp、24h>=15pp。
- 主导侧严格跨越50%，SINGLE_SAMPLE/CONFIRMED（至少2个连续样本）/TRANSIENT_RETURN分别标识；50/50或采样缺口不确认。
- 顶部/全市场账户背离：同时间多头账户差绝对值>=15pp；或精确4h变化方向相反且双方绝对变化>=5pp。只比较账户口径，不拿顶部持仓与全市场账户比较。
- 稳定证据例：SYMBOL:global.short.change4h、global.long.change4h、global.flip、topAccounts.long.change4h、topPositions.long.change4h、topGlobal.divergence。

这些异常仍经过原核心Facts验证及完整Story Judge新闻价值判断。Judge接收三种口径的比例、变化、窗口缺失原因、采样时间、来源以及价格/OI/成交量交叉事实，不依赖Writer。

History保存比例、1/4/24h变化、主导侧、翻转事件及背离。已输出对应数值变化>=5pp、主导侧改变、新翻转/确认或新增异常类型可触发MATERIAL_UPDATE，之后仍由Judge审核。仅时间前移、连续确认数量增加、没有实质变化不会重复发送；缺失值不作为数值变化证据。原价格/OI/Funding实质更新规则未变。

## 情报和投递

INTELLIGENCE_FIRST保留：分组显示三种比例口径、1/4/24h百分点变化和起止时间、翻转确认、账户背离规则结果、同期价格OI及量、缺失来源、尚未确认的交易行为及观察点。WHAT_CHANGED列出此前和当前账户事实；Packet内部保留完整证据、原响应和新旧摘要。

程序生成的事实表达与Judge/可选Writer均限制未经证实的解释：比例不能证明具体开平仓、资金流向、聪明钱观点或价格反转。事实没有为避险而删掉。

全部合格情报持续进入既有Outbox；没有每轮2篇、每日30篇或其他输出配额。复用独立deliveryId、UTF-8无损分片、持久化待发送队列、有限重试、SENT不重发、UNKNOWN不盲目重发。原7条全部投递、同日38条不触发配额、失败不丢后续消息及无合格静默等回归测试仍通过。

## 测试和执行边界

执行npm test，139/139通过：原91项全部保留并通过，新增48项通过，0失败/取消/跳过。新增模块与scanner/packet的node --check通过。完整输出见LONG_SHORT_TEST_RESULTS.txt。

覆盖三端点/口径、精确pp计算、单点/持续/短暂翻转、分布差异及方向背离、时间匹配/非整点相位/未来防护、缺失点禁止插值、独立入选及并集、缺Key/HTTP403降级、MATERIAL_UPDATE及重复抑制、六类禁止因果、7条无配额输出、旧异常不变、请求计数限流、429/部分覆盖、持久化失败等待其他worker退出。

未实际调用Binance API、DeepSeek或DingTalk；仅浏览官方文档和检查已有环境Key是否存在。未启动真实扫描或常驻进程，未修改旧项目、AI Pro Cron、.env或添加PM2。无按特定币种调阈值或使用真实币种定制规则。

.env前后SHA-256相同：8e56336d9f7d53c0b6ebe0da25709b37a213a86fe07463c065a946cfd0ad4adf。

npm run scan仍是node src/scan-daemon.js前台常驻，现有北京时间09:00–23:00每小时计划不变。本次未自动启动；运行后实际市场覆盖率须看各轮覆盖档案，Mock全覆盖不能代替真实现场覆盖或顶部权限验证。
