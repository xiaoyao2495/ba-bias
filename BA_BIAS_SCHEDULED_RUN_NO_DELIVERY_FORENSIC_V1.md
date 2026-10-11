# BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1

## 1. Executive Summary

NO_DELIVERY_ROOT_CAUSE_CONFIRMED（无投递的直接阻断已确认）。16:00实际执行，但40个Story Judge逻辑调用全部ERR_BAD_REQUEST，零有效Judge结果，未进入V4/Packet/Outbox。底层Provider HTTP/业务原因ROOT_CAUSE_UNKNOWN。不是调度停止，不是正常无新情报，不是钉钉发送失败。本轮只读，当前已有扫描进程未被停止、重启或干预。

## 2. Current System Time and Timezone

2026-10-11 16:41:17 CST +0800；用户Asia/Shanghai。观察起止时间记录于[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/integrity.json)。CST在本机由+0800明确为北京时间。

## 3. Expected Schedule

每天北京时间09–23每整点，0 9-23 * * *；收盘缓冲10秒。16:00预期触发，实际16:00:10.009开始。启动后等待下一个整点，不立即扫描或补跑旧整点；延误≥60秒SKIPPED_MISSED，重叠SKIPPED_OVERLAP。任务期间有锁，整轮超时及队列优先级保留。[src/scan-daemon.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/scan-daemon.js:8)；[src/scan-daemon.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/scan-daemon.js:30)；[src/storage/history.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/history.js:13)

## 4. Actual Scanner Process State

仅发现一个实际BA-BIAS Node扫描实例：PID52045，PPID52015，S+，node src/scan-daemon.js，cwd=/Users/yaodebao/Desktop/git/ict03/ba-bias。npm父进程15:07:19，Node15:07:20启动；stdout/stderr=/dev/ttys002。其他编辑器/工具Node已排除。[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/process-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/process-audit.json)

## 5. Last Process Start/Stop Evidence

当前实例启动有ps+lsof证据。此前用户Ctrl+C且上一轮确认退出，精确旧进程退出时刻/退出码UNKNOWN，没有崩溃证据。前轮助手未重启不代表之后没有新实例；本次已证实15:07新启动，启动者UNKNOWN。

## 6. Last Successful Run

最后成功投递批次hourly_20261011_1400，14任务25分片业务errcode=0，最后ACK 2026-10-11T14:06:43.465+08:00，完成2026-10-11T14:06:43.470+08:00。12:00为44任务82分片，13:00为20通知。上述Run状态PARTIAL，成功仅指保存的投递确认。证据：[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/outbox-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/outbox-audit.json)

## 7. Missing or Delayed Run Investigation

16:00未缺失，也非仍执行：finishedAt 2026-10-11T16:02:55.514+08:00，耗时165505ms。15:00目录/History缺失，新实例15:07才启动且不补跑；旧进程15:00状态UNKNOWN。当前16:41，17:00尚未到，不审计未来缺失。

## 8. Actual RunId Evidence

[data/runs/hourly_20261011_1600/result.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1600/result.json) 与 [data/state/history.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/state/history.json)均记录HOURLY / scheduledAt=1791705600000 / startedAt=1791705610009 / finishedAt=1791705775514 / PARTIAL。未保存独立Scheduler Trigger/开始完成控制台日志，标记MISSING_RECORD；持久化Run证明已创建并完成。

## 9. Binance Data Fetch Evidence

历史本轮实际请求：scan.httpMetrics requests741/retries0/cooldowns0/maxUsedWeight1284。47 Facts均有真实raw sources、endpoint/params/retrievedAt；LUMIA exchangeInfo检索16:00:13.577、ticker16:00:13.992、premium16:00:14.481，cutoff16:00:14.852。不是审计触发新请求。HTTP741是请求尝试数，不是成功Symbol数。[data/runs/hourly_20261011_1600/scan.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1600/scan.json)；[data/runs/hourly_20261011_1600/facts/LUMIAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1600/facts/LUMIAUSDT.json)

## 10. Scanner Funnel

Universe924；399非TRADING_USDT_PERPETUAL、7硬排除，原生Crypto518；有效ticker518，INVALID_TICKER0。原通道12触发+12轮转，账户异常新增23，深查47。账户覆盖请求448、完整445、3 ERR_CANCELED、70未覆盖（ACCOUNT_DISCOVERY_TIME_BUDGET_EXHAUSTED）；异常29。不能把924写成924个都完成深查，也不能把70未覆盖视为无异常。总scanBudgetExceeded=false，账户独立budgetExceeded=true。[BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FUNNEL_V1.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FUNNEL_V1.json)

## 11. Facts Results

47文件均dataCompleteness.eligible=true，无sources.error；40有深查异常进入Judge，7无深查异常：A、T、ESPORTS、BEAMX、CHZ、CETUS、JASMY（均USDT）。这些无异常由Facts/Detector判定，不是Judge拒绝。未重新评估市场或改阈值。

## 12. Story Judge Decisions

40个逻辑调用均JUDGE_FAILED/ERR_BAD_REQUEST。没有原始Judge响应、eligible=false决定、storyAngle、Schema验证或有效Reject Reason；不能将请求异常当正常编辑否决。deepseek-calls.json=[]，DeepSeek.calls只在HTTP返回后push，不能据空数组断言从未请求。物理重试数/HTTP状态/服务端正文/单请求耗时均UNKNOWN。代码[src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:123)；[src/clients/deepseek.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/deepseek.js:9)；[src/content/story-judge.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/content/story-judge.js:14)。全部逐币种证据见附表及candidate-audit.json。

## 13. V4 Analyst Results

directionalAnalyses=0、directionalFailures=0，无directional目录，模型请求/成功/失败/Recovery/有效方向/VALID_NO_EDGE/ANALYST_UNAVAILABLE输出均0（根本未进入，不表示V4通过率100%）。Judge异常在进入V4前抛出。14:00四条失败仍有SENT记录，证明既有合法Facts降级路径未必因Analyst失败阻断。核心合同未变。[src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:127)

## 14. Intelligence Packet Creation

目标Run不存在intelligence目录，generatedIntelligence=0；所有候选阻断于Judge或NO_DEEP_ANOMALY。未见Packet创建/持久化错误。本轮不能生成“应该发送”的数量，因为没有有效Judge批准。[src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:140)

## 15. History / Dedup Decisions

目标47终态：40 JUDGE_FAILED，7 NOT_NEWSWORTHY/NO_DEEP_ANOMALY；DUPLICATE/NO_UPDATE0。compare在Judge之前计算，但最终去重continue位于Judge通过、Analyst之后，因此不是本轮丢消息的执行分支。只读用现有冻结Facts及已SENT等历史重建40份comparison：31 eligible、9不eligible；重建不等于原始保存Judge资格，不说明31必应通知。逐币种历史storyKey/previous/current/newEvidence见candidate-audit.json，未持久化新History事件。[src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js:138)

## 16. Outbox State Distribution

目标Run0任务：PENDING0、SENDING0、SENT0、FAILED0、UNKNOWN0、其他0。全库183任务：SENT181、SHADOW2，其他0；没有未处理异常队列导致本轮丢失。每条历史任务deliveryId、storyKey、生成/ACK时间、分片/attempt/status/业务确认已归档，HTTP状态/请求耗时未保存处UNKNOWN。[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/outbox-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/outbox-audit.json)

## 17. DingTalk Attempt and Response

16:00发送尝试0，无HTTP/业务响应（NOT_APPLICABLE）。run sendRequested=true并不代表调用sender；无合格Outbox则队列静默。当前实例能通过启动环境门槛，历史14:00业务ACK存在；本轮没有网络验证当前Webhook有效性/目标群。已SENT不证明用户看见。缺HTTP详情不归因限流/DNS/代理/额度。[src/clients/dingtalk.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/clients/dingtalk.js:8)；[src/storage/delivery-queue.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/storage/delivery-queue.js:42)

## 18. Suspension / Restart Timeline

[BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_TIMELINE_V1.md](/Users/yaodebao/Desktop/git/ict03/ba-bias/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_TIMELINE_V1.md)。本机用户crontab无配置；已加载launchctl中未见BA-BIAS标签，检查33个LaunchAgents/Daemons及Codex自动化配置无匹配，4个不可读/失效路径明确记录，不能证明系统任何未知外部触发器均不存在。当前前台进程足以解释16:00已触发。V4切换后的最早前台启动精确时刻UNKNOWN；12:00已存在HOURLY正式运行是可证明的下界，不把它当成首次启动时间。

## 19. Root Cause Classification

直接原因STORY_JUDGE_API_OR_TRANSPORT_FAILURE：40请求异常→无有效Judge批准→无V4→无Packet→无Outbox→无钉钉。本任务给定决策树缺少“Judge本身执行失败”分支；不强行归入LEGITIMATE_NO_DELIVERY或SCAN_OR_FACTS_FAILURE。使用上述明确补充分支，验收NO_DELIVERY_ROOT_CAUSE_CONFIRMED；底层服务端/HTTP根因仍ROOT_CAUSE_UNKNOWN。

## 20. Production State Integrity

审计前后5600个源码/测试/生产数据/config文件哈希核对，data文件5506个，变化0，新增0。当前进程存在，若正常写入也需区分来源；本次观察窗口未发生持久化差异。Git Commit/工作区状态NOT_A_GIT_REPOSITORY，无虚构Commit。只写独立报告/validation，未运行测试或扫描，无API调用/信号/生产写入。[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/integrity.json)

## 21. Minimal Remediation Recommendation

不需要重启正在运行的调度器，也没有待补发Outbox。本轮不实施修复。最小下一步先由用户核查Provider管理侧请求/账单/错误日志，以获得16:02附近HTTP拒绝原因；不把额度问题作为结论。若另行授权，最小工程改进为保存脱敏HTTP status、error code、请求耗时及失败计数：Http持有httpStatus但main safeError只看response.status/忽略该字段，最终仅存ERR_BAD_REQUEST；DeepSeek.calls只记成功返回。无需因此改Judge阈值、V4合同或去重。任何真实联调/配置修复另需用户指令。

## 22. What Was Not Verified

HTTP实际状态、Provider错误正文/拒绝原因、40逻辑调用的物理重试总数、服务端是否执行模型、单请求时间/耗时、当前Webhook指向群及用户可见性、旧实例精确退出时刻/退出码、独立TTY日志与不可读外部配置均UNKNOWN/MISSING_RECORD。没有查未来行情，未调用外部API，也未保证下轮Provider已恢复。

## Run生命周期

所有行均指hourly_20261011_1600，北京时间；UNKNOWN是未保存精确阶段时间，不冒充失败。

| 阶段 | 发生/时间/计数 | 证据 |
|---|---|---|
|1 Scheduler Trigger|已触发（HOURLY持久化可证）；独立Trigger日志/精确回调时刻MISSING_RECORD|src/scan-daemon.js:38 + result.triggerType|
|2 Run Created|16:00:10.009，hourly_20261011_1600|result.startedAt / History.runs|
|3 Market Fetch Started|请求已发生；单独开始日志MISSING_RECORD，来源retrievedAt可追溯|facts/*/sources；main.js:97|
|4 Market Fetch Completed|扫描记录已保存；精确整体完成时刻UNKNOWN|scan.json|
|5 Universe Loaded|924原始合约；518原生Crypto；精确装载时刻UNKNOWN|scan.universeCount/nativeCryptoCount|
|6 Scanner Completed|已完成，scanBudgetExceeded=false；精确阶段完成时刻UNKNOWN|scan.json|
|7 Candidate Generated|47深查集合，40异常候选；精确时间UNKNOWN|scan.researchCandidates/candidates|
|8 Facts Built|47有效文件；精确每包完成时间未独立保存|facts/* dataCompleteness / sources|
|9 Story Judge Evaluated|40逻辑调用均ERR_BAD_REQUEST，无有效评估；具体各请求时间UNKNOWN|evaluations/* + result.errors|
|10 Analyst V4 Called|未发生，0|result.directionalAnalyses|
|11 Analyst V4 Validated|未发生，0|无directional目录|
|12 Intelligence Packet Created|未发生，0|无intelligence目录 + generatedIntelligence|
|13 Story Decision Persisted|47候选终态已保存，40 JUDGE_FAILED/7 NO_DEEP_ANOMALY；没有有效Judge故事决定|evaluations/*|
|14 Outbox Entry Created|未发生，0|data/outbox 本轮清单为空|
|15 Outbox Delivery Attempted|本轮未发生，0|本轮无deliveryId/分片|
|16 DingTalk Response Received|本轮未发生，NOT_APPLICABLE|本轮无Outbox/response|
|17 Outbox Final State|本轮0任务，所有状态计数0|outbox-audit.json|
|Run Completed|16:02:55.514，PARTIAL|result.finishedAt / History|

## Q1–Q25

**Q1.** 2026-10-11 16:41:17 CST +0800，Asia/Shanghai。

**Q2.** 每天09–23整点，缓冲10秒。

**Q3.** 2026-10-11 16:00，北京时间。

**Q4.** 有：PID52045，单个实际项目扫描实例。

**Q5.** 当前新实例15:07:20启动且仍运行；旧实例精确启动/退出UNKNOWN。

**Q6.** 不能确认一直未恢复；相反已证明15:07新启动。

**Q7.** 有：hourly_20261011_1600。

**Q8.** 独立控制台开始日志MISSING_RECORD；result.startedAt与HOURLY证明已开始。

**Q9.** 独立控制台完成日志MISSING_RECORD；finishedAt及History证明已完成。

**Q10.** 有，历史本轮741 Binance HTTP请求尝试，47真实Facts；本次审计请求0。

**Q11.** Universe924，原生Crypto518，实际深查47；账户请求448/完整445。

**Q12.** 47深查集合，40最终异常候选。

**Q13.** 47，全部数据完整性eligible。

**Q14.** 40逻辑调用，均请求异常；物理请求/重试总数UNKNOWN。

**Q15.** 0个有效批准；不是40个eligible=false。

**Q16.** 0。

**Q17.** 0通过/0失败：未进入V4。

**Q18.** 目标轮0。

**Q19.** 目标轮0。

**Q20.** 目标所有状态0；全库SENT181、SHADOW2，其他0。

**Q21.** 目标轮未尝试；HTTP/业务响应NOT_APPLICABLE。历史14:00分片25次errcode=0。

**Q22.** 不是，主要阻断是Judge请求失败；另7个无深查异常属正常前置淘汰。

**Q23.** 未发现本轮执行错误去重；最终去重分支未到达，资格没有被Judge有效确认。

**Q24.** 直接STORY_JUDGE_API_OR_TRANSPORT_FAILURE，底层ROOT_CAUSE_UNKNOWN；交付NO_DELIVERY_ROOT_CAUSE_CONFIRMED（直接链路）。

**Q25.** 先获取Provider侧真实失败诊断；当前扫描已运行无须重启。本轮不改代码/配置；若后续授权可补脱敏失败请求可观测性，不改核心合同。

## 逐候选终态

所有Facts：[data/runs/hourly_20261011_1600/facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1600/facts)；逐币种evaluations：[data/runs/hourly_20261011_1600/evaluations](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1600/evaluations)；历史比对与缺失字段：[validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/candidate-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_SCHEDULED_RUN_NO_DELIVERY_FORENSIC_V1/candidate-audit.json)。

| Symbol | Score | Candidate Types | Status | Reason |
|---|---:|---|---|---|
| ERAUSDT | 103.39 | PRICE_24H,OI_4H,FUNDING_EXTREME,FUNDING_CHANGE | JUDGE_FAILED | ERR_BAD_REQUEST |
| STRKUSDT | 70 | PRICE_24H,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| LUMIAUSDT | 158.82 | PRICE_24H,OI_4H,ACCOUNT_DISTRIBUTION_SHIFT,ACCOUNT_DOMINANCE_FLIP,TOP_ACCOUNT_DISTRIBUTION_SHIFT | JUDGE_FAILED | ERR_BAD_REQUEST |
| CFXUSDT | 100.41 | PRICE_24H,OI_4H,VOLUME_SPIKE,FUNDING_FLIP,TOP_POSITION_DISTRIBUTION_SHIFT | JUDGE_FAILED | ERR_BAD_REQUEST |
| MINAUSDT | 70.75 | FUNDING_EXTREME,FUNDING_CHANGE,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| USUSDT | 91.78 | PRICE_24H,ACCOUNT_DISTRIBUTION_SHIFT,ACCOUNT_DOMINANCE_FLIP,TOP_ACCOUNT_DISTRIBUTION_SHIFT | JUDGE_FAILED | ERR_BAD_REQUEST |
| WALUSDT | 26.61 | FUNDING_EXTREME | JUDGE_FAILED | ERR_BAD_REQUEST |
| JCTUSDT | 54.04 | PRICE_24H,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| LAUSDT | 32.14 | PRICE_24H,FUNDING_EXTREME | JUDGE_FAILED | ERR_BAD_REQUEST |
| AGTUSDT | 31.2 | PRICE_24H | JUDGE_FAILED | ERR_BAD_REQUEST |
| APRUSDT | 28.99 | PRICE_24H | JUDGE_FAILED | ERR_BAD_REQUEST |
| TIAUSDT | 28.73 | PRICE_24H | JUDGE_FAILED | ERR_BAD_REQUEST |
| ESPORTSUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| CHZUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| JASMYUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| ARKUSDT | 10 | FUNDING_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| TUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| AKTUSDT | 18.11 | VOLUME_SPIKE | JUDGE_FAILED | ERR_BAD_REQUEST |
| CETUSUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| CCUSDT | 50 | VOLUME_SPIKE | JUDGE_FAILED | ERR_BAD_REQUEST |
| BEAMXUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| ENSUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| ONUSDT | 14.7 | VOLUME_SPIKE | JUDGE_FAILED | ERR_BAD_REQUEST |
| AUSDT | 0 |  | NOT_NEWSWORTHY | NO_DEEP_ANOMALY |
| RLCUSDT | 34.86 | FUNDING_EXTREME,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| ONEUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| ARUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| INJUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| LDOUSDT | 30 | FUNDING_FLIP,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| QNTUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| MAGICUSDT | 70.87 | PRICE_24H,PRICE_1H,FUNDING_EXTREME,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| SEIUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| SUPERUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| PIXELUSDT | 10.58 | ACCOUNT_DISTRIBUTION_SHIFT | JUDGE_FAILED | ERR_BAD_REQUEST |
| POLUSDT | 34.31 | VOLUME_SPIKE,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| NEIROUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| GRASSUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| PENGUUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| ARCUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| KAITOUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| 2ZUSDT | 10 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| MONUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| METUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| GENIUSUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| CHIPUSDT | 58.16 | PRICE_24H,FUNDING_FLIP,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| ARXUSDT | 34.23 | PRICE_24H,ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
| OUSDT | 20 | ACCOUNT_DOMINANCE_FLIP | JUDGE_FAILED | ERR_BAD_REQUEST |
