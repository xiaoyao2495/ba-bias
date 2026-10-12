# BA-BIAS Dashboard V1 · Windows 部署

这是独立只读服务。Scanner仍使用原来的`npm.cmd run scan`，Web使用另一终端的`npm.cmd run web`。Web不触发扫描、Binance、DeepSeek或钉钉。

## 版本与部署边界

本轮代码在本地工作区完成，未自动推送GitHub、连接Windows服务器、改防火墙或注册服务。先将本次版本同步到Windows项目目录。现有Scanner无需改业务配置；首次同步建议在运行轮次结束后操作，不覆盖`.env`或`data`。本任务未停止任何生产进程。

代码已在macOS/Node 23.11.0运行和浏览器验收，Windows路径/进程解析有隔离测试，但没有Windows实机运行证据，正式验收为PARTIAL。

## 本机试运行（PowerShell）

```powershell
cd C:\你的目录\ba-bias
node --version
npm.cmd ci --registry=https://registry.npmjs.org
Copy-Item .web.env.example .web.env
npm.cmd run web:password
notepad .web.env
```

`web:password`交互输入至少12字符密码，输入隐藏。将生成的整行`BA_BIAS_WEB_PASSWORD_HASH=scrypt$...`粘贴到`.web.env`替换占位行。不要将密码写到命令行参数或URL。此配置和现有业务`.env`分开，`.web.env`已加入Git忽略。

```dotenv
BA_BIAS_WEB_HOST=127.0.0.1
BA_BIAS_WEB_PORT=8787
BA_BIAS_WEB_ORIGIN=http://127.0.0.1:8787
BA_BIAS_WEB_PASSWORD_HASH=粘贴工具生成的完整哈希
```

```powershell
npm.cmd run web:doctor
npm.cmd run web
```

Windows浏览器访问`http://127.0.0.1:8787`，输入刚才密码。doctor只检查本地配置和已有运行索引，不访问任何外部API。Web启动输出`LISTENING`；端口冲突输出`WEB_PORT_IN_USE`。关闭Web用Ctrl+C；Scanner不受影响。不要关闭Scanner终端来关闭Web。

如doctor报告`WEB_PASSWORD_HASH_REQUIRED`，检查文件名是`.web.env`，不是`.web.env.txt`，且粘贴整行哈希。不要用PowerShell双引号重新构造含`$`的哈希，以免变量展开。

若生产数据在其他目录，仅在`.web.env`设置：

```dotenv
BA_DATA_DIR=D:\ba-bias-data
```

Web用项目路径解析相对目录，并只读该目录。复制到其他系统的数据记录中已有绝对factsPath会被忽略，读取按当前数据目录、经过校验的RunId和Symbol重新定位。

## 手机通过私有VPN访问

可使用已有VPN，或自行在Windows和手机安装Tailscale并登录同一授权网络。本文没有自动安装工具或创建账号。

1. 确认两端私有网络连通，获取Windows的私有VPN IPv4地址。
2. 修改`.web.env`，将示例IP替换为实际VPN地址，保留密码哈希：

```dotenv
BA_BIAS_WEB_HOST=100.你的.VPN.IP
BA_BIAS_WEB_PORT=8787
BA_BIAS_WEB_ORIGIN=http://100.你的.VPN.IP:8787
BA_BIAS_WEB_ALLOW_REMOTE=1
BA_BIAS_WEB_PRIVATE_NETWORK=1
```

3. Ctrl+C关闭Web，再运行`npm.cmd run web`。
4. 手机开启VPN，用浏览器访问配置的完整Origin并登录。
5. Windows本地浏览器也使用该VPN地址访问。服务仅信任配置的Host，不同时接受任意localhost别名。
6. 若Windows防火墙阻止访问，由管理员自行设置仅VPN网络/批准来源可访问的规则。本任务未添加规则。不要在路由器映射裸HTTP端口到公网。

即便VPN内也必须登录；`PRIVATE_NETWORK=1`只是明确确认私有加密网络访问模式，不绕过认证。HTTP模式Cookie为HttpOnly/SameSite=Strict，VPN负责传输保护。

## 公网HTTPS反向代理

仅使用已有、受保护的HTTPS反向代理。Node仍绑定127.0.0.1，反向代理须保留外部Host。例：

```dotenv
BA_BIAS_WEB_HOST=127.0.0.1
BA_BIAS_WEB_PORT=8787
BA_BIAS_WEB_ORIGIN=https://你的-dashboard域名
BA_BIAS_WEB_PASSWORD_HASH=原有生成哈希
```

代理将HTTPS入口转发到`http://127.0.0.1:8787`，必须设置上游Host为外部域名、禁止上游端口公开、禁用共享缓存；正常转发Cookie和Origin，不改写到内部地址。公网部署Cookie自动Secure并启用HSTS。不要将账号放在代理URL查询参数中。

手机访问外部HTTPS域名；Windows浏览器同样访问该域名。不要用这个配置下的裸HTTP地址登录，因为Secure Cookie不会在HTTP发送。本任务未配置代理、证书或公网部署。

## Scanner进程识别

Windows用固定PowerShell Get-CimInstance查询Node进程，不拼接用户参数，不向页面返回完整命令行。绝对路径能确认具体项目；相对路径只有与本项目当前研究锁PID匹配才能确认。

原来的`npm.cmd run scan`可以继续使用。等待期间若只有相对命令行且没有研究锁，Dashboard显示UNKNOWN。若希望更可靠识别，可在你决定重启Scanner时，在Scanner终端用等价的绝对入口：

```powershell
node (Join-Path (Get-Location) 'src\scan-daemon.js')
```

这只是启动方式说明，未更改调度或业务代码。权限不足同样UNKNOWN，不能用“Web正常”代替Scanner存活。

## Windows手动验收

- Scanner停止时Web可登录并浏览原有记录，显示STOPPED或有依据的UNKNOWN。
- 启动Scanner后验证对应项目进程；若相对入口不确定，正确显示UNKNOWN。
- 手机375/390/430px浏览概览、排名、LUMIA时间线、Runs、System，展开Evidence和实际分片。
- 19:00三币显示对应19:00Run；12/14/16点标旧架构缺排名，不回算分数。
- 确认Windows启动和Ctrl+C释放端口，再次启动成功；端口占用错误明确。
- 登出后API拒绝访问；登录失败受限速；网页刷新不产生Outbox或模型请求。
- 检查手机主题、底部安全区、长DeliveryId、刷新失败时缓存提示。

不自动配置开机自启，不使用PM2；服务器重启后由用户启动Web与Scanner两个终端。完整历史研究测试需要未提交Git的生产数据，缺失时不能把旧Fixture依赖测试通过当作环境已验收。
