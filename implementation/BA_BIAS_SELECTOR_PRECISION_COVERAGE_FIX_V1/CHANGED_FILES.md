# 变更清单（含测试合同收尾）

## 本轮新增/修改

- 修改 test/selector.test.js：只调整Selector30及必要的Big、原账户检测函数、现有原始Fixture import。保留测试名称、其余51项测试及全部旧SHA文件。
- 新增 test/fixtures/detector-pre-funding-precision.txt：已用原SHA验证的旧Detector源码，仅作测试引用。
- 更新本目录REPORT.md、TEST_RESULTS.json、INTEGRITY.json、static.json、full.txt、targeted.txt、CHANGES.patch、Git清单。
- 新增TEST_CONTRACT_CLOSURE.md/.json/.patch、contract-affected.txt、before/test/selector.test.js及pre-contract-closure-*证据副本。

## 前轮业务修改，本轮保持字节不变

- src/main.js
- src/market/scanner.js
- src/market/detector.js
- src/market/run-diagnostics.js
- test/selector-precision-fixture.js
- test/selector-precision-coverage.test.js

其他任务的package.json修改及所有未跟踪资料均保留，未暂存、提交或推送。完整git status/diff/check在GIT_STATE.txt；未跟踪清单见UNTRACKED_AFTER.txt。
