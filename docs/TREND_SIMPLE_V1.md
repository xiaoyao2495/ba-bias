# TREND SIMPLE V1

显式设置 `RESEARCH_MODE=TREND_SIMPLE_V1` 后，`npm run scan` 或现有 PM2 Scanner 入口使用独立简化链；默认模式不变。UTC 每小时整点与半点后 10 秒启动，使用已收盘 15m K 线、Fractal Pivot 2/2、EMA20/50、ADX/DI14、ER20 和 ATR14。

Binance USDT 永续 Universe 按现有原生 Crypto 和成交额规则筛选，仍为所有合格合约计算技术事实。只接受指标路径或结构路径至少一条看涨的候选；任一路径明确看跌或双路径冲突则排除。MIXED/INSUFFICIENT 不等于看跌；BEARISH_STRUCTURE_DAMAGED 不单独构成看涨资格。

排序依次为双路径看涨、仅指标路径看涨、仅结构路径看涨；同级按 ADX14 降序、ER20 降序、Symbol 升序，最多选 5 个不同 Symbol，不足不凑数。每轮最多 5 次 LLM 物理请求，每个 Symbol 最多一次，并发最多 2。

LLM 可以返回 BULL、BEAR 或 NEUTRAL；模型原始方向不是通过校验的结果。结果须通过 Schema、Fact ID、时间、方向与证据角色校验；失败为 FAILED 并保留 rawBias 供诊断。无法验证的阶段标记为 UNVERIFIED。首页只显示通过结构化校验的 BULL；BEAR、NEUTRAL 和 FAILED 不进入看涨观察列表，历史保留评估结果。

数据位于 `data/trend-simple-v1/`：`runs/<roundId>/run.json` 和 `latest.json`。运行前使用独占创建的轮次记录与现有运行锁；同一数据目录只允许一个实例，已存在轮次不自动重试。启动时将未完成记录标为 INTERRUPTED。文件记录不保证 Windows 断电时严格 exactly-once 或绝对不重复扣费。

Web 在相同 RESEARCH_MODE 下通过 `/api/trend-simple` 和 `/api/trend-simple/history` 展示数据，沿用现有认证和匿名只读访问控制。该模式不自动下单、不自动发布、不发送钉钉。真实模型输出、运行表现和 Windows 断电恢复仍需分别验证；本说明不代表收益率或生产可靠性保证。
