@echo off
title Nexa Digital Services
cd /d "%~dp0"
echo ======================================================
echo Starting Nexa Digital Services local server...
echo ======================================================
node server.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Node.js not detected. Trying Python server...
  start http://localhost:8000
  python -m http.server 8000
)
pause

