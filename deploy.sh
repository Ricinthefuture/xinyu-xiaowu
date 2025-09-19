#!/bin/bash

echo "🚀 开始部署心语小屋到Vercel..."

# 检查是否安装了vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
echo "🔐 检查Vercel登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "请先登录Vercel:"
    vercel login
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 部署到Vercel
echo "🌐 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo ""
echo "📋 接下来请在Vercel面板中设置环境变量:"
echo "1. ZHIPU_API_KEY = 46b77f9d84f94e7abfe3c3f108f4ad12.PN6A1pwa4e3SO38E"
echo "2. NEXT_PUBLIC_SUPABASE_URL = 你的Supabase项目URL"
echo "3. NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的Supabase匿名密钥"
echo ""
echo "🌟 设置完环境变量后，网站将自动重新部署！"
