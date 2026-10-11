# BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN_RESULTS

**V4_PROBE_PASSED — POST_COLLECTION_HISTORICAL_RESEARCH — causalBacktestEligible=false**

| Batch | Symbol | Run | 首次完整 | 最终状态 | 方向 / horizon / conviction | 请求数 |
|---|---|---|---|---|---|---|
| A | PIXELUSDT | hourly_20261010_1200 | FAIL | RECOVERY_1_VALID | BEARISH_REVERSAL / 1h / LOW | 2 |
| A | SENTUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| A | JCTUSDT | hourly_20261010_1400 | PASS | FIRST_PASS_VALID | BULLISH / 1h / LOW | 1 |
| A | USUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| A | RLCUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| B | MINAUSDT | hourly_20261010_1300 | PASS | FIRST_PASS_VALID | BULLISH / 1h / MODERATE | 1 |
| B | BRUSDT | hourly_20261010_1300 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| B | ZKUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| B | XAIUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BULLISH / 1h / HIGH | 1 |
| B | XMRUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |

## 统计

```json
{
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "plannedSamples": 10,
  "executedSamples": 10,
  "completedFirstResponses": 10,
  "firstJsonParseable": 10,
  "firstSchemaValid": 10,
  "firstFullValid": 9,
  "recovery1Valid": 1,
  "recovery2Valid": 0,
  "finalValid": 10,
  "finalFailed": 0,
  "notExecuted": 0,
  "physicalRequests": 11,
  "conservativeBudgetReservations": 11,
  "apiErrors": 0,
  "validDirectionDistribution": {
    "BULLISH": 3,
    "BEARISH": 6,
    "BULLISH_REVERSAL": 0,
    "BEARISH_REVERSAL": 1,
    "NO_EDGE": 0
  },
  "invalidResponseDirections": [
    {
      "sampleId": "s_hourly_20261010_1200_PIXELUSDT",
      "attempt": 1,
      "direction": "BEARISH_REVERSAL",
      "errors": [
        "MECHANISM_SIGN_MISMATCH"
      ]
    }
  ],
  "tokenUsage": {
    "prompt_tokens": 69000,
    "completion_tokens": 5707,
    "total_tokens": 74707,
    "prompt_cache_hit_tokens": 12800,
    "prompt_cache_miss_tokens": 56200
  },
  "cost": null,
  "costReason": "No billed cost field captured; no guessed pricing.",
  "validationErrors": {
    "MECHANISM_SIGN_MISMATCH": 1
  },
  "batchGate": {
    "ok": true,
    "errors": [],
    "reviewedSamples": 5,
    "reviewedAttempts": 6,
    "review": "Independent original-Facts rebuild and source/renderer audit, full guard preserved, no structure objects supplied, failures never relabelled NO_EDGE; subjective quality separately recorded.",
    "at": "2026-10-10T20:54:23.141Z",
    "integrity": {
      "protectedFiles": 2567,
      "productionFiles": 2103,
      "changed": [],
      "newData": []
    },
    "budget": {
      "transportAttempts": 6,
      "livePhysicalRequests": 6,
      "mockCalls": 0
    },
    "binanceRequests": 0,
    "dingTalkRequests": 0,
    "scannerStarted": false
  },
  "stopReason": null
}
```

## 所有真实请求

| Symbol | Attempt | 本地UUID | Schema | Full | Errors | Raw |
|---|---|---|---|---|---|---|
| PIXELUSDT | 1 | c806c048-99f5-4995-ba9b-d0213b0f2c14 | True | False | MECHANISM_SIGN_MISMATCH | [c806c048-99f5-4995-ba9b-d0213b0f2c14.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/c806c048-99f5-4995-ba9b-d0213b0f2c14.json) |
| PIXELUSDT | 2 | a3cad1d7-f5c8-46c7-b7a2-8e79b035532f | True | True | NONE | [a3cad1d7-f5c8-46c7-b7a2-8e79b035532f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/a3cad1d7-f5c8-46c7-b7a2-8e79b035532f.json) |
| SENTUSDT | 1 | 4ca8536e-45db-4901-8e4c-e5efc35da207 | True | True | NONE | [4ca8536e-45db-4901-8e4c-e5efc35da207.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/4ca8536e-45db-4901-8e4c-e5efc35da207.json) |
| JCTUSDT | 1 | e6f42b05-540d-4ae7-9779-fcc65e25b927 | True | True | NONE | [e6f42b05-540d-4ae7-9779-fcc65e25b927.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/e6f42b05-540d-4ae7-9779-fcc65e25b927.json) |
| USUSDT | 1 | 9d3a9b1b-18aa-433f-85f3-8336b984f5bf | True | True | NONE | [9d3a9b1b-18aa-433f-85f3-8336b984f5bf.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/9d3a9b1b-18aa-433f-85f3-8336b984f5bf.json) |
| RLCUSDT | 1 | f730ba23-2844-4333-ae3a-e38b68d3b629 | True | True | NONE | [f730ba23-2844-4333-ae3a-e38b68d3b629.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/f730ba23-2844-4333-ae3a-e38b68d3b629.json) |
| MINAUSDT | 1 | 09c4ca35-ad73-4aca-8a3f-987369bf1242 | True | True | NONE | [09c4ca35-ad73-4aca-8a3f-987369bf1242.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/09c4ca35-ad73-4aca-8a3f-987369bf1242.json) |
| BRUSDT | 1 | 8bd06ce4-6bd7-49ca-9989-c569d88518a3 | True | True | NONE | [8bd06ce4-6bd7-49ca-9989-c569d88518a3.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/8bd06ce4-6bd7-49ca-9989-c569d88518a3.json) |
| ZKUSDT | 1 | f1061d96-57e9-4401-86ad-e30b124eec2e | True | True | NONE | [f1061d96-57e9-4401-86ad-e30b124eec2e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/f1061d96-57e9-4401-86ad-e30b124eec2e.json) |
| XAIUSDT | 1 | 4d991ca6-201d-4b6d-90b0-de54fc292bdd | True | True | NONE | [4d991ca6-201d-4b6d-90b0-de54fc292bdd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/4d991ca6-201d-4b6d-90b0-de54fc292bdd.json) |
| XMRUSDT | 1 | a63a0667-ffed-40fd-8efe-d70cad8d220c | True | True | NONE | [a63a0667-ffed-40fd-8efe-d70cad8d220c.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/a63a0667-ffed-40fd-8efe-d70cad8d220c.json) |

来源、所有尝试（含失败原文）、完整验证及Renderer审计分别在provenance/raw_responses/validation/rendered/quality_review中，wx不可覆盖保存。API实际成功返回，精确HTTP状态及服务端HTTP requestId未暴露，不伪造。

## s_hourly_20261010_1200_PIXELUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_PIXELUSDT",
  "symbol": "PIXELUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/PIXELUSDT.json",
  "factsHash": "73fdb00e1af5c44a87d8b06fea973eb5deae56588a6587a512d08d249a8834fa",
  "collectionCompletedAt": "2026-10-10T04:00:21.024Z",
  "researchExecutedAt": "2026-10-10T20:54:10.729Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "a3cad1d7-f5c8-46c7-b7a2-8e79b035532f",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "a38656a4-b8a1-4258-bb55-f161b57f0e64",
    "requestedAt": "2026-10-10T20:54:10.729Z",
    "receivedAt": "2026-10-10T20:54:12.626Z",
    "requestHash": "521c96f78d708f2c5ffab245adf01491671a88258156aa5fd2b5dea7ee5741fd",
    "responseHash": "a68826a119fb153fa15131852c90e80895260c94b762794cc273a595a136df51",
    "inputHash": "75e1168b24becdb021a4092ff3b3e01d6d1c640ec3d8a71f74f31a057467692e"
  },
  "requestIds": [
    "c806c048-99f5-4995-ba9b-d0213b0f2c14",
    "a3cad1d7-f5c8-46c7-b7a2-8e79b035532f"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": false,
  "recoveryAttempts": 1,
  "finalStatus": "RECOVERY_1_VALID",
  "finalDirection": "BEARISH_REVERSAL",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "PIXELUSDT:price.closed1h",
    "PIXELUSDT:directional.price.previous1h",
    "PIXELUSDT:oi.1h",
    "PIXELUSDT:volume.relative1h",
    "PIXELUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "PIXELUSDT:price.closed4h",
    "PIXELUSDT:price.closed24h",
    "PIXELUSDT:oi.4h",
    "PIXELUSDT:oi.24h"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_EXPANSION_COMPATIBLE",
    "evidenceIds": [
      "PIXELUSDT:price.closed1h",
      "PIXELUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "TURN",
    "evidenceIds": [
      "PIXELUSDT:price.closed1h",
      "PIXELUSDT:directional.price.previous1h",
      "PIXELUSDT:oi.1h",
      "PIXELUSDT:volume.relative1h",
      "PIXELUSDT:price.drawdown",
      "PIXELUSDT:price.closed4h",
      "PIXELUSDT:price.closed24h"
    ],
    "alternative": "OPPOSITE_MOVE",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    },
    {
      "conditionType": "ABSTRACT_REASSESSMENT",
      "metricOrStructureEvidenceId": "PIXELUSDT:volume.relative1h",
      "interpretation": "MONITOR_CHANGE",
      "consequence": "REASSESS_ONLY"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: PIXELUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -4.59125112 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -4.59%",
        "evidenceId": "PIXELUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-4.59125112",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "PIXELUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: PIXELUSDT:directional.price.previous1h | PREVIOUS_PRICE_CHANGE | 9.05424200 % | window=1h | observedAt=2026-10-10T02:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 此前已收盘1小时价格变化 9.05%",
        "evidenceId": "PIXELUSDT:directional.price.previous1h",
        "factsFields": [
          "sources.hour.raw (previous equal-length closed bars: [1] open, [4] close, [0]/[6] times)"
        ],
        "value": "9.05424200",
        "unit": "%",
        "window": "1h",
        "scope": "PREVIOUS_PRICE_WINDOW",
        "dataTimes": [
          1791597600000,
          1791601199999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "PIXELUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(previous equal-length closed window close/open - 1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: PIXELUSDT:oi.1h | OI_QUANTITY_CHANGE | 4.80071215 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 4.80%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "PIXELUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "4.80071215",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "PIXELUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: PIXELUSDT:volume.relative1h | RELATIVE_VOLUME | 5.58621527 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 5.59 倍",
        "evidenceId": "PIXELUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "5.58621527",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791514800000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "PIXELUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: PIXELUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -11.28724672 % | window=24h | observedAt=2026-10-10T04:00:08.690Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -11.29%",
        "evidenceId": "PIXELUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-11.28724672",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791604799999,
          1791604808690
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "PIXELUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: PIXELUSDT:price.closed4h | PRICE_CLOSED_CHANGE | 5.67876819 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 5.68%",
        "evidenceId": "PIXELUSDT:price.closed4h",
        "factsFields": [
          "evidence[4].result",
          "evidence[4].phrase",
          "evidence[4].dataTimes",
          "evidence[4].formula",
          "sources.hour.raw"
        ],
        "value": "5.67876819",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791590400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "PIXELUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: PIXELUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 28.05546046 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 28.06%",
        "evidenceId": "PIXELUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "28.05546046",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "PIXELUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: PIXELUSDT:oi.4h | OI_QUANTITY_CHANGE | 21.39337052 % | window=4h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 4小时OI数量变化 21.39%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "PIXELUSDT:oi.4h",
        "factsFields": [
          "evidence[12].result",
          "evidence[12].phrase",
          "evidence[12].dataTimes",
          "evidence[12].formula",
          "sources.oi.raw"
        ],
        "value": "21.39337052",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791590400000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "PIXELUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: PIXELUSDT:oi.24h | OI_QUANTITY_CHANGE | 82.42719846 % | window=24h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 24小时OI数量变化 82.43%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "PIXELUSDT:oi.24h",
        "factsFields": [
          "evidence[13].result",
          "evidence[13].phrase",
          "evidence[13].dataTimes",
          "evidence[13].formula",
          "sources.oi.raw"
        ],
        "value": "82.42719846",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "PIXELUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 2.29562556,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥2.2956%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "PIXELUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "PIXELUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "LTE",
          "threshold": -5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "PIXELUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "PIXELUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [
        "MECHANISM_SIGN_MISMATCH"
      ],
      "diagnostics": []
    },
    {
      "attempt": 2,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "前一小时+9.054242%、当前-4.591251%，TURN具备真实前后价格转向。4h/24h价格上涨被明确列为冲突，1h OI+4.800712%只支持扩张相容；首次误选收缩机制被拒绝。未来延续下跌仍未知。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6279,
        "completion_tokens": 630,
        "total_tokens": 6909,
        "prompt_tokens_details": {
          "cached_tokens": 0
        },
        "prompt_cache_hit_tokens": 0,
        "prompt_cache_miss_tokens": 6279
      }
    },
    {
      "attempt": 2,
      "usage": {
        "prompt_tokens": 7139,
        "completion_tokens": 631,
        "total_tokens": 7770,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 5859
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/c806c048-99f5-4995-ba9b-d0213b0f2c14.json",
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/a3cad1d7-f5c8-46c7-b7a2-8e79b035532f.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
PIXELUSDT BEARISH_REVERSAL / 1h / LOW
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: PIXELUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -4.59125112 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -4.59%
支持: PIXELUSDT:directional.price.previous1h | PREVIOUS_PRICE_CHANGE | 9.05424200 % | window=1h | observedAt=2026-10-10T02:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 此前已收盘1小时价格变化 9.05%
支持: PIXELUSDT:oi.1h | OI_QUANTITY_CHANGE | 4.80071215 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 4.80%（不代表资金净流入或多空加仓方向）
支持: PIXELUSDT:volume.relative1h | RELATIVE_VOLUME | 5.58621527 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 5.59 倍
支持: PIXELUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -11.28724672 % | window=24h | observedAt=2026-10-10T04:00:08.690Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -11.29%
冲突: PIXELUSDT:price.closed4h | PRICE_CLOSED_CHANGE | 5.67876819 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 5.68%
冲突: PIXELUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 28.05546046 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 28.06%
冲突: PIXELUSDT:oi.4h | OI_QUANTITY_CHANGE | 21.39337052 % | window=4h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 4小时OI数量变化 21.39%（不代表资金净流入或多空加仓方向）
冲突: PIXELUSDT:oi.24h | OI_QUANTITY_CHANGE | 82.42719846 % | window=24h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 24小时OI数量变化 82.43%（不代表资金净流入或多空加仓方向）
机制假设: 与合约规模扩张相容，不确认单侧新增仓位。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 有前期与近期价格证据的条件性转向假设；竞争情景=OPPOSITE_MOVE，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 2.29562556% => INVALIDATED; 后续新收盘滚动1h价格变化≥2.2956%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE LTE -5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
PIXELUSDT:volume.relative1h: 观察变化，仅复核，不自动失效
```

## s_hourly_20261010_1200_SENTUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_SENTUSDT",
  "symbol": "SENTUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/SENTUSDT.json",
  "factsHash": "082849d701635dbdfe0b801d91929a9e896cb8a01a8fe90e21586ea178f5dba1",
  "collectionCompletedAt": "2026-10-10T04:00:28.392Z",
  "researchExecutedAt": "2026-10-10T20:54:13.309Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "4ca8536e-45db-4901-8e4c-e5efc35da207",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "6ec7b884-06d4-4b10-a336-f73d9aef5ea9",
    "requestedAt": "2026-10-10T20:54:13.309Z",
    "receivedAt": "2026-10-10T20:54:15.516Z",
    "requestHash": "cb4251315142e386c06e5154d380d21b3dbc685ed1f6ae8f822d564bdc3173f2",
    "responseHash": "3bf155c0273ebe8e5ea58cdc9c815583036c5111e3529364d768d765fb6650d3",
    "inputHash": "d3e79f36fbf8571d70c61e8045fb1c71d96e253b73f6762220efcff7a08bc753"
  },
  "requestIds": [
    "4ca8536e-45db-4901-8e4c-e5efc35da207"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BEARISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "SENTUSDT:price.closed1h",
    "SENTUSDT:oi.1h",
    "SENTUSDT:price.closed4h",
    "SENTUSDT:price.closed24h",
    "SENTUSDT:global.long.change1h"
  ],
  "conflictingEvidenceIds": [
    "SENTUSDT:volume.relative1h",
    "SENTUSDT:funding.latest"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_CONTRACTION_COMPATIBLE",
    "evidenceIds": [
      "SENTUSDT:price.closed1h",
      "SENTUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "SENTUSDT:price.closed1h",
      "SENTUSDT:oi.1h",
      "SENTUSDT:price.closed4h",
      "SENTUSDT:price.closed24h",
      "SENTUSDT:global.long.change1h",
      "SENTUSDT:volume.relative1h",
      "SENTUSDT:funding.latest"
    ],
    "alternative": "CONSOLIDATION",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    },
    {
      "conditionType": "ABSTRACT_REASSESSMENT",
      "metricOrStructureEvidenceId": "SENTUSDT:volume.relative1h",
      "interpretation": "MONITOR_CHANGE",
      "consequence": "REASSESS_ONLY"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: SENTUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -1.07003891 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -1.07%",
        "evidenceId": "SENTUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-1.07003891",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "SENTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: SENTUSDT:oi.1h | OI_QUANTITY_CHANGE | -0.09864243 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -0.10%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "SENTUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "-0.09864243",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "SENTUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: SENTUSDT:price.closed4h | PRICE_CLOSED_CHANGE | -2.39923225 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 -2.40%",
        "evidenceId": "SENTUSDT:price.closed4h",
        "factsFields": [
          "evidence[4].result",
          "evidence[4].phrase",
          "evidence[4].dataTimes",
          "evidence[4].formula",
          "sources.hour.raw"
        ],
        "value": "-2.39923225",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791590400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "SENTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: SENTUSDT:price.closed24h | PRICE_CLOSED_CHANGE | -17.51824818 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 -17.52%",
        "evidenceId": "SENTUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "-17.51824818",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "SENTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: SENTUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | -0.36000000 pp | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 63.08% 到 63.44%，变化 0.36 个百分点；多方变化 -0.36 个百分点",
        "evidenceId": "SENTUSDT:global.long.change1h",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: (longAccount_end - longAccount_start) * 100; percentage points; exact retained dataTimes: 1791601200000,1791604800000)"
        ],
        "value": "-0.36000000",
        "unit": "pp",
        "window": "1h",
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "SENTUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791604815949
          },
          "formula": "(longAccount_end - longAccount_start) * 100; percentage points"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: SENTUSDT:volume.relative1h | RELATIVE_VOLUME | 1.09159919 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 1.09 倍",
        "evidenceId": "SENTUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "1.09159919",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791514800000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "SENTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: SENTUSDT:funding.latest | SETTLED_FUNDING | 0.00500000 % | window=UNDECLARED | observedAt=2026-10-10T04:00:00.007Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 北京时间10-10 12:00已结算Funding 0.0050%，多头支付空头",
        "evidenceId": "SENTUSDT:funding.latest",
        "factsFields": [
          "evidence[14].result",
          "evidence[14].phrase",
          "evidence[14].dataTimes",
          "evidence[14].formula",
          "sources.funding.raw"
        ],
        "value": "0.00500000",
        "unit": "%",
        "window": null,
        "scope": null,
        "dataTimes": [
          1791604800007
        ],
        "source": {
          "endpoint": "/fapi/v1/fundingRate",
          "params": {
            "symbol": "SENTUSDT",
            "startTime": 1791432015949,
            "endTime": 1791604815949,
            "limit": 1000
          },
          "formula": "fundingRate*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 1,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "SENTUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "SENTUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "GTE",
          "threshold": 5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "SENTUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "SENTUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h/4h/24h价格同向下降，但1h OI仅-0.098642%；账户多方-0.36pp不证明新增空仓。成交量1.09倍与正Funding被列为冲突的具体逻辑没有被枚举解释，证据角色相关性UNCERTAIN。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6184,
        "completion_tokens": 585,
        "total_tokens": 6769,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4904
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/4ca8536e-45db-4901-8e4c-e5efc35da207.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
SENTUSDT BEARISH / 1h / LOW
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: SENTUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -1.07003891 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -1.07%
支持: SENTUSDT:oi.1h | OI_QUANTITY_CHANGE | -0.09864243 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -0.10%（不代表资金净流入或多空加仓方向）
支持: SENTUSDT:price.closed4h | PRICE_CLOSED_CHANGE | -2.39923225 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 -2.40%
支持: SENTUSDT:price.closed24h | PRICE_CLOSED_CHANGE | -17.51824818 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 -17.52%
支持: SENTUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | -0.36000000 pp | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 63.08% 到 63.44%，变化 0.36 个百分点；多方变化 -0.36 个百分点
冲突: SENTUSDT:volume.relative1h | RELATIVE_VOLUME | 1.09159919 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 1.09 倍
冲突: SENTUSDT:funding.latest | SETTLED_FUNDING | 0.00500000 % | window=UNDECLARED | observedAt=2026-10-10T04:00:00.007Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 北京时间10-10 12:00已结算Funding 0.0050%，多头支付空头
机制假设: 与合约规模收缩相容，不确认具体开平仓行为。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=CONSOLIDATION，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 1% => INVALIDATED; 后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE GTE 5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核
SENTUSDT:volume.relative1h: 观察变化，仅复核，不自动失效
```

## s_hourly_20261010_1400_JCTUSDT

```json
{
  "sampleId": "s_hourly_20261010_1400_JCTUSDT",
  "symbol": "JCTUSDT",
  "runId": "hourly_20261010_1400",
  "originalEvaluationTime": "2026-10-10T06:00:13.760Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1400/facts/JCTUSDT.json",
  "factsHash": "5cc4e93a1efbe3f39f8b09fb7bf251e310faa4a005701e2060a9dfaed1ac2993",
  "collectionCompletedAt": "2026-10-10T06:00:25.713Z",
  "researchExecutedAt": "2026-10-10T20:54:16.182Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "e6f42b05-540d-4ae7-9779-fcc65e25b927",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "c41f13da-f47a-41e7-8eee-cce7312a7447",
    "requestedAt": "2026-10-10T20:54:16.182Z",
    "receivedAt": "2026-10-10T20:54:17.829Z",
    "requestHash": "94d80660047cbdc59e71bab6b6f42002fcef28a6057e41887c73f470f4443b0f",
    "responseHash": "cf5732b6352bced50dbd8b5fe1845dba445d9727c4f542fc1f702accb0b0bcaa",
    "inputHash": "67ffee18baa905f83ae40f5869fffe6b8bcaeeb13a9d893e219770d4312786d5"
  },
  "requestIds": [
    "e6f42b05-540d-4ae7-9779-fcc65e25b927"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BULLISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "JCTUSDT:price.closed1h",
    "JCTUSDT:oi.1h",
    "JCTUSDT:price.last",
    "JCTUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "JCTUSDT:volume.relative1h",
    "JCTUSDT:global.long.change1h",
    "JCTUSDT:global.short.change1h"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_EXPANSION_COMPATIBLE",
    "evidenceIds": [
      "JCTUSDT:price.closed1h",
      "JCTUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "JCTUSDT:price.closed1h",
      "JCTUSDT:oi.1h",
      "JCTUSDT:price.last",
      "JCTUSDT:price.drawdown",
      "JCTUSDT:volume.relative1h",
      "JCTUSDT:global.long.change1h",
      "JCTUSDT:global.short.change1h"
    ],
    "alternative": "CONSOLIDATION",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    },
    {
      "conditionType": "ABSTRACT_REASSESSMENT",
      "metricOrStructureEvidenceId": "JCTUSDT:volume.relative1h",
      "interpretation": "MONITOR_CHANGE",
      "consequence": "REASSESS_ONLY"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: JCTUSDT:price.closed1h | PRICE_CLOSED_CHANGE | 12.39892183 % | window=1h | observedAt=2026-10-10T05:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间14:00，已收盘1小时价格变化 12.40%",
        "evidenceId": "JCTUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "12.39892183",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791608400000,
          1791611999999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "JCTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791612013760
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: JCTUSDT:oi.1h | OI_QUANTITY_CHANGE | 1.41920547 % | window=1h | observedAt=2026-10-10T06:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 1.42%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "JCTUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "1.41920547",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791608400000,
          1791612000000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "JCTUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791612013760
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: JCTUSDT:price.last | PRICE_SNAPSHOT | 0.0029130 USDT | window=UNDECLARED | observedAt=2026-10-10T06:00:08.601Z | availableAt=UNKNOWN | /fapi/v1/ticker/24hr | 快照最新价格 0.0029130 USDT",
        "evidenceId": "JCTUSDT:price.last",
        "factsFields": [
          "evidence[1].result",
          "evidence[1].phrase",
          "evidence[1].dataTimes",
          "evidence[1].formula",
          "sources.ticker.raw"
        ],
        "value": "0.0029130",
        "unit": "USDT",
        "window": null,
        "scope": null,
        "dataTimes": [
          1791612008601
        ],
        "source": {
          "endpoint": "/fapi/v1/ticker/24hr",
          "params": {},
          "formula": "lastPrice"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: JCTUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -0.78337875 % | window=24h | observedAt=2026-10-10T06:00:08.601Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -0.78%",
        "evidenceId": "JCTUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-0.78337875",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791611999999,
          1791612008601
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "JCTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791612013760
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: JCTUSDT:volume.relative1h | RELATIVE_VOLUME | 0.44381487 multiple | window=1h | observedAt=2026-10-10T05:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.44 倍",
        "evidenceId": "JCTUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "0.44381487",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791522000000,
          1791611999999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "JCTUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791612013760
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: JCTUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | -1.79000000 pp | window=1h | observedAt=2026-10-10T06:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 46.18% 到 47.97%，变化 1.79 个百分点；多方变化 -1.79 个百分点",
        "evidenceId": "JCTUSDT:global.long.change1h",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: (longAccount_end - longAccount_start) * 100; percentage points; exact retained dataTimes: 1791608400000,1791612000000)"
        ],
        "value": "-1.79000000",
        "unit": "pp",
        "window": "1h",
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791608400000,
          1791612000000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "JCTUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791612013760
          },
          "formula": "(longAccount_end - longAccount_start) * 100; percentage points"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: JCTUSDT:global.short.change1h | GLOBAL_ACCOUNT_SHARE | 1.79000000 pp | window=1h | observedAt=2026-10-10T06:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 46.18% 到 47.97%，变化 1.79 个百分点；多方变化 -1.79 个百分点",
        "evidenceId": "JCTUSDT:global.short.change1h",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: (shortAccount_end - shortAccount_start) * 100; percentage points; exact retained dataTimes: 1791608400000,1791612000000)"
        ],
        "value": "1.79000000",
        "unit": "pp",
        "window": "1h",
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791608400000,
          1791612000000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "JCTUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791612013760
          },
          "formula": "(shortAccount_end - shortAccount_start) * 100; percentage points"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "LTE",
          "threshold": -6.199460915,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≤-6.1995%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "JCTUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "JCTUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "LTE",
          "threshold": -5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "JCTUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "JCTUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h价格+12.398922%、OI+1.419205%，相对成交量0.443815倍列为冲突；4h/24h OI收缩未被解释，账户两个互补变动列为两条冲突，有重复计量风险但不是伪造事实。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6186,
        "completion_tokens": 578,
        "total_tokens": 6764,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4906
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/e6f42b05-540d-4ae7-9779-fcc65e25b927.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
JCTUSDT BULLISH / 1h / LOW
originalEvaluationTime=2026-10-10T06:00:13.760Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: JCTUSDT:price.closed1h | PRICE_CLOSED_CHANGE | 12.39892183 % | window=1h | observedAt=2026-10-10T05:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间14:00，已收盘1小时价格变化 12.40%
支持: JCTUSDT:oi.1h | OI_QUANTITY_CHANGE | 1.41920547 % | window=1h | observedAt=2026-10-10T06:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 1.42%（不代表资金净流入或多空加仓方向）
支持: JCTUSDT:price.last | PRICE_SNAPSHOT | 0.0029130 USDT | window=UNDECLARED | observedAt=2026-10-10T06:00:08.601Z | availableAt=UNKNOWN | /fapi/v1/ticker/24hr | 快照最新价格 0.0029130 USDT
支持: JCTUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -0.78337875 % | window=24h | observedAt=2026-10-10T06:00:08.601Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -0.78%
冲突: JCTUSDT:volume.relative1h | RELATIVE_VOLUME | 0.44381487 multiple | window=1h | observedAt=2026-10-10T05:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.44 倍
冲突: JCTUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | -1.79000000 pp | window=1h | observedAt=2026-10-10T06:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 46.18% 到 47.97%，变化 1.79 个百分点；多方变化 -1.79 个百分点
冲突: JCTUSDT:global.short.change1h | GLOBAL_ACCOUNT_SHARE | 1.79000000 pp | window=1h | observedAt=2026-10-10T06:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 46.18% 到 47.97%，变化 1.79 个百分点；多方变化 -1.79 个百分点
机制假设: 与合约规模扩张相容，不确认单侧新增仓位。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=CONSOLIDATION，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE LTE -6.199460915% => INVALIDATED; 后续新收盘滚动1h价格变化≤-6.1995%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE LTE -5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
JCTUSDT:volume.relative1h: 观察变化，仅复核，不自动失效
```

## s_hourly_20261010_1200_USUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_USUSDT",
  "symbol": "USUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/USUSDT.json",
  "factsHash": "cddf4721fc1087ab55a845bf17661a8f93c8d253b52e4c5568883dd401c1ba75",
  "collectionCompletedAt": "2026-10-10T04:00:18.973Z",
  "researchExecutedAt": "2026-10-10T20:54:18.448Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "9d3a9b1b-18aa-433f-85f3-8336b984f5bf",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "f45eb9dc-119a-4c5c-a62b-35a14617bad8",
    "requestedAt": "2026-10-10T20:54:18.448Z",
    "receivedAt": "2026-10-10T20:54:19.762Z",
    "requestHash": "e6403d9566f55f57403ebc15a371de67082792e09285402c44c07092cfab6b81",
    "responseHash": "7c0450b2428ebc57b46991caa1b07afb83d7056b82cc457665016f6f92e361b6",
    "inputHash": "da33c593cb663f4e9464917caac0f355960aa7118308fd0296334fc0a2b23c6d"
  },
  "requestIds": [
    "9d3a9b1b-18aa-433f-85f3-8336b984f5bf"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BEARISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "USUSDT:price.closed1h",
    "USUSDT:oi.1h",
    "USUSDT:volume.relative1h",
    "USUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "USUSDT:price.closed24h",
    "USUSDT:oi.24h",
    "USUSDT:global.long.change1h"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_CONTRACTION_COMPATIBLE",
    "evidenceIds": [
      "USUSDT:price.closed1h",
      "USUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "USUSDT:price.closed1h",
      "USUSDT:oi.1h",
      "USUSDT:volume.relative1h",
      "USUSDT:price.drawdown"
    ],
    "alternative": "OPPOSITE_MOVE",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: USUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -12.53567873 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -12.54%",
        "evidenceId": "USUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-12.53567873",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "USUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: USUSDT:oi.1h | OI_QUANTITY_CHANGE | -2.80812050 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -2.81%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "USUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "-2.80812050",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "USUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: USUSDT:volume.relative1h | RELATIVE_VOLUME | 1.35932906 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 1.36 倍",
        "evidenceId": "USUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "1.35932906",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791514800000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "USUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: USUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -27.88416628 % | window=24h | observedAt=2026-10-10T04:00:08.617Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -27.88%",
        "evidenceId": "USUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-27.88416628",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791604799999,
          1791604808617
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "USUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: USUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 57.74572010 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 57.75%",
        "evidenceId": "USUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "57.74572010",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "USUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: USUSDT:oi.24h | OI_QUANTITY_CHANGE | 28.16826935 % | window=24h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 24小时OI数量变化 28.17%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "USUSDT:oi.24h",
        "factsFields": [
          "evidence[13].result",
          "evidence[13].phrase",
          "evidence[13].dataTimes",
          "evidence[13].formula",
          "sources.oi.raw"
        ],
        "value": "28.16826935",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "USUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: USUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | 2.21000000 pp | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 70.78% 到 68.57%，变化 -2.21 个百分点；多方变化 2.21 个百分点",
        "evidenceId": "USUSDT:global.long.change1h",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: (longAccount_end - longAccount_start) * 100; percentage points; exact retained dataTimes: 1791601200000,1791604800000)"
        ],
        "value": "2.21000000",
        "unit": "pp",
        "window": "1h",
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "USUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791604815949
          },
          "formula": "(longAccount_end - longAccount_start) * 100; percentage points"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 6.267839365,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥6.2678%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "USUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "USUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "GTE",
          "threshold": 5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "USUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "USUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h价格-12.535679%、OI-2.808121%，24h价格+57.745720%及OI+28.168269%明确列为冲突；竞争情景OPPOSITE_MOVE合理作为待验证可能。不能将收缩认定为强平。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6110,
        "completion_tokens": 360,
        "total_tokens": 6470,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4830
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/9d3a9b1b-18aa-433f-85f3-8336b984f5bf.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
USUSDT BEARISH / 1h / LOW
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: USUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -12.53567873 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -12.54%
支持: USUSDT:oi.1h | OI_QUANTITY_CHANGE | -2.80812050 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -2.81%（不代表资金净流入或多空加仓方向）
支持: USUSDT:volume.relative1h | RELATIVE_VOLUME | 1.35932906 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 1.36 倍
支持: USUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -27.88416628 % | window=24h | observedAt=2026-10-10T04:00:08.617Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -27.88%
冲突: USUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 57.74572010 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 57.75%
冲突: USUSDT:oi.24h | OI_QUANTITY_CHANGE | 28.16826935 % | window=24h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 24小时OI数量变化 28.17%（不代表资金净流入或多空加仓方向）
冲突: USUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | 2.21000000 pp | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 70.78% 到 68.57%，变化 -2.21 个百分点；多方变化 2.21 个百分点
机制假设: 与合约规模收缩相容，不确认具体开平仓行为。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=OPPOSITE_MOVE，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 6.267839365% => INVALIDATED; 后续新收盘滚动1h价格变化≥6.2678%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE GTE 5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核
```

## s_hourly_20261010_1200_RLCUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_RLCUSDT",
  "symbol": "RLCUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/RLCUSDT.json",
  "factsHash": "5670ccf6b94eb42df9fc7638f4f49b55984e77a357a5533b16255af64f798329",
  "collectionCompletedAt": "2026-10-10T04:00:23.087Z",
  "researchExecutedAt": "2026-10-10T20:54:20.346Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "f730ba23-2844-4333-ae3a-e38b68d3b629",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "ea015c01-2abc-41a1-907d-854c633db435",
    "requestedAt": "2026-10-10T20:54:20.346Z",
    "receivedAt": "2026-10-10T20:54:22.560Z",
    "requestHash": "d4a5347c97a37f5def0e13599408ae41df6c1c727e7c5bb746c754b017ea98f5",
    "responseHash": "abd8919349c35fa31fdcb6cc4212ea4f1c533527406572adb9e2f17d6be62848",
    "inputHash": "3a87c29555a1b97616a2833cd1d3af780e656e3d5e0d39128d8a31adb9838a21"
  },
  "requestIds": [
    "f730ba23-2844-4333-ae3a-e38b68d3b629"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BEARISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "RLCUSDT:price.closed1h",
    "RLCUSDT:oi.1h",
    "RLCUSDT:volume.relative1h",
    "RLCUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "RLCUSDT:price.closed4h",
    "RLCUSDT:price.closed24h",
    "RLCUSDT:funding.latest"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_EXPANSION_COMPATIBLE",
    "evidenceIds": [
      "RLCUSDT:price.closed1h",
      "RLCUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "RLCUSDT:price.closed1h",
      "RLCUSDT:oi.1h",
      "RLCUSDT:volume.relative1h",
      "RLCUSDT:price.drawdown"
    ],
    "alternative": "OPPOSITE_MOVE",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: RLCUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -3.03257207 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -3.03%",
        "evidenceId": "RLCUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-3.03257207",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "RLCUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: RLCUSDT:oi.1h | OI_QUANTITY_CHANGE | 1.74717358 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 1.75%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "RLCUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "1.74717358",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "RLCUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: RLCUSDT:volume.relative1h | RELATIVE_VOLUME | 0.30477703 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.30 倍",
        "evidenceId": "RLCUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "0.30477703",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791514800000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "RLCUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: RLCUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -30.98676698 % | window=24h | observedAt=2026-10-10T04:00:10.065Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -30.99%",
        "evidenceId": "RLCUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-30.98676698",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791604799999,
          1791604810065
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "RLCUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: RLCUSDT:price.closed4h | PRICE_CLOSED_CHANGE | 0.97465887 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 0.97%",
        "evidenceId": "RLCUSDT:price.closed4h",
        "factsFields": [
          "evidence[4].result",
          "evidence[4].phrase",
          "evidence[4].dataTimes",
          "evidence[4].formula",
          "sources.hour.raw"
        ],
        "value": "0.97465887",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791590400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "RLCUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: RLCUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 13.80863452 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 13.81%",
        "evidenceId": "RLCUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "13.80863452",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "RLCUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: RLCUSDT:funding.latest | SETTLED_FUNDING | -0.15917000 % | window=UNDECLARED | observedAt=2026-10-10T04:00:00.007Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 北京时间10-10 12:00已结算Funding -0.1592%，空头支付多头",
        "evidenceId": "RLCUSDT:funding.latest",
        "factsFields": [
          "evidence[14].result",
          "evidence[14].phrase",
          "evidence[14].dataTimes",
          "evidence[14].formula",
          "sources.funding.raw"
        ],
        "value": "-0.15917000",
        "unit": "%",
        "window": null,
        "scope": null,
        "dataTimes": [
          1791604800007
        ],
        "source": {
          "endpoint": "/fapi/v1/fundingRate",
          "params": {
            "symbol": "RLCUSDT",
            "startTime": 1791432015949,
            "endTime": 1791604815949,
            "limit": 1000
          },
          "formula": "fundingRate*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 1.516286035,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥1.5163%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "RLCUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "RLCUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "LTE",
          "threshold": -5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "RLCUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "RLCUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h下跌与4h/24h上涨冲突已列出。1h相对量仅0.304777倍却作为方向支持，负Funding列为冲突；弱量、Funding为何支持/反对未来方向缺少具体论证，相关性UNCERTAIN。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6185,
        "completion_tokens": 484,
        "total_tokens": 6669,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4905
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/f730ba23-2844-4333-ae3a-e38b68d3b629.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
RLCUSDT BEARISH / 1h / LOW
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: RLCUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -3.03257207 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -3.03%
支持: RLCUSDT:oi.1h | OI_QUANTITY_CHANGE | 1.74717358 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 1.75%（不代表资金净流入或多空加仓方向）
支持: RLCUSDT:volume.relative1h | RELATIVE_VOLUME | 0.30477703 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.30 倍
支持: RLCUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -30.98676698 % | window=24h | observedAt=2026-10-10T04:00:10.065Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -30.99%
冲突: RLCUSDT:price.closed4h | PRICE_CLOSED_CHANGE | 0.97465887 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 0.97%
冲突: RLCUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 13.80863452 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 13.81%
冲突: RLCUSDT:funding.latest | SETTLED_FUNDING | -0.15917000 % | window=UNDECLARED | observedAt=2026-10-10T04:00:00.007Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 北京时间10-10 12:00已结算Funding -0.1592%，空头支付多头
机制假设: 与合约规模扩张相容，不确认单侧新增仓位。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=OPPOSITE_MOVE，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 1.516286035% => INVALIDATED; 后续新收盘滚动1h价格变化≥1.5163%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE LTE -5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
```

## s_hourly_20261010_1300_MINAUSDT

```json
{
  "sampleId": "s_hourly_20261010_1300_MINAUSDT",
  "symbol": "MINAUSDT",
  "runId": "hourly_20261010_1300",
  "originalEvaluationTime": "2026-10-10T05:00:16.899Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 24,
  "factsPath": "data/runs/hourly_20261010_1300/facts/MINAUSDT.json",
  "factsHash": "df604d2ee0fa6967671fd022eac28c306632b738c6f2578ede2768329cb22b37",
  "collectionCompletedAt": "2026-10-10T05:00:26.923Z",
  "researchExecutedAt": "2026-10-10T20:54:23.728Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "09c4ca35-ad73-4aca-8a3f-987369bf1242",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "f3d2e7fc-9fd8-443c-92b9-bad1a6cdabae",
    "requestedAt": "2026-10-10T20:54:23.728Z",
    "receivedAt": "2026-10-10T20:54:26.261Z",
    "requestHash": "455bf041061b98f8ce1ac30545bd9d5c92f34908d873e66398e98b6baea90d84",
    "responseHash": "04462a1b9577a610d5ee612ff8fa30b409fedcf578e5b6cc92b101015162d0e3",
    "inputHash": "e8042b5090f3a45c4fa96b0218ed589bbe2aa90de5290c99b4607c7b36d375a7"
  },
  "requestIds": [
    "09c4ca35-ad73-4aca-8a3f-987369bf1242"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BULLISH",
  "horizon": "1h",
  "conviction": "MODERATE",
  "supportingEvidenceIds": [
    "MINAUSDT:price.closed1h",
    "MINAUSDT:oi.1h",
    "MINAUSDT:volume.relative1h",
    "MINAUSDT:price.closed4h",
    "MINAUSDT:price.closed24h",
    "MINAUSDT:global.long.change1h"
  ],
  "conflictingEvidenceIds": [
    "MINAUSDT:funding.latest",
    "MINAUSDT:funding.sum24h",
    "MINAUSDT:price.drawdown"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_EXPANSION_COMPATIBLE",
    "evidenceIds": [
      "MINAUSDT:price.closed1h",
      "MINAUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "MINAUSDT:price.closed1h",
      "MINAUSDT:oi.1h",
      "MINAUSDT:volume.relative1h",
      "MINAUSDT:price.closed4h",
      "MINAUSDT:price.closed24h",
      "MINAUSDT:global.long.change1h",
      "MINAUSDT:funding.latest",
      "MINAUSDT:funding.sum24h",
      "MINAUSDT:price.drawdown"
    ],
    "alternative": "CONSOLIDATION",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_PULLBACK",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    },
    {
      "conditionType": "ABSTRACT_REASSESSMENT",
      "metricOrStructureEvidenceId": "MINAUSDT:global.flip",
      "interpretation": "MONITOR_CHANGE",
      "consequence": "REASSESS_ONLY"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: MINAUSDT:price.closed1h | PRICE_CLOSED_CHANGE | 5.93956235 % | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘1小时价格变化 5.94%",
        "evidenceId": "MINAUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "5.93956235",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791604800000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "MINAUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: MINAUSDT:oi.1h | OI_QUANTITY_CHANGE | 0.71882067 % | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 0.72%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "MINAUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "0.71882067",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791604800000,
          1791608400000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "MINAUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791608416899
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: MINAUSDT:volume.relative1h | RELATIVE_VOLUME | 3.64037290 multiple | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 3.64 倍",
        "evidenceId": "MINAUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "3.64037290",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "MINAUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: MINAUSDT:price.closed4h | PRICE_CLOSED_CHANGE | 15.77881817 % | window=4h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘4小时价格变化 15.78%",
        "evidenceId": "MINAUSDT:price.closed4h",
        "factsFields": [
          "evidence[4].result",
          "evidence[4].phrase",
          "evidence[4].dataTimes",
          "evidence[4].formula",
          "sources.hour.raw"
        ],
        "value": "15.77881817",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791594000000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "MINAUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: MINAUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 18.15599174 % | window=24h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘24小时价格变化 18.16%",
        "evidenceId": "MINAUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "18.15599174",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791522000000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "MINAUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: MINAUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | 1.92000000 pp | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 50.96% 到 49.04%，变化 -1.92 个百分点；多方变化 1.92 个百分点",
        "evidenceId": "MINAUSDT:global.long.change1h",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: (longAccount_end - longAccount_start) * 100; percentage points; exact retained dataTimes: 1791604800000,1791608400000)"
        ],
        "value": "1.92000000",
        "unit": "pp",
        "window": "1h",
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791604800000,
          1791608400000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "MINAUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791608416899
          },
          "formula": "(longAccount_end - longAccount_start) * 100; percentage points"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: MINAUSDT:funding.latest | SETTLED_FUNDING | -0.18672600 % | window=UNDECLARED | observedAt=2026-10-10T00:00:00.002Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 北京时间10-10 08:00已结算Funding -0.1867%，空头支付多头",
        "evidenceId": "MINAUSDT:funding.latest",
        "factsFields": [
          "evidence[14].result",
          "evidence[14].phrase",
          "evidence[14].dataTimes",
          "evidence[14].formula",
          "sources.funding.raw"
        ],
        "value": "-0.18672600",
        "unit": "%",
        "window": null,
        "scope": null,
        "dataTimes": [
          1791590400002
        ],
        "source": {
          "endpoint": "/fapi/v1/fundingRate",
          "params": {
            "symbol": "MINAUSDT",
            "startTime": 1791435616899,
            "endTime": 1791608416899,
            "limit": 1000
          },
          "formula": "fundingRate*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: MINAUSDT:funding.sum24h | SETTLED_FUNDING | -0.54299500 % | window=UNDECLARED | observedAt=2026-10-10T00:00:00.002Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 过去24小时实际3次结算费率之和 -0.5430%（非收益率）",
        "evidenceId": "MINAUSDT:funding.sum24h",
        "factsFields": [
          "evidence[15].result",
          "evidence[15].phrase",
          "evidence[15].dataTimes",
          "evidence[15].formula",
          "sources.funding.raw"
        ],
        "value": "-0.54299500",
        "unit": "%",
        "window": null,
        "scope": null,
        "dataTimes": [
          1791532800000,
          1791561600000,
          1791590400002
        ],
        "source": {
          "endpoint": "/fapi/v1/fundingRate",
          "params": {
            "symbol": "MINAUSDT",
            "startTime": 1791435616899,
            "endTime": 1791608416899,
            "limit": 1000
          },
          "formula": "sum(actual settled fundingRate)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: MINAUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -0.18534671 % | window=24h | observedAt=2026-10-10T05:00:11.728Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -0.19%",
        "evidenceId": "MINAUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-0.18534671",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791608399999,
          1791608411728
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "MINAUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "LTE",
          "threshold": -2.969781175,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≤-2.9698%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "MINAUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "MINAUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "LTE",
          "threshold": -5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "MINAUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "MINAUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "多周期上涨、小时相对量3.640373倍、OI+0.718821%；账户多方+1.92pp仅分布变化。负Funding及轻微回撤被列为冲突，意义仍需解释；WAIT_FOR_PULLBACK没有附造支撑或入场价。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6359,
        "completion_tokens": 632,
        "total_tokens": 6991,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 5079
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/09c4ca35-ad73-4aca-8a3f-987369bf1242.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
MINAUSDT BULLISH / 1h / MODERATE
originalEvaluationTime=2026-10-10T05:00:16.899Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: MINAUSDT:price.closed1h | PRICE_CLOSED_CHANGE | 5.93956235 % | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘1小时价格变化 5.94%
支持: MINAUSDT:oi.1h | OI_QUANTITY_CHANGE | 0.71882067 % | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 0.72%（不代表资金净流入或多空加仓方向）
支持: MINAUSDT:volume.relative1h | RELATIVE_VOLUME | 3.64037290 multiple | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 3.64 倍
支持: MINAUSDT:price.closed4h | PRICE_CLOSED_CHANGE | 15.77881817 % | window=4h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘4小时价格变化 15.78%
支持: MINAUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 18.15599174 % | window=24h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘24小时价格变化 18.16%
支持: MINAUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | 1.92000000 pp | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 50.96% 到 49.04%，变化 -1.92 个百分点；多方变化 1.92 个百分点
冲突: MINAUSDT:funding.latest | SETTLED_FUNDING | -0.18672600 % | window=UNDECLARED | observedAt=2026-10-10T00:00:00.002Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 北京时间10-10 08:00已结算Funding -0.1867%，空头支付多头
冲突: MINAUSDT:funding.sum24h | SETTLED_FUNDING | -0.54299500 % | window=UNDECLARED | observedAt=2026-10-10T00:00:00.002Z | availableAt=UNKNOWN | /fapi/v1/fundingRate | 过去24小时实际3次结算费率之和 -0.5430%（非收益率）
冲突: MINAUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -0.18534671 % | window=24h | observedAt=2026-10-10T05:00:11.728Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -0.19%
机制假设: 与合约规模扩张相容，不确认单侧新增仓位。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=CONSOLIDATION，并非已证实事实。
交易机会: WAIT_FOR_PULLBACK
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE LTE -2.969781175% => INVALIDATED; 后续新收盘滚动1h价格变化≤-2.9698%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE LTE -5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
MINAUSDT:global.flip: 观察变化，仅复核，不自动失效
```

## s_hourly_20261010_1300_BRUSDT

```json
{
  "sampleId": "s_hourly_20261010_1300_BRUSDT",
  "symbol": "BRUSDT",
  "runId": "hourly_20261010_1300",
  "originalEvaluationTime": "2026-10-10T05:00:16.899Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1300/facts/BRUSDT.json",
  "factsHash": "dacfb92643fadbb651b916ad2381ac0de02364aaec8a5f9974746cf48c334858",
  "collectionCompletedAt": "2026-10-10T05:00:37.819Z",
  "researchExecutedAt": "2026-10-10T20:54:26.930Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "8bd06ce4-6bd7-49ca-9989-c569d88518a3",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "75f32a92-3983-448c-955c-85fdc9923523",
    "requestedAt": "2026-10-10T20:54:26.930Z",
    "receivedAt": "2026-10-10T20:54:28.695Z",
    "requestHash": "5413ce258376f8c357b1ce49cf6ccfb57af2239d792bfa04a00296f323b5d1e7",
    "responseHash": "b1c46ebe591c8c54e3ffa863a724931074959ecf789c853f6e32ad65c6a6bd11",
    "inputHash": "ef265bb5e7770948690e6002fe36e6f214eb8d73749a2918ea9f1365c94ffde7"
  },
  "requestIds": [
    "8bd06ce4-6bd7-49ca-9989-c569d88518a3"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BEARISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "BRUSDT:price.closed1h",
    "BRUSDT:oi.1h",
    "BRUSDT:price.closed4h",
    "BRUSDT:price.closed24h",
    "BRUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "BRUSDT:volume.relative1h",
    "BRUSDT:global.long.change1h"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_EXPANSION_COMPATIBLE",
    "evidenceIds": [
      "BRUSDT:price.closed1h",
      "BRUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "BRUSDT:price.closed1h",
      "BRUSDT:oi.1h",
      "BRUSDT:price.closed4h",
      "BRUSDT:price.closed24h",
      "BRUSDT:price.drawdown",
      "BRUSDT:volume.relative1h",
      "BRUSDT:global.long.change1h"
    ],
    "alternative": "CONSOLIDATION",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: BRUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -0.81408872 % | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘1小时价格变化 -0.81%",
        "evidenceId": "BRUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-0.81408872",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791604800000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "BRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: BRUSDT:oi.1h | OI_QUANTITY_CHANGE | 0.62324440 % | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 0.62%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "BRUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "0.62324440",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791604800000,
          1791608400000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "BRUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791608416899
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: BRUSDT:price.closed4h | PRICE_CLOSED_CHANGE | -3.18657261 % | window=4h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘4小时价格变化 -3.19%",
        "evidenceId": "BRUSDT:price.closed4h",
        "factsFields": [
          "evidence[4].result",
          "evidence[4].phrase",
          "evidence[4].dataTimes",
          "evidence[4].formula",
          "sources.hour.raw"
        ],
        "value": "-3.18657261",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791594000000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "BRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: BRUSDT:price.closed24h | PRICE_CLOSED_CHANGE | -8.25617580 % | window=24h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘24小时价格变化 -8.26%",
        "evidenceId": "BRUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "-8.25617580",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791522000000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "BRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: BRUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -13.52920956 % | window=24h | observedAt=2026-10-10T05:00:10.908Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -13.53%",
        "evidenceId": "BRUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-13.52920956",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791608399999,
          1791608410908
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "BRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: BRUSDT:volume.relative1h | RELATIVE_VOLUME | 0.92199694 multiple | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.92 倍",
        "evidenceId": "BRUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "0.92199694",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791608399999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "BRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791608416899
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: BRUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | -0.29000000 pp | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 48.65% 到 48.94%，变化 0.29 个百分点；多方变化 -0.29 个百分点",
        "evidenceId": "BRUSDT:global.long.change1h",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: (longAccount_end - longAccount_start) * 100; percentage points; exact retained dataTimes: 1791604800000,1791608400000)"
        ],
        "value": "-0.29000000",
        "unit": "pp",
        "window": "1h",
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791604800000,
          1791608400000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "BRUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791608416899
          },
          "formula": "(longAccount_end - longAccount_start) * 100; percentage points"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 1,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "BRUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "BRUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "LTE",
          "threshold": -5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "BRUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "BRUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "多周期下降、OI+0.623244%，相对量0.921997倍列为冲突。多方账户下降-0.29pp也列为冲突，其角色未解释，不能将这一统计机械映射为买卖或资金行为。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6103,
        "completion_tokens": 508,
        "total_tokens": 6611,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4823
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/8bd06ce4-6bd7-49ca-9989-c569d88518a3.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
BRUSDT BEARISH / 1h / LOW
originalEvaluationTime=2026-10-10T05:00:16.899Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: BRUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -0.81408872 % | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘1小时价格变化 -0.81%
支持: BRUSDT:oi.1h | OI_QUANTITY_CHANGE | 0.62324440 % | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 0.62%（不代表资金净流入或多空加仓方向）
支持: BRUSDT:price.closed4h | PRICE_CLOSED_CHANGE | -3.18657261 % | window=4h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘4小时价格变化 -3.19%
支持: BRUSDT:price.closed24h | PRICE_CLOSED_CHANGE | -8.25617580 % | window=24h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间13:00，已收盘24小时价格变化 -8.26%
支持: BRUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -13.52920956 % | window=24h | observedAt=2026-10-10T05:00:10.908Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -13.53%
冲突: BRUSDT:volume.relative1h | RELATIVE_VOLUME | 0.92199694 multiple | window=1h | observedAt=2026-10-10T04:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.92 倍
冲突: BRUSDT:global.long.change1h | GLOBAL_ACCOUNT_SHARE | -0.29000000 pp | window=1h | observedAt=2026-10-10T05:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户空方占比1小时从 48.65% 到 48.94%，变化 0.29 个百分点；多方变化 -0.29 个百分点
机制假设: 与合约规模扩张相容，不确认单侧新增仓位。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=CONSOLIDATION，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 1% => INVALIDATED; 后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE LTE -5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
```

## s_hourly_20261010_1200_ZKUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_ZKUSDT",
  "symbol": "ZKUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/ZKUSDT.json",
  "factsHash": "b00c03200f0b1517e1e6bd3d0c0cff7e49e8fac21f443b79a58329e4b39f8848",
  "collectionCompletedAt": "2026-10-10T04:00:27.099Z",
  "researchExecutedAt": "2026-10-10T20:54:29.390Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "f1061d96-57e9-4401-86ad-e30b124eec2e",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "98c1693a-7de6-4e68-8d59-a70027e146d8",
    "requestedAt": "2026-10-10T20:54:29.390Z",
    "receivedAt": "2026-10-10T20:54:31.438Z",
    "requestHash": "f778252f37cd9756ca2dee759f9c2932f1da3b04b4b8009d07e07d9087bc694a",
    "responseHash": "5c199847470394909093c11ca87455be675f89254d172c759a5e7ac9d0f208a1",
    "inputHash": "2a13cc78b225a8e6bb075cddb9d2762d21012e48331dd4a19b722bbbec4621e6"
  },
  "requestIds": [
    "f1061d96-57e9-4401-86ad-e30b124eec2e"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BEARISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "ZKUSDT:price.closed1h",
    "ZKUSDT:oi.1h",
    "ZKUSDT:volume.relative1h",
    "ZKUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "ZKUSDT:price.closed24h",
    "ZKUSDT:oi.24h",
    "ZKUSDT:global.long.latest"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_CONTRACTION_COMPATIBLE",
    "evidenceIds": [
      "ZKUSDT:price.closed1h",
      "ZKUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "ZKUSDT:price.closed1h",
      "ZKUSDT:oi.1h",
      "ZKUSDT:volume.relative1h",
      "ZKUSDT:price.drawdown"
    ],
    "alternative": "OPPOSITE_MOVE",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: ZKUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -1.73068805 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -1.73%",
        "evidenceId": "ZKUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-1.73068805",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "ZKUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: ZKUSDT:oi.1h | OI_QUANTITY_CHANGE | -1.14448740 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -1.14%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "ZKUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "-1.14448740",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "ZKUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: ZKUSDT:volume.relative1h | RELATIVE_VOLUME | 0.66356946 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.66 倍",
        "evidenceId": "ZKUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "0.66356946",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791514800000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "ZKUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: ZKUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -4.26173347 % | window=24h | observedAt=2026-10-10T04:00:10.028Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -4.26%",
        "evidenceId": "ZKUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-4.26173347",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791604799999,
          1791604810028
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "ZKUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: ZKUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 19.13006397 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 19.13%",
        "evidenceId": "ZKUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "19.13006397",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "ZKUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: ZKUSDT:oi.24h | OI_QUANTITY_CHANGE | 37.10210887 % | window=24h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 24小时OI数量变化 37.10%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "ZKUSDT:oi.24h",
        "factsFields": [
          "evidence[13].result",
          "evidence[13].phrase",
          "evidence[13].dataTimes",
          "evidence[13].formula",
          "sources.oi.raw"
        ],
        "value": "37.10210887",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "ZKUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: ZKUSDT:global.long.latest | GLOBAL_ACCOUNT_SHARE | 65.08000000 % | window=UNDECLARED | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户：多 65.08%、空 34.92%（账户比例不代表仓位或资金比例）",
        "evidenceId": "ZKUSDT:global.long.latest",
        "factsFields": [
          "sources.accounts.raw (canonical deterministic formula: longAccount * 100; exact retained dataTimes: 1791604800000)"
        ],
        "value": "65.08000000",
        "unit": "%",
        "window": null,
        "scope": "GLOBAL_ACCOUNTS",
        "dataTimes": [
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/globalLongShortAccountRatio",
          "params": {
            "symbol": "ZKUSDT",
            "period": "1h",
            "limit": 3,
            "endTime": 1791604815949
          },
          "formula": "longAccount * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 1,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "ZKUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "ZKUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "GTE",
          "threshold": 5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "ZKUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "ZKUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h跌、24h涨被显式区分，OI数量收缩被正确标记。全市场多方65.08%被作为冲突，只能说明账户分布，不能独立证明未来上行；相关性UNCERTAIN。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6102,
        "completion_tokens": 469,
        "total_tokens": 6571,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4822
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/f1061d96-57e9-4401-86ad-e30b124eec2e.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
ZKUSDT BEARISH / 1h / LOW
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: ZKUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -1.73068805 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -1.73%
支持: ZKUSDT:oi.1h | OI_QUANTITY_CHANGE | -1.14448740 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -1.14%（不代表资金净流入或多空加仓方向）
支持: ZKUSDT:volume.relative1h | RELATIVE_VOLUME | 0.66356946 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 0.66 倍
支持: ZKUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -4.26173347 % | window=24h | observedAt=2026-10-10T04:00:10.028Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -4.26%
冲突: ZKUSDT:price.closed24h | PRICE_CLOSED_CHANGE | 19.13006397 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 19.13%
冲突: ZKUSDT:oi.24h | OI_QUANTITY_CHANGE | 37.10210887 % | window=24h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 24小时OI数量变化 37.10%（不代表资金净流入或多空加仓方向）
冲突: ZKUSDT:global.long.latest | GLOBAL_ACCOUNT_SHARE | 65.08000000 % | window=UNDECLARED | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/globalLongShortAccountRatio | 全市场净多/净空头账户：多 65.08%、空 34.92%（账户比例不代表仓位或资金比例）
机制假设: 与合约规模收缩相容，不确认具体开平仓行为。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=OPPOSITE_MOVE，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 1% => INVALIDATED; 后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE GTE 5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核
```

## s_hourly_20261010_1200_XAIUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_XAIUSDT",
  "symbol": "XAIUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/XAIUSDT.json",
  "factsHash": "740fbc9b8893f7938a333125c6de16316f726c90e8dc3c6411027ec83b54cbb6",
  "collectionCompletedAt": "2026-10-10T04:00:25.971Z",
  "researchExecutedAt": "2026-10-10T20:54:32.110Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "4d991ca6-201d-4b6d-90b0-de54fc292bdd",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "27cfb657-8c27-4c46-b4b2-16f8069ec986",
    "requestedAt": "2026-10-10T20:54:32.110Z",
    "receivedAt": "2026-10-10T20:54:33.661Z",
    "requestHash": "93dd344ca8f8e527821c36ecf0590e5c9514d3c77bfecaa6bf3c50468257945e",
    "responseHash": "ea9c473b6f27a30db74ddd7aa8d0b8b305a15c310731513d8ea0edab5b0f4b0b",
    "inputHash": "b71d6786e25fb957a16e0eb232596a2b94246acbc5e789ae6679b9366886b05b"
  },
  "requestIds": [
    "4d991ca6-201d-4b6d-90b0-de54fc292bdd"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BULLISH",
  "horizon": "1h",
  "conviction": "HIGH",
  "supportingEvidenceIds": [
    "XAIUSDT:price.closed1h",
    "XAIUSDT:oi.1h",
    "XAIUSDT:volume.relative1h"
  ],
  "conflictingEvidenceIds": [],
  "mechanismHypothesis": {
    "type": "CONTRACT_EXPANSION_COMPATIBLE",
    "evidenceIds": [
      "XAIUSDT:price.closed1h",
      "XAIUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "XAIUSDT:price.closed1h",
      "XAIUSDT:oi.1h",
      "XAIUSDT:volume.relative1h"
    ],
    "alternative": "OPPOSITE_MOVE",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: XAIUSDT:price.closed1h | PRICE_CLOSED_CHANGE | 1.76982401 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 1.77%",
        "evidenceId": "XAIUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "1.76982401",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XAIUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: XAIUSDT:oi.1h | OI_QUANTITY_CHANGE | 27.15130071 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 27.15%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "XAIUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "27.15130071",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "XAIUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: XAIUSDT:volume.relative1h | RELATIVE_VOLUME | 23.29332460 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 23.29 倍",
        "evidenceId": "XAIUSDT:volume.relative1h",
        "factsFields": [
          "evidence[8].result",
          "evidence[8].phrase",
          "evidence[8].dataTimes",
          "evidence[8].formula",
          "sources.hour.raw"
        ],
        "value": "23.29332460",
        "unit": "multiple",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791514800000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XAIUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "LTE",
          "threshold": -1,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≤-1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "XAIUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "XAIUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "LTE",
          "threshold": -13.575650355,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≤-13.5757%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "XAIUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "XAIUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h价格+1.769824%、OI+27.151301%、相对量23.293325倍构成可复核的条件性延续假设；HIGH符合现有Guard，仍是强观察而不是概率校准。5m量0.913627倍等背景未作展开。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6199,
        "completion_tokens": 421,
        "total_tokens": 6620,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4919
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/4d991ca6-201d-4b6d-90b0-de54fc292bdd.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
XAIUSDT BULLISH / 1h / HIGH
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: XAIUSDT:price.closed1h | PRICE_CLOSED_CHANGE | 1.76982401 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 1.77%
支持: XAIUSDT:oi.1h | OI_QUANTITY_CHANGE | 27.15130071 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 27.15%（不代表资金净流入或多空加仓方向）
支持: XAIUSDT:volume.relative1h | RELATIVE_VOLUME | 23.29332460 multiple | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘1小时成交量为前24根均值的 23.29 倍
机制假设: 与合约规模扩张相容，不确认单侧新增仓位。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=OPPOSITE_MOVE，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE LTE -1% => INVALIDATED; 后续新收盘滚动1h价格变化≤-1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE LTE -13.575650355% => THESIS_WARNING; 后续新采样精确1h OI数量变化≤-13.5757%，原敞口变化条件明显逆转，只触发复核
```

## s_hourly_20261010_1200_XMRUSDT

```json
{
  "sampleId": "s_hourly_20261010_1200_XMRUSDT",
  "symbol": "XMRUSDT",
  "runId": "hourly_20261010_1200",
  "originalEvaluationTime": "2026-10-10T04:00:15.949Z",
  "probeMode": "POST_COLLECTION_HISTORICAL_RESEARCH",
  "causalBacktestEligible": false,
  "evidenceCount": 23,
  "factsPath": "data/runs/hourly_20261010_1200/facts/XMRUSDT.json",
  "factsHash": "be77166c8e2726d3862306929b59e81cd0d57b2ea648ee30fed7a8d109d8f0d6",
  "collectionCompletedAt": "2026-10-10T04:00:31.188Z",
  "researchExecutedAt": "2026-10-10T20:54:34.282Z",
  "actualModel": "deepseek-flash",
  "trustedProvenance": {
    "sourceType": "LIVE_MODEL_RESPONSE",
    "executionKind": "LIVE_API",
    "provider": "deepseek",
    "model": "deepseek-flash",
    "requestedModel": "deepseek-flash",
    "requestId": "a63a0667-ffed-40fd-8efe-d70cad8d220c",
    "requestIdKind": "LOCAL_TRACKING_ID",
    "serverResponseId": "d30c9929-9fff-4b67-b1ff-5764c9fccc75",
    "requestedAt": "2026-10-10T20:54:34.282Z",
    "receivedAt": "2026-10-10T20:54:36.028Z",
    "requestHash": "0649c7d1d374b9789d710415f39fdd5da8c94839ce5495d42a5a364a23be397c",
    "responseHash": "326e3b82aa8e47a7890c352bcb2b9d970f3ef40eb5e1de2f9a6f8ae528061fba",
    "inputHash": "ad90e31c5cd5106e9bfbd790f328fdf51bb3ed25797a0e6a8f527057b911a238"
  },
  "requestIds": [
    "a63a0667-ffed-40fd-8efe-d70cad8d220c"
  ],
  "firstSchemaStatus": true,
  "firstFullValidationStatus": true,
  "recoveryAttempts": 0,
  "finalStatus": "FIRST_PASS_VALID",
  "finalDirection": "BEARISH",
  "horizon": "1h",
  "conviction": "LOW",
  "supportingEvidenceIds": [
    "XMRUSDT:price.closed1h",
    "XMRUSDT:oi.1h",
    "XMRUSDT:price.closed4h",
    "XMRUSDT:price.closed24h",
    "XMRUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "XMRUSDT:directional.price.previous1h",
    "XMRUSDT:volume.relative5m"
  ],
  "mechanismHypothesis": {
    "type": "CONTRACT_CONTRACTION_COMPATIBLE",
    "evidenceIds": [
      "XMRUSDT:price.closed1h",
      "XMRUSDT:oi.1h"
    ],
    "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
  },
  "directionalRationale": {
    "hypothesis": "CONTINUATION",
    "evidenceIds": [
      "XMRUSDT:price.closed1h",
      "XMRUSDT:oi.1h",
      "XMRUSDT:price.closed4h",
      "XMRUSDT:price.closed24h",
      "XMRUSDT:price.drawdown",
      "XMRUSDT:directional.price.previous1h",
      "XMRUSDT:volume.relative5m"
    ],
    "alternative": "OPPOSITE_MOVE",
    "certainty": "CONDITIONAL_NOT_CONFIRMED"
  },
  "structureEvidenceIds": [],
  "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
  "reassessmentConditions": [
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "PRICE_OPPOSITE_1h"
    },
    {
      "conditionType": "PROGRAM_RULE",
      "ruleId": "OI_REVERSED_1h"
    }
  ],
  "rendererEvidenceMap": {
    "ok": true,
    "status": "PASS",
    "errors": [],
    "claims": [
      {
        "renderedClaim": "支持: XMRUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -0.90019042 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -0.90%",
        "evidenceId": "XMRUSDT:price.closed1h",
        "factsFields": [
          "evidence[3].result",
          "evidence[3].phrase",
          "evidence[3].dataTimes",
          "evidence[3].formula",
          "sources.hour.raw"
        ],
        "value": "-0.90019042",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XMRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: XMRUSDT:oi.1h | OI_QUANTITY_CHANGE | -0.17507436 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -0.18%（不代表资金净流入或多空加仓方向）",
        "evidenceId": "XMRUSDT:oi.1h",
        "factsFields": [
          "evidence[11].result",
          "evidence[11].phrase",
          "evidence[11].dataTimes",
          "evidence[11].formula",
          "sources.oi.raw"
        ],
        "value": "-0.17507436",
        "unit": "%",
        "window": "1h",
        "scope": null,
        "dataTimes": [
          1791601200000,
          1791604800000
        ],
        "source": {
          "endpoint": "/futures/data/openInterestHist",
          "params": {
            "symbol": "XMRUSDT",
            "period": "1h",
            "limit": 30,
            "endTime": 1791604815949
          },
          "formula": "(sumOpenInterest_end / sumOpenInterest_start - 1) * 100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: XMRUSDT:price.closed4h | PRICE_CLOSED_CHANGE | -0.70537900 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 -0.71%",
        "evidenceId": "XMRUSDT:price.closed4h",
        "factsFields": [
          "evidence[4].result",
          "evidence[4].phrase",
          "evidence[4].dataTimes",
          "evidence[4].formula",
          "sources.hour.raw"
        ],
        "value": "-0.70537900",
        "unit": "%",
        "window": "4h",
        "scope": null,
        "dataTimes": [
          1791590400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XMRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: XMRUSDT:price.closed24h | PRICE_CLOSED_CHANGE | -4.53063040 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 -4.53%",
        "evidenceId": "XMRUSDT:price.closed24h",
        "factsFields": [
          "evidence[5].result",
          "evidence[5].phrase",
          "evidence[5].dataTimes",
          "evidence[5].formula",
          "sources.hour.raw"
        ],
        "value": "-4.53063040",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791518400000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XMRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(close_end/open_start-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "支持: XMRUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -6.18716305 % | window=24h | observedAt=2026-10-10T04:00:09.223Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -6.19%",
        "evidenceId": "XMRUSDT:price.drawdown",
        "factsFields": [
          "evidence[7].result",
          "evidence[7].phrase",
          "evidence[7].dataTimes",
          "evidence[7].formula",
          "sources.hour.raw"
        ],
        "value": "-6.18716305",
        "unit": "%",
        "window": "24h",
        "scope": null,
        "dataTimes": [
          1791604799999,
          1791604809223
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XMRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(lastPrice/high-1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: XMRUSDT:directional.price.previous1h | PREVIOUS_PRICE_CHANGE | 0.44824855 % | window=1h | observedAt=2026-10-10T02:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 此前已收盘1小时价格变化 0.45%",
        "evidenceId": "XMRUSDT:directional.price.previous1h",
        "factsFields": [
          "sources.hour.raw (previous equal-length closed bars: [1] open, [4] close, [0]/[6] times)"
        ],
        "value": "0.44824855",
        "unit": "%",
        "window": "1h",
        "scope": "PREVIOUS_PRICE_WINDOW",
        "dataTimes": [
          1791597600000,
          1791601199999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XMRUSDT",
            "interval": "1h",
            "limit": 80,
            "endTime": 1791604815949
          },
          "formula": "(previous equal-length closed window close/open - 1)*100"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      },
      {
        "renderedClaim": "冲突: XMRUSDT:volume.relative5m | RELATIVE_VOLUME | 2.79837281 multiple | window=5m | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘5分钟成交量为前24根均值的 2.80 倍",
        "evidenceId": "XMRUSDT:volume.relative5m",
        "factsFields": [
          "evidence[9].result",
          "evidence[9].phrase",
          "evidence[9].dataTimes",
          "evidence[9].formula",
          "sources.hour.raw"
        ],
        "value": "2.79837281",
        "unit": "multiple",
        "window": "5m",
        "scope": null,
        "dataTimes": [
          1791597300000,
          1791604799999
        ],
        "source": {
          "endpoint": "/fapi/v1/klines",
          "params": {
            "symbol": "XMRUSDT",
            "interval": "5m",
            "limit": 40,
            "endTime": 1791604815949
          },
          "formula": "last closed base volume / preceding 24 closed bars mean"
        },
        "additionalPhraseNumbers": "All inherited phrase numerals checked byte-for-byte against revalidated original Facts phrase; not model prose."
      }
    ],
    "programRules": [
      {
        "renderedRule": {
          "id": "PRICE_OPPOSITE_1h",
          "horizon": "1h",
          "metric": "PRICE_CLOSED_CHANGE",
          "operator": "GTE",
          "threshold": 1,
          "outcome": "INVALIDATED",
          "description": "后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守",
          "baselineEvidenceId": "XMRUSDT:price.closed1h"
        },
        "baselineFactsEvidenceId": "XMRUSDT:price.closed1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(1, abs(current price change)/2)"
      },
      {
        "renderedRule": {
          "id": "OI_REVERSED_1h",
          "horizon": "1h",
          "metric": "OI_QUANTITY_CHANGE",
          "operator": "GTE",
          "threshold": 5,
          "outcome": "THESIS_WARNING",
          "description": "后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核",
          "baselineEvidenceId": "XMRUSDT:oi.1h"
        },
        "baselineFactsEvidenceId": "XMRUSDT:oi.1h",
        "thresholdSource": "Existing deterministic directionalInput rule formula (not a market observation)",
        "formula": "opposite sign * max(5, abs(current OI quantity change)/2)"
      }
    ],
    "otherNumerals": "Version/horizon/time metadata and existing deterministic rule thresholds; no model market numerical fields are allowed by strict business schema."
  },
  "validationErrors": [
    {
      "attempt": 1,
      "errors": [],
      "diagnostics": []
    }
  ],
  "qualityReview": {
    "status": "UNCERTAIN",
    "directionalInclination": "PASS",
    "futureHorizon": "PASS",
    "supportEvidence": "PASS",
    "majorConflictConsideration": "PASS",
    "unaddressedOpposingPriceIds": [],
    "unsupportedCausality": "PASS",
    "beyondPastFactRecap": "UNCERTAIN",
    "conditionalHypothesis": "PASS",
    "observableReassessment": "PASS",
    "concreteTradeOpportunity": "NOT_APPLICABLE",
    "directionSeparatedFromTrade": "PASS",
    "noEdgeReason": "NOT_APPLICABLE",
    "limitation": "Finite hypothesis/evidence enums cannot expose detailed reasoning or prove predictive edge. Correct IDs do not establish interpretive relevance; no outcome-based assessment performed.",
    "manualOverall": "UNCERTAIN",
    "manualEvidenceRoleRelevance": "UNCERTAIN",
    "manualNotes": "1h价格-0.900190%、OI-0.175074%，保留LOW；前期上涨及5m相对量2.798373倍列为冲突。低位移仍选BEARISH且无详细优势论证，是否优于NO_EDGE无法从有限枚举确认。",
    "futurePredictionAccuracy": "NOT_APPLICABLE",
    "outcomesAccessed": false,
    "formalValidatorUnchanged": true
  },
  "tokenUsageByAttempt": [
    {
      "attempt": 1,
      "usage": {
        "prompt_tokens": 6154,
        "completion_tokens": 409,
        "total_tokens": 6563,
        "prompt_tokens_details": {
          "cached_tokens": 1280
        },
        "prompt_cache_hit_tokens": 1280,
        "prompt_cache_miss_tokens": 4874
      }
    }
  ],
  "rawResponsePaths": [
    "validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/raw_responses/a63a0667-ffed-40fd-8efe-d70cad8d220c.json"
  ]
}
```

Rendered Text（原Renderer，未后置修辞改写）：

```text
STRUCTURED_ANALYST_V4_EXPERIMENT
NOT_PRODUCTION | LIVE_MODEL_RESPONSE | causalBacktestEligible=false
XMRUSDT BEARISH / 1h / LOW
originalEvaluationTime=2026-10-10T04:00:15.949Z; POST_COLLECTION_HISTORICAL_RESEARCH
支持: XMRUSDT:price.closed1h | PRICE_CLOSED_CHANGE | -0.90019042 % | window=1h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘1小时价格变化 -0.90%
支持: XMRUSDT:oi.1h | OI_QUANTITY_CHANGE | -0.17507436 % | window=1h | observedAt=2026-10-10T04:00:00.000Z | availableAt=UNKNOWN | /futures/data/openInterestHist | 1小时OI数量变化 -0.18%（不代表资金净流入或多空加仓方向）
支持: XMRUSDT:price.closed4h | PRICE_CLOSED_CHANGE | -0.70537900 % | window=4h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘4小时价格变化 -0.71%
支持: XMRUSDT:price.closed24h | PRICE_CLOSED_CHANGE | -4.53063040 % | window=24h | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 截至北京时间12:00，已收盘24小时价格变化 -4.53%
支持: XMRUSDT:price.drawdown | SNAPSHOT_DRAWDOWN | -6.18716305 % | window=24h | observedAt=2026-10-10T04:00:09.223Z | availableAt=UNKNOWN | /fapi/v1/klines | 已收盘24小时区间高点至快照最新价变化 -6.19%
冲突: XMRUSDT:directional.price.previous1h | PREVIOUS_PRICE_CHANGE | 0.44824855 % | window=1h | observedAt=2026-10-10T02:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 此前已收盘1小时价格变化 0.45%
冲突: XMRUSDT:volume.relative5m | RELATIVE_VOLUME | 2.79837281 multiple | window=5m | observedAt=2026-10-10T03:59:59.999Z | availableAt=UNKNOWN | /fapi/v1/klines | 最近已收盘5分钟成交量为前24根均值的 2.80 倍
机制假设: 与合约规模收缩相容，不确认具体开平仓行为。不能凭这些统计确认具体参与者开仓、平仓、强平或资金流向。
未来研究: 条件性延续假设；竞争情景=OPPOSITE_MOVE，并非已证实事实。
交易机会: WAIT_FOR_CONFIRMATION
PRICE_OPPOSITE_1h: PRICE_CLOSED_CHANGE GTE 1% => INVALIDATED; 后续新收盘滚动1h价格变化≥1.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守
OI_REVERSED_1h: OI_QUANTITY_CHANGE GTE 5% => THESIS_WARNING; 后续新采样精确1h OI数量变化≥5.0000%，原敞口变化条件明显逆转，只触发复核
```

## Q1–Q25

Q1. 10个独立样本，Batch A5、B5；未重复symbol+originalEvaluationTime。

Q2. 11次真实DeepSeek HTTP调用，API失败0，SDK重试0，保守预算预约11。

Q3. 是，11/11来源及请求/响应/输入哈希、模型与样本绑定通过。

Q4. 没有模型自报来源或关联错误；服务端请求认证ID未被客户端暴露，保持UNKNOWN/null。

Q5. 是，5样本6响应通过独立事实重建/来源/渲染/生产哈希审计。

Q6. 已执行第二批5个，安全门槛通过且无系统性固定错误。

Q7. 首次Schema10/10，JSON10/10。

Q8. 首次完整9/10。

Q9. 最终10/10；仅1条Recovery_1，Recovery_2=0。

Q10. BULLISH3、BEARISH6、BULLISH_REVERSAL0、BEARISH_REVERSAL1、NO_EDGE0。

Q11. 没有实际未知Evidence ID；Mock反例仍拒绝。

Q12. 有：PIXEL首次真实价格/OI Evidence却选收缩，OI实际增加；MECHANISM_SIGN_MISMATCH。

Q13. 实际响应没有；11次structureEvidenceIds=[]。真实非法结构攻击覆盖NOT_TESTED。

Q14. 实际发生的1次机制错误已拒绝，Renderer text=null。未发生结构/未知ID错误不声称实测拒绝率。

Q15. 是，10合法文本70事实行及20条规则均可溯源；规则阈值与元数据和市场观察分开标记。

Q16. 尚无可确认的整体FAIL，10整体UNCERTAIN；枚举不能证明详细研究质量，正式PASS不等于质量PASS。证据角色疑点保留。

Q17. 能生成形式上合理的条件性未来1h假设及竞争情景；超出过去涨跌复述的独立优势UNKNOWN。

Q18. UNKNOWN，本轮有效NO_EDGE=0，不能评估充分性或逃避分析。

Q19. 是，10份都有实际PROGRAM_RULE价格失效/OI警告；抽象观察只复核，不伪装机械失效。未集成期满运行状态。

Q20. 本轮显式引用及确定性数值/结构限制减少了自由文本事实歧义；非配对比较，不证明预测提升。

Q21. 没有共有固定合同错误；仅PIXEL首轮机制符号错且一次恢复成功。

Q22. 是，649/649测试、76/76静态。原632与74保留。

Q23. 没有；2567既存文件哈希不变、2103生产data文件无新增，.env等原样。

Q24. 没有Binance、DingTalk、交易、Scanner、后台或Shadow；唯一真实API是DeepSeek。

Q25. 具备提议下一轮只读Shadow工程集成验证的合同条件；严格因果资格和预测效果仍未证明，必须先记录实时数据可用与预测发布时刻。本轮未启动。
