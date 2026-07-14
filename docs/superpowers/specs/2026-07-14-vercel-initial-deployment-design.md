# Vercel 首次部署设计

## 目标

将 GitHub 仓库 `Innate-Labs/Speaking` 的当前 `main` 分支部署到 Vercel，获得一个可公开访问的 Vercel 生产网址。

## 本次范围

- 使用 Vercel 自动识别 Next.js 16 项目。
- 安装锁文件中固定的依赖并执行 `npm run build`。
- 将 Next.js 页面和现有 Route Handlers 部署为一个 Vercel 项目。
- 生产分支设为 `main`，首次发布使用 Vercel 默认域名。
- 发布后检查生产部署状态、主页、登录页和至少一个 API 请求。

## 明确不在本次范围内

- 不接入真实短信服务。生产环境不会显示开发验证码，新访客暂时无法完成登录。
- 不部署 `ws-proxy.mjs`。语音练习中的 `ws://localhost:3001` 暂时不可用。
- 不配置 `DASHSCOPE_API_KEY` 或 `DEEPSEEK_API_KEY`；报告接口在没有 DeepSeek 密钥时使用现有示例报告逻辑。
- 不修复现有 ESLint 错误或依赖审计告警。
- 不绑定自定义域名。

## 部署架构

GitHub 的 `main` 是唯一生产代码分支。Vercel 负责构建并托管 Next.js 页面、静态资源和 Route Handlers。独立的常驻 WebSocket 代理不属于这次 Vercel 部署，也不会由 Vercel 构建命令启动。

## 发布与验证

1. 确认本机已登录正确的 Vercel 账户。
2. 创建或绑定 Vercel 项目，框架使用自动检测，根目录为仓库根目录。
3. 创建生产部署，不向仓库写入密钥。
4. 确认 Vercel 报告部署为 Ready。
5. 使用生产网址验证主页和登录页返回成功响应。
6. 记录生产网址、部署 ID 和已知功能限制。

## 失败处理与回滚

如果构建或部署失败，不把失败版本标记为完成；保留日志并定位失败阶段。Vercel 部署是独立版本，本次不修改应用代码，因此可以继续使用先前部署；若这是首次部署，则保持项目未上线状态并修复部署问题后重试。

## 成功标准

- Vercel 生产部署状态为 Ready。
- Vercel 默认生产网址可访问。
- 主页和登录页返回正常的 HTTP 响应。
- 最终交付明确说明登录和语音转写目前不可用。
