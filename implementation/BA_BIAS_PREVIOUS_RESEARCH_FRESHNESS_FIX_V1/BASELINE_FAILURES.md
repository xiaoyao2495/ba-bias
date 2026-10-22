# 修改前后失败逐项对照

这些是相同环境下本轮实际执行的结果；不是直接引用历史16项。未修改其旧哈希。

| # | 测试 | 修改前 | 修改后 |
|---|---|---|---|
| 1 | Judge recovery, detectors, queue, History, scheduler and production state remain byte-identical | FAIL | FAIL |
| 2 | NO_EDGE forensic 39 Binance untouched, no external invocation | FAIL | FAIL |
| 3 | NO_EDGE forensic 42 Scanner untouched, no external invocation | FAIL | FAIL |
| 4 | NO_EDGE forensic 43 History hashes immutable | FAIL | FAIL |
| 5 | NO_EDGE forensic 48 immutable production policies beyond renderer | FAIL | FAIL |
| 6 | Selector 28 scanner bytes unchanged | FAIL | FAIL |
| 7 | Selector 39 production files identical | FAIL | FAIL |
| 8 | V4 all pre-existing files including production and old experimental contracts remain identical | FAIL | FAIL |
| 9 | V4 protected existing files incl V3, state, env, snapshots are unchanged | FAIL | FAIL |
| 10 | all protected production logic and original tests remain unchanged | FAIL | FAIL |
| 11 | every protected market, scheduling and delivery implementation matches the pre-task snapshot | FAIL | FAIL |
| 12 | history/outbox/raw model responses/env remain byte identical in offline suite | FAIL | FAIL |
| 13 | output quality 49 Binance integration unchanged and offline replay excludes calls | FAIL | FAIL |
| 14 | output quality 52 Scanner integration unchanged and offline replay excludes calls | FAIL | FAIL |
| 15 | output quality 53 History immutable | FAIL | FAIL |
| 16 | production scan command and protected files retain baseline bytes | FAIL | FAIL |

新增失败：0。部分失败断言的实际源码SHA会随本轮授权变更变化；不声称失败输出逐字一致。详见baseline.txt及full.txt。
