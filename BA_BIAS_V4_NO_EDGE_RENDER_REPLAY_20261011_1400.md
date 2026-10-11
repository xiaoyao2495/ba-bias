# BA_BIAS_V4_NO_EDGE_RENDER_REPLAY_20261011_1400

仅使用14条真实冻结Outbox、Facts和V4快照，离线渲染；没有创建投递任务或重新发送消息。旧Renderer使用本轮修改前的源码备份，旧分片去除传输头后逐字等于重建旧消息；新分片还原后逐字等于新正文。

| Symbol | 状态/原始方向 | 复核展示条数 | 分片 | 标点异常 | 重复观察 |
|---|---|---:|---:|---:|---:|
| CHIPUSDT | VALIDATED / NO_EDGE | 3→2 | 2→2 | 2→0 | 1→0 |
| ERAUSDT | VALIDATED / BULLISH | 2→2 | 2→2 | 0→0 | 0→0 |
| GENIUSUSDT | VALIDATED / BEARISH | 2→2 | 2→2 | 0→0 | 0→0 |
| INJUSDT | FAILED / None | 0→0 | 1→1 | 0→0 | 0→0 |
| IOSTUSDT | FAILED / None | 0→0 | 1→1 | 0→0 | 0→0 |
| JCTUSDT | VALIDATED / BULLISH | 2→2 | 2→2 | 0→0 | 0→0 |
| LAUSDT | FAILED / NO_EDGE | 0→0 | 1→1 | 0→0 | 0→0 |
| LUMIAUSDT | VALIDATED / BULLISH | 2→2 | 2→2 | 0→0 | 0→0 |
| PIXELUSDT | VALIDATED / BULLISH | 2→2 | 2→2 | 0→0 | 0→0 |
| POLUSDT | FAILED / NO_EDGE | 0→0 | 2→2 | 0→0 | 0→0 |
| RLCUSDT | VALIDATED / BULLISH | 2→2 | 2→2 | 0→0 | 0→0 |
| STRKUSDT | VALIDATED / NO_EDGE | 3→2 | 2→2 | 2→0 | 1→0 |
| USUSDT | VALIDATED / BEARISH | 2→2 | 2→2 | 0→0 | 0→0 |
| WALUSDT | VALIDATED / BULLISH | 2→2 | 2→2 | 0→0 | 0→0 |

有效NO_EDGE只有STRK和CHIP。POL/LA失败响应中的原始NO_EDGE不作为有效研判，仍显示ANALYST_UNAVAILABLE。

两条NO_EDGE原始条件各3条保持不变。展示3→2是移除不适用的PRICE_OPPOSITE_1h方向INVALIDATED，并非删除合法OI/观察条件。诊断NO_EDGE_DIRECTION_INVALIDATION_NOT_APPLICABLE记录ruleId、sourceOutcome、operator、threshold；存于after_render.json。CHIP保留OI≥5.0000%，STRK保留OI≤-5.0000%；各保留其独立Evidence观察。

统一说明只出现一次，结构化绑定的后续观察不再重复。总分片25→25，两条NO_EDGE各2→2；文本缩短不保证一定减少分片。DingTalk原分片算法未修改，全部新正文无损，数字/字段/关键词测试通过。

8条有效有方向样本（含ERA、US、RLC）compact与完整directionalText均逐字不变；4条不可用样本同样逐字不变。四种方向类型与合法结构条件另有组件回归测试，合成组件输入不宣称真实生产新增研判。

方向、Horizon、Conviction、支持/竞争/结构Evidence、Mechanism、原始条件、Facts数值、Judge评分、资格、storyKey、snapshotId及deliveryId全部保持原值。没有使用未来行情。

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/before_render.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/before_render.json)

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/after_render.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/after_render.json)

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/render_diff.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/render_diff.md)

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/final-integrity.json)
