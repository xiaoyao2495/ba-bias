# BA-BIAS PM2专用入口 · Windows CMD部署

本轮只提交本地Git，不自动推送或连接Windows。新入口与24小时计划在同一提交中；用户另行确认发布到GitHub后，Windows才可拉取。此前Windows的09–23点版本不会自动升级。

## 1. 安全切换前置条件

- 选择没有活跃研究/投递的时段切换，避免整点前最后几秒停启。
- 原npm run scan终端若仍存在，Ctrl+C并等待退出。不要关闭Dashboard终端。
- 全程使用同一Windows用户及同一PM2_HOME，避免管理到另一份进程列表。
- 不使用pm2 kill、stop all、delete all，不停止Dashboard或其他应用。
- PM2 stop/delete只操作确认是旧Scanner的ba-bias-scanner实例，先检查PID、script path、cwd。

在CMD中执行：

```cmd
cd /d C:\git\ba-bias
pm2 list
pm2 describe ba-bias-scanner
```

确认旧应用属于本项目后：

```cmd
pm2 stop ba-bias-scanner
pm2 describe ba-bias-scanner
pm2 delete ba-bias-scanner
pm2 list
```

stop失败或进程未退出时停止操作，不直接创建新实例。若同名应用存在多个ID，逐个核对并停止/删除确认属于本项目的旧实例；不要启动第二个Scanner。

还需确认没有独立npm/node Scanner。CMD中可只读检查：

```cmd
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'scan-(daemon|pm2-entry)\.js' } | Select-Object ProcessId,CommandLine"
```

此查询无法证明所有PM2容器都没有Scanner，因为容器命令行可能不包含目标脚本名；须同时核对pm2 list、旧终端及已记录PID。不要盲目结束所有node.exe。

## 2. Git同步（仅在本地提交已另行发布之后）

```cmd
git status --short
git branch --show-current
git remote -v
```

确认分支main、项目远程xiaoyao2495/ba-bias、没有本地代码修改。保留.env和data，不reset/clean。然后：

```cmd
git pull --ff-only origin main
git log -1 --format="%H %s"
dir src\scan-pm2-entry.js
```

pull失败或新文件不存在立即停止，不能把旧Windows代码当作已部署修复。本次未改package/lockfile，无新增运行依赖。Node 24.15.0符合项目Node>=22声明；本轮验证为Mac上的23.11.0和24.19.0，不是目标Windows24.15.0实机证据。

## 3. 配置与单实例启动

.env加载基于cwd；必须使用C:\git\ba-bias。保留现有.env，不把凭据放进PM2命令行。以下仅输出配置是否存在，不输出值、不访问外部接口：

```cmd
node --input-type=module -e "import {config} from './src/config.js'; console.log({deepseekConfigured:!!config.deepseekKey,webhookConfigured:!!config.webhook})"
```

两项应为true。配置缺失时新入口输出MISSING_SCANNER_ENVIRONMENT并退出1，不能以online作为初始化成功证据。

确认没有任何旧Scanner后：

```cmd
pm2 start src/scan-pm2-entry.js --name ba-bias-scanner --cwd C:\git\ba-bias --time
pm2 describe ba-bias-scanner
pm2 logs ba-bias-scanner --lines 100
```

保持默认fork单实例。禁止cluster、--instances 2或更多、--watch、--force、不使用PM2 cron-restart代替内部Scheduler。

应看到原Scanner输出BA-BIAS Shadow Scanner、Mode: HOURLY、Timezone: Asia/Shanghai、实际Schedule、DingTalk: ENABLED、Status: WAITING和Next run。本次合并部署后实际计划应为0 * * * *；Windows若仍输出0 9-23 * * *，说明没有部署本次24小时版本，先核对Git及实际script path。

确认后保存列表：

```cmd
pm2 save
```

pm2 save不是Windows开机自启配置。本任务不设置Windows服务或任务计划，不改防火墙，不安装PM2插件。

## 4. 单独现场验收与边界

- WAITING与Next run只说明初始化路径走到了Scheduler；必须另行检查未来计划整点的Scheduled run、RunId、研究摘要及终态。
- 原10秒采集延迟保持，startedAt严格门控保持；启动不补跑旧10:00或09:00。
- SKIPPED_MISSED >=60秒、SKIPPED_OVERLAP、锁及重试策略原样保留。24小时计划和入口修复不解决此前09:00漏执行根因。
- 原npm run scan仍有效，但不能与PM2 Scanner同时运行。
- 当前Dashboard进程识别只检查scan-daemon.js；PM2容器或新入口可能无法被该观察器正确识别。本轮未修改Dashboard，不能仅凭其STOPPED/UNKNOWN判定修复无效，也不能仅凭PM2 online认定成功。以新入口真实日志、未来Run记录及PID一致性核验。
- 原始Windows PM2现场根因仍需核对安装版本、容器文件、argv/实际入口及日志配置。本次不伪称现场已复现或已修复所有漏扫。

SCHEDULE_FREQUENCY_CHANGED_MISSED_RUN_ROOT_CAUSE_UNRESOLVED
