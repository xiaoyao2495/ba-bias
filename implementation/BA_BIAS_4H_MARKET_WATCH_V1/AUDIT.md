# 只读源码审计与最小方案

审计先于生产Web代码修改完成；实现前已向用户说明结论和最小方案。实际生产源码优先于旧文档。审计包含server、reader、public-routes、public-dto、security、index.html、app、presentation、CSS、opportunity-selector、scan-daemon、scheduler和现有public-web/web-dashboard测试。

| 检查项 | 原实现及证据 | 裁决 |
|---|---|---|
| 首页数据 | Reader.overview原代码向前取最多24轮；找到首轮有效研究即break，cards.slice(0,3) | 是单轮回溯，不是4H聚合。现仍保留在reader.js:124–128作为旧字段兼容路径 |
| 前端主展示 | app.js原overview另外请求runs、最近完成run及其SELECTED币种详情，再调用observationState | 旧主区主要显示最近完成一轮；本次增加独立4H主区，Latest Scan保留 |
| 公开字段 | public-dto.js原overview再次list(cards,3) | 不通过扩张旧cards冒充聚合；新增独立marketWatch白名单 |
| 历史检索 | reader.js runsIndex读取V2 History、skips，最多100个孤立结果补充；按计划/开始时间排序 | 可继续复用索引；固定4H槽另按精确RunId读取，防止100个孤立目录上限遗漏应查时槽 |
| 完成定义 | reader.js run返回COMPLETED_RECORD的条件：finishedAt存在且非RUNNING | 新聚合额外验证状态、整点计划时间、RunId、完成时间和Facts截止，拒绝运行中及未来记录 |
| 分数来源 | opportunity-selector.js记录score、rank、status及dimensions；Reader.selections读取原文件 | 有足够评分信息，不调用Selector重算；缺分保持null |
| 研究证据 | reader.js research校验Facts的Symbol/RunId/dataCutoff，校验研究绑定Hash、输入Hash及guardResearch | 可复用；新聚合仍经该路径，不直接读取模型原始响应当成有效结果 |
| 去重 | 原业务History/Selector用于研究去重，但Web未聚合跨Run的Symbol | 在Web纯函数中按Symbol汇总，不修改业务去重 |
| 计划时段 | scan-daemon.js:9全天0 * * * *、Asia/Shanghai；hourlyRunId固定；scheduler.js启动同一Scanner | 当前没有夜间非运行时段；夜间缺失应明确标缺失，不能称休市 |
| 公私边界 | server.js认证、Host/Origin/CSP、public-routes.js GET白名单、public-dto.js字段投影、security.js sanitize | 全部保留。新字段不开放原始研究审计/日志/Outbox |
| 缓存和刷新 | Reader文件/目录/索引TTL默认10秒，单飞和容量限制；前端30秒刷新，缓存失败提示 | 继续沿用；新增4H衍生结果同TTL单飞缓存，整点键改变即失效 |
| 页面布局 | index.html三入口、style.css既有卡片/grid/移动适配 | 直接复用；无HTML/CSS或整体设计重构 |
| 测试扩展 | 现有隔离临时文件、webResearch合成绑定、Mock、loopback认证/公开测试 | 可扩展，已添加独立4H fixture和两个原API兼容用例 |

## 数据支持结论

已有result/selection/facts/research/audit/skip记录能满足需求，不需要Binance、LLM或新生产文件。最小方案是在Reader添加只读marketWatch，使用独立纯函数处理固定时间槽及跨币种排序；扩展既有overview DTO和首页展示。没有新增API路由。

## 唯一新增生产模块的理由

src/web/market-watch.js只包含时间窗口、去重和保存分数排序，不导入Scanner/Selector/Storage/网络客户端。将确定性计算与Reader文件I/O分离，便于Fake Clock测试，不复制或改写生产Scheduler。
