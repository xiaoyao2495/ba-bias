# BA_BIAS_ANALYST_SEMANTIC_GROUNDING_REPLAY

ROUTE_B_SELECTED；全部严格离线；原正式验证语义不变。

| 集合 | Response / Attempt | Independent Analysis | 完整通过前→后 | 可恢复研判 |
|---|---:|---:|---:|---:|
| V3 | 29 / 29 | 10 | 2→2 | 2 |
| V2 | 30 / 30 | 10 | 11→11 | 5 |
| HISTORICAL | 140 / 140 | 70 | 32→32 | 26 |

199响应不是199预测。V2/旧历史交集7事件，V3不同原观察时间10事件；去重事件83。冻结18例（10真实与旧集合重叠、8语言合成）没有新增市场事件。事件键symbol+original run，原精确evaluationTime均保存，不修改观察时点。

[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/dataset-freeze.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/dataset-freeze.json)；[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/replay.json)；[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/audit.json)

## 逐诊断归因

分类数量（诊断条目，包含根错误与子错误，不能作独立错误率分母）：{'FALSE_REJECTION': 35, 'TRUE_REJECTION': 70, 'CONTRACT_MISMATCH': 16, 'UNDETERMINED': 155}。FALSE_ACCEPTANCE另列两条正式PASS研究情景，不与拒绝诊断混算。旧集合复杂断言无法证明时保守UNDETERMINED，非默认TRUE_REJECTION；复用既有独立审计时保存原issue。

## 29份V3真实响应

### CAPUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_CAPUSDT_a1_5c70e1d7-2db2-43a1-8de4-9293161aaf82.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_CAPUSDT_a1_5c70e1d7-2db2-43a1-8de4-9293161aaf82.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_CAPUSDT_a1_5c70e1d7-2db2-43a1-8de4-9293161aaf82.json)

- UNVERIFIED_NUMERIC_FACT / marketThesis / +22.78%: **TRUE_REJECTION**。缺少指标/窗口标签或新增未来数值，严格绑定不足；真实数字相同不等于可直接放行。
- UNVERIFIED_NUMERIC_FACT / marketThesis / -10.27%: **TRUE_REJECTION**。缺少指标/窗口标签或新增未来数值，严格绑定不足；真实数字相同不等于可直接放行。
- FUNDING_DIRECTION_MUST_USE_EVIDENCE / followUp1 / —: **CONTRACT_MISMATCH**。跟踪支付方向的未来核对任务，不是当前错误支付断言；合同却要求逐次写明当前支付双方。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### CAPUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_CAPUSDT_a2_79be2dec-f193-49da-9b56-f4b49c55f75d.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_CAPUSDT_a2_79be2dec-f193-49da-9b56-f4b49c55f75d.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_CAPUSDT_a2_79be2dec-f193-49da-9b56-f4b49c55f75d.json)

- FUNDING_DIRECTION_MUST_USE_EVIDENCE / followUp1 / —: **CONTRACT_MISMATCH**。跟踪支付方向的未来核对任务，不是当前错误支付断言；合同却要求逐次写明当前支付双方。

### CAPUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_CAPUSDT_a3_5b76ef42-75a4-4b3f-833f-8026567a75bf.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_CAPUSDT_a3_5b76ef42-75a4-4b3f-833f-8026567a75bf.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_CAPUSDT_a3_5b76ef42-75a4-4b3f-833f-8026567a75bf.json)

- FUNDING_DIRECTION_MUST_USE_EVIDENCE / followUp1 / —: **CONTRACT_MISMATCH**。跟踪支付方向的未来核对任务，不是当前错误支付断言；合同却要求逐次写明当前支付双方。

### KAIAUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_KAIAUSDT_a1_ef927295-ac0b-4db2-b395-7e6a7a7e82a7.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_KAIAUSDT_a1_ef927295-ac0b-4db2-b395-7e6a7a7e82a7.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/KAIAUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_KAIAUSDT_a1_ef927295-ac0b-4db2-b395-7e6a7a7e82a7.json)

- UNVERIFIED_NUMERIC_FACT / marketThesis / +50.65%: **TRUE_REJECTION**。缺少指标/窗口标签或新增未来数值，严格绑定不足；真实数字相同不等于可直接放行。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 加仓: **FALSE_REJECTION**。不指示单侧加仓是明确否定；不是相邻转折后的肯定开仓断言。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### KAIAUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_KAIAUSDT_a2_de7fe9c5-09c2-4039-8e81-73921ebc4f14.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_KAIAUSDT_a2_de7fe9c5-09c2-4039-8e81-73921ebc4f14.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/KAIAUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_KAIAUSDT_a2_de7fe9c5-09c2-4039-8e81-73921ebc4f14.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 加仓: **FALSE_REJECTION**。不指示单侧加仓是明确否定；不是相邻转折后的肯定开仓断言。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### KAIAUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_KAIAUSDT_a3_32cffd2f-8f32-4c0d-b8ff-b6b68ac08d81.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_KAIAUSDT_a3_32cffd2f-8f32-4c0d-b8ff-b6b68ac08d81.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/KAIAUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_KAIAUSDT_a3_32cffd2f-8f32-4c0d-b8ff-b6b68ac08d81.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 加仓: **FALSE_REJECTION**。不指示单侧加仓是明确否定；不是相邻转折后的肯定开仓断言。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### XPLUSDT / hourly_20261010_1300 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1300_XPLUSDT_a1_a35b05a0-6fd2-4b53-8ade-2dd0d4a0b3a2.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1300_XPLUSDT_a1_a35b05a0-6fd2-4b53-8ade-2dd0d4a0b3a2.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1300/facts/XPLUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1300_XPLUSDT_a1_a35b05a0-6fd2-4b53-8ade-2dd0d4a0b3a2.json)

- UNVERIFIED_NUMERIC_FACT / marketMechanism / 0.17%: **CONTRACT_MISMATCH**。“再降0.17%”以方向词表达负号；文本规则与该语法绑定不稳定，原OI符号见registry。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 回补: **CONTRACT_MISMATCH**。可能机制与分窗口OI条件必须明确绑定；自由文本当前/背景窗口关系与合同主窗口条件不一致。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNAVAILABLE_INDICATOR_OR_STRUCTURE / alternativeScenario / 跌破: **TRUE_REJECTION**。当前输入capabilities.priceStructure=false，无价格结构对象ID，具体跌破/高低点条件不可定位。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### XPLUSDT / hourly_20261010_1300 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1300_XPLUSDT_a2_c4c782fe-ac31-494b-9fd4-a124f2feccfd.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1300_XPLUSDT_a2_c4c782fe-ac31-494b-9fd4-a124f2feccfd.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1300/facts/XPLUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1300_XPLUSDT_a2_c4c782fe-ac31-494b-9fd4-a124f2feccfd.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 回补: **CONTRACT_MISMATCH**。可能机制与分窗口OI条件必须明确绑定；自由文本当前/背景窗口关系与合同主窗口条件不一致。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### XPLUSDT / hourly_20261010_1300 / attempt 3

原正式合同=PASS；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1300_XPLUSDT_a3_1a2f82c2-2194-4b35-85a5-161b383fab32.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1300_XPLUSDT_a3_1a2f82c2-2194-4b35-85a5-161b383fab32.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1300/facts/XPLUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1300_XPLUSDT_a3_1a2f82c2-2194-4b35-85a5-161b383fab32.json)

正式合同通过；不等于研究质量通过。另见结构复核。

### BATUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_BATUSDT_a1_cf72980e-f95b-48c5-90c4-bcafe78594b3.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_BATUSDT_a1_cf72980e-f95b-48c5-90c4-bcafe78594b3.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/BATUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_BATUSDT_a1_cf72980e-f95b-48c5-90c4-bcafe78594b3.json)

- UNVERIFIED_NUMERIC_FACT / horizonReason / -2.28%: **FALSE_REJECTION**。1h/4h顺序列表数字真实，但文本语法只识别有限配对句式，错误窗口绑定；见字段与registry。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNAVAILABLE_INDICATOR_OR_STRUCTURE / invalidation / 结构失效: **FALSE_REJECTION**。不设机械结构失效是缺失说明，不是声称结构存在。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### BATUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_BATUSDT_a2_17f3f327-c0da-4df3-ae1d-a27a8495beef.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_BATUSDT_a2_17f3f327-c0da-4df3-ae1d-a27a8495beef.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/BATUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_BATUSDT_a2_17f3f327-c0da-4df3-ae1d-a27a8495beef.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNAVAILABLE_INDICATOR_OR_STRUCTURE / invalidation / 结构失效: **FALSE_REJECTION**。不设机械结构失效是缺失说明，不是声称结构存在。

### BATUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_BATUSDT_a3_c5d7d73c-a578-4ffb-b586-34337253afa2.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_BATUSDT_a3_c5d7d73c-a578-4ffb-b586-34337253afa2.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/BATUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_BATUSDT_a3_c5d7d73c-a578-4ffb-b586-34337253afa2.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNAVAILABLE_INDICATOR_OR_STRUCTURE / invalidation / 结构失效: **FALSE_REJECTION**。不设机械结构失效是缺失说明，不是声称结构存在。

### MINAUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MINAUSDT_a1_9f72066d-d774-4799-a3f1-354aff4d6817.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MINAUSDT_a1_9f72066d-d774-4799-a3f1-354aff4d6817.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MINAUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MINAUSDT_a1_9f72066d-d774-4799-a3f1-354aff4d6817.json)

- UNAVAILABLE_INDICATOR_OR_STRUCTURE / alternativeScenario / 跌破: **TRUE_REJECTION**。当前输入capabilities.priceStructure=false，无价格结构对象ID，具体跌破/高低点条件不可定位。

### MINAUSDT / hourly_20261010_1200 / attempt 2

原正式合同=PASS；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MINAUSDT_a2_a4295257-d59d-48d7-8fa2-4e10f1b81472.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MINAUSDT_a2_a4295257-d59d-48d7-8fa2-4e10f1b81472.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MINAUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MINAUSDT_a2_a4295257-d59d-48d7-8fa2-4e10f1b81472.json)

正式合同通过；不等于研究质量通过。另见结构复核。

### XLMUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_XLMUSDT_a1_7655a3b4-8726-44cc-8a31-e1e12c236756.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_XLMUSDT_a1_7655a3b4-8726-44cc-8a31-e1e12c236756.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/XLMUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_XLMUSDT_a1_7655a3b4-8726-44cc-8a31-e1e12c236756.json)

- UNVERIFIED_NUMERIC_FACT / horizonReason / -2.21%: **FALSE_REJECTION**。字段明确引用previous24h价格证据，真实值合理舍入；最近指标OI抢占了绑定。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNVERIFIED_NUMERIC_FACT / alternativeScenario / 2倍: **TRUE_REJECTION**。缺少指标/窗口标签或新增未来数值，严格绑定不足；真实数字相同不等于可直接放行。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### XLMUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_XLMUSDT_a2_f0d2b147-528f-4055-8055-802cc3aae1e8.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_XLMUSDT_a2_f0d2b147-528f-4055-8055-802cc3aae1e8.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/XLMUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_XLMUSDT_a2_f0d2b147-528f-4055-8055-802cc3aae1e8.json)

- UNVERIFIED_NUMERIC_FACT / horizonReason / -2.21%: **FALSE_REJECTION**。字段明确引用previous24h价格证据，真实值合理舍入；最近指标OI抢占了绑定。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### XLMUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_XLMUSDT_a3_d8f1467c-188f-47fa-8dd0-73c4aa6e0302.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_XLMUSDT_a3_d8f1467c-188f-47fa-8dd0-73c4aa6e0302.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/XLMUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_XLMUSDT_a3_d8f1467c-188f-47fa-8dd0-73c4aa6e0302.json)

- UNVERIFIED_NUMERIC_FACT / horizonReason / -2.21%: **FALSE_REJECTION**。字段明确引用previous24h价格证据，真实值合理舍入；最近指标OI抢占了绑定。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### OGNUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_OGNUSDT_a1_5efedb28-25e1-4fcc-ac5e-406d48397e1e.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_OGNUSDT_a1_5efedb28-25e1-4fcc-ac5e-406d48397e1e.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/OGNUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_OGNUSDT_a1_5efedb28-25e1-4fcc-ac5e-406d48397e1e.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### OGNUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_OGNUSDT_a2_ca5eef06-ed32-4400-a150-123755930f73.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_OGNUSDT_a2_ca5eef06-ed32-4400-a150-123755930f73.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/OGNUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_OGNUSDT_a2_ca5eef06-ed32-4400-a150-123755930f73.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### OGNUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_OGNUSDT_a3_ad59c738-2cd7-4e7a-8f15-e21c9a86b86e.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_OGNUSDT_a3_ad59c738-2cd7-4e7a-8f15-e21c9a86b86e.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/OGNUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_OGNUSDT_a3_ad59c738-2cd7-4e7a-8f15-e21c9a86b86e.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### MAGICUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MAGICUSDT_a1_149eae8d-2942-4cab-b92e-d7ed6d24b06c.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MAGICUSDT_a1_149eae8d-2942-4cab-b92e-d7ed6d24b06c.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MAGICUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MAGICUSDT_a1_149eae8d-2942-4cab-b92e-d7ed6d24b06c.json)

- UNVERIFIED_NUMERIC_FACT / horizonReason / -2.15%: **TRUE_REJECTION**。缺少指标/窗口标签或新增未来数值，严格绑定不足；真实数字相同不等于可直接放行。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### MAGICUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MAGICUSDT_a2_77b659d8-c920-49e9-ad04-bf539dfeb1fd.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MAGICUSDT_a2_77b659d8-c920-49e9-ad04-bf539dfeb1fd.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MAGICUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MAGICUSDT_a2_77b659d8-c920-49e9-ad04-bf539dfeb1fd.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### MAGICUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_MAGICUSDT_a3_99f280e9-116e-4910-b26f-291fc792497f.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_MAGICUSDT_a3_99f280e9-116e-4910-b26f-291fc792497f.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MAGICUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_MAGICUSDT_a3_99f280e9-116e-4910-b26f-291fc792497f.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### INJUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_INJUSDT_a1_d7a2f9d8-7d01-4030-b3eb-0d8adc0f8ba9.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_INJUSDT_a1_d7a2f9d8-7d01-4030-b3eb-0d8adc0f8ba9.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/INJUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_INJUSDT_a1_d7a2f9d8-7d01-4030-b3eb-0d8adc0f8ba9.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 回补: **CONTRACT_MISMATCH**。可能机制与分窗口OI条件必须明确绑定；自由文本当前/背景窗口关系与合同主窗口条件不一致。

### INJUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_INJUSDT_a2_299e656b-be34-4fc2-b1e1-a72ab28e1844.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_INJUSDT_a2_299e656b-be34-4fc2-b1e1-a72ab28e1844.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/INJUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_INJUSDT_a2_299e656b-be34-4fc2-b1e1-a72ab28e1844.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 回补: **CONTRACT_MISMATCH**。可能机制与分窗口OI条件必须明确绑定；自由文本当前/背景窗口关系与合同主窗口条件不一致。

### INJUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_INJUSDT_a3_4f935347-2406-495d-996c-a5fed6dd358a.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_INJUSDT_a3_4f935347-2406-495d-996c-a5fed6dd358a.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/INJUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_INJUSDT_a3_4f935347-2406-495d-996c-a5fed6dd358a.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。

### RAYSOLUSDT / hourly_20261010_1200 / attempt 1

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_RAYSOLUSDT_a1_ca0e8bd5-f082-49f0-aa83-0f3688e47b97.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_RAYSOLUSDT_a1_ca0e8bd5-f082-49f0-aa83-0f3688e47b97.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/RAYSOLUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_RAYSOLUSDT_a1_ca0e8bd5-f082-49f0-aa83-0f3688e47b97.json)

- UNVERIFIED_NUMERIC_FACT / marketThesis / -1.62%: **FALSE_REJECTION**。原marketThesis按1h/4h次序列出真实价格/OI数字；最近窗口及最近指标路径绑定到了4h/OI，参见完整字段与Registry。
- UNVERIFIED_NUMERIC_FACT / marketThesis / -0.08%: **FALSE_REJECTION**。原marketThesis按1h/4h次序列出真实价格/OI数字；最近窗口及最近指标路径绑定到了4h/OI，参见完整字段与Registry。
- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- SUPPORT_SAMPLES_NOT_ALIGNED / / / —: **TRUE_REJECTION**。24h滚动快照回撤与已收盘价格终点差9468ms；严格同时支持合同不成立。可作背景，不能视为同一结束采样。
- UNTRUSTED_NUMBER_OR_PROBABILITY / / / —: **UNDETERMINED**。复杂语言关系保守标记；不根据错误代码推定真值。

### RAYSOLUSDT / hourly_20261010_1200 / attempt 2

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_RAYSOLUSDT_a2_79fcc81c-79cc-4599-afcf-42d9d658e682.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_RAYSOLUSDT_a2_79fcc81c-79cc-4599-afcf-42d9d658e682.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/RAYSOLUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_RAYSOLUSDT_a2_79fcc81c-79cc-4599-afcf-42d9d658e682.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- SUPPORT_SAMPLES_NOT_ALIGNED / / / —: **TRUE_REJECTION**。24h滚动快照回撤与已收盘价格终点差9468ms；严格同时支持合同不成立。可作背景，不能视为同一结束采样。

### RAYSOLUSDT / hourly_20261010_1200 / attempt 3

原正式合同=FAIL；[原始响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/responses/hourly_20261010_1200_RAYSOLUSDT_a3_81ebca81-e0e9-45e8-b1b5-f4671d6e2a28.json)；[实际输入/Registry](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/requests/hourly_20261010_1200_RAYSOLUSDT_a3_81ebca81-e0e9-45e8-b1b5-f4671d6e2a28.json)；[原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/RAYSOLUSDT.json)；[原验证诊断](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_V3_LIVE_PROBE_V1/post_collection/validation/hourly_20261010_1200_RAYSOLUSDT_a3_81ebca81-e0e9-45e8-b1b5-f4671d6e2a28.json)

- UNSUPPORTED_CAUSE_OR_ORDER / marketMechanism / 平仓: **FALSE_REJECTION**。原分句明确否定具体行为；完整字段保存以检查转折作用域，不能豁免邻接肯定断言。
- SUPPORT_SAMPLES_NOT_ALIGNED / / / —: **TRUE_REJECTION**。24h滚动快照回撤与已收盘价格终点差9468ms；严格同时支持合同不成立。可作背景，不能视为同一结束采样。

## 数字路径与否定作用域

XLM的horizonReason明确在previous24h价格ID之后写-2.21%，原诊断metric.kind=oi；逐字原文、Facts值、单位%、窗口24h和Registry保存于audit.json。BAT的-2.28%与RAYSOL的-1.62%/-0.08%为1h/4h顺序列表，旧最近窗口/最近指标路径误绑定。XPL“再降0.17%”使用方向词表达负号，是合同语法歧义；不能因此允许正负号错写。CAP/KAIA/MAGIC的背景数字缺少完整指标标签，是严格绑定不足；XLM未来“2倍以上”没有选定规则证据，继续拒绝。

KAIA“不指示单侧加仓”、多样本“具体开平仓行为无法区分/无法确认”、BAT“不设结构失效”为明确否定。CAP跟踪Funding支付方向不是当前支付关系断言，属于合同职责不匹配。INJ条件机制涉及24h收缩而主周期4h OI扩张，必须显式分窗口绑定，不直接豁免。所有复杂语句按完整原字段审查，否定不向转折后的肯定句扩张。

## 两条通过结果的结构复核

- XPLUSDT: **FAIL_UNSUPPORTED_STRUCTURE / FALSE_ACCEPTANCE**。具体区间下沿被用作未来条件但Registry没有边界对象；换用回落而非跌破避开关键词，不解决溯源。旧合同通过记录保留。 预定义PRICE/OI规则仍可执行；区间边界情景不可执行，与规则可执行性分开。
  原情景：4h内价格在已收盘正变化基础上维持偏强整理，回踩不破近期已收盘区间下沿后再度尝试上行；OI数量若由收缩转为温和扩张则延续假设增强。；竞争情景：若4h价格转跌且OI数量同步扩张，或1h量能持续低于前24根均值并伴随价格走弱，则偏多延续假设让位于下行竞争情景，需重新评估。
- MINAUSDT: **FAIL_UNSUPPORTED_STRUCTURE / FALSE_ACCEPTANCE**。具体区间下沿被用作未来条件但Registry没有边界对象；换用回落而非跌破避开关键词，不解决溯源。旧合同通过记录保留。 预定义PRICE/OI规则仍可执行；区间边界情景不可执行，与规则可执行性分开。
  原情景：4h内价格在已收盘4h涨幅9.75%后维持高位整理，OI数量不出现明显收缩，则上行延续假设保持有效；若回撤不伴随OI数量大幅下降，视为整理而非方向失效。；竞争情景：若4h OI数量转为明显收缩且价格回落至此前等长4h区间下沿，则上行延续假设被削弱，需转向评估下行风险；当前1h OI收缩-0.89%是该情景的早期观察线索。

## V4离线接口样例

10/10转换合同样例通过，全部SYNTHETIC_OR_CONVERTED、NOT_PRODUCTION、POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。转换主动不转移旧无证据自由文本；不是修复原模型结果，也不是V4真实首次通过率。模型仍需未来独立授权的真实输出验证。[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/v4-offline-experiments.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/v4-offline-experiments.json)

## 冻结保留集与完整性

18/18符合预期；所有原验证完整结果逐对象deepEqual一致。真实数据2103文件无新增/变化；2499任务开始前文件哈希完全一致。[validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/integrity.json)
