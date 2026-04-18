@echo off
echo Starting MongoDB...
start "MongoDB" mongod

timeout /t 3 /nobreak > nul

echo Starting Node Server...
cd /d "%~dp0"
npm run dev

pause