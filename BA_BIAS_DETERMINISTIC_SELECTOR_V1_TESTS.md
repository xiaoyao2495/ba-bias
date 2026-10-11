# BA_BIAS_DETERMINISTIC_SELECTOR_V1_TESTS

892/892通过，0失败/0跳过；92/92 JS静态检查通过。原840项保持总数，按正式新合同调整Judge/Writer/不限研究数量/V3执行预期，新增52项。没有删除套件。

执行命令：

```sh
NODE_OPTIONS='--import ./validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/no-network.js' node scripts/selector-replay.js
NODE_OPTIONS='--import ./validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/no-network.js' npm test
```

逐一node --check src/scripts/test全部JS。硬拦截http/https/net/tls/fetch；Mock动态pipeline仍经过真实scan/Facts/Selector/V4 Validator/Outbox与投递状态代码，只写临时目录。既有V4管线验证七候选只3次V4、0次Judge，所有未入选终态明确；零合格、模型失败、受控恢复、原NO_EDGE、SENT/UNKNOWN和分片等原回归继续通过。

新增52项覆盖确定性、稳定同分、单币重复、Top3/Top0、不凑满、极端单项、多指标组合、普通成交量过滤、OI数量口径、Funding符号、缺失值、未来数据、事实不可变、新故事/实质更新/无更新、历史缺失、Scanner/Crypto/TradFi、V4冻结合同、无Judge/Writer/V3主调用、旧投递保护、真实三轮回放、Packet兼容及正文无损。

三类市场口径既有Facts及Claim Guard/Validator测试继续保留；Selector不生成方向或资金解释。模型配置测试将新增Selector配置排除后与旧文件逐字相等，核心参数未放宽。

历史存档Judge模块的Mock合同测试仍执行，正常生产main无该依赖或调用；测试中这些Mock调用不计生产Judge请求。

生产data/.env共6881文件哈希一致；无新增data，所有V4合同文件不变。没调用真实API、没发送钉钉、没启动扫描。验证实际文件清单与范围详见下列证据。

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/tests.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/tests.txt)

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/static-checks.json)

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/integrity.json)

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/replay.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/replay.json)

[validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/before-hashes.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_DETERMINISTIC_SELECTOR_V1/before-hashes.json)
