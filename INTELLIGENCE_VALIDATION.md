# BA-BIAS 无业务配额情报输出验收

日期：2026-10-10。最终 `npm test`：91项，91通过，0失败、0取消；约2.05秒。全部使用合成 TEST FIXTURE、Mock API/Clock 和临时目录，没有真实扫描、DeepSeek调用、钉钉发送或常驻服务启动。

## 取消的限制

- 删除 config.maxPerRun=2、config.maxPerDay=30。
- 删除每日配额判断、remaining及达到配额后break。
- 删除 config.maxLlm/BA_MAX_LLM及前6名切片：所有本轮有效深查候选均逐一Judge，不因前面候选通过而停止。
- dailyCount/history.daily保留为统计函数和生成/确认发送计数，没有参与准入或停止判断。
- 没有改为100/999等更大配额，也没有新增推送选择数量限制。
- 保留原扫描探测预算（默认24个深查候选）、请求并发/权重限制、扫描3分钟、整轮15分钟、LLM60秒、重叠保护与运行锁。这些是工程预算；不是输出配额。

## 研究与情报

`src/main.js` 的 runResearch 遍历全部扫描后有效Facts，不再截断。每个候选保存 evaluations/<symbol>.json和运行摘要candidateEvaluations，包含原始Judge结果、终态、原因和输出位置。终态包含ELIGIBLE、MATERIAL_UPDATE、DUPLICATE、NOT_NEWSWORTHY、INSUFFICIENT_EVIDENCE、JUDGE_FAILED、DATA_ERROR；未完成评估明确记NOT_EVALUATED及扫描预算/中断/崩溃原因，不记为不值得报道。

扫描器只新增researchCandidates记录，筛选/排序/检测阈值不变。完成各候选后更新评估检查点；崩溃恢复保留已完成终态与已持久化输出，识别尚未完成项，同小时不自动重跑。

新增 src/intelligence/packet.js：从已有官方API原始响应重新构建Facts，核对Crypto身份、核心数据完整性、异常与Judge证据，采用原Claim Guard再检查程序证据占位符。情报包含价格、OI多周期、Funding结算与变化、成交量、账户统计、WHAT_CHANGED/NEW_EVIDENCE/WHY_MATERIAL、时间来源与未确认事项。没有权威项目全名来源时明确标为未核实。Judge原因与storyAngle留在评估档案，模型因果叙述不会作为确定事实发送。

Writer保留但改为显式 `npm run once -- --write-drafts` 可选。原Writer、Story Judge、Facts Engine和Claim Guard文件保持相同SHA256，新闻价值阈值仍65，事实阈值不降低。可选文章质量失败仅记 optionalDraft，不阻止已合格事实情报。

## 去重与投递

- 每条情报独立deliveryId。全部合格情报先持久化到Outbox，再发送，不因前一条网络失败丢失后续情报。
- 保留实质更新规则；历史比较增加已验证OI 1h/24h变化，沿用10个百分点实质变化尺度。微小变化仍为DUPLICATE，MATERIAL_UPDATE可再次输出。
- 真实发送比较已发送/结果不明历史及新版已预留队列，防止生成额外重试副本。dry-run档案不会压掉首次真实通知；通知内容取未来本轮新事实，队列不重放旧版文章或SHADOW。
- 新增 src/storage/delivery-queue.js；UTF-8无损分片≤1800字节，每片保留关键词、symbol、父deliveryId及分片序号；内容和状态均先落盘。每片分别确认，整条全部分片SENT才记情报SENT。
- 请求间隔至少3.5秒，节奏及冷却时间保存到state/dingtalk-rate.json。HTTP429/明确业务频率拒绝保留PENDING，至少冷却10分钟，尊重更长Retry-After。每分片明确临时失败最多5次尝试；永久失败保留FAILED。
- SENT分片不重复发送；超时或崩溃留下SENDING恢复为UNKNOWN，整体UNKNOWN不盲目重发，剩余完整内容仍保存。
- npm run scan前台每5秒检查明确启用的新情报队列；每次队列处理有2分钟工程预算，余下PENDING继续保留并可跨重启恢复。研究优先，整点取消并等待队列释放共享锁；SIGINT/SIGTERM同时等待研究/队列持久化退出。
- 没有合格情报时不发送状态消息；此前合法待发送队列可继续处理。发送错误不会修改Facts或退出常驻扫描器。

## 关键Mock验收

1. 3个合格候选全部输出且确认通知。
2. 7个合格候选全部Judge、全部输出，包括第7个KAIA。
3. 19个候选全部Judge，其中7个合格全部输出，12个明确NOT_NEWSWORTHY。
4. 同一天两轮各19条，共38条实际Mock生成并确认通知；超过旧每日30条不停止。
5. 当天已有31条记录时，新7条仍全部输出，独立生成/发送统计达到38。
6. 重复故事明确DUPLICATE且不再次通知；实质变化保存MATERIAL_UPDATE及历史比较，使用新deliveryId通知。
7. 所有Judge不合格时0通知；单个Judge失败不跳过后续候选；Facts不完整明确INSUFFICIENT_EVIDENCE。
8. 单条钉钉业务失败，后续2条仍SENT；HTTP200非零业务码不误记成功。
9. 长Unicode情报无损分片，字节预算合格；已确认分片跨重启不重发。
10. HTTP429/业务频率拒绝持久化PENDING与冷却；重启后续发；UNKNOWN不重发；临时失败总尝试有限，耗尽后保留FAILED。
11. 运行锁、并发队列争用、崩溃/中断恢复、SIGINT/SIGTERM、研究优先和未评估原因均通过。
12. 原Facts、数值/窗口、Funding方向、Crypto过滤、Claim Guard、API并发/重试测试继续通过；旧配额测试已改为无配额验收。

## 文件与运行方式

新增：src/intelligence/packet.js、src/storage/delivery-queue.js、INTELLIGENCE_VALIDATION.md。

修改：src/main.js、src/config.js、src/market/scanner.js、src/storage/history.js、src/storage/delivery.js、src/clients/dingtalk.js、src/scan-daemon.js、test/core.test.js、test/hourly.test.js、.env.example、README.md；HOURLY_VALIDATION.md只补充历史版本说明。

现有 npm run scan / node src/scan-daemon.js仍进入前台常驻，Asia/Shanghai每日09–23点，整点延迟10秒研究。未来本轮全部合格新情报都进入持久化投递流程；按Ctrl+C受控退出。没有安装PM2、后台服务或交易/自动发帖能力。

.env未覆盖，SHA256仍为8e56336d9f7d53c0b6ebe0da25709b37a213a86fe07463c065a946cfd0ad4adf。旧ict-market-context与AI Pro Cron未修改。历史live_v1_verified_20261010没有重新扫描、调用模型或补发。
