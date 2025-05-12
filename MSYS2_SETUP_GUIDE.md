# MSYS2 Setup Guide for Chess Game

This guide will help you complete the MSYS2 setup and compile the chess game.

## Complete MSYS2 Setup

1. **Open MSYS2 UCRT64** from the Start menu
   - Look for "MSYS2 UCRT64" in your Start menu

2. **Update the package database and core packages**
   ```bash
   pacman -Syu
   ```
   - When prompted to close the terminal, type 'Y' and press Enter
   - The terminal will close automatically

3. **Reopen MSYS2 UCRT64** from the Start menu

4. **Update the rest of the packages**
   ```bash
   pacman -Su
   ```

5. **Install the MinGW-w64 GCC compiler**
   ```bash
   pacman -S mingw-w64-ucrt-x86_64-gcc
   ```
   - When prompted to proceed with installation, type 'Y' and press Enter

6. **Install make**
   ```bash
   pacman -S mingw-w64-ucrt-x86_64-make
   ```
   - When prompted to proceed with installation, type 'Y' and press Enter

7. **Add MSYS2 to your PATH**
   - Open Windows Settings
   - Search for "Edit environment variables for your account"
   - Select "Path" and click "Edit"
   - Add a new entry: `C:\msys64\ucrt64\bin` (or your MSYS2 installation path)
   - Click "OK" to save changes

## Compile and Run the Chess Game

### Method 1: Using the Batch File

1. Double-click on `compile_with_msys2.bat` in the chess game directory
2. If compilation is successful, you can run the game by typing `chess_game`

### Method 2: Using MSYS2 Terminal

1. Open MSYS2 UCRT64 from the Start menu
2. Navigate to the chess game directory
   ```bash
   cd /c/Users/YOUR_USERNAME/Downloads/cheesgame
   ```
   (Replace YOUR_USERNAME with your Windows username)
3. Compile the game
   ```bash
   gcc -Wall -Wextra -std=c99 -o chess_game chess_game.c
   ```
4. Run the game
   ```bash
   ./chess_game
   ```

## Playing the Chess Game

1. The game starts with White's turn
2. Enter moves in algebraic notation without the piece identifier, e.g., `e2e4` or `e2 e4`
3. The board coordinates are as follows:
   - Columns: a-h (from left to right)
   - Rows: 8-1 (from top to bottom)
4. To quit the game, type `quit` or `exit`

## Troubleshooting

- If you encounter any issues with the batch file, try using Method 2 (MSYS2 Terminal)
- If you get "command not found" errors, make sure you've added MSYS2 to your PATH
- If compilation fails, make sure you've installed the GCC compiler correctly
