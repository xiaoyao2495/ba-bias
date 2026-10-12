# BA_BIAS_DASHBOARD_SIMPLIFICATION_V1_TESTS

最终状态：**DASHBOARD_SIMPLIFICATION_V1_PARTIAL**。UI验收通过，完整套件仍有旧10项失败。

| 检查 | 结果 | 证据 |
|---|---|---|
| 完整npm test | 1032项，1022通过、10失败、取消0、跳过0 | validation/BA_BIAS_DASHBOARD_SIMPLIFICATION_V1/full-tests.txt |
| 展示与Web专项 | 140/140：38新增+102原Web | web-tests.txt |
| 全部JS语法 | 107/107 | static-results.json |
| 实际浏览器渲染 | 35组宽度/路由，38张截图，溢出0、JS错误0、外部请求0 | visual-results.json、dark-*.png |
| Browser内存Mock状态 | 7项通过 | browser-scenarios.json |
| 实际历史只读回放 | 19/20点6个对象，LUMIA14→19方向演化；23点缺失 | real-replay.json |
| 生产完整性 | 8394项保护字节无差异，新增生产文件0 | before-hashes.json、production-integrity.json |

以上证据全部在独立 `validation/BA_BIAS_DASHBOARD_SIMPLIFICATION_V1/`，不是生产数据。没有删除、跳过或弱化旧测试，也没有迁移旧哈希。

## 新测试范围

精确1h价格、OI数量与成交量定义；结算Funding口径；Evidence关联；数值0与缺失区分；未来样本/错窗口/缺时间/错误单位定义关闭展示；Detector已经保存的量异常且排除5m替代；账户与持仓、百分比与百分点区分；顶部/全市场分歧必须已有异常及同周期同样本；标签最多4个并可追溯；摘要禁止交易行为和未来方向推断；只选同Run的SELECTED且VALIDATED研究；NO_EDGE保留、不把不可用当NO_EDGE；未完成/无历史/无资格/无入选区分；三卡片限制不修改记录；正式MODERATE强度映射；三导航、诊断次级入口及各路由归组；采集截止晚于整点仍正确显示精确小时数据；索引/完成状态竞争关闭展示。

## 浏览器验收

320/375/390/430/1280px，观察、Selector、历史按币种、历史按运行、Symbol、Run详情、系统诊断。实际登录与认证保持；原Evidence、评分、完整消息可展开。主导航记忆Symbol查询；浏览器Back回到之前页面。主动中断API刷新后DOM保留，明确标数据已过期。NO_EDGE、无资格、无入选、V4不可用、未完成、无历史以及停止/过期使用内存HTTP响应Mock单独验收，不伪造磁盘记录。

这是macOS现有Chrome真实渲染，不是iPhone Safari实机。指定23点SUSDT/MAGICUSDT记录不存在，未将任务示例数字写入业务数据。Windows部署未执行。

## 保留的10项旧失败

1. Judge recovery, detectors, queue, History, scheduler and production state remain byte-identical
2. production scan command and protected files retain baseline bytes
3. history/outbox/raw model responses/env remain byte identical in offline suite
4. all protected production logic and original tests remain unchanged
5. NO_EDGE forensic 43 History hashes immutable
6. output quality 53 History immutable
7. Selector 39 production files identical
8. V4 all pre-existing files including production and old experimental contracts remain identical
9. V4 protected existing files incl V3, state, env, snapshots are unchanged
10. production 49 original data env detectors Judge queue scheduler bytes preserved

这些失败与开发前已记录的10项一致：首个失败涉及.gitignore/package.json或动态History/dingtalk-rate状态。完整逐项裁决仍见此前HASH_BASELINE_FORENSIC报告；不因新增UI验收通过而消除或隐藏它们。

测试执行时临时端口需要本机HTTP绑定权限，已在授权隔离范围内执行。第一轮绑定受沙箱限制未完成的尝试不作为通过证据。最终测试与浏览器日志均来自成功绑定后的完整执行。所有自建临时服务已关闭，未发送任何真实钉钉或外部API请求。
