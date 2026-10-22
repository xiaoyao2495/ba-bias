# 精确回滚说明（本轮未执行）

CHANGES.patch只包含本任务的4个已跟踪生产文件、4个已跟踪测试文件，以及新增的纯函数、专项测试和冻结Selector Fixture。

不包含package.json、数据目录、环境文件、其他任务资料或本交付目录。

当前版本已执行以下只检查命令并通过：

```sh
git apply --reverse --check implementation/BA_BIAS_PREVIOUS_RESEARCH_FRESHNESS_FIX_V1/CHANGES.patch
```

结果见ROLLBACK_CHECK.json，applied=false。

若未来单独授权回滚：先核对VALIDATED_CODE_HASHES.json、当前Git差异、暂存状态与其他任务修改。再次运行反向检查；若有冲突立即停止，不覆盖后续工作。检查通过且已取得授权后，才可反向应用同一补丁。本轮没有执行反向应用。

before/保存这8个已有文件任务开始时的原文；需要逐变更块恢复时用于人工核对。新增文件应仅在确认没有后续消费者后随补丁移除。不用reset --hard、clean或目录级覆盖。

回滚后验证：这8个文件与BEFORE_HASHES.json对应记录一致，新模块/测试导入已撤回；package.json与环境/数据仍保持任务开始时字节；运行相同离线完整回归，应回到实测1358项、1342通过及原16项失败。默认原无限期历史读取也会恢复。

不要回滚、重写任何已生成的生产History、Research、Receipt、Manifest或Outbox。新诊断字段为附加字段；回滚不要求迁移或删除已有运行记录。不要为回滚而重启生产服务，本轮也未部署。
