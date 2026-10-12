# BA_BIAS_WEB_PM2_ENTRY_FIX_V1

状态：本地修复与隔离验收完成，尚未提交/推送/部署；Windows实机运行新入口待验证。

用户附件显示：web:doctor为VALID，原npm run web已输出LISTENING且登录成功；停止后，PM2直接运行src/web/server.js显示online，但没有应用stdout/stderr。不要再次把online当作HTTP监听成功。

server.js末尾与Scanner一样，以import.meta.url和process.argv[1]的文件URL相等判断直接入口。[PM2官方fork容器](https://github.com/Unitech/pm2/blob/master/lib/ProcessContainerFork.js)的ESM动态导入模型可能使argv[1]仍指容器，旧guard不触发startWeb。隔离测试使用当前真实Web源码复现此机制；Windows实际argv/安装版本尚未直接采样，因此现场根因仍不能宣布已完全确认。此前建议直接由PM2运行server.js遗漏了这个入口兼容性条件。

## 实现

新增src/web/pm2-entry.js：显式await startWeb一次，不依赖guard。不引入计时器或Scanner调用；失败复用已有WEB_PORT_IN_USE/其他初始化错误语义并process.exit(1)，避免IPC留住无效进程。

新增test/web-pm2.test.js、test/web-pm2-fixture.js。VM ESM图使用真实server/entry源码，HTTP监听、配置、文件与进程查询依赖均隔离：正常直接入口、普通导入、容器加载原入口、直接/容器加载新入口、缺哈希、端口占用、SIGINT/SIGTERM；同时验证Windows路径模型。原npm run web和server.js末尾guard不改。

没有修改原Web认证/只读接口/默认监听/环境文件加载、任何Scanner代码或24小时计划。原有.env/.web.env与全部生产数据不变，生产目录无新增文件。没有停止Windows Scanner、没有实际启动生产Web、没有访问业务外部API。

## 验收

- node --test test/web-pm2.test.js test/web-dashboard.test.js：122/122，20新增+102原Web。
- 可用Node24.19.0执行新Web PM2测试：20/20；本机不是目标Windows24.15.0。
- 全部JS node --check：113/113。
- npm test：1094项，1082通过、12失败、取消0、跳过0。失败集合与此前Scanner/24H任务完全一致；没有迁移旧哈希或删除断言。
- 开发前完整性清单中的既有源码、测试、配置及生产文件零差异；完整数据目录没有新增文件。
- 证据：validation/BA_BIAS_WEB_PM2_ENTRY_FIX_V1/{before-hashes,specific-tests,node24-tests,full-tests,static-results,production-integrity,test-failures}，测试结果txt，其他json。

## Windows后续（新文件发布并拉取以后）

先确认将这次Web修复提交并推送；上次Scanner提交5b9332c不包含该新文件。不要在新文件不存在时执行启动命令。

以下操作仅针对Web应用，不停止或删除ba-bias-scanner：

```cmd
cd /d C:\git\ba-bias
pm2 stop ba-bias-web
pm2 delete ba-bias-web
git status --short
git pull --ff-only origin main
dir src\web\pm2-entry.js
npm run web:doctor
pm2 start src/web/pm2-entry.js --name ba-bias-web --cwd C:\git\ba-bias --time
pm2 logs ba-bias-web --lines 50
```

Git有本地代码修改、pull失败、新文件不存在、doctor非VALID时停止后续操作。原npm Web终端须已退出，PM2同名Web不可重复运行。默认fork单实例，不加watch或cluster。

确认出现实际Web LISTENING，并在服务器访问配置Origin成功登录后，执行pm2 save。默认127.0.0.1:8787，仍仅本机访问；未关闭认证或开放公网。LISTENING+实际HTTP访问证明Web启动，PM2 online单独不能证明。

本轮未执行上述服务器命令，没有新增Git提交或推送。附件中的密码哈希未复制进代码、报告或验收输出。
