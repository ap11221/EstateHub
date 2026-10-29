@echo off
title EstateHub - Reset Demo Data
echo ========================================================
echo          EstateHub - Reset Sample Demo Data
echo ========================================================
echo.
cd /d "%~dp0backend"
node seed/seed.js
echo.
echo ========================================================
echo Done! All sample listings, accounts, and pending status
echo have been restored to their original state.
echo ========================================================
pause
