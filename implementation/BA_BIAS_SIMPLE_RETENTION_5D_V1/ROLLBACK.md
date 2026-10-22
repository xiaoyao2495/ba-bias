# 代码与数据回滚

修改前已生成BEFORE_SOURCE.patch、SOURCE_BACKUP_HASHES.json、HEAD.txt与工作区清单：只备份Retention/Manifest授权9个代码/测试文件，不含package.json、env、data、shadow-data或其他任务源码。两个旧交付目录原字节不改，旧验收结果继续可查。

ROLLBACK_CODE_ONLY.patch将本轮9个修改文件恢复到开始字节，并移除新增simple-retention测试；根据备份补丁在内存重建后逐文件SHA匹配。git apply --check已通过，但没有实际应用。回滚不删除交付报告、不重置工作区、不覆盖其他任务。出现后续交叉改动需先审查，不强行应用。

本轮无真实APPLY，所以当前只涉及代码回滚。旧isolated-performance工具依赖已移除的prepare接口，作为历史交付保留；恢复旧源码后才可按旧报告重放，不为保留旧工具而保留重复业务架构。

一旦未来已在实际data上替换Manifest并删除文件，不能直接回滚到永久存在合同；需要独立备份恢复原Manifest、History、状态及原路径/原字节。小Run记录与单个初始SHA不能重建研究正文。用户已接受超5天不可查/不可回放，本实现不会伪造研究重建，也不提供无备份的反向恢复。

任何pending状态优先用现版本完成受控恢复，不通过源码降级或手工清pending掩盖未完成操作。
