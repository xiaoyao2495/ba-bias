# BA-BIAS V1 实际交付与验证

验证日期：2026-10-10，Asia/Shanghai。当前项目独立运行，无 AI Pro 输出依赖。

## 1. 实际创建和修改的文件

修改已有 `package.json`、`package-lock.json`。创建以下文件；原 `.env` 未修改：

```text
.env.example
.gitignore
README.md
VALIDATION.md
src/config.js
src/main.js
src/scheduler.js
src/clients/http.js
src/clients/binance.js
src/clients/deepseek.js
src/clients/dingtalk.js
src/market/scanner.js
src/market/detector.js
src/market/facts-engine.js
src/content/schemas.js
src/content/story-judge.js
src/content/draft-writer.js
src/content/claim-guard.js
src/storage/history.js
test/fixtures.js
test/core.test.js
```

真实运行文件保存在被Git忽略的 `data/`：runs、outbox、state；最后测试原始日志为 `data/test-results.txt`。便于人工阅读的合格文章汇总为 `data/outbox/review-live_v1_verified_20261010.md`。

## 2. 旧项目复用方式

只读检查旧项目package、合约REST、HTTP transport、rate governor、network、DeepSeek、DingTalk实现。沿用Axios、ICT代理环境变量与显式proxy、JSON completion/关闭thinking/DeepSeek直连、429与权重冷却、钉钉HMAC及errcode校验技术方式。加入Big.js及Ajv；使用Node原生.env加载、测试、AbortSignal。没有整体复制旧项目，未引用其运行时路径，不使用现货行情回退。

官方端点与字段参考：[Binance Market Data](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data)。DeepSeek模型与请求参数核对：[官方快速入门](https://api-docs.deepseek.com/)和[Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode/)。

## 3. 环境审计

Node.js v23.11.0，满足>=22要求。

| 变量名 | 是否存在 |
| --- | --- |
| ICT_PROXY_HOST | YES |
| ICT_PROXY_PORT | YES |
| DEEPSEEK_API_KEY | YES |
| DINGTALK_WEBHOOK | YES |

代理读取现有host+port后启用。密钥与完整webhook未打印。`.env`前后SHA-256比较一致，不保存真实内容到报告。原npm默认registry为不可解析的内网地址，沙箱内网络不可用；使用经授权的网络访问和显式官方npm registry安装成功，未改全局npm配置。

## 4. 自动化测试

最终 `npm test`：33通过、0失败、0跳过。使用TEST FIXTURE/mock，不联网、不发钉钉、不消耗DeepSeek token。

覆盖OI数量/名义值、Funding方向与真实累计、价格不同统计口径、账户语义、时间转换、未收盘/缺失/过期/未来/间隔缺口、Crypto与TradFi过滤、去重/实质更新、锁和runId、Guard、默认Shadow、有限重试/并发/取消、扫描预算、整轮2篇及每日30篇限制、端到端持久化。开发过程中发现并修复了mock对受限证据输入的适配问题；最终无失败。

## 5. Binance 真实数据

`npm run doctor`在授权网络环境成功连接服务器时间公共接口。

`npm run scan`成功：runId `scan_2026101010`，读取924个合约，筛出518个Crypto交易对，深查24个，保存24份真实Facts，13个通过深度异常与完整性筛选，耗时24373ms。

最新完整研究：`live_v1_verified_20261010`，读取924个合约，深查24个，19个通过深度筛选；126次HTTP请求、0重试、0权重冷却，本轮最大观察权重885，扫描预算未超时。

最新轮次记录的Crypto数为500，反映当时保守ASCII Symbol校验；最终交付已修正为安全Unicode字母/数字及单字母base接受，并增加测试，仍禁止路径字符。该纯过滤修正后未额外重复付费研究；本轮24份真实Facts与已输出文章重新核验仍通过。

## 6. DeepSeek 真实调用

YES。`npm run doctor:deepseek`返回JSON `{ok:true}`，48 tokens。

最新成功研究模型实际返回 `deepseek-flash`，10次completion，28309 tokens（4次Judge、4次Writer、2次受控修稿）。本次所有完成的现场验证请求总计63017 tokens，包含之前被拒绝输出的34660 tokens及连通性检查48 tokens。失败/未确认请求的潜在计费不由这些成功返回usage证明。

首次完整轮次因外部共享IP权重超过保护阈值而中断，保留部分事实包并记录INTERRUPTED；确认进程停止后清理锁。增加扫描独立3分钟预算后，第二轮完成真实LLM调用但有4个Judge schema错误与2个Guard拒绝，状态PARTIAL，0篇。随后将完整Schema、证据上限与明确允许引用清单写入提示，加入最多一次受控修稿，保持Guard校验要求，最终完整轮次成功。没有伪造行情、强制放行或将这些失败称为PASS。

## 7. Facts Package 位置

初次成功独立扫描：`data/runs/scan_2026101010/facts/`。

最新完整研究：`data/runs/live_v1_verified_20261010/facts/`。

例如 `MAGICUSDT.json`、`PIXELUSDT.json`，包含原始接口响应、参数、时间含义、UTC/北京时间、公式、结果和evidenceId。

## 8. 完整研究与Outbox结果

最终runId `live_v1_verified_20261010`：COMPLETE，0运行错误，耗时41026ms，生成2篇、实际发送0篇。

- `data/runs/live_v1_verified_20261010/result.json`
- `data/runs/live_v1_verified_20261010/scan.json`
- `data/runs/live_v1_verified_20261010/deepseek-calls.json`
- `data/runs/live_v1_verified_20261010/stories/`（含Judge、Draft、Guard及修稿结果）
- `data/outbox/live_v1_verified_20261010_MAGICUSDT.json`
- `data/outbox/live_v1_verified_20261010_PIXELUSDT.json`
- `data/outbox/review-live_v1_verified_20261010.md`

MAGICUSDT正文228字符、PIXELUSDT正文197字符，两者使用各自Facts重新执行Guard，PASS且渲染文本与Outbox完全相同。GMTUSDT/RLCUSDT经过一次修稿仍触发语义规则，已拒绝且未写入Outbox。文风和非数值因果解释仍需要人工审核，不能仅以单元测试或Guard通过声称真实研究质量已全面验证。

## 9. 启动命令

```sh
npm test
npm run doctor
npm run scan
npm run once
npm run doctor:deepseek
# 人工独立复查可指定唯一runId（同一runId不重跑）：
npm run once -- --run-id manual_review_01
# 仅明确需要真实通知时：
npm run once -- --send
# 用户决定启用后手动启动；本次未执行：
npm run scheduler
```

本小时的默认once runId已有INTERRUPTED记录，因此再次运行默认once会返回ALREADY_EXECUTED；当前小时复查使用新的唯一runId，后续小时自动得到新runId。调度规则 `0 9-23 * * *`，Asia/Shanghai。未创建系统cron、PM2任务或启动常驻进程。

## 10. 已实现与限制

已实现完整市场扫描、候选排序、确定性Facts、LLM判断/写稿、程序Guard、受控修稿、JSON原子存储/Outbox/历史对账、实质更新去重、计数限制、锁、有限重试/超时、默认Shadow和显式钉钉入口、CLI及手动调度。

有限候选探测会漏过当轮未覆盖的纯1h/OI/量异常；分类依赖官方元数据与保守排除规则；语义规则会保守误拒，也无法证明所有因果解释；精确采样缺失不补猜值；异常退出残锁需要确认进程停止后人工处理；无独立Outbox补发命令。详见README。

未实现新闻/链上/社交数据、管理前端、数据库服务、自动比较评分、交易、自动发布；没有自动启用调度。

## 11. 钉钉实际调用

NO。所有真实研究sendRequested=false，Outbox状态SHADOW，history确认发送数0；测试也没有调用真实webhook。交易/自动发布均NO。

## 12. 旧项目是否修改

NO。对旧项目仅执行读取和定向搜索，没有安装、构建、格式化、修改或删除。原 `.env`未改；最终无残留运行锁，未留下研究进程或调度进程。
