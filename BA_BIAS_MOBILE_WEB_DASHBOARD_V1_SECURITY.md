# Dashboard V1 · 安全与隔离

默认绑定127.0.0.1，未提供合法密码哈希拒绝启动。非loopback必须显式ALLOW_REMOTE，且使用HTTPS或明确PRIVATE_NETWORK。单个可信Origin/Host，服务器不信任X-Forwarded-Host/IP/Proto；HTTPS由明确配置决定。反向代理需保留外部Host。VPN用户也要登录。

密码scrypt随机盐（16字节）、64字节派生值，验证timingSafeEqual；交互密码工具不回显，不写磁盘，只输出哈希。配置`.web.env`被Git忽略，`.web.env.example`仅占位。原`.env`没有改动。会话256位随机标识，内存存储，8小时固定到期，重启失效；最多100会话。Cookie HttpOnly、SameSite=Strict、限定Path、Max-Age，HTTPS时Secure/HSTS。客户端不持久化Token，localStorage只存主题。

同IP全请求180/分钟；登录5次/15分钟，另有全局20次/分钟，哈希验证前限速。登录JSON体≤4096字节且必须同Origin；退出需要同Origin与随机CSRF头。限速桶最多2000个，request/header超时有界。无扫描或业务写API，认证状态变更不影响生产。没有账号恢复接口；忘记密码由管理员重建哈希并重启Web。

页面仅textContent/DOM安全渲染，不使用innerHTML；CSP default-src none、脚本/样式/连接只允许self、禁止frame/base、限制form。禁止跨Origin、cross-site fetch、目录穿越、编码分隔符、静态目录越界。静态资源用固定白名单，production data不公开。

Reader先限定数据根目录，再realpath拒绝符号链接逃逸；文件限大小并校验身份/时间/Schema。API只选取展示字段，删除raw/rawResponse、密钥/Webhook/路径字段；已加载环境中的真实凭据值及常见Token格式二次遮盖。模型原始响应、环境清单、请求头、完整命令行不返回。访问日志只记录固定事件，不记录URL、密码、Cookie、Token、API Body、堆栈。错误不透露绝对路径。

Windows进程查询使用固定PowerShell脚本+execFile参数数组，无shell用户插值；权限不足UNKNOWN，其他Node不当Scanner。Mac仅用于本地验收。实际HTTP可达只证明Web，不证明Scanner。

没有注册系统服务、防火墙修改、公网端口发布、真实API测试、补发、重置、交易或发帖。缓存只在内存，无生产写入和锁争用。建议备份生产data、仅给Web读取权限；配置文件限制为管理员访问。

已知限制：V1单用户，无多角色、2FA、审计账号系统；多用户/公开高负载场景需另行设计。私网HTTP依赖VPN加密，不能公网端口映射。进程相对路径且没有当前锁时UNKNOWN；可在用户决定重启Scanner时用绝对入口，不自动更改现有进程。
