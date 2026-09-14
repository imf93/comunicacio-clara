@echo off
cd /d "%~dp0"
set "PV_NODE=%LOCALAPPDATA%\codex-runtimes\node.exe"
set "PV_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%PV_NODE%" set "PV_NODE=node"
"%PV_NODE%" -e "if(Number(process.versions.node.split('.')[0])<24)process.exit(1)"
if errorlevel 1 (
 echo Necesitas instalar Node.js 24 o superior desde https://nodejs.org/
 pause
 exit /b 1
)
echo Abre http://127.0.0.1:4173 en tu navegador.
echo La contrasena del organizador aparece a continuacion.
"%PV_NODE%" --env-file-if-exists=.env scripts/start-local.mjs
pause

