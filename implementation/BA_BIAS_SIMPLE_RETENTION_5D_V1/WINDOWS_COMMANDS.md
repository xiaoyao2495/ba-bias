# Windows CMD手动执行说明（本轮未执行生产命令）

代码需另行授权提交、部署后再使用。没有自动清理Scheduler，也没有新增.env变量。以下按CMD编写。

先确认实际DataRoot，不能把项目根、盘符根、shadow-data或任意其他目录当作data：

```bat
cd /d C:\git\ba-bias
node -p "require('fs').realpathSync('data')"
set "RETENTION_ROOT=C:\git\ba-bias\data"
```

RETENTION_ROOT必须与上面Node打印的规范真实路径一致；使用自定义BA_DATA_DIR时改成实际路径，不能盲目沿用示例。需要本项目已prepared的Manifest/History，未知/实验原型状态不会自动迁移。

## 1 只读盘点

```bat
node scripts/data-retention.js AUDIT --root "%RETENTION_ROOT%"
```

显示超期/合格/受保护Run、原因、关联数量、预计逻辑字节和History/Research引用，不改数据。结果不是全部Run均可删的保证。

## 2 Dry-run

```bat
node scripts/data-retention.js DRY_RUN --root "%RETENTION_ROOT%"
node scripts/data-retention.js VERIFY --root "%RETENTION_ROOT%"
```

先处理完整性错误。没有必要把计划永久保存；APPLY会在锁内重新盘点。预算/路径/权限错误都应停止，不应编辑Manifest或清理锁文件来规避。

## 3 显式授权APPLY

下面会真的删除过期合格数据，只有用户单独决定执行时使用，本轮未执行：

```bat
node scripts/data-retention.js APPLY --root "%RETENTION_ROOT%" --confirm DELETE_EXPIRED_RUNS --max-runs 3
```

默认不带APPLY或不带正确确认短语不会删除。默认3个，最大10个/1GiB；只执行一批，不自动循环。Scanner占锁时拒绝；选择维护窗口以免跨整点竞争，本轮不执行PM2停止或重启。中断时重新执行相同命令恢复一个在途操作，不手删active/state或pending。

## 4 清理后验证

```bat
node scripts/data-retention.js VERIFY --root "%RETENTION_ROOT%"
node scripts/data-retention.js DRY_RUN --root "%RETENTION_ROOT%"
dir "%RETENTION_ROOT%\retention-v1"
```

正常完成生命周期目录只有state.json；若仍有active或报pending，按错误恢复，不重置索引。检查近期Web研究可读、退役研究410，再验证未来正式扫描，不能通过补跑旧Run验证。

先人工有限清理并验证，再另行决定自动化；本轮没有开发自动执行平台、修改调度或开放端口。删除后无法由小记录恢复市场/模型正文，若需要可逆性，应在首次实际执行前自行保留独立备份并验证恢复。
