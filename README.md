# 🎤 儿童英语发音练习应用

这是一个基于 [Next.js 16](https://nextjs.org) + [shadcn/ui](https://ui.shadcn.com) 的儿童英语发音练习应用，集成了 AI 语音识别和发音评估功能。

## ✨ 功能特点

- 🎯 **单词练习**：包含 5 个基础英语单词（sheep, pig, horse, cow, rabbit）
- 🔊 **标准发音**：使用 AI 语音合成生成标准英语发音
- 🎙️ **录音功能**：学生可以录制自己的发音
- 🤖 **AI 评估**：智能识别和评估发音准确性
- 💡 **纠错反馈**：提供具体的改进建议和评分
- 🎨 **儿童友好**：色彩鲜艳、操作简单、界面可爱

## 🚀 快速开始

### 本地开发

```bash
# 启动开发服务器
coze dev
```

启动后，在浏览器中打开 [http://localhost:5000](http://localhost:5000) 查看应用。

开发服务器支持热更新，修改代码后页面会自动刷新。

### 构建生产版本

```bash
coze build
```

### 启动生产服务器

```bash
coze start
```

## 🌐 部署到 Vercel（推荐）

本应用可以免费永久部署到 Vercel，获得公网访问地址。

### 方法一：通过 Vercel CLI 部署

1. **安装 Vercel CLI**

```bash
pnpm add -g vercel
```

2. **登录 Vercel**

```bash
vercel login
```

3. **部署项目**

```bash
vercel
```

按照提示操作：
- 选择链接到现有项目还是创建新项目
- 确认项目设置（Vercel 会自动识别 Next.js 项目）
- 等待部署完成（约 2-3 分钟）

4. **获取部署地址**

部署成功后，Vercel 会提供一个地址，例如：
```
https://your-app-name.vercel.app
```

### 方法二：通过 Vercel 网页部署

1. **推送代码到 GitHub**
   - 将项目代码推送到 GitHub 仓库
   - 仓库应该是公开的或设置 Vercel 访问权限

2. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

4. **配置项目**
   - **Framework Preset**: Next.js（自动检测）
   - **Build Command**: `pnpm run build`（自动填充）
   - **Output Directory**: `.next`（自动填充）
   - **Install Command**: `pnpm install`（自动填充）
   - **Node.js Version**: 24.x

5. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 获取公网地址

### 环境变量配置

本项目使用的环境变量会在 Vercel 环境中自动配置，无需手动设置：
- `COZE_BUCKET_ENDPOINT_URL` - 对象存储端点
- `COZE_BUCKET_NAME` - 存储桶名称

### 查看部署

部署成功后：
- 在 Vercel 仪表板查看部署状态
- 访问提供的公网地址
- 可以绑定自定义域名（可选）

### 持续部署

将代码推送到 GitHub 后，Vercel 会自动重新部署：
```bash
git add .
git commit -m "更新内容"
git push
```

## 📱 分享给学生

部署成功后，您可以通过以下方式分享：

1. **直接分享链接**：将 Vercel 地址发送给学生/家长
2. **生成二维码**：使用二维码生成器将链接转为二维码
3. **打印二维码**：将二维码打印贴在教室

示例链接格式：
```
🎤 儿童英语发音练习
点击链接开始练习：https://your-app-name.vercel.app
```

## 🎯 使用流程

1. 学生选择一个单词（如 sheep）
2. 点击"听标准发音"，学习正确发音
3. 点击"开始录音"，跟读单词
4. 点击"停止录音"，AI 自动分析
5. 查看评分和改进建议
6. 根据建议再次练习

## 📁 项目结构

```
src/
├── app/                      # Next.js App Router 目录
│   ├── layout.tsx           # 根布局组件
│   ├── page.tsx             # 首页（发音练习主界面）
│   ├── globals.css          # 全局样式（包含 shadcn 主题变量）
│   ├── api/
│   │   ├── tts/             # 语音合成 API
│   │   │   └── route.ts
│   │   └── evaluate-pronunciation/  # 发音评估 API
│   │       └── route.ts
│   └── [route]/             # 其他路由页面
├── components/              # React 组件目录
│   └── ui/                  # shadcn/ui 基础组件（优先使用）
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── ...
├── lib/                     # 工具函数库
│   └── utils.ts            # cn() 等工具函数
└── hooks/                   # 自定义 React Hooks（可选）
```

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS 4
- **AI 集成**:
  - 语音合成 (TTS) - 豆包语音
  - 语音识别 (ASR) - 豆包语音
  - 大语言模型 (LLM) - 豆包大模型
  - 对象存储 (S3) - 对象存储集成

## 📝 开发规范

### 1. 组件开发

**优先使用 shadcn/ui 基础组件**

本项目已预装完整的 shadcn/ui 组件库，位于 `src/components/ui/` 目录。

```tsx
// ✅ 推荐：使用 shadcn 基础组件
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>标题</CardHeader>
      <CardContent>
        <Button>提交</Button>
      </CardContent>
    </Card>
  );
}
```

### 2. 依赖管理

**必须使用 pnpm 管理依赖**

```bash
# ✅ 安装依赖
pnpm install

# ✅ 添加新依赖
pnpm add package-name

# ❌ 禁止使用 npm 或 yarn
# npm install  # 错误！
# yarn add     # 错误！
```

### 3. 路由开发

```bash
# 创建 API 路由
src/app/api/your-route/route.ts
```

## 💡 常见问题

### Q: 应用会过期吗？
A: Vercel 免费版永久托管，不会过期。但如果 15 分钟无人访问，应用会进入休眠，下次访问需要 30-60 秒唤醒。

### Q: 有使用限制吗？
A: Vercel 免费版提供：
- 100GB 带宽/月
- 无限次部署
- SSL 证书自动配置

### Q: 如何更新应用？
A: 修改代码后，推送到 GitHub，Vercel 会自动重新部署。

### Q: 需要什么账号？
A: 只需要一个 GitHub 账号（免费注册）。

## 📄 许可证

MIT License
