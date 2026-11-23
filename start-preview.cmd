@echo off
cd /d "%~dp0"
set "PANDA_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PANDA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
start "" "http://127.0.0.1:4174/data-service"
"%PANDA_NODE%" server.mjs
pause
