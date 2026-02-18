@echo off
cd /d "%~dp0"

echo.
echo ========================================
echo   Draw and Guess - Local Server
echo ========================================
echo.
echo Open in browser:
echo   http://localhost:8080/index-standalone.html
echo.
echo Phone + PC same room: on PC open with LAN IP, e.g.:
echo   http://192.168.x.x:8080/index-standalone.html
echo   (Replace 192.168.x.x with your PC IP, run ipconfig to check)
echo.
echo Press Ctrl+C to stop. Close this window to exit.
echo ========================================
echo.

REM Prefer Node: game needs server.cjs for rooms / API
set "NODECMD="
where node >nul 2>nul
if %errorlevel% equ 0 set "NODECMD=node"
if not defined NODECMD if exist "%ProgramFiles%\nodejs\node.exe" set "NODECMD=%ProgramFiles%\nodejs\node.exe"
if not defined NODECMD if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODECMD=%ProgramFiles(x86)%\nodejs\node.exe"
if defined NODECMD (
  echo [OK] Starting with Node...
  "%NODECMD%" server.cjs
  goto :end
)

REM Fallback: Python static server (no room API - single device only)
where py >nul 2>nul
if %errorlevel% equ 0 (
  echo [OK] Starting with Python (static only, no room API)...
  py -m http.server 8080
  goto :end
)
where python >nul 2>nul
if %errorlevel% equ 0 (
  python -c "exit(0)" >nul 2>nul
  if %errorlevel% equ 0 (
    echo [OK] Starting with Python (static only, no room API)...
    python -m http.server 8080
    goto :end
  )
)

REM Last: npx serve
where npx >nul 2>nul
if %errorlevel% equ 0 (
  echo [OK] Starting with npx serve...
  npx -y serve -p 8080
  goto :end
)

echo [X] Node.js not found. This game needs Node for rooms.
echo.
echo Install Node.js, then run this again:
echo   https://nodejs.org
echo.

:end
echo.
echo ----------------------------------------
echo Server stopped. Press any key to close.
pause >nul
