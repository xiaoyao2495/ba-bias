# /api/overview 新字段

既有latest、researchRun、cards、emptyState、lastSuccessfulAt、stale字段含义和限制保持，新增marketWatch，公私两种模式同一时间规则；公开模式经显式DTO投影。

```text
marketWatch
  version = 4H_MARKET_WATCH_V1
  timeZone = Asia/Shanghai
  schedule = 0 * * * *
  windowMeaning = FOUR_SCHEDULED_HOURLY_SLOTS
  windowStart / windowEnd        最早、最新计划整点，不是连续行情区间的开闭端点
  observedAt                    聚合观测时间；缓存命中保留原时间
  expectedSlots = 4
  counts                        completed/complete/partial/failed/missing/skipped/running/incomplete/invalid
  lastValidScanAt                最近有效已完成扫描的Facts截止
  stale                         无有效已完成扫描或该截止距观测时间超过2h
  slots[4]                      scheduledAt/runId/status/finishedAt/dataCutoff/计数/coverage/有限原因码
  totalSymbols / limit=10        去重后的总数 / 首页展示数量上限
  sortRule / occurrenceMeaning   排序及出现次数口径
  emptyState                    NO_VALID_RESEARCH / NO_COMPLETED_SLOTS / null
  items[0..10]
    symbol
    firstSeenAt                 窗口内首次有效研究所属计划时槽
    latestResearchAt            最近有效研究的validationCompletedAt，旧记录依次回退decisionCompletedAt/generatedAt
    occurrenceCount             窗口内已完成槽中该币种有效研究次数；同Run最多一次
    highestScore / scoreStatus   有效保存分数的最大值；缺失为null/MISSING，真实0保留
    scoreSourceRunIds            最高分来自哪些Run
    latestBias / latestRunId
    anomalyTypes                最新有效研究的原始异常类型
    dataCutoff / metrics         只属于latestRunId同一份Facts，不拼接其他Run
    stale                       此币种最新研究Facts是否超过2h
    runIds
    occurrences[1..4]           每小时独立runId/scheduledAt/researchTime/dataCutoff/score/bias/anomalyTypes/metrics
```

## 时间与状态

14:10检查11、12、13、14整点；00:10跨日前取21、22、23、00。所有时间为毫秒UTC，页面使用Asia/Shanghai显示。Windows本地时区不参与小时槽生成。

仅接受精确小时RunId、scheduledAt匹配、时间有效且COMPLETE/PARTIAL的运行。PARTIAL单列，不当作完整成功；只纳入其中通过既有验证的独立研究。FAILED/INTERRUPTED、SKIPPED_MISSED/SKIPPED_OVERLAP、RUNNING、缺失、无效和未完成都保留可见状态，不取更早Run替代。不纳入HISTORICAL_REPLAY研究或未来完成/未来事实。四槽读不到研究时不把空研究等同于Scanner失败。

completed=complete+partial；failed包括FAILED和INTERRUPTED；skipped单列。completed+failed+skipped+missing+running+incomplete+invalid=4。当前计划全天运行，没有非运行的夜间时段。

## 排序与事实

先最高有效Selector分降序，后最近有效研究时间降序，再按Symbol稳定字典序。无有效分数的组全部排在有分数组之后，再按时间、Symbol排序。不调用模型评分、不修改评分公式，不将分数描述成概率或收益。不将多次研究解读为增强。

出现次数指有效研究，不计仅入选但未成功完成研究的尝试；失败/无效尝试在槽的unavailableResearchCount中体现。事实数据始终保留各自原Run的时间，展开项链接既有币种详情，可逐小时核对Evidence。

## 公开边界

新增聚合只包含明确业务元数据、有限枚举、数值、同一快照指标和RunId。不会复制原始input、Prompt、rawResponse、providerHeaders、诊断、日志、私有路径、凭据或Outbox。旧认证/公开路由/运行中详情拒绝机制不变，公开页面对运行中槽只展示状态。既有1MiB响应体和文件体积保护不放宽。
