document.addEventListener('DOMContentLoaded', () => {
    // Chess pieces Unicode characters
    const pieces = {
        'white': {
            'king': '♔',
            'queen': '♕',
            'rook': '♖',
            'bishop': '♗',
            'knight': '♘',
            'pawn': '♙'
        },
        'black': {
            'king': '♚',
            'queen': '♛',
            'rook': '♜',
            'bishop': '♝',
            'knight': '♞',
            'pawn': '♟'
        }
    };

    // Initial board setup
    const initialBoard = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];

    // Game state
    let board = JSON.parse(JSON.stringify(initialBoard));
    let currentPlayer = 'white';
    let selectedPiece = null;
    let moveHistory = [];
    let gameOver = false;
    let gameMode = 'two-player'; // 'single-player' or 'two-player'
    let aiThinking = false;

    // DOM elements
    const landingPage = document.getElementById('landing-page');
    const gameContainer = document.getElementById('game-container');
    const chessboard = document.getElementById('chessboard');
    const statusElement = document.getElementById('status');
    const gameModeElement = document.getElementById('game-mode');
    const resetButton = document.getElementById('reset-btn');
    const backButton = document.getElementById('back-btn');
    const movesElement = document.getElementById('moves');
    const singlePlayerOption = document.getElementById('single-player');
    const twoPlayerOption = document.getElementById('two-player');

    // Initialize the board
    function initializeBoard() {
        chessboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
                square.dataset.row = row;
                square.dataset.col = col;

                // Add piece if there is one
                if (board[row][col]) {
                    const color = board[row][col][0] === 'w' ? 'white' : 'black';
                    const pieceType = getPieceType(board[row][col][1]);
                    square.textContent = pieces[color][pieceType];
                }

                square.addEventListener('click', handleSquareClick);
                chessboard.appendChild(square);
            }
        }

        updateStatus();
    }

    // Get piece type from code
    function getPieceType(code) {
        switch (code) {
            case 'k': return 'king';
            case 'q': return 'queen';
            case 'r': return 'rook';
            case 'b': return 'bishop';
            case 'n': return 'knight';
            case 'p': return 'pawn';
            default: return '';
        }
    }

    // Handle square click
    function handleSquareClick(event) {
        if (gameOver || aiThinking) return;

        // In single-player mode, only allow white pieces to be moved by the player
        if (gameMode === 'single-player' && currentPlayer === 'black') return;

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        // If no piece is selected
        if (!selectedPiece) {
            // Check if there's a piece on the clicked square and it belongs to the current player
            if (board[row][col] && board[row][col][0] === (currentPlayer === 'white' ? 'w' : 'b')) {
                selectedPiece = { row, col };
                event.target.classList.add('selected');

                // Highlight valid moves
                highlightValidMoves(row, col);
            }
        }
        // If a piece is already selected
        else {
            // If the same square is clicked again, deselect it
            if (selectedPiece.row === row && selectedPiece.col === col) {
                deselectPiece();
            }
            // If a different square is clicked
            else {
                // Check if the move is valid
                if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
                    // Record the move
                    const fromPiece = board[selectedPiece.row][selectedPiece.col];
                    const toPiece = board[row][col];
                    const moveNotation = generateMoveNotation(selectedPiece.row, selectedPiece.col, row, col, fromPiece, toPiece);

                    // Make the move
                    makeMove(selectedPiece.row, selectedPiece.col, row, col);

                    // Add to move history
                    moveHistory.push(moveNotation);
                    updateMoveHistory();

                    // Switch player
                    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                    updateStatus();

                    // Check for checkmate or stalemate
                    if (isCheckmate()) {
                        gameOver = true;
                        statusElement.textContent = `${currentPlayer === 'white' ? 'Black' : 'White'} wins by checkmate!`;
                    } else if (isStalemate()) {
                        gameOver = true;
                        statusElement.textContent = 'Game ends in stalemate!';
                    }

                    // If playing against AI and it's AI's turn
                    if (gameMode === 'single-player' && currentPlayer === 'black' && !gameOver) {
                        // Make AI move after a short delay
                        setTimeout(makeAIMove, 500);
                    }
                }

                // Deselect the piece
                deselectPiece();
            }
        }
    }

    // Deselect the currently selected piece
    function deselectPiece() {
        if (selectedPiece) {
            // Remove selected class from all squares
            document.querySelectorAll('.square').forEach(square => {
                square.classList.remove('selected');
                square.classList.remove('valid-move');
            });

            selectedPiece = null;
        }
    }

    // Highlight valid moves for a piece
    function highlightValidMoves(row, col) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (isValidMove(row, col, r, c)) {
                    const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                    square.classList.add('valid-move');
                }
            }
        }
    }

    // Check if a move is valid
    function isValidMove(fromRow, fromCol, toRow, toCol) {
        // Can't move to the same position
        if (fromRow === toRow && fromCol === toCol) {
            return false;
        }

        const piece = board[fromRow][fromCol];
        const targetPiece = board[toRow][toCol];

        // Can't capture own pieces
        if (targetPiece && targetPiece[0] === piece[0]) {
            return false;
        }

        // Piece-specific movement rules
        const pieceType = piece[1];
        const isWhite = piece[0] === 'w';

        switch (pieceType) {
            case 'p': // Pawn
                return isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite, targetPiece);
            case 'r': // Rook
                return isValidRookMove(fromRow, fromCol, toRow, toCol);
            case 'n': // Knight
                return isValidKnightMove(fromRow, fromCol, toRow, toCol);
            case 'b': // Bishop
                return isValidBishopMove(fromRow, fromCol, toRow, toCol);
            case 'q': // Queen
                return isValidQueenMove(fromRow, fromCol, toRow, toCol);
            case 'k': // King
                return isValidKingMove(fromRow, fromCol, toRow, toCol);
            default:
                return false;
        }
    }

    // Pawn movement validation
    function isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite, targetPiece) {
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;

        // Forward movement (no capture)
        if (fromCol === toCol && !targetPiece) {
            // Single square forward
            if (toRow === fromRow + direction) {
                return true;
            }

            // Double square forward from starting position
            if (fromRow === startRow && toRow === fromRow + 2 * direction && !board[fromRow + direction][fromCol]) {
                return true;
            }
        }

        // Diagonal capture
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && targetPiece) {
            return true;
        }

        return false;
    }

    // Rook movement validation
    function isValidRookMove(fromRow, fromCol, toRow, toCol) {
        // Rook moves horizontally or vertically
        if (fromRow !== toRow && fromCol !== toCol) {
            return false;
        }

        // Check if path is clear
        if (fromRow === toRow) {
            // Horizontal movement
            const start = Math.min(fromCol, toCol) + 1;
            const end = Math.max(fromCol, toCol);

            for (let c = start; c < end; c++) {
                if (board[fromRow][c]) {
                    return false;
                }
            }
        } else {
            // Vertical movement
            const start = Math.min(fromRow, toRow) + 1;
            const end = Math.max(fromRow, toRow);

            for (let r = start; r < end; r++) {
                if (board[r][fromCol]) {
                    return false;
                }
            }
        }

        return true;
    }

    // Knight movement validation
    function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
        // Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);

        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    // Bishop movement validation
    function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
        // Bishop moves diagonally
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);

        if (rowDiff !== colDiff) {
            return false;
        }

        // Check if path is clear
        const rowDirection = fromRow < toRow ? 1 : -1;
        const colDirection = fromCol < toCol ? 1 : -1;

        let r = fromRow + rowDirection;
        let c = fromCol + colDirection;

        while (r !== toRow && c !== toCol) {
            if (board[r][c]) {
                return false;
            }

            r += rowDirection;
            c += colDirection;
        }

        return true;
    }

    // Queen movement validation
    function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
        // Queen can move like a rook or a bishop
        return isValidRookMove(fromRow, fromCol, toRow, toCol) ||
               isValidBishopMove(fromRow, fromCol, toRow, toCol);
    }

    // King movement validation
    function isValidKingMove(fromRow, fromCol, toRow, toCol) {
        // King moves one square in any direction
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);

        return rowDiff <= 1 && colDiff <= 1;
    }

    // Make a move
    function makeMove(fromRow, fromCol, toRow, toCol) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = '';

        // Pawn promotion (simplified - always promotes to queen)
        if (board[toRow][toCol][1] === 'p' && (toRow === 0 || toRow === 7)) {
            board[toRow][toCol] = board[toRow][toCol][0] + 'q';
        }

        // Redraw the board
        initializeBoard();
    }

    // Generate algebraic notation for a move
    function generateMoveNotation(fromRow, fromCol, toRow, toCol, piece, capturedPiece) {
        const pieceSymbols = { 'k': 'K', 'q': 'Q', 'r': 'R', 'b': 'B', 'n': 'N', 'p': '' };
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        let notation = '';

        // Add piece symbol (except for pawns)
        notation += pieceSymbols[piece[1]];

        // Add starting position
        notation += files[fromCol] + ranks[fromRow];

        // Add capture symbol if applicable
        if (capturedPiece) {
            notation += 'x';
        } else {
            notation += '-';
        }

        // Add destination position
        notation += files[toCol] + ranks[toRow];

        // Add promotion if applicable
        if (piece[1] === 'p' && (toRow === 0 || toRow === 7)) {
            notation += '=Q';
        }

        return notation;
    }

    // Update the move history display
    function updateMoveHistory() {
        movesElement.innerHTML = '';

        for (let i = 0; i < moveHistory.length; i++) {
            const moveEntry = document.createElement('div');
            moveEntry.classList.add('move-entry');

            const moveNumber = document.createElement('span');
            moveNumber.classList.add('move-number');
            moveNumber.textContent = Math.floor(i / 2) + 1 + '.';

            const moveText = document.createElement('span');
            moveText.textContent = moveHistory[i];

            moveEntry.appendChild(moveNumber);
            moveEntry.appendChild(moveText);
            movesElement.appendChild(moveEntry);
        }

        // Scroll to bottom
        movesElement.scrollTop = movesElement.scrollHeight;
    }

    // This function is now replaced by the new updateStatus function below

    // Check for checkmate (simplified implementation)
    function isCheckmate() {
        // This is a placeholder for a real checkmate detection
        // In a real implementation, you would check if the king is in check
        // and if there are no legal moves that can get the king out of check
        return false;
    }

    // Check for stalemate (simplified implementation)
    function isStalemate() {
        // This is a placeholder for a real stalemate detection
        // In a real implementation, you would check if the current player
        // has no legal moves but the king is not in check
        return false;
    }

    // AI move function
    function makeAIMove() {
        if (gameOver || currentPlayer !== 'black') return;

        aiThinking = true;
        statusElement.textContent = "Yash (AI) is thinking...";

        // Collect all valid moves for black pieces
        const validMoves = [];

        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                // Check if there's a black piece at this position
                if (board[fromRow][fromCol] && board[fromRow][fromCol][0] === 'b') {
                    // Find all valid moves for this piece
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                                // Calculate a simple score for this move
                                let moveScore = 0;

                                // Prefer captures (higher value pieces are better captures)
                                if (board[toRow][toCol]) {
                                    const capturedPiece = board[toRow][toCol][1];
                                    switch (capturedPiece) {
                                        case 'p': moveScore += 10; break;
                                        case 'n':
                                        case 'b': moveScore += 30; break;
                                        case 'r': moveScore += 50; break;
                                        case 'q': moveScore += 90; break;
                                        case 'k': moveScore += 900; break;
                                    }
                                }

                                // Prefer center control for knights and bishops
                                if (board[fromRow][fromCol][1] === 'n' || board[fromRow][fromCol][1] === 'b') {
                                    if (toRow >= 2 && toRow <= 5 && toCol >= 2 && toCol <= 5) {
                                        moveScore += 5;
                                    }
                                }

                                // Prefer pawn advancement
                                if (board[fromRow][fromCol][1] === 'p') {
                                    moveScore += (7 - toRow); // Closer to promotion is better
                                }

                                // Add some randomness
                                moveScore += Math.random() * 5;

                                validMoves.push({
                                    fromRow,
                                    fromCol,
                                    toRow,
                                    toCol,
                                    score: moveScore
                                });
                            }
                        }
                    }
                }
            }
        }

        // Sort moves by score (highest first)
        validMoves.sort((a, b) => b.score - a.score);

        // Choose the best move (or a random one if no moves are available)
        if (validMoves.length > 0) {
            const move = validMoves[0];

            // Record the move
            const fromPiece = board[move.fromRow][move.fromCol];
            const toPiece = board[move.toRow][move.toCol];
            const moveNotation = generateMoveNotation(move.fromRow, move.fromCol, move.toRow, move.toCol, fromPiece, toPiece);

            // Make the move
            setTimeout(() => {
                makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);

                // Add to move history
                moveHistory.push(moveNotation);
                updateMoveHistory();

                // Switch player
                currentPlayer = 'white';
                updateStatus();

                // Check for checkmate or stalemate
                if (isCheckmate()) {
                    gameOver = true;
                    statusElement.textContent = `${currentPlayer === 'white' ? 'Black' : 'White'} wins by checkmate!`;
                } else if (isStalemate()) {
                    gameOver = true;
                    statusElement.textContent = 'Game ends in stalemate!';
                }

                aiThinking = false;
            }, 500);
        } else {
            // No valid moves
            aiThinking = false;
            updateStatus();
        }
    }

    // Reset the game
    function resetGame() {
        board = JSON.parse(JSON.stringify(initialBoard));
        currentPlayer = 'white';
        selectedPiece = null;
        moveHistory = [];
        gameOver = false;

        initializeBoard();
        updateMoveHistory();
        updateStatus();
    }

    // Update the status display
    function updateStatus() {
        if (gameOver) return;

        if (gameMode === 'single-player') {
            if (currentPlayer === 'white') {
                statusElement.textContent = "Your turn";
            } else {
                statusElement.textContent = "Yash's turn";
            }
        } else {
            statusElement.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
        }
    }

    // Start a new game with the selected mode
    function startGame(mode) {
        gameMode = mode;
        landingPage.style.display = 'none';
        gameContainer.style.display = 'block';

        if (mode === 'single-player') {
            gameModeElement.textContent = 'Playing against Yash (AI)';
        } else {
            gameModeElement.textContent = 'Two Player Mode';
        }

        resetGame();
    }

    // Go back to the landing page
    function goToLandingPage() {
        gameContainer.style.display = 'none';
        landingPage.style.display = 'block';
    }

    // Event listeners
    resetButton.addEventListener('click', resetGame);
    backButton.addEventListener('click', goToLandingPage);

    singlePlayerOption.addEventListener('click', () => startGame('single-player'));
    twoPlayerOption.addEventListener('click', () => startGame('two-player'));
});
