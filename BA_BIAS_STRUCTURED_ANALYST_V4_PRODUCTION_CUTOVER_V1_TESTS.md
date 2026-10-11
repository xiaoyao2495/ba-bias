# BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1_TESTS

**CUTOVER_COMPLETE — LIVE_PRODUCTION_RUN_NOT_YET_OBSERVED**

712/712测试；81/81静态；真实外部API与通知0。

## 实际生产入口与链路

[src/main.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/main.js)：旧analyzeDirectional只在显式V3选择分支；默认analyzeV4。[src/scan-daemon.js](/Users/yaodebao/Desktop/git/ict03/ba-bias/src/scan-daemon.js)及package.json沿用同一main入口，不增加Scanner。

[pipeline-proof.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/pipeline-proof.json)记录Scanner/Facts/Judge/V4/Validator/Renderer/Packet/History/Outbox/模拟SENT完整产物；Mock Facts与市场输入也完整保存，临时目录验收后删除，原生产数据未使用作写入目标。

## 完整模拟验收摘要

```json
{
  "MockFactsSymbol": "TESTUSDT",
  "productionRunStatus": "COMPLETE",
  "activeVersion": "V4",
  "judgeCalls": 1,
  "v4Calls": 1,
  "v3Calls": 0,
  "structuredOutput": {
    "version": "STRUCTURED_ANALYST_V4",
    "status": "PRODUCTION",
    "causalBacktestEligible": false,
    "symbol": "TESTUSDT",
    "evaluationTime": "2026-10-10T04:30:00.000Z",
    "direction": "BULLISH",
    "horizon": "1h",
    "conviction": "LOW",
    "supportingEvidenceIds": [
      "TESTUSDT:price.closed1h",
      "TESTUSDT:oi.1h"
    ],
    "conflictingEvidenceIds": [],
    "structureEvidenceIds": [],
    "mechanismHypothesis": {
      "type": "CONTRACT_EXPANSION_COMPATIBLE",
      "evidenceIds": [
        "TESTUSDT:price.closed1h",
        "TESTUSDT:oi.1h"
      ],
      "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
    },
    "directionalRationale": {
      "hypothesis": "CONTINUATION",
      "evidenceIds": [
        "TESTUSDT:price.closed1h",
        "TESTUSDT:oi.1h"
      ],
      "alternative": "OPPOSITE_MOVE",
      "certainty": "CONDITIONAL_NOT_CONFIRMED"
    },
    "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
    "reassessmentConditions": [
      {
        "conditionType": "PROGRAM_RULE",
        "ruleId": "PRICE_OPPOSITE_1h"
      },
      {
        "conditionType": "PROGRAM_RULE",
        "ruleId": "OI_REVERSED_1h"
      }
    ]
  },
  "validator": {
    "ok": true,
    "status": "EXPERIMENT_VALIDATED",
    "errors": [],
    "analysis": {
      "version": "STRUCTURED_ANALYST_V4",
      "status": "PRODUCTION",
      "causalBacktestEligible": false,
      "symbol": "TESTUSDT",
      "evaluationTime": "2026-10-10T04:30:00.000Z",
      "direction": "BULLISH",
      "horizon": "1h",
      "conviction": "LOW",
      "supportingEvidenceIds": [
        "TESTUSDT:price.closed1h",
        "TESTUSDT:oi.1h"
      ],
      "conflictingEvidenceIds": [],
      "structureEvidenceIds": [],
      "mechanismHypothesis": {
        "type": "CONTRACT_EXPANSION_COMPATIBLE",
        "evidenceIds": [
          "TESTUSDT:price.closed1h",
          "TESTUSDT:oi.1h"
        ],
        "limitation": "PARTICIPANT_BEHAVIOR_UNCONFIRMED"
      },
      "directionalRationale": {
        "hypothesis": "CONTINUATION",
        "evidenceIds": [
          "TESTUSDT:price.closed1h",
          "TESTUSDT:oi.1h"
        ],
        "alternative": "OPPOSITE_MOVE",
        "certainty": "CONDITIONAL_NOT_CONFIRMED"
      },
      "tradeOpportunity": "WAIT_FOR_CONFIRMATION",
      "reassessmentConditions": [
        {
          "conditionType": "PROGRAM_RULE",
          "ruleId": "PRICE_OPPOSITE_1h"
        },
        {
          "conditionType": "PROGRAM_RULE",
          "ruleId": "OI_REVERSED_1h"
        }
      ]
    },
    "provenanceValid": true,
    "analysisValid": true,
    "provenance": {
      "sourceType": "SYNTHETIC_OR_CONVERTED",
      "executionKind": "MOCK",
      "provider": "mock",
      "model": "mock-model",
      "requestedModel": "mock-model",
      "requestId": "5aeb4711-21c2-49d7-876a-d76ccecad1af",
      "requestIdKind": "LOCAL_TRACKING_ID",
      "serverResponseId": null,
      "requestedAt": "2026-10-11T03:41:36.173Z",
      "receivedAt": "2026-10-11T03:41:36.173Z",
      "requestHash": "5515c90d23b77af56ff9f1dc58c2939bcba79e8abc8d1d7514208d48f4fe5d59",
      "responseHash": "a84d4936f1f15d6dc92712f99668d25f1cc10ec693603acdbc219155efa8f065",
      "inputHash": "781157479df30d6433a1ad9461681554df88e8e25a83a7900e4ccab6c0e94ce8"
    }
  },
  "sourceType": "SYNTHETIC_OR_CONVERTED",
  "renderer": {
    "marketThesis": "短线存在延续当前方向的可能，仍是条件性假设。",
    "marketMechanism": "价格变化伴随未平仓规模扩张，不能确认新增仓位来自哪一侧。",
    "horizonReason": "历史观察窗口与未来研究周期分开；预测从持久化确认后开始。",
    "alternativeScenario": "价格可能向相反方向变化。",
    "invalidationDescription": "后续新收盘滚动1h价格变化≤-5.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守；后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核",
    "followUpChecks": []
  },
  "historySnapshotEntry": {
    "63071b7d8c0af90ec6c4aa26ccce656f": {
      "symbol": "TESTUSDT",
      "analystVersion": "V4",
      "evaluationTime": 1791606600000,
      "horizonEndTime": 1791693696218,
      "direction": "BULLISH",
      "horizon": "1h",
      "conviction": "LOW",
      "status": "ACTIVE",
      "path": "/var/folders/g_/yrsq1m3j6698_p9gz7dqmpr40000gn/T/ba-v4-production-IOFNy4/directional/63071b7d8c0af90ec6c4aa26ccce656f.json",
      "commitReceiptPath": "/var/folders/g_/yrsq1m3j6698_p9gz7dqmpr40000gn/T/ba-v4-production-IOFNy4/directional-commits/63071b7d8c0af90ec6c4aa26ccce656f.json",
      "predictionCommittedAt": 1791690096218,
      "causalBacktestEligible": false
    }
  },
  "outboxStoryKey": "16a26569ac617e1803f17a2d",
  "delivery": {
    "status": "SENT",
    "sent": true,
    "deliveryId": "delivery_10c0edc0a452ff62f7d2ff988ccc408a",
    "queueVersion": 1,
    "parts": [
      {
        "deliveryId": "delivery_10c0edc0a452ff62f7d2ff988ccc408a_part_1",
        "content": "检测 · BA-BIAS / TESTUSDT\nDeliveryId：delivery_10c0edc0a452ff62f7d2ff988ccc408a\n分片 1/1\n检测 · TESTUSDT｜滚动24h价格异动、1h价格异动、结算费率异常、成交量异常、结算费率翻转\n首次情报（NEW_STORY）：以下为本轮已核实的异常事实。\n价格（已收盘，截至10-10 12:00（北京））：1h +10.00%｜4h +10.00%｜24h +10.00%\nOI数量（采样10-10 12:00，北京）：1h +1.35%｜4h +5.63%｜24h +47.06%\n滚动24h价格（独立口径）： +10.00%\n1h成交量：前24根小时K线均值的 5.00倍\n已结算Funding：-0.2000%；10-10 10:30（北京）；空头支付多头。\n相邻实际结算：10-10 02:30 → 10-10 10:30（北京），变化 -0.3000个百分点。\n方向（V4）：偏多延续｜周期：1h｜强度：低（定性，非胜率）\n短线存在延续当前方向的可能，仍是条件性假设。\n价格变化伴随未平仓规模扩张，不能确认新增仓位来自哪一侧。\n交易观察：等待确认\n失效/复核：后续新收盘滚动1h价格变化≤-5.0000%，与当前价格方向明显相反；这是预先定义的方向命题失效，不是结构支撑失守；后续新采样精确1h OI数量变化≤-5.0000%，原敞口变化条件明显逆转，只触发复核\n替代情景：价格可能向相反方向变化。\n风险：统计异动不证明确定性因果或资金流向，方向仅为条件性研究假设。\n数据截止：10-10 12:30（北京）\nRunId：MOCK_CUTOVER｜来源：Binance USDⓈ-M Futures",
        "status": "SENT",
        "attempts": 1,
        "nextAttemptAt": 0,
        "attemptedAt": 1791690096251,
        "sent": true,
        "acknowledgement": {
          "errcode": 0
        },
        "finishedAt": 1791690096254
      }
    ],
    "acknowledgement": {
      "errcode": 0
    },
    "acknowledgedAt": 1791690096254
  },
  "causalBacktestEligible": false
}
```

## 输入、输出及字段验收位置

| 项目 | 实际证据 |
|---|---|
| Mock Facts/Scanner产物 | pipeline-proof.json.mockMarketInput / mockFacts / result.scan |
| V4结构化模型输出 | pipeline-proof.json.snapshot.originalAnalysis |
| Validator/可信来源 | snapshot.validation / attempts / provenance；MOCK不冒充LIVE |
| 精确Renderer及自然中文 | snapshot.deterministicText / rendered；Outbox分片content |
| Intelligence Packet | pipeline-proof.json.packet |
| History写入模拟 | history.directionalSnapshots及快照/提交回执 |
| Outbox写入/模拟业务码确认 | outbox.delivery.parts，各errcode=0 / SENT |
| 重复投递检测 | 用例33、35、36、39、40，实际main重复run/相同Facts不提交 |
| UNKNOWN/部分失败 | 用例34、38、54、56及原队列回归 |
| V3旧快照与回滚 | 用例25、46、47、48；旧数据原样，未来仅V3 |
| POST_COLLECTION/因果排除 | 用例27–32、58、61–63；缺基准、时序异常不计成绩 |
| 10份实际历史Facts提升回放 | promotion-replay.json，10/10，metadata-only，始终MOCK |

## 63项新增生产测试

- PASS — production 01 real entry selects V4 and persists one candidate result
- PASS — production 02 failed V4 never executes V3 fallback
- PASS — production 03 complete V4 schema used by invocation not V3 prose
- PASS — production 04 single default active version without automatic fallback
- PASS — production 05 owned LIVE adapter rejects transport injection without network
- PASS — production 06 Mock and model source self report cannot mint LIVE
- PASS — production 07 in-memory source and complete business validation independently run
- PASS — production 08 bullish direction remains separate from waiting for confirmation
- PASS — production 09 unavailable is not valid NO_EDGE or a fallback analysis
- PASS — production 10 legal NO_EDGE retains its own display state
- PASS — production 11 renderer exact market numbers only from frozen Facts
- PASS — production 12 OI scope is quantity not nominal funds flow
- PASS — production 13 signed funding payment description retained from verified Facts
- PASS — production 14 account percentages never equal position size
- PASS — production 15 unknown Evidence is rejected and never rendered
- PASS — production 16 unsupported lower range boundary is rejected
- PASS — production 17 incorrect reversal with no opposite prior price is rejected
- PASS — production 18 price OI incompatible mechanism rejected
- PASS — production 19 compact Chinese direction carries keyword not raw JSON
- PASS — production 20 valid conflict facts survive packet mapping
- PASS — production 21 absent structures do not create levels or setups
- PASS — production 22 actual Intelligence Packet accepts grounded V4
- PASS — production 23 Judge ineligible candidate never invokes V4 or notifies
- PASS — production 24 final analyst failure preserves factual approved Outbox
- PASS — production 25 archived V3 snapshot original version remains readable
- PASS — production 26 new V4 snapshot is explicit with raw analysis and validation
- PASS — production 27 V4 outcome eligibility separate and no fabricated MFE MAE
- PASS — production 28 production input has live time semantics never historical probe
- PASS — production 29 commit acknowledgment later than generation and prior price unused
- PASS — production 30 model failures never generate committed prediction start
- PASS — production 31 frozen Facts cannot change under an in-flight model
- PASS — production 32 incomplete observation times remain unknown never backfilled
- PASS — production 33 already SENT same event not submitted by new version
- PASS — production 34 UNKNOWN is never automatically sent
- PASS — production 35 analyst version change does not affect compare eligibility
- PASS — production 36 same event retains canonical storyKey regardless model version
- PASS — production 37 long message splits without dropping Unicode or facts
- PASS — production 38 actual mock delivery parts reach SENT with independent IDs
- PASS — production 39 re-running same completed RunId does not repeat analyst or Outbox
- PASS — production 40 persisted analyst failure also deduplicates next unchanged event
- PASS — production 41 scan once and hourly commands retain one main entry
- PASS — production 42 doctor reports active V4 schema without DeepSeek request
- PASS — production 43 scheduler interval unchanged and no secondary scanner
- PASS — production 44 seven eligible candidates all researched and sent
- PASS — production 45 production adapter has no thirty request experimental quota
- PASS — production 46 manual rollback selector affects future version only not state
- PASS — production 47 explicit rollback executes only V3 in actual main
- PASS — production 48 version selector refuses active run lock without modifying it
- PASS — production 49 original data env detectors Judge queue scheduler bytes preserved
- PASS — production 50 recovery max one preserves normal production two-call policy
- PASS — production 51 saved ten real Facts and real model business results pass metadata-only promotion
- PASS — production 52 envelope serialization cannot authorize stored V4 as fresh live analysis
- PASS — production 53 failed snapshot persistence degrades analyst without losing approved Facts
- PASS — production 54 delivery failure does not drop subsequent qualified records
- PASS — production 55 no eligible stories are silent and retain all Judge decisions
- PASS — production 56 unknown parts prevent whole-record blind resend while SENT preserved
- PASS — production 57 production prompt business constraints same as frozen live probe
- PASS — production 58 no predictor commit before actual persistence acknowledgement
- PASS — production 59 production not using experiment executor budgets or storage
- PASS — production 60 failed final recovery retains both diagnostics and original raw
- PASS — production 61 verified commit enables lifecycle expiry while performance stays excluded
- PASS — production 62 forged commit receipt cannot create expiry or prediction start
- PASS — production 63 clock ordering failure records commit but no valid prediction start

## 旧测试及受保护实现

原649项没有删除。旧Mock客户端适配生产V4输入协议，业务期待值未改变。六个原哈希测试按明确授权文件Set处理此次生产提升，同时新增用例49对切换前基线逐字保护未授权全部文件；Detector/Facts/Judge/History存量/Outbox存量/.env/队列/调度不豁免。业务Guard去掉Schema元数据选择后SHA等价，见modified-files.json。

[test-output.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/test-output.txt)；[static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/static-checks.json)；[final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/final-integrity.json)。

## 实际运行和回滚边界

生产配置已选择V4；没有真实扫描/DeepSeek/钉钉测试。Mock SENT不代表真实外部消息。正常命令npm run scan保留，明确等待后续正常运行；不补跑历史，不启动Shadow，不并行V3。回滚按主报告步骤先安全停前台，再显式选择V3，保留所有V4历史和SENT/UNKNOWN语义。

## Q1–Q30

Q1. 是，正式默认入口已V4，active-analyst.json明确V4。

Q2. 是，默认新运行只执行V4，无并行、无失败自动V3回退。

Q3. 已接入受控LIVE factory；本轮仅Mock，新的正式LIVE成功尚未观察。

Q4. 是，正式入口及Packet实际经过完整V4 Guard；来源与内容独立判定。

Q5. 是，Facts/Evidence和预定义规则确定性渲染，不由LLM再写数字。

Q6. 正式V4默认没有结构对象，未定义区间下沿被拒绝；仍需正常运行持续观察。

Q7. 是，direction→marketBias兼容视图；五方向、1/4/24h、三置信度和独立交易机会不降级。

Q8. 是，FAILED/ANALYST_UNAVAILABLE的analysis为null，合法NO_EDGE为VALID_NO_EDGE。

Q9. 是，旧快照/生产数据字节未改，仍走旧历史读取规则。

Q10. 是，DIRECTIONAL_SNAPSHOT_V4、analystVersion=V4、显式合同及原始JSON。

Q11. 直接记录来源retrievedAt及真实冻结/客户端请求完成/持久化回执；缺失首次获取时间保留null，不能证明历史首次公开可用；因果资格仍不足。

Q12. 是，V4记录全部INCOMPLETE，无可靠post-commit基准，全部排除严格绩效，MFE/MAE/胜率为空。

Q13. 没有，资格、阈值、评分、storyAngle与现有Judge行为未改。

Q14. 没有，Scanner、Detector、Facts和各异常阈值均原样。

Q15. 版本不参与身份或事实更新；实际重跑/相同Facts/失败方向去重测试通过。未观察真实正式运行，不声称零未来风险。

Q16. 是，原投递实现未改，测试SENT/UNKNOWN/分片安全；103 SENT、2 SHADOW旧数据未变。

Q17. 是，模型/验证/快照保存失败安全降级方向，符合Judge条件的Facts仍可进入Outbox。

Q18. 是，无10/30/5+5生产限制；七候选实际全链路和31次Mock调用通过，原覆盖测试保留。

Q19. 是，package.json的scan仍node src/scan-daemon.js，未增加进程管理器。

Q20. 当前无生产进程；默认只有V4，V3仅显式手工回滚后执行，无双研究路径。

Q21. 是，只变未来选定版本，不删除V4快照/回执，不改或重发旧状态。

Q22. 新增63；总712/712，原649全部保留。

Q23. 是，81/81，原76保留。

Q24. 没有修改.env、旧项目或AI Pro Cron。

Q25. 是，2103生产data文件全部不变且无新增，其他旧状态哈希一致。

Q26. 没有，真实正式生产RunId=null；只有隔离临时目录中的MOCK_CUTOVER等测试RunId。

Q27. 没有，真实钉钉0；测试中的SENT均模拟确认。

Q28. 默认新研判已停用V3；旧代码只作兼容和人工回滚工件。

Q29. 是，默认activeAnalyst=V4，scan/once共用生产入口。

Q30. 没有阻断代码切换的问题；尚未观察正常真实生产运行，严格因果绩效资格不足但不会破坏事实研究。
