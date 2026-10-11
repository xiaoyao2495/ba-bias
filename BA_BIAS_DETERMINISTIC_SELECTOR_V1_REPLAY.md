# BA_BIAS_DETERMINISTIC_SELECTOR_V1_REPLAY

仅冻结真实Facts及研究开始前已确认SENT的历史；既有SENT的generatedAt、evaluationTime、acknowledgedAt均早于该轮研究起点才用作历史。没有使用后续价格、模型方向/表现或旧Judge作为正确答案。实际外部请求0、生产History/Outbox写入0。

| Run | Facts | 原异常候选 | 门槛拒绝（含无深查异常） | 无实质更新 | 去重重复 | 合格 | 入选 | 排名未入选 | 预计V4首次 | 旧输出 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| hourly_20261011_1200 | 53 | 47 | 28 | 2 | 0 | 23 | 3 | 20 | 3 | 44 |
| hourly_20261011_1400 | 49 | 42 | 30 | 13 | 0 | 6 | 3 | 3 | 3 | 14 |
| hourly_20261011_1600 | 47 | 40 | 31 | 7 | 0 | 9 | 3 | 6 | 3 | 0 |

## hourly_20261011_1200

### LAUSDT：第1，61.475722分

硬门槛：{'families': 4, 'strongest': 2.60017, 'extreme': False, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|8.644149|LAUSDT:price.rolling24h|
|OI_ABNORMALITY|10.704695|LAUSDT:oi.4h|
|FUNDING_EXTREMITY|17.334467|LAUSDT:funding.latest|
|VOLUME_ABNORMALITY|4.792412|LAUSDT:volume.relative1h|
|CROSS_METRIC_CONFIRMATION|15|PRICE_EXTREMITY,OI_ABNORMALITY,FUNDING_EXTREMITY,VOLUME_ABNORMALITY|
|MATERIAL_CHANGE|5|LAUSDT:oi.4h,LAUSDT:oi.24h,LAUSDT:funding.latest|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "oi",
    "previous": 0.70558735,
    "current": "16.05704214",
    "delta": 15.35145479,
    "threshold": 10,
    "evidenceIds": [
      "LAUSDT:oi.4h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": 2.48186519,
    "current": "20.22857257",
    "delta": 17.74670738,
    "threshold": 10,
    "evidenceIds": [
      "LAUSDT:oi.24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "funding",
    "previous": -0.052779,
    "current": "-0.26001700",
    "delta": -0.207238,
    "threshold": 0.05,
    "evidenceIds": [
      "LAUSDT:funding.latest"
    ]
  },
  {
    "type": "NEW_IMPORTANT_ANOMALY",
    "kind": "OI_4H",
    "evidenceIds": [
      "LAUSDT:oi.4h"
    ]
  },
  {
    "type": "NEW_IMPORTANT_ANOMALY",
    "kind": "FUNDING_EXTREME",
    "evidenceIds": [
      "LAUSDT:funding.latest"
    ]
  }
]
```
### MAGICUSDT：第2，54.521267分

硬门槛：{'families': 3, 'strongest': 4.5428449575, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|MAGICUSDT:price.rolling24h|
|FUNDING_EXTREMITY|9.521267|MAGICUSDT:funding.latest|
|ACCOUNT_DISTRIBUTION|10|MAGICUSDT:global.flip|
|CROSS_METRIC_CONFIRMATION|10|PRICE_EXTREMITY,FUNDING_EXTREMITY,ACCOUNT_DISTRIBUTION|
|MATERIAL_CHANGE|5|MAGICUSDT:price.rolling24h,MAGICUSDT:oi.24h,MAGICUSDT:funding.latest,MAGICUSDT:global.flip,MAGICUSDT:topAccounts.short.change24h,MAGICUSDT:topAccounts.long.change24h|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "price",
    "previous": 34.81983133,
    "current": "-36.34275966",
    "delta": -71.16259099,
    "threshold": 15,
    "evidenceIds": [
      "MAGICUSDT:price.rolling24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": 61.31472985,
    "current": "-32.14811874",
    "delta": -93.46284859,
    "threshold": 10,
    "evidenceIds": [
      "MAGICUSDT:oi.24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "funding",
    "previous": -0.468788,
    "current": "-0.14281900",
    "delta": 0.32596899999999995,
    "threshold": 0.05,
    "evidenceIds": [
      "MAGICUSDT:funding.latest"
    ]
  },
  {
    "type": "ACCOUNT_MATERIAL_CHANGE",
    "evidenceIds": [
      "MAGICUSDT:global.flip",
      "MAGICUSDT:topAccounts.short.change24h",
      "MAGICUSDT:topAccounts.long.change24h"
    ]
  }
]
```
### STRKUSDT：第3，48.537521分

硬门槛：{'families': 3, 'strongest': 5, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|STRKUSDT:price.rolling24h|
|VOLUME_ABNORMALITY|3.537521|STRKUSDT:volume.relative1h|
|ACCOUNT_DISTRIBUTION|10|STRKUSDT:global.flip|
|CROSS_METRIC_CONFIRMATION|10|PRICE_EXTREMITY,VOLUME_ABNORMALITY,ACCOUNT_DISTRIBUTION|
|MATERIAL_CHANGE|5|STRKUSDT:price.rolling24h,STRKUSDT:oi.24h,STRKUSDT:global.flip|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "price",
    "previous": 5.81167924,
    "current": "44.68804980",
    "delta": 38.87637056,
    "threshold": 15,
    "evidenceIds": [
      "STRKUSDT:price.rolling24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": -8.7637654,
    "current": "18.29636076",
    "delta": 27.06012616,
    "threshold": 10,
    "evidenceIds": [
      "STRKUSDT:oi.24h"
    ]
  },
  {
    "type": "ACCOUNT_MATERIAL_CHANGE",
    "evidenceIds": [
      "STRKUSDT:global.flip"
    ]
  },
  {
    "type": "NEW_IMPORTANT_ANOMALY",
    "kind": "PRICE_24H",
    "evidenceIds": [
      "STRKUSDT:price.rolling24h"
    ]
  }
]
```

未入选具体对照（更多逐币种记录见JSON）：

|Symbol|状态|原因|分数/排名|
|---|---|---|---|
|2ZUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|26.666667 / 17|
|AGTUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|API3USDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|
|APRUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|25 / 20|
|ARCUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|ARXUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|27.112987 / 15|
|BRUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|27.051779 / 16|
|CHIPUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|40 / 7|
|ENSUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|30 / 13|
|ERAUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|41.425307 / 5|
|GENIUSUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|

极端单项通过但排名未入选：APRUSDT（25分/第20）, CHIPUSDT（40分/第7）, ENSUSDT（30分/第13）, ERAUSDT（41.425307分/第5）, JCTUSDT（40分/第8）, LUMIAUSDT（36.476667分/第10）, TIAUSDT（25分/第21）, USUSDT（40分/第9）, WALUSDT（43.07713分/第4）。通过极端入口不保证超过所有强多指标事件；不使用题材或后来涨跌强插排名。

## hourly_20261011_1400

### LUMIAUSDT：第1，80.066156分

硬门槛：{'families': 4, 'strongest': 5, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|LUMIAUSDT:price.rolling24h|
|OI_ABNORMALITY|20|LUMIAUSDT:oi.4h|
|VOLUME_ABNORMALITY|5.066156|LUMIAUSDT:volume.relative1h|
|ACCOUNT_DISTRIBUTION|15|LUMIAUSDT:topAccounts.short.change24h,LUMIAUSDT:topAccounts.long.change24h,LUMIAUSDT:topAccounts.short.change4h,LUMIAUSDT:topAccounts.long.change4h,LUMIAUSDT:topAccounts.short.change1h,LUMIAUSDT:topAccounts.long.change1h|
|CROSS_METRIC_CONFIRMATION|15|PRICE_EXTREMITY,OI_ABNORMALITY,VOLUME_ABNORMALITY,ACCOUNT_DISTRIBUTION|
|MATERIAL_CHANGE|5|LUMIAUSDT:price.rolling24h,LUMIAUSDT:oi.1h,LUMIAUSDT:oi.24h,LUMIAUSDT:global.short.change24h,LUMIAUSDT:global.long.change24h,LUMIAUSDT:global.short.change4h,LUMIAUSDT:global.long.change4h,LUMIAUSDT:global.flip,LUMIAUSDT:topAccounts.short.change24h,LUMIAUSDT:topAccounts.long.change24h,LUMIAUSDT:topAccounts.short.change4h,LUMIAUSDT:topAccounts.long.change4h,LUMIAUSDT:topAccounts.short.change1h,LUMIAUSDT:topAccounts.long.change1h,LUMIAUSDT:topPositions.short.change24h,LUMIAUSDT:topPositions.long.change24h|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "price",
    "previous": 80.85132039,
    "current": "107.29680915",
    "delta": 26.445488760000003,
    "threshold": 15,
    "evidenceIds": [
      "LUMIAUSDT:price.rolling24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi1",
    "previous": 29.40144255,
    "current": "4.46183345",
    "delta": -24.9396091,
    "threshold": 10,
    "evidenceIds": [
      "LUMIAUSDT:oi.1h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": 126.34779696,
    "current": "136.67236173",
    "delta": 10.32456477000001,
    "threshold": 10,
    "evidenceIds": [
      "LUMIAUSDT:oi.24h"
    ]
  },
  {
    "type": "ACCOUNT_MATERIAL_CHANGE",
    "evidenceIds": [
      "LUMIAUSDT:global.short.change24h",
      "LUMIAUSDT:global.long.change24h",
      "LUMIAUSDT:global.short.change4h",
      "LUMIAUSDT:global.long.change4h",
      "LUMIAUSDT:global.flip",
      "LUMIAUSDT:topAccounts.short.change24h",
      "LUMIAUSDT:topAccounts.long.change24h",
      "LUMIAUSDT:topAccounts.short.change4h",
      "LUMIAUSDT:topAccounts.long.change4h",
      "LUMIAUSDT:topAccounts.short.change1h",
      "LUMIAUSDT:topAccounts.long.change1h",
      "LUMIAUSDT:topPositions.short.change24h",
      "LUMIAUSDT:topPositions.long.change24h"
    ]
  }
]
```
### ERAUSDT：第2，58.885474分

硬门槛：{'families': 3, 'strongest': 4.13158, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|ERAUSDT:price.rolling24h|
|FUNDING_EXTREMITY|20|ERAUSDT:funding.latest|
|VOLUME_ABNORMALITY|3.885474|ERAUSDT:volume.relative5m|
|CROSS_METRIC_CONFIRMATION|10|PRICE_EXTREMITY,FUNDING_EXTREMITY,VOLUME_ABNORMALITY|
|MATERIAL_CHANGE|5|ERAUSDT:price.rolling24h,ERAUSDT:oi.4h,ERAUSDT:oi.24h|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "price",
    "previous": 8.42647059,
    "current": "27.58977390",
    "delta": 19.163303310000003,
    "threshold": 15,
    "evidenceIds": [
      "ERAUSDT:price.rolling24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi",
    "previous": -6.45220057,
    "current": "4.79518310",
    "delta": 11.24738367,
    "threshold": 10,
    "evidenceIds": [
      "ERAUSDT:oi.4h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": 58.23668481,
    "current": "69.35062899",
    "delta": 11.113944180000004,
    "threshold": 10,
    "evidenceIds": [
      "ERAUSDT:oi.24h"
    ]
  }
]
```
### JCTUSDT：第3，55.000000分

硬门槛：{'families': 3, 'strongest': 4.368267665, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|JCTUSDT:price.rolling24h|
|VOLUME_ABNORMALITY|10|JCTUSDT:volume.relative5m|
|ACCOUNT_DISTRIBUTION|10|JCTUSDT:global.flip|
|CROSS_METRIC_CONFIRMATION|10|PRICE_EXTREMITY,VOLUME_ABNORMALITY,ACCOUNT_DISTRIBUTION|
|MATERIAL_CHANGE|5|JCTUSDT:volume.relative5m|

更新证据：

```json
[
  {
    "type": "NEW_IMPORTANT_ANOMALY",
    "kind": "VOLUME_SPIKE",
    "evidenceIds": [
      "JCTUSDT:volume.relative5m"
    ]
  }
]
```

未入选具体对照（更多逐币种记录见JSON）：

|Symbol|状态|原因|分数/排名|
|---|---|---|---|
|1000FLOKIUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ACHUSDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|
|AGTUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|APRUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|ARCUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARKUSDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|
|ARUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARXUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|BRUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|CHIPUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|CHZUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|EDGEUSDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|

极端单项通过但排名未入选：USUSDT（40分/第5）。通过极端入口不保证超过所有强多指标事件；不使用题材或后来涨跌强插排名。

## hourly_20261011_1600

### CFXUSDT：第1，71.231085分

硬门槛：{'families': 5, 'strongest': 4.25166732, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|CFXUSDT:price.rolling24h|
|OI_ABNORMALITY|13.179298|CFXUSDT:oi.4h|
|VOLUME_ABNORMALITY|5.351788|CFXUSDT:volume.relative1h|
|FUNDING_EXTREMITY|6.666667|CFXUSDT:funding.change,CFXUSDT:funding.latest|
|ACCOUNT_DISTRIBUTION|6.033333|CFXUSDT:topPositions.short.change24h,CFXUSDT:topPositions.long.change24h|
|CROSS_METRIC_CONFIRMATION|15|PRICE_EXTREMITY,OI_ABNORMALITY,VOLUME_ABNORMALITY,FUNDING_EXTREMITY,ACCOUNT_DISTRIBUTION|
|MATERIAL_CHANGE|5|CFXUSDT:price.rolling24h,CFXUSDT:oi.24h,CFXUSDT:volume.relative1h|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "price",
    "previous": 8.4053891,
    "current": "34.01333856",
    "delta": 25.60794946,
    "threshold": 15,
    "evidenceIds": [
      "CFXUSDT:price.rolling24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": 15.87016378,
    "current": "96.84573182",
    "delta": 80.97556804,
    "threshold": 10,
    "evidenceIds": [
      "CFXUSDT:oi.24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "volume",
    "previous": 11.83837144,
    "current": "3.21107250",
    "delta": -8.62729894,
    "threshold": 2,
    "evidenceIds": [
      "CFXUSDT:volume.relative1h"
    ]
  }
]
```
### LUMIAUSDT：第2，70.000000分

硬门槛：{'families': 3, 'strongest': 4.3586450475, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|20|LUMIAUSDT:price.rolling24h|
|OI_ABNORMALITY|20|LUMIAUSDT:oi.4h|
|ACCOUNT_DISTRIBUTION|15|LUMIAUSDT:topAccounts.short.change4h,LUMIAUSDT:topAccounts.long.change4h,LUMIAUSDT:topAccounts.short.change24h,LUMIAUSDT:topAccounts.long.change24h|
|CROSS_METRIC_CONFIRMATION|10|PRICE_EXTREMITY,OI_ABNORMALITY,ACCOUNT_DISTRIBUTION|
|MATERIAL_CHANGE|5|LUMIAUSDT:price.rolling24h,LUMIAUSDT:oi.24h,LUMIAUSDT:global.short.change4h,LUMIAUSDT:global.long.change4h,LUMIAUSDT:global.short.change24h,LUMIAUSDT:global.long.change24h,LUMIAUSDT:global.flip,LUMIAUSDT:topAccounts.short.change4h,LUMIAUSDT:topAccounts.long.change4h,LUMIAUSDT:topAccounts.short.change24h,LUMIAUSDT:topAccounts.long.change24h|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "price",
    "previous": 107.29680915,
    "current": "34.86916038",
    "delta": -72.42764877,
    "threshold": 15,
    "evidenceIds": [
      "LUMIAUSDT:price.rolling24h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "oi24",
    "previous": 136.67236173,
    "current": "78.97631921",
    "delta": -57.696042520000006,
    "threshold": 10,
    "evidenceIds": [
      "LUMIAUSDT:oi.24h"
    ]
  },
  {
    "type": "ACCOUNT_MATERIAL_CHANGE",
    "evidenceIds": [
      "LUMIAUSDT:global.short.change4h",
      "LUMIAUSDT:global.long.change4h",
      "LUMIAUSDT:global.short.change24h",
      "LUMIAUSDT:global.long.change24h",
      "LUMIAUSDT:global.flip",
      "LUMIAUSDT:topAccounts.short.change4h",
      "LUMIAUSDT:topAccounts.long.change4h",
      "LUMIAUSDT:topAccounts.short.change24h",
      "LUMIAUSDT:topAccounts.long.change24h"
    ]
  }
]
```
### ERAUSDT：第3，63.928526分

硬门槛：{'families': 3, 'strongest': 5, 'extreme': True, 'resonance': True}。事件：MATERIAL_UPDATE；原因：MATERIAL_EVIDENCE_CHANGE。

|维度|分数|可复核来源|
|---|---:|---|
|PRICE_EXTREMITY|18.634996|ERAUSDT:price.rolling24h|
|OI_ABNORMALITY|10.29353|ERAUSDT:oi.4h|
|FUNDING_EXTREMITY|20|ERAUSDT:funding.latest|
|CROSS_METRIC_CONFIRMATION|10|PRICE_EXTREMITY,OI_ABNORMALITY,FUNDING_EXTREMITY|
|MATERIAL_CHANGE|5|ERAUSDT:oi.4h,ERAUSDT:funding.latest|

更新证据：

```json
[
  {
    "type": "METRIC_DELTA",
    "metric": "oi",
    "previous": 4.7951831,
    "current": "15.44029500",
    "delta": 10.6451119,
    "threshold": 10,
    "evidenceIds": [
      "ERAUSDT:oi.4h"
    ]
  },
  {
    "type": "METRIC_DELTA",
    "metric": "funding",
    "previous": -0.413158,
    "current": "-1.37827100",
    "delta": -0.965113,
    "threshold": 0.05,
    "evidenceIds": [
      "ERAUSDT:funding.latest"
    ]
  },
  {
    "type": "NEW_IMPORTANT_ANOMALY",
    "kind": "OI_4H",
    "evidenceIds": [
      "ERAUSDT:oi.4h"
    ]
  }
]
```

未入选具体对照（更多逐币种记录见JSON）：

|Symbol|状态|原因|分数/排名|
|---|---|---|---|
|2ZUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|AGTUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|AKTUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|APRUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARCUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARKUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARUSDT|LOW_RESEARCH_VALUE|BELOW_RESEARCH_GATE|None / None|
|ARXUSDT|NO_MATERIAL_UPDATE|NO_MATERIAL_CHANGE|None / None|
|AUSDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|
|BEAMXUSDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|
|CCUSDT|QUALIFIED_BUT_NOT_SELECTED|RANK_BELOW_TOP_K|15 / 9|
|CETUSUSDT|LOW_RESEARCH_VALUE|NO_DEEP_ANOMALY|None / None|

极端单项通过但排名未入选：CCUSDT（15分/第9）, MINAUSDT（40分/第5）, USUSDT（40分/第6）。通过极端入口不保证超过所有强多指标事件；不使用题材或后来涨跌强插排名。

## 解释与局限

12:00 LA分数高于MAGIC，因四类指标贡献及共振，不能把多个价格窗口再重复加分。MAGIC/STRK仍有独立极端入口。14:00 LUMIA/ERA/JCT与16:00 CFX/LUMIA/ERA由当时指标和新的事实变化入选；详细分项保存在上表和JSON。低幅单一成交量、仅账户历史翻转背景/普通变化、无实质变化的旧故事被程序抑制。

硬门槛是初始可解释研究规则，未验证预测收益。历史稀有性没有完整观测分母，明确UNKNOWN、0分。账户/顶部持仓分布在同一账户类取最大强度，防止相关统计机械叠加；各口径事实仍完整保留进入V4。

16:00旧Judge全部请求异常，不能作为市场无价值标签。此前持久化记录未保存HTTP正文，本轮没有请求去重新证明额度耗尽原因。

旧Judge首次逻辑调用合计129，新版0；旧V4首次64，新版预计9。旧两业务环节合计193对比新版9，减少184次（95.34%），均为首次逻辑调用口径，不含HTTP重试/受控Recovery。新版16:00预计3，比旧实际0增加，说明没有为了显示节省而全部拒绝。没有将9个入选等同9份有效模型结果或9条已发送消息。

回放按各轮原历史分别评估，不把旧3轮事实回放生成新的生产状态。它不是“采用新Selector后的连续小时历史仿真”；若实际新系统早轮只发送3条，后续历史基准会不同，实际入选可能变化。

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/replay.json)

[scripts/selector-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/selector-replay.js)
