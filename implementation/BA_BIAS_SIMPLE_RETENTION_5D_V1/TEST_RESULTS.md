# 实际离线验收

代码基点main /17bba459e1c9b677fd517b21e68542fdd35124ac，加本轮开始时两项未提交原型。修改前重新运行基线，不直接套用历史16项失败。

|运行|总数|通过|失败|取消/跳过|
|---|---:|---:|---:|---:|
|本轮修改前完整|1588|1572|16|0/0|
|Retention/新合同/Simple/Freshness专项|250|250|0|0/0|
|最终定向|563|562|1|0/0|
|最终完整|1608|1592|16|0/0|
|静态|163|163|0|—|

同一环境下16项失败位置/名称与修改前一致，新增非预期失败0；BASELINE_FAILURES.md逐项列出，TEST_SUMMARY.json保留计数与失败名称。完整回归不是全部通过。唯一剩余定向失败是validation-recovery既有保护哈希断言，未放宽。

## 命令

全部带 `NODE_OPTIONS="--import=$PWD/test/offline-guard.js"`，生产data/env/audit/design写入和外部网络阻断，Web只使用loopback Fixture。临时数据只在测试自建根创建和删除。

```sh
node --test test/*.test.js
node --test test/simple-retention.test.js test/data-retention.test.js test/retention-manifest-migration.test.js test/previous-research-freshness.test.js
node --test test/simple-retention.test.js test/data-retention.test.js test/retention-manifest-migration.test.js test/previous-research-freshness.test.js test/market-bias-v2-e2e.test.js test/market-bias-v2-contract.test.js test/public-web.test.js test/web-dashboard.test.js test/validation-recovery.test.js
node implementation/BA_BIAS_SIMPLE_RETENTION_5D_V1/isolated-demo.mjs
```

逐文件 `node --check` 的真实路径与退出码见STATIC_CHECKS.json。修改前有1588项，旧永久合同43项按本轮规则变成44项，新增Simple19项，合计1608。原Retention49项和Freshness138项仍在，未删除/skip原保护测试。

## 六类场景证据

- A：test/retention-manifest-migration.test.js首项与L/S/N旧Fixture；10天四Run、原Manifest包含Run路径、Research/Input/Receipt/History完整引用，实际清退并VERIFY、Web410、无悬空有效研究。
- B：test/simple-retention.test.js“两天数据”逐字快照、NO_CANDIDATES与History不变；混合窗口的24h/72h文件SHA也保留。
- C：V2 PENDING/UNKNOWN两项真实结构Mock Outbox保护；NO_CANDIDATES不发布pending，下一次全MockScanner仍COMPLETE；全局恢复Run继续保护。
- D：提前缺失、哈希错误、研究损坏、最新未授权文件缺失均拒绝；不会在preflight失败时替换Manifest或合法化缺失。
- E：事务落盘/pending/History/Manifest/部分unlink/VERIFY前及完成state后中断；恢复游标验证、并发锁、变更文件拒绝、Windows错误码/ENOSPC、重复执行。
- F：原138项Freshness继续全通过；额外检查摘要保留、相同异常去重、实质变化仍竞争、退役后Mock Scanner。发现测试时间平移破坏原始整点样本对齐时，修正合成Fixture为整数小时平移，没有改Facts Engine、阈值、Selector或Guard。

## 完整性与备份

8586个已存在文件起始SHA核对：只有授权9文件变化，无其他变更；8350个data/shadow-data文件前后数量相同、SHA相同，无新增/缺失；环境文件、package.json原改动和两旧报告目录不变。3个旧影子journal本轮已纳入起止SHA并一致，但不能追溯证明更早任务的原始哈希。

BEFORE_SOURCE.patch只包含9个授权源码/测试的开始字节；SOURCE_BACKUP_HASHES记录其SHA，重建验证通过。BEFORE_HASHES只记录只读完整性指纹，不含生产数据/env正文备份。回滚补丁git apply --check通过，未执行。

`git diff --check`通过。没有真实Binance/DeepSeek/DingTalk调用，没有正式Scanner/Web/PM2启动，没有实际Windows或Mac DataRoot APPLY。原API入口的Mock调用不等于真实请求。

## 执行限制

Windows实际NTFS分配字节、断电持久性、权限/文件占用仍未实机验证；本地symlink及错误码注入不能替代实机验收。代码READY限于显式手动入口与隔离业务验收，不表示生产历史已经被清理。
