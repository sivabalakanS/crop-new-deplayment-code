@echo off
echo ========================================
echo   SmartAgri - Starting Public Server
echo ========================================
echo.

:: Start the Node server in background
start "SmartAgri Server" cmd /k "cd /d d:\crop project - mini\crop website && npm start"

:: Wait for server to boot
echo Waiting for server to start...
timeout /t 4 /nobreak >nul

:: Start localtunnel and show URL
echo.
echo ========================================
echo  Starting public tunnel...
echo  Your public URL will appear below.
echo  Share this URL with anyone!
echo ========================================
echo.
npx localtunnel --port 3001 --subdomain smartagri-farmer 2>nul || npx localtunnel --port 3001

pause
