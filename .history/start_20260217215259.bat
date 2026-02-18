@echo off
cd /d "%~dp0"
echo 正在启动开发服务器...
echo.
node_modules\.bin\vite.cmd
pause
