@echo off
echo Compiling simple chess game...

REM Try to find a C compiler
where gcc >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found GCC, compiling...
    gcc -o simple_chess simple_chess.c
    if %ERRORLEVEL% EQU 0 (
        echo Compilation successful! Run the game with: simple_chess
    ) else (
        echo Compilation failed.
    )
    goto :EOF
)

where cl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found Visual C++ compiler, compiling...
    cl /Fe:simple_chess.exe simple_chess.c
    if %ERRORLEVEL% EQU 0 (
        echo Compilation successful! Run the game with: simple_chess
    ) else (
        echo Compilation failed.
    )
    goto :EOF
)

echo No C compiler found. Please install a C compiler like MinGW or Visual Studio.
echo See the MSYS2_SETUP_GUIDE.md file for instructions.

pause
