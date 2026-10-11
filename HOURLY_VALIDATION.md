# BA-BIAS 常驻扫描与钉钉验收

> 此文件保留当时的历史验收结果。其中每轮2篇、每日30篇以及文章驱动流程已被后续情报版本替代；当前行为见 README.md 与 INTELLIGENCE_VALIDATION.md。

验收日期：2026-10-10。运行环境 Node.js v23.11.0。本次只增加调度与投递管理，Facts Engine、Story Judge、Draft Writer、Claim Guard 保持原内容，扫描阈值与候选规则不变。

## 文件与结构

```text
ba-bias/
├── package.json / package-lock.json  # scripts；node-cron、proper-lockfile
├── .env.example                     # 仅 Webhook；不需要签名密钥
├── README.md
├── VALIDATION.md                     # 保留原版验收记录
├── HOURLY_VALIDATION.md
├── src/
│   ├── scan-daemon.js                # 新增：前台调度入口
│   ├── logging.js                    # 新增：北京时间阶段日志
│   ├── main.js                       # 共享 runResearch / 完整摘要
│   ├── scheduler.js                  # 同一入口的兼容别名
│   ├── config.js                     # 移除签名密钥配置
│   ├── clients/
│   │   ├── dingtalk.js               # 关键词 text / errcode / 无签名
│   │   ├── http.js                   # 保留安全 HTTP 状态与重试间隔
│   │   ├── binance.js                # 未改
│   │   └── deepseek.js               # 未改
│   ├── storage/
│   │   ├── history.js                # 心跳租约、崩溃恢复、独立每日计数
│   │   └── delivery.js               # 新增：投递状态、有限重试、幂等
│   ├── market/                      # detector / scanner / facts-engine，未改
│   └── content/                     # judge / writer / guard / schemas，未改
├── test/
│   ├── core.test.js                 # 原有33项保持
│   ├── fixtures.js                  # 原合成数据保持
│   └── hourly.test.js               # 新增33项 Mock API / Mock Clock
└── data/
    ├── runs/<runId>/result.json
    ├── outbox/<runId>_<symbol>.json
    └── state/history.json
```

## 命令与调度

| 命令 | 行为 |
| --- | --- |
| `npm run scan` | Node 前台常驻，完整研究并自动通知合格新稿 |
| `node src/scan-daemon.js` | 同一常驻入口 |
| `npm run scan:once` | 一次行情与 Facts，不调用 LLM、不发送 |
| `npm run once` | 一次完整研究，默认不发送 |
| `npm run once -- --send` | 一次完整研究，允许发送本轮合格新稿 |
| `npm run doctor` | 环境与 Binance 连接检查 |
| `npm test` | 全部离线测试 |
| `npm run scheduler` | 常驻入口兼容别名 |

使用 node-cron：`0 9-23 * * *`，`timezone=Asia/Shanghai`。Mock 测试通过实际 cron 匹配器逐小时检查全部24小时：仅09–23匹配，15个计划点；23:00之后下一次为次日09:00。也验证主机时区不参与小时判断、非时段不运行、启动不运行、不补跑、10秒收盘延迟、稳定小时 runId、重复小时、跨重启去重、重叠跳过、失败后继续下一轮。

核心入口 `runResearch` 同时供手动与调度调用。调度只传入计划时间、稳定 runId、HOURLY、发送开关和中断信号。原数据窗口、阈值、筛选、Judge/Writer/Guard与每轮2篇/每天30篇限制保持。每轮保存完整摘要，零文章、失败、中断和跳过也保留；跳过记录通过不覆盖的原子写保护已有结果。

SIGINT/SIGTERM 取消等待与请求，等待持久化结束并释放运行锁。租约通过原子目录与心跳管理；5秒过期并确认旧 PID 已退出后恢复，活进程不抢占。测试包括死进程残留锁、过期租约、活进程锁、并发争用、重复释放、中断持久化、收盘等待期退出及调度启动失败清理。

## 钉钉来源与防重复

只读参考旧项目 `/Users/yaodebao/Desktop/git/ict03/ict-market-context/notify/dingTalk.js`：其 `buildUrl` 无 secret 时直接返回 Webhook。按用户最新要求仅用 `DINGTALK_WEBHOOK` 原样发送，不读取签名密钥、不添加 timestamp 或 sign。发送 text 消息包含「检测」、北京时间、symbol、类型、标题、正文、事实证据、风险观察、runId 和人工审核标识。沿用旧项目 `errcode === 0` 成功判断，HTTP 200 不等于业务成功；默认直连，超时15秒，显式配置可启用现有代理。

每篇文章有稳定 deliveryId，先原子保存 Outbox 及 PENDING，再持久化 SENDING，才发请求；明确成功记录 SENT 和确认时间。业务失败记 FAILED，超时/连接中断/无法确认响应记 UNKNOWN。明确临时失败最多2次尝试；UNKNOWN 不重试。崩溃留下 SENDING 下次恢复为 UNKNOWN；历史 Outbox 不被补发。Judge/Guard proof、当前 runId、生成时间、发送开关、已发送状态以及进程内 inFlight 共同保护投递。没有合格文章不发送任何钉钉状态消息。

## 实际验收结果

- `npm test`：66项，66通过，0失败；原有33项 + 新增33项。全部 Mock，不联网、不消耗 token、不发送真实消息。
- `npm run doctor`：退出码0，Node版本满足要求，已有4项环境配置存在，Binance时间接口成功；DeepSeek/DingTalk均 NOT_CALLED。
- `npm run scan:once -- --run-id hourly_acceptance_scan_20261010`：退出码0、COMPLETE，扫描924、深查24、Facts包24，其中18个合格研究候选；耗时24,666ms；errors为空。独立验收runId避免与旧验收同小时记录冲突。
- 单次扫描 generatedArticles=0，dingTalkSent/Failed/Unknown均0，judgedCandidates=0，tokenUsage全0，deepseek-calls.json为空。结果保存在 `data/runs/hourly_acceptance_scan_20261010/result.json`。
- 退出后 state 仅余 history.json，无运行锁或租约残留。
- 本次真实钉钉发送：NO。本次真实常驻进程：NO。本次真实 DeepSeek 调用：NO。
- 旧 ict-market-context 修改：NO；仅只读参考。
- `.env` 未覆盖，SHA256前后相同：`8e56336d9f7d53c0b6ebe0da25709b37a213a86fe07463c065a946cfd0ad4adf`。
- Facts/Judge/Writer/Guard SHA256 与本次开发前一致。

## 用户启停

在项目目录运行 `npm run scan` 或 `node src/scan-daemon.js`，保持终端打开。启动等待下一个计划小时；未来轮次新合格文章会自动发送钉钉供人工审核。按 Ctrl+C 受控停止。不安装进程管理器、不设置后台或开机启动，不自动发布 Square。
