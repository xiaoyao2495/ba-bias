# BA-BIAS Scanner流动性门槛与Top 5研究名额

日期：2026-10-16（Asia/Shanghai）。本地实现完成，未提交、推送、部署或启动扫描。

## 实现

- `src/market/scanner.js`复用现有`/fapi/v1/ticker/24hr`的`quoteVolume`，单位USDT，为滚动24小时成交额；不是基础币数量`volume`。用现有big.js进行严格十进制比较，只有`quoteVolume > 10000000`才可进入候选池。
- 恰好1000万、低于门槛、负值、零均排除；缺失或非数值字段仍按INVALID_TICKER拒绝。拒绝记录、实际成交额及严格门槛保存在scan.json；新增liquidityFilter口径及计数。nativeCryptoCount继续保留所有原生Crypto分类计数。
- 同一准入池用于原有异常/轮转探测、全市场账户发现及账户异常候选合并。低成交额不能绕过筛选，也不会对其发起逐币深查请求。无需新增全市场Ticker请求。
- `src/config.js`的MAX_ANALYST_CANDIDATES_PER_RUN默认3→5。Selector评分、权重、质量门槛、排序、去重、Facts Engine、LLM合同、重试和超时均保持。最多5个合格对象；不足5个不凑数。既有环境变量仍可显式覆盖默认值。
- README.md及.env.example更新。未编辑.env或.web.env。Windows如果已有MAX_ANALYST_CANDIDATES_PER_RUN=3（包括PM2进程保存值），部署时需同步设为5。未新增必填环境变量。

## 测试

全部使用offline-guard和Mock，不调用真实Binance、DeepSeek或钉钉。

1. 功能回归：181/181 PASS（core、long-short、market-bias-v2-e2e、hourly、scan-liquidity）。覆盖严格门槛、边界小数、无效字段、账户通道无绕过、Top 5完整调用、19候选评分和两轮各5条独立研究。测试辅助的合成ticker成交额调高到1亿，以保持既有测试继续覆盖研究流程；未修改历史或冻结Facts。
2. Selector专项：原完整测试中的Selector断言全部执行；旧字节完整性失败未修改或跳过。
3. JS静态语法检查：142/142 PASS（src/scripts/test）。git diff --check通过。
4. 完整测试修改前：1241项，1042通过、18失败、181取消、0跳过。修改后：1245项，1046通过、18失败、181取消、0跳过。失败/取消用例名称集合完全一致，没有新增失败。不能称为全部通过。
5. 既有失败包括旧生产源码哈希/字节断言，以及本机受限环境的进程和127.0.0.1监听问题（EPERM及其连带取消）。本轮没有迁移哈希基线、删除用例或放宽安全断言。具体名单见FULL_TEST_COMPARISON.json。

命令：

```sh
node --import ./test/offline-guard.js --test test/core.test.js test/long-short.test.js test/market-bias-v2-e2e.test.js test/hourly.test.js test/scan-liquidity.test.js
node --import ./test/offline-guard.js --test test/*.test.js
```

## 文件与边界

生产实现仅src/config.js、src/market/scanner.js。测试修改test/fixtures.js、test/selector.test.js、test/long-short.test.js、test/market-bias-v2-e2e.test.js、test/hourly.test.js；新增test/scan-liquidity.test.js。文档README.md和.env.example。修改前已有package.json工作区变更保持，不纳入本任务补丁。

未修改生产Facts/History/Outbox、.env/.web.env、调度、投递或LLM研究语义。未运行真实扫描、API探测、常驻服务、PM2、Windows部署或Git写操作。此前供应商故障与超时问题不在此次修复范围，Top 5不代表上游可用性或单轮时限得到保证。
