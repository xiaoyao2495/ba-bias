# 简单120h保留合同

## 资格与保护

已知小时RunId与Asia/Shanghai时槽一致；scheduled<=started<=dataCutoff<=finished<=now，终结状态可证。年龄anchor取完成/数据截止/研究验证完成/Receipt持久化中的最晚值。未满120h保留，等于或超过120h仅有候选资格。

任何正在运行/恢复、未完成候选、未封存研究、缺失/损坏Facts/Input/Receipt/索引、未知版本、未知消费者、仍被Outbox读取的研究、路径不明或链接逃逸都不自动清理。缺失不是合法清退证据。

## Manifest替换

未首次APPLY：IMMUTABLE_LEGACY_ARCHIVE按原legacyHashes全部检查。

首次有效APPLY：原Manifest内容必须完整，锁内再次冻结计划；在一个可恢复操作中将legacyHandling改为BOUNDED_RUN_RETENTION_120H_V1，仅删除已验证目标清单的legacyHashes条目。保留初始Manifest的单个原始SHA和激活时间，不保存原永久文件清单副本。非目标条目SHA逐字保留。新Manifest原始SHA绑定到state，启动与VERIFY检查绑定。

这属于用户授权的新存储合同，不是“旧不可变合同仍完整通过”。如果旧文件在APPLY前缺失，preflight失败，不能借替换合同抹掉错误。

## 单在途事务

1. 明确确认根与删除短语，取得Scanner同一共享锁。
2. 全部当前Manifest、研究引用及计划重验；挑最老3个（参数最多10个/1GiB）。
3. active.json存冻结计划、目标Run、前后索引/Manifest SHA、preparedAt、cursor及unlinkPrepared，state发布pending。
4. History退出有效研究/Run索引，写简短Run退役身份；不擦掉仍用于去重的Selector/stories摘要。
5. 更新保留范围Manifest，进入INDEX_COMMITTED。
6. 每个文件路径/SHA重验，先持久化游标意图，再unlink，再推进游标。缺失仅能匹配先前游标意图，否则报错。
7. 确认没有目标残留/新增文件；VERIFY目标History/Manifest与未清退旧文件；发布最后一批状态，删除active.json。

PREPARED与INDEX_COMMITTED只保留未完成事务；不保留COMPLETED逐文件日志。完成后只剩一个小state文件和既有History中的最小Run身份。不会因第65次清理停止；66批隔离测试通过。

## 失败及读取

pending/损坏状态返回503并阻止扫描；文件错误后不强行清pending，重新执行同一显式APPLY恢复。事务落盘但state未发布也能识别；缺失state但完好active可重建pending并验证恢复。active损坏/丢失且pending仍在则阻断，不能猜测成功。

最终state已提交但active未移除：业务已完成，410正常；再次APPLY移除残留操作文件。重复已完成的同一冻结计划返回上次结果，不重删；普通CLI重复APPLY重新盘点，只处理剩余合格对象。

Web当前批及History中较早退役身份均410，不映射NO_EDGE；近期记录继续验证并可读。读者按lastCompleted失效缓存。

跨多个JSON不具备数据库原子性；共享锁协调本项目进程，不能抵御任意外部写者或证明断电顺序。异常保留pending是必要的恢复边界。
