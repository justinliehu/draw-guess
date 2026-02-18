# PowerShell 启动脚本
Set-Location $PSScriptRoot
Write-Host "正在启动开发服务器..." -ForegroundColor Green
Write-Host ""
& ".\node_modules\.bin\vite.cmd"
