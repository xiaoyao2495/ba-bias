# BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1_TESTS

V4_PROVENANCE_CONTRACT_READY；新增42项；632/632全量通过；74/74静态检查。实际外部调用0。

## 实际执行链路矩阵

下表是实际executor产生的结果，不是只验证枚举。每条来源关联有私有Mock签收receipt，原业务JSON/原raw保存在resultPath；均SYNTHETIC_OR_CONVERTED、NOT_PRODUCTION、POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。

| 名称 | 输入Facts | 调用上下文 | 业务来源字段 | 预期/实际来源 | Envelope/业务Schema | Provenance/Analysis | Renderer标签 | 伪造/错误处理 | 副作用 |
|---|---|---|---|---|---|---|---|---|---|
| historical synthetic compatibility CAPUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility KAIAUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/KAIAUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility XPLUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1300/facts/XPLUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility BATUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/BATUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility MINAUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MINAUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility XLMUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/XLMUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility OGNUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/OGNUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility MAGICUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/MAGICUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility INJUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/INJUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| historical synthetic compatibility RAYSOLUSDT | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/RAYSOLUSDT.json) | MOCK request/receipt | SYNTHETIC_OR_CONVERTED | synthetic/synthetic | True/True | True/True | SYNTHETIC_OR_CONVERTED | 合法 | 0 |
| business self claims LIVE | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | LIVE_MODEL_RESPONSE | synthetic/synthetic | True/False | True/False | NO_VALID_RENDER | V4_SCHEMA_INVALID, BUSINESS_PROVENANCE_CONFLICT | 0 |
| foreign Evidence | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | ABSENT | synthetic/synthetic | True/True | True/False | NO_VALID_RENDER | UNKNOWN_OR_FOREIGN_EVIDENCE | 0 |
| undefined range | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | ABSENT | synthetic/synthetic | True/True | True/False | NO_VALID_RENDER | UNKNOWN_OR_FOREIGN_EVIDENCE, UNSUPPORTED_STRUCTURE | 0 |
| wrong reversal | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | ABSENT | synthetic/synthetic | True/True | True/False | NO_VALID_RENDER | PRIOR_AND_CURRENT_TURN_REQUIRED, COUNTER_MOVE_BASIS_REQUIRED | 0 |
| wrong mechanism | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | ABSENT | synthetic/synthetic | True/True | True/False | NO_VALID_RENDER | MECHANISM_SIGN_MISMATCH | 0 |
| invented numeric target | [原Facts](/Users/yaodebao/Desktop/git/ict03/ba-bias/data/runs/hourly_20261010_1200/facts/CAPUSDT.json) | MOCK request/receipt | ABSENT | synthetic/synthetic | True/False | True/False | NO_VALID_RENDER | V4_SCHEMA_INVALID | 0 |

完整逐案例记录：[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/offline-chain.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/offline-chain.json)，包含每条独立保存文件路径和物理调用数。

## 来源反例与LIVE测试范围

LIVE Envelope可以通过结构Schema，但离线手造/复制对象没有私有receipt，Guard明确拒绝。LIVE客户端构造不联网且拒绝注入Mock；其确定性标签函数可离线检查。没有通过Mock制造一条“可信LIVE”记录来冒充真实API。当前实际网络签收尚未验证，标记NOT_EXECUTED。Mock与真实调用路径共用签收函数及同一完整Guard；源码证明只在私有网络分支可生成LIVE，非来源字符串授权。

## 42项新增测试名称

- PASS — provenance complete mock executor follows input/client/envelope/guard/renderer
- PASS — provenance LIVE envelope is structurally expressible but arbitrary JSON remains untrusted
- PASS — provenance live label format branch is accurate without minting fake live receipt
- PASS — provenance live transport cannot accept injected Mock clients
- PASS — provenance owned live adapter construction performs no API request
- PASS — provenance model cannot self-declare live via source
- PASS — provenance model cannot self-declare live via sourceType
- PASS — provenance model cannot self-declare live via provenance
- PASS — provenance local legacy JSON adding LIVE is rejected
- PASS — provenance serialized envelope cannot preserve process receipt capability
- PASS — provenance unknown legacy enum rejected
- PASS — provenance missing legacy metadata rejected instead of defaulting live
- PASS — provenance trace ID is generated by runner and links request to signed-in-process response
- PASS — provenance missing server response ID remains null, local UUID not mislabeled server ID
- PASS — provenance model identity mismatch fails independently from valid business JSON
- PASS — provenance archived legacy synthetic business field is removed only as audited compatibility metadata
- PASS — provenance request ID mutation cannot borrow original receipt
- PASS — provenance receipt cannot be replayed against another Facts input
- PASS — provenance receipt envelope is immutable
- PASS — provenance cannot bypass original full business rejection: foreign Evidence
- PASS — provenance cannot bypass original full business rejection: undefined lower range
- PASS — provenance cannot bypass original full business rejection: undefined upper range
- PASS — provenance cannot bypass original full business rejection: wrong reversal
- PASS — provenance cannot bypass original full business rejection: wrong mechanism
- PASS — provenance cannot bypass original full business rejection: invented cause
- PASS — provenance cannot bypass original full business rejection: Funding guarantees rise
- PASS — provenance cannot bypass original full business rejection: account position confusion
- PASS — provenance cannot bypass original full business rejection: invented threshold
- PASS — provenance cannot bypass original full business rejection: illegal numeric prose
- PASS — provenance cannot bypass original full business rejection: wrong window
- PASS — provenance original historical time not replaced by response timestamp
- PASS — provenance legacy and mock envelope deterministic market rendering remains byte-identical
- PASS — provenance errors remain FAILED with original direction instead of fallback NO_EDGE
- PASS — provenance malformed response counted mock only, not forced NO_EDGE
- PASS — provenance Mock cannot convert historical raw response into live evidence
- PASS — provenance tracked request budget cannot silently retry past limit
- PASS — provenance Mock failure records sanitized error without internal automatic retry
- PASS — provenance isolated storage preserves response and refuses overwrite
- PASS — provenance result storage cannot write production or follow symlink
- PASS — provenance receipt and records never include client secret headers or environment
- PASS — provenance prevents concurrent calls from swapping request/response receipts
- PASS — provenance legacy synthetic authenticity is independent of an invalid business Schema

真实入口 [test/structured-v4-provenance.test.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-provenance.test.js)；[scripts/structured-v4-provenance-offline.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/scripts/structured-v4-provenance-offline.js)。

## 历史/事实安全及隔离

199旧响应正式结果无变化，18冻结例维持，10旧合成渲染逐字一致。Guard业务函数体仅函数名/Schema变量名改变后逐字等价；未重写市场分析规则。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/replay.json)；[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/offline-chain.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/offline-chain.json)

生产data 2103文件无新增/变化，.env/History/Outbox/投递状态/V3快照不变。42测试含拒绝数据路径、符号链接、覆盖及不重复请求/并发串用防护。[validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PROVENANCE_CONTRACT_FIX_V1/final-integrity.json)
