# 实测基线失败对照

|序号|位置|测试|最终|
|---|---|---|---|
|1|`test/analyst-alignment.test.js:39:1`|Judge recovery, detectors, queue, History, scheduler and production state remain byte-identical|仍失败|
|2|`test/analyst-generation.test.js:42:1`|production scan command and protected files retain baseline bytes|仍失败|
|3|`test/analyst-precision.test.js:38:1`|history/outbox/raw model responses/env remain byte identical in offline suite|仍失败|
|4|`test/compact.test.js:45:1`|all protected production logic and original tests remain unchanged|仍失败|
|5|`test/no-edge-render-forensic.test.js:7:178`|NO_EDGE forensic 39 Binance untouched, no external invocation|仍失败|
|6|`test/no-edge-render-forensic.test.js:7:178`|NO_EDGE forensic 42 Scanner untouched, no external invocation|仍失败|
|7|`test/no-edge-render-forensic.test.js:7:178`|NO_EDGE forensic 43 History hashes immutable|仍失败|
|8|`test/no-edge-render-forensic.test.js:7:178`|NO_EDGE forensic 48 immutable production policies beyond renderer|仍失败|
|9|`test/output-quality.test.js:12:29`|output quality 49 Binance integration unchanged and offline replay excludes calls|仍失败|
|10|`test/output-quality.test.js:12:29`|output quality 52 Scanner integration unchanged and offline replay excludes calls|仍失败|
|11|`test/output-quality.test.js:12:29`|output quality 53 History immutable|仍失败|
|12|`test/selector.test.js:9:343`|Selector 28 scanner bytes unchanged|仍失败|
|13|`test/selector.test.js:9:343`|Selector 39 production files identical|仍失败|
|14|`test/structured-v4-live-preflight.test.js:16:1`|V4 all pre-existing files including production and old experimental contracts remain identical|仍失败|
|15|`test/structured-v4.test.js:46:1`|V4 protected existing files incl V3, state, env, snapshots are unchanged|仍失败|
|16|`test/validation-recovery.test.js:69:1`|every protected market, scheduling and delivery implementation matches the pre-task snapshot|仍失败|

完整1592/1608；同16失败，新增0。未更新这些哈希断言。
