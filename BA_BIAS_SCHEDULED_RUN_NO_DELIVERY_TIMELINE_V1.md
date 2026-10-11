# BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_TIMELINE_V1

全部时间为北京时间（+0800）；数据中的epoch转换不修改原字段。

| 事件 | 时间 | 证据标识 |
|---|---|---|
| 12:00轮开始 | 2026-10-11T12:00:10.008+08:00 | hourly_20261011_1200/result.json |
| 12:00轮完成：44通知 | 2026-10-11T12:12:29.681+08:00 | hourly_20261011_1200/result.json |
| 13:00轮开始 | 2026-10-11T13:00:10.005+08:00 | hourly_20261011_1300/result.json |
| 13:00轮完成：20通知 | 2026-10-11T13:09:47.144+08:00 | hourly_20261011_1300/result.json |
| 14:00轮开始 | 2026-10-11T14:00:10.009+08:00 | hourly_20261011_1400/result.json |
| 最后一次已确认钉钉业务ACK | 2026-10-11T14:06:43.465+08:00 | hourly_20261011_1400/result.json |
| 14:00轮完成：14通知 | 2026-10-11T14:06:43.470+08:00 | hourly_20261011_1400/result.json |
| 前轮用户Ctrl+C并确认退出 | 具体退出时刻UNKNOWN；早于本轮15:07重启 | 会话用户授权及上一轮preflight |
| 上一轮完整测试日志mtime | 2026-10-11 14:53:36 +0800 | validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/all-tests.txt |
| 上一轮主报告mtime | 2026-10-11 14:55:30 +0800 | BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1.md |
| 新的npm启动 | 2026-10-11 15:07:19 +0800 | PID52015 |
| 新的Node启动 | 2026-10-11 15:07:20 +0800 | PID52045 cwd=/Users/yaodebao/Desktop/git/ict03/ba-bias |
| 目标计划时刻 | 2026-10-11T16:00:00.000+08:00 | hourly_20261011_1600 |
| 目标实际开始 | 2026-10-11T16:00:10.009+08:00 | hourly_20261011_1600 |
| 目标数据基准 | 2026-10-11T16:00:14.852+08:00 | hourly_20261011_1600 |
| 目标完成：PARTIAL/0输出 | 2026-10-11T16:02:55.514+08:00 | hourly_20261011_1600 |
| 本次观察时间 | 2026-10-11 16:41:17 CST +0800 | date/ps/lsof |

15:00 Run目录及History条目缺失；当前进程15:07才启动，启动不立即补跑15:00。旧进程的精确退出时刻和15:00当时的系统历史进程快照缺失，不能断言其15:00一定不存在。没有将当前17:00尚未发生周期认定为漏跑。

12:00/13:00/14:00均PARTIAL但通知成功，不称为全流程无错误的COMPLETE。最后成功发送批次14:00；14条任务25个分片皆有errcode=0。12:00的44条82分片皆有errcode=0。用户是否实际看到UNKNOWN。

旧PID73752不是当前进程；前一任务还观察过PID68768并按用户Ctrl+C后确认退出。当前是52045，与前一任务“未由助手重启”并不矛盾：本次ps证明之后确有新启动，启动者身份UNKNOWN。

独立stdout落盘日志MISSING_RECORD。当前输出绑定/dev/ttys002，App终端接口无附着session；本次不读取TTY以避免抢占输入或干扰运行。生命周期时间来自result/History持久化，不冒充控制台日志。

[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/process-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/process-audit.json)

[data/runs/hourly_20261011_1600/result.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1600/result.json)

[data/state/history.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/state/history.json)
