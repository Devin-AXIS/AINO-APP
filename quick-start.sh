#!/bin/bash

# iPollo Base 一键启动脚本
# Quick Start Script for iPollo Base Project

echo "🚀 iPollo Base 项目一键启动"
echo "================================"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json 文件"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    exit 1
fi

echo "✅ 环境检查通过"
echo "📦 检查依赖..."

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📥 安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "✅ 依赖已存在"
fi

echo ""
echo "🌟 启动开发服务器..."
echo "📍 项目地址: http://localhost:3002"
echo "⏹️  按 Ctrl+C 停止服务器"
echo "================================"
echo ""

# 启动开发服务器
npm run dev
