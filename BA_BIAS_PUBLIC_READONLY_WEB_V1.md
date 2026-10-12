# BA_BIAS_PUBLIC_READONLY_WEB_V1

最终状态：**PUBLIC_READONLY_WEB_PARTIAL**。

真正的显式匿名公开只读模式已实现，原私有认证模式完整保留；匿名白名单、Public DTO、安全与回滚测试通过，真实本机Chrome页面通过。iPhone Safari/WebKit运行环境及腾讯云Windows公网实机未验证，未将其标成READY。本轮未提交/推送、未部署或开放公网。

## 模式与配置

仅BA_BIAS_WEB_PUBLIC_READONLY精确为1才启用PUBLIC_READONLY；0、未配置或其他值均是PRIVATE_AUTHENTICATED。公开模式不要求/使用密码哈希，不创建登录Session；私有模式原密码校验、Cookie、Session、远程HTTPS/显式私网限制保留。

公开远程HTTP仍要求BA_BIAS_WEB_ALLOW_REMOTE=1、有效实际BA_BIAS_WEB_ORIGIN；0.0.0.0不可当浏览器Origin，远程公共模式不接受推断出来的127.0.0.1/localhost Origin。仅公开模式豁免私有远程HTTP限制，不用PRIVATE_NETWORK冒充公网许可。

默认host=127.0.0.1、port=8787不变。真实部署使用0.0.0.0:8787，Origin=http://用户实际公网IP:8787。PM2入口仍src/web/pm2-entry.js，不新增实例或改Scanner入口。

.env与.web.env加载函数未改：已有process.env（包括PM2保存的值）优先，.env先填缺失项，.web.env再填缺失项。部署文档使用CMD显式设置模式/网络值后pm2 restart ba-bias-web --update-env，避免旧PM2环境覆盖。凭据文件和业务.env不覆盖，模板默认仍私有。

## 全路由审计与权限矩阵

| Method / 路径 | 原私有模式 | 公开模式 | 文件读取/字段/副作用 |
|---|---|---|---|
| GET /api/web-mode | 无需登录，仅模式枚举 | 无需登录，仅PUBLIC_READONLY | 无业务读写、无Session；用于客户端分支选择 |
| GET /、/selector、/history、/runs、/runs/:id、/symbol/:symbol | HTML壳可读，业务API需Cookie | 匿名页面 | 固定index.html，首屏诊断元素hidden |
| GET /assets/app.js、style.css、presentation.js | 固定静态资源 | 固定静态资源 | 只读web目录白名单，无整个项目静态根目录 |
| GET /api/overview | 原Reader视图 | 独立Public DTO | 读Run索引/摘要/已保存研究。未完成最新Run只放最小业务状态，不放临时排名或统计；最近有效研究明确分开 |
| GET /api/runs | 原分页/全部私有筛选 | 已完成Run摘要 | completedOnly，公开q/symbol/status/from/to/page/limit；不允许delivery/notification/v4/任意path筛选 |
| GET /api/runs/:id | 原完整Run、成本与投递 | 已完成业务摘要/保存Selector | 拒绝未完成详情；不返回错误、usage、耗时、进程或投递字段 |
| GET /api/selector | 原完整保存决策 | 保存分数、排序、分项、gate、更新证据与reason code | 默认最近完成Run；不重算，maxCandidates仅保存的业务预算，不返回内部错误/文件索引 |
| GET /api/symbols/:symbol及runId/page/limit | 原研究/Timeline/消息/投递 | Public研究/Evidence/已完成Timeline | 按校验后的RunId/Symbol只读可信记录；V4与口径映射复用Reader，不暴露LLM input/response或原Outbox |
| GET /api/health、/api/system、/system | 原认证诊断 | 403 | 公开请求不会进入health/processProbe或执行进程命令 |
| GET /api/session、/api/login、/api/logout | 原有认证合同 | 403 | 公开不解析/使用旧Cookie，无Session管理 |
| POST /api/login、/api/logout | 原有Origin/CSRF/限速 | 405；带请求体先413 | 公开不调用密码验证/创建Session |
| 所有其他非GET方法 | 原限制保留 | 405/413 | 不读取写入业务数据，无任何生产写API |
| 其他路径，包括.env、data、logs、outbox、src、package、map及任意未知API | 原静态限制/认证 | 默认403 | 不公开文件下载、日志、目录、任意根目录文件 |

公開不是全局skipAllAuthentication：独立publicRoute显式路径+Method白名单，在私有认证路由之前分派；仅publicGet构造DTO后返回。后端拒绝诊断和认证管理，即使伪造Cookie/Authorization仍拒绝。私有API原响应不通过Public DTO，保持已有功能。

Reader继续realpath防逃逸、身份/时间/Schema校验及原子读一致性，PUBLIC额外要求完成索引与结果；损坏/越限索引fail closed，不把有限目录回退假称最新完整历史。无历史可以显示空状态。completedOnly默认false，私有行为不改。

## Public DTO逐字段边界

| 类别 | 允许字段 | 明确排除 |
|---|---|---|
| Run | RunId、状态、scheduledAt/dataCutoff/finishedAt、Facts/合格/入选/有效V4计数 | startedAt/耗时、完整errors/stack、candidateEvaluations、unassessed、usage/token、delivery/outbox |
| Selector | Symbol、保存rank/score、状态/Reason Code、gate、分项/强度/分数、共振、更新证据、稀有性业务状态 | 原comparison.previous/current复杂记录、文件索引/读取错误、内部调试字段 |
| Facts指标 | 1/4/24h闭合价格/OI数量、独立滚动24h、relative1h量倍数、结算/展示Funding、数据时间/定义/单位/Evidence ID | raw响应、密钥、任何原始生产文件内容、未知指标字段 |
| 账户/持仓 | 明确scope、1h period、样本时间、账户比例或顶部持仓份额、百分点变化、翻转事实/质量 | 原样本原文/headers；持仓不解释为账户或全市场OI占比 |
| V4 | 已验证五类方向/不可用、horizon、定性conviction、支持/竞争ID、保存的审计过rendered结论、复核/失效、观察枚举 | 原始LLM input/request/response、Prompt、provider配置、validation错误和未审计originalAnalysis子树 |
| Evidence | 同Symbol合法ID、数值/翻转业务对象、角色、时间/来源白名单、公式、少量查询参数 | headers、token、代理、raw数据、任意endpoint/URL、未知metadata |
| Timeline | 完成研究、同周期有效方向变化、分页/业务覆盖限制 | 内部文件列表/状态摘要原文、原投递与私有消息 |

DTO逐项创建对象，不先spread生产JSON再删少数键；未知字段默认不公开。同Symbol ID格式约束、数值类型、枚举、时间范围和数组长度明确。文本再次遮盖已加载凭据、scrypt哈希、URL、Windows/Unix路径、凭据赋值/私有地址；未审计的providerHeaders/systemPrompt/stackTrace等嵌入式元数据关闭展示。

无原始DingTalk分片、article、deterministicText、完整Outbox或Provider请求。公开详情的完整结论来自已保存且审计过的V4 rendered字段与Evidence，不重新生成Writer/预测。NO_EDGE无方向失效，ANALYST_UNAVAILABLE不冒充NO_EDGE，分数/强度不换算胜率。

## 前端与基础安全

观察/排名/历史沿用当前界面。公开不显示登录、退出、系统图标（HTML首屏隐藏+前端隐藏）；不向session/health/system/login/logout发请求。API fetch使用credentials=omit。只显示数据时间/真实业务状态及过期提醒，失败Run不标成成功。原私有登录、诊断、投递明细只在私有模式存在。

保持CSP、textContent安全渲染、no-store、Host/Origin/cross-site检查、固定静态资源、无CORS通配与任意文件API。公网新增/保留：GET白名单；所有请求体拒绝；URL≤2048；公开分页1–12/page≤10000；查询值≤100且按路由验证；JSON响应≤1MiB（越限503）；每IP60次/分钟，公开业务全局600次/分钟、同时最多4个数据响应；不信任X-Forwarded-For；15秒请求/10秒header超时。

公开默认Reader JSON缓存100项、一般单记录≤2MiB，权威history索引≤16MiB，目录缓存/历史扫描仍沿用原有有界覆盖；越限/损坏返回脱敏错误，不改生产记录。私有Reader默认500项、16MiB单文件保持。

Cookie只用于私有模式。公开不创建/使用Session，忽略并过期旧Cookie；默认127切新公网IP时旧Host-only Cookie不跨Host。若同一Host曾私有HTTP登录，需先清站点数据；服务器不能控制浏览器首次导航自行附带历史Cookie，部署文档明确列此条件。当前公开客户端后续API不携带凭据，重启后的旧Session已失效。

## 修改文件与保持不变

修改：.web.env.example、src/web/config.js、server.js、reader.js；scripts/dashboard-doctor.js；web/assets/app.js、style.css；test/web-pm2-fixture.js（补新导入Mock）、web-pm2.test.js（新增两平台public启动用例）。原认证/安全断言未删除、跳过或放宽。

新增：src/web/public-dto.js、public-routes.js；test/public-web.test.js；scripts/public-web-visual.js；三份本任务文档和独立validation证据。

Scanner、Scheduler、24小时Cron、PM2 Scanner入口、Facts Engine、Detector、Selector评分/Top K、V4合同、History/Outbox/DingTalk实现、package/lockfile、原.env/.web.env、全部生产数据保持不变。开发前保护的8399项字节零差异，生产目录新增文件0。

本次没有查阅/调用Binance、DeepSeek或DingTalk，没有HTTP请求启动/停止PM2、写业务配置或触发研究。成功/失败访问只改可重建内存缓存及私有Web测试Session。

## 测试、真实页面与部署条件

- 新公开专项79/79；旧私有Web102、展示38、旧Web PM220及新增public PM22全部通过；Web合计241/241。
- Node23.11.0和可用Node24.19.0均241/241；不冒充目标Windows24.15.0。
- 全部JS静态117/117；git diff --check通过。
- npm test：1175项，1163通过，12失败，取消/跳过0；与本轮开始前失败集合相同。
- Chrome实际30组路由×宽度（320/375/390/430/1280）及Evidence展开共31图，无溢出/JS错误/外部请求。公开API Cookie0、processProbe0；刷新/Back/断网恢复/30秒轮询通过。
- 服务在内存切回私有，真实Chrome登录、Session刷新、诊断/退出恢复通过，无配置文件改写。
- 本机WebKit未安装，iPhone Safari及腾讯云Windows公网连接/监听/PM2环境/防火墙实际验收未执行；因此PARTIAL，不能现在标READY。

证据见validation/BA_BIAS_PUBLIC_READONLY_WEB_V1。完整测试12项包含原10项历史基线/生产状态问题，以及已授权24小时调度导致的2项冻结源码合同冲突；未修改旧History哈希或接受新的冻结SHA，详见此前两个审计/24H报告。本轮没有新增失败测试。

公开HTTP可被网络观察/缓存/篡改，页面脚本和结论传输真实性也无HTTPS保证。它不等价HTTPS。服务只提供匿名研究，不能以HTTP公开为理由发送私有密码/Session或开放诊断。风险为用户明确选择的剩余风险。

代码与应用级隔离验收已完成，可以作为**人工公网部署验收候选**；先另行发布代码，再由用户按Windows部署文档确认唯一Web、真实Origin/绑定、匿名页面、拒绝接口、网络规则和Safari。出现同Host历史Cookie、配置不正确或安全测试异常时不得强行开放。

## 验收问题逐项回答

| # | 问题 | 结果 |
|---|---|---|
| 1 | 真正无需密码 | 显式PUBLIC_READONLY=1，无密码、Session或身份Cookie |
| 2 | 私有认证完整 | 默认/0/非法值继续私有，旧全部认证测试及浏览器回滚通过 |
| 3 | 匿名API | web-mode、overview、完成runs/run、selector、symbols/Timeline明确GET白名单 |
| 4 | 拒绝API | health/system/session/login/logout/logs/env/outbox以及全部未审批路由/写方法 |
| 5 | 字段脱敏 | 独立Public DTO +值/文本校验，未知字段默认删除 |
| 6 | 敏感系统泄露 | Mock攻击字段测试未泄露；无进程/日志/路径/请求/Token/凭据字段 |
| 7 | 严格只读 | API无业务写入，生产前后哈希不变 |
| 8 | 业务副作用 | 0，无Scanner/V4/市场/钉钉调用，公开processProbe0 |
| 9 | HTTP风险 | 观察与篡改/脚本替换，非HTTPS等价；同Host历史Cookie需先清理 |
| 10 | Windows PM2 | 原专用入口保留，Node24及0.0.0.0模型通过；Windows实机待验 |
| 11 | 8787 | 默认8787；代码未替服务器启用公网监听 |
| 12 | Origin | 必须实际公网IP+端口，Host/Origin严格匹配，wildcard不可当Origin |
| 13 | 修改Scanner | 不需要且未修改 |
| 14 | 修改生产数据 | 不需要且未修改 |
| 15 | 原Web测试 | 全部通过，未弱化认证断言 |
| 16 | 新安全测试 | 79公开专项+2public PM2启动通过 |
| 17 | 完整结果 | 1163/1175，12失败明确保留 |
| 18 | 旧基线 | 完整保留，无SHA迁移 |
| 19 | 回滚 | 配置校验与真实本机浏览器私有登录/Session/诊断/登出验证通过 |
| 20 | 公网部署验收 | 可进入用户受控人工验收；尚非Windows/Safari验收完成，不自动发布 |

没有自动提交/推送、连接腾讯云、开端口/防火墙、重启PM2或Scanner。所有隔离测试服务结束后关闭。
