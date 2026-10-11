# COMPACT_INTELLIGENCE 验收报告

本次仅修改展示层。真实 WIF 的已保存四个分片只读回放为一个分片；没有运行市场扫描、调查翻转时间根因或修复 Analyst 失败。历史事件时间仅引用既有 Facts，不宣称刚刚发生。

## 文件与改动

- 新增 src/intelligence/compact-renderer.js：按实际异常选择指标；区分 VALID_NO_EDGE 与 ANALYST_UNAVAILABLE；保留全部必要复核条件及竞争证据，不截断文本。
- 修改 src/intelligence/packet.js：新增已验证竞争证据和前轮有效方向的展示元数据；只有既有比较已确认实质证据及方向变化时提供方向更新。完整文本的失败状态也改为“研判不可用”。不修改资格判断。
- 修改 src/storage/delivery-queue.js：仅替换 import 和新消息 prepareDelivery 的渲染函数。1800字节分片、安全状态、重试、投递确认及锁保持原样。
- 修改 test/hourly.test.js：保留原有测试，更新新模板断言；队列测试改用明确的旧格式多分片快照，不再假设普通消息必然超长。
- 新增 test/compact.test.js、test/compact-fixture.js：41项专项测试及 Mock 数据。
- 新增 scripts/compact-replay.js：可重复的本地格式回放和静态检查。
- 验收证据：COMPACT_PROTECTED_HASHES.json、COMPACT_TEST_RESULTS.txt、COMPACT_REPLAY.json。

## 本地完整研究与出口

FULL_INTELLIGENCE 复用 data/runs/<RunId>/facts/<Symbol>.json（原始响应、全量证据、窗口与来源），stories/<Symbol>.judge.json（Judge完整结果），directional/<Symbol>.json（Analyst原始结果、校验和错误），intelligence/<Symbol>.json（完整Packet及WHAT_CHANGED）；data/directional/<snapshotId>.json 和 data/directional-results/ 保存独立研判与后续评价。data/outbox/<RunId>_<Symbol>.json 保留完整Packet、历史变化依据、Facts路径、投递ID与全部消息状态；data/state/history.json 保存历史摘要。没有复制大型原始响应。

真实示例的入口：data/outbox/hourly_20261010_2100_WIFUSDT.json；对应 data/runs/hourly_20261010_2100/{facts,stories,directional,intelligence}/ 的 WIFUSDT 文件均可追溯。原Outbox SHA256：6d9d61f869189b78019a9850f46038dd34045e6dfb9da42f5e730f8ebe93bccb（回放前后相同）。

当前 INTELLIGENCE_FIRST 主出口是 main.js → prepareDelivery → 持久化Outbox → drainDeliveryQueue → sendText。历史文章出口 storage/delivery.js → clients/dingtalk.js 的 notification/sendNotification 保持原样；两者不共用精简渲染函数。intelligenceText 继续提供完整本地展示；不作为新情报队列正文。

## 展示规则

标题明确首次情报与重要变化。保留已收盘价格1h/4h/24h和OI数量对应窗口；滚动24h单独标明，不替换已收盘数据。其他指标依异常选择：账户分布/精确百分点变化/历史翻转，顶部账户或持仓份额，账户对账户背离，成交量比较窗口，已结算Funding及相邻结算时间。5m异常不可被1h数据替代。未知指标明确缺失，不改变输出资格。

方向优先显示已验证的五类结论、周期与定性强度，随后显示已验证核心判断、交易观察、全部失效/复核规则、竞争证据、替代情景和必要风险。有效NO_EDGE显示“暂无明确方向优势”；失败、无结果或不可判断显示“方向研判不可用，需人工复核”，不提供有效方向结论。失败的fallback周期只标作复核尺度，不当预测。

关键事件时间、数据截止与RunId保留；当小时价格/OI采样早于截止时额外标注其观测时间。全量Evidence IDs、接口路径、重复时间、WHAT_CHANGED JSON、完整Funding历史与内部状态只保留本地。身份仅使用已核实名称；未核实名称不猜测。普通目标350—700字符，重要内容超过目标仍全部保留。

MATERIAL_UPDATE只展示有前轮RunId、前后有限数值且当前值匹配已验证指标的同口径变化。两轮方向均有效、相同周期且既有比较确认实质新证据及方向变化时，展示方向更新；措辞变化不会触发研究或投递。

## 分片与安全

现有逐Unicode字符UTF-8字节分片原样保留，顺序及重建无损。新格式仅用于新生成消息；重启读取已有part.content，不重新渲染PENDING内容。SENT不重发，UNKNOWN不盲目重试，SENDING恢复语义、HTTP/业务码确认、限流冷却、有限重试、持久化锁和待发送队列保持。关键词“检测”每个分片保留。无消息配额；7条通过Mock队列全部投递，原有超过30条与去重/MATERIAL_UPDATE测试继续通过。

## 测试与边界

原199项保留，新增41项，全部240/240通过，无跳过。检测、Facts、Judge阈值、Analyst Prompt/Schema/Guard、History MATERIAL_UPDATE/去重、HTTP/Binance/DeepSeek、调度、价格/OI/Funding/账户阈值及.env的受保护文件hash均不变。源/测试/回放共37个JavaScript文件的node --check全部通过。测试使用Mock；真实WIF文件仅用于只读格式验收，没有外部请求。

```text
ℹ tests 240
ℹ pass 240
ℹ fail 0
ℹ skipped 0
```

未调用外部API，未发送真实钉钉，未启动常驻进程。保留 npm run scan 前台常驻方式，不新增PM2；未修改旧项目和AI Pro Cron。

## 三条回放消息与统计

字符数按Unicode码点统计，包含中文、ASCII与换行，正文不含固定DeliveryId/分片包头；分片数按现有1800字节规则。真实WIF旧正文来自实际持久化4个payload，Mock旧正文由原完整模板生成。COMPACT_REPLAY.json另存含包头字符数、检查明细及文本。P0检查通过且未丢失关键事实、方向可用状态、周期、失效规则、必要风险及关键时间。

| 示例 | 旧正文字符数 | 新正文字符数 | 分片数 | 精简比例 | P0丢失 |
| --- | ---: | ---: | --- | ---: | --- |
| 真实 WIF：已保存运行记录，只读回放 | 3842 | 502 | 4 → 1 | 86.93% | 否 |
| Mock：有效 BULLISH | 3703 | 656 | 4 → 1 | 82.28% | 否 |
| Mock：MATERIAL_UPDATE，有效 BEARISH | 3544 | 715 | 4 → 1 | 79.83% | 否 |

### 真实 WIF：已保存运行记录，只读回放

```text
检测 · WIFUSDT｜多空账户翻转（已有记录）
首次情报（NEW_STORY）：以下为本轮已核实的异常事实。
价格（已收盘）：1h -0.18%｜4h -0.64%｜24h +2.94%
OI数量：1h -0.08%｜4h -0.52%｜24h -0.82%
全市场账户：多 52.08%、空 47.92%
多方变化（百分点）：1h +0.11｜4h +0.35｜24h +3.39
24h多方：48.69% → 52.08%
已有翻转记录：空 → 多；10-10 04:00（北京）；后续样本确认。实际事件时间仍需复核。
1h成交量：前24根小时K线均值的 0.40倍
市场判断：方向研判不可用，需人工复核。
观察周期：1h（仅供复核，非有效方向结论）。
观察：复核异常记录及后续同期价格、OI与成交量变化。
风险：账户分布与OI不证明具体开平仓、资金流向或价格必然反转；顶部持仓份额不是全市场OI占比。
顶部账户数据缺失，不能验证顶部与全市场背离。
数据截止：10-10 21:00（北京）
RunId：hourly_20261010_2100｜来源：Binance USDⓈ-M Futures
```

### Mock：有效 BULLISH

```text
检测 · TESTUSDT｜滚动24h价格异动、1h价格异动、结算费率异常、成交量异常、结算费率翻转
首次情报（NEW_STORY）：以下为本轮已核实的异常事实。
价格（已收盘，截至10-10 12:00（北京））：1h +10.00%｜4h +10.00%｜24h +10.00%
OI数量（采样10-10 12:00，北京）：1h +1.35%｜4h +5.63%｜24h +47.06%
滚动24h价格（独立口径）： +10.00%
1h成交量：前24根小时K线均值的 5.00倍
已结算Funding：-0.2000%；10-10 10:30（北京）；空头支付多头。
相邻实际结算：10-10 02:30 → 10-10 10:30（北京），变化 -0.3000个百分点。
方向：偏多延续｜周期：4h｜强度：中等（定性，非胜率）
短线偏多，作为后续可检验的研究假设。
交易观察：等待确认
失效/复核：后续新收盘滚动4h价格变化≤-5.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守；后续新采样精确4h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
替代情景：价格变化未能延续，进入相反方向或震荡。
后续：复核后续完整价格与OI样本。
风险：统计异动不证明确定性因果或资金流向，方向仅为条件性研究假设。
数据截止：10-10 12:30（北京）
RunId：MOCK_VALID_DIRECTION｜来源：Binance USDⓈ-M Futures
```

### Mock：MATERIAL_UPDATE，有效 BEARISH

```text
检测 · TESTUSDT｜重要变化：滚动24h价格异动、1h价格异动、结算费率异常、成交量异常、结算费率翻转
重要变化（MATERIAL_UPDATE）：本轮有实质新证据，见下列已验证数据。
价格（已收盘，截至10-10 12:00（北京））：1h -10.00%｜4h -10.00%｜24h -10.00%
OI数量（采样10-10 12:00，北京）：1h +1.35%｜4h +5.63%｜24h +47.06%
滚动24h价格（独立口径）： -10.00%
1h成交量：前24根小时K线均值的 5.00倍
已结算Funding：-0.2000%；10-10 10:30（北京）；空头支付多头。
相邻实际结算：10-10 02:30 → 10-10 10:30（北京），变化 -0.3000个百分点。
相较上一轮滚动24h价格：+10.00% → -10.00%
方向：偏空延续｜周期：4h｜强度：中等（定性，非胜率）
方向更新：此前偏多延续 → 当前偏空延续
短线偏空，作为后续可检验的研究假设。
交易观察：等待确认
失效/复核：后续新收盘滚动4h价格变化≥5.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守；后续新采样精确4h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核
替代情景：价格变化未能延续，进入相反方向或震荡。
后续：复核后续完整价格与OI样本。
风险：统计异动不证明确定性因果或资金流向，方向仅为条件性研究假设。
数据截止：10-10 12:30（北京）
RunId：MOCK_MATERIAL｜来源：Binance USDⓈ-M Futures
```

