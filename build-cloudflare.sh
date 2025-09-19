#!/bin/bash

echo "☁️ 为Cloudflare Pages构建心语小屋"
echo "================================"

# 检查环境
echo "📋 检查构建环境..."
node --version
npm --version

# 清理之前的构建
echo "🧹 清理构建缓存..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "out" ]; then
    echo "✅ 静态文件构建成功！"
    echo "📁 构建输出目录: out/"
    echo "📊 文件统计:"
    find out -type f | wc -l | xargs echo "  - 文件总数:"
    du -sh out | cut -f1 | xargs echo "  - 总大小:"
else
    echo "❌ 构建失败！检查错误日志。"
    exit 1
fi

echo ""
echo "🎉 构建完成！"
echo "📤 下一步: 将代码推送到GitHub"
echo "git add ."
echo "git commit -m 'Deploy to Cloudflare Pages'"
echo "git push origin main"
