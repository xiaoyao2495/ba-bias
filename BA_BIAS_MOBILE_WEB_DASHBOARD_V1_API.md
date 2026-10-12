# Dashboard V1 · API 合同

所有业务API只读、需要Cookie认证，返回JSON和`servedAt`（读取时间，不是行情时间）。默认127.0.0.1:8787；配置Origin必须匹配请求Host。无CORS通配，无生产数据静态目录。

| 方法/路径 | 内容 |
|---|---|
| POST /api/login | `{password}`，JSON且同Origin；返回CSRF随机值并设置HttpOnly会话Cookie |
| GET /api/session | 会话是否有效、CSRF、expiresAt |
| POST /api/logout | 同Origin与`X-CSRF-Token`；撤销当前会话，唯一状态变更是Web会话 |
| GET /api/health | Web/Scanner状态、进程观察依据、最新Run、最近成功、租约时间及数据过期 |
| GET /api/overview | latest运行摘要、researchRun最近有效研究、最多3张真实卡片，二者分开 |
| GET /api/runs | page/limit、q、status、symbol、notification=yes/no、v4=failed/valid、delivery、from/to（含时区ISO） |
| GET /api/runs/:runId | 原始摘要字段、各阶段计数、选择决策、成本、投递列表、无消息解释 |
| GET /api/selector?runId=... | 所有已保存Selector决策、rank、score、dimensions、gate、reason、rarity及实际policy |
| GET /api/symbols/:symbol | page/limit分页研究快照与同周期方向演化 |
| GET /api/symbols/:symbol?runId=... | 单轮Facts指标、V4、Evidence、来源与时间、完整保存文字和实际投递分片 |
| GET /api/system | health、最近Run、V4有效/失败/NO_EDGE、真实usage、Outbox状态与确认时间 |

`limit`1–50，Symbol时间线最多20节点/页，默认前端10；page1–10000。RunId为1–100个字母数字下划线连字符。Symbol允许Unicode字母/数字+USDT，长度受限。400参数/Origin/Host错误；401未认证；403跨站/CSRF；404无记录；405禁止业务写操作；413请求体过大；422损坏/不兼容/身份时间不一致；429限速；500只返回WEB_READ_ERROR，不泄露磁盘路径或堆栈。

## 数据合同

- Facts仅识别`BA_BIAS_FACTS_V1`；严格检查runId、symbol、dataCutoff与所属result一致。
- 单个V4状态只使用保存的V4 VALIDATED、合法枚举、同Symbol/时间；失败为ANALYST_UNAVAILABLE，不替代为NO_EDGE。
- 方向枚举是BULLISH、BEARISH、BULLISH_REVERSAL、BEARISH_REVERSAL、NO_EDGE；中文展示不新建预测枚举。
- NO_EDGE消费者不展示方向失效，已存重新评估条件保留；不改原记录。
- Evidence来自Facts及已保存V4 input，不从文章关键词推断关系。支持/竞争按原ID列表关联。
- 单个Selector分数只取生产`selection`记录；不重新计算。旧Run缺失ranking、dimensions即显式未记录，nullable值不填0。
- Outbox状态包括SHADOW、PENDING、SENDING、SENT、FAILED、UNKNOWN；SENDING可能处于在途，不等于已成功。SENT不是阅读回执。
- Token新合同KNOWN才显示真实值；缺失保留null/UNKNOWN。旧tokenUsage单列legacyRecordedUsage，无定价记录不估算金额。
- `dataCutoff`是事实截止；`servedAt`是Web读取时间；租约mtime只作为文件系统心跳，绝不冒充事实截止。
- 对比价格/OI同定义窗口指标时差值为百分点，不是两个Run之间实际涨跌；Funding已结算/展示分开；OI用数量，非名义价值。

## 一致性与有界查询

原子写入正式`.json`优先；不读取`.tmp`。前后stat发生变化返回SNAPSHOT_CHANGING，损坏JSON关闭该记录。未finished或RUNNING显式IN_PROGRESS，不声称完成。详情关联同Run，不把最新运行与上次有效卡片拼为本轮。

单文件≤16MiB；cache最多500 JSON项、500目录项，TTL10秒，JSON与Run索引single-flight；System汇总30秒、进程15秒。索引优先history.runs，孤立未入索引Run最多100个并返回unindexedBeyondLimit；不会每次请求解析所有Facts。Run分页只解析当前页详情。Symbol/v4/delivery深度过滤最多检查最近100个匹配Run，返回filterPartial并在UI标注。Symbol档案查最近500轮目录，分页按需读节点，超出返回PARTIAL_RECENT_500_RUNS。Selector/单Run Outbox最多1500条；System Outbox汇总最多1000条并标覆盖。

缓存是可重建内存派生结果，HTTP无共享缓存。数据根目录之外及符号链接逃逸拒绝。历史绝对factsPath/outboxPath不作为读取路径。服务无写History/Outbox/Facts接口，不导入任何业务Scanner或网络客户端。
