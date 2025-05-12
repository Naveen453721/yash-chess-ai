# Chess Game

A beautiful, interactive chess game built with HTML, CSS, and JavaScript.

## Features

- Landing page with game mode selection
- Play against "Yash" (AI opponent) or another player
- Visual chessboard with Unicode chess pieces
- Click-to-move interface
- Highlights valid moves
- Move history display
- Game state tracking (whose turn, checkmate, stalemate)
- Responsive design that works on desktop and mobile

## How to Play

1. Open the game by visiting: https://naveen453721.github.io/chess-master/
2. Or download the repository and open `index.html` in any modern web browser

### Gameplay

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

- Pure HTML, CSS, and JavaScript (no frameworks or libraries)
- Unicode chess symbols for pieces
- CSS Grid for the chessboard layout
- Responsive design that works on various screen sizes
- 3D animations and visual effects
- AI opponent with strategic decision making

## Future Improvements

- Complete move validation for each piece type
- Implement special moves (castling, en passant, pawn promotion options)
- Add proper check and checkmate detection
- Add sound effects to the visual version
- Add a timer
- Implement a simple AI opponent
