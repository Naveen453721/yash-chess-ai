# Chess Game

A chess game with both text-based and visual web interfaces.

## Visual Chess Game (HTML/JavaScript)

A beautiful, interactive chess game built with HTML, CSS, and JavaScript.

### Features

- Landing page with game mode selection
- Play against "Yash" (AI opponent) or another player
- Visual chessboard with Unicode chess pieces
- Click-to-move interface
- Highlights valid moves
- Move history display
- Game state tracking (whose turn, checkmate, stalemate)
- Responsive design that works on desktop and mobile

### How to Play the Visual Version

#### Method 1: Using a Local Server (Recommended)

1. Run the `start_server.bat` file
2. The chess game will automatically open in your default browser at http://localhost:8000
3. To stop the server, press Ctrl+C in the command prompt window

#### Method 2: Direct File Opening

1. Open `index.html` in any modern web browser
2. This method works but may have limitations with some browsers' security policies

#### Gameplay

1. On the landing page, choose between:
   - "Play vs Yash (AI)" - Play against the computer opponent
   - "Two Players" - Play against a friend on the same device
2. The game starts with White's turn
3. Click on a piece to select it
4. Valid moves will be highlighted with green dots
5. Click on a highlighted square to move the piece
6. The game will automatically switch turns
7. When playing against Yash (AI), the computer will automatically make its move after you
8. Click "New Game" to reset the board at any time
9. Click "Back to Menu" to return to the landing page

## Text-Based Chess Game (C and Python)

A simple text-based chess game implemented in both C and Python.

### Features

- Text-based chess board display
- Basic move validation
- Two-player gameplay (White and Black)
- Simple command-line interface

### Prerequisites for C Version

Before you can compile and run the C version, you need to have a C compiler installed on your system.

#### Installing a C Compiler

##### Windows
1. **MinGW-w64** (Recommended):
   - Download the installer from [MinGW-w64](https://www.mingw-w64.org/downloads/)
   - Follow the installation instructions
   - Add the bin directory to your PATH environment variable

2. **Visual Studio Community Edition**:
   - Download from [Visual Studio](https://visualstudio.microsoft.com/vs/community/)
   - During installation, select "Desktop development with C++"

##### macOS
- Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

##### Linux
- Install GCC:
  ```bash
  sudo apt update
  sudo apt install build-essential
  ```

### How to Run the Python Version

```bash
# Run the game
python chess_game.py
```

### How to Compile and Run the C Version

#### Using the Batch File (Windows)

```batch
# Compile the game
compile_simple.bat

# Run the game
simple_chess
```

#### Manual Compilation

```bash
# Compile the game
gcc -Wall -Wextra -std=c99 -o simple_chess simple_chess.c

# Run the game
./simple_chess
```

### How to Play the Text-Based Versions

1. The game starts with White's turn.
2. Enter moves in algebraic notation without the piece identifier, e.g., `e2e4` or `e2 e4`.
3. The board coordinates are as follows:
   - Columns: a-h (from left to right)
   - Rows: 8-1 (from top to bottom)
4. To quit the game, type `quit` or `exit`.

## Game Rules

- Standard chess rules apply
- Pawns can move one square forward (or two from starting position)
- Pawns capture diagonally
- Knights move in an L-shape (2 squares in one direction, 1 square perpendicular)
- Bishops move diagonally
- Rooks move horizontally or vertically
- Queens can move like bishops or rooks
- Kings move one square in any direction
- In the visual version, pawns are automatically promoted to queens when they reach the opposite end of the board

## Technical Details

- Visual version: Pure HTML, CSS, and JavaScript (no frameworks or libraries)
- Text-based versions: C and Python implementations
- Unicode chess symbols for pieces in the visual version
- CSS Grid for the chessboard layout
- Responsive design that works on various screen sizes

## Future Improvements

- Complete move validation for each piece type
- Implement special moves (castling, en passant, pawn promotion options)
- Add proper check and checkmate detection
- Add sound effects to the visual version
- Add a timer
- Implement a simple AI opponent
