# 变更清单

## 生产文件（4个修改、1个新增）

- src/config.js：共享48h配置；不修改.env。
- src/analysis/historical-freshness.js（新增）：毫秒时间判定纯函数。
- src/market/opportunity-selector.js：区分当前比较和归档事件去重；维持原materialEvidence数值规则及评分。
- src/analysis/market-bias-v2/storage.js：先判索引年龄，过期不读取旧正文；明确状态。
- src/main.js：处理状态并复用既有诊断容器；不改研究成功/失败、基线推进、补位或恢复策略。

## 测试（4个修改、2个新增）

- test/previous-research-freshness.test.js（新增）：138项；时间、事件去重、文件读取、主链路、竞争、失败、数据损坏。
- test/fixtures/selector-pre-historical-freshness.txt（新增）：修改前正式Selector原文，SHA256冻结，供离线行为对照。
- test/market-bias-v2-e2e.test.js：同刻历史不再断言null，改为明确非此前状态。
- test/core.test.js、test/hourly.test.js：同事实时间重复运行改断言明确非法/非此前状态；模型/投递不重复等断言保留。
- test/selector.test.js：旧配置保护仅排除本轮明确新增的一行，并单独断言48h默认值；不更新旧文件哈希。Detector精度保护原样保留。

## 本任务交付文件

REPORT.md、TEST_RESULTS.md、CHANGED_FILES.md、ROLLBACK.md；修改前源码/测试快照before/；CHANGES.patch及ROLLBACK_CHECK.json；原始测试日志；TEST_SUMMARY.json、BASELINE_FAILURES.md、STATIC_CHECKS.json；BEFORE_HASHES.json、INTEGRITY.json、CONTRACT_INTEGRITY.json、VALIDATED_CODE_HASHES.json；replay.mjs与REPLAY_RESULTS.json；Git状态清单。

未复制生产Facts/模型原文/环境内容，仅保存必要的文件哈希与回放汇总。before/只包含本任务源码和测试原文。

## 原有工作区

package.json任务开始前已有4行增加、1行删除，本任务保持其字节不变。原有audit/、experiments/、shadow-data/、历史design/implementation/validation及其他未跟踪资料保留；无暂存、提交或清理。

8490个已有文件被纳入初始完整性清单，8个授权源码/测试变化，其他8482个未变；没有生产数据新增、删除或变化。新模块、新测试、原版Selector Fixture及本目录交付文件不在初始清单中，已另行列明。
