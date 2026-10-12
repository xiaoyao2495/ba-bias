# BA_BIAS_PM2_ENTRY_FIX_V1

最终状态：**PM2_ENTRY_FIX_PARTIAL**。

已新增显式PM2 ESM入口，离线复现原入口判断不匹配的机制，正常初始化/失败退出/信号流程验证通过。Windows24.15.0及实际安装PM2版本未运行，因此现场根因及后续整点扫描仍待验证。完整测试保留12项哈希失败（前10项旧问题+24H任务新增2项旧冻结合同冲突），未自动迁移任何基线。

## 1. 原始入口是否绕过startScanner：现场UNKNOWN，隔离机制可复现

真实源码：package.type=module，npm run scan仍为node src/scan-daemon.js。scan-daemon末尾只在import.meta.url与process.argv[1]经pathToFileURL转换后的URL相等时自动startScanner。

本机没有安装PM2，没有Windows环境；默认Node23.11.0，另有可用Node24.19.0，无法声称目标Windows24.15.0+实际PM2实机复现。

只读查阅[PM2官方fork容器源码](https://github.com/Unitech/pm2/blob/master/lib/ProcessContainerFork.js)：当前上游ESM分支使用动态import加载pm_exec_path。本机测试在真实Scanner源代码的隔离ESM上下文中，将argv[1]设置为容器路径，import.meta.url设置为应用URL。这种模型下二者不相等，旧入口没有创建Scheduler，stdout/stderr均为空；新显式入口创建一个Scheduler并输出Scanner自身日志。

该上游master并非用户服务器所安装版本的证明。若服务器PM2版本改写argv、实际script path/cwd不同或日志输出被重定向，现场表现仍可能有其他原因。没有拿“PM2 online”或0次重启当作Scheduler启动证据。

| 隔离方式 | Scheduler创建数 | 启动日志 | 市场/投递调用 |
|---|---:|---|---:|
| 原入口直接执行（npm scan对应路径） | 1 | Scanner自身WAITING及Next run | 0 |
| 普通模块导入原scan-daemon | 0 | 无 | 0 |
| PM2 fork模型导入原scan-daemon，argv为容器 | 0 | 无，错误也无 | 0 |
| 新入口直接执行/由fork模型导入 | 1 | Scanner自身实际计划、WAITING、Next run | 0 |

复现证据：validation/BA_BIAS_PM2_ENTRY_FIX_V1/fork-original-proof.json、fork-entry-proof.json；均有mockOnly=true。Windows路径通过合成file:///C:/ URL与Windows argv转换模型验证，不冒充Windows原生pathToFileURL实机。

所以结论是：**入口判断兼容性机制已离线复现；Windows现场实际根因未确认**。此前直接建议PM2运行scan-daemon.js未覆盖该加载差异，不能继续以原命令启动可靠性已证实来表述。

## 2. 实际实现与调用边界

新增src/scan-pm2-entry.js：相对导入startScanner和safeError，顶层await显式调用一次startScanner。没有Cron、runResearch、独立计时器、业务API或补跑。导入scan-daemon时原guard不匹配专用入口/容器URL，因此不会创建第二个实例。

失败使用console.error(safeError(error))后process.exit(1)：PM2容器可能因IPC保持存活，仅设置exitCode不一定及时退出；明确终止初始化失败的子进程，不允许其作为无效在线Scanner持续等待。没有改扫描阶段失败重试策略，PM2自身重启策略也未新增配置。

startScanner环境缺失在创建Scanner前抛MISSING_SCANNER_ENVIRONMENT；实际子进程分别缺Key/Webhook时，在带IPC的fork下状态1退出，无stdout、无凭据值泄露、无data目录。Scheduler start失败时原Scanner先调用stop/destroy释放资源，再由新入口安全报告并退出；失败不会吞掉。既有启动banner位于task.start之前，本轮未挪动该日志；出现banner后必须确认没有随后初始化错误/退出。

原npm run scan、scan-daemon末尾guard、src/config.js、src/logging.js完全未改。config仅按cwd读取.env；ESM模块导入仍存在配置读取/依赖初始化，不能称为完全零副作用，但不自动启动Scanner或请求市场。

SIGINT/SIGTERM注册及优雅stop完全复用原Scanner。正常常驻由既有node-cron任务维持，原队列轮询及unref策略保留，不增加新存活计时器。

## 3. 新增文件与保留24小时变更

新增：

- src/scan-pm2-entry.js：唯一新增生产入口。
- test/pm2-entry.test.js：24项专项测试。
- test/pm2-entry-fixture.js：真实Scanner/入口源代码VM ESM依赖隔离工具，Fake Date/cron/进程/计时器，禁止未Mock导入及市场/投递调用。
- BA_BIAS_PM2_ENTRY_FIX_V1_WINDOWS_DEPLOY.md：CMD安全停止、删除旧实例、发布后拉取、新入口单实例启动及验收。
- 本报告及独立validation证据目录。

本轮PM2实现没有修改任何原有文件，包括原入口、package/config、Scheduler测试、业务模块与生产数据。

任务开始前已存在的24小时变更全部原样保留：README.md、src/scan-daemon.js中的三个计划相关行、test/hourly.test.js与test/v4-production.test.js单条Scheduler表达式断言，以及24H报告。本次将这组变更与PM2新增文件一起提交本地Git，没有推送。

本地SCHEDULE继续0 * * * *、Asia/Shanghai。Windows尚未发布时仍可能0 9-23 * * *；部署后Schedule必须以实际文件/真实Scanner输出为准，不硬编码额外成功日志。

10秒close delay、seen、防并发active、持久化RunId去重、Top 3、Facts、Selector、V4、History、Outbox、DingTalk、迟到阈值/自动补跑/锁/超时均未因本轮改变。

## 4. 完整性与测试

命令：

```sh
node --test test/pm2-entry.test.js test/hourly.test.js
# 可用Node24.19.0另行执行同一专项命令
npm test
# 全部src/scripts/test/web JS逐文件：
node --check <文件>
git diff --check
```

| 检查 | 结果 |
|---|---|
| Node23.11.0专项 | 100/100：24项PM2+76项Scanner |
| Node24.19.0专项 | 100/100：同一真实源码与隔离测试 |
| 全部JS静态检查 | 110/110 |
| 完整自动化 | 1074项，1062通过、12失败、取消0、跳过0 |
| 本轮开始前完整性 | 8430项既有源码/测试/配置/生产文件全部SHA不变，生产目录新增文件0 |

包含原始直接启动、普通导入无自动启动、fork argv差异、专用入口单实例、动态实际Schedule日志、缺环境/启动失败安全退出、SIGINT/SIGTERM原stop/destroy、Windows路径模型，以及真实带IPC子进程的缺Key/Webhook退出验证。原Scanner76项含24小时Fake Clock、跨日、missed、overlap、去重和Top 3等测试保留。

新增测试不使用真实成功Scanner进程，不调用Binance/DeepSeek/DingTalk；唯一外部读取是查阅官方PM2 GitHub源码。没有连接Windows或启停其进程。完整测试的既有两份离线Selector证明已恢复为本轮开始内容；不写生产Facts/History/Outbox/.env/日志。所有成功初始化均使用依赖隔离，真实子进程只测试环境缺失立即退出。

12项失败名称与24H任务完全相同，没有PM2新增功能失败；没有跳过或弱化安全/哈希断言。详细来源仍参考24H报告、此前HASH_BASELINE_FORENSIC与本轮test-failures.json。这里不把这些失败包装为全部通过。

## 5. Windows部署与仍需验证的问题

完整CMD步骤见BA_BIAS_PM2_ENTRY_FIX_V1_WINDOWS_DEPLOY.md。发布到GitHub后，确认原npm Scanner停止、旧PM2实例stop/delete成功、没有其他Scanner、Git拉取实际包含新入口，然后：

```cmd
cd /d C:\git\ba-bias
pm2 start src/scan-pm2-entry.js --name ba-bias-scanner --cwd C:\git\ba-bias --time
pm2 describe ba-bias-scanner
pm2 logs ba-bias-scanner --lines 100
```

禁止cluster、多实例、watch、并行npm scan、不补历史。新入口自身不会创建第二个Scanner，但不能阻止操作人员启动多个独立PM2实例；原研究锁仅保留既有并发保护，未擅加常驻Scheduler锁。

WAITING/Next run只能证明走到初始化路径，不能证明未来整点一定执行。需现场分别核对：真实PM2版本/容器加载方式与argv；正确cwd/.env；实际Schedule与本次commit；未来整点Scheduled run和归属RunId、result终态；初始化失败是否进入PM2错误状态/是否被自身自动重启策略反复重启；SIGINT/SIGTERM及Windows PM2实际停机行为。

Dashboard既有进程观察只匹配scan-daemon.js，新入口或PM2容器可能不被识别，本轮未越界修改Dashboard。若该页面STOPPED/UNKNOWN，不能单凭此判定Scanner未启动；同样online不代表研究成功。

**SCHEDULE_FREQUENCY_CHANGED_MISSED_RUN_ROOT_CAUSE_UNRESOLVED**。

此前09:00 SKIPPED_MISSED根因未解决；入口兼容性与24小时频率并不证明全部漏扫已修复。

## 6. Git交付

按用户最后授权，将既有24H计划修改和本轮PM2入口一并精确暂存、提交。未提交.env/data/validation日志/运行缓存；无强制推送、无自动部署、无自动重启。Commit SHA在最终答复中给出，本报告不嵌入自身commit避免自引用。
