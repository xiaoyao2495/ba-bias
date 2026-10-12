# BA_BIAS_WEB_DASHBOARD_V1_HASH_BASELINE_FORENSIC

**最终裁决：BASELINE_MIGRATION_PARTIALLY_SAFE**。只建议另行授权严格限定的Web元数据迁移；不授权用当前生产状态哈希覆盖旧History、限流状态或.env基线。原始测试记录仍是 **984/994，10失败**，不是全部通过。

## 1. 范围与方法

本轮只读取证并输出此Markdown报告。没有运行npm test（旧套件会重写离线证明文件）、回放入口、Web服务、Scanner或外部API；未写旧测试/基线、Facts、History、Outbox、.env，未推送或部署。哈希按原始字节SHA256计算，不规范化路径/换行。读取Git对象、既有测试日志、旧清单、Selector验收与Dashboard前冻结清单，独立枚举各失败测试的全部受保护文件。

唯一Git提交为 `545430b5bea334ffc96621aa19b515d5ee616160`，记录的作者/提交时间均为 **2026-10-11 19:47:36 +08:00**。这是Selector V1完成后的本地代码锚点；没有更早Git提交，不存在可供git diff追溯的Selector开发前版本。Git时间为提交元数据，不是独立可信时钟或签名发布证明。不能把此提交等同Windows当前部署证明。

## 2. 三层基线与可信程度

| 层次 | 可验证来源 | 适用范围 / 限制 |
|---|---|---|
| Selector修改前冻结清单 | B5 before-hashes + integrity.json + tests.txt，均与Git对象逐字节一致 | BEFORE不是Selector代码的AFTER；43个旧src仍相同，config/main/packet三处为报告明确授权修改；新opportunity-selector不在BEFORE。不可把旧代码哈希当最新合同。 |
| Selector V1后、Dashboard前正式代码 | Git提交545430b；Selector报告声明完成、tests.txt 892/892；integrity finalCheckAt=2026-10-11T10:31:25.763Z（北京时间18:31:25.763） | 当前47个原有核心src与Git逐字节一致，覆盖新增Selector及修改后三处入口。时间/合同来源可交叉核对。 |
| Dashboard开发前的数据观察 | audit-start-hashes.json含8395项，其中8348生产data/.env、47原有src；生产完整性报告及真实19/20点档案 | 文件未进入Git，清单无具体采集时间、只称task start；它是有限的任务前后证据，不能自动升级为长期可信生产基线。原history旧完整字节缺失。 |
| 当前Dashboard | 未提交新增Web模块；Git已跟踪文件仅package.json和.gitignore变更 | 差异能逐行证明；新增依赖链需静态审计，不能用“新增目录”代替隔离证明。 |

所有当前8348个生产data/.env及47个原有src均与Dashboard开始前冻结清单匹配，生产目录没有该清单之外新增文件。B5覆盖的6881个生产项独立全量比较，仅history.json、dingtalk-rate.json两项不同；其余6879项相同。当前Outbox六条19/20点记录等1467个生产项在B5中没有旧哈希，不能说它们通过B5旧值断言；它们已在Dashboard开始前清单中，且本轮未变化。

### 原始基线来源与时间

下列清单全部SHA与Git对象一致。**精确原始创建时间全部UNKNOWN**：before-hashes一般仅路径→哈希，没有capturedAt；mtime仅保留查找线索，禁止当作创建/批准时间。原始测试通过日志与任务最终完整性时间证明当时使用过该清单，但不能补造其精确建立时间。B5最终检查给出上界18:31:25.763；其他任务日期以对应验收报告为背景，不把旧任务作为Selector后的合同。

| ID | 原始来源（保留，不重写） | mtime，北京时间，仅线索 | 清单SHA256 / Git一致 |
|---|---|---|
| B1 | `validation/BA_BIAS_ANALYST_CONTRACT_ALIGNMENT_V1/before-hashes.json` | `2026-10-10T23:43:48.084546+08:00`；创建时间UNKNOWN | `4f26865d5a73aac328a91d47c843c501ab4699d65f6a1d924360a5d697081779` / 是 |
| B2 | `validation/BA_BIAS_ANALYST_GENERATION_QUALITY_V1/before-hashes.json` | `2026-10-11T02:13:55.375172+08:00`；创建时间UNKNOWN | `3b56523c034448b452f05519317a5d1c9e8965f0073d6e0268ae63d0d4b22d08` / 是 |
| B3 | `validation/BA_BIAS_ANALYST_VALIDATION_PRECISION_V1/before-hashes.json` | `2026-10-11T01:34:15.906972+08:00`；创建时间UNKNOWN | `e522214a01fcdf1474fcd03d2349dad9b60a41ab6856829fbebe9fedc4258582` / 是 |
| B4 | `COMPACT_PROTECTED_HASHES.json` | `2026-10-10T21:32:23.186440+08:00`；创建时间UNKNOWN | `1aaf825fda65730be5a83136e6c0ac22b69b484d507951cc46fa7f3227fa58d6` / 是 |
| B5 | `validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/before-hashes.json` | `2026-10-11T18:15:25.983032+08:00`；创建时间UNKNOWN | `9df022253efca1bef798653c9cf36976321956c61911a1c9fef96e1c8cc354b6` / 是 |
| B6 | `validation/BA_BIAS_V4_PRODUCTION_OUTPUT_QUALITY_FIX_V1/before-hashes.json` | `2026-10-11T13:11:09.842115+08:00`；创建时间UNKNOWN | `c19c5190f8bdb4833623c41affbda4df51729cb07ee6903dfa611f7fa83bbd2a` / 是 |
| B7 | `validation/BA_BIAS_STRUCTURED_ANALYST_V4_LIVE_PROBE_V1/before-hashes.json` | `2026-10-11T04:17:56.770299+08:00`；创建时间UNKNOWN | `531adfbc83e91871177428dbda986e2a18db01de75bd079f5a2d558882a5d812` / 是 |
| B8 | `validation/BA_BIAS_ANALYST_SEMANTIC_GROUNDING_V1/before-hashes.json` | `2026-10-11T03:53:53.643645+08:00`；创建时间UNKNOWN | `7f680a3dac274a6146edaea177d3eaab77cc2ba233ba4bf30931041de7cda2b8` / 是 |
| B9 | `validation/BA_BIAS_STRUCTURED_ANALYST_V4_PRODUCTION_CUTOVER_V1/before-hashes.json` | `2026-10-11T11:26:45.741935+08:00`；创建时间UNKNOWN | `b2cb36165b558be6732e3f65559da6964427e6cd147e05847909c2f1e174a404` / 是 |

B1、B3测试的data/.env实际expected并非它们旧清单的原值：`test/output-quality-authorization.js:4–7`的protectedHash把生产数据值替换为B5。B6测试也在`test/output-quality.test.js:9–10`用B5覆盖生产项。该现有覆盖机制在Git提交中，非Dashboard新增。本轮未继续扩大此覆盖。

## 3. 全部10项逐项裁决

以下位置给出真正断言实现行；动态生成测试的日志注册位置另列。D1/D2/D3/D4具体内容差异见下一节。每项只能采用用户允许的一类裁决。

| # | 原测试名称 / 文件位置 | 报错文件 / 来源 | Dashboard授权范围 | 失败性质与具体证据 | 裁决 / 风险 / 最小处理 |
|---|---|---|---|---|
| 1 | Judge recovery, detectors, queue, History, scheduler and production state remain byte-identical<br>[test/analyst-alignment.test.js:38](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-alignment.test.js:38)<br>日志注册 `test/analyst-alignment.test.js:38:1` | `data/state/dingtalk-rate.json`<br>B1 | 否：生产数据禁止改写/以新哈希消除失败 | 固定旧数据环境与19/20点后可变运行状态混用；D3；非Dashboard写入。旧限流字节已精确重建并验SHA | `TEST_ENVIRONMENT_MISMATCH`<br>中；保留旧值，隔离限流Fixture，禁止当前SHA替换 |
| 2 | production scan command and protected files retain baseline bytes<br>[test/analyst-generation.test.js:41](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-generation.test.js:41)<br>日志注册 `test/analyst-generation.test.js:41:1` | `.gitignore`<br>B2 | 是：独立Web命令/认证配置忽略 | 真实内容变化；D1与Git精确diff；旧哈希匹配Git旧字节，现增量是任务明确允许的配置；无路径/LF变化 | `STALE_BASELINE_CONFIRMED`<br>低；只限两文件精确元数据迁移草案P1，禁止全目录放行 |
| 3 | history/outbox/raw model responses/env remain byte identical in offline suite<br>[test/analyst-precision.test.js:37](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/analyst-precision.test.js:37)<br>日志注册 `test/analyst-precision.test.js:37:1` | `data/state/dingtalk-rate.json`<br>B3 | 否：生产数据禁止改写/以新哈希消除失败 | 固定旧数据环境与19/20点后可变运行状态混用；D3；非Dashboard写入。旧限流字节已精确重建并验SHA | `TEST_ENVIRONMENT_MISMATCH`<br>中；保留旧值，隔离限流Fixture，禁止当前SHA替换 |
| 4 | all protected production logic and original tests remain unchanged<br>[test/compact.test.js:44](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/compact.test.js:44)<br>日志注册 `test/compact.test.js:44:1` | `package.json`<br>B4 | 是：独立Web命令/认证配置忽略 | 真实内容变化；D2与Git精确diff；旧哈希匹配Git旧字节，现增量是任务明确允许的配置；无路径/LF变化 | `STALE_BASELINE_CONFIRMED`<br>低；只限两文件精确元数据迁移草案P1，禁止全目录放行 |
| 5 | NO_EDGE forensic 43 History hashes immutable<br>[test/no-edge-render-forensic.test.js:44](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/no-edge-render-forensic.test.js:44)<br>日志注册 `test/no-edge-render-forensic.test.js:5:178` | `data/state/history.json`<br>B5 | 否：生产数据禁止改写/以新哈希消除失败 | 固定旧数据环境与19/20点后可变运行状态混用；D4；非Dashboard写入。旧完整History字节UNKNOWN，完整语义diff不能证明 | `TEST_ENVIRONMENT_MISMATCH`<br>高；先找回旧History完整快照；旧测试默认继续失败关闭，禁止仅换SHA |
| 6 | output quality 53 History immutable<br>[test/output-quality.test.js:55](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/output-quality.test.js:55)<br>日志注册 `test/output-quality.test.js:11:29` | `data/state/history.json`<br>B6+B5覆盖生产数据 | 否：生产数据禁止改写/以新哈希消除失败 | 固定旧数据环境与19/20点后可变运行状态混用；D4；非Dashboard写入。旧完整History字节UNKNOWN，完整语义diff不能证明 | `TEST_ENVIRONMENT_MISMATCH`<br>高；先找回旧History完整快照；旧测试默认继续失败关闭，禁止仅换SHA |
| 7 | Selector 39 production files identical<br>[test/selector.test.js:44](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/selector.test.js:44)<br>日志注册 `test/selector.test.js:5:343` | `data/state/history.json`<br>B5 | 否：生产数据禁止改写/以新哈希消除失败 | 固定旧数据环境与19/20点后可变运行状态混用；D4；非Dashboard写入。旧完整History字节UNKNOWN，完整语义diff不能证明 | `TEST_ENVIRONMENT_MISMATCH`<br>高；先找回旧History完整快照；旧测试默认继续失败关闭，禁止仅换SHA |
| 8 | V4 all pre-existing files including production and old experimental contracts remain identical<br>[test/structured-v4-live-preflight.test.js:16](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4-live-preflight.test.js:16)<br>日志注册 `test/structured-v4-live-preflight.test.js:16:1` | `.gitignore`<br>B7 | 是：独立Web命令/认证配置忽略 | 真实内容变化；D1与Git精确diff；旧哈希匹配Git旧字节，现增量是任务明确允许的配置；无路径/LF变化 | `STALE_BASELINE_CONFIRMED`<br>低；只限两文件精确元数据迁移草案P1，禁止全目录放行 |
| 9 | V4 protected existing files incl V3, state, env, snapshots are unchanged<br>[test/structured-v4.test.js:46](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/structured-v4.test.js:46)<br>日志注册 `test/structured-v4.test.js:46:1` | `.gitignore`<br>B8 | 是：独立Web命令/认证配置忽略 | 真实内容变化；D1与Git精确diff；旧哈希匹配Git旧字节，现增量是任务明确允许的配置；无路径/LF变化 | `STALE_BASELINE_CONFIRMED`<br>低；只限两文件精确元数据迁移草案P1，禁止全目录放行 |
| 10 | production 49 original data env detectors Judge queue scheduler bytes preserved<br>[test/v4-production.test.js:72](/Users/yaodebao/Desktop/git/ict03/ba-bias/test/v4-production.test.js:72)<br>日志注册 `test/v4-production.test.js:72:1` | `.gitignore`<br>B9 | 是：独立Web命令/认证配置忽略 | 真实内容变化；D1与Git精确diff；旧哈希匹配Git旧字节，现增量是任务明确允许的配置；无路径/LF变化 | `STALE_BASELINE_CONFIRMED`<br>低；只限两文件精确元数据迁移草案P1，禁止全目录放行 |

分类总计：5项STALE_BASELINE_CONFIRMED（Web元数据）；5项TEST_ENVIRONMENT_MISMATCH（运行中可变生产状态）。没有证据认定UNEXPECTED_CODE_CHANGE或INTEGRITY_REGRESSION。History旧字节不可获得属于语义追溯缺口，明确UNKNOWN；其哈希清单来源本身可由Git/验收证实，因此不把“字节缺失”混同“来源完全不明”。此分类**不批准当前History内容，也不批准换哈希**。

### 每项原始预期、有效预期和当前SHA256

有效预期是测试日志真正比较的expected；原始预期是最初任务清单的值。两者不同的条目必须显示，防止把旧于Selector的SHA当正式生产合同。

| # | 文件 | 最初清单的原始预期SHA256 | 测试有效预期SHA256 | 当前实际SHA256（本轮重算） |
|---|---|---|---|---|
| 1 | `data/state/dingtalk-rate.json` | `e6d18b7a70cef940a8e5bb8ee0227bdc345e98d9f74dbd83ac1b9d56571d8b07` | `bc464e3f08949f3b9d796e564f7a4b9a79db190ab826b0f14690b1e071b06a3e` | `d253bbb6b0e6c9356973c3f621f15903aa55d48db3feaf8dd6cc4997ebaebd5b` |
| 2 | `.gitignore` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `49c8fd7263c052f65c2159d9de7b0adc57dd346481d41388678033f7d2e284be` |
| 3 | `data/state/dingtalk-rate.json` | `e6d18b7a70cef940a8e5bb8ee0227bdc345e98d9f74dbd83ac1b9d56571d8b07` | `bc464e3f08949f3b9d796e564f7a4b9a79db190ab826b0f14690b1e071b06a3e` | `d253bbb6b0e6c9356973c3f621f15903aa55d48db3feaf8dd6cc4997ebaebd5b` |
| 4 | `package.json` | `bd2d2588a6df38815eaf75e998cf1d13a86de1ff33622f024802f9c5a1fe652c` | `bd2d2588a6df38815eaf75e998cf1d13a86de1ff33622f024802f9c5a1fe652c` | `d0d67d5845479491437a6b6903a044ab92ac72ac3401a48d3e6fd21816fb70be` |
| 5 | `data/state/history.json` | `1e7ba20441334b27f810cb2cba461c29176d3fe51b62cad052f0370834bad7ea` | `1e7ba20441334b27f810cb2cba461c29176d3fe51b62cad052f0370834bad7ea` | `e41cc7684e3f1ae277eb780fe4120b03e79e0a8a13d7d211006bbafd71670862` |
| 6 | `data/state/history.json` | `ceddac5be877762974976ed5f4f10bc2305de641194afaec1911c774891d015f` | `1e7ba20441334b27f810cb2cba461c29176d3fe51b62cad052f0370834bad7ea` | `e41cc7684e3f1ae277eb780fe4120b03e79e0a8a13d7d211006bbafd71670862` |
| 7 | `data/state/history.json` | `1e7ba20441334b27f810cb2cba461c29176d3fe51b62cad052f0370834bad7ea` | `1e7ba20441334b27f810cb2cba461c29176d3fe51b62cad052f0370834bad7ea` | `e41cc7684e3f1ae277eb780fe4120b03e79e0a8a13d7d211006bbafd71670862` |
| 8 | `.gitignore` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `49c8fd7263c052f65c2159d9de7b0adc57dd346481d41388678033f7d2e284be` |
| 9 | `.gitignore` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `49c8fd7263c052f65c2159d9de7b0adc57dd346481d41388678033f7d2e284be` |
| 10 | `.gitignore` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746` | `49c8fd7263c052f65c2159d9de7b0adc57dd346481d41388678033f7d2e284be` |

当前4个文件的SHA均与已保存失败日志一致。Dashboard开发前两元数据文件匹配Git旧SHA；两生产状态文件已经是当前SHA。原始.data/.env清单没进入Git的实际内容不能通过git show恢复；读取Git只恢复哈希记录而不是状态文件。

## 4. 具体内容差异（不以哈希不一致代替分析）

### D1 `.gitignore`（对应2/8/9/10）

Git旧字节62B、7个LF、0个CRLF；当前100B、10个LF、0个CRLF，两者均末尾LF。原有.env/.env.*/node_modules/data/*.log/.DS_Store规则逐字节保留，只加独立Web凭据忽略及例外。是内容增量，不是路径或换行差异。

```diff
diff --git a/.gitignore b/.gitignore
index 5fd9836..86386b4 100644
--- a/.gitignore
+++ b/.gitignore
@@ -5,3 +5,6 @@ node_modules/
 data/
 *.log
 .DS_Store
+.web.env
+.web.env.*
+!.web.env.example
```

`.web.env.example`只含占位值，不是实际凭据。.web.env和.env仍被忽略。gitignore变化没有导入业务代码的路径，不改变市场、研究或投递。

### D2 `package.json`（对应4，并被1/2/8/9/10首错掩盖）

旧734B、26个LF，当前839B、29个LF，0个CRLF，均末尾LF。JSON结构比较只有scripts增加3个键；原scripts、dependencies、engines、type等值均不变。未增加pre/post生命周期钩子，未改test/scan/once/doctor命令，package-lock无差异。

```diff
diff --git a/package.json b/package.json
index 4482afd..8531718 100644
--- a/package.json
+++ b/package.json
@@ -14,7 +14,10 @@
     "once": "node src/main.js once",
     "scheduler": "node src/scheduler.js",
     "test": "node --test test/*.test.js",
-    "scan:once": "node src/main.js scan"
+    "scan:once": "node src/main.js scan",
+    "web": "node src/web/server.js",
+    "web:doctor": "node scripts/dashboard-doctor.js",
+    "web:password": "node scripts/dashboard-password.js"
   },
   "dependencies": {
     "ajv": "^8.17.1",
```

启动入口从package scripts指向src/web，未改生产入口。真实内容变化；不存在Windows换行转换证据。

### D3 `data/state/dingtalk-rate.json`（对应1/3，并潜伏于多数其他测试）

此文件被Git忽略，`git diff`无条目不代表没有变化；无法从Git拿到旧文件。不过本次找到**SHA核对成功的精确旧字节重建**：取19:00前最后一个保存分片INJUSDT，attemptedAt=1791698803392、finishedAt=1791698803465，按原atomicWrite的JSON.stringify(...,null,2)+LF枚举该区间的lastAttemptAt。仅1791698803399产生旧SHA `bc464...`，因此以下diff的旧字节有密码学相等证据，不是猜测或写回。

```diff
--- SHA-verified reconstruction (not a production file)
+++ current data/state/dingtalk-rate.json
@@
 {
-  "lastAttemptAt": 1791698803399,
+  "lastAttemptAt": 1791720156108,
   "cooldownUntil": 0
 }
```

旧值北京时间2026-10-11 14:06:43.399；当前2026-10-11 20:02:36.108，推进21352709ms。两个JSON均59字节、4LF、0CRLF、末尾LF；仅时间数字变化。旧证据位置data/outbox/hourly_20261011_1400_INJUSDT.json的delivery.parts；当前值落在data/outbox/hourly_20261011_2000_CFXUSDT.json第2分片attemptedAt=1791720156101与finishedAt=1791720156172之间，状态SENT、acknowledgedAt=1791720156172。src/storage/delivery-queue.js:50–56在投递前按实际now更新lastAttemptAt。

故变化与已保存正常投递时序一致，发生在Dashboard之前。重建没有证明任何服务器用户身份或所有历史事件可信；它足以证明旧/新限流时间内容差，而非允许用新值覆盖受保护状态基线。

### D4 `data/state/history.json`（对应5/6/7，并潜伏于1/2/3/8/9/10）

Git未跟踪；没有找到B5旧完整History文件。B5 SHA可追溯，但**旧字节长度、换行、全部字段和完整JSON diff均UNKNOWN**。当前文件1315170B、32676LF、0CRLF、末尾LF。不能声称所有差异只是追加，也不能排除旧字节曾有格式不同；现有证据确认至少存在真实状态内容演进，不能把它降格为单纯换行。

能证实的内容与交叉对应：

| 当前History内容 | 独立保存证据 | 能证明 / 不能证明 |
|---|---|---|
| runs.hourly_20261011_1900：COMPLETE，generated=3，sent=3，finishedAt=1791716556775 | 对应result.json及BULLA/LUMIA/RLC三个Outbox | 19点研究与投递统计一致；不是旧完整History的语义diff |
| runs.hourly_20261011_2000：COMPLETE，generated=3，sent=3，finishedAt=1791720156179 | 对应result.json及SENT/US/CFX三个Outbox | 20点统计一致；不证明其他历史条目完全无改 |
| generated=189，sent=187 | 当前189个Outbox：187SENT、2SHADOW、其余状态0 | 当前总数一致；旧16:41报告记183个、181SENT、2SHADOW，增量6与两轮各3一致。该报告早于18:15，不能冒充B5旧字节全文 |
| 六个symbol story的runId/lastResearchTime指向19/20点 | 对应Facts/Outbox/result，时间1h窗口一致 | 近期摘要能追溯；不能重建rotation、coverage、全部旧stories与directionalSnapshots差异 |

源代码src/main.js:95/154/185/195本来就更新History；scanner.js:44本来就推进rotation。不能拿“History永远与离线任务前SHA相同”检验后来允许实际运行的环境。解决应为隔离Fixture与任务开始/结束完整性保护，而不是改History或直接接受e41cc...。

## 5. 首错之外的完整断言审计

原测试assert.equal在首错停止。本次用只读字节比较重复其过滤/授权集/protectedHash解析，枚举全部项，不执行旧套件。不是新的测试通过结果；下表只表示静态完整性枚举。

| # | 此断言实际比较条目数（可重叠） | 全部不符文件，非只首错 |
|---|---|---|
| 1 | 2126 | `data/state/dingtalk-rate.json`, `data/state/history.json`, `package.json` |
| 2 | 2335 | `.gitignore`, `package.json`, `data/state/history.json`, `data/state/dingtalk-rate.json` |
| 3 | 2222 | `data/state/dingtalk-rate.json`, `data/state/history.json` |
| 4 | 18 | `package.json` |
| 5 | 2 | `data/state/history.json`, `data/state/dingtalk-rate.json` |
| 6 | 2 | `data/state/history.json`, `data/state/dingtalk-rate.json` |
| 7 | 6881 | `data/state/history.json`, `data/state/dingtalk-rate.json` |
| 8 | 2496 | `.gitignore`, `package.json`, `data/state/history.json`, `data/state/dingtalk-rate.json` |
| 9 | 2481 | `.gitignore`, `package.json`, `data/state/history.json`, `data/state/dingtalk-rate.json` |
| 10 | 2653 | `.gitignore`, `package.json`, `data/state/history.json`, `data/state/dingtalk-rate.json` |

所有不符仍限制在上述4个文件，没有发现新增核心代码/旧Outbox/Facts/.env/旧测试/旧验收文件的额外差异。现有授权集合本来会跳过部分核心；因此“过滤后没有差异”不是充分证据，本审计另做全部47个旧src与Git后Selector基线比较，补足被授权跳过项的保护。

## 6. 核心完整性保护独立证据

以下每行Git后SelectorSHA和当前SHA相同（只列一次），没有通过新哈希清除任何核心失败。全部47个原有src都核对，表中列关键项。

| 文件 | Git后Selector = 当前SHA256 |
|---|---|
| `src/market/scanner.js` | `fd5e284f694dac494016a04e1162b7716fe7f67f707410065ef2bb6ce3ba948c` |
| `src/market/facts-engine.js` | `7d3cb1c1a7aff77cbef6165a923c9caddd60f35d03a2f18f92e04282ae60a5cc` |
| `src/market/detector.js` | `85f93a8c645e7feec7caa3a3bd16cc52590cb705d804f24b95a1eaeef1524f23` |
| `src/market/opportunity-selector.js` | `0d96f55cafba6c73df6fa1603cd5937b2ae15ee6e03f1cbfee79a256668d8c26` |
| `src/analysis/structured-v4-prompt.json` | `44506be6be91fe618125763ebfc95053341caf304356509a4a5852c72027fcc4` |
| `src/analysis/experimental/structured-v4-schema.js` | `e2d3728b88dafc9cf14634914229fc38fc455e76e30763b154ca85e8ff46840f` |
| `src/analysis/experimental/structured-v4-guard.js` | `9fd2e3f1c26a61afb9cb803d5aa3300c186f40e9e36f820352ed16458b415561` |
| `src/analysis/experimental/structured-v4-provenance.js` | `90f6cccbfaf5c91bc20de09aa609d1d704cb7e0f0129ce86154a038415505e5b` |
| `src/analysis/structured-v4-production.js` | `dc94739d9b567f2e0d629bca4a56c6f100b4138118e95c4e27917b651e889376` |
| `src/storage/history.js` | `22a16fec688f310a10ef831f5153dfe0d92226e7b063246bb06502767f203c21` |
| `src/storage/delivery-queue.js` | `0ed937fdbced2576f3003cf8e2faadd70a59d6019ce883aca0bdfae5064f05e9` |
| `src/storage/message-boundaries.js` | `fac6faf5ed8556ff828b77e2b546f4b17ac1367b1b084a68ce84b7fcd0eb58ba` |
| `src/clients/dingtalk.js` | `a9f70ab435c8c938a575f28cccf58aaa92898414f6231a9703daef51e40e46d3` |
| `src/config.js` | `5295504f04e722a28a80edcb9fb740649a7075956dc3fc1a6878c3b2136f7e65` |
| `src/main.js` | `5a2b84755a9888d49131aa24a3fc439719527af8b49a4f5d371e00b66666ba5e` |
| `src/intelligence/packet.js` | `f4e7e7ff7e5a6caeea30d2afd24e494ffb0b9fa0d218e3e19d4aeb2bc3097f84` |

47项原有源码包含Scanner/Facts/Detector、Selector、V4合同、History/Outbox/投递实现、调度、模型客户端。B5 BEFORE中43个原有src相同，另3个config/main/packet已在Selector授权报告中列明；opportunity-selector作为该任务新增，以Git AFTER为依据。不能通过回退这3个文件恢复旧Judge合同来凑测试通过。

环境/data：B5中.env原SHA与当前相同；旧Outbox/Facts/模型快照等6879条匹配。Dashboard起点8348条data/.env匹配当前全部，既有core47项也匹配，不新增生产数据。上述验证证明本轮没有生产完整性回归；它不能证明未保存的旧History全部内容与近期状态间每次变化都经过授权。

## 7. 新Web代码依赖与副作用审计

| 入口/模块 | 读取/执行依赖 | 实际副作用边界 |
|---|---|---|
| package web→src/web/server.js | 仅自身config/reader/security/process + Node标准库 | 本机HTTP监听、Web日志/内存会话；无main/Scanner/Selector/V4/History writer/client imports |
| reader.js | fs/promises、path、sanitize | 只读realpath/stat/readFile/readdir；内存缓存；没有write/mkdir/rename业务文件 |
| config.js | fs/path/url | process.loadEnvFile只读取.env/.web.env并加载本进程变量，不覆盖文件；不导入业务config.js |
| process.js | execFile固定ps或Windows固定Get-CimInstance | 只读进程检查，无不可信命令拼接、无kill或服务注册。HTTP请求仅触发此只读查询 |
| security.js | crypto/util | scrypt/随机内存会话，不触发业务 |
| doctor/password入口 | 自身Web模块、readline | doctor只读配置/索引；password只输出新哈希，不写.env |
| dashboard-replay/visual-check | 显式独立验收入口，非server导入 | 这些脚本会写独立validation报告/截图；不因网页加载执行，未连接生产API。本轮没有执行这些入口 |
| browser app.js | fetch同源/api、DOM、仅主题localStorage | 没有市场/model/DingTalk外部URL；业务API仅GET，POST仅Web登录/退出；不重新Renderer历史文字 |

新增文件不能因为无Git旧SHA就直接认定可信。本结论结合上述依赖/写入口检查、已保存102个隔离测试与本轮生产文件独立字节比较。验收脚本有报告写入必须如实承认，不能称所有scripts都纯读取；它们不在HTTP依赖链。

## 8. 仅供审批的最小迁移补丁方案（未应用）

### P1：仅两元数据文件，候选可另行授权

不改B1–B9历史清单，不扩authorizedCutover为整目录。建议新增专用版本化metadata迁移表，明确commit/from/to/许可增量；只在现有protectedHash针对两个确切路径、两个确切old SHA分支使用审批后的to值。历史from不等于预期时必须失败关闭。另加语义与字节双重测试：package原配置全部保留、scripts只有3个新增、无生命周期钩子；.gitignore只增加3条且.env/data仍被忽略。核心和所有其他文件仍执行原严格SHA断言。

以下是**报告内草案**，并未创建/加载JSON或修改JS。to是待审候选，不是已接受生产基线。

```json
{
  "schemaVersion": "DASHBOARD_METADATA_MIGRATION_DRAFT_V1",
  "status": "NOT_AUTHORIZED_NOT_APPLIED",
  "sourceCommit": "545430b5bea334ffc96621aa19b515d5ee616160",
  "files": {
    ".gitignore": {
      "from": "85ff6e9325b0fd4f98d5021a585a88aca6e74780480d0d4f11cfd48ae18dc746",
      "candidateTo": "49c8fd7263c052f65c2159d9de7b0adc57dd346481d41388678033f7d2e284be"
    },
    "package.json": {
      "from": "bd2d2588a6df38815eaf75e998cf1d13a86de1ff33622f024802f9c5a1fe652c",
      "candidateTo": "d0d67d5845479491437a6b6903a044ab92ac72ac3401a48d3e6fd21816fb70be"
    }
  }
}
```

```diff
--- a/test/output-quality-authorization.js
+++ b/test/output-quality-authorization.js  (draft only)
@@
-export const protectedHash=(file,historical)=>(file.startsWith('data/')||file==='.env')?captured[file]??historical:historical;
+// Only after separate approval of the exact metadata manifest and delta tests.
+export const protectedHash=(file,historical)=>{
+  if(Object.hasOwn(approvedMetadata,file)){
+    assert.equal(historical,approvedMetadata[file].from);
+    assertExactApprovedWebMetadataDelta(file,approvedMetadata.sourceCommit);
+    return approvedMetadata[file].to;
+  }
+  return (file.startsWith('data/')||file==='.env')
+    ? captured[file]??historical : historical;
+};
```

`approvedMetadata`加载、assert导入、assertExactApprovedWebMetadataDelta实现与新测试需在未来批准后补齐；此代码块不是可直接应用的完整补丁，不得运行含占位实现的草案。许可仅两个文件，不能让保留分支指向Dashboard start清单。对data/.env保持原captured引用，绝不扩展到当前值。

预计影响：当前5个metadata首错不会再因元数据报错，但1/2/8/9/10等范围仍含数据不符；逐项全范围枚举表明只第4项compact会整体转绿，其余9项仍至少一个生产状态失败。若其他运行环境不变，预计984/994→985/994、仍9失败；这只是只读分析预期，**本轮没有跑迁移后的测试，不能当通过结果**。

### P2：状态数据不做SHA替换；先补可复现历史环境

1. 保留所有历史清单及有效SHA，不写现有History/Outbox/.env，不把e41cc.../d253...纳入自动接受表。
2. rate旧59字节已SHA验证，可在未来批准后建立独立Fixture副本并记来源分片，断言旧SHA。它不是生产state文件，不改变现有投递。
3. 找回旧History完整快照（备份/受信离线档案），先核验1e7ba...再产生完整字段diff；未找回前原History数据断言继续失败关闭。不能从当前History删19/20字段来伪造旧快照。
4. 未来若批准测试环境拆分：原历史SHA断言仍严格作用于原封存Fixture；另增独立整套测试开始/结束逐文件冻结保护，覆盖当前生产文件及新增目录，变更任一文件立即失败。把Fixture根路径作为显式测试依赖而非全局“允许data变化”分支；修改哪些测试必须另行批准。
5. Scanner/Selector/V4/History/Outbox/DingTalk核心按Git post-Selector合同保护；所有已有src不可因任务授权集合被静默放过，可另增严格独立完整性测试。
6. Windows迁移路径/CRLF不能作为本次理由：本次元数据LF且无路径改变；日后Windows应保留原始字节基线或另外审计，不能自动normalize来忽略修改。

P2尚不能形成可落地的全部迁移补丁：旧History全文缺失是明确剩余阻断。只读Task冻结保护可以证明本轮没修改，但不足以取代旧数据的可信历史来源。

## 9. 最小建议与停止条件

可考虑另行授权：P1精确两文件的metadata迁移表、增量语义断言与相应受控helper分支；禁止任何生产data/.env换SHA。P2需先取得旧History字节或用户明确批准新的隔离测试治理方案并保留旧档，不保证可直接消除其余9失败。

若后续47个旧src任一与Git后Selector不符且无独立授权证据，立即停止，裁决UNEXPECTED_CODE_CHANGE/INTEGRITY_REGRESSION，禁止“更新哈希”解决。本轮没有该情况。

本报告只新增自身；既有报告、Web代码、测试、基线和生产文件均未修改。现存994项运行结果仍984通过10失败；本轮未重跑测试，无新增通过统计。完成后停止，等待用户单独批准任何实际迁移。
