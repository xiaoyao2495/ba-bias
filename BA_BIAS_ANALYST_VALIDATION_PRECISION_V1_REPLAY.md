# BA_BIAS_ANALYST_VALIDATION_PRECISION_V1_REPLAY

最终正式生产入口离线回放；30响应对应10事件，最早通过11响应/5事件。原响应/请求/Facts从未重写。预分类与51项独立审计纠正并存，不以新validator自定义真值。历史140响应/70事件另见完整JSON。没有缺失原始数据；7个历史JSON不合法保留INVALID_LLM_JSON，不尝试修复。

## ERAUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BULLISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED, TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856。
- 修复后完整状态：**FAILED**。剩余代码：UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 解除明确误拒绝：7诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, UNVERIFIED_NUMERIC_FACT。另2项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/ERAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ERAUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；无结构却谈近期结构、未经确认拥挤
- 实际声明/文本引用Evidence：`ERAUSDT:price.closed4h`, `ERAUSDT:oi.4h`, `ERAUSDT:directional.price.previous4h`, `ERAUSDT:price.closed1h`, `ERAUSDT:volume.relative1h`, `ERAUSDT:price.closed24h`, `ERAUSDT:oi.24h`, `ERAUSDT:price.drawdown`, `ERAUSDT:funding.latest`, `ERAUSDT:global.short.change24h`, `ERAUSDT:global.long.change24h`, `ERAUSDT:volume.relative5m`, `ERAUSDT:oi.1h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNVERIFIED_PARTICIPANT_STATE | 完整规则/Schema检查 |
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| preferredScenario | UNAVAILABLE_INDICATOR_OR_STRUCTURE | 跌破 |

## ERAUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BULLISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED, TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e。
- 修复后完整状态：**FAILED**。剩余代码：UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 解除明确误拒绝：6诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, UNVERIFIED_NUMERIC_FACT。另2项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/ERAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ERAUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；无结构却谈近期结构、未经确认拥挤
- 实际声明/文本引用Evidence：`ERAUSDT:price.closed4h`, `ERAUSDT:oi.4h`, `ERAUSDT:directional.price.previous4h`, `ERAUSDT:price.closed1h`, `ERAUSDT:volume.relative1h`, `ERAUSDT:price.closed24h`, `ERAUSDT:oi.24h`, `ERAUSDT:price.drawdown`, `ERAUSDT:funding.latest`, `ERAUSDT:global.short.change24h`, `ERAUSDT:global.long.change24h`, `ERAUSDT:volume.relative5m`, `ERAUSDT:oi.1h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNVERIFIED_PARTICIPANT_STATE | 完整规则/Schema检查 |
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| preferredScenario | UNAVAILABLE_INDICATOR_OR_STRUCTURE | 跌破 |

## ERAUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BULLISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED, TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63。
- 修复后完整状态：**FAILED**。剩余代码：UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 解除明确误拒绝：6诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, UNVERIFIED_NUMERIC_FACT。另2项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/ERAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ERAUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；无结构却谈近期结构、未经确认拥挤
- 实际声明/文本引用Evidence：`ERAUSDT:price.closed4h`, `ERAUSDT:oi.4h`, `ERAUSDT:directional.price.previous4h`, `ERAUSDT:price.closed1h`, `ERAUSDT:volume.relative1h`, `ERAUSDT:price.closed24h`, `ERAUSDT:oi.24h`, `ERAUSDT:price.drawdown`, `ERAUSDT:funding.latest`, `ERAUSDT:global.short.change24h`, `ERAUSDT:global.long.change24h`, `ERAUSDT:volume.relative5m`, `ERAUSDT:oi.1h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNVERIFIED_PARTICIPANT_STATE | 完整规则/Schema检查 |
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| preferredScenario | UNAVAILABLE_INDICATOR_OR_STRUCTURE | 跌破 |

## MAGICUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：23诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNVERIFIED_NUMERIC_FACT。另4项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`MAGICUSDT:price.closed1h`, `MAGICUSDT:oi.1h`, `MAGICUSDT:volume.relative1h`, `MAGICUSDT:price.drawdown`, `MAGICUSDT:volume.relative5m`, `MAGICUSDT:price.closed24h`, `MAGICUSDT:oi.24h`, `MAGICUSDT:price.closed4h`, `MAGICUSDT:funding.latest`, `MAGICUSDT:global.flip`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## MAGICUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：22诊断，UNTRUSTED_SYMBOL_OR_METRIC。另4项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`MAGICUSDT:price.closed1h`, `MAGICUSDT:oi.1h`, `MAGICUSDT:volume.relative1h`, `MAGICUSDT:price.drawdown`, `MAGICUSDT:volume.relative5m`, `MAGICUSDT:price.closed24h`, `MAGICUSDT:oi.24h`, `MAGICUSDT:price.closed4h`, `MAGICUSDT:funding.latest`, `MAGICUSDT:global.flip`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## MAGICUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：22诊断，UNTRUSTED_SYMBOL_OR_METRIC。另4项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`MAGICUSDT:price.closed1h`, `MAGICUSDT:oi.1h`, `MAGICUSDT:volume.relative1h`, `MAGICUSDT:price.drawdown`, `MAGICUSDT:volume.relative5m`, `MAGICUSDT:price.closed24h`, `MAGICUSDT:oi.24h`, `MAGICUSDT:price.closed4h`, `MAGICUSDT:funding.latest`, `MAGICUSDT:global.flip`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## APRUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BEARISH_REVERSAL / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED, TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486。
- 修复后完整状态：**FAILED**。剩余代码：REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 解除明确误拒绝：8诊断，UNVERIFIED_NUMERIC_FACT。另3项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/APRUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/APRUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`APRUSDT:price.closed1h`, `APRUSDT:directional.price.previous1h`, `APRUSDT:oi.1h`, `APRUSDT:volume.relative1h`, `APRUSDT:volume.closed1h`, `APRUSDT:price.closed4h`, `APRUSDT:price.closed24h`, `APRUSDT:price.drawdown`, `APRUSDT:oi.4h`, `APRUSDT:oi.24h`, `APRUSDT:funding.latest`, `APRUSDT:global.long.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| alternativeScenario | UNAVAILABLE_INDICATOR_OR_STRUCTURE | 跌破 |
| /marketBias | REVERSAL_DIRECTION_NOT_SUPPORTED | 完整规则/Schema检查 |
| /invalidation | INVALIDATION_RULE_DIRECTION_CONFLICT | 完整规则/Schema检查 |

## APRUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BULLISH_REVERSAL / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2。
- 修复后完整状态：**FAILED**。剩余代码：UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：8诊断，UNVERIFIED_NUMERIC_FACT。另3项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/APRUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/APRUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`APRUSDT:price.closed1h`, `APRUSDT:directional.price.previous1h`, `APRUSDT:oi.1h`, `APRUSDT:volume.relative1h`, `APRUSDT:volume.closed1h`, `APRUSDT:price.closed4h`, `APRUSDT:price.closed24h`, `APRUSDT:price.drawdown`, `APRUSDT:oi.4h`, `APRUSDT:oi.24h`, `APRUSDT:funding.latest`, `APRUSDT:global.long.latest`, `APRUSDT:price.rangeLowHigh`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |

## APRUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BULLISH_REVERSAL / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843。
- 修复后完整状态：**FAILED**。剩余代码：UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：8诊断，UNVERIFIED_NUMERIC_FACT。另3项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/APRUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/APRUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`APRUSDT:price.closed1h`, `APRUSDT:directional.price.previous1h`, `APRUSDT:oi.1h`, `APRUSDT:volume.relative1h`, `APRUSDT:volume.closed1h`, `APRUSDT:price.closed4h`, `APRUSDT:price.closed24h`, `APRUSDT:price.drawdown`, `APRUSDT:oi.4h`, `APRUSDT:oi.24h`, `APRUSDT:funding.latest`, `APRUSDT:global.long.latest`, `APRUSDT:price.rangeLowHigh`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |

## USUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, WRONG_ACCOUNT_OR_OI_SCOPE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b。
- 修复后完整状态：**FAILED**。剩余代码：UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：7诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另5项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/USUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/USUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`USUSDT:price.closed1h`, `USUSDT:directional.price.previous1h`, `USUSDT:oi.1h`, `USUSDT:price.closed24h`, `USUSDT:oi.24h`, `USUSDT:price.drawdown`, `USUSDT:volume.relative1h`, `USUSDT:global.long.change1h`, `USUSDT:global.short.change1h`, `USUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketMechanism | UNSUPPORTED_CAUSE_OR_ORDER | 杠杆 |

## USUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, WRONG_ACCOUNT_OR_OI_SCOPE。
- 独立错误性质：FALSE_REJECTION, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：21诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另2项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/USUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/USUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`USUSDT:price.closed1h`, `USUSDT:directional.price.previous1h`, `USUSDT:oi.1h`, `USUSDT:price.closed24h`, `USUSDT:oi.24h`, `USUSDT:price.drawdown`, `USUSDT:volume.relative1h`, `USUSDT:global.long.change1h`, `USUSDT:global.short.change1h`, `USUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## USUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, WRONG_ACCOUNT_OR_OI_SCOPE。
- 独立错误性质：FALSE_REJECTION, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：21诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另2项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/USUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/USUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`USUSDT:price.closed1h`, `USUSDT:directional.price.previous1h`, `USUSDT:oi.1h`, `USUSDT:price.closed24h`, `USUSDT:oi.24h`, `USUSDT:price.drawdown`, `USUSDT:volume.relative1h`, `USUSDT:global.long.change1h`, `USUSDT:global.short.change1h`, `USUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## BATUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, FUNDING_DIRECTION_MUST_USE_EVIDENCE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7。
- 修复后完整状态：**FAILED**。剩余代码：UNVERIFIED_PARTICIPANT_STATE。
- 解除明确误拒绝：16诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另6项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/BATUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；回撤被说成已现抛压，需限制已确认参与者行为
- 实际声明/文本引用Evidence：`BATUSDT:price.closed1h`, `BATUSDT:directional.price.previous1h`, `BATUSDT:oi.1h`, `BATUSDT:volume.relative1h`, `BATUSDT:price.drawdown`, `BATUSDT:price.rangeLowHigh`, `BATUSDT:price.closed24h`, `BATUSDT:oi.24h`, `BATUSDT:price.rolling24h`, `BATUSDT:global.long.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNVERIFIED_PARTICIPANT_STATE | 完整规则/Schema检查 |

## BATUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, FUNDING_DIRECTION_MUST_USE_EVIDENCE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975。
- 修复后完整状态：**FAILED**。剩余代码：UNVERIFIED_PARTICIPANT_STATE。
- 解除明确误拒绝：16诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另6项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/BATUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；回撤被说成已现抛压，需限制已确认参与者行为
- 实际声明/文本引用Evidence：`BATUSDT:price.closed1h`, `BATUSDT:directional.price.previous1h`, `BATUSDT:oi.1h`, `BATUSDT:volume.relative1h`, `BATUSDT:price.drawdown`, `BATUSDT:price.rangeLowHigh`, `BATUSDT:price.closed24h`, `BATUSDT:oi.24h`, `BATUSDT:price.rolling24h`, `BATUSDT:global.long.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNVERIFIED_PARTICIPANT_STATE | 完整规则/Schema检查 |

## BATUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BEARISH / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, FUNDING_DIRECTION_MUST_USE_EVIDENCE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e。
- 修复后完整状态：**FAILED**。剩余代码：UNVERIFIED_PARTICIPANT_STATE。
- 解除明确误拒绝：16诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另6项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/BATUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；回撤被说成已现抛压，需限制已确认参与者行为
- 实际声明/文本引用Evidence：`BATUSDT:price.closed1h`, `BATUSDT:directional.price.previous1h`, `BATUSDT:oi.1h`, `BATUSDT:volume.relative1h`, `BATUSDT:price.drawdown`, `BATUSDT:price.rangeLowHigh`, `BATUSDT:price.closed24h`, `BATUSDT:oi.24h`, `BATUSDT:price.rolling24h`, `BATUSDT:global.long.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNVERIFIED_PARTICIPANT_STATE | 完整规则/Schema检查 |

## WIFUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：NO_EDGE / 24h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER。
- 独立错误性质：CONTRACT_MISMATCH, FALSE_REJECTION, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9。
- 修复后完整状态：**FAILED**。剩余代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：6诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNVERIFIED_NUMERIC_FACT。另2项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/WIFUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/WIFUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`WIFUSDT:price.closed24h`, `WIFUSDT:directional.price.previous24h`, `WIFUSDT:oi.24h`, `WIFUSDT:global.flip`, `WIFUSDT:global.long.change24h`, `WIFUSDT:global.short.change24h`, `WIFUSDT:price.closed1h`, `WIFUSDT:price.closed4h`, `WIFUSDT:oi.1h`, `WIFUSDT:oi.4h`, `WIFUSDT:volume.relative1h`, `WIFUSDT:volume.relative5m`, `WIFUSDT:price.drawdown`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| horizonReason | UNVERIFIED_NUMERIC_FACT | -0.18% |
| marketThesis | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| preferredScenario | UNVERIFIED_NUMERIC_FACT | 0.2171 |
| preferredScenario | UNVERIFIED_NUMERIC_FACT | 52.08% |
| alternativeScenario | UNVERIFIED_NUMERIC_FACT | -0.18% |
| followUp1 | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| / | UNTRUSTED_NUMBER_OR_PROBABILITY | 完整规则/Schema检查 |

## WIFUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：NO_EDGE / 24h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df。
- 修复后完整状态：**FAILED**。剩余代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：23诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNVERIFIED_NUMERIC_FACT。另5项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/WIFUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/WIFUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`WIFUSDT:price.closed24h`, `WIFUSDT:directional.price.previous24h`, `WIFUSDT:oi.24h`, `WIFUSDT:global.flip`, `WIFUSDT:global.long.change24h`, `WIFUSDT:global.short.change24h`, `WIFUSDT:price.closed1h`, `WIFUSDT:price.closed4h`, `WIFUSDT:oi.1h`, `WIFUSDT:oi.4h`, `WIFUSDT:volume.relative1h`, `WIFUSDT:volume.relative5m`, `WIFUSDT:price.drawdown`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| preferredScenario | UNVERIFIED_NUMERIC_FACT | 0.2171000 USDT |
| followUp1 | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| / | UNTRUSTED_NUMBER_OR_PROBABILITY | 完整规则/Schema检查 |

## WIFUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：NO_EDGE / 24h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd。
- 修复后完整状态：**FAILED**。剩余代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：21诊断，UNTRUSTED_SYMBOL_OR_METRIC。另5项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/WIFUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/WIFUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`WIFUSDT:price.closed24h`, `WIFUSDT:directional.price.previous24h`, `WIFUSDT:oi.24h`, `WIFUSDT:global.flip`, `WIFUSDT:global.long.change24h`, `WIFUSDT:global.short.change24h`, `WIFUSDT:price.closed1h`, `WIFUSDT:price.closed4h`, `WIFUSDT:oi.1h`, `WIFUSDT:oi.4h`, `WIFUSDT:volume.relative1h`, `WIFUSDT:volume.relative5m`, `WIFUSDT:price.drawdown`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| preferredScenario | UNVERIFIED_NUMERIC_FACT | 0.2171000 USDT |
| followUp1 | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| / | UNTRUSTED_NUMBER_OR_PROBABILITY | 完整规则/Schema检查 |

## AIOTUSDT / hourly_20261010_2200 / attempt 1

- 原始方向/周期：BULLISH / 4h；evaluationTime：2026-10-10T14:00:12.629Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：14诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNVERIFIED_NUMERIC_FACT, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED。另7项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`AIOTUSDT:price.closed4h`, `AIOTUSDT:oi.4h`, `AIOTUSDT:directional.price.previous4h`, `AIOTUSDT:price.closed1h`, `AIOTUSDT:oi.1h`, `AIOTUSDT:price.closed24h`, `AIOTUSDT:oi.24h`, `AIOTUSDT:volume.relative1h`, `AIOTUSDT:volume.relative5m`, `AIOTUSDT:price.drawdown`, `AIOTUSDT:price.rangeLowHigh`, `AIOTUSDT:global.short.change4h`, `AIOTUSDT:global.long.change4h`, `AIOTUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## AIOTUSDT / hourly_20261010_2200 / attempt 2

- 原始方向/周期：BULLISH / 4h；evaluationTime：2026-10-10T14:00:12.629Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：14诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNVERIFIED_NUMERIC_FACT, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED。另7项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`AIOTUSDT:price.closed4h`, `AIOTUSDT:oi.4h`, `AIOTUSDT:directional.price.previous4h`, `AIOTUSDT:price.closed1h`, `AIOTUSDT:oi.1h`, `AIOTUSDT:price.closed24h`, `AIOTUSDT:oi.24h`, `AIOTUSDT:volume.relative1h`, `AIOTUSDT:volume.relative5m`, `AIOTUSDT:price.drawdown`, `AIOTUSDT:price.rangeLowHigh`, `AIOTUSDT:global.short.change4h`, `AIOTUSDT:global.long.change4h`, `AIOTUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## AIOTUSDT / hourly_20261010_2200 / attempt 3

- 原始方向/周期：BULLISH / 4h；evaluationTime：2026-10-10T14:00:12.629Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：14诊断，UNTRUSTED_SYMBOL_OR_METRIC, UNVERIFIED_NUMERIC_FACT, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED。另7项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`AIOTUSDT:price.closed4h`, `AIOTUSDT:oi.4h`, `AIOTUSDT:directional.price.previous4h`, `AIOTUSDT:price.closed1h`, `AIOTUSDT:oi.1h`, `AIOTUSDT:price.closed24h`, `AIOTUSDT:oi.24h`, `AIOTUSDT:volume.relative1h`, `AIOTUSDT:volume.relative5m`, `AIOTUSDT:price.drawdown`, `AIOTUSDT:price.rangeLowHigh`, `AIOTUSDT:global.short.change4h`, `AIOTUSDT:global.long.change4h`, `AIOTUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## AGTUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BEARISH_REVERSAL / 1h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED, TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f。
- 修复后完整状态：**FAILED**。剩余代码：REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNSUPPORTED_CAUSE_OR_ORDER, UNTRUSTED_NUMBER_OR_PROBABILITY, UNAVAILABLE_INDICATOR_OR_STRUCTURE。
- 解除明确误拒绝：32诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另5项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/AGTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/AGTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`AGTUSDT:price.closed1h`, `AGTUSDT:directional.price.previous1h`, `AGTUSDT:oi.1h`, `AGTUSDT:volume.relative1h`, `AGTUSDT:global.short.change1h`, `AGTUSDT:global.long.change1h`, `AGTUSDT:price.closed4h`, `AGTUSDT:price.closed24h`, `AGTUSDT:price.drawdown`, `AGTUSDT:oi.4h`, `AGTUSDT:oi.24h`, `AGTUSDT:funding.latest`, `AGTUSDT:funding.sum24h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNSUPPORTED_CAUSE_OR_ORDER | 回补 |
| preferredScenario | UNVERIFIED_NUMERIC_FACT | 5% |
| alternativeScenario | UNAVAILABLE_INDICATOR_OR_STRUCTURE | 跌破 |
| followUp0 | UNVERIFIED_NUMERIC_FACT | -1% |
| /marketBias | REVERSAL_DIRECTION_NOT_SUPPORTED | 完整规则/Schema检查 |
| /invalidation | INVALIDATION_RULE_DIRECTION_CONFLICT | 完整规则/Schema检查 |
| / | UNTRUSTED_NUMBER_OR_PROBABILITY | 完整规则/Schema检查 |

## AGTUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BEARISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：39诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另5项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/AGTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/AGTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`AGTUSDT:price.closed4h`, `AGTUSDT:directional.price.previous4h`, `AGTUSDT:price.closed24h`, `AGTUSDT:directional.price.previous24h`, `AGTUSDT:oi.4h`, `AGTUSDT:oi.24h`, `AGTUSDT:price.drawdown`, `AGTUSDT:price.rangeLowHigh`, `AGTUSDT:price.closed1h`, `AGTUSDT:directional.price.previous1h`, `AGTUSDT:oi.1h`, `AGTUSDT:volume.relative1h`, `AGTUSDT:global.short.change1h`, `AGTUSDT:global.long.change1h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## AGTUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BEARISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：39诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另5项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/AGTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/AGTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`AGTUSDT:price.closed4h`, `AGTUSDT:directional.price.previous4h`, `AGTUSDT:price.closed24h`, `AGTUSDT:directional.price.previous24h`, `AGTUSDT:oi.4h`, `AGTUSDT:oi.24h`, `AGTUSDT:price.drawdown`, `AGTUSDT:price.rangeLowHigh`, `AGTUSDT:price.closed1h`, `AGTUSDT:directional.price.previous1h`, `AGTUSDT:oi.1h`, `AGTUSDT:volume.relative1h`, `AGTUSDT:global.short.change1h`, `AGTUSDT:global.long.change1h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## NIGHTUSDT / hourly_20261010_2100 / attempt 1

- 原始方向/周期：BEARISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：FAIL。
- 原全部失败代码：DIRECTIONAL_SCHEMA_INVALID。
- 独立错误性质：TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337。
- 修复后完整状态：**FAILED**。剩余代码：DIRECTIONAL_SCHEMA_INVALID。
- 解除明确误拒绝：0诊断，无。另0项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`NIGHTUSDT:price.closed1h`, `NIGHTUSDT:price.closed4h`, `NIGHTUSDT:oi.1h`, `NIGHTUSDT:oi.4h`, `NIGHTUSDT:directional.price.previous4h`, `NIGHTUSDT:price.drawdown`, `NIGHTUSDT:volume.relative1h`, `NIGHTUSDT:price.closed24h`, `NIGHTUSDT:price.rolling24h`, `NIGHTUSDT:oi.24h`, `NIGHTUSDT:global.flip`, `NIGHTUSDT:global.long.change24h`, `NIGHTUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| / | DIRECTIONAL_SCHEMA_INVALID | 完整规则/Schema检查 |

## NIGHTUSDT / hourly_20261010_2100 / attempt 2

- 原始方向/周期：BEARISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861。
- 修复后完整状态：**FAILED**。剩余代码：UNSUPPORTED_CAUSE_OR_ORDER。
- 解除明确误拒绝：15诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另6项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`NIGHTUSDT:price.closed1h`, `NIGHTUSDT:price.closed4h`, `NIGHTUSDT:oi.1h`, `NIGHTUSDT:oi.4h`, `NIGHTUSDT:directional.price.previous4h`, `NIGHTUSDT:price.drawdown`, `NIGHTUSDT:volume.relative1h`, `NIGHTUSDT:price.closed24h`, `NIGHTUSDT:price.rolling24h`, `NIGHTUSDT:oi.24h`, `NIGHTUSDT:global.flip`, `NIGHTUSDT:global.long.change24h`, `NIGHTUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| marketThesis | UNSUPPORTED_CAUSE_OR_ORDER | 减仓 |

## NIGHTUSDT / hourly_20261010_2100 / attempt 3

- 原始方向/周期：BEARISH / 4h；evaluationTime：2026-10-10T13:00:15.062Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67。
- 修复后完整状态：**VALIDATED**。剩余代码：无。
- 解除明确误拒绝：15诊断，UNVERIFIED_NUMERIC_FACT, UNTRUSTED_SYMBOL_OR_METRIC。另6项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json)。
- 事实安全风险：通过合同与事实校验；未来预测仍未经事后验证；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`NIGHTUSDT:price.closed1h`, `NIGHTUSDT:price.closed4h`, `NIGHTUSDT:oi.1h`, `NIGHTUSDT:oi.4h`, `NIGHTUSDT:directional.price.previous4h`, `NIGHTUSDT:price.drawdown`, `NIGHTUSDT:volume.relative1h`, `NIGHTUSDT:price.closed24h`, `NIGHTUSDT:price.rolling24h`, `NIGHTUSDT:oi.24h`, `NIGHTUSDT:global.flip`, `NIGHTUSDT:global.long.change24h`, `NIGHTUSDT:funding.latest`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| — | 无 | — |

## WLFIUSDT / hourly_20261010_2200 / attempt 1

- 原始方向/周期：NO_EDGE / 24h；evaluationTime：2026-10-10T14:00:12.629Z；Schema：PASS。
- 原全部失败代码：UNTRUSTED_NUMBER_OR_PROBABILITY。
- 独立错误性质：FALSE_REJECTION, CONTRACT_MISMATCH, TRUE_REJECTION, UNDETERMINED；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df。
- 修复后完整状态：**FAILED**。剩余代码：UNTRUSTED_NUMBER_OR_PROBABILITY。
- 解除明确误拒绝：17诊断，UNVERIFIED_NUMERIC_FACT。另6项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2200/facts/WLFIUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/WLFIUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`WLFIUSDT:price.closed24h`, `WLFIUSDT:oi.24h`, `WLFIUSDT:price.rolling24h`, `WLFIUSDT:volume.rolling24h`, `WLFIUSDT:price.closed1h`, `WLFIUSDT:oi.1h`, `WLFIUSDT:volume.relative1h`, `WLFIUSDT:volume.relative5m`, `WLFIUSDT:price.drawdown`, `WLFIUSDT:price.closed4h`, `WLFIUSDT:oi.4h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| preferredScenario | UNVERIFIED_NUMERIC_FACT | 0.0570 |
| preferredScenario | UNVERIFIED_NUMERIC_FACT | -2.90% |
| preferredScenario | UNVERIFIED_NUMERIC_FACT | -5% |
| / | UNTRUSTED_NUMBER_OR_PROBABILITY | 完整规则/Schema检查 |

## WLFIUSDT / hourly_20261010_2200 / attempt 2

- 原始方向/周期：NO_EDGE / 24h；evaluationTime：2026-10-10T14:00:12.629Z；Schema：FAIL。
- 原全部失败代码：DIRECTIONAL_SCHEMA_INVALID。
- 独立错误性质：TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a。
- 修复后完整状态：**FAILED**。剩余代码：DIRECTIONAL_SCHEMA_INVALID。
- 解除明确误拒绝：0诊断，无。另0项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2200/facts/WLFIUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/WLFIUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`WLFIUSDT:price.closed24h`, `WLFIUSDT:oi.24h`, `WLFIUSDT:price.rolling24h`, `WLFIUSDT:volume.rolling24h`, `WLFIUSDT:price.closed1h`, `WLFIUSDT:oi.1h`, `WLFIUSDT:volume.relative1h`, `WLFIUSDT:volume.relative5m`, `WLFIUSDT:price.drawdown`, `WLFIUSDT:price.closed4h`, `WLFIUSDT:oi.4h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| / | DIRECTIONAL_SCHEMA_INVALID | 完整规则/Schema检查 |

## WLFIUSDT / hourly_20261010_2200 / attempt 3

- 原始方向/周期：NO_EDGE / 24h；evaluationTime：2026-10-10T14:00:12.629Z；Schema：FAIL。
- 原全部失败代码：DIRECTIONAL_SCHEMA_INVALID。
- 独立错误性质：TRUE_REJECTION；逐诊断、原字段全文、来源算术、预标签见 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/reviewed-classification.json) 中id=hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910。
- 修复后完整状态：**FAILED**。剩余代码：DIRECTIONAL_SCHEMA_INVALID。
- 解除明确误拒绝：0诊断，无。另0项合同/争议诊断不再出现，不统一视为事实证明。
- 原Facts：[data/runs/hourly_20261010_2200/facts/WLFIUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/WLFIUSDT.json)；原请求/完整实际Evidence：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json)；原模型原文：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json)；原解析/验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json)。
- 事实安全风险：仍有阻断/歧义，禁止当作VALIDATED输出；保留不确定性，不据此证明未来行情或具体参与者行为。
- 实际声明/文本引用Evidence：`WLFIUSDT:price.closed24h`, `WLFIUSDT:oi.24h`, `WLFIUSDT:price.rolling24h`, `WLFIUSDT:volume.rolling24h`, `WLFIUSDT:price.closed1h`, `WLFIUSDT:oi.1h`, `WLFIUSDT:volume.relative1h`, `WLFIUSDT:volume.relative5m`, `WLFIUSDT:price.drawdown`, `WLFIUSDT:price.closed4h`, `WLFIUSDT:oi.4h`。新usedReferences与完整绑定诊断保存在最终live-replay.json同id行（失败时仍保存逐数字source IDs）。

| 仍阻断位置 | 代码 | 原始字面值/匹配片段 |
|---|---|---|
| / | DIRECTIONAL_SCHEMA_INVALID | 完整规则/Schema检查 |

## 70历史研判逐事件结果

完整原文/原错误/新诊断/来源 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/historical-replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/historical-replay.json)。25→26，全部原25保留。

| Symbol | Run | 最终 | 方向 | 最早attempt | 仍有拒绝码（包含未选attempt） |
|---|---|---|---|---:|---|
| 1000BONKUSDT | hourly_20261010_2100 | FAILED | — | — | UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| API3USDT | hourly_20261010_2100 | FAILED | — | — | INVALID_LLM_JSON, SUPPORT_SAMPLES_NOT_ALIGNED |
| ARPAUSDT | hourly_20261010_2100 | VALIDATED | BULLISH | 1 | INVALID_LLM_JSON |
| ARUSDT | hourly_20261010_2100 | VALIDATED | BEARISH | 2 | DIRECTIONAL_SCHEMA_INVALID |
| BATUSDT | hourly_20261010_2100 | FAILED | — | — | WRONG_ACCOUNT_OR_OI_SCOPE, DIRECTIONAL_SCHEMA_INVALID |
| CAPUSDT | hourly_20261010_2100 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID |
| CELRUSDT | hourly_20261010_2100 | FAILED | — | — | UNAVAILABLE_INDICATOR_OR_STRUCTURE, QUALITATIVE_FACT_CONTRADICTION, UNSUPPORTED_CAUSE_OR_ORDER |
| CFXUSDT | hourly_20261010_2100 | FAILED | — | — | OI_DIRECTION_OR_INTENT_UNSUPPORTED |
| ENSUSDT | hourly_20261010_2100 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID |
| ERAUSDT | hourly_20261010_2100 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID |
| EULUSDT | hourly_20261010_2100 | FAILED | — | — | SUPPORT_SAMPLES_NOT_ALIGNED, UNSUPPORTED_CAUSE_OR_ORDER, DIRECTIONAL_SCHEMA_INVALID |
| FARTCOINUSDT | hourly_20261010_2100 | FAILED | — | — | UNAVAILABLE_INDICATOR_OR_STRUCTURE, UNTRUSTED_NUMBER_OR_PROBABILITY, WRONG_ACCOUNT_OR_OI_SCOPE |
| HEIUSDT | hourly_20261010_2100 | FAILED | — | — | SUPPORT_SAMPLES_NOT_ALIGNED, QUALITATIVE_FACT_CONTRADICTION, DIRECTIONAL_SCHEMA_INVALID |
| HEMIUSDT | hourly_20261010_2100 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER, UNTRUSTED_NUMBER_OR_PROBABILITY, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| IOSTUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 2 | UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| JCTUSDT | hourly_20261010_2100 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, OI_DIRECTION_OR_INTENT_UNSUPPORTED |
| KMNOUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 2 | FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| LAUSDT | hourly_20261010_2100 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER, DIRECTIONAL_SCHEMA_INVALID |
| LUMIAUSDT | hourly_20261010_2100 | FAILED | — | — | INVALID_LLM_JSON, DIRECTIONAL_SCHEMA_INVALID |
| MAGICUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 1 | FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| MORPHOUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 1 |  |
| MOVRUSDT | hourly_20261010_2100 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER, WRONG_ACCOUNT_OR_OI_SCOPE, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| NEIROUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 1 | FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| ONEUSDT | hourly_20261010_2100 | FAILED | — | — | SUPPORT_SAMPLES_NOT_ALIGNED, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| PEOPLEUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 2 | DIRECTIONAL_SCHEMA_INVALID |
| PIEVERSEUSDT | hourly_20261010_2100 | FAILED | — | — | QUALITATIVE_FACT_CONTRADICTION, FUNDING_DIRECTION_MUST_USE_EVIDENCE, UNTRUSTED_NUMBER_OR_PROBABILITY, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| POLUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 2 | FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| PUMPUSDT | hourly_20261010_2100 | FAILED | — | — | UNAVAILABLE_INDICATOR_OR_STRUCTURE, DIRECTIONAL_SCHEMA_INVALID |
| RLCUSDT | hourly_20261010_2100 | FAILED | — | — | SUPPORT_SAMPLES_NOT_ALIGNED, UNSUPPORTED_CAUSE_OR_ORDER |
| STRKUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 1 | UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| USUSDT | hourly_20261010_2100 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER, FUNDING_DIRECTION_MUST_USE_EVIDENCE, DIRECTIONAL_SCHEMA_INVALID |
| VETUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 1 |  |
| VTHOUSDT | hourly_20261010_2100 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER |
| WIFUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 2 | FUNDING_DIRECTION_MUST_USE_EVIDENCE, UNSUPPORTED_CAUSE_OR_ORDER |
| XLMUSDT | hourly_20261010_2100 | VALIDATED | NO_EDGE | 2 | SUPPORT_SAMPLES_NOT_ALIGNED, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| AIOTUSDT | hourly_20261010_2200 | VALIDATED | BULLISH | 2 | OI_DIRECTION_OR_INTENT_UNSUPPORTED |
| ALGOUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 2 | FUNDING_DIRECTION_MUST_USE_EVIDENCE, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| APRUSDT | hourly_20261010_2200 | FAILED | — | — | INVALID_LLM_JSON, DIRECTIONAL_SCHEMA_INVALID |
| ARPAUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 |  |
| ARUSDT | hourly_20261010_2200 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| BABYUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 2 | DIRECTIONAL_SCHEMA_INVALID |
| BATUSDT | hourly_20261010_2200 | FAILED | — | — | QUALITATIVE_FACT_CONTRADICTION, UNSUPPORTED_CAUSE_OR_ORDER |
| CAPUSDT | hourly_20261010_2200 | VALIDATED | BULLISH | 2 | DIRECTIONAL_SCHEMA_INVALID |
| CELRUSDT | hourly_20261010_2200 | FAILED | — | — | WRONG_ACCOUNT_OR_OI_SCOPE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| ENSUSDT | hourly_20261010_2200 | FAILED | — | — | WRONG_ACCOUNT_OR_OI_SCOPE, UNAVAILABLE_INDICATOR_OR_STRUCTURE, DIRECTIONAL_SCHEMA_INVALID |
| ERAUSDT | hourly_20261010_2200 | FAILED | — | — | INVALID_LLM_JSON, DIRECTIONAL_SCHEMA_INVALID |
| GRASSUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER |
| HEIUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 | UNTRUSTED_NUMBER_OR_PROBABILITY |
| JCTUSDT | hourly_20261010_2200 | FAILED | — | — | INVALID_LLM_JSON, DIRECTIONAL_SCHEMA_INVALID |
| KAITOUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| LAUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER, FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| MAGICUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER, FUNDING_DIRECTION_MUST_USE_EVIDENCE |
| MANAUSDT | hourly_20261010_2200 | FAILED | — | — | SUPPORT_SAMPLES_NOT_ALIGNED, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE, DIRECTIONAL_SCHEMA_INVALID |
| METUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 |  |
| MINAUSDT | hourly_20261010_2200 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER |
| MOVRUSDT | hourly_20261010_2200 | FAILED | — | — | SUPPORT_SAMPLES_NOT_ALIGNED, QUALITATIVE_FACT_CONTRADICTION, OI_DIRECTION_OR_INTENT_UNSUPPORTED |
| OPGUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 2 | UNSUPPORTED_CAUSE_OR_ORDER |
| PUMPUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER |
| QNTUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 |  |
| RLCUSDT | hourly_20261010_2200 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE, DIRECTIONAL_SCHEMA_INVALID |
| SAHARAUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, QUALITATIVE_FACT_CONTRADICTION |
| SEIUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID |
| SPKUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 2 | UNAVAILABLE_INDICATOR_OR_STRUCTURE |
| STABLEUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 |  |
| STRKUSDT | hourly_20261010_2200 | FAILED | — | — | UNSUPPORTED_CAUSE_OR_ORDER, OI_DIRECTION_OR_INTENT_UNSUPPORTED, DIRECTIONAL_SCHEMA_INVALID |
| SUPERUSDT | hourly_20261010_2200 | FAILED | — | — | OI_DIRECTION_OR_INTENT_UNSUPPORTED, DIRECTIONAL_SCHEMA_INVALID |
| USUSDT | hourly_20261010_2200 | FAILED | — | — | DIRECTIONAL_SCHEMA_INVALID, UNSUPPORTED_CAUSE_OR_ORDER |
| WLFIUSDT | hourly_20261010_2200 | FAILED | — | — | INVALID_LLM_JSON, WRONG_ACCOUNT_OR_OI_SCOPE |
| XMRUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 | DIRECTIONAL_SCHEMA_INVALID |
| ZROUSDT | hourly_20261010_2200 | VALIDATED | NO_EDGE | 1 | UNAVAILABLE_INDICATOR_OR_STRUCTURE |

## 冻结保留集

| Symbol | Run | attempt | 预期 | 实际 |
|---|---|---:|---|---|
| ARPAUSDT | hourly_20261010_2100 | 1 | PASS | PASS |
| ARUSDT | hourly_20261010_2100 | 2 | PASS | PASS |
| NEIROUSDT | hourly_20261010_2100 | 1 | PASS | PASS |
| METUSDT | hourly_20261010_2200 | 1 | PASS | PASS |
| VETUSDT | hourly_20261010_2100 | 1 | PASS | PASS |
| HEIUSDT | hourly_20261010_2200 | 1 | PASS | PASS |
| CFXUSDT | hourly_20261010_2100 | 1 | REJECT | REJECT |
| JCTUSDT | hourly_20261010_2100 | 2 | REJECT | REJECT |
| MOVRUSDT | hourly_20261010_2200 | 2 | REJECT | REJECT |
| SUPERUSDT | hourly_20261010_2200 | 1 | REJECT | REJECT |

8个冻结语言例的全文和实际结果 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/holdout-results.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/verified/holdout-results.json)。无保留集失败，无Symbol补丁。数据时间/来源 [validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/holdout.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/holdout.json)；有限历史曝光与错误反转未覆盖已在主报告披露。

## 规则前后与反例

| 规则 | 原真实失败 | 改后 | 仍有其他阻断/反例 | 位置 |
|---|---|---|---|---|
| 前导+、单位/窗口 | AIOT4h +11.53%/+19.69%，旧numeric拒绝 | 正确舍入值接受 | 1h OI套4h5.63%、Funding伪值、pp混%仍拒绝 | [src/analysis/evidence-precision-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-precision-validator.js) |
| 当前Symbol、裸ID | MAGICUSDT和price.closed1h裸ID被误认币种 | 正式整份通过 | OTHERUSDT、相似TESTUSDTX、未知ID拒绝 | [src/analysis/directional-alignment-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-alignment-guard.js) |
| 否定作用域 | ERA无法据此确认强平、AIOT不保证未来方向 | 否定解释不再肯定关键词 | ERA其他回补/结构仍拒绝；双重否定、转折后主力资金断言仍拒绝 | [src/analysis/evidence-precision-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-precision-validator.js) |
| 反转方向 | APR/AGT BEARISH_REVERSAL但当前上转 | 仍拒绝 | 合法等长向上/向下Mock通过，不要求ICT | [src/analysis/directional-alignment-guard.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/directional-alignment-guard.js) |
| 历史/未来分离 | AIOT未来情景重述历史基线误拒 | 已发生基线接受、已有rule精确绑定 | WIF/WLFI未来精确目标仍拒绝，OI弱化仍仅warning | [src/analysis/evidence-precision-validator.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/analysis/evidence-precision-validator.js) |
| 后置ID/有序多指标 | AGT前一值的ID被借给后一值、NIGHT同期列表 | 严格前/后引用及已标记顺序绑定 | 不明确window/paired语法仍保守拒绝；不按数值任选Evidence | [test/analyst-precision.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-precision.test.js) |
