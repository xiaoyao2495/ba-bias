# BA_BIAS_PUBLIC_READONLY_WEB_V1_TESTS

状态：**PUBLIC_READONLY_WEB_PARTIAL**。公开安全及私有回归通过，Safari/Windows公网实机未验证。

| 实际命令/检查 | 结果 | 保存证据（validation/BA_BIAS_PUBLIC_READONLY_WEB_V1） |
|---|---|---|
| node --test test/public-web.test.js | 79/79 | public-tests.txt |
| node --test test/public-web.test.js test/web-dashboard.test.js test/web-pm2.test.js test/dashboard-simplification.test.js | 241/241 | all-web-tests.txt |
| 可用Node24.19.0执行同一4文件命令 | 241/241 | node24-web-tests.txt |
| npm test | 1175项，1163通过、12失败、取消0、跳过0 | full-tests.txt/test-failures.json |
| 全部src/scripts/test/web JS node --check | 117/117 | static-results.json |
| git diff --check | 通过 | git-diff.patch仅记录改动 |
| 真实浏览器 | 30组路由/宽度、31PNG、错误0、外部请求0、公开Cookie0、进程检查0 | visual-results.json/visual-log.txt/public-*.png |
| 生产完整性 | 保护文件零差异、新增生产文件0 | before-hashes.json/production-integrity.json |

## 安全测试覆盖

默认/未设置/0/非法值均不公开、私有Hash与Session继续；显式1无Hash，私有回滚要求Hash；远程ALLOW_REMOTE授权、实际Origin、0.0.0.0模式、私有HTTP限制不变；匿名页面与固定资源；业务DTO；诊断/认证/env/logs/outbox/src/root/map/未知接口拒绝；全部非GET拒绝；请求体拒绝；路径遍历与非法查询/分页；Host与Origin、无CORS通配；伪造Cookie/Authorization及X-Forwarded-For不能越权；指数/数值/同SymbolEvidence明确；敏感Fixture值/路径/嵌入式元数据无泄露；NO_EDGE与不可用区分；完成Run总数与分页、未完成只最小状态且无临时排名；默认最新完成Selector不重算；同周期Timeline；1MiB真实超限503而非部分大响应；四并发上限；每IP频率；Reader单记录上限与损坏/过大索引关闭；无进程命令或文件改动。

模拟凭据只存在临时数据（明确MOCK），未复制真实Key/Hash。包含Windows路径、Unix路径、假Webhook、Authorization、Cookie、scryptHash、内部Prompt/headers/stack；每一允许API的公开输出和错误都检查。原102项Web与38项展示保留；PM2测试只补新依赖Mock及公共绑定模型，不修改原测试断言。

## 页面与回滚

本机Chrome使用真实已保存19/20点研究，320/375/390/430/1280px覆盖观察、排名、历史按币种/运行、Symbol、Run详情。支持Evidence展开、无登录/退出/诊断、初始刷新、Back、断网保留后恢复、持续31秒触发匿名轮询。public HTTP请求未进入session/health/system/login/logout，没有Cookie；后端请求敏感API403。

内存重启为PRIVATE_AUTHENTICATED后，真实浏览器需要登录，刷新保持Session，诊断与退出恢复。没有写入.env/.web.env，非真实服务器回滚。视觉QA安全时钟按请求推进以隔离频率测试，市场dataCutoff/指标均来自原存档；频率上限本身由独立冻结时钟测试验证，没有放宽生产限制。

WebKit运行时不可用，不能声称iPhone Safari通过；目标WindowsPM2/公网网络尚待用户按部署文档检查。公开接口审计/应用隔离已通过，整体仍PARTIAL。

## 保留的12项失败

1. Judge recovery, detectors, queue, History, scheduler and production state remain byte-identical
2. production scan command and protected files retain baseline bytes
3. history/outbox/raw model responses/env remain byte identical in offline suite
4. all protected production logic and original tests remain unchanged
5. NO_EDGE forensic 43 History hashes immutable
6. NO_EDGE forensic 48 immutable production policies beyond renderer
7. output quality 53 History immutable
8. Selector 39 production files identical
9. V4 all pre-existing files including production and old experimental contracts remain identical
10. V4 protected existing files incl V3, state, env, snapshots are unchanged
11. production 49 original data env detectors Judge queue scheduler bytes preserved
12. every protected market, scheduling and delivery implementation matches the pre-task snapshot

失败集合与本轮前一致。前10项仍是既有历史哈希/测试环境问题；另2项是24H调度授权修改与冻结scan-daemon SHA冲突，不因本Web任务而消除。原有History/Outbox/.env与Scanner合同未回退或更新，未跳过测试、未自动接受新SHA。

完整套件不是全部通过。两份旧测试生成的Selector离线证明文件已恢复任务开始时内容，不触及生产。所有临时HTTP服务关闭，没有触发真实扫描、模型或钉钉。
