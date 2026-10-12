# BA_BIAS_24H_HOURLY_SCHEDULER_V1

最终状态：**PARTIAL**。

计划频率代码已完成：从北京时间每天09:00–23:00（15个时槽）改为00:00–23:00（24个时槽）。专项调度测试与静态检查通过。完整测试1050项，1038通过、12失败：原有10项失败保留，另有2项原冻结源码哈希断言与本轮授权修改冲突；未迁移基线，未将完整套件包装为全绿。

**SCHEDULE_FREQUENCY_CHANGED_MISSED_RUN_ROOT_CAUSE_UNRESOLVED**

`hourly_20261012_0900 → SKIPPED_MISSED` 的实际根因未调查，也没有声称全天频率改动修复该问题。

## 1. 实际源码与改动

`package.json` 的 `scan` 是 `node src/scan-daemon.js`；`src/scheduler.js`仅兼容调用同一startScanner。真实调度库是既有node-cron，未增加调度器或进程管理工具。

| 文件 | 实际变化 |
|---|---|
| src/scan-daemon.js:8 | SCHEDULE由`0 9-23 * * *`变为`0 * * * *`，TIMEZONE仍为Asia/Shanghai，CLOSE_DELAY_MS仍10000 |
| src/scan-daemon.js:11 | isScheduledAt小时范围由9–23扩展为0–23；整小时、整数时间戳校验原样保留 |
| src/scan-daemon.js:60 | 启动展示计划同步为`0 * * * *` |
| README.md:82 | 当前前台常驻调度说明改为每日00:00–23:00共24个计划小时 |
| test/hourly.test.js | 调整5项涉及原时段的断言；新增18项全天调度测试，其他行为测试保留 |
| test/v4-production.test.js:66 | 仅更新“production 43”的计划表达式断言/标题，单一研究入口与不创建次级Scanner断言保留；没有修改哈希断言 |

没有修改src/config.js、.env、package.json、lockfile或Dashboard代码。源文件只有scan-daemon.js变更，三个计划相关行以外逐字节一致：将这三处值在内存反向恢复后，SHA256精确回到开发前冻结值。具体Git diff保存在本轮验证目录。

## 2. 时区、整点与RunId

- cron.createTask显式设置`timezone: Asia/Shanghai`，不是进程启动后每60分钟运行。
- nextScheduledAt继续以UTC整小时毫秒边界寻找下一时槽；上海为UTC+8整小时偏移，因此上海00:00对应前一UTC日16:00。
- times(ms)沿用既有UTC时间加28800000毫秒格式化上海日期规则，hourlyRunId函数体未改。新增有效时段使用同一`hourly_YYYYMMDD_HH00`规则，例如hourly_20261012_0000、0100、2300。
- 23:59:59的下一计划时间为次日00:00:00；23:00后的下一时槽为次日00:00。
- node-cron正式事件归属整点。原有10秒close delay保持：研究通常在计划整点后10秒采集已收盘数据，scheduledAt与RunId仍归整点，未把实际采集开始伪装为整点。

TZ=America/Los_Angeles、Pacific/Honolulu、UTC三个独立子进程验证相同绝对时间的上海日期、cron匹配及午夜RunId，不使用宿主本地日期构造计划。这是非上海系统时区的等价隔离验证；没有连接Windows、没有声称Windows实机验收。

配置证明见`validation/BA_BIAS_24H_HOURLY_SCHEDULER_V1/schedule-proof.json`：24个时槽从00到23，cron匹配与校验全部一致。这只是计划/测试证明，actualResearchRuns=0，不是补造生产历史或承诺每天24条情报。

## 3. 安全、重复与启动语义

启动不研究、不补过去时槽；触发仍要求scheduledAt严格晚于本实例startedAt。非整点启动等下一个未来整点；恰在整点启动时，该刚开始的时槽也沿用原规则不立即运行。新时段只在用户正式启用本版本后生效，进程不重启不会自动加载本地源码变更。

seen集合仍阻止同实例同小时重复；同实例start仍幂等只注册一个任务。跨重启仍读取既有History/result中的RunId，不重复市场、模型或投递调用。跨日不清History、不清Story去重，也不要求每轮产生消息。

active运行中的新时槽仍SKIPPED_OVERLAP、不排队、不补跑；两项迟到检查仍`now()-scheduledAt >= 60000`，execution:missed事件仍记录SKIPPED_MISSED，不改补跑/重试/锁/超时。睡眠中断、FAILED、INTERRUPTED、shutdown与delivery worker行为原样保留。

研究/投递共享的持久化运行锁保持不变，锁占用仍阻止并发扫描。原实现并非额外持有一个覆盖整个WAITING期的Scheduler进程锁，本任务没有擅自新增或修改调度锁。正式启用时必须使用现有唯一Scanner终端，不能另开第二个Scheduler实例；本轮没有启动任何正式Scheduler，也未连接或重启Windows进程。

默认Top 3研究预算、所有评分/资格门槛、LLM调用策略、运行超时、去重、Facts、History、Outbox及DingTalk代码保持原样；没有增加每轮请求上限。

## 4. 隔离测试与结果

实际命令：

```sh
node --test test/hourly.test.js
npm test
# 逐文件执行（src/scripts/test/web中全部107个JS）：
node --check <文件>
git diff --check
```

| 检查 | 结果 |
|---|---|
| Scheduler专项 | 76/76 PASS，其中原有58项保留并按新时间调整必要断言，新增18项 |
| 静态语法 | 107/107 PASS |
| Git diff空白检查 | PASS |
| 完整自动化 | 1050项：1038 PASS、12 FAIL、取消0、跳过0 |

新增18项覆盖00/01/08/09/23触发、10秒延迟、稳定RunId、同整点重复不重跑、24个唯一时槽无额外第25轮、23→次日00、23:59:59启动、00:17不补历史、幂等start、23点长运行跨午夜防并发、59999/60000ms迟到边界、等待期间停顿仍记missed、三个非上海系统时区、持久化午夜RunId不重复外部调用。原有并发锁、恢复、去重、Top 3及投递Mock测试继续执行。

使用Fake Clock、注入scheduler/research、临时目录、Mock Binance/DeepSeek/DingTalk；真实cron任务仅调用match后destroy，未start正式时钟回调。没有真实市场API、模型或钉钉请求，没有手动补09:00。测试自身生成的两个Selector离线证明文件已恢复为本轮开始内容。

## 5. 原有10项与新增2项失败独立记录

下表依据完整日志的第一个失败断言。原有10项并非所有后续断言都检查完成；本轮授权调度与README修改使其中部分首先撞到新的源码/文档哈希，不能直接当作业务回归，也不能接受新哈希掩盖后续断言。

| Test | 位置 | 首个失败文件 | 与上一轮相比 |
|---|---|---|---|
| Judge recovery, detectors, queue, History, scheduler and production state remain byte-identical | test/analyst-alignment.test.js:38:1 | src/scan-daemon.js | 原有失败测试；首个断言可能因授权修改变化 |
| production scan command and protected files retain baseline bytes | test/analyst-generation.test.js:41:1 | README.md | 原有失败测试；首个断言可能因授权修改变化 |
| history/outbox/raw model responses/env remain byte identical in offline suite | test/analyst-precision.test.js:37:1 | data/state/dingtalk-rate.json | 原有失败测试；首个断言可能因授权修改变化 |
| all protected production logic and original tests remain unchanged | test/compact.test.js:44:1 | src/scan-daemon.js | 原有失败测试；首个断言可能因授权修改变化 |
| NO_EDGE forensic 43 History hashes immutable | test/no-edge-render-forensic.test.js:5:178 | data/state/history.json | 原有失败测试；首个断言可能因授权修改变化 |
| NO_EDGE forensic 48 immutable production policies beyond renderer | test/no-edge-render-forensic.test.js:5:178 | src/scan-daemon.js | 新增失败：授权计划修改与旧冻结SHA冲突 |
| output quality 53 History immutable | test/output-quality.test.js:11:29 | data/state/history.json | 原有失败测试；首个断言可能因授权修改变化 |
| Selector 39 production files identical | test/selector.test.js:5:343 | data/state/history.json | 原有失败测试；首个断言可能因授权修改变化 |
| V4 all pre-existing files including production and old experimental contracts remain identical | test/structured-v4-live-preflight.test.js:16:1 | README.md | 原有失败测试；首个断言可能因授权修改变化 |
| V4 protected existing files incl V3, state, env, snapshots are unchanged | test/structured-v4.test.js:46:1 | README.md | 原有失败测试；首个断言可能因授权修改变化 |
| production 49 original data env detectors Judge queue scheduler bytes preserved | test/v4-production.test.js:72:1 | README.md | 原有失败测试；首个断言可能因授权修改变化 |
| every protected market, scheduling and delivery implementation matches the pre-task snapshot | test/validation-recovery.test.js:68:1 | src/scan-daemon.js | 新增失败：授权计划修改与旧冻结SHA冲突 |

新增2项都保护src/scan-daemon.js：

- `test/no-edge-render-forensic.test.js:45` 的“48 immutable production policies beyond renderer”。
- `test/validation-recovery.test.js:68` 的“every protected market, scheduling and delivery implementation matches the pre-task snapshot”。

原预期SHA256：`4a406dac04b24c7e3a5f0e17eabc667f72b285d4a041441674b4f86b576091d9`

本轮实际SHA256：`724c771a5527939b9dc36dffff33f90c9aa4e9b79232af5e11ec32a7032a5706`

二者差异只有明确授权的Cron表达式、小时范围和启动展示三行。没有修改这两个断言、旧清单、History哈希或允许列表。基线迁移不在本轮范围；因此保留失败并标PARTIAL，不以源码当前存在为理由接受其新SHA。

全部12项的expected/actual与首次失败文件见`test-failures.json`；以前10项的原始来源与生产状态限制仍见`BA_BIAS_WEB_DASHBOARD_V1_HASH_BASELINE_FORENSIC.md`。

## 6. 生产完整性与交付边界

冻结清单保护**8400项**原有生产数据/.env/.web.env及非调度源码：全部SHA256不变，生产目录新增文件0。所有既有文件变化严格限定README、scan-daemon、hourly测试及V4测试中的单条Scheduler断言；其他测试/配置/源码原样保留。

证据位于`validation/BA_BIAS_24H_HOURLY_SCHEDULER_V1/`：before-hashes.json、git-status-before.txt、git-diff.patch、scheduler-tests.txt、full-tests.txt、static-results.json、schedule-proof.json、test-failures.json、production-integrity.json。目录是隔离验收材料，不是生产Run存档。

未启动或重启Scanner、未补跑00–08或09点、未虚构历史、未重发DingTalk、未部署Windows、未推送GitHub。现有`npm run scan`前台方式保持；用户后续正式启用时仅在原Scanner实例退出后启动一个实例，本轮不执行这些动作。

**SCHEDULE_FREQUENCY_CHANGED_MISSED_RUN_ROOT_CAUSE_UNRESOLVED**。
