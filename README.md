# 心语小屋 - 温暖的AI情感陪伴助手

一个基于ABC理论的AI情感陪伴助手，为用户提供温暖的心理支持和情绪管理指导。

## ✨ 功能特色

- 🧠 **ABC理论指导** - 基于认知行为疗法的ABC理论
- 💕 **温暖陪伴** - 7×24小时情感支持
- 🌱 **成长陪伴** - 帮助用户获得洞察和成长
- 🔐 **安全认证** - 完整的用户认证系统
- 💾 **数据持久化** - 对话和情绪数据保存
- 📱 **响应式设计** - 完美的移动端适配

## 🛠️ 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI**: GitHub Models API
- **部署**: Vercel (推荐)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd 情绪机器人
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

创建 `.env.local` 文件：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# GitHub Models API Token
GITHUB_TOKEN=your_github_token_here

# 应用配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. 数据库设置

1. 在 Supabase 项目中运行 `supabase/migrations/001_initial_schema.sql`
2. 配置认证重定向URL：
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
src/
├── app/
│   ├── api/ai/chat/         # AI对话API
│   ├── auth/                # 认证页面
│   ├── chat/                # 聊天页面
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页
├── components/
│   ├── AuthForm.tsx         # 认证表单
│   └── ChatWindow.tsx       # 聊天窗口
├── hooks/
│   └── useAuth.tsx          # 认证Hook
├── lib/
│   ├── ai.ts                # AI客户端
│   └── supabase.ts          # Supabase配置
└── types/
    ├── database.ts          # 数据库类型
    └── index.ts             # 通用类型
```

## 🎯 核心功能

### ABC理论情绪分析

基于认知行为疗法的ABC理论：
- **A (Activating Event)**: 激发事件
- **B (Belief)**: 信念/想法  
- **C (Consequence)**: 情绪和行为结果

### 用户认证

- 邮箱注册/登录
- 邮箱确认
- 会话管理
- 用户资料管理

### AI对话

- 基于GitHub Models API
- 温暖的情感陪伴
- 专业的心理支持
- 对话历史保存

## 🔧 开发指南

### 添加新功能

1. 在相应目录创建组件/页面
2. 更新类型定义 (`src/types/`)
3. 如需数据库更改，创建新的迁移文件
4. 更新RLS策略确保数据安全

### 样式定制

项目使用 Tailwind CSS，主要配置在 `tailwind.config.ts`:
- 自定义颜色主题
- 动画效果
- 组件样式类

## 📝 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 部署完成后更新 Supabase 重定向URL

### 环境变量

确保在生产环境中正确配置所有环境变量，特别是：
- Supabase 配置
- GitHub Token
- NextAuth Secret

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

💕 用心陪伴每一个需要倾听的灵魂
