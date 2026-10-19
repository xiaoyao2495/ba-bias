# 最后一次测试合同收尾

日期：2026-10-19。范围仅为Selector30的保护测试、可信旧引用和交付资料。本轮无任何生产代码/配置/数据修改。

## 原始目的与取证

- BA_BIAS_DETERMINISTIC_SELECTOR_V1.md:15、45要求引入Selector时保持Scanner/Facts/Detector及价格/OI/Funding原阈值不变。
- git blame表明原Selector30来自545430b（2026-10-11）；旧test/selector.test.js:36实际比较整个detector.js文件SHA，而非阈值或行为。
- 冻结原版SHA仍为85f93a8c645e7feec7caa3a3bd16cc52590cb705d804f24b95a1eaeef1524f23，与既有validation/.../before-hashes.json完全一致。
- 修改测试前严格验证现版Detector仅有big.js导入、3行说明注释及FUNDING_EXTREME十进制除法分支；没有其他差异。原任务非边界行为对照也保持原结论。

## 保护方式

保留测试名称Selector 30 detector thresholds unchanged和测试数量，未删除或跳过任何测试。

1. test/fixtures/detector-pre-funding-precision.txt保存可信原版；使用既有旧SHA验证，未创建“接受当前Detector”的新整文件基线。测试内仅对CRLF统一LF，避免checkout行尾影响规则判断，生产文件未作规范化。
2. 明确断言所有原Detector阈值及账户阈值。
3. 窄范围源码投影仅撤回已授权Funding导入/注释/除法表达式，再与旧源码逐字比较；其他事件、封顶、来源、身份、公式均不能夹带变化。这是额外结构防线，不代替行为验证。
4. 执行哈希校验后的旧纯函数与正式现函数进行89次原始Facts驱动比较：56次价格/OI/量能/账户变化，20次正负Funding，1次混合/变号，12次实际Selector Gate边界；另比较5种身份分类。
5. 非Funding事件与原版严格一致。Funding仅允许十进制除法的结果差异，事件存在性、原值、阈值、Evidence IDs保持一致，candidateScore仍按原公式。
6. 在内存中构造9种未授权源码变异，确认阈值来源、价格事件、封顶、计分、Funding变化strength、展示/结算来源、身份、宽松Funding除法、非Funding除法等变化均被拒绝。未将变异写入磁盘。

代码定位：test/selector.test.js:39（原版及阈值）、52（窄范围源码保护）、58（变异拒绝）、69（可信旧函数）、70（原始Facts差分）、84（真实Selector边界）。

## 实际结果

| 检查 | 总数 | 通过 | 失败 | 取消/跳过 |
|---|---:|---:|---:|---:|
| 受影响模块 | 220 | 218 | 2 | 0/0 |
| 原定向含Web | 474 | 472 | 2 | 0/0 |
| JS/MJS静态 | 152 | 152 | 0 | — |
| 完整回归 | 1358 | 1342 | 16 | 0/0 |

Selector30通过。原始16项逐项核对名称、Assertion原因和expected均一致；相对收尾前actual也一致。没有其他新增失败。证据见TEST_CONTRACT_CLOSURE.json及更新的full.txt/targeted.txt/contract-affected.txt。原先17项失败记录单独保留，未改写历史测试事实。

本轮前后8422个src/data/环境/package文件SHA完全一致，Selector、诊断实现、V2及生产数据没有变化。原有package.json工作区修改保持不变。

## 执行命令

项目根目录：

```sh
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/selector.test.js test/selector-precision-coverage.test.js test/scan-liquidity.test.js test/long-short.test.js test/hourly.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/selector-precision-coverage.test.js test/selector.test.js test/scan-liquidity.test.js test/long-short.test.js test/hourly.test.js test/market-watch.test.js test/market-watch-mobile.test.js test/public-web.test.js test/web-dashboard.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/*.test.js
```

静态对src/scripts/test/web/assets内每个.js/.mjs执行node --check，明细static.json。所有回归保持offline-guard；Web仅有回环Mock服务，没有外部请求、真实扫描、生产Web、LLM或消息。

## 两种回滚

只撤回本轮测试合同调整，保留前轮业务修复：

```sh
git apply --reverse --check implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/TEST_CONTRACT_CLOSURE.patch
git apply --reverse implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/TEST_CONTRACT_CLOSURE.patch
```

撤回整个精度及诊断任务（含本轮测试）：

```sh
git apply --reverse --check implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/CHANGES.patch
git apply --reverse implementation/BA_BIAS_SELECTOR_PRECISION_COVERAGE_FIX_V1/CHANGES.patch
```

两份补丁仅执行了reverse --check，未实际回滚。后续文件有修改且检查失败时停止，逐块审阅，不强制覆盖，不清理工作区。报告作为审计证据保留。
