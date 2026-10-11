# BA_BIAS_ANALYST_GENERATION_QUALITY_V1_CASES

严格离线；以下全部是原真实V2响应的观察，未生成V3 DeepSeek响应。正式结果按当前未修改的验证器读取。原联调每样本3份响应；生产入口仍为2次总调用。

## ERAUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/ERAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/ERAUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json)。
- 原始首次错误：`UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE`；完整原错误对象见原始验证文件。当前正式首次错误：`UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE`。
- 最早通过：无，三份均未通过；通过attempt：`[]`。
- 实际文本依据与生成问题：“追多拥挤”当作已发生状态；正OI仍用负Funding推导回补；preferredScenario要求“不跌破近期已收盘结构”，但没有结构数据。三次重复核心缺陷。
- V3通用预防：机制只在marketMechanism且绑定同期价格/OI；不把参与者状态当事实；缺失结构不能成为具体失效依据。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BULLISH / 4h | 215 | UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a1_dfb0f761-9e92-4934-8bcd-f5f62df3c856.json) |
| 2 | BULLISH / 4h | 196 | UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a2_c8c6f0fb-ab4c-4d6e-b981-f76f69eecb8e.json) |
| 3 | BULLISH / 4h | 196 | UNVERIFIED_PARTICIPANT_STATE, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_ERAUSDT_a3_505b050d-98f7-4b50-957b-8a6add7f9d63.json) |

## MAGICUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/MAGICUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json)。
- 原始首次错误：`UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY`；完整原错误对象见原始验证文件。当前正式首次错误：`无`。
- 最早通过：attempt 1；通过attempt：`[1, 2, 3]`。
- 实际文本依据与生成问题：明确区分24h上涨背景与1h回落；主周期价格/OI、冲突ID和程序规则对应；机制使用可能性而非确认。文本仍有309字及重复数字，不能因此断言成功来自简短。
- V3通用预防：保留主周期证据与竞争性背景分工，引用ID减少复写；不复制此币种答案。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BEARISH / 1h | 309 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a1_85632b55-4052-4a2b-a3e6-5f8bc78b5970.json) |
| 2 | BEARISH / 1h | 309 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a2_16caf629-a91d-4932-acf5-04886a7688ed.json) |
| 3 | BEARISH / 1h | 309 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_MAGICUSDT_a3_dc21b01b-8ec6-4314-b452-a767d279c394.json) |

## APRUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/APRUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/APRUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json)。
- 原始首次错误：`REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE`；完整原错误对象见原始验证文件。当前正式首次错误：`REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE`。
- 最早通过：无，三份均未通过；通过attempt：`[]`。
- 实际文本依据与生成问题：首次文本描述此前1h负、当前正，却选择BEARISH_REVERSAL；恢复正确改BULLISH_REVERSAL，但仍保留正OI下“空头回补及新开多头共同参与”的无独立证据解释。恢复后marketThesis由181增至397字。
- V3通用预防：反转双端符号和引用要求；不能从OI净扩张确认/推导具体总开平仓构成；短字段独立职责。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BEARISH_REVERSAL / 1h | 181 | REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a1_0c1c1bbd-4a2b-4a71-8b6c-de7e3a3f3486.json) |
| 2 | BULLISH_REVERSAL / 1h | 397 | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a2_a4fcf05e-cec2-495f-84b1-267747b3ccf2.json) |
| 3 | BULLISH_REVERSAL / 1h | 397 | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_APRUSDT_a3_7d552805-a845-402b-804f-b00718f94843.json) |

## USUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/USUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/USUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json)。
- 原始首次错误：`UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, WRONG_ACCOUNT_OR_OI_SCOPE`；完整原错误对象见原始验证文件。当前正式首次错误：`UNSUPPORTED_CAUSE_OR_ORDER`。
- 最早通过：attempt 2；通过attempt：`[2, 3]`。
- 实际文本依据与生成问题：首次“杠杆敞口持续了结”超出OI数量证据；恢复去掉杠杆叙述、标清各周期及ID，并保留不确定敞口机制，第二次通过。
- V3通用预防：OI合约规模与杠杆、资金、方向分开；机制与Forecast分开。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BEARISH / 1h | 126 | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a1_8d153fc8-140c-463f-be4e-e0674daa1b1b.json) |
| 2 | BEARISH / 1h | 259 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a2_aba8aae6-f9ab-43de-b204-be1c9e40e699.json) |
| 3 | BEARISH / 1h | 259 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_USUSDT_a3_81b99e5b-9097-4e8c-b2fc-9cf1cf35d17d.json) |

## BATUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/BATUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/BATUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json)。
- 原始首次错误：`UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, FUNDING_DIRECTION_MUST_USE_EVIDENCE`；完整原错误对象见原始验证文件。当前正式首次错误：`UNVERIFIED_PARTICIPANT_STATE`。
- 最早通过：无，三份均未通过；通过attempt：`[]`。
- 实际文本依据与生成问题：三次marketThesis仍包含“说明高位抛压已现”。数字与Symbol误拒修复后该确定性参与者状态仍不成立。旧恢复诊断未突出这个后来识别的错误，不能简单归因模型忽略已给诊断。
- V3通用预防：参与者状态和确定性因果均检查；新的恢复逐字段解释实际正式诊断，不只修数值或ID。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BEARISH / 1h | 210 | UNVERIFIED_PARTICIPANT_STATE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a1_6e33c6c4-73ac-4e35-8f21-63aae04713e7.json) |
| 2 | BEARISH / 1h | 210 | UNVERIFIED_PARTICIPANT_STATE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a2_e04d30a8-c183-4b65-a642-b476f9944975.json) |
| 3 | BEARISH / 1h | 210 | UNVERIFIED_PARTICIPANT_STATE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_BATUSDT_a3_138abeed-f22c-4dc3-a8ed-b1e38991117e.json) |

## WIFUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/WIFUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/WIFUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json)。
- 原始首次错误：`UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER`；完整原错误对象见原始验证文件。当前正式首次错误：`UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER`。
- 最早通过：无，三份均未通过；通过attempt：`[]`。
- 实际文本依据与生成问题：把当前快照价写为未来24h“0.2171附近维持震荡”条件；恢复只是增加精度、USDT和price.last引用，仍把历史观察作为未来精确价位。followUp用“区分回补与新增敞口”，超过现有证据能辨别的范围。
- V3通用预防：当前参考价仅是观察；未来情景定性，不给目标价；可能机制只在机制字段，不承诺OI能识别具体交易行为。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | NO_EDGE / 24h | 211 | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a1_7a2c8c6b-25e2-413c-b472-445a1976c4c9.json) |
| 2 | NO_EDGE / 24h | 354 | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a2_cc42f6e3-5765-44a7-8650-ff3d0eafc4df.json) |
| 3 | NO_EDGE / 24h | 352 | UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_WIFUSDT_a3_a7d645ec-80ee-4b7e-a71c-3f2fd8ac3bdd.json) |

## AIOTUSDT / hourly_20261010_2200

- 原Facts：[data/runs/hourly_20261010_2200/facts/AIOTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/AIOTUSDT.json)；评价时间：`2026-10-10T14:00:12.629Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json)。
- 原始首次错误：`UNTRUSTED_SYMBOL_OR_METRIC, UNTRUSTED_NUMBER_OR_PROBABILITY, UNSUPPORTED_CAUSE_OR_ORDER, FORECAST_CERTAINTY_OR_STRUCTURE_UNSUPPORTED`；完整原错误对象见原始验证文件。当前正式首次错误：`无`。
- 最早通过：attempt 1；通过attempt：`[1, 2, 3]`。
- 实际文本依据与生成问题：主周期4h价格/OI明确、账户变化用百分点、Funding按真实结算；无伪造结构、保留方向不确定性，三份均通过。273字且重复数值较多，不能据此证明复写必然失败。
- V3通用预防：价格/OI同期证据作为方向依据，账户分布作为独立事实而非单侧仓位；用ID减少误抄风险。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BULLISH / 4h | 273 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a1_b410b2fc-b59d-4f26-9d75-7e9df0bc1b09.json) |
| 2 | BULLISH / 4h | 273 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a2_a854264d-1425-49a8-9e5c-e7282bd3ef0d.json) |
| 3 | BULLISH / 4h | 273 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_AIOTUSDT_a3_98255527-5099-4a2a-b25b-89476307b8bd.json) |

## AGTUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/AGTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/AGTUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json)。
- 原始首次错误：`REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNTRUSTED_NUMBER_OR_PROBABILITY, UNTRUSTED_SYMBOL_OR_METRIC, UNSUPPORTED_CAUSE_OR_ORDER, UNAVAILABLE_INDICATOR_OR_STRUCTURE`；完整原错误对象见原始验证文件。当前正式首次错误：`REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNSUPPORTED_CAUSE_OR_ORDER, UNTRUSTED_NUMBER_OR_PROBABILITY, UNAVAILABLE_INDICATOR_OR_STRUCTURE`。
- 最早通过：attempt 2；通过attempt：`[2, 3]`。
- 实际文本依据与生成问题：首次文本描述1h从负转正，却标BEARISH_REVERSAL并使用不相容失效规则；恢复选择4h BEARISH，改为该周期真实下跌/OI扩张与对应规则，第二次通过。
- V3通用预防：先选择周期，再核对当前/此前等长符号、方向和规则；允许有依据重选周期/方向，不程序强制改写。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BEARISH_REVERSAL / 1h | 300 | REVERSAL_DIRECTION_NOT_SUPPORTED, INVALIDATION_RULE_DIRECTION_CONFLICT, UNSUPPORTED_CAUSE_OR_ORDER, UNTRUSTED_NUMBER_OR_PROBABILITY, UNAVAILABLE_INDICATOR_OR_STRUCTURE | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a1_6d10b8b6-d219-4333-ac90-e77d2da6029f.json) |
| 2 | BEARISH / 4h | 328 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a2_df6ef337-3737-463f-b35e-a21a15aaa54a.json) |
| 3 | BEARISH / 4h | 328 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_AGTUSDT_a3_9ed7c3d8-627f-4f5b-81e8-d3de5fc23084.json) |

## NIGHTUSDT / hourly_20261010_2100

- 原Facts：[data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2100/facts/NIGHTUSDT.json)；评价时间：`2026-10-10T13:00:15.062Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json)。
- 原始首次错误：`DIRECTIONAL_SCHEMA_INVALID`；完整原错误对象见原始验证文件。当前正式首次错误：`DIRECTIONAL_SCHEMA_INVALID`。
- 最早通过：attempt 3；通过attempt：`[3]`。
- 实际文本依据与生成问题：首次marketThesis422字违反400上限；第二次缩至327字，却保留“更符合多头敞口减仓”于thesis；第三次322字改为相容解释后通过。原联调有三次机会，但生产本次仍只有两次总调用。
- V3通用预防：建议160字而不改400正式上限；一个字段一个职责；恢复检查所有字段，避免修长度后仍留下因果断言。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | BEARISH / 4h | 422 | DIRECTIONAL_SCHEMA_INVALID | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a1_58c3c1e4-58e5-4e43-823d-e035c9312337.json) |
| 2 | BEARISH / 4h | 327 | UNSUPPORTED_CAUSE_OR_ORDER | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a2_62295976-febb-4872-8f98-42a14c030861.json) |
| 3 | BEARISH / 4h | 322 | PASS | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2100_NIGHTUSDT_a3_6ef5acd9-620e-4e33-a0d7-f35515154f67.json) |

## WLFIUSDT / hourly_20261010_2200

- 原Facts：[data/runs/hourly_20261010_2200/facts/WLFIUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_2200/facts/WLFIUSDT.json)；评价时间：`2026-10-10T14:00:12.629Z`。
- 首次请求/输入：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)；原文响应：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)；原始验证：[validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/validation/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json)。
- 原始首次错误：`UNTRUSTED_NUMBER_OR_PROBABILITY`；完整原错误对象见原始验证文件。当前正式首次错误：`UNTRUSTED_NUMBER_OR_PROBABILITY`。
- 最早通过：无，三份均未通过；通过attempt：`[]`。
- 实际文本依据与生成问题：首次未来情景以当前0.0570作精确未来参考价，混合未来阈值与观察；恢复大量补全ID和小数，使marketThesis从222字增至485字，两份恢复均Schema失败。
- V3通用预防：避免同字段重复事实+ID+精确数字；优先ID占位符；未来情景定性，修复后必须检查长度及未报错字段。
- 是否需真实模型确认改善：**是 — NOT_TESTED_LIVE**。

| attempt | 方向/周期 | thesis字符数 | 当前正式验证 | 原始请求及完整恢复信息 | 原始响应 |
|---|---|---:|---|---|---|
| 1 | NO_EDGE / 24h | 222 | UNTRUSTED_NUMBER_OR_PROBABILITY | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a1_36752c28-a957-4346-83ee-9c54f21af4df.json) |
| 2 | NO_EDGE / 24h | 485 | DIRECTIONAL_SCHEMA_INVALID | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a2_840ce652-ecc1-411f-9b79-946b6c41887a.json) |
| 3 | NO_EDGE / 24h | 485 | DIRECTIONAL_SCHEMA_INVALID | [请求](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/requests/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json) | [响应](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_LIVE_PROBE_V1/responses/hourly_20261010_2200_WLFIUSDT_a3_3a9b5f56-381f-4f8d-a436-8b245878e910.json) |

完整旧Prompt、输入、各字段原文、恢复提示、数字重复统计和逐字段诊断均保存于 [validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/diagnostics.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/verified/diagnostics.json)，按cases[].symbol和attempt定位。无Symbol特例，无改写历史语义。
