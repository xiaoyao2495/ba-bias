# 精确变更

本轮改变以下9个已有（尚未提交的原型）文件：

- src/storage/retention.js：复用年龄与资格计划，取消永久Manifest阻塞/迁移入口，单操作恢复、生产显式授权、完整清退和基本VERIFY；保留Selector摘要。
- src/storage/retention-manifest.js：保留路径和SHA检查，改为当前保留范围合同；移除永久退役证明验证。
- src/lifecycle/retention-state.js：只读小状态/在途文件识别；移除overlay/proofHashes与指纹缓存。
- scripts/data-retention.js：AUDIT/DRY_RUN/APPLY/VERIFY；精确删除确认和绝对根；移除PREPARE_MIGRATION。
- src/storage/market-bias-v2-state.js：保留pending保护，增加新Manifest与当前状态绑定。
- src/web/reader.js：复用只读状态，统一epoch失效，支持History简短退役记录410。
- test/data-retention.test.js：原49项保留，按新合同调整Manifest替换、错误位置、确认参数、摘要保留等断言。
- test/retention-manifest-migration.test.js：43项旧永久证明合同改为44项当前生命周期合同验证；保留对应故障与数据保护覆盖。
- test/retention-migration-fixture.js：复用原合成原始数据与L/S/N，更新根确认参数。

新增：

- test/simple-retention.test.js：19项新业务验收。
- implementation/BA_BIAS_SIMPLE_RETENTION_5D_V1/：6份要求报告、备份补丁、SHA/测试/复杂度与回收测量、回滚补丁和仅临时Fixture的isolated-demo.mjs。

未改：package.json原有趋势脚本、前两任务交付目录、Scanner/Detector/Funding/Selector/48h/模型/Prompt/Guard/研究存储与Delivery实现；所有真实data、shadow-data及环境文件。BEFORE_HASHES是只读完整性指纹，不是这些数据的备份副本；源码备份仅包含授权9文件。

## 旧测试合同对应

- “旧Manifest永远不能改” -> 受控替换后仅目标条目退出，原始SHA记录与非目标SHA完整。
- “需要永久COMPLETED事务/overlay” -> 成功无需逐文件历史证明；未完成active仍必须校验，损坏/丢失阻断。
- “64条永久日志阻止继续清理” -> 66批通过且只有小state文件。
- “退役清空Selector摘要” -> 摘要保留，相同异常继续去重，实质变化仍可入选。
- “生产APPLY永远拒绝” -> 默认拒绝，明确root与精确短语可操作任意符合合同的合成data目录；不使用真实DataRoot验收。
- “缺失state不可恢复” -> 完好active可识别、验证并恢复；缺失active且pending存在仍拒绝。

这些是用户本轮明确替换的合同，不通过删除或skip测试规避错误；未更改既有16项保护哈希测试。
