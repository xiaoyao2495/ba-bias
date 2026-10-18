# BA-BIAS 4H Market Watch V2 — Mobile Compact View

完成日期：2026-10-18。仅本地展示修改与离线验证；未 Commit、Push、部署或启动正式服务。

## 只读审计与最小方案

- `src/web/reader.js:82–128`：已有四槽读取、时刻/截止时间校验、已验证研究与 Selector 分数关联。首页同时返回 marketWatch 与 Latest Scan。
- `src/web/market-watch.js:3–23`：四个固定小时槽；按 Symbol 去重，保留 occurrences；最高有效原始 Selector 分数、最近研究时间、Symbol 的既有排序不变。
- `src/web/public-dto.js:40–45`：公开 DTO 已含各小时 occurrence 的 runId、scheduledAt、researchTime、bias、dataCutoff、anomalyTypes 和独立 metrics，展示所需字段齐备。
- 已阅读 public-routes、认证/安全、当前 app/presentation/style 与相关 Web 测试。沿用现有 overview 请求、公开路由白名单、脱敏和刷新机制。
- `src/analysis/market-bias-v2/render.js:3`：现行方向只有 BULLISH、BEARISH、NO_EDGE。
- 因已有数据足够，无需扩展 API，也未修改 Reader、DTO、聚合模块、服务端或任何 src 文件。

## 修改清单

| 文件 | 变更 |
|---|---|
| web/assets/app.js:35 | 原首页 4H 区域改为紧凑两行列表、四槽时间表头、原生折叠详情与逐小时研究链接 |
| web/assets/presentation.js:55 | 纯展示方向映射、时间简写、异常类型标签、精确匹配槽/Run 的历史展示适配 |
| web/assets/style.css:9 | 局部 watch 样式、窄屏省略、四列对齐、展开换行、焦点与触摸支持 |
| test/market-watch.test.js | 现有渲染 Fixture 补真实槽身份与最小 DOM Mock；原聚合断言保留 |
| test/market-watch-mobile-fixture.js | 新增隔离合成 Fixture |
| test/market-watch-mobile.test.js | 新增 35 项方向、时槽、缺失、脱敏、时间、布局合同测试 |
| test/market-watch-mobile-browser.mjs | 新增真实前端移动视口、交互、完整研究导航、空状态与副作用验证 |

## 精确字段来源与缺失语义

列表顺序继续采用原有 marketWatchView 的 Top 10，不重新评分或排序。最高分仅显示为一位小数，展开保留原分值；原 API 数值不变。

历史来自 `item.occurrences[].bias`，必须同时匹配该列 `slot.runId` 和 `slot.scheduledAt`。按 scheduledAt 从早到晚显示。同槽重复记录选最新 researchTime，其次 dataCutoff；不修改源数组。每个有效记录保留自己的时间、截止时间、异常和指标，不跨时拼接事实。首行最近方向使用既有 latestBias，不替代四列历史。

| 情形 | 字符 | 展开说明 |
|---|---|---|
| 有效 BULLISH | L | 当前偏多、原 RunId 与研究时间 |
| 有效 BEARISH | S | 当前偏空、原 RunId 与研究时间 |
| 有效 NO_EDGE | N | 当前无明确方向优势、原 RunId 与研究时间 |
| COMPLETE，但该币无有效 occurrence | — | 已完成；该币无有效研究记录（未入选或研究不可用） |
| PARTIAL 且该币无有效 occurrence | — | 部分完成；该币无有效方向研究 |
| PARTIAL 且有有效 occurrence | 原有效方向 | 同时保留部分完成槽状态 |
| FAILED/INTERRUPTED/跳过/缺失/运行中/无效 | — | 显示原槽状态，不释放临时结果 |
| 存在记录但方向不属于现行枚举 | ? | 保留原始值并提示未识别方向 |

当前公开 DTO 无法进一步证明“已完成但无该币记录”到底是未入选还是研究失败。因此如实显示这两个可能性，不伪造具体原因；失败、缺失、部分完成与有效 NO_EDGE 明确区分。未引入额外服务端字段。

不使用价格、分数、异常类型推导方向；不向后填充；不由方向序列推导趋势反转。方向文字提示及逐小时展开均说明来源。

## 时间、异常与移动布局

- 紧凑时间按固定 UTC+8，和 observedAt 同日显示 HH:mm，跨日 MM/DD HH:mm；完整详情保留日期与秒。原时间戳和数据截止不变。
- PRICE_1H/4H/24H→价格；Funding 极值/变化/翻转→资金费率；OI→持仓量；Volume→成交量；现有账户分布、翻转与顶部/全市场背离→账户分布。旧顶部持仓异常独立显示“顶部持仓”，不混成账户比。未知名称原样保留，展开列完整原始名称。
- 四槽时间表头与每行四个标记对齐；默认全部闭合；原生 details/summary 支持点击与 Enter/Space，toggle 同步 aria-expanded。
- 长 Symbol/异常紧凑省略，展开完整换行；保持原底部导航、Latest Scan、排名、历史、完整研究入口。
- 390px 视口每行约 64px，首屏可见 4 个完整币种行；320/768px 可见 5 行，375/430px 可见 4 行。

## 离线验收

先在相同环境执行未修改代码的完整基线，再执行定向、浏览器及完整回归。未更改任何旧哈希断言。

| 检查 | 实际结果 |
|---|---|
| 修改前完整回归 | 1267/1283，通过；16 失败 |
| Web 定向（含新增 35 项） | 292/292 通过 |
| JavaScript / MJS 静态 node --check | 149/149 通过 |
| 修改后完整回归 | 1302/1318，通过；16 失败 |
| 新增失败 | 0；16 个失败名称与同环境基线逐项一致 |
| 浏览器视口 | 320、375、390、430、768px 全部通过 |
| 交互 | 默认闭合、点击展开/收起、Enter/Space、aria、完整研究导航、空状态通过 |
| 溢出 | 闭合、展开、长 Symbol 均无页面横向溢出 |
| 浏览器安全 | 外部请求 0、页面错误 0、私有进程诊断调用 0 |
| 受保护完整性 | 8421 文件逐文件 SHA-256 对比：变更/删除/新增均为 0 |
| 回滚补丁 | git apply --reverse --check 通过；未执行回滚 |

16 项旧失败的名称与原始输出保存在 TEST_RESULTS.json、baseline.txt、full.txt。它们是已有完整性/旧哈希断言失败，未包装为全绿。

执行命令：

```sh
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/market-watch-mobile.test.js test/market-watch.test.js test/public-web.test.js test/web-dashboard.test.js test/dashboard-simplification.test.js
NODE_OPTIONS="--import=$PWD/test/offline-guard.js" node --test test/*.test.js
```

静态检查逐一对 src、scripts、test、web/assets 下全部 .js/.mjs 执行 `node --check <文件>`，明细见 STATIC_CHECKS.json。

浏览器使用安装的 Chrome + Playwright，启动的仅为随机本机端口、Mock Reader 的测试 Web 服务；不读取生产数据，不启动正式服务。测试脚本所需环境：BA_WEB_PLAYWRIGHT_MODULE 指向可用 Playwright index.mjs，BA_WEB_BROWSER_PATH 指向 Chrome 可执行文件，沿用 offline-guard。执行 `node test/market-watch-mobile-browser.mjs`。原始结果与截图已保存。

## 安全与剩余风险

所有 src（含 Scanner、Selector、V2、后端 Web）、data、.env/.web.env、package/lock 与任务开始时的 SHA-256 相同。无真实 Binance、DeepSeek、钉钉请求，无生产状态写入。package.json 的既有未提交修改完整保留，本任务未触碰。其他既有未跟踪目录未覆盖/清理。

移动布局是在真实 Chrome 的触屏移动视口验证；没有可用 WebKit 或真实 iPhone，不能声称 Safari 实机通过。部署后仍需 iPhone Safari 验收字体、原生 details 交互和安全区域表现。未扩展 DTO，故单币缺失研究的更细失败原因仍受现有公开数据约束。

## 回滚

CHANGES.patch 仅含本任务四个已有文件及三个新增测试文件，排除 package.json 与其他任务。先检查再反向应用；若后续修改冲突，应停止并手工审阅，勿强行覆盖。

```sh
git apply --reverse --check implementation/BA_BIAS_4H_MARKET_WATCH_V2_MOBILE_COMPACT/CHANGES.patch
git apply --reverse implementation/BA_BIAS_4H_MARKET_WATCH_V2_MOBILE_COMPACT/CHANGES.patch
```

报告目录可留作审计证据。未自动暂存、提交、推送、部署或重启任何服务。

## Git 交付资料脱敏

提交前仅对测试日志与浏览器结果中的本机项目绝对路径、临时目录路径进行脱敏，替换为 `<PROJECT_ROOT>` / `<TEMP_PATH>`。测试结果、失败名称、SHA-256、代码与测试均未修改。

Git 默认忽略 `.log`；本次提交其脱敏 `.txt` 副本（baseline、targeted、full、browser），原 `.log` 保留本地，不强制添加忽略文件。提交副本同时去除日志行尾空白，测试内容不变。
