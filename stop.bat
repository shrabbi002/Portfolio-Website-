@echo off
echo Stopping Portfolio servers...
taskkill /F /FI "WINDOWTITLE eq Portfolio Backend*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Portfolio Frontend*" 2>nul
taskkill /F /IM node.exe 2>nul
echo All servers stopped.
timeout /t 2 /nobreak >nul
