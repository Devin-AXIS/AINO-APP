@echo off
REM iPollo Base Project Startup Script for Windows
REM Windows 项目启动脚本

echo 🚀 启动 iPollo Base 项目...

REM 检查是否安装了 pnpm
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 pnpm，请先安装 pnpm
    echo 安装命令: npm install -g pnpm
    pause
    exit /b 1
)

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 未找到 package.json 文件，请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 安装依赖（如果需要）
echo 📦 检查并安装依赖...
pnpm install

REM 启动开发服务器
echo 🌟 启动开发服务器...
echo 项目将在 http://localhost:3002 启动
echo 按 Ctrl+C 停止服务器
echo.

pnpm dev
