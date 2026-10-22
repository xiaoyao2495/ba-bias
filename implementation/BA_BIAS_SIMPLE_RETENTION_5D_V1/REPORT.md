# BA_BIAS_SIMPLE_RETENTION_5D_V1

状态：BA_BIAS_SIMPLE_RETENTION_5D_V1_READY（代码与隔离离线验收就绪，不表示Windows实机部署/清退已完成）。

HEAD仍为17bba459e1c9b677fd517b21e68542fdd35124ac。Freshness已提交；两个Retention原型尚未提交，本轮在其上减法收口。package.json、shadow-data、experiments、其他未跟踪任务资料均保留。无Commit、Push、部署、生产清理、外部请求或正式服务启动。

## 最小业务实现

- 最近120小时保留；以Run正式时槽身份、终结状态、完成/事实截止/研究验证/Receipt最晚时间计龄，不按mtime删文件。
- 保留原资格检查：运行锁、恢复Run、未完成研究、研究/Input/Receipt/Facts/History的SHA与身份、路径、外部消费者、未知版本/未知文件均保护。
- 一个手动清退引擎。DRY_RUN只读；APPLY需要绝对DataRoot、enabled、准确确认短语DELETE_EXPIRED_RUNS及相同real root。CLI显式提供这些参数，默认不删；没有新增env或自动调度。
- 默认一次3个最老合格Run，上限10个/1GiB。超过预算停止；不递归删除未知文件，只逐文件重验后unlink，之后移除已知单元内空目录。
- Run、Facts、账户发现、selection/evaluations、scan/diagnostics、研究/audit/model-calls及Receipt统一退出。History研究索引退出，Selector/stories自包含摘要保留，避免过期自动获得新研究名额。
- 旧Manifest的永久存在合同由显式APPLY正式替换为BOUNDED_RUN_RETENTION_120H_V1。只在重新验证后移除目标清单条目；其余原SHA不改。不在读取时忽略缺失文件。
- 一个active.json保存未完成操作；成功后删除。state.json仅保留最后一批结果及Manifest绑定，不需要逐文件永久证明、overlay、64事务容量或日志归并平台。
- History.legacyRunIds保留每Run简短RETIRED身份，用于防旧Run再执行及历史410；不是永久研究档案。该已有身份索引仍按Run数增长，未声称全部元数据恒定。

## 验收

修改前实测1588总/1572通过/16失败；最终1608总/1592通过/同16失败，新增非预期失败0。完整回归不是全绿。

原Retention适配49、新生命周期合同44、Simple专项19、Freshness138，合计250/250。定向563总/562通过/1项已知保护哈希失败。静态检查163/163（含隔离示例）。没有删除/跳过测试，也没有更新既有保护哈希。

隔离示例：4个10天前L/S/N/无研究Run分3+1两批实际清退；逻辑占用1,656,098 ->208,189 bytes，净减少1,447,909 bytes；state652 bytes，active文件已删除，VERIFY通过。指标来自Mac合成Fixture，不能外推为Windows6GB实际回收值。

## 减法结果

4个专用生命周期模块由293行变213行，减少80行（约27%）；集成点另列CHANGED_FILES。保留文件名以复用调用关系，但已移除永久migration overlay、prepare入口、逐文件完成证明、proofHashes、指纹缓存、完成事务归档及64事务/64MiB估算容量状态机。PREPARED/INDEX_COMMITTED只描述一个进行中的操作。

保留retention-manifest模块，因为主完整性检查仍需要版本/路径/SHA验证；保留只读lifecycle模块，因为Web不能导入业务writer。不存在第二套删除器。

## 剩余边界

- Windows NTFS权限、实际重解析点、占用文件及断电持久性未实机验证；测试覆盖symlink、EACCES/EPERM/EBUSY和进程中断，不等同于断电数据库事务保证。
- 清理期间/失败pending时，Scanner与Web安全拒绝半状态，须显式恢复；仅“因活动依赖未清理”的情况不产生pending，已验证Mock Scanner仍可运行。
- 目前支持身份和完成时间可证明的现行V2小时Run；未知旧版、无完成凭据、UNAVAILABLE/不完整封存、旧Directional消费者、未知文件保留。不承诺以前112个旧Run全部有资格。
- Outbox所有现有Run引用仍保护，包括SENT/FAILED：当前Outbox加载器仍直接读取Research/Receipt，终态不等于无消费者。本轮没有改变Delivery去重或批准清除这些业务义务。
- 单在途JSON真实序列化大小限定15MiB，读取16MiB；state64KiB。大计划应减少范围/另行处理，不能跳过检查。没有永久证明容量耗尽问题，但不是无限规模工具。
- 原型旧state/overlay/transactions不自动升级，有此类状态时报OLD_PROTOTYPE_REQUIRES_REVIEW。前两轮未操作真实数据，正常实际根不应含这些实验状态。
- 旧完整历史清退不可逆，回放不再保证。未来首批实际APPLY需用户独立决定，并按WINDOWS_COMMANDS验证。回退旧永久合同需要真实备份，不能只回滚源码。
