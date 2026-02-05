# 🚀 Vercel 部署指南

本指南将帮助您将儿童英语发音练习应用部署到 Vercel，获得永久免费的公网访问地址。

## 📋 前置要求

在开始之前，您需要准备：

- ✅ 一个 **GitHub 账号**（免费注册：https://github.com/signup）
- ✅ 一个 **Vercel 账号**（使用 GitHub 登录即可）
- ✅ 本地已安装 Git

## 🎯 部署步骤

### 方式一：使用 Vercel CLI（推荐给有经验的用户）

#### 步骤 1：安装 Vercel CLI

```bash
# 使用 pnpm 全局安装 Vercel CLI
pnpm add -g vercel
```

#### 步骤 2：登录 Vercel

```bash
vercel login
```

- 选择 "Continue with GitHub"
- 授权 Vercel 访问您的 GitHub 账号

#### 步骤 3：部署项目

在项目根目录执行：

```bash
vercel
```

按照提示操作：

1. **Set up and deploy?** → `Y`
2. **Which scope?** → 选择您的 GitHub 用户名
3. **Link to existing project?** → `N`（首次部署选择 No）
4. **What's your project's name?** → 输入项目名称，如 `english-practice`
5. **In which directory is your code located?** → 按回车（当前目录）
6. **Want to override the settings?** → `N`（使用默认设置）

等待 2-3 分钟，部署完成后会显示：
```
✅ Production: https://english-practice.vercel.app
```

#### 步骤 4：生产环境部署

```bash
vercel --prod
```

这将部署到生产环境（而非预览环境）。

### 方式二：使用 Vercel 网页界面（推荐给新手）

#### 步骤 1：初始化 Git 仓库

```bash
# 在项目根目录执行
git init
git add .
git commit -m "初始化儿童英语发音练习应用"
```

#### 步骤 2：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名称，如 `english-practice`
3. 选择 **Public**（公开仓库）或 **Private**（私有仓库）
4. 点击 "Create repository"
5. 按照提示推送代码：

```bash
git remote add origin https://github.com/你的用户名/english-practice.git
git branch -M main
git push -u origin main
```

#### 步骤 3：在 Vercel 导入项目

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Login"，使用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 在 "Import Git Repository" 列表中选择你的仓库
5. 点击 "Import"

#### 步骤 4：配置项目

Vercel 会自动识别 Next.js 项目，填写以下信息：

- **Project Name**: `english-practice`（或您喜欢的名称）
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `pnpm run build`（自动填充）
- **Output Directory**: `.next`（自动填充）
- **Install Command**: `pnpm install`（自动填充）
- **Node.js Version**: `20.x` 或 `24.x`

#### 步骤 5：部署

点击 "Deploy" 按钮，等待 2-3 分钟。

#### 步骤 6：获取访问地址

部署成功后，会显示：
```
Congratulations!
Your application is now live at:
https://english-practice.vercel.app
```

## 🎉 部署成功后

### 访问应用

点击 Vercel 提供的链接，如：
```
https://english-practice.vercel.app
```

### 分享链接

将这个地址分享给学生：
```
🎤 儿童英语发音练习
点击链接开始练习：https://english-practice.vercel.app
```

### 生成二维码

使用二维码生成器（如 https://www.qrcode-generator.com/）将链接转为二维码，打印贴在教室。

## 🔄 更新应用

当您修改代码后，只需：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercel 会自动检测到更新并重新部署（约 2-3 分钟）。

## ⚙️ 环境变量说明

本项目使用以下环境变量，Vercel 会自动配置：

- `COZE_BUCKET_ENDPOINT_URL` - 对象存储端点
- `COZE_BUCKET_NAME` - 存储桶名称

**注意**：这些变量在 Vercel 环境中已预置，无需手动添加。

## 🔧 常见问题

### Q1: 部署失败，显示 "Build Error"

**解决方案**：
1. 检查 `package.json` 中的 `packageManager` 是否为 `"pnpm@9.0.0"`
2. 确保 Vercel 的 "Install Command" 是 `pnpm install`
3. 查看构建日志，定位具体错误

### Q2: 部署后访问显示 404

**解决方案**：
1. 检查 `vercel.json` 文件是否存在
2. 确认 `package.json` 中的 `build` 脚本正确
3. 重新部署：`vercel --prod`

### Q3: 音频功能不工作

**解决方案**：
1. 检查环境变量是否正确配置
2. 查看 Vercel 的 Function Logs 排查错误
3. 确保浏览器允许麦克风权限

### Q4: 应用休眠后首次访问很慢

**说明**：
- 这是 Vercel 免费版的正常行为
- 15 分钟无人访问后应用休眠
- 首次唤醒需要 30-60 秒

**解决方案**：
- 定期访问应用保持活跃
- 升级到 Vercel Pro（$20/月，不休眠）

### Q5: 如何绑定自定义域名？

**步骤**：
1. 在 Vercel 项目设置中，点击 "Domains"
2. 添加您的域名，如 `english.yourdomain.com`
3. 按照 Vercel 的提示配置 DNS 记录
4. 等待 DNS 生效（通常 10-30 分钟）

## 📊 Vercel 免费版限制

- ✅ **带宽**：100GB/月
- ✅ **部署次数**：无限
- ✅ **SSL 证书**：自动配置
- ✅ **域名绑定**：支持自定义域名
- ⏱️ **休眠时间**：15 分钟无访问后休眠

## 🎓 学习资源

- Vercel 官方文档：https://vercel.com/docs
- Next.js 部署指南：https://nextjs.org/docs/deployment
- Vercel CLI 文档：https://vercel.com/docs/cli

## 💡 提示

1. **首次部署可能需要 5-10 分钟**，请耐心等待
2. **GitHub 仓库设置为公开**，学生和家长可以直接访问
3. **定期访问应用**，避免长时间休眠
4. **查看使用统计**，在 Vercel 仪表板可以查看访问量

## 🆘 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel 构建日志
2. 访问 Vercel 社区论坛：https://vercel.com/community
3. 联系 Vercel 支持

---

**祝您部署顺利！🎉**
