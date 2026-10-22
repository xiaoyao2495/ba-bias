# 离线验证结果

## 环境与基线

当前HEAD：f7b576aedcf7efca344f735412c241f5747d61af。Node v23.11.0，Mac本地。所有Node回归使用test/offline-guard.js，拒绝外网与生产目录写入；Web测试仅启动临时回环Mock服务器，不启动正式Web/Scanner。

首次受限沙箱运行：1358项，1159通过、16失败、183取消（Web回环端口权限导致）。原始日志baseline-sandbox.txt保留，未将其作为正式前后比较基线。允许本机回环测试后，在修改代码前重新执行正式基线：1358项，1342通过、16失败、0取消，见baseline.txt。

## 实际命令

项目根目录执行：

```sh
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/*.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/previous-research-freshness.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/previous-research-freshness.test.js test/selector.test.js test/selector-precision-coverage.test.js test/market-bias-v2-e2e.test.js test/core.test.js test/hourly.test.js test/market-bias-v2-contract.test.js test/market-watch.test.js test/market-watch-mobile.test.js test/public-web.test.js test/web-dashboard.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node implementation/BA_BIAS_PREVIOUS_RESEARCH_FRESHNESS_FIX_V1/replay.mjs
```

静态：以Python枚举src/、scripts/、test/、web/assets/内全部.js/.mjs，逐文件执行`node --check <文件>`；每项退出码见STATIC_CHECKS.json。

| 检查 | Total | PASS | FAIL | Cancelled |
|---|---:|---:|---:|---:|
| 修改前完整基线 | 1358 | 1342 | 16 | 0 |
| 最终专项 | 138 | 138 | 0 | 0 |
| 最终定向 | 655 | 653 | 2 | 0 |
| 最终静态 | 154 | 154 | 0 | 0 |
| 最终完整 | 1496 | 1480 | 16 | 0 |

新增非预期失败0。定向的2项失败为原有Selector 28 scanner bytes unchanged、Selector 39 production files identical。完整16项逐项名单及前后对照见BASELINE_FAILURES.md，机器统计见TEST_SUMMARY.json。旧哈希未更新；完整回归并非全部通过。

## 专项范围

- 1h、12h、24h、48h、48h+1ms、48h+1s、72h、7天、30天；同刻、未来、缺失、非整数及非法时间。
- 同Symbol不同年龄、不同Symbol独立计时；共享配置变化被两个消费者使用。
- 9个年龄×7种当前事实，共63个单候选资格对照：完全重复、三类微小漂移、价格反转、OI重大变化、Funding重大变化。对比冻结原版Selector的状态、原因、Gate、每分项、总分、排名、storyType与storyKey。
- 9个年龄×4种旧文件状态，共36个Mock文件系统案例：正常、缺失、哈希不匹配、Research缺失。
- 有效期内仍读取正文、验证Schema与字节SHA；过期所有4种文件状态均零次Research/Facts读取。过期没有被声称已验证完整性。
- 索引结构/哈希字段/时间损坏、有效期内Research内容哈希错误，均明确拒绝。
- UNAVAILABLE不代替VALIDATED；未来条目存在时仍可选合法此前条目。
- 七天逐小时：无期限旧规则重复0次，直接48h TTL重复3次，修复重复0次。
- 7个旧重复+1新候选等分竞争：修复仅新候选入选；直接TTL使5个旧重复占位。另测不同分数、Symbol和实质变化，排名与旧版一致。
- 不足以区分持续事件/中断后再现的摘要，保守去重；缺失/错误标量或嵌套摘要不默认放行。
- 主链路分别保存Selector 72h与Research 192h来源，跳过旧正文；Mock成功后仅按原规则推进基线。共1次Mock生成，0次消息发送。
- 6候选中5个模型失败，连续2轮仍各最多5次，累计10次Mock；无补第6名、无Outbox。失败后成功基线不变，这是保留行为，不是新增失败冷却。
- 同刻、未来及有效期内缺失Research的3个主链路案例：0次Mock模型，DATA_ERROR，基线不变。

## 统计口径

63个独立合成资格案例：

| 指标 | 原版 | 修复 |
|---|---:|---:|
| 合格且单候选入选 | 27 | 27 |
| NO_MATERIAL_CHANGE | 36 | 36 |
| 新增放行过期候选 | — | 0 |
| 已知重复/微小漂移占位 | 0 | 0 |
| 已有资格的过期实质变化 | 15 | 15 |
| 入选路径旧Facts读取预期（Research索引时间与摘要相同） | 27 | 12 |

最后一行是Selector资格与窗口推导，不伪装成生产I/O测量；读取行为另由Mock文件系统逐次断言验证。在9年龄正常存储案例中，原无期限函数需9次Facts读取，修复仅4次，过期5次零正文读取。

replay.mjs仅执行选择函数，模型请求0。专项完整主链路Mock总计11次，真实DeepSeek/Binance/钉钉请求0。历史读取错误不会被自动修补、重生成或转换成成功。

## 真实本地历史对照

仅使用已有本地旧档案，不是新采集、不是Windows生产回放，不预测收益：

| Run | Facts | 合格 | Top5入选 | NO_MATERIAL_CHANGE | 前后 |
|---|---:|---:|---:|---:|---|
| hourly_20261011_1200 | 26 | 18 | 5 | 0 | 一致 |
| hourly_20261011_1400 | 25 | 6 | 5 | 11 | 一致 |
| hourly_20261011_1600 | 24 | 8 | 5 | 6 | 一致 |
| 合计 | 75 | 32 | 15 | 17 | 一致 |

分数、排名、入选Symbol及拒绝原因见REPLAY_RESULTS.json。这3轮没有过期摘要，因此不能据此估算生产过期读取减少率或成本改善率。

## 保护与测试合同变动

- config保护测试只排除新增精确配置行，新增48h值断言，其他旧配置仍比较原文。
- 原e2e同刻previousResearch=null断言改为明确INVALID_OR_NON_PRIOR_HISTORY。
- core/hourly两个同事实时间重复测试，由NO_MATERIAL_CHANGE改为明确非此前历史的INSUFFICIENT_EVIDENCE；仍不重复模型或投递。首次完整发现这两项预期语义差异后调整相关断言，最终不再新增失败。
- materialEvidence源码、saveResearch源码、recoverInterruptedRuns源码逐字不变，见CONTRACT_INTEGRITY.json。
- 8490个已有文件哈希核验，仅8个授权源码/测试变化，8482个其他文件未变。data、环境、package及锁文件保持任务开始字节；生产数据无新增或缺失。见INTEGRITY.json。

本轮没有重写正式历史、修改旧哈希断言、调用真实API、运行正式服务或进行Git提交。
