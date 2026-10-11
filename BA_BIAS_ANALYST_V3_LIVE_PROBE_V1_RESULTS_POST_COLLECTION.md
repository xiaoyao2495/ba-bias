# BA_BIAS_ANALYST_V3_LIVE_PROBE_V1_RESULTS — POST_COLLECTION_HISTORICAL_RESEARCH

causalBacktestEligible=false；仅真实生成合同和研究质量联调，不计因果回测、胜率、MFE/MAE或生产绩效。

| Symbol | 原Run | 请求 | 首次Schema/完整 | 最终 | 有效方向 |
|---|---|---:|---|---|---|
| CAPUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| KAIAUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| XPLUSDT | hourly_20261010_1300 | 3 | PASS / FAIL | RECOVERY_2_VALID | BULLISH |
| BATUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| MINAUSDT | hourly_20261010_1200 | 2 | PASS / FAIL | RECOVERY_1_VALID | BULLISH |
| XLMUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| OGNUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| MAGICUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| INJUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |
| RAYSOLUSDT | hourly_20261010_1200 | 3 | PASS / FAIL | FINAL_INVALID | — |

## CAPUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_CAPUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:23.632Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/CAPUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json)；Evidence数：23；场景：`PRICE_UP_OI_EXPANSION, DRAWDOWN, MULTI_WINDOW_CONFLICT, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 59046, "completion_tokens": 2029, "total_tokens": 61075}`；estimatedCost：null（无核实单价）。
- 归因：首次省略背景指标名导致数字未绑定；恢复改ID后仍因followUp中的“支付方向”被拒绝。输入及文字已有funding.latest引用，但未明确说多头/空头支付关系；guard要求具体支付方向字符串。这是Funding合同遵循缺陷及通用短语触发边界，不是伪造费率或支付方向被证明反了。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:50:04.833Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, FUNDING_DIRECTION_MUST_USE_EVIDENCE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_CAPUSDT_a1_5c70e1d7-2db2-43a1-8de4-9293161aaf82.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_CAPUSDT_a1_5c70e1d7-2db2-43a1-8de4-9293161aaf82.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_CAPUSDT_a1_5c70e1d7-2db2-43a1-8de4-9293161aaf82.json) |
| 2 | 2026-10-10T18:50:08.677Z | INVALID | FUNDING_DIRECTION_MUST_USE_EVIDENCE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_CAPUSDT_a2_79be2dec-f193-49da-9b56-f4b49c55f75d.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_CAPUSDT_a2_79be2dec-f193-49da-9b56-f4b49c55f75d.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_CAPUSDT_a2_79be2dec-f193-49da-9b56-f4b49c55f75d.json) |
| 3 | 2026-10-10T18:50:11.937Z | INVALID | FUNDING_DIRECTION_MUST_USE_EVIDENCE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_CAPUSDT_a3_5b76ef42-75a4-4b3f-833f-8026567a75bf.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_CAPUSDT_a3_5b76ef42-75a4-4b3f-833f-8026567a75bf.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_CAPUSDT_a3_5b76ef42-75a4-4b3f-833f-8026567a75bf.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## KAIAUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_KAIAUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:19.107Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/KAIAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/KAIAUSDT.json)；Evidence数：23；场景：`PRICE_DOWN_OI_EXPANSION, FUNDING_ABNORMAL, DRAWDOWN, MULTI_WINDOW_CONFLICT, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 60332, "completion_tokens": 2121, "total_tokens": 62453}`；estimatedCost：null（无核实单价）。
- 归因：恢复补齐24h价格ID，解除数字绑定错误；“OI变化不指示单侧加仓或资金流向”“具体开平仓行为无法区分”持续被标为确定性因果。原文是限制性表述，有明确误拒疑点；正式仍失败，未放行。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:50:15.077Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_KAIAUSDT_a1_ef927295-ac0b-4db2-b395-7e6a7a7e82a7.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_KAIAUSDT_a1_ef927295-ac0b-4db2-b395-7e6a7a7e82a7.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_KAIAUSDT_a1_ef927295-ac0b-4db2-b395-7e6a7a7e82a7.json) |
| 2 | 2026-10-10T18:50:18.669Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_KAIAUSDT_a2_de7fe9c5-09c2-4039-8e81-73921ebc4f14.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_KAIAUSDT_a2_de7fe9c5-09c2-4039-8e81-73921ebc4f14.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_KAIAUSDT_a2_de7fe9c5-09c2-4039-8e81-73921ebc4f14.json) |
| 3 | 2026-10-10T18:50:22.176Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_KAIAUSDT_a3_32cffd2f-8f32-4c0d-b8ff-b6b68ac08d81.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_KAIAUSDT_a3_32cffd2f-8f32-4c0d-b8ff-b6b68ac08d81.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_KAIAUSDT_a3_32cffd2f-8f32-4c0d-b8ff-b6b68ac08d81.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## XPLUSDT / hourly_20261010_1300

- sampleId：`hourly_20261010_1300_XPLUSDT_2026-10-10T05:00:16.899Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T05:00:16.899Z`；originalEvaluationTime：`2026-10-10T05:00:16.899Z`；collectionCompletedAt：`2026-10-10T05:00:41.249Z`。
- Facts：[data/runs/hourly_20261010_1300/facts/XPLUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1300/facts/XPLUSDT.json)；Evidence数：23；场景：`PRICE_UP_OI_CONTRACTION, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`RECOVERY_2_VALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`BULLISH/4h/LOW/WAIT_FOR_PULLBACK`。
- Token usage：`{"prompt_tokens": 55513, "completion_tokens": 1880, "total_tokens": 57393}`；estimatedCost：null（无核实单价）。
- 归因：首次正文字面0.17%与负OI绑定失败，且提出未经Registry结构定义的近期低点；恢复去掉数字及“跌破”用词，最后机制改为可能的敞口缩减，第三次通过。preferredScenario仍保留“回踩不破近期已收盘区间下沿”，是独立质量疑点而非完全干净的结构表达。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:50:25.571Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1300_XPLUSDT_a1_a35b05a0-6fd2-4b53-8ade-2dd0d4a0b3a2.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1300_XPLUSDT_a1_a35b05a0-6fd2-4b53-8ade-2dd0d4a0b3a2.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1300_XPLUSDT_a1_a35b05a0-6fd2-4b53-8ade-2dd0d4a0b3a2.json) |
| 2 | 2026-10-10T18:50:29.088Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1300_XPLUSDT_a2_c4c782fe-ac31-494b-9fd4-a124f2feccfd.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1300_XPLUSDT_a2_c4c782fe-ac31-494b-9fd4-a124f2feccfd.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1300_XPLUSDT_a2_c4c782fe-ac31-494b-9fd4-a124f2feccfd.json) |
| 3 | 2026-10-10T18:50:32.015Z | RECOVERY_2_VALID | 无 | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1300_XPLUSDT_a3_1a2f82c2-2194-4b35-85a5-161b383fab32.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1300_XPLUSDT_a3_1a2f82c2-2194-4b35-85a5-161b383fab32.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1300_XPLUSDT_a3_1a2f82c2-2194-4b35-85a5-161b383fab32.json) |

正式最终模型字段（未修改）：

```json
{
  "version": "DIRECTIONAL_ANALYST_V2",
  "symbol": "XPLUSDT",
  "evaluationTime": "2026-10-10T05:00:16.899Z",
  "marketBias": "BULLISH",
  "horizon": "4h",
  "horizonReason": "4h已收盘价格变化为正且此前等长4h窗口亦为正，方向连续；同期4h OI数量变化为小幅收缩，故以4h为研究期限，1h与24h仅作背景。",
  "conviction": "LOW",
  "marketThesis": "未来4h倾向温和偏多延续：4h与24h已收盘价格变化均为正，但同期OI数量收缩、1h量能低于前24根均值，缺乏扩张确认，故仅低强度假设。",
  "marketMechanism": "4h价格上行同时OI数量小幅收缩，该统计组合与部分空头敞口缩减或多头敞口缩减的可能性相容，但无法区分具体行为；OI增加本身也不构成单侧加仓证据。",
  "supportingEvidenceIds": [
    "XPLUSDT:price.closed4h",
    "XPLUSDT:directional.price.previous4h",
    "XPLUSDT:price.closed24h",
    "XPLUSDT:price.closed1h",
    "XPLUSDT:oi.4h"
  ],
  "conflictingEvidenceIds": [
    "XPLUSDT:oi.1h",
    "XPLUSDT:oi.24h",
    "XPLUSDT:volume.relative1h",
    "XPLUSDT:price.drawdown",
    "XPLUSDT:global.short.change1h"
  ],
  "tradeOpportunity": "WAIT_FOR_PULLBACK",
  "preferredScenario": "4h内价格在已收盘正变化基础上维持偏强整理，回踩不破近期已收盘区间下沿后再度尝试上行；OI数量若由收缩转为温和扩张则延续假设增强。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_4h",
      "OI_REVERSED_4h"
    ],
    "description": "后续新收盘滚动4h价格变化≤-1.0000%（PRICE_OPPOSITE_4h）则方向命题失效；若新采样4h OI数量变化≥5.0000%（OI_REVERSED_4h）仅触发复核，不自动失效。"
  },
  "alternativeScenario": "若4h价格转跌且OI数量同步扩张，或1h量能持续低于前24根均值并伴随价格走弱，则偏多延续假设让位于下行竞争情景，需重新评估。",
  "followUpChecks": [
    "核对下一根已收盘4h价格变化是否维持正值，并同步观察4h OI数量变化方向。",
    "跟踪1h成交量相对前24根均值倍数能否回升至1倍以上，以判断参与度是否配合。"
  ]
}
```

独立qualityReview：[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/quality_review/XPLUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/quality_review/XPLUSDT.json)；未写回任何生产状态。

## BATUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_BATUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:24.938Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/BATUSDT.json)；Evidence数：23；场景：`PRICE_DOWN_OI_CONTRACTION, MULTI_WINDOW_CONFLICT`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 53439, "completion_tokens": 1655, "total_tokens": 55094}`；estimatedCost：null（无核实单价）。
- 归因：首次并列1h/4h百分比被绑定错窗口；恢复使用ID后数字问题解除。“无法区分具体开平仓行为”和“不设结构失效”仍被语义guard拒绝，二者并非肯定交易行为或声称存在结构。NO_EDGE有真实短长周期相反依据。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:50:34.868Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_BATUSDT_a1_cf72980e-f95b-48c5-90c4-bcafe78594b3.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_BATUSDT_a1_cf72980e-f95b-48c5-90c4-bcafe78594b3.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_BATUSDT_a1_cf72980e-f95b-48c5-90c4-bcafe78594b3.json) |
| 2 | 2026-10-10T18:50:38.172Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_BATUSDT_a2_17f3f327-c0da-4df3-ae1d-a27a8495beef.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_BATUSDT_a2_17f3f327-c0da-4df3-ae1d-a27a8495beef.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_BATUSDT_a2_17f3f327-c0da-4df3-ae1d-a27a8495beef.json) |
| 3 | 2026-10-10T18:50:40.711Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_BATUSDT_a3_c5d7d73c-a578-4ffb-b586-34337253afa2.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_BATUSDT_a3_c5d7d73c-a578-4ffb-b586-34337253afa2.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_BATUSDT_a3_c5d7d73c-a578-4ffb-b586-34337253afa2.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## MINAUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_MINAUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:21.349Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/MINAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MINAUSDT.json)；Evidence数：23；场景：`PRICE_UP_OI_EXPANSION, FUNDING_ABNORMAL, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：1；finalStatus：`RECOVERY_1_VALID`；requestCount：2。
- 最终有效方向/周期/强度/交易机会：`BULLISH/4h/LOW/WAIT_FOR_PULLBACK`。
- Token usage：`{"prompt_tokens": 34671, "completion_tokens": 1366, "total_tokens": 36037}`；estimatedCost：null（无核实单价）。
- 归因：首次“跌破此前等长4h低点区域”因未提供价格结构被拒；恢复改为“回落至此前等长4h区间下沿”后通过，语义仍引用未定义区间边界。数字/方向假设合格不等于结构描述已可复核；质量保留UNCERTAIN。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:50:43.749Z | INVALID | UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MINAUSDT_a1_9f72066d-d774-4799-a3f1-354aff4d6817.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MINAUSDT_a1_9f72066d-d774-4799-a3f1-354aff4d6817.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MINAUSDT_a1_9f72066d-d774-4799-a3f1-354aff4d6817.json) |
| 2 | 2026-10-10T18:50:47.513Z | RECOVERY_1_VALID | 无 | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MINAUSDT_a2_a4295257-d59d-48d7-8fa2-4e10f1b81472.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MINAUSDT_a2_a4295257-d59d-48d7-8fa2-4e10f1b81472.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MINAUSDT_a2_a4295257-d59d-48d7-8fa2-4e10f1b81472.json) |

正式最终模型字段（未修改）：

```json
{
  "version": "DIRECTIONAL_ANALYST_V2",
  "symbol": "MINAUSDT",
  "evaluationTime": "2026-10-10T04:00:15.949Z",
  "marketBias": "BULLISH",
  "horizon": "4h",
  "horizonReason": "选4h：已收盘4h价格变化9.75%（MINAUSDT:price.closed4h）与同期OI数量变化+1.24%（MINAUSDT:oi.4h）同向扩张，此前等长4h为-0.40%（MINAUSDT:directional.price.previous4h），而1h OI收缩-0.89%（MINAUSDT:oi.1h）使短周期证据较弱。",
  "conviction": "LOW",
  "marketThesis": "未来4h倾向为上行延续假设：4h价格与OI数量同向扩张，已结算Funding为负（空头支付多头）不构成多头拥挤证据；但1h OI收缩、24h区间高点回撤-1.02%及缺乏主动买卖量数据限制强度，故仅低置信。",
  "marketMechanism": "4h价格+9.75%与同期OI数量+1.24%的组合与合约规模温和扩张相容，无法区分新增多空敞口方向；1h价格+4.22%伴随OI数量-0.89%，与部分多头敞口了结的可能性相容，均不能确认具体开平仓行为。",
  "supportingEvidenceIds": [
    "MINAUSDT:price.closed4h",
    "MINAUSDT:oi.4h",
    "MINAUSDT:price.closed1h",
    "MINAUSDT:funding.latest",
    "MINAUSDT:funding.sum24h",
    "MINAUSDT:volume.relative1h"
  ],
  "conflictingEvidenceIds": [
    "MINAUSDT:oi.1h",
    "MINAUSDT:price.drawdown",
    "MINAUSDT:price.rangeLowHigh"
  ],
  "tradeOpportunity": "WAIT_FOR_PULLBACK",
  "preferredScenario": "4h内价格在已收盘4h涨幅9.75%后维持高位整理，OI数量不出现明显收缩，则上行延续假设保持有效；若回撤不伴随OI数量大幅下降，视为整理而非方向失效。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_4h",
      "OI_REVERSED_4h"
    ],
    "description": "后续新收盘滚动4h价格变化≤-4.8729%触发方向命题失效；后续新采样4h OI数量变化≤-5.0000%仅触发复核，不自动失效。"
  },
  "alternativeScenario": "若4h OI数量转为明显收缩且价格回落至此前等长4h区间下沿，则上行延续假设被削弱，需转向评估下行风险；当前1h OI收缩-0.89%是该情景的早期观察线索。",
  "followUpChecks": [
    "核对下一根已收盘4h价格变化与同期OI数量变化是否仍同向扩张。",
    "观察1h OI数量是否由-0.89%转为扩张，以判断短周期敞口变化是否与4h方向一致。"
  ]
}
```

独立qualityReview：[validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/quality_review/MINAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/quality_review/MINAUSDT.json)；未写回任何生产状态。

## XLMUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_XLMUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:37.553Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/XLMUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/XLMUSDT.json)；Evidence数：24；场景：`PRICE_UP_OI_EXPANSION, ACCOUNT_CHANGE_OR_FLIP, MULTI_WINDOW_CONFLICT, REAL_PRICE_TURN, LOW_DISPLACEMENT`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 65486, "completion_tokens": 2504, "total_tokens": 67990}`；estimatedCost：null（无核实单价）。
- 归因：此前24h价格-2.21%紧接OI叙述，被numeric guard识别为OI，三次持续。模型提供了真实此前price ID，不能把这一错误码直接称为虚构OI。“具体开平仓行为无法确认”仍被误识别为肯定。首次另造未来成交量2倍观察阈值，输入不存在对应程序rule，恢复删除该阈值；NO_EDGE有弱变化、周期冲突及低量依据。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:50:51.220Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_XLMUSDT_a1_7655a3b4-8726-44cc-8a31-e1e12c236756.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_XLMUSDT_a1_7655a3b4-8726-44cc-8a31-e1e12c236756.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_XLMUSDT_a1_7655a3b4-8726-44cc-8a31-e1e12c236756.json) |
| 2 | 2026-10-10T18:50:55.504Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_XLMUSDT_a2_f0d2b147-528f-4055-8055-802cc3aae1e8.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_XLMUSDT_a2_f0d2b147-528f-4055-8055-802cc3aae1e8.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_XLMUSDT_a2_f0d2b147-528f-4055-8055-802cc3aae1e8.json) |
| 3 | 2026-10-10T18:50:59.197Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_XLMUSDT_a3_d8f1467c-188f-47fa-8dd0-73c4aa6e0302.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_XLMUSDT_a3_d8f1467c-188f-47fa-8dd0-73c4aa6e0302.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_XLMUSDT_a3_d8f1467c-188f-47fa-8dd0-73c4aa6e0302.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## OGNUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_OGNUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:28.198Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/OGNUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/OGNUSDT.json)；Evidence数：23；场景：`PRICE_DOWN_OI_CONTRACTION, DRAWDOWN, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 58864, "completion_tokens": 2233, "total_tokens": 61097}`；estimatedCost：null（无核实单价）。
- 归因：价格/OI收缩的可能机制合理限定，但三次“无法区分具体开平仓行为”持续被因果guard拒绝；没有将该否定文本当成已验证的单侧平仓。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:51:02.924Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_OGNUSDT_a1_5efedb28-25e1-4fcc-ac5e-406d48397e1e.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_OGNUSDT_a1_5efedb28-25e1-4fcc-ac5e-406d48397e1e.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_OGNUSDT_a1_5efedb28-25e1-4fcc-ac5e-406d48397e1e.json) |
| 2 | 2026-10-10T18:51:07.051Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_OGNUSDT_a2_ca5eef06-ed32-4400-a150-123755930f73.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_OGNUSDT_a2_ca5eef06-ed32-4400-a150-123755930f73.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_OGNUSDT_a2_ca5eef06-ed32-4400-a150-123755930f73.json) |
| 3 | 2026-10-10T18:51:10.488Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_OGNUSDT_a3_ad59c738-2cd7-4e7a-8f15-e21c9a86b86e.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_OGNUSDT_a3_ad59c738-2cd7-4e7a-8f15-e21c9a86b86e.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_OGNUSDT_a3_ad59c738-2cd7-4e7a-8f15-e21c9a86b86e.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## MAGICUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_MAGICUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:18.985Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MAGICUSDT.json)；Evidence数：23；场景：`PRICE_UP_OI_EXPANSION, MULTI_WINDOW_CONFLICT, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 59925, "completion_tokens": 2115, "total_tokens": 62040}`；estimatedCost：null（无核实单价）。
- 归因：首次1h背景价格未显式绑定指标而失败，恢复移除数字后解除；三次“具体开平仓方向无法区分”持续拒绝。价格/扩张/OI方向引用均有来源，不能按关键词说模型宣称了单侧开仓。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:51:13.792Z | INVALID | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MAGICUSDT_a1_149eae8d-2942-4cab-b92e-d7ed6d24b06c.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MAGICUSDT_a1_149eae8d-2942-4cab-b92e-d7ed6d24b06c.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MAGICUSDT_a1_149eae8d-2942-4cab-b92e-d7ed6d24b06c.json) |
| 2 | 2026-10-10T18:51:18.082Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MAGICUSDT_a2_77b659d8-c920-49e9-ad04-bf539dfeb1fd.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MAGICUSDT_a2_77b659d8-c920-49e9-ad04-bf539dfeb1fd.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MAGICUSDT_a2_77b659d8-c920-49e9-ad04-bf539dfeb1fd.json) |
| 3 | 2026-10-10T18:51:21.361Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MAGICUSDT_a3_99f280e9-116e-4910-b26f-291fc792497f.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MAGICUSDT_a3_99f280e9-116e-4910-b26f-291fc792497f.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MAGICUSDT_a3_99f280e9-116e-4910-b26f-291fc792497f.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## INJUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_INJUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:34.518Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/INJUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/INJUSDT.json)；Evidence数：23；场景：`PRICE_UP_OI_EXPANSION, REAL_PRICE_TURN`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 59992, "completion_tokens": 2240, "total_tokens": 62232}`；estimatedCost：null（无核实单价）。
- 归因：“无法区分具体开平仓方向”持续拒绝；24h价格上行/OI下降的可能回补解释被当前主horizon=4h的机制绑定约束拦截，第三次改了结仍留否定拒绝。属于跨周期机制合同边界与否定解析问题，不可把所有拒绝当作实际虚假因果。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:51:24.639Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_INJUSDT_a1_d7a2f9d8-7d01-4030-b3eb-0d8adc0f8ba9.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_INJUSDT_a1_d7a2f9d8-7d01-4030-b3eb-0d8adc0f8ba9.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_INJUSDT_a1_d7a2f9d8-7d01-4030-b3eb-0d8adc0f8ba9.json) |
| 2 | 2026-10-10T18:51:28.549Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_INJUSDT_a2_299e656b-be34-4fc2-b1e1-a72ab28e1844.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_INJUSDT_a2_299e656b-be34-4fc2-b1e1-a72ab28e1844.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_INJUSDT_a2_299e656b-be34-4fc2-b1e1-a72ab28e1844.json) |
| 3 | 2026-10-10T18:51:31.892Z | INVALID | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_INJUSDT_a3_4f935347-2406-495d-996c-a5fed6dd358a.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_INJUSDT_a3_4f935347-2406-495d-996c-a5fed6dd358a.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_INJUSDT_a3_4f935347-2406-495d-996c-a5fed6dd358a.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。

## RAYSOLUSDT / hourly_20261010_1200

- sampleId：`hourly_20261010_1200_RAYSOLUSDT_2026-10-10T04:00:15.949Z`；probeMode：`POST_COLLECTION_HISTORICAL_RESEARCH`；causalBacktestEligible：false。
- 原evaluationTime：`2026-10-10T04:00:15.949Z`；originalEvaluationTime：`2026-10-10T04:00:15.949Z`；collectionCompletedAt：`2026-10-10T04:00:36.464Z`。
- Facts：[data/runs/hourly_20261010_1200/facts/RAYSOLUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/RAYSOLUSDT.json)；Evidence数：23；场景：`PRICE_DOWN_OI_CONTRACTION, REAL_PRICE_TURN, LOW_DISPLACEMENT`。
- firstResponseStatus：VALID_API_RESPONSE；firstSchemaStatus：PASS；firstFullValidationStatus：FAIL。
- recoveryAttempts：2；finalStatus：`FINAL_INVALID`；requestCount：3。
- 最终有效方向/周期/强度/交易机会：`null（不将失败原输出转为NO_EDGE）`。
- Token usage：`{"prompt_tokens": 57106, "completion_tokens": 2033, "total_tokens": 59139}`；estimatedCost：null（无核实单价）。
- 归因：首次并列1h/4h数字被错误窗口绑定，恢复移除数字后解除；drawdown末点为快照时间，比已收盘24h价末点晚9468ms，放进同窗口support违反精确对齐，三次未修；“无法区分具体开平仓行为”亦持续拒绝。

| attempt | researchExecutedAt | 状态 | 完整错误 | 请求 | 原始响应 | 正式验证 |
|---|---|---|---|---|---|---|
| 1 | 2026-10-10T18:51:35.437Z | INVALID | SUPPORT_SAMPLES_NOT_ALIGNED, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_RAYSOLUSDT_a1_ca0e8bd5-f082-49f0-aa83-0f3688e47b97.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_RAYSOLUSDT_a1_ca0e8bd5-f082-49f0-aa83-0f3688e47b97.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_RAYSOLUSDT_a1_ca0e8bd5-f082-49f0-aa83-0f3688e47b97.json) |
| 2 | 2026-10-10T18:51:39.292Z | INVALID | SUPPORT_SAMPLES_NOT_ALIGNED, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_RAYSOLUSDT_a2_79fcc81c-79cc-4599-afcf-42d9d658e682.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_RAYSOLUSDT_a2_79fcc81c-79cc-4599-afcf-42d9d658e682.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_RAYSOLUSDT_a2_79fcc81c-79cc-4599-afcf-42d9d658e682.json) |
| 3 | 2026-10-10T18:51:42.382Z | INVALID | SUPPORT_SAMPLES_NOT_ALIGNED, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_RAYSOLUSDT_a3_81ebca81-e0e9-45e8-b1b5-f4671d6e2a28.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_RAYSOLUSDT_a3_81ebca81-e0e9-45e8-b1b5-f4671d6e2a28.json) | [验证](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_RAYSOLUSDT_a3_81ebca81-e0e9-45e8-b1b5-f4671d6e2a28.json) |

qualityReview：NOT_APPLICABLE_TO_VALIDATED_OUTPUT；原失败方向/正文保留于响应，未作为有效案例评分。
