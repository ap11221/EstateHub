@echo off
title NestFind - Real Estate Portal
echo ========================================================
echo       Starting NestFind Real Estate Portal
echo ========================================================
echo.
echo 1. Starting Backend API Server (Port 5000)...
start "NestFind Backend (Port 5000)" cmd /k "cd /d \"%~dp0backend\" && npm run start"

echo.
echo 2. Starting Frontend Dev Server (Port 5173)...
start "NestFind Frontend (Port 5173)" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo ========================================================
echo Both servers are starting up:
echo   - Backend API: http://localhost:5000
echo   - Frontend:    http://localhost:5173
echo.
echo Demo Accounts:
echo   - Admin: admin@realestate.com / admin123
echo   - Owner: owner@realestate.com / owner123
echo   - User:  user@realestate.com  / user123
echo.
echo Opening browser to http://localhost:5173...
timeout /t 3 >nul
start http://localhost:5173
echo ========================================================
