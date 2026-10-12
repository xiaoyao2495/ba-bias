# PUBLIC_READONLY · Windows CMD部署与回滚

本轮代码仅在本地工作区，未提交/推送、未连接腾讯云、未改防火墙或重启PM2。**必须先另行授权发布本次代码，Windows拉取后才可启用这些配置。** 当前PM2入口继续使用src/web/pm2-entry.js；只操作ba-bias-web，不操作ba-bias-scanner。

## 1. 发布后核对代码和唯一Web实例

```cmd
cd /d C:\git\ba-bias
git status --short
git branch --show-current
git remote -v
pm2 list
pm2 describe ba-bias-web
```

应是main、xiaoyao2495/ba-bias、只有一个本项目Web实例，script为src/web/pm2-entry.js、cwd为C:\git\ba-bias。若有本地代码变更或多个Web实例，停止后续操作并先核对，不reset/clean，不另建第二实例。

```cmd
git pull --ff-only origin main
dir src\web\public-dto.js
dir src\web\public-routes.js
findstr /C:"BA_BIAS_WEB_PUBLIC_READONLY" src\web\config.js
```

pull失败、新模块不存在或配置不认识新开关时停止。没有新增运行依赖，package/lockfile未改，已有node_modules正常时不需要重新安装。

## 2. 配置与实际覆盖顺序

运行时优先级是：**已存在process.env（包括PM2保存的环境） > 项目.env先填入缺失项 > .web.env再填入仍缺失项**。process.loadEnvFile不覆盖已有变量。Web专用配置用.web.env，保留Scanner.env及全部数据。

因此只修改.web.env后执行普通pm2 restart，不保证替换PM2已保存的旧WEB变量。以下命令在CMD明确设置本轮所有模式/网络变量，并用--update-env更新原Web实例，避免旧值覆盖。

先编辑：

```cmd
notepad .web.env
```

添加/修改以下唯一配置行，PUBLIC_IP替换为实际腾讯云公网IPv4；不要原样使用这个占位：

```dotenv
BA_BIAS_WEB_PUBLIC_READONLY=1
BA_BIAS_WEB_ALLOW_REMOTE=1
BA_BIAS_WEB_PRIVATE_NETWORK=0
BA_BIAS_WEB_HOST=0.0.0.0
BA_BIAS_WEB_PORT=8787
BA_BIAS_WEB_ORIGIN=http://PUBLIC_IP:8787
```

保留原来的BA_BIAS_WEB_PASSWORD_HASH行供回滚；公开模式不验证或使用它。不要覆盖.env，不把真实IP/凭据提交到Git。PUBLIC_READONLY必须是精确字符串1，true/yes/2不会启用。

然后在同一个CMD输入实际公网IPv4并明确覆盖旧PM2配置：

```cmd
set /p BA_BIAS_PUBLIC_IP=请输入实际腾讯云公网IPv4地址:
set BA_BIAS_WEB_PUBLIC_READONLY=1
set BA_BIAS_WEB_ALLOW_REMOTE=1
set BA_BIAS_WEB_PRIVATE_NETWORK=0
set BA_BIAS_WEB_HOST=0.0.0.0
set BA_BIAS_WEB_PORT=8787
set BA_BIAS_WEB_ORIGIN=http://%BA_BIAS_PUBLIC_IP%:8787
npm run web:doctor
```

doctor应显示mode=PUBLIC_READONLY、authentication=ANONYMOUS_PUBLIC_DTO_ONLY、bind=0.0.0.0、port=8787、origin为实际公网地址；不访问市场API或修改研究文件。PRIVATE_NETWORK=0避免将公网假称私有VPN，也保证模式误配时不会依旧走私有HTTP登录。

## 3. 只重启现有Web

```cmd
pm2 restart ba-bias-web --update-env
pm2 logs ba-bias-web --lines 50
```

应出现实际日志event=LISTENING、mode=PUBLIC_READONLY、origin=http://实际IP:8787、readOnly=true。只有online不够。不要pm2 start再建实例；不加watch/cluster，不重启Scanner。

按Ctrl+C退出日志跟踪，不停止PM2应用。验证监听：

```cmd
pm2 pid ba-bias-web
netstat -ano | findstr ":8787"
```

应有0.0.0.0:8787的LISTENING，PID对应Web。若没有，查看Web错误日志；EADDRINUSE说明端口被占用，不能盲目启动第二个服务。

## 4. 应用验收与外网验收

CMD若有curl.exe：

```cmd
curl.exe -i -H "Host: %BA_BIAS_PUBLIC_IP%:8787" http://127.0.0.1:8787/api/web-mode
curl.exe -i -H "Host: %BA_BIAS_PUBLIC_IP%:8787" http://127.0.0.1:8787/api/overview
curl.exe -i -H "Host: %BA_BIAS_PUBLIC_IP%:8787" http://127.0.0.1:8787/api/system
curl.exe -i -H "Host: %BA_BIAS_PUBLIC_IP%:8787" http://127.0.0.1:8787/.env
curl.exe -i -H "Host: %BA_BIAS_PUBLIC_IP%:8787" http://127.0.0.1:8787/api/session
curl.exe -i -X POST -H "Host: %BA_BIAS_PUBLIC_IP%:8787" http://127.0.0.1:8787/api/login
```

前两个200，web-mode仅返回PUBLIC_READONLY；system/.env/session是403；无body的POST/login是405（带body会先被413拒绝）。这些请求只读，不扫描、不研究、不发钉钉。

Host覆盖用于服务器本机验证，不能直接用127地址加默认Host测试，因为服务明确只信任配置的公网Origin/Host。

手机使用新公网地址：`http://实际公网IP:8787`，应无需登录，只有观察/排名/历史，币种Evidence/研究可读，无诊断或退出入口。测试刷新、后退、Evidence展开、断网恢复、375/390/430px与至少一个30秒刷新周期。

若本机应用验证通过但手机连接超时，再由用户自行检查腾讯云和Windows的TCP8787入站规则。本任务没有创建或修改任何规则。只有用户另行决定开放入站后才能有外网访问；不要以修改应用配置代表网络已开放。

确认外网与拒绝接口均符合预期后：

```cmd
pm2 save
```

不要发送pm2 env或完整.env/日志中可能包含的凭据给他人。

## 5. HTTP明确接受的剩余风险

公开HTTP不是HTTPS：网络路径上的第三方可观察、缓存或篡改研究内容和页面脚本，不能保证内容传输真实性。公开服务不发送密码、不创建Session；客户端API使用credentials=omit，服务端不使用认证Cookie并清除遗留Cookie。

默认从127.0.0.1切到公网IP时，原Host-only登录Cookie不会跨Host发送。若过去曾在**相同公网Host**用私有HTTP登录，请先清除该站点浏览器数据；服务端不能阻止浏览器首次导航自行携带历史Cookie，不能声称这种首航行为被服务器控制。重启后的旧Session本来已失效，公开模式也不承认它。不要把原私有密码输入任何声称需要密码的公开HTTP页面。

## 6. 回滚（仅Web）

异常时用户可先手动关闭公网8787入站规则，再停止Web：

```cmd
pm2 stop ba-bias-web
notepad .web.env
```

恢复这些配置，保留已有合法密码哈希：

```dotenv
BA_BIAS_WEB_PUBLIC_READONLY=0
BA_BIAS_WEB_ALLOW_REMOTE=0
BA_BIAS_WEB_PRIVATE_NETWORK=0
BA_BIAS_WEB_HOST=127.0.0.1
BA_BIAS_WEB_PORT=8787
BA_BIAS_WEB_ORIGIN=http://127.0.0.1:8787
```

同一个CMD明确替换PM2旧值：

```cmd
set BA_BIAS_WEB_PUBLIC_READONLY=0
set BA_BIAS_WEB_ALLOW_REMOTE=0
set BA_BIAS_WEB_PRIVATE_NETWORK=0
set BA_BIAS_WEB_HOST=127.0.0.1
set BA_BIAS_WEB_PORT=8787
set BA_BIAS_WEB_ORIGIN=http://127.0.0.1:8787
```

如PM2保存了不同密码哈希，可从原.web.env导入已有值，以下是**CMD交互终端**语法（写进.bat需把%A/%B改成%%A/%%B）：

```cmd
for /f "tokens=1,* delims==" %A in ('findstr /b "BA_BIAS_WEB_PASSWORD_HASH=" .web.env') do @set "BA_BIAS_WEB_PASSWORD_HASH=%B"
npm run web:doctor
```

这不打印哈希，不把密码放进命令参数。若没有合法哈希，再由管理员npm run web:password生成并保存，不能把PUBLIC_READONLY=0当作免密码模式。

doctor应为PRIVATE_AUTHENTICATED、SCRYPT_PASSWORD_AND_SESSION。然后：

```cmd
pm2 restart ba-bias-web --update-env
pm2 logs ba-bias-web --lines 50
pm2 save
```

在服务器本机浏览器访问http://127.0.0.1:8787，重新登录；内存Session随重启失效是原有行为。公开接口不再匿名可用，私有诊断恢复。无需恢复或删除Facts/History/Outbox，不动Scanner。

回滚的配置校验及真实本机Chrome登录/Session刷新/诊断/登出流程已隔离验证；目标Windows及iPhone实机仍待用户验收。
