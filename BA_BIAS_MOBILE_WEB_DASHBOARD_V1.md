# BA_BIAS_MOBILE_WEB_DASHBOARD_V1

**Final Verdict：WEB_DASHBOARD_V1_PARTIAL**。独立只读Dashboard已实现并通过本机真实数据/浏览器验证；Windows实机验收未执行，原有10项历史哈希断言仍失败，未改写旧基线来制造全通过。

## 1. Architecture Overview / Production Isolation

`npm run web`→Node原生HTTP→认证/只读Reader→已保存data→HTML/CSS/ESM。无新增运行依赖，无数据库、无React/Vue构建、无额外LLM。Web不导入main、Scanner、市场客户端、Selector执行函数、V4执行器或投递模块。Scanner仍`npm run scan`前台常驻，调度、价格/OI/Funding阈值、Top K、V4合同/Recovery、History与Outbox语义全部不变。未终止或启动生产Scanner，未连接Windows部署。

## 2. Existing Data Source Audit

审计依据src/main.js、config.js、market/opportunity-selector.js、scripts/selector-replay.js、market/scanner.js、facts-engine.js、storage/history.js、analysis/directional-history.js、structured-v4-production.js、intelligence/packet.js、storage/delivery-queue.js、scan-daemon.js、logging.js、package.json及真实文件。

| 审计问题 | 实际结果 |
|---|---|
| 数据目录 | config.dataDir默认data，可BA_DATA_DIR覆盖 |
| Run摘要 | data/runs/:runId/result.json，记录开始/结束/调度/截止、计数/错误/usage |
| 完整Selector排名 | main现有selection/:symbol.json全部decisions，已保存排名/分项/gate/实质变化/拒绝原因 |
| 未入选原因 | SELECTED、QUALIFIED_BUT_NOT_SELECTED、LOW_RESEARCH_VALUE、NO_MATERIAL_UPDATE、DUPLICATE、INSUFFICIENT_EVIDENCE等原状态 |
| V4完整研究 | runs/:runId/directional/:symbol.json及directional/:id.json，不覆盖快照 |
| Evidence追溯 | Facts.evidence及sources端点/params/dataTimes；V4 input.evidence支持previous window等 |
| Symbol历史 | run目录Facts/研究、History directionalSnapshots索引、Outbox directional snapshotId |
| Outbox | SHADOW/PENDING/SENDING/SENT/FAILED/UNKNOWN，独立parts/deliveryId与ack时间 |
| Token | V4 analystCost、deepseekUsage；缺usage为UNKNOWN，旧tokenUsage单列且不推算金额 |
| Scanner存活 | 既有run.lock+run.lease只在持锁阶段，不是常驻心跳；须额外验证真实命令身份 |
| Windows启动 | 用户确认服务器已运行；具体服务/PM2/任务计划机制没有证据，UNKNOWN。保留npm scan |
| HTTP/认证 | 原项目没有Web服务/框架/登录；现新增原生HTTP、scrypt+Cookie |
| 模块 | package.type=module，ESM，Node>=22 |

实际本地数据还包含20:00 Run，首页正常使用最新存储，而非硬编码19:00。没有将本机读取当作Windows服务器实时观察。

## 3. Dashboard Pages / UI Responsive Design

- `/`：真实进程状态、最近有效研究三币速览、最新运行Facts/Selector/V4/投递首要计数、展开漏斗与时间、完整研究卡片。旧研究与本轮不同则明确区分。
- `/selector`：Run选择/更多历史，所有真实合格排名（包括Top K之外），折叠未通过候选，原分项/strength/贡献/ID链接；不重算旧运行。
- `/symbol/:symbol`：同Run指标、V4方向/周期/强度/支持与竞争证据/重新评估/条件/替代情景、Evidence时间来源、原消息/真实分片、时间线、同口径两快照对比、真实离散点图。
- `/runs`与`/runs/:runId`：分页/筛选、调度/实际开始/结束/截止、漏斗、错误/候选终态、为什么没有消息、实际投递。
- `/system`：Web与Scanner独立状态、实例观察、锁租约更新时间、最近成功/当前Run、真实请求/物理请求/Recovery/Token/NO_EDGE与投递统计。

手机底部四导航，Symbol由卡片进入。滚动位置按路由恢复；暗色默认，可亮色切换；输入/导航触控至少44px；长字段换行，表格局部滚动；30秒刷新概览/系统，失败保留旧数据并显示读取时间。只保存主题到localStorage。

## 4. Selector Ranking Integration

生产已持久化完整决策，无需新增审计写入，无业务文件修改。读取原score/dimensions/rank/policy，包含全部合格与未入选/拒绝项。第4名以后（实际Top K以保存policy为准）表示未进入预算，不称没价值。历史稀有性仍UNKNOWN、贡献0，不等于已验证稀有。分数不是概率/胜率；无原排名则未记录。12/14/16点为旧Judge架构；19:00原排名BULLA 60.060606 #1、LUMIA 55.346667 #2、RLC 51.705808 #3。

## 5. Symbol Research Timeline / Run History

用真实Run时间排序，不依赖目录名偶然排序。有效V4同Symbol/同周期、前后数据时间明确才显示方向演化；NO_EDGE→其他方向仅研究变化，不声称确认趋势反转。LUMIA14点BULLISH→19点BEARISH来自存档，未用未来行情回填。分页之间若缺上下文则不伪造前次方向。比较价格/OI同窗口变化率的差为百分点，Funding已结算/展示分开，OI仅数量。

仅展示已保存确定性文本，实际发送以Outbox parts顺序为准；历史article可能不同于实际消息，已标注，不重新调用Renderer来改写历史。图表只画离散研究时点的1h价格变化，不连接为K线、不联网取行情、不生成胜率/MFE/MAE。

## 6. System Monitoring / Data Freshness

Windows固定Get-CimInstance脚本，匹配Node与项目绝对scan-daemon路径；相对路径只与本项目run.lock PID同时匹配才认定。不可靠/权限不足UNKNOWN，零匹配明确STOPPED，多实例DEGRADED，有进程但事实超过2h为STALE（该提示是数据年龄，不是交易时段故障推断）。Web可达只证明Web。

租约mtime仅标文件系统持锁心跳，等待时缺失正常，绝不用作事实截止。Windows时区不影响前端，Intl固定Asia/Shanghai。运行尚未完成显式IN_PROGRESS。系统展示部署启动机制UNKNOWN而不假设PM2/Service。

## 7. API Contracts / Authentication and Network Access

见API和Security报告。默认127.0.0.1，独立.web.env保存哈希，禁止无认证远程开放。登录/登出仅Web内存会话状态改变，业务全只读。VPN访问需明确私网配置且仍登录；公网仅已有受保护HTTPS反向代理。未开公网端口/防火墙/Windows Service。

## 8. Windows Compatibility / Performance

path.resolve/join、URL文件加载适配Windows，迁移记录内旧绝对路径被忽略。Windows运行命令为npm.cmd run web和web:doctor；doctor仅本地检查。缓存有界与single-flight，Run分页按需读取；查询/大文件/目录孤立记录有明确覆盖限制，见API。内存派生缓存不是历史唯一来源，不持生产写锁。

## 9. Tests / Screenshots / Existing Data Integrity

新增102/102通过；完整994项984通过10历史哈希断言失败，全部旧892保留，未弱化。JavaScript静态检查103/103。四Run真实回放全部匹配。Chrome真实渲染33张（另补最终首页截图），320/375/390/430与桌面无全局溢出，错误0、外部请求0。详见TESTS报告和validation/BA_BIAS_MOBILE_WEB_DASHBOARD_V1。

原有核心src、Facts/History/Outbox/.env前后哈希无变化，生产目录无新增文件。数据完整性证据production-integrity.json。只新增模块/文档/测试/验收文件，package.json仅新增Web命令，.gitignore仅保护独立凭据。

## 10. Files / Limitations / Deployment Steps

新增：src/web/{config,security,process,reader,server}.js；web/index.html、assets/{app.js,style.css}；scripts/dashboard-{doctor,password,replay,visual-check}.js；test/web-dashboard.test.js；.web.env.example；五份本任务Markdown报告；validation/BA_BIAS_MOBILE_WEB_DASHBOARD_V1验收结果与PNG。

修改：package.json新增web/web:doctor/web:password，.gitignore新增独立凭据忽略及示例例外。无既有业务src修改。旧测试自动写两个离线证明文件后会还原，旧测试文件/旧哈希清单不变。

限制：Windows实机和手机VPN连接未验证；相对Scanner入口等待时无法可靠识别→UNKNOWN；早期架构无生产Selector排名；大规模复杂查询有公开覆盖上限；金额成本没有定价记录→UNKNOWN；分页上下文不足时不标方向演化；单用户无多角色/2FA。

部署步骤见WINDOWS_DEPLOY，包含可复制PowerShell、本机/手机VPN/HTTPS、进程识别、关机及手动验收。没有自动推送本轮代码或部署服务器。由于Windows验收缺失、原有哈希测试失败，不能宣布COMPLETE或完全验收通过，可由用户按文档进行隔离单用户试运行。

## 11. 最终问题逐项回答

| 问题 | 已实现/实际证据 |
|---|---|
| Q1数据源 | run result、selection、Facts、saved directional、History只读索引、Outbox/parts |
| Q2Scanner核心 | 未改，前后字节一致 |
| Q3Selector评分 | 未改、不执行评分；只读保存分数 |
| Q4V4合同 | 未改Prompt/Schema/Validator/Recovery |
| Q5额外LLM | 0 |
| Q6完整排名持久化 | 新架构生产已有selection全部decisions；旧架构无 |
| Q7如何补审计 | 不需要额外写入，绝不回填旧排名 |
| Q8Top3外 | 可以，完整qualified rank与未入选原因 |
| Q9拒绝 | 可以，原status/reason/gate |
| Q10分项 | 可以，只取保存dimensions；缺则未记录 |
| Q11V4/Evidence | 可以，保存结构化合同+Facts+input；缺失显式 |
| Q12方向演化 | 可以，同Symbol/周期有效前后研究，真实LUMIA回放 |
| Q13历史Run | 可以，分页按记录时间 |
| Q14停止识别 | 可验证命令零匹配STOPPED，相对路径/权限不足UNKNOWN |
| Q15无事件vs失败 | 分开，noMessageReason按记录与计数，缺证据原因未确定 |
| Q16V4失败 | 可以，保存validation.errors/attempts.errors/failureReason |
| Q17Token | 真实usage，缺失null/UNKNOWN；不猜金额 |
| Q18投递 | 可以，原状态、ID、确认时间、实际parts |
| Q19业务副作用 | 无，102测试与生产哈希对比；Web模块不导入业务入口 |
| Q20Windows | 路径/命令适配与Mock测试；实机待验收 |
| Q21本机默认 | 是127.0.0.1 |
| Q22认证 | scrypt密码+8h内存会话/CSRF/限速 |
| Q23手机安全 | 用户配置VPN或已有HTTPS代理，均需登录 |
| Q24敏感泄露 | 白名单/过滤/凭据遮盖，无key/webhook/raw response日志；安全测试通过 |
| Q25 375px | 本机Chrome已实际渲染，无全局溢出 |
| Q26渲染 | 已实际Chrome，非Windows/真手机设备 |
| Q27历史区别 | LEGACY_RUN_NO_SELECTOR_RANKING vs DETERMINISTIC_SELECTOR_V1 |
| Q28分页缓存 | 已实现，有界/内存可重建/覆盖限制可见 |
| Q29生产完整 | 本轮开始前后原数据/.env/core无变化 |
| Q30全部测试 | 新102全过；原892中882过10旧完整性失败，完整984/994，未称全过 |
| Q31启动扫描 | 不会，独立Web入口 |
| Q32数据库 | 不需要 |
| Q33历史缺字段 | 旧ranking/components、部分time/usage/原文/Windows部署机制不可得→未记录/UNKNOWN |
| Q34离线 | 可读本地历史，不需要外部市场/model连接 |
| Q35单用户试运行 | 本机只读可运行；需用户完成Windows安全配置与实机验收，PARTIAL |
