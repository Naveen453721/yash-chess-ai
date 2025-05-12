@echo off
echo Running Python chess game...

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found Python, running game...
    python chess_game.py
    goto :EOF
)

where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found Python 3, running game...
    python3 chess_game.py
    goto :EOF
)

echo Python not found. Please install Python from https://www.python.org/downloads/
echo After installing Python, run this batch file again.

pause
