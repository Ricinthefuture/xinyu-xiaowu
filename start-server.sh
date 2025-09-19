#!/bin/bash

echo "🚀 启动情绪机器人开发服务器..."

# 1. 检查并切换到正确目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo "📁 当前目录: $(pwd)"

# 2. 检查必要文件
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json 文件"
    exit 1
fi

echo "✅ 项目文件检查通过"

# 3. 检查并终止现有进程
echo "🔍 检查现有进程..."
EXISTING_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$EXISTING_PID" ]; then
    echo "⚠️  发现端口3000被占用 (PID: $EXISTING_PID)"
    echo "🔄 正在终止现有进程..."
    kill -9 $EXISTING_PID 2>/dev/null
    sleep 2
fi

# 4. 检查环境变量
if [ -f ".env.local" ]; then
    echo "✅ 找到 .env.local 文件"
else
    echo "⚠️  未找到 .env.local 文件，某些功能可能不可用"
fi

# 5. 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 6. 启动服务器
echo "🚀 启动开发服务器..."
echo "📍 服务器将在 http://localhost:3000 启动"
echo "💡 按 Ctrl+C 停止服务器"
echo ""

npm run dev
