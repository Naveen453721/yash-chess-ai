@echo off
echo Compiling chess game with MSYS2...

REM Check if MSYS2 is installed
if exist "C:\msys64\ucrt64.exe" (
    echo MSYS2 found at C:\msys64
    set MSYS2_PATH=C:\msys64
) else if exist "C:\msys2\ucrt64.exe" (
    echo MSYS2 found at C:\msys2
    set MSYS2_PATH=C:\msys2
) else (
    echo MSYS2 not found in standard locations.
    echo Please enter the path to your MSYS2 installation:
    set /p MSYS2_PATH=
    
    if not exist "%MSYS2_PATH%\ucrt64.exe" (
        echo Invalid MSYS2 path. Exiting.
        exit /b 1
    )
)

REM Get the current directory
set CURRENT_DIR=%CD%

REM Compile the chess game using MSYS2's GCC
echo Compiling with MSYS2's GCC...
"%MSYS2_PATH%\ucrt64.exe" -c "cd '%CURRENT_DIR%' && gcc -Wall -Wextra -std=c99 -o chess_game chess_game.c && echo Compilation successful!"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Compilation successful! You can now run the game by typing:
    echo chess_game
) else (
    echo.
    echo Compilation failed.
)

pause
