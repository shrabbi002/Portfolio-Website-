@echo off
echo ===================================================
echo Pushing latest UI and Animation updates to GitHub...
echo ===================================================
echo.
echo [1/3] Staging changes...
git add .
echo.
echo [2/3] Committing updates...
git commit -m "feat: improve overall UI design and add animations in both admin and web"
echo.
echo [3/3] Pushing to repository...
git push origin main
echo.
echo ===================================================
echo Git push sequence completed!
echo ===================================================
pause
