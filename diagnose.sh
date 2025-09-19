#!/bin/bash

echo "🔍 情绪机器人服务器诊断工具"
echo "================================="

# 1. 检查当前目录
echo ""
echo "📁 目录检查:"
echo "当前目录: $(pwd)"
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不存在"
fi

# 2. 检查端口占用
echo ""
echo "🔌 端口检查:"
PORT_CHECK=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PORT_CHECK" ]; then
    echo "⚠️  端口3000被占用"
    echo "占用进程PID: $PORT_CHECK"
    ps -p $PORT_CHECK -o pid,ppid,cmd 2>/dev/null
else
    echo "✅ 端口3000空闲"
fi

# 3. 检查Node.js和npm
echo ""
echo "🔧 环境检查:"
echo "Node.js版本: $(node --version 2>/dev/null || echo '❌ Node.js未安装')"
echo "npm版本: $(npm --version 2>/dev/null || echo '❌ npm未安装')"

# 4. 检查依赖
echo ""
echo "📦 依赖检查:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules 存在"
    PACKAGE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "已安装包数量: $((PACKAGE_COUNT - 1))"
else
    echo "❌ node_modules 不存在，需要运行 npm install"
fi

# 5. 检查环境变量文件
echo ""
echo "🔑 环境变量检查:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local 存在"
    if grep -q "GITHUB_TOKEN" .env.local 2>/dev/null; then
        echo "✅ GITHUB_TOKEN 已配置"
    else
        echo "⚠️  GITHUB_TOKEN 未配置"
    fi
else
    echo "❌ .env.local 不存在"
fi

# 6. 检查关键文件
echo ""
echo "📄 关键文件检查:"
FILES=("next.config.js" "tailwind.config.ts" "tsconfig.json" "src/app/layout.tsx" "src/app/page.tsx")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo "================================="
echo "诊断完成！"
