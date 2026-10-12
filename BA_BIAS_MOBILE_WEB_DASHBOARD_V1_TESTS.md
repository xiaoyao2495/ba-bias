# Dashboard V1 · 验收结果

最终状态：**WEB_DASHBOARD_V1_PARTIAL**。

## 自动化

完整执行`npm test`：994项，984通过、10失败、0取消。原有892项保留：882通过、10历史完整性断言失败。新增102项Web测试全部通过。未删除、跳过或弱化旧测试，未更新旧保护哈希。

失败逐项证据：`validation/BA_BIAS_MOBILE_WEB_DASHBOARD_V1/test-failures.json`；完整日志：同目录`test-results.txt`。

- 5项断言首先遇到历史History或DingTalk-rate哈希不符；本轮开始前快照已具有该哈希，证明确属已有真实运行后的状态变化。
- 5项首先遇到package.json或.gitignore哈希不符；差异仅新增Web命令与忽略独立认证配置。
- 每项测试遇到第一个失败即停止，因此没有声称所有后续旧哈希断言都已通过。
- 自动审批拒绝更新旧测试基线，认为可能掩盖完整性失败；操作未执行。保留旧验收清单，不用修改生产状态来满足旧哈希。

102项新增测试覆盖参数校验、分页、Unicode Symbol、旧Schema/损坏JSON、身份/时间关联、原子临时文件、缓存single-flight/有界、实际Selector分项及排名、历史缺失不重算、五类方向、NO_EDGE、失败V4、支持/竞争证据、跨轮时间线、投递状态及分片、Token UNKNOWN、认证/过期/CSRF/Host/Origin/限速、CSP/安全默认值、符号链接逃逸、Windows命令解析、Scanner等待UNKNOWN、进程身份、多实例、1500条索引分页、空状态、只读无业务模块导入、全目录前后哈希。

调用临时127.0.0.1端口属于隔离HTTP测试，不是生产服务部署。浏览器请求拦截限制为本机Origin；无真实Binance、DeepSeek、钉钉请求。

## 静态与真实回放

JavaScript使用`node --check`逐文件检查；结果在`static-results.json`，原有文件检查未移除。

`node scripts/dashboard-replay.js`读取真实12:00、14:00、16:00、19:00四轮数据。19:00 BULLA、LUMIA、RLC的1/4/24h价格、OI数量、已结算Funding、原始score/rank、V4方向/周期/定性强度、实际分片顺序和投递状态全部匹配。12/14/16点无Selector排名，未用回放的现行Selector冒充历史生产结果。LUMIA同周期14:00 BULLISH→19:00 BEARISH按真实有效输出展示研究演化。

回放证据`real-replay.json`，不写Facts、History、Outbox。

## 浏览器实际渲染

macOS现有Chrome通过Playwright执行真实页面。覆盖320/375/390/430px和1280px，6个页面路由（概览、排名、Symbol、Run列表、Run详情、System），另有亮色、Evidence展开、实际分片展开截图。全局横向溢出为false，浏览器错误0、外部请求0。最终首页增加三币速览后，补做375/390/430/1280px验证。完整结果`visual-results.json`、最终首页结果`visual-final-overview.json`；PNG同目录。

实际观察：深浅主题均可读，长Symbol/RunId/DeliveryId可换行，Evidence和消息可展开，表格仅局部滚动，底部导航有安全区且主内容底部留白；首页真实速览先显示最近有效研究三币，并标明来源Run。自动快速翻页首轮触发限速，保留限速并降低测试浏览节奏后通过，没有提高生产限速来满足测试。

这些截图是本机真实已保存生产记录的页面，不是Windows实时服务截图。Windows实机/手机真实设备验收尚未执行。

## 生产完整性

与本轮开始前内存/临时目录冻结哈希逐文件对比：原有核心src、全部生产data和.env无变化，生产目录无新增文件。结果`production-integrity.json`。旧测试自身会重写两个离线证明报告，结束后还原为任务开始时Git内容；不触及任何生产数据或旧哈希清单。

不宣称全套通过或Windows已部署。剩余：旧完整性测试基线治理需要独立批准与可审计迁移；Windows实机启动/关闭/权限和用户手机访问需按部署文档确认。
