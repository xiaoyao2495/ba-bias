# BA_BIAS_ANALYST_V3_LIVE_PROBE_V1_RESULTS

状态：BLOCKED_CAUSAL_AVAILABILITY。计划10，严格合格0，真实调用0；没有模型响应、有效方向或研究质量评分。396条是排除审计记录，不是396个提交样本，也不是396次模型失败。

冻结选择清单：[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/selected_samples.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/selected_samples.json)。完整396条逐来源retrievedAt、原评价时间、delay、Facts路径及SHA-256：[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/sample_inventory.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/sample_inventory.json)。

## 代表性时点证据

hourly_20261010_1200|ASTERUSDT|1791604815949；评价时间 `2026-10-10T04:00:15.949Z`；原Facts [data/runs/hourly_20261010_1200/facts/ASTERUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/ASTERUSDT.json)。

| 来源 | 原采集时间ms | 相对评价时间ms | 可见性结论 |
|---|---:|---:|---|
| exchange | 1791604813680 | -2269 | ACQUIRED_BY_EVALUATION |
| ticker | 1791604814628 | -1321 | ACQUIRED_BY_EVALUATION |
| hour | 1791604831778 | 15829 | NOT_PROVEN_AVAILABLE_AT_EVALUATION |
| five | 1791604832436 | 16487 | NOT_PROVEN_AVAILABLE_AT_EVALUATION |
| oi | 1791604832679 | 16730 | NOT_PROVEN_AVAILABLE_AT_EVALUATION |
| funding | 1791604833826 | 17877 | NOT_PROVEN_AVAILABLE_AT_EVALUATION |
| accounts | 1791604834300 | 18351 | NOT_PROVEN_AVAILABLE_AT_EVALUATION |

采集晚于评价时间不是证明API此前未发布该数据，而是现有档案不能证明此前可得；按B5不得擅自假定可得。不能仅依据K线结束时间、结算时间或统计样本时间忽略发布/采集时间。

## 按Run汇总

| Run | 原始Facts数 | 完整可见性通过 |
|---|---:|---:|
| hourly_20261010_1200 | 24 | 0 |
| hourly_20261010_1300 | 24 | 0 |
| hourly_20261010_1400 | 24 | 0 |
| hourly_20261010_1500 | 24 | 0 |
| hourly_20261010_1600 | 24 | 0 |
| hourly_20261010_1700 | 24 | 0 |
| hourly_20261010_2000 | 24 | 0 |
| hourly_20261010_2100 | 63 | 0 |
| hourly_20261010_2200 | 63 | 0 |
| hourly_acceptance_scan_20261010 | 24 | 0 |
| live_v1_20261010 | 20 | 0 |
| live_v1_verified_20261010 | 24 | 0 |
| once_2026101010 | 10 | 0 |
| scan_2026101010 | 24 | 0 |

## 未执行字段

firstResponseStatus=NOT_ATTEMPTED；firstSchemaStatus=NOT_TESTED；firstFullValidationStatus=NOT_TESTED；recoveryAttempts=0；finalStatus=EXCLUDED_CAUSAL_AVAILABILITY；finalDirection/finalHorizon/finalConviction/tradeOpportunity/marketThesis/invalidation=null；supportingEvidenceIds/conflictingEvidenceIds无模型输出；qualityReview=NOT_TESTED；requestCount=0；tokenUsage=null；estimatedCost=null；不存在响应文件。不得把这些排除记录转换为NO_EDGE或FINAL_INVALID。
