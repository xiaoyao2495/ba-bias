# BA_BIAS_PREVIOUS_RESEARCH_FRESHNESS_FIX_V1

状态：PREVIOUS_RESEARCH_FRESHNESS_FIX_READY（保守摘要去重；不提供中断后新事件识别）。

审计及实现基点：f7b576aedcf7efca344f735412c241f5747d61af。仅Mac本地修改及离线验证，未提交、推送、部署或连接Windows。

## 原问题与调用链

main.js先以selectorStories(history,outbox)构造摘要基线并执行Selector；入选后调用previousResearch()。旧实现对最新VALIDATED研究无限期读取完整Research和Facts。当前executor/buildInput不消费previousFacts/materialEvidence；因此旧文件可在不参与新模型输入的情况下阻断当前研究。

实际调用者：src/main.js，及test/market-bias-v2-e2e.test.js；全仓检索未发现第二个生产调用者。旧版Web、Manifest完整性检查及崩溃恢复有独立读取合同，本轮不改这些消费者。

## 统一有效期合同

src/config.js:18：previousResearchFreshnessHours，读取可选PREVIOUS_RESEARCH_FRESHNESS_HOURS，默认48，正整数1–8760。无需新增环境变量即可采用默认值。本轮没有修改任何环境文件或生产环境。

src/analysis/historical-freshness.js:2：无IO纯函数，仅使用epoch毫秒。

- 当前时间：currentFacts.dataCutoff。
- Selector历史时间：previous.lastResearchTime。
- Research历史时间：索引factsAsOf。
- 0 < age <= 48h：WITHIN_FRESHNESS_WINDOW。
- age > 48h：EXPIRED_FOR_CURRENT_COMPARISON；48h+1ms已过期。
- age <= 0：INVALID_OR_NON_PRIOR_HISTORY。
- 缺失、非整数或无效时间：INSUFFICIENT_HISTORICAL_EVIDENCE。

不使用Date.now()、采集完成时间或运行完成时间判定历史年龄。

## Research读取

src/analysis/market-bias-v2/storage.js:9–25。

先校验该Symbol的VALIDATED索引元数据，再找cutoff之前最新的有效研究。UNAVAILABLE不参与选择。存在合法此前记录时仍按原规则选择；只有同刻/未来记录时返回明确非此前状态，不伪装无历史。

- 真正无VALIDATED索引：仍返回null；onDecision明确NO_HISTORY。
- 有效期内：保留完整Research读取、Schema及哈希验证、Facts字节SHA验证。补充核对Research自身runId/symbol/factsAsOf与索引一致。
- 过期：返回状态、历史RunId/recordId/时间，research=null、facts=null、previousFactsReadSkipped=true、integrity=NOT_REVALIDATED；零次旧Research/Facts正文读取。
- 结构或时间损坏：明确失败，不作为过期新机会。

返回值扩展已核对全部正式消费者。main拒绝非法或非此前状态；过期可以继续当前研究，但资格由Selector独立确认。saveResearch、Input/Research/Receipt格式和哈希算法未变。

## Selector与独立去重

src/market/opportunity-selector.js:36–57。

当前Facts验证、异常Gate、strength、分项权重、分数、排序、Top K均保留。materialEvidence()函数源码逐字不变。

有效期内保留旧comparison及去重行为。过期后：

1. 不删除摘要，不将历史改成NEW_STORY。
2. historicalBaseline保留来源、RunId、年龄、状态及ARCHIVED_EVENT_DEDUP_ONLY用途。
3. 继续用既有materialEvidence()规则做独立的归档事件去重，拒绝完全重复及阈值以内的微小漂移；storyKey不作为唯一判据。
4. 有既有规则确认的实质变化，才允许按原Gate与原分数竞争，storyType仍为MATERIAL_UPDATE，分项仍为MATERIAL_CHANGE，不获得EVENT_NOVELTY奖励。
5. 过期的comparison.previous=null，current为当前摘要；historicalContext只记录归档去重身份，不把旧摘要作为当前市场上下文。
6. 过期摘要缺少必要的原summary数值、包含无效类型或不能安全解释的嵌套结构，保守拒绝INSUFFICIENT_HISTORICAL_EVIDENCE。

这一做法保留原有实质变化标准；有效期本身不是放行条件。

## 两个历史来源及主链路诊断

src/main.js:164，179–186。Selector与Research使用同一个config值和纯时间判定，但分别保存来源和年龄。

- Selector：SELECTOR_BASELINE / OUTBOX_PROJECTION、runId、historicalFactsAsOf、ageMs、status、purpose、dedupDecision。
- Research：RESEARCH_INDEX、runId、recordId、historicalFactsAsOf、ageMs、status、previousFactsReadSkipped、integrity。

Selector诊断附在既有selection审计记录及run-diagnostics候选中；Research诊断附在候选v2.previousResearch。没有修改公开DTO，没有新增路径、凭据或模型事实字段，没有额外网络或磁盘历史扫描。

集成Fixture明确验证：Selector来源72小时前DIFFERENT_OUTBOX_RUN，Research来源192小时前OLD_RUN。二者没有被合并；旧正文均不存在时，仅在当前实质变化已获认可后继续Mock研究。

## 新旧行为

| 场景 | 原版 | 修复版 |
|---|---|---|
| 48h以内重复/微小漂移 | NO_MATERIAL_CHANGE | 不变 |
| 48h以内重大价格/OI/Funding变化 | 原Gate/评分/Top K | 不变 |
| 48h后完全重复/微小漂移 | NO_MATERIAL_CHANGE | 不变；标记归档去重 |
| 48h后实质变化 | 入选后读取久远Research/Facts | 资格及分数不变；跳过过期正文 |
| 7天旧Facts正常 | 读取并校验 | 在线不读取，NOT_REVALIDATED |
| 7天旧Facts缺失/损坏 | 若入选则读取失败 | 在线不读取；不会因此增加Selector资格 |
| 无历史 | Gate通过后NEW_STORY | 不变 |
| 同刻或未来Selector基线 | 无变化状态 | 明确INSUFFICIENT_EVIDENCE / INVALID_OR_NON_PRIOR_HISTORY |
| 同刻或未来Research且无此前记录 | null | 明确非此前状态，main在模型前拒绝 |
| 7旧重复+1新候选竞争Top5 | 仅新候选 | 不变 |

过期文件未读取时，无法在线判断其物理字节是否已损坏。NOT_REVALIDATED明确保留这一事实；完整性检查、恢复及归档审计仍必须执行，不能把“跳过”解释为“文件正常”。

## 验证

- 本轮修改前：1358项，1342通过、16失败、0取消。
- 专项：138/138通过。
- 定向：655项，653通过、2项既有失败、0取消。
- 静态：154/154通过。
- 完整：1496项，1480通过、同16项既有失败、0取消，新增失败0。
- 75份本地旧Facts只读回放：合格数、NO_MATERIAL_CHANGE、分数、入选及排名均一致；这些样本没有过期摘要，不冒充Windows生产效果。
- 七天小时回放：旧规则0次重复研究，直接48h TTL为3次，本修复0次。
- 8候选等分竞争：7个旧重复不入选，真正新候选入选；另测多分数与重大变化，排名与旧函数一致。
- 专项主链路Mock模型共11次（1次成功、10次预期失败），3个阻断主链路案例均0次；真实API与消息发送0次。

详见TEST_RESULTS.md、TEST_SUMMARY.json、REPLAY_RESULTS.json、INTEGRITY.json。

## 限制与未改变事项

只有历史摘要，无法可靠区分持续异常与中断后再次出现。没有新增事件状态机或宽松识别规则；无法证明实质变化的候选保守去重。

失败不推进成功基线，后续轮次仍可能重新占用名额；本轮不增加冷却、补位或重试策略。默认Top5不变。

48h比较限制不是档案有效期，不是旧Run删除授权。Web、Manifest、Receipt、History及恢复依赖继续保留。未清理任何磁盘文件，也未连接服务器；用户所述6GB生产数据未由本任务处理。
