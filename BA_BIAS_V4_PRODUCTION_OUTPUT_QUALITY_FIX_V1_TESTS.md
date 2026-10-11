# BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1_TESTS

785/785通过，原712+新增73；静态87/87。原失败的两项验收问题已修正：MockKline补齐合法第8字段；V3读取按版本寻找而非首文件。无生产修改。

## 生产路径与证据

实际入口 [src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:122) 未改；V4调用与Guard保留，NO_EDGE只在消费副本映射。原始输出 `[data/runs/hourly_20261011_1200/directional/MAGICUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1200/directional/MAGICUSDT.json)`；真实Mock来源重封装与完整Guard测试68，禁止把磁盘JSON提升为新LIVE来源。

分片模块 [src/storage/delivery-queue.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/delivery-queue.js:10)；回放脚本 [scripts/v4-output-quality-replay.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/v4-output-quality-replay.js)；旧SENT/UNKNOWN直接复用既有parts、不重建，Mock无发送。方向失败保留Facts的原生产全链路测试继续通过。

## 执行与结果

```sh
NODE_OPTIONS="--import ./validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/no-network.js" npm test
node scripts/v4-output-quality-replay.js
# src/scripts/test 全部 JS：node --check
```

[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/all-tests.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/all-tests.txt)；[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/static-checks.json)；[validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/final-integrity.json)。

## 73项专项用例

- 01 actual MAGIC NO_EDGE never claims direction invalidation
- 02 NO_EDGE retains exact program thresholds
- 03 NO_EDGE has no directional stops
- 04 directional rules remain exact
- 05 renderer never mutates raw structured analysis
- 06 INVALID and NO_EDGE are distinct
- 07 CHIP failure not displayed as NO_EDGE
- 16 actual 44 messages reconstruct losslessly
- 17 byte platform limit includes transport headers
- 18 grapheme clusters survive extreme field splitting
- 19 sequential fragment totals
- 20 parent delivery ID unchanged across fragments
- 21 keyword retained per fragment
- 22 small message stays single
- 23 extreme protected token records explicit fallback
- 24 SENT historical queue never rebuilt or resent
- 25 stable flip is context
- 26 old flip newly available never becomes fresh event
- 27 genuinely later flip retained
- 28 confirmation transition is real state update
- 29 old context plus major price retains qualification
- 30 version alone cannot update
- 31 prose alone cannot update
- 32 same facts never claim material update
- 33 major OI retained
- 34 material settled funding retained
- 35 Judge thresholds and bytes unchanged
- 36 no fixed notification count introduced
- 37 exact saved prior time used
- 38 multi-hour comparison never labeled adjacent hour
- 39 missing comparison timestamp conservative
- 40 unchanged metric scopes compared
- 44 all supporting and conflicting IDs retained
- 45 no fabricated price structure
- 46 no future price used to rewrite direction
- 47 all three analyst failures preserve facts
- 48 no V3 automatic fallback
- 59 legacy V3 source semantics unchanged
- 60 V4 remains only active production analyst
- 61 actual fresh and material stories not suppressed
- 62 CHIP full error sequence preserved
- 63 rolling old flip disappearance is not new evidence
- 64 missing historical metric cannot prove sign transition
- 65 long-short semantic event identity ignores property order
- 66 NO_EDGE future condition stays reassessment, not invalidated
- 67 program rule mapping preserves threshold and direction math
- 68 complete Validator still guards consumeV4 with mock frozen raw
- 69 normal non-edge detail renderer also corrected
- 70 complete fields stay intact when possible
- 71 long sentence uses Chinese lexical boundaries
- 72 later flip with unavailable prior ratios remains eligible
- 73 stable confirmed samples do not create material evidence

编号8–15原子token、41–43方向/周期/强度、49–52外部链路、53–58生产数据保护为参数化用例，合计73项。

## Q1–Q30

**Q1.** 原模型选择通用PROGRAM_RULE；Adapter和Renderer直接照搬输入的INVALIDATED文案，错误在消费端。

**Q2.** 是；Compact、详细文本及未来V4状态消费统一为REASSESSMENT_ONLY，原模型/输入不变。

**Q3.** 是，有方向的rule描述、阈值、operator和outcome保持原样。

**Q4.** 正常数字/小数/百分数保护完整；极端超预算不可分token的字符fallback明确记录，本轮无fallback。

**Q5.** 是，44条原文移除运输头后严格无损；专项含中文、组合emoji和长字段。

**Q6.** 否，原DeliveryId/分片身份及已持久化内容保持不变。

**Q7.** 是，ONE复制遗漏不作为投递故障；两片SENT保持不变。

**Q8.** 旧翻转在HEI等消息中作为背景反复出现，但没有证明单凭其存在触发了本轮错误资格；已修复旧翻转消失/字段顺序及缺失基准数值的代码级虚假更新。

**Q9.** 全部27条均有既有规则触发，逐Symbol列表和新旧值见回放表及event-material-audit.json；ONE OI变号、POL新反向翻转、HEI成交量突出。

**Q10.** 本轮27条没有发现缺少全部规则证据的更新。不能把满足既有规则等同于已证明新闻质量最优。

**Q11.** 修复可复现的事件身份/过期窗口/缺失数值缺陷；44条真实历史资格未改变，不虚构某条被错投。

**Q12.** 否，全部44原资格保留，重大价格/OI/Funding和新翻转专项通过。

**Q13.** 前一个保存的输出Story快照，其lastResearchTime来自该次Facts评价截止；可能跨多小时。

**Q14.** 是，27条实际基准均可追溯；未知场景使用保守标签。

**Q15.** 否，41条输出原direction与Packet/展示一致。

**Q16.** 原模型41条选择1h；Adapter未强制，Schema仍允许4h/24h。

**Q17.** 是，40 LOW、1 MODERATE，无提升或默认覆盖。

**Q18.** 37同向、0反向、4 NO_EDGE、3 INVALID，仅当前事实描述，不是未来胜率。

**Q19.** Packet支持及冲突引用无丢失；Compact不逐条重复展开全部支持描述，详细文本/本地证据保留；冲突逐条展示。

**Q20.** V4完整Evidence/Structure验证；最终UNKNOWN_OR_FOREIGN_EVIDENCE、UNSUPPORTED_STRUCTURE；首次另有MECHANISM_SIGN_MISMATCH。

**Q21.** 没有跨Symbol错误传播证据；ROSE/WLFI也独立出现同类模型引用错误，均FAILED而非NO_EDGE。

**Q22.** 否，全部核心文件哈希不变。

**Q23.** 否，仅通知变化来源校验/消费展示修改，不改阈值。

**Q24.** 否，4167生产文件及.env哈希保持不变，无生产新增文件。

**Q25.** 否，三者真实请求0；测试网络阻断，回放只读取历史记录。

**Q26.** 82→82；每Symbol数量不变，6个确认的数字/字段跨片问题归零。

**Q27.** 44条OldDecision/NewDecision一致，变化0；新增边界保护不改变重要异常的既有资格。

**Q28.** 新增73项，原712项保留，总785/785。

**Q29.** 87/87。

**Q30.** 是，V4唯一入口不变；本轮不自动重启，恢复时间由用户决定。
