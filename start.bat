@echo off
echo ============================================
echo   Portfolio Full System Startup
echo ============================================
echo.

REM Kill any existing node processes on ports 3000 and 5000
echo Stopping any existing servers...
taskkill /F /IM node.exe 2>nul
ping 127.0.0.1 -n 3 >nul

REM Start Backend in background (hidden window)
echo Starting Backend API on port 5000...
start "Portfolio Backend" /min cmd /k "cd /d \"%~dp0backend\" && npm run dev"

REM Wait a few seconds for backend to initialize
ping 127.0.0.1 -n 5 >nul

REM Start Frontend in background (hidden window)
echo Starting Frontend on port 3000...
start "Portfolio Frontend" /min cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

REM Wait for frontend to start
ping 127.0.0.1 -n 6 >nul

echo.
echo ============================================
echo   System is starting up!
echo ============================================
echo.
echo   Local:    http://localhost:3000
echo   Network:  http://192.168.0.173:3000
echo   Admin:    http://192.168.0.173:3000/admin/login
echo.
echo Both servers are running minimized in the taskbar.
echo Close the "Portfolio Backend" and "Portfolio Frontend"
echo windows to stop the servers.
echo.
pause
