# BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_20261011_1400

只读取保存的运行证据；不请求模型、市场或投递。用户已Ctrl+C，确认进程退出后完成展示修复；取证与隔离回放均已完成，未重启扫描。

## 完整样本边界

Run hourly_20261011_1400：49 Facts、42 Judge、19 Analyst，15成功、4失败；14正式输出中10有效、4失败。4/14不是完整Analyst失败率。按19份保存研判可统计4/19失败，仍不是所有候选的模型总体失败率。真实运行状态PARTIAL，另有23条Judge阶段ERR_BAD_REQUEST。

## 汇总

| Symbol | 物理请求计数 | Schema | Evidence | Structure | Recovery | 最终原因 |
|---|---:|---|---|---|---|---|
| POLUSDT | 2 | 两次通过 | 拒绝非法ID | 拒绝无依据引用 | 一次恢复，仍失败 | UNKNOWN_OR_FOREIGN_EVIDENCE + UNSUPPORTED_STRUCTURE |
| LAUSDT | 2 | 两次通过 | 拒绝非法ID | 拒绝无依据引用 | 一次恢复，仍失败 | UNKNOWN_OR_FOREIGN_EVIDENCE + UNSUPPORTED_STRUCTURE |
| IOSTUSDT | 1 | NOT_REACHED/MISSING_RECORD | NOT_REACHED | NOT_REACHED | 未执行 | API_OR_TRANSPORT_FAILURE: ERR_BAD_REQUEST；HTTP状态/正文UNKNOWN |
| INJUSDT | 1 | NOT_REACHED/MISSING_RECORD | NOT_REACHED | NOT_REACHED | 未执行 | API_OR_TRANSPORT_FAILURE: ERR_BAD_REQUEST；HTTP状态/正文UNKNOWN |

物理计数依据：result.deepseekUsage中21条V4逻辑请求记录，每条physicalRequests=1；19个Analyst记录的attempt总数为21，与之完整对账。成功记录provider回复/input/request哈希均匹配。统计的是HTTP transport尝试，不证明IOST/INJ请求曾被服务端接收或执行模型。

## POLUSDT

[data/runs/hourly_20261011_1400/directional/POLUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/directional/POLUSDT.json)；[data/runs/hourly_20261011_1400/facts/POLUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/facts/POLUSDT.json)；[data/outbox/hourly_20261011_1400_POLUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/outbox/hourly_20261011_1400_POLUSDT.json)。

### ATTEMPT_1

记录API尝试=true；provider响应=存在；JSON=True；Schema=True；Provenance=True；完整通过=False。

错误集合：`UNKNOWN_OR_FOREIGN_EVIDENCE, UNSUPPORTED_STRUCTURE`。

字段路径：`structureEvidenceIds[0] = INSUFFICIENT_STRUCTURE_DATA`。合法input.evidence及input.structures中均没有该ID；该标记可以作为conditionType的合法枚举，但不是Evidence ID。不是虚构具体支撑价格，也没有证据表明真实结构数据被遗漏。

各业务阶段：evidence=FAILED, mechanism=PASS_BY_COMPLETE_GUARD_ERROR_SET, direction=PASS_BY_COMPLETE_GUARD_ERROR_SET, structure=FAILED, condition=PASS_BY_COMPLETE_GUARD_ERROR_SET, reversal=NOT_APPLICABLE。阶段标记来自完整Guard的聚合错误集合，原记录没有单独逐阶段布尔日志；不要把未执行阶段写成通过。

原请求按冻结V4_SYSTEM、input、6000 maxTokens和recorded requestedModel重建，requestHash/inputHash/responseHash均一致。恢复system追加原始失败输出、完整errors、diagnostics；同一完整input包含合法IDs和structures=[]，无Evidence截断或改写证据。

### RECOVERY_1

记录API尝试=true；provider响应=存在；JSON=True；Schema=True；Provenance=True；完整通过=False。

错误集合：`UNKNOWN_OR_FOREIGN_EVIDENCE, UNSUPPORTED_STRUCTURE`。

字段路径：`structureEvidenceIds[0] = INSUFFICIENT_STRUCTURE_DATA`。合法input.evidence及input.structures中均没有该ID；该标记可以作为conditionType的合法枚举，但不是Evidence ID。不是虚构具体支撑价格，也没有证据表明真实结构数据被遗漏。

各业务阶段：evidence=FAILED, mechanism=PASS_BY_COMPLETE_GUARD_ERROR_SET, direction=PASS_BY_COMPLETE_GUARD_ERROR_SET, structure=FAILED, condition=PASS_BY_COMPLETE_GUARD_ERROR_SET, reversal=NOT_APPLICABLE。阶段标记来自完整Guard的聚合错误集合，原记录没有单独逐阶段布尔日志；不要把未执行阶段写成通过。

原请求按冻结V4_SYSTEM、input、6000 maxTokens和recorded requestedModel重建，requestHash/inputHash/responseHash均一致。恢复system追加原始失败输出、完整errors、diagnostics；同一完整input包含合法IDs和structures=[]，无Evidence截断或改写证据。

Input中排除funding.display和旧accounts.short是既有合同有意过滤：展示费率不作已结算事实，旧快照口径由完整多空序列替代。没有其他Facts Evidence ID遗漏。没有生产适配Bug证据；不修改核心Validator。失败Packet保留合法Facts，原Outbox为SENT，不改变任何投递状态。

## LAUSDT

[data/runs/hourly_20261011_1400/directional/LAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/directional/LAUSDT.json)；[data/runs/hourly_20261011_1400/facts/LAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/facts/LAUSDT.json)；[data/outbox/hourly_20261011_1400_LAUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/outbox/hourly_20261011_1400_LAUSDT.json)。

### ATTEMPT_1

记录API尝试=true；provider响应=存在；JSON=True；Schema=True；Provenance=True；完整通过=False。

错误集合：`UNKNOWN_OR_FOREIGN_EVIDENCE, UNSUPPORTED_STRUCTURE`。

字段路径：`structureEvidenceIds[0] = INSUFFICIENT_STRUCTURE_DATA`。合法input.evidence及input.structures中均没有该ID；该标记可以作为conditionType的合法枚举，但不是Evidence ID。不是虚构具体支撑价格，也没有证据表明真实结构数据被遗漏。

各业务阶段：evidence=FAILED, mechanism=PASS_BY_COMPLETE_GUARD_ERROR_SET, direction=PASS_BY_COMPLETE_GUARD_ERROR_SET, structure=FAILED, condition=PASS_BY_COMPLETE_GUARD_ERROR_SET, reversal=NOT_APPLICABLE。阶段标记来自完整Guard的聚合错误集合，原记录没有单独逐阶段布尔日志；不要把未执行阶段写成通过。

原请求按冻结V4_SYSTEM、input、6000 maxTokens和recorded requestedModel重建，requestHash/inputHash/responseHash均一致。恢复system追加原始失败输出、完整errors、diagnostics；同一完整input包含合法IDs和structures=[]，无Evidence截断或改写证据。

### RECOVERY_1

记录API尝试=true；provider响应=存在；JSON=True；Schema=True；Provenance=True；完整通过=False。

错误集合：`UNKNOWN_OR_FOREIGN_EVIDENCE, UNSUPPORTED_STRUCTURE`。

字段路径：`structureEvidenceIds[0] = INSUFFICIENT_STRUCTURE_DATA`。合法input.evidence及input.structures中均没有该ID；该标记可以作为conditionType的合法枚举，但不是Evidence ID。不是虚构具体支撑价格，也没有证据表明真实结构数据被遗漏。

各业务阶段：evidence=FAILED, mechanism=PASS_BY_COMPLETE_GUARD_ERROR_SET, direction=PASS_BY_COMPLETE_GUARD_ERROR_SET, structure=FAILED, condition=PASS_BY_COMPLETE_GUARD_ERROR_SET, reversal=NOT_APPLICABLE。阶段标记来自完整Guard的聚合错误集合，原记录没有单独逐阶段布尔日志；不要把未执行阶段写成通过。

原请求按冻结V4_SYSTEM、input、6000 maxTokens和recorded requestedModel重建，requestHash/inputHash/responseHash均一致。恢复system追加原始失败输出、完整errors、diagnostics；同一完整input包含合法IDs和structures=[]，无Evidence截断或改写证据。

Input中排除funding.display和旧accounts.short是既有合同有意过滤：展示费率不作已结算事实，旧快照口径由完整多空序列替代。没有其他Facts Evidence ID遗漏。没有生产适配Bug证据；不修改核心Validator。失败Packet保留合法Facts，原Outbox为SENT，不改变任何投递状态。

## IOSTUSDT

[data/runs/hourly_20261011_1400/directional/IOSTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/directional/IOSTUSDT.json)；[data/runs/hourly_20261011_1400/facts/IOSTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/facts/IOSTUSDT.json)；[data/outbox/hourly_20261011_1400_IOSTUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/outbox/hourly_20261011_1400_IOSTUSDT.json)。

### ATTEMPT_1

记录API尝试=true；provider响应=MISSING_RECORD；JSON=MISSING_RECORD；Schema=MISSING_RECORD；Provenance=MISSING_RECORD；完整通过=False。

错误集合：`ERR_BAD_REQUEST`。

各业务阶段：evidence=NOT_REACHED_OR_MISSING_RECORD, mechanism=NOT_REACHED_OR_MISSING_RECORD, direction=NOT_REACHED_OR_MISSING_RECORD, structure=NOT_REACHED_OR_MISSING_RECORD, condition=NOT_REACHED_OR_MISSING_RECORD。阶段标记来自完整Guard的聚合错误集合，原记录没有单独逐阶段布尔日志；不要把未执行阶段写成通过。

只有attempt.error=ERR_BAD_REQUEST，无rawResponse、Schema、Envelope、服务端错误体、HTTP status和该请求时间记录。调用在adapter.receive异常路径终止，核心Guard未获得业务输出，未触发第二次生成恢复。具体拒绝原因（额度、参数、限流等）一律UNKNOWN。

Input中排除funding.display和旧accounts.short是既有合同有意过滤：展示费率不作已结算事实，旧快照口径由完整多空序列替代。没有其他Facts Evidence ID遗漏。没有生产适配Bug证据；不修改核心Validator。失败Packet保留合法Facts，原Outbox为SENT，不改变任何投递状态。

## INJUSDT

[data/runs/hourly_20261011_1400/directional/INJUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/directional/INJUSDT.json)；[data/runs/hourly_20261011_1400/facts/INJUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261011_1400/facts/INJUSDT.json)；[data/outbox/hourly_20261011_1400_INJUSDT.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/outbox/hourly_20261011_1400_INJUSDT.json)。

### ATTEMPT_1

记录API尝试=true；provider响应=MISSING_RECORD；JSON=MISSING_RECORD；Schema=MISSING_RECORD；Provenance=MISSING_RECORD；完整通过=False。

错误集合：`ERR_BAD_REQUEST`。

各业务阶段：evidence=NOT_REACHED_OR_MISSING_RECORD, mechanism=NOT_REACHED_OR_MISSING_RECORD, direction=NOT_REACHED_OR_MISSING_RECORD, structure=NOT_REACHED_OR_MISSING_RECORD, condition=NOT_REACHED_OR_MISSING_RECORD。阶段标记来自完整Guard的聚合错误集合，原记录没有单独逐阶段布尔日志；不要把未执行阶段写成通过。

只有attempt.error=ERR_BAD_REQUEST，无rawResponse、Schema、Envelope、服务端错误体、HTTP status和该请求时间记录。调用在adapter.receive异常路径终止，核心Guard未获得业务输出，未触发第二次生成恢复。具体拒绝原因（额度、参数、限流等）一律UNKNOWN。

Input中排除funding.display和旧accounts.short是既有合同有意过滤：展示费率不作已结算事实，旧快照口径由完整多空序列替代。没有其他Facts Evidence ID遗漏。没有生产适配Bug证据；不修改核心Validator。失败Packet保留合法Facts，原Outbox为SENT，不改变任何投递状态。

## 横向归因

POL/LA属于重复模型合同生成错误，和12:00 CHIP同类：把非Evidence枚举放入structureEvidenceIds；两次完整Guard正确拒绝。IOST/INJ属于调用失败，不是已证实的模型业务生成错误，不存在模型响应可供判定。四者没有共同Validator错误码；共同最终FAILED不等于共同根因。后期Judge也出现23条ERR_BAD_REQUEST，是跨Analyst/Judge的提供者调用失败模式；缺HTTP状态与错误体不能继续归因。

原Schema允许合法非结构条件INSUFFICIENT_STRUCTURE_DATA/ABSTRACT_REASSESSMENT，不强迫生成支撑阻力；成功对照STRK/CHIP结构引用为空、使用合法PROGRAM_RULE/ABSTRACT_REASSESSMENT。没有本组证据支持Validator误拒或事实错误放行；不是全局安全证明。模型生成质量仍有独立待解决问题，本轮不改Prompt/Schema/Validator、不补真实请求。

## 证据与缺失

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/failure-audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/failure-audit.json)。成功样本真实API回复、JSON、Schema、聚合验证错误、Snapshot、Packet、parts均存在；没有单独完整HTTP request文件，但成功请求hash可重建验证。deepseek-calls.json是Judge记录，不能冒充Analyst原响应。IOST/INJ的服务端错误详情缺失，明确MISSING_RECORD。
