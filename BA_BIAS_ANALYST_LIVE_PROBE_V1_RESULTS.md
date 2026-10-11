# BA_BIAS_ANALYST_LIVE_PROBE_V1_RESULTS

本报告仅包含真实API响应；30份原始响应未修改，10个样本最终均FINAL_INVALID。辅助Mock/只读诊断不计入任何实时成功率。

| Symbol | RunId | evaluationTime | 首次Schema | 首次完整 | 恢复次数 | 最终状态 | 原始首次→末次方向（均未通过） |
|---|---|---|---|---|---|---|---|
| ERAUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | BULLISH → BULLISH |
| MAGICUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | BEARISH → BEARISH |
| APRUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | BEARISH_REVERSAL → BULLISH_REVERSAL |
| USUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | BEARISH → BEARISH |
| BATUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | BEARISH → BEARISH |
| WIFUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | NO_EDGE → NO_EDGE |
| AIOTUSDT | hourly_20261010_2200 | 2026-10-10T14:00:12.629Z | true | INVALID | 2 | FINAL_INVALID | BULLISH → BULLISH |
| AGTUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | true | INVALID | 2 | FINAL_INVALID | BEARISH_REVERSAL → BEARISH |
| NIGHTUSDT | hourly_20261010_2100 | 2026-10-10T13:00:15.062Z | false | INVALID | 2 | FINAL_INVALID | BEARISH → BEARISH |
| WLFIUSDT | hourly_20261010_2200 | 2026-10-10T14:00:12.629Z | true | INVALID | 2 | FINAL_INVALID | NO_EDGE → NO_EDGE |

## ERAUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/ERAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ERAUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量27；质量合格且所有可引用时间不晚于evaluationTime。选择理由：任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "ERAUSDT:price.rolling24h"
    ],
    "value": "33.39205637",
    "threshold": 8,
    "strength": 4.17400704625
  },
  {
    "kind": "OI_4H",
    "evidenceIds": [
      "ERAUSDT:oi.4h"
    ],
    "value": "11.48806530",
    "threshold": 10,
    "strength": 1.14880653
  },
  {
    "kind": "FUNDING_EXTREME",
    "evidenceIds": [
      "ERAUSDT:funding.latest"
    ],
    "value": "-1.00633100",
    "threshold": 0.1,
    "strength": 5
  },
  {
    "kind": "VOLUME_SPIKE",
    "evidenceIds": [
      "ERAUSDT:volume.relative1h"
    ],
    "value": "2.20117406",
    "threshold": 2,
    "strength": 1.10058703
  },
  {
    "kind": "FUNDING_CHANGE",
    "evidenceIds": [
      "ERAUSDT:funding.change",
      "ERAUSDT:funding.latest"
    ],
    "value": "-0.99372100",
    "strength": 1
  }
]
```

原始最后响应方向BULLISH、horizon=4h、conviction=MODERATE、tradeOpportunity=WAIT_FOR_PULLBACK，上述均非验证通过研判。

```json
{
  "marketThesis": "已收盘4h价格上行3.18%且OI数量同步增加11.49%，此前4h价格已上行19.02%，显示上涨伴随敞口扩张；最近已收盘1h成交量达前24根均值2.20倍，1h价格续涨1.97%，动能尚未明显衰竭。但24h区间高点至快照最新价回撤-8.63%，已结算Funding -1.0063%为空头支付多头，24h账户空方占比上升2.22个百分点，追多拥挤与回撤风险并存，倾向4h内偏多但强度受限。",
  "marketMechanism": "价格上行与同窗口OI数量增加相容于新增多头敞口或空头继续建仓的可能，但OI为合约数量、不代表资金净流入或单侧开平仓方向；最近已结算Funding -1.0063%为空头支付多头，与空头持仓承压或部分空头回补的可能性相容，但无法据此确认强平或单边行为。",
  "supportingEvidenceIds": [
    "ERAUSDT:price.closed4h",
    "ERAUSDT:oi.4h",
    "ERAUSDT:directional.price.previous4h",
    "ERAUSDT:price.closed1h",
    "ERAUSDT:volume.relative1h",
    "ERAUSDT:price.closed24h",
    "ERAUSDT:oi.24h"
  ],
  "conflictingEvidenceIds": [
    "ERAUSDT:price.drawdown",
    "ERAUSDT:funding.latest",
    "ERAUSDT:global.short.change24h",
    "ERAUSDT:global.long.change24h",
    "ERAUSDT:volume.relative5m",
    "ERAUSDT:oi.1h"
  ],
  "preferredScenario": "4h内价格在已收盘4h上行3.18%与OI数量增加11.49%的背景下维持偏强，回撤幅度收窄，1h价格与OI继续同向温和扩张，价格不跌破近期已收盘结构。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_4h",
      "OI_REVERSED_4h"
    ],
    "description": "若后续新收盘滚动4h价格变化≤-1.5883%（PRICE_OPPOSITE_4h）则方向命题失效；若后续新采样精确4h OI数量变化≤-5.7440%（OI_REVERSED_4h）则触发复核，仅表示敞口条件逆转而非结构失守。"
  },
  "alternativeScenario": "若4h内价格上行但OI数量转为收缩，或已结算Funding负值进一步扩大而价格不再创新高，则当前偏多倾向可能转为高位震荡甚至回撤，需重新评估而非直接反手。",
  "followUpChecks": [
    "跟踪后续新收盘4h价格变化是否触及-1.5883%失效阈值，以及精确4h OI数量变化是否≤-5.7440%触发复核。",
    "观察1h价格与OI是否继续同向扩张，以及已结算Funding是否维持空头支付多头；若1h价格转跌且OI收缩，则偏多依据减弱。"
  ]
}
```

人工复核：有4h上行/OI扩张与极端负Funding背景，原始倾向有未来horizon并考虑回撤。仍出现“价格不跌破近期已收盘结构”，实际无可靠结构；“追多拥挤”也未有持仓拥挤证据。自家Symbol、合法裸ID、空方占比表达及局部否定又引发格式/语义误拒绝。不能把整份失败仅解释为格式问题。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE；4725ms；输入/输出token=6256/857；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE；2981ms；输入/输出token=14282/841；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE；3251ms；输入/输出token=14230/841；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json)。

## MAGICUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量28；质量合格且所有可引用时间不晚于evaluationTime。选择理由：任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "MAGICUSDT:price.rolling24h"
    ],
    "value": "38.40888544",
    "threshold": 8,
    "strength": 4.80111068
  },
  {
    "kind": "PRICE_1H",
    "evidenceIds": [
      "MAGICUSDT:price.closed1h"
    ],
    "value": "-5.49237415",
    "threshold": 3,
    "strength": 1.8307913833333334
  },
  {
    "kind": "FUNDING_EXTREME",
    "evidenceIds": [
      "MAGICUSDT:funding.latest"
    ],
    "value": "-0.46878800",
    "threshold": 0.1,
    "strength": 4.68788
  },
  {
    "kind": "FUNDING_CHANGE",
    "evidenceIds": [
      "MAGICUSDT:funding.change",
      "MAGICUSDT:funding.latest"
    ],
    "value": "-0.41135100",
    "strength": 1
  },
  {
    "kind": "ACCOUNT_DOMINANCE_FLIP",
    "value": "CONFIRMED",
    "scope": "GLOBAL_ACCOUNTS",
    "strength": 2,
    "threshold": "strict crossing of 50%; 2 consecutive samples confirm",
    "evidenceIds": [
      "MAGICUSDT:global.flip"
    ]
  }
]
```

原始最后响应方向BEARISH、horizon=1h、conviction=LOW、tradeOpportunity=NO_ACTIONABLE_SETUP，上述均非验证通过研判。

```json
{
  "marketThesis": "24h维度仍为强势上涨（已收盘24h价格变化38.45%，MAGICUSDT:price.closed24h；24h OI数量变化69.02%，MAGICUSDT:oi.24h），但快照最新价较24h区间高点回落-34.53%（MAGICUSDT:price.drawdown），且最近已收盘1h价格变化-5.49%（MAGICUSDT:price.closed1h）伴随1h OI数量变化-0.97%（MAGICUSDT:oi.1h）与1h相对量0.88倍（MAGICUSDT:volume.relative1h），显示短周期上行动能减弱、参与量收缩，1h倾向偏空；因缺少对齐的强扩张OI与主动流数据，强度仅LOW。",
  "marketMechanism": "24h价格大幅上行且24h OI数量变化69.02%（MAGICUSDT:oi.24h），与新增敞口参与上行的可能性相容；随后1h价格-5.49%（MAGICUSDT:price.closed1h）与1h OI数量变化-0.97%（MAGICUSDT:oi.1h）同向收缩，与部分多头减仓或敞口了结的可能性相容，但无法确认单侧开平仓、强平或资金流向。",
  "supportingEvidenceIds": [
    "MAGICUSDT:price.closed1h",
    "MAGICUSDT:oi.1h",
    "MAGICUSDT:volume.relative1h",
    "MAGICUSDT:price.drawdown",
    "MAGICUSDT:volume.relative5m"
  ],
  "conflictingEvidenceIds": [
    "MAGICUSDT:price.closed24h",
    "MAGICUSDT:oi.24h",
    "MAGICUSDT:price.closed4h",
    "MAGICUSDT:funding.latest",
    "MAGICUSDT:global.flip"
  ],
  "preferredScenario": "1h内价格在-5.49%回落（MAGICUSDT:price.closed1h）后延续偏弱整理，OI数量变化维持负向或低位（参考MAGICUSDT:oi.1h），相对量不放大（MAGICUSDT:volume.relative1h），不出现反向强扩张。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_1h",
      "OI_REVERSED_1h"
    ],
    "description": "若后续新收盘滚动1h价格变化≥2.7462%（PRICE_OPPOSITE_1h）则当前1h偏空命题失效；若后续新采样精确1h OI数量变化≥5.0000%（OI_REVERSED_1h）则触发复核，仅提示敞口条件逆转。"
  },
  "alternativeScenario": "若1h价格重新转正并伴随OI数量变化回升至正向扩张（对照MAGICUSDT:price.closed1h与MAGICUSDT:oi.1h），则短周期偏空判断被削弱，行情可能重回24h上行延续（MAGICUSDT:price.closed24h、MAGICUSDT:oi.24h）。",
  "followUpChecks": [
    "跟踪下一根已收盘1h价格变化与同期OI数量变化是否同向：若价格转正且OI回升，则1h偏空倾向减弱；若价格续跌且OI继续收缩，则维持偏弱判断。",
    "观察最近已收盘1h相对量能否回到1倍以上（对照MAGICUSDT:volume.relative1h），以及Funding结算是否延续负值（MAGICUSDT:funding.latest），用于判断参与量与持仓成本条件是否变化。"
  ]
}
```

人工复核：24h上涨/OI扩张、1h价格与OI收缩、-34.53%回撤与相对量0.88倍是真实背景；未来1h偏弱假设有基本支持及24h逆向竞争。主阻断是本Symbol/裸ID误判、回撤描述与相对量指标识别、未来情景中复述基线数字，以及未定义“1倍以上”观察阈值。最后仍失败，不将其作为有效预测计数。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY；4544ms；输入/输出token=6614/1003；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY；3448ms；输入/输出token=15482/1001；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY；3691ms；输入/输出token=15489/1001；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json)。

## APRUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/APRUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/APRUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量27；质量合格且所有可引用时间不晚于evaluationTime。选择理由：任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "APRUSDT:price.rolling24h"
    ],
    "value": "-27.13107241",
    "threshold": 8,
    "strength": 3.39138405125
  },
  {
    "kind": "OI_4H",
    "evidenceIds": [
      "APRUSDT:oi.4h"
    ],
    "value": "53.38728908",
    "threshold": 10,
    "strength": 5
  },
  {
    "kind": "VOLUME_SPIKE",
    "evidenceIds": [
      "APRUSDT:volume.relative1h"
    ],
    "value": "4.12980293",
    "threshold": 2,
    "strength": 2.064901465
  }
]
```

原始最后响应方向BULLISH_REVERSAL、horizon=1h、conviction=LOW、tradeOpportunity=WAIT_FOR_CONFIRMATION，上述均非验证通过研判。

```json
{
  "marketThesis": "24h已收盘价格变化{{APRUSDT:price.closed24h}}为-27.31%、已收盘24小时区间低点至高点幅度{{APRUSDT:price.rangeLowHigh}}为52.89%、自区间高点回撤{{APRUSDT:price.drawdown}}为-28.38%，中期下行背景明确；但最近已收盘1h价格{{APRUSDT:price.closed1h}}为+2.06%，较此前等长1h窗口{{APRUSDT:directional.price.previous1h}}的-3.96%真实转正，同窗口OI数量{{APRUSDT:oi.1h}}为+1.34%同向扩张，且1h成交量为前24根均值{{APRUSDT:volume.relative1h}}的4.13倍，构成短线反弹尝试。因缺少主动买卖量、CVD与价格结构，且4h/24h仍深度负值，仅给低强度、1h窗口的反弹倾向。",
  "marketMechanism": "价格上行与同窗口OI数量小幅扩张并存，与部分空头回补及新开多头共同参与的可能性相容；但OI为合约数量、不代表资金净流入或单侧开平仓方向，无法确认强平或资金流向。24h OI数量变化{{APRUSDT:oi.24h}}为+76.40%与24h价格{{APRUSDT:price.closed24h}}-27.31%并存，也可能反映下跌过程中敞口累积而非单向建仓。",
  "supportingEvidenceIds": [
    "APRUSDT:price.closed1h",
    "APRUSDT:directional.price.previous1h",
    "APRUSDT:oi.1h",
    "APRUSDT:volume.relative1h",
    "APRUSDT:volume.closed1h"
  ],
  "conflictingEvidenceIds": [
    "APRUSDT:price.closed4h",
    "APRUSDT:price.closed24h",
    "APRUSDT:price.drawdown",
    "APRUSDT:oi.4h",
    "APRUSDT:oi.24h",
    "APRUSDT:funding.latest",
    "APRUSDT:global.long.latest"
  ],
  "preferredScenario": "未来1h内，若价格维持或延续最近已收盘1h的+2.06%转向、且1h OI数量不出现明显收缩，则短线反弹尝试可能延续；但4h/24h深度负值与高波动区间限制其持续性，倾向视为弱反弹而非趋势反转。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_1h",
      "OI_REVERSED_1h"
    ],
    "description": "若后续新收盘滚动1h价格变化≤-1.0296%（PRICE_OPPOSITE_1h），则当前1h反弹方向命题失效；若后续新采样精确1h OI数量变化≤-5.0000%（OI_REVERSED_1h），则原敞口变化条件明显逆转，触发复核。"
  },
  "alternativeScenario": "若1h反弹未能延续，价格重新走弱并伴随1h OI数量收缩，则24h下行背景可能重新主导，短线转向尝试失败；该情形需以实际价格与OI数据确认，而非结构信号。",
  "followUpChecks": [
    "观察后续新收盘1h价格变化是否维持正值，并对照PRICE_OPPOSITE_1h阈值-1.0296%判断1h反弹方向是否失效。",
    "观察后续精确1h OI数量变化是否接近OI_REVERSED_1h阈值-5.0000%，以评估短线敞口条件是否逆转。"
  ]
}
```

人工复核：首次BEARISH_REVERSAL主周期1h与当时真实转向相反：此前1h-3.96039604%、当前+2.05920206%，应是向上转向。第一次恢复改BULLISH_REVERSAL，纠正部分分类和失效规则错误，但正号数字与标注先前窗口仍误拒绝，同时“回补及新开多共同参与”不符合现有OI净扩张时平仓机制规则。未通过，不能宣称反转联调成功。

- Attempt 1：INVALID；Schema=true；错误=REVERSAL_DIRECTION_NOT_SUPPORTED,INVALIDATION_RULE_DIRECTION_CONFLICT,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE；4213ms；输入/输出token=6359/942；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER；4096ms；输入/输出token=14431/1015；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER；3244ms；输入/输出token=14440/1015；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json)。

## USUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/USUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/USUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量27；质量合格且所有可引用时间不晚于evaluationTime。选择理由：任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "USUSDT:price.rolling24h"
    ],
    "value": "-29.47666989",
    "threshold": 8,
    "strength": 3.68458373625
  },
  {
    "kind": "PRICE_1H",
    "evidenceIds": [
      "USUSDT:price.closed1h"
    ],
    "value": "-14.12156033",
    "threshold": 3,
    "strength": 4.707186776666666
  },
  {
    "kind": "ACCOUNT_DISTRIBUTION_SHIFT",
    "scope": "GLOBAL_ACCOUNTS",
    "window": "24h",
    "value": "-16.36000000",
    "unit": "percentage_points",
    "threshold": 15,
    "strength": 1.0906666666666667,
    "evidenceIds": [
      "USUSDT:global.short.change24h",
      "USUSDT:global.long.change24h"
    ]
  }
]
```

原始最后响应方向BEARISH、horizon=1h、conviction=LOW、tradeOpportunity=NO_ACTIONABLE_SETUP，上述均非验证通过研判。

```json
{
  "marketThesis": "已收盘1h价格变化-14.12%（USUSDT:price.closed1h）较此前等长1h窗口+12.84%（USUSDT:directional.price.previous1h）转向下行，同期1h OI数量变化+0.30%（USUSDT:oi.1h）小幅扩张，价格下行与敞口未收缩并存，倾向未来1h维持偏弱；但最近已收盘1h成交量为前24根均值的0.89倍（USUSDT:volume.relative1h），且24h OI数量变化-21.66%（USUSDT:oi.24h）显示中期敞口大幅收缩，强度仅LOW。",
  "marketMechanism": "价格1h下行且同窗口OI数量小幅上升，与新增空头敞口或部分多头承接并存的可能性相容；24h OI数量变化-21.66%（USUSDT:oi.24h）与已收盘24h价格变化-29.18%（USUSDT:price.closed24h）同向收缩，也可能与敞口持续了结的可能性相容。以上均为可能机制，不确认单侧开平仓、强平或资金流向。",
  "supportingEvidenceIds": [
    "USUSDT:price.closed1h",
    "USUSDT:directional.price.previous1h",
    "USUSDT:oi.1h",
    "USUSDT:price.closed24h",
    "USUSDT:oi.24h",
    "USUSDT:price.drawdown"
  ],
  "conflictingEvidenceIds": [
    "USUSDT:volume.relative1h",
    "USUSDT:global.long.change1h",
    "USUSDT:global.short.change1h",
    "USUSDT:funding.latest"
  ],
  "preferredScenario": "未来1h价格延续偏弱，已收盘1h变化维持负值或再度下探，同时1h OI数量不出现明显收缩；若1h相对量继续低于前24根均值，则下行延续力度受限。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_1h",
      "OI_REVERSED_1h"
    ],
    "description": "若后续新收盘滚动1h价格变化≥7.0608%，方向命题按PRICE_OPPOSITE_1h失效；若后续新采样精确1h OI数量变化≤-5.0000%，按OI_REVERSED_1h触发复核。"
  },
  "alternativeScenario": "若未来1h价格转为上行且1h OI数量同步扩张，则当前偏弱倾向被削弱，可能进入反弹修复；但全市场净多/净空头账户空方占比1h从51.07%到50.52%、变化-0.55个百分点（USUSDT:global.short.change1h），最新已结算Funding 0.0075%仍为多头支付空头（USUSDT:funding.latest），账户比例与资金费率翻转本身不足以确认反转。",
  "followUpChecks": [
    "跟踪后续新收盘滚动1h价格变化是否达到+7.0608%以上，以及精确1h OI数量变化是否≤-5.0000%，分别对应方向失效与敞口逆转复核。",
    "观察1h相对量能否回到前24根均值以上，并留意全市场多空账户占比与最新结算Funding是否延续当前方向，以判断下行参与度是否持续。"
  ]
}
```

人工复核：1h实际价格-14.12156033%、OI+0.29952203%且此前价格+12.83734811%；24h价格/OI收缩属于长周期背景。未来1h偏弱并考虑低相对量，有条件假设；早期OI→具体单侧敞口语句及后续条件解释边界需复核。仍有裸ID/正号/口径问题，拒绝状态保留。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER,WRONG_ACCOUNT_OR_OI_SCOPE；4119ms；输入/输出token=6252/738；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,WRONG_ACCOUNT_OR_OI_SCOPE；3264ms；输入/输出token=13604/900；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,WRONG_ACCOUNT_OR_OI_SCOPE；3289ms；输入/输出token=14364/900；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json)。

## BATUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/BATUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量27；质量合格且所有可引用时间不晚于evaluationTime。选择理由：任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "BATUSDT:price.rolling24h"
    ],
    "value": "19.92457574",
    "threshold": 8,
    "strength": 2.4905719675
  },
  {
    "kind": "PRICE_1H",
    "evidenceIds": [
      "BATUSDT:price.closed1h"
    ],
    "value": "-8.08432255",
    "threshold": 3,
    "strength": 2.694774183333333
  },
  {
    "kind": "OI_4H",
    "evidenceIds": [
      "BATUSDT:oi.4h"
    ],
    "value": "13.49855314",
    "threshold": 10,
    "strength": 1.349855314
  },
  {
    "kind": "VOLUME_SPIKE",
    "evidenceIds": [
      "BATUSDT:volume.relative1h"
    ],
    "value": "5.76165114",
    "threshold": 2,
    "strength": 2.88082557
  }
]
```

原始最后响应方向BEARISH、horizon=1h、conviction=MODERATE、tradeOpportunity=WAIT_FOR_CONFIRMATION，上述均非验证通过研判。

```json
{
  "marketThesis": "24h维度仍为强势上涨（已收盘24h +20.98%，BATUSDT:price.closed24h；24h OI数量+60.65%，BATUSDT:oi.24h），但最近1h价格-8.08%与此前1h +7.59%形成同长度反向，且1h OI数量-4.89%，价格与OI同向收缩，配合1h相对量5.76倍，倾向短线偏空；24h区间高点回撤-16.15%（BATUSDT:price.drawdown）说明高位抛压已现。",
  "marketMechanism": "价格上行后最近1h价格回落且同窗口OI数量下降，与部分多头敞口了结或空头回补后动能衰减的可能性相容；1h相对量5.76倍表明该窗口参与量显著高于前24根均值，但OI为合约数量口径，不能据此确认单侧开平仓、强平或资金流向。",
  "supportingEvidenceIds": [
    "BATUSDT:price.closed1h",
    "BATUSDT:directional.price.previous1h",
    "BATUSDT:oi.1h",
    "BATUSDT:volume.relative1h",
    "BATUSDT:price.drawdown",
    "BATUSDT:price.rangeLowHigh"
  ],
  "conflictingEvidenceIds": [
    "BATUSDT:price.closed24h",
    "BATUSDT:oi.24h",
    "BATUSDT:price.rolling24h",
    "BATUSDT:global.long.latest"
  ],
  "preferredScenario": "1h维度延续偏空：若后续新收盘1h价格继续走弱且1h OI数量不再明显回升，则短线弱势延续，价格可能继续向24h区间下沿方向运行；该倾向为不确定假设，需后续同窗口价格与OI确认。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_1h",
      "OI_REVERSED_1h"
    ],
    "description": "若后续新收盘滚动1h价格变化≥4.0422%（PRICE_OPPOSITE_1h），则当前1h偏空方向命题失效；若后续新采样精确1h OI数量变化≥5.0000%（OI_REVERSED_1h），仅触发复核，不自动失效。"
  },
  "alternativeScenario": "若1h价格重新转强并收复最近1h跌幅，同时1h OI数量回升，则短线偏空假设被削弱，行情可能回到24h上行延续（已收盘24h +20.98%、24h OI数量+60.65%）；但24h窗口此前已连续同向，反转证据不足，需新的同窗口价格与OI配合。",
  "followUpChecks": [
    "跟踪后续新收盘1h价格变化是否达到+4.0422%以上（PRICE_OPPOSITE_1h失效阈值），以及1h OI数量变化是否回升至+5.0000%以上（OI_REVERSED_1h复核阈值）。",
    "观察1h相对量能否维持高位及24h区间高点回撤-16.15%是否继续扩大，同时留意已结算Funding 0.0033%多头支付空头（BATUSDT:funding.latest）是否延续，以判断短线抛压是否持续。"
  ]
}
```

人工复核：此前1h+7.58954786%、当前1h-8.08432255%、OI-4.88567273%与相对量5.76165114倍有真实短线转弱依据。模型没有强制用REVERSAL，而是BEARISH。Funding0.0033%多头支付空头与源数据一致，但仅在正文裸ID出现，没有进入guard的实际引用集合，导致支付关系拒绝，并非已证明把支付方向说反。观察阈值中文“以上”及相对量别名也拒绝。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,FUNDING_DIRECTION_MUST_USE_EVIDENCE；4215ms；输入/输出token=6229/907；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,FUNDING_DIRECTION_MUST_USE_EVIDENCE；3761ms；输入/输出token=14231/907；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,FUNDING_DIRECTION_MUST_USE_EVIDENCE；3246ms；输入/输出token=14231/905；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json)。

## WIFUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/WIFUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/WIFUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量28；质量合格且所有可引用时间不晚于evaluationTime。选择理由：任务优先Symbol；采用最早可读且质量合格的历史Facts，不预设方向。

主要异常：

```json
[
  {
    "kind": "ACCOUNT_DOMINANCE_FLIP",
    "value": "CONFIRMED",
    "scope": "GLOBAL_ACCOUNTS",
    "strength": 2,
    "threshold": "strict crossing of 50%; 2 consecutive samples confirm",
    "evidenceIds": [
      "WIFUSDT:global.flip"
    ]
  }
]
```

原始最后响应方向NO_EDGE、horizon=24h、conviction=LOW、tradeOpportunity=NO_ACTIONABLE_SETUP，上述均非验证通过研判。

```json
{
  "marketThesis": "24h口径价格由前一同长度窗口的-4.66%（WIFUSDT:directional.price.previous24h）转为2.94%（WIFUSDT:price.closed24h），同时24h OI数量变化-0.82%（WIFUSDT:oi.24h），价格上行与OI小幅收缩并存；但1h价格-0.18%（WIFUSDT:price.closed1h）、4h价格-0.64%（WIFUSDT:price.closed4h）仍为负，1h OI-0.08%（WIFUSDT:oi.1h）、4h OI-0.52%（WIFUSDT:oi.4h）同步收缩，最近已收盘1小时成交量为前24根均值的0.40倍（WIFUSDT:volume.relative1h），参与量不足，方向延续无法确认，故不给出方向性倾向。",
  "marketMechanism": "24h价格上行（2.94%，WIFUSDT:price.closed24h）与24h OI数量收缩（-0.82%，WIFUSDT:oi.24h）同时出现，与部分空头回补推动价格、而非新增多头敞口扩张的可能性相容；1h与4h价格小幅下行且OI同步收缩，与短周期敞口继续减少相容。以上仅为条件性可能机制，不构成已确认的单侧开平仓、强平或资金流入结论。",
  "supportingEvidenceIds": [
    "WIFUSDT:price.closed24h",
    "WIFUSDT:directional.price.previous24h",
    "WIFUSDT:oi.24h",
    "WIFUSDT:global.flip",
    "WIFUSDT:global.long.change24h",
    "WIFUSDT:global.short.change24h"
  ],
  "conflictingEvidenceIds": [
    "WIFUSDT:price.closed1h",
    "WIFUSDT:price.closed4h",
    "WIFUSDT:oi.1h",
    "WIFUSDT:oi.4h",
    "WIFUSDT:volume.relative1h",
    "WIFUSDT:volume.relative5m",
    "WIFUSDT:price.drawdown"
  ],
  "preferredScenario": "24h内价格在0.2171000 USDT附近（WIFUSDT:price.last）维持震荡偏稳，24h口径价格变化保持正值，OI数量变化继续在零附近小幅波动，不出现1h与4h价格同步明显走弱；全市场账户多方占比维持略占优（当前多方52.08%，WIFUSDT:global.long.latest）。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_24h"
    ],
    "description": "若后续新收盘滚动24h价格变化≤-1.4706%（PRICE_OPPOSITE_24h），则当前24h价格转正的方向命题失效；若后续新采样精确24h OI数量变化≥5.0000%（OI_REVERSED_24h），仅触发复核而非自动失效。"
  },
  "alternativeScenario": "若1h与4h价格由当前-0.18%（WIFUSDT:price.closed1h）、-0.64%（WIFUSDT:price.closed4h）进一步走弱并伴随OI数量继续收缩，则24h价格转正可能只是短窗口修复，价格重回下行；若24h OI数量变化转为明显扩张且价格同步上行，则需重新评估敞口扩张而非回补的解释。",
  "followUpChecks": [
    "观察后续新收盘1h与4h价格变化是否由负转正并与24h方向一致，同时核对对应1h/4h OI数量变化是否同步扩张，以判断24h价格转正能否延续。",
    "跟踪全市场多空账户占比是否维持多方略占优（当前多方52.08%，WIFUSDT:global.long.latest），以及24h OI数量变化是否接近零或转为扩张，用于区分回补与新增敞口两种解释。"
  ]
}
```

人工复核：原始NO_EDGE有实际冲突：24h价格+2.94117647%、OI-0.81736204%，而1h/4h价格/OI走弱、相对量约0.40倍；不是仅因缺少ICT才弃权。较低量与多周期矛盾可支持不作方向结论，但裸ID、数字语法及一处分句“回补推动价格”机制标记/窗口不充分仍失败。不归类VALID_NO_EDGE。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER；4982ms；输入/输出token=6586/954；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER；4438ms；输入/输出token=15296/1100；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER；3425ms；输入/输出token=16111/1098；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json)。

## AIOTUSDT / hourly_20261010_2200

Facts [data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json)；evaluationTime=2026-10-10T14:00:12.629Z；Evidence数量27；质量合格且所有可引用时间不晚于evaluationTime。选择理由：补充4h价格上涨/OI扩张：按已保存4h涨幅排序。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "AIOTUSDT:price.rolling24h"
    ],
    "value": "18.48297921",
    "threshold": 8,
    "strength": 2.31037240125
  },
  {
    "kind": "OI_4H",
    "evidenceIds": [
      "AIOTUSDT:oi.4h"
    ],
    "value": "19.69227927",
    "threshold": 10,
    "strength": 1.969227927
  }
]
```

原始最后响应方向BULLISH、horizon=4h、conviction=MODERATE、tradeOpportunity=WAIT_FOR_PULLBACK，上述均非验证通过研判。

```json
{
  "marketThesis": "已收盘4h价格变化11.53%且同期OI数量变化19.69%，价格上行伴随敞口扩张，属强延续窗口；1h价格变化0.88%、1h OI数量变化0.77%仍同向，24h价格变化18.44%、24h OI数量变化4.35%亦同向。但最新价较24h区间高点回落2.92%（AIOTUSDT:price.drawdown），24h区间低点至高点幅度28.41%（AIOTUSDT:price.rangeLowHigh），且全市场空方账户占比4h上升6.17个百分点（AIOTUSDT:global.short.change4h），故为方向倾向而非追高机会。",
  "marketMechanism": "价格上行与同窗口OI数量扩张并存，与新增敞口参与上行的情形相容；1h OI仅增0.77%而价格涨0.88%，扩张幅度有限，不能据此确认单侧开仓、强平或资金流入。最新已结算Funding 0.0050%为多头支付空头（AIOTUSDT:funding.latest），过去24小时6次结算合计0.0737%（AIOTUSDT:funding.sum24h），仅说明多头持仓成本为正，不保证未来方向。",
  "supportingEvidenceIds": [
    "AIOTUSDT:price.closed4h",
    "AIOTUSDT:oi.4h",
    "AIOTUSDT:directional.price.previous4h",
    "AIOTUSDT:price.closed1h",
    "AIOTUSDT:oi.1h",
    "AIOTUSDT:price.closed24h",
    "AIOTUSDT:oi.24h",
    "AIOTUSDT:volume.relative1h",
    "AIOTUSDT:volume.relative5m"
  ],
  "conflictingEvidenceIds": [
    "AIOTUSDT:price.drawdown",
    "AIOTUSDT:price.rangeLowHigh",
    "AIOTUSDT:global.short.change4h",
    "AIOTUSDT:global.long.change4h",
    "AIOTUSDT:funding.latest"
  ],
  "preferredScenario": "未来4小时价格在已收盘4h变化11.53%与OI数量变化19.69%的同向基础上维持偏强，回踩后仍不出现4h价格变化≤-5.7659%的相反走势；若1h价格与OI继续同向扩张，则延续倾向增强。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_4h",
      "OI_REVERSED_4h"
    ],
    "description": "若后续新收盘滚动4h价格变化≤-5.7659%（PRICE_OPPOSITE_4h）则方向命题失效；若后续新采样精确4h OI数量变化≤-9.8461%（OI_REVERSED_4h）则触发复核，仅表示原敞口扩张条件逆转，不自动否定方向。"
  },
  "alternativeScenario": "若后续4h价格转跌且OI数量同步收缩，或1h价格与OI由同向扩张转为背离，则当前偏强延续假设被削弱，行情可能转为区间震荡或回吐24h涨幅；全市场空方账户占比继续上升（4h已升6.17个百分点）亦可能伴随上行受阻。",
  "followUpChecks": [
    "跟踪后续新收盘滚动4h价格变化是否触及≤-5.7659%（PRICE_OPPOSITE_4h），以及精确4h OI数量变化是否触及≤-9.8461%（OI_REVERSED_4h）。",
    "跟踪后续1h价格变化与1h OI数量变化是否维持同向扩张，并观察最新价与24h区间高点（当前回落2.92%）的距离变化。"
  ]
}
```

人工复核：4h价格+11.53184165%、OI+19.69227927%、其他周期同向，账户空方4h+6.17pp与回撤是竞争背景；preferredScenario明确未来4h偏强而不是纯历史复述。模型写“不保证未来方向”却被两类确定性/因果规则拒绝，已用隔离生产入口诊断确认局部否定误拦截；还有裸ID、future基线和数字口径解析问题。整体仍未通过。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED；4321ms；输入/输出token=6349/975；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED；3288ms；输入/输出token=15063/975；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED；3223ms；输入/输出token=15063/975；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json)。

## AGTUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/AGTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/AGTUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量27；质量合格且所有可引用时间不晚于evaluationTime。选择理由：补充4h价格下跌/OI扩张：按已保存4h跌幅排序。

主要异常：

```json
[
  {
    "kind": "PRICE_24H",
    "evidenceIds": [
      "AGTUSDT:price.rolling24h"
    ],
    "value": "-24.57886982",
    "threshold": 8,
    "strength": 3.0723587275
  }
]
```

原始最后响应方向BEARISH、horizon=4h、conviction=MODERATE、tradeOpportunity=NO_ACTIONABLE_SETUP，上述均非验证通过研判。

```json
{
  "marketThesis": "中期下行延续：已收盘4h价格-21.69%（AGTUSDT:price.closed4h）与已收盘24h价格-24.61%（AGTUSDT:price.closed24h）均弱于各自此前等长窗口的-0.19%（AGTUSDT:directional.price.previous4h）与-9.97%（AGTUSDT:directional.price.previous24h），且4h OI数量+7.50%（AGTUSDT:oi.4h）、24h OI数量+6.34%（AGTUSDT:oi.24h）同窗口扩张，与下跌中敞口继续累积的可能性相容；最近已收盘1h价格+0.89%（AGTUSDT:price.closed1h）仅为短线修复，不改变4h下行倾向。",
  "marketMechanism": "价格下行与同窗口OI数量扩张的组合，与下跌过程中新增敞口累积的可能性相容：4h价格-21.69%（AGTUSDT:price.closed4h）伴随4h OI数量+7.50%（AGTUSDT:oi.4h），24h价格-24.61%（AGTUSDT:price.closed24h）伴随24h OI数量+6.34%（AGTUSDT:oi.24h）；这只是条件性解释，不确认单侧开平仓、强平或资金流入。",
  "supportingEvidenceIds": [
    "AGTUSDT:price.closed4h",
    "AGTUSDT:directional.price.previous4h",
    "AGTUSDT:price.closed24h",
    "AGTUSDT:directional.price.previous24h",
    "AGTUSDT:oi.4h",
    "AGTUSDT:oi.24h",
    "AGTUSDT:price.drawdown",
    "AGTUSDT:price.rangeLowHigh"
  ],
  "conflictingEvidenceIds": [
    "AGTUSDT:price.closed1h",
    "AGTUSDT:directional.price.previous1h",
    "AGTUSDT:oi.1h",
    "AGTUSDT:volume.relative1h",
    "AGTUSDT:global.short.change1h",
    "AGTUSDT:global.long.change1h"
  ],
  "preferredScenario": "未来4小时若已收盘4h价格变化（AGTUSDT:price.closed4h）维持负值且4h OI数量变化（AGTUSDT:oi.4h）不出现≤-5.0000%的明显收缩，则中期下行倾向延续；最近已收盘1h价格+0.89%（AGTUSDT:price.closed1h）的短线修复不改变该4h倾向。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_4h",
      "OI_REVERSED_4h"
    ],
    "description": "若后续新收盘滚动4h价格变化≥10.8459%（PRICE_OPPOSITE_4h），则4h下行方向命题失效；若后续新采样精确4h OI数量变化≤-5.0000%（OI_REVERSED_4h），仅触发复核，不自动失效。"
  },
  "alternativeScenario": "若已收盘4h价格变化（AGTUSDT:price.closed4h）由-21.69%转正并超过此前等长4h窗口的-0.19%（AGTUSDT:directional.price.previous4h），同时4h OI数量+7.50%（AGTUSDT:oi.4h）转为收缩，则下行倾向减弱，最近已收盘1h价格+0.89%（AGTUSDT:price.closed1h）的修复可能扩展为更大级别反弹。",
  "followUpChecks": [
    "跟踪下一根已收盘4h价格变化（AGTUSDT:price.closed4h）是否维持负值，并对比此前等长4h窗口-0.19%（AGTUSDT:directional.price.previous4h）；若转正接近该水平则4h下行倾向减弱。",
    "观察4h OI数量变化（AGTUSDT:oi.4h）是否由+7.50%转为≤-5.0000%收缩，以及1h相对量（AGTUSDT:volume.relative1h）是否继续高于1倍，以判断敞口累积是否延续。"
  ]
}
```

人工复核：首次1h BEARISH_REVERSAL与真实当前1h+0.89000213%、此前-0.68293716%转向冲突；恢复到4h BEARISH，4h价格-21.69183040%、OI+7.49701641%有下行竞争解释，纠正了方向/失效规则，但裸ID与正号、此前窗口数字语法未解决。

- Attempt 1：INVALID；Schema=true；错误=REVERSAL_DIRECTION_NOT_SUPPORTED,INVALIDATION_RULE_DIRECTION_CONFLICT,UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER,UNAVAILABLE_INDICATOR_OR_STRUCTURE；4883ms；输入/输出token=6244/1064；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC；4105ms；输入/输出token=15773/1129；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC；4569ms；输入/输出token=15913/1129；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json)。

## NIGHTUSDT / hourly_20261010_2100

Facts [data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json)；evaluationTime=2026-10-10T13:00:15.062Z；Evidence数量28；质量合格且所有可引用时间不晚于evaluationTime。选择理由：补充4h价格下跌/OI收缩：按已保存4h跌幅排序。

主要异常：

```json
[
  {
    "kind": "ACCOUNT_DOMINANCE_FLIP",
    "value": "CONFIRMED",
    "scope": "GLOBAL_ACCOUNTS",
    "strength": 2,
    "threshold": "strict crossing of 50%; 2 consecutive samples confirm",
    "evidenceIds": [
      "NIGHTUSDT:global.flip"
    ]
  }
]
```

原始最后响应方向BEARISH、horizon=4h、conviction=LOW、tradeOpportunity=NO_ACTIONABLE_SETUP，上述均非验证通过研判。

```json
{
  "marketThesis": "24h维度仍为上涨（已收盘24h +6.47%，NIGHTUSDT:price.closed24h），但最近1h与4h已转跌（-2.00%、-2.75%），同期OI数量分别-0.74%、-2.08%，价格与持仓同步收缩，与多头敞口了结的情形相容；快照价距24h高点-7.63%（NIGHTUSDT:price.drawdown），24h区间幅度16.44%（NIGHTUSDT:price.rangeLowHigh）。全市场账户多空比24h由空占优翻为多占优（NIGHTUSDT:global.flip），但账户比例不代表仓位，且1h/4h仅小幅偏空变化，不足以支撑反转向上。综合看4h内偏空，但缺少结构、主动买卖量与CVD，强度只能为LOW。",
  "marketMechanism": "价格下行与同窗口OI数量下降并存（1h价格-2.00%/OI-0.74%；4h价格-2.75%/OI-2.08%），与部分多头平仓离场、而非空头大举新开仓的情形相容；24h OI仍+4.22%（NIGHTUSDT:oi.24h）说明此前上涨阶段有敞口累积，当前回落可能是该累积敞口的部分了结。以上仅为与价格及OI同窗口变化相容的可能机制，不构成已确认的单侧开平仓、强平或资金流向结论。",
  "supportingEvidenceIds": [
    "NIGHTUSDT:price.closed1h",
    "NIGHTUSDT:price.closed4h",
    "NIGHTUSDT:oi.1h",
    "NIGHTUSDT:oi.4h",
    "NIGHTUSDT:directional.price.previous4h",
    "NIGHTUSDT:price.drawdown",
    "NIGHTUSDT:volume.relative1h"
  ],
  "conflictingEvidenceIds": [
    "NIGHTUSDT:price.closed24h",
    "NIGHTUSDT:price.rolling24h",
    "NIGHTUSDT:oi.24h",
    "NIGHTUSDT:global.flip",
    "NIGHTUSDT:global.long.change24h",
    "NIGHTUSDT:funding.latest"
  ],
  "preferredScenario": "4h内价格在-2.75%的回落基础上延续偏弱整理，OI数量继续温和收缩或持平，反弹受制于24h高点下方，不出现价格与OI同步扩张的上行确认。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_4h",
      "OI_REVERSED_4h"
    ],
    "description": "若后续新收盘滚动4h价格变化≥1.3771%（PRICE_OPPOSITE_4h），则当前4h偏空方向命题失效；若后续新采样精确4h OI数量变化≥5.0000%（OI_REVERSED_4h），仅触发对敞口变化条件的复核，不自动判定方向失效。"
  },
  "alternativeScenario": "若4h价格重新转为上行且同期OI数量同步扩张，则当前回落更可能只是24h上涨趋势中的短暂整理，偏空判断需让位于上行延续；但账户多空比翻转本身不足以确认反转向上。",
  "followUpChecks": [
    "跟踪后续新收盘4h价格变化是否达到+1.3771%以上（PRICE_OPPOSITE_4h），以及精确4h OI数量变化是否达到+5.0000%（OI_REVERSED_4h）。",
    "观察1h价格与OI是否由同步收缩转为同步扩张，并对照最近已收盘1h成交量1.75倍均值（NIGHTUSDT:volume.relative1h）是否延续放量。"
  ]
}
```

人工复核：选入是为了4h价格/OI同时收缩，与24h上行/账户翻转形成竞争。首次marketThesis超过400字符，恢复缩短后通过Schema，却仍有裸ID和数字解析问题。原始文本存在未来4h偏弱假设，不是纯历史复述；解释“此前上涨阶段有敞口累积”还需准确窗口绑定。

- Attempt 1：INVALID；Schema=false；错误=DIRECTIONAL_SCHEMA_INVALID；5163ms；输入/输出token=6524/1021；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)。
- Attempt 2：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC,UNSUPPORTED_CAUSE_OR_ORDER；3194ms；输入/输出token=13149/977；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json)。
- Attempt 3：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY,UNTRUSTED_SYMBOL_OR_METRIC；4262ms；输入/输出token=15367/975；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json)。

## WLFIUSDT / hourly_20261010_2200

Facts [data/runs/hourly_20261010_2200/facts/WLFIUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/WLFIUSDT.json)；evaluationTime=2026-10-10T14:00:12.629Z；Evidence数量28；质量合格且所有可引用时间不晚于evaluationTime。选择理由：补充相对平静：仅按当时1h价格/OI绝对变化之和最小排序。

主要异常：

```json
[
  {
    "kind": "ACCOUNT_DOMINANCE_FLIP",
    "value": "CONFIRMED",
    "scope": "GLOBAL_ACCOUNTS",
    "strength": 2,
    "threshold": "strict crossing of 50%; 2 consecutive samples confirm",
    "evidenceIds": [
      "WLFIUSDT:global.flip"
    ]
  }
]
```

原始最后响应方向NO_EDGE、horizon=24h、conviction=LOW、tradeOpportunity=NO_ACTIONABLE_SETUP，上述均非验证通过研判。

```json
{
  "marketThesis": "24h已收盘价格变化5.81%（WLFIUSDT:price.closed24h）且24h OI数量变化1.43%（WLFIUSDT:oi.24h），价格与OI同向扩张，与新增敞口参与上行的可能性相容；但最近已收盘1h价格变化0.02%（WLFIUSDT:price.closed1h）、1h OI数量变化0.00%（WLFIUSDT:oi.1h）停滞，1h相对量0.84倍（WLFIUSDT:volume.relative1h）、5m相对量0.58倍（WLFIUSDT:volume.relative5m）偏低，且价格自24h区间高点回撤-2.15%（WLFIUSDT:price.drawdown），上行缺乏当前参与量确认。全市场账户多51.54%/空48.46%（WLFIUSDT:global.long.latest），24h多方占比+2.42个百分点（WLFIUSDT:global.long.change24h），主导侧由SHORT转LONG（WLFIUSDT:global.flip），但账户比例不代表仓位或资金比例，不足以支撑方向。综合为NO_EDGE。",
  "marketMechanism": "24h价格上行5.81%（WLFIUSDT:price.closed24h）同时24h OI数量增加1.43%（WLFIUSDT:oi.24h），与部分新增敞口参与上行的可能性相容；最近已收盘1h价格变化0.02%（WLFIUSDT:price.closed1h）与1h OI数量变化0.00%（WLFIUSDT:oi.1h）近乎持平，与短线新增敞口停滞相容；4h价格-0.26%（WLFIUSDT:price.closed4h）与4h OI-0.08%（WLFIUSDT:oi.4h）同向收缩，与部分敞口了结的可能性相容。以上均为条件性可能机制，不确认单侧开平仓、强平或资金流入。",
  "supportingEvidenceIds": [
    "WLFIUSDT:price.closed24h",
    "WLFIUSDT:oi.24h",
    "WLFIUSDT:price.rolling24h",
    "WLFIUSDT:volume.rolling24h"
  ],
  "conflictingEvidenceIds": [
    "WLFIUSDT:price.closed1h",
    "WLFIUSDT:oi.1h",
    "WLFIUSDT:volume.relative1h",
    "WLFIUSDT:volume.relative5m",
    "WLFIUSDT:price.drawdown",
    "WLFIUSDT:price.closed4h",
    "WLFIUSDT:oi.4h"
  ],
  "preferredScenario": "未来24h内价格在0.0570100 USDT附近维持震荡整理，24h价格变化保持在-2.9046%以上，24h OI数量变化不出现≤-5.0000%的明显收缩；短线方向不明确，等待价格与OI同向扩张且相对量回升后再评估方向。",
  "invalidation": {
    "type": "OBSERVABLE_CONDITION",
    "ruleIds": [
      "PRICE_OPPOSITE_24h",
      "OI_REVERSED_24h"
    ],
    "description": "若后续新收盘滚动24h价格变化≤-2.9046%，或新采样精确24h OI数量变化≤-5.0000%，则当前弱倾向失效或需复核。"
  },
  "alternativeScenario": "若未来24h价格转为明显下行且OI数量同步收缩（24h价格变化≤-2.9046%或24h OI数量变化≤-5.0000%），则当前价格与OI同向扩张的观察被否定，需转向偏空评估；若价格上行但OI数量明显收缩，则上行缺乏新增敞口参与，同样需重新评估。",
  "followUpChecks": [
    "跟踪后续新收盘1h价格变化与精确1h OI数量变化是否同向扩张，并观察1h相对量能否回升至前24根均值以上，以判断短线参与量是否恢复。",
    "跟踪后续新收盘24h价格变化是否接近-2.9046%阈值，以及24h OI数量变化是否接近-5.0000%阈值，用于触发方向命题失效或复核。"
  ]
}
```

人工复核：1h价格/OI近乎持平、相对量低、4h走弱与24h上涨竞争，原始NO_EDGE有真实理由，并非仅缺少结构。首轮未来0.0570附近的精确价位情景不应当作为已验证未来价格；该数字为当前参考价，不等于凭空捏造，但预测性质未被验证。复核/失效描述将价格或OI阈值合并为“失效或复核”，含糊；恢复2/3的marketThesis均超过400字符。

- Attempt 1：INVALID；Schema=true；错误=UNTRUSTED_NUMBER_OR_PROBABILITY；4311ms；输入/输出token=6535/890；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)。
- Attempt 2：INVALID；Schema=false；错误=DIRECTIONAL_SCHEMA_INVALID；4499ms；输入/输出token=15502/1193；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json)。
- Attempt 3：INVALID；Schema=false；错误=DIRECTIONAL_SCHEMA_INVALID；4025ms；输入/输出token=13343/1193；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json)；完整诊断[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json)。

## 通过验证的真实模型原文

没有完整通过样本，无法提供2–3条通过研判，不编造或把失败摘录包装为有效结论。下列摘录仅用于诊断：

### MAGICUSDT — 未通过，attempt3

> 1h内价格在-5.49%回落（MAGICUSDT:price.closed1h）后延续偏弱整理，OI数量变化维持负向或低位（参考MAGICUSDT:oi.1h），相对量不放大（MAGICUSDT:volume.relative1h），不出现反向强扩张。

状态FINAL_INVALID，错误UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json)。

### AIOTUSDT — 未通过，attempt3

> 未来4小时价格在已收盘4h变化11.53%与OI数量变化19.69%的同向基础上维持偏强，回踩后仍不出现4h价格变化≤-5.7659%的相反走势；若1h价格与OI继续同向扩张，则延续倾向增强。

状态FINAL_INVALID，错误UNTRUSTED_SYMBOL_OR_METRIC,UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER,FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json)。

### APRUSDT — 未通过，attempt3

> 未来1h内，若价格维持或延续最近已收盘1h的+2.06%转向、且1h OI数量不出现明显收缩，则短线反弹尝试可能延续；但4h/24h深度负值与高波动区间限制其持续性，倾向视为弱反弹而非趋势反转。

状态FINAL_INVALID，错误UNTRUSTED_NUMBER_OR_PROBABILITY,UNSUPPORTED_CAUSE_OR_ORDER；原始[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json)。

