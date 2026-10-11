# BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1_TESTS

结论：840/840通过，0失败、0跳过；89/89 JavaScript静态检查通过。原785项保留，新增55项。测试时间日志保存完整，未采用真实网络请求。

执行：

```sh
NODE_OPTIONS='--import ./validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/no-network.js' node scripts/v4-failure-render-replay.js
NODE_OPTIONS='--import ./validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/no-network.js' npm test
```

静态检查逐文件执行node --check，覆盖src/scripts/test全部89个JS文件。

新增测试1–12：NO_EDGE源方向规则排除/诊断、重新评估、合法不同指标、结构化身份去重、统一说明、标点、观察去重、空条件安全回退、无方向止损、原始输出不变、有效NO_EDGE与不可用区别。

13–22：四种方向合法失效、指标/真实结构保留、不同时间窗及Evidence、阈值与未定义结构保护。部分为合成组件输入，用于展示回归，不冒充真实模型研判。

23–30：真实POL/LA输出经Mock受信Envelope验证，非法Evidence/结构仍拒绝、Schema不代替完整验证、恢复不伪装成功、失败不转NO_EDGE、不回V3、不额外调用、合法Facts保留。

31–38：数字/Funding/OI口径、分片正文无损、数字标签完整、检测关键词、DeliveryId与SENT不重新排队。

39–48：网络客户端/Scanner源码不变，History/Outbox/.env/V3/V4快照哈希，所有非展示src保持。

49–55：分类不同失败、历史请求哈希匹配、缺映射诊断、独立后续保留、字段顺序规范化、14份元信息不变，以及8条真实有方向和4条不可用compact/full逐字相同。

既有测试调整只涉及本轮授权范围白名单、data/.env的新任务基线（此前正常运行已改变旧任务数据）、旧NO_EDGE错误价格阈值展示断言和隔离测试产物目录。没有删除测试或减少旧785项。

网络拦截器阻断http/https/net/tls/fetch；未读取或显示密钥。生产基线4890文件全部哈希一致，无新增data文件；所有非展示生产源码一致。

最后检查扫描进程无匹配，未向进程发送信号，未重启。

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/all-tests.txt](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/all-tests.txt)

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/static-checks.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/static-checks.json)

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/final-integrity.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/final-integrity.json)

[validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/preflight.json](/Users/yaodebao/Desktop/git/ict03/ba-bias/validation/BA_BIAS_V4_ANALYST_FAILURE_FORENSIC_AND_NO_EDGE_RENDER_FIX_V1/preflight.json)
