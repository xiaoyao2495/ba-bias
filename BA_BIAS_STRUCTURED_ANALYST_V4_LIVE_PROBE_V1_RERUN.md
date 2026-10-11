# BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN

## 1. Executive Summary

**V4_PROBE_PASSED**，仅代表本次隔离生成合同与事实安全实验通过。5+5共10独立历史事件、11次真实DeepSeek请求、API失败0。首次Schema10/10、首次完整9/10、一次受控恢复后最终10/10。所有结果为POST_COLLECTION_HISTORICAL_RESEARCH、causalBacktestEligible=false。预测价值仍UNCERTAIN，未上线或启动Shadow。

[summary.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/summary.json)；[request_ledger.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/request_ledger.json)。

## 2. Frozen Contract Manifest

冻结时间2026-10-10T20:53:54.615Z，实际模型deepseek-flash，temperature=0、thinking disabled、max_tokens=6000、json_object、网络重试0、并发1、超时60000ms。Node=v23.11.0，Git commit=null（目录不是Git仓库）。首次真实调用2026-10-10T20:54:08.363Z，末次响应2026-10-10T20:54:36.028Z。现有V4没有存储的生成/恢复Prompt，executor通过system入参接收提示；本轮新增独立初始调用模板与固定恢复模板，首次调用前冻结，未改任何既存核心Prompt/Schema/Guard/Renderer。恢复只在固定模板后附上前次原始输出与完整错误。

```json
{
  "prompt": {
    "version": "V4_ISOLATED_INITIAL_INVOCATION_V1",
    "sha256": "19e4a75cbabbc99f86f369a9af64b8ee6d8b8f1a823fd9928b1f5a8d1acb69fe"
  },
  "recoveryPrompt": {
    "version": "V4_CONTROLLED_CONTRACT_RECOVERY_V1",
    "sha256": "5a0ef7f5950a5e9372223968697f2a302473fbc535c900b753b27cea01008299"
  },
  "schema": {
    "version": "STRUCTURED_ANALYST_V4_EXPERIMENT",
    "sha256": "bafb56ce0f5385f36a6103b81936738bac9d479051acf4e4b5ee538ae09ca441"
  },
  "provenanceVersion": "V4_PROVENANCE_ENVELOPE_V1",
  "coreHashes": {
    "src/analysis/experimental/structured-v4-schema.js": "8914a7b2d86220240663d3bfd40b19dce2f3334f6a4c776a491c82f9287c17a7",
    "src/analysis/experimental/structured-v4-input.js": "a3750f823d75f7e1c46dd9878805d416ce3c6530df36959a5368cae441ccca94",
    "src/analysis/experimental/structured-v4-guard.js": "11079c691dcb2a1b31b53a56e409c33978bb8341ec589a6146a17a383942822b",
    "src/analysis/experimental/structured-v4-renderer.js": "5c8ccb9c24e305c4f07e1ea69b0dd1a1b86afce7d80a21368b186848d15861c1",
    "src/analysis/experimental/structured-v4-provenance.js": "0f1605e51478e9e7e56e3004a48f4d2920bfec7d230886e01982be46a34448b7",
    "src/analysis/experimental/structured-v4-executor.js": "af740756f1994cb96b720565743680a782fa573aa54235db3278996bb389514c"
  },
  "budget": {
    "samples": 10,
    "perSample": 3,
    "recoveriesPerSample": 2,
    "physicalRequests": 30
  }
}
```

所有src/scripts/test及客户端/config哈希保存在[contract_manifest.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/contract_manifest.json)；实验中保持一致。

## 3. Provenance Network Verification

11/11实际响应由createLiveV4Adapter内部DeepSeek+Http接收，内存receipt绑定同一请求输入与原响应；先完整Guard/Renderer，再序列化。11个独立本地UUID明确标记LOCAL_TRACKING_ID；raw.id仅serverResponseId，不冒充服务端HTTP认证requestId。11/11请求哈希、输入哈希、原响应哈希、sample关联、模型匹配通过独立核对。来源provenanceValid和业务analysisValid分别保存：PIXEL首次来源真而分析假。模型没有自报来源。

API状态SUCCESS_RESPONSE_RETURNED；现有Http只返回r.data，不保留精确HTTP状态码与服务端请求头，所以httpStatus=UNKNOWN_CLIENT_DOES_NOT_EXPOSE_STATUS、serverRequestId=null，不能编造200或认证标识。归档JSON不能重新获得WeakMap能力，仅保存原验证记录，若回放需重建输入且不得当作新的LIVE签收。[request_binding_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/request_binding_audit.json)。

## 4. Selected Historical Samples

上一轮selected=[]，因此没有可复用的冻结真实样本。读取396份保存Facts：264进入安全候选池，排除85份NO_DEEP_ANOMALY、34份IDENTITY_NOT_VERIFIED、3份INSUFFICIENT_EVIDENCE、10个以前V4 Spike事件。按原始4h价格/OI、Funding、账户变化、回撤、跨周期冲突、前后转向、低位移依次稳定排序选样；10场景全部覆盖，没有预设答案，也没有按后来市场或本轮模型输出换样。场景覆盖不要求模型选择该周期。

| Batch | Symbol | Run | 首次完整 | 最终状态 | 方向 / horizon / conviction | 请求数 |
|---|---|---|---|---|---|---|
| A | PIXELUSDT | hourly_20261010_1200 | FAIL | RECOVERY_1_VALID | BEARISH_REVERSAL / 1h / LOW | 2 |
| A | SENTUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| A | JCTUSDT | hourly_20261010_1400 | PASS | FIRST_PASS_VALID | BULLISH / 1h / LOW | 1 |
| A | USUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| A | RLCUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| B | MINAUSDT | hourly_20261010_1300 | PASS | FIRST_PASS_VALID | BULLISH / 1h / MODERATE | 1 |
| B | BRUSDT | hourly_20261010_1300 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| B | ZKUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |
| B | XAIUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BULLISH / 1h / HIGH | 1 |
| B | XMRUSDT | hourly_20261010_1200 | PASS | FIRST_PASS_VALID | BEARISH / 1h / LOW | 1 |

[selected_samples.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/selected_samples.json)包含完整路径、SHA、理由和时间审计。

## 5. Historical Time Semantics

原始evaluationTime及originalEvaluationTime不变；collectionCompletedAt使用原sources各retrievedAt最大值，各样本已记录；首次可用时间仍UNKNOWN。researchExecutedAt为每次实际请求开始时间。原始hour/five各含一个未收盘未来结束边界，现有closedKlines隔离，未进入任何retained Evidence。无截止之后ticker快照被选用，所有输入dataTimes<=原截止。后采集与后发生市场事实分别处理，未用采集完成时间制造因果资格。不读取结果行情、不计算胜率、MFE/MAE或生产绩效。

## 6. Batch A Results

PIXEL、SENT、JCT、US、RLC五个样本，共6请求。首次4/5完整通过、最终5/5；PIXEL首轮MECHANISM_SIGN_MISMATCH，恢复一次通过。原非法内容完整保存，text=null，没有自动转换方向。

## 7. Batch A Safety Gate

PASS：5样本、6响应已由独立原Facts重建审计，全部可信来源、失败文本为空、合法文本可溯源、预算正常、生产2567既存文件/2103data文件未变。没有供给结构对象、没有无证据结构或机制事实放行，无共有系统性固定错误。正常被拒的错误未阻断第二批。[batch_a_gate.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/batch_a_gate.json)。

## 8. Batch B Results

MINA、BR、ZK、XAI、XMR全部首轮完整通过，共5请求。参数、模板、核心哈希与第一批相同。没有继续第二轮实验或不必要重试。

## 9. First-pass Schema Rate

首次可解析10/10，首次业务Schema10/10=100%。11次响应均可解析且Schema通过；Envelope合格不作为分析合格。前一轮0请求不纳入分母。

## 10. First-pass Full Validation Rate

首次完整验证9/10=90%，分母为10个完成首次响应的独立样本。首次来源11/11请求级别通过；两者不混算。

## 11. Controlled Recovery Results

仅PIXEL一次恢复：受控恢复1通过1个，恢复2通过0个，最终独立10/10。首次OI数量+4.80071215%却选择收缩；原Validator拒绝，下一次模型自行改为扩张相容、保留BEARISH_REVERSAL。每样本最多3调用、全局30保守预约，实际11、SDK重试0；无需恢复的九个样本各一次。

## 12. Evidence Binding Accuracy

全部实际引用属于对应输入与symbol；没有未知Evidence ID。已验证的70条支持/冲突Rendered Claim可回溯Facts字段或原sources.raw经现有确定性算术推导字段；此前小时价格从原小时bar复算。账户新增派生字段不改老Facts文件。正确ID的预测相关性依然单独审查，非ID合法即推理正确。[renderer_full_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/renderer_full_audit.json)。

## 13. Mechanism Validation

PIXEL首轮1次机制符号错误、拒绝1次、漏放行0次（限本轮观察）。最终6扩张相容、4收缩相容，全部使用同1h价格/OI配对、末时刻相差1ms。不能推出新增多空仓、强平、资金净流向或聪明钱。没有账户比例替代仓位，也未将Funding当确定方向。

## 14. Reversal Validation

实际合法BEARISH_REVERSAL=1（PIXEL），BULLISH_REVERSAL=0。PIXEL前小时+9.054242%、近小时-4.591251%，同时引用先前和当前证据与TURN，保留上涨4h/24h冲突。没有实际错误REVERSAL请求，因此真实错误反转拒绝率NOT_TESTED；原Mock反例测试继续通过。

## 15. Unsupported Structure Rejections

11实际响应structureEvidenceIds均为空；未生成无依据区间/支撑/阻力/目标或止损价，所以本轮真实非法结构拒绝次数0，攻击覆盖NOT_TESTED，不能声称真实模型已穷尽结构风险。原测试及新增恢复测试实际拒绝伪结构；默认structures=[]、无交易LONG_SETUP/SHORT_SETUP。机械失效来自合法PROGRAM_RULE，不是区间下沿。

## 16. Deterministic Renderer Audit

10合法文本、70支持/冲突事实行全部PASS。字段数值、单位%、pp、倍数、USDT、窗口及时间逐字对照Canonical Facts；既存phrase中的辅助数字对照原Facts phrase并通过重建。先前小时变化由原bar重新算术核对。20条程序条件的阈值来自已有规则公式及baseline Evidence，并不是模型市场数值。版本、时间、1h等元数据不算市场数值。账户变动与OI数量分别保留；未将4h当24h。Funding sum24h在当前typed registry的window=null，Renderer诚实UNDECLARED，原phrase仍标24h及结算时间，这是现有标签精度局限，未临时改合同。机制渲染为相容假设而非证明。[renderer_full_audit.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/renderer_full_audit.json)。

## 17. Direction Distribution

最终独立有效分布：{"BULLISH": 3, "BEARISH": 6, "BULLISH_REVERSAL": 0, "BEARISH_REVERSAL": 1, "NO_EDGE": 0}。无效首次另记BEARISH_REVERSAL=1，不能加到有效分布。全部horizon=1h；LOW8、MODERATE1、HIGH1。五类合同均保留，实际仅覆盖三类生成，NO_EDGE与看多反转真实性生成质量UNKNOWN。

## 18. Research Quality Review

10份总评均UNCERTAIN，0明确整体PASS/FAIL；这不覆盖正式10/10合法。都有未来1h方向、真实支持、条件性hypothesis与竞争情景、两条可观察程序复核规则；9 WAIT_FOR_CONFIRMATION、1 WAIT_FOR_PULLBACK，方向与交易机会分离。整体仍主要靠历史事实+枚举标签，证据为何支持未来没有展开。账户角色、量能角色与Funding冲突理由常不明；不能证明超出简单价格映射的优势。PIXEL真实转向/多周期冲突、XAI价/OI/相对量增强提供可复核研究假设，但非盈利信号。NO_EDGE没有样本，不强迫输出。逐样本人工说明见[independent_quality_review.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/independent_quality_review.json)。

## 19. V3/V4 Descriptive Comparison

**UNPAIRED_DESCRIPTIVE_COMPARISON**。V3首次Schema10/10、完整0/10、最终2/10（29调用）；V4首次10/10、9/10、最终10/10（11调用）。不同样本、不同合同、不同Prompt，不能解释为精确因果提升或预测提升。V4显式ID、受约束机制/条件、程序取值避免自由文本数字和未定义结构进入渲染；缩小表达空间也减少详细论证可见性。先验V3 XPL/MINA无定义下沿问题本轮V4未出现，不证明所有未来错误已解决。

## 20. Actual API Request Count

10独立样本、10首次响应、11实际HTTP、11保守预算预约、0 API错误、0 SDK重试、0最终失败、0未执行。仅DeepSeek，实际模型deepseek-flash。没有Binance、DingTalk、交易或其他外部API。请求追踪写入11份独立ledger_entries与总request_ledger；每次意向先落盘、超时预算保守计入。

## 21. Token Usage and Cost, if measurable

API实际usage合计：{"prompt_tokens": 69000, "completion_tokens": 5707, "total_tokens": 74707, "prompt_cache_hit_tokens": 12800, "prompt_cache_miss_tokens": 56200}。其中prompt cache hit/miss为prompt子项，不能重复计入total。成本UNKNOWN，响应不提供账单，本轮不查价、不猜成本。

## 22. Test and Static Check Results

调用前及结束后npm test均649/649，原632全保留、新增17、0失败/跳过。node --check 76/76，原74保留+2隔离脚本/测试。Mock真实网络0。覆盖5+5、恢复上限、预算、源错停止、API错停止、原事实时间、选择去重、追加存储/防覆盖/防symlink、renderer数值篡改、无生产入口。可信LIVE的实际签收由11真实响应验收，而非Mock伪造。[test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/test-output.txt)；[static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/static-checks.json)。

## 23. Production File Integrity

开始前2567既存文件SHA清单包含.env、src、全部生产data/旧validation/报告；结束后changed=[]，2103生产data文件无新增。V3、Facts、History、Outbox、投递状态、旧Analyst快照、.env以及所有旧文件字节未改。只新增scripts/structured-v4-live-rerun.js、test/structured-v4-live-rerun.test.js、两个交付报告和本任务validation文件。npm run scan方式保留但未启动；未修改旧项目或Cron。[before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/before-hashes.json)；[final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1_RERUN/final-integrity.json)。

## 24. Remaining Issues

有限枚举的推理表达能力、账户/Funding/量能证据角色相关性、不同周期/NO_EDGE/看多反转的真实生成覆盖仍不足。历史availableAt不可证明；HORIZON_EXPIRED等生命周期未集成。Http状态/服务端请求头未保存，来源是受控本地签收而非服务端认证。已保存文件不具有进程receipt能力。没有事实安全重大错误放行，但不能由10个样本推断稳定生产可靠性。

## 25. Readiness Verdict

**V4_PROBE_PASSED**。CONTRACT_RELIABILITY=PASS_THIS_PROBE，FACTUAL_SAFETY=PASS_OBSERVED，DIRECTIONAL_USEFULNESS=UNCERTAIN，PRODUCTION_INTEGRATION=NOT_TESTED。真实来源、结构化生成、合法条件性研究假设和事实数值绑定可工作，未遇系统性合同或事实架构阻断。这个判定不是预测效果通过、全部研究质量通过或生产准入。

## 26. Minimal Next Action

可建议另行授权BA_BIAS_STRUCTURED_ANALYST_V4_SHADOW_INTEGRATION_V1作为只读工程验证；本轮不执行。严格因果Shadow需实时保存采集开始/完成、每条数据首次可用时刻、原观察截止和研究/预测发布时刻，并在未来行情发生之前冻结方向与观察窗口、处理过期；只能评估发布之后的行情。历史采集后研究无法提供这些证明。任务完成后停止，无新请求、无Shadow、无生产切换。
