#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "ctype.h"

#define BOARD_SIZE 8

// Game state
typedef enum {
    ONGOING,
    WHITE_WIN,
    BLACK_WIN,
    DRAW
} GameState;

// Player turn
typedef enum {
    WHITE,
    BLACK
} Player;

// Structure to represent a chess position
typedef struct {
    int row;
    int col;
} Position;

// Structure to represent a move
typedef struct {
    Position from;
    Position to;
} Move;

// Global variables
char board[BOARD_SIZE][BOARD_SIZE];
Player currentPlayer = WHITE;
GameState gameState = ONGOING;

// Function prototypes
void initializeBoard();
void printBoard();
int isValidMove(Move move);
int makeMove(Move move);
int isInCheck(Player player);
int isCheckmate(Player player);
int parseMove(const char* input, Move* move);
void switchPlayer();
char getPieceAt(Position pos);
int isPositionValid(Position pos);

// Initialize the chess board with pieces in starting positions
void initializeBoard() {
    // Initialize empty board
    int i, j;
    for (i = 0; i < BOARD_SIZE; i++) {
        for (j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = ' ';
        }
    }

    // Set up black pieces (top of the board)
    board[0][0] = 'r'; board[0][1] = 'n'; board[0][2] = 'b'; board[0][3] = 'q';
    board[0][4] = 'k'; board[0][5] = 'b'; board[0][6] = 'n'; board[0][7] = 'r';
    
    // Set up black pawns
    for (j = 0; j < BOARD_SIZE; j++) {
        board[1][j] = 'p';
    }

    // Set up white pawns
    for (j = 0; j < BOARD_SIZE; j++) {
        board[6][j] = 'P';
    }

    // Set up white pieces (bottom of the board)
    board[7][0] = 'R'; board[7][1] = 'N'; board[7][2] = 'B'; board[7][3] = 'Q';
    board[7][4] = 'K'; board[7][5] = 'B'; board[7][6] = 'N'; board[7][7] = 'R';
}

// Print the current state of the chess board
void printBoard() {
    int i, j;
    printf("\n  a b c d e f g h\n");
    printf(" +-----------------+\n");
    
    for (i = 0; i < BOARD_SIZE; i++) {
        printf("%d|", 8 - i);
        
        for (j = 0; j < BOARD_SIZE; j++) {
            printf("%c ", board[i][j]);
        }
        
        printf("|\n");
    }
    
    printf(" +-----------------+\n");
}

// Check if a position is valid (within the board)
int isPositionValid(Position pos) {
    return pos.row >= 0 && pos.row < BOARD_SIZE && 
           pos.col >= 0 && pos.col < BOARD_SIZE;
}

// Get the piece at a given position
char getPieceAt(Position pos) {
    if (!isPositionValid(pos)) {
        return ' ';
    }
    return board[pos.row][pos.col];
}

// Parse user input into a Move structure
int parseMove(const char* input, Move* move) {
    // Input format should be like "e2e4" or "e2 e4"
    char inputCopy[10];
    char* src;
    char* dst;
    
    strncpy(inputCopy, input, sizeof(inputCopy) - 1);
    inputCopy[sizeof(inputCopy) - 1] = '\0';
    
    // Remove spaces
    src = inputCopy;
    dst = inputCopy;
    while (*src) {
        if (*src != ' ') {
            *dst++ = *src;
        }
        src++;
    }
    *dst = '\0';
    
    // Check if the input has the correct length
    if (strlen(inputCopy) != 4) {
        return 0;
    }
    
    // Parse the move
    move->from.col = tolower(inputCopy[0]) - 'a';
    move->from.row = 8 - (inputCopy[1] - '0');
    move->to.col = tolower(inputCopy[2]) - 'a';
    move->to.row = 8 - (inputCopy[3] - '0');
    
    // Check if the positions are valid
    if (!isPositionValid(move->from) || !isPositionValid(move->to)) {
        return 0;
    }
    
    return 1;
}

// Check if a move is valid
int isValidMove(Move move) {
    // Basic validation
    if (!isPositionValid(move.from) || !isPositionValid(move.to)) {
        return 0;
    }
    
    // Get the piece at the starting position
    char piece = getPieceAt(move.from);
    
    // Check if there is a piece at the starting position
    if (piece == ' ') {
        return 0;
    }
    
    // Check if the player is moving their own piece
    int isWhitePiece = isupper(piece);
    if ((currentPlayer == WHITE && !isWhitePiece) || 
        (currentPlayer == BLACK && isWhitePiece)) {
        return 0;
    }
    
    // Check if the destination has a piece of the same color
    char destPiece = getPieceAt(move.to);
    if (destPiece != ' ' && 
        (isupper(destPiece) == isupper(piece))) {
        return 0;
    }
    
    // For simplicity, we'll allow any move that passes the above checks
    // In a real chess game, you would need to validate moves based on piece types
    
    return 1;
}

// Execute a move on the board
int makeMove(Move move) {
    if (!isValidMove(move)) {
        return 0;
    }
    
    // Execute the move
    char piece = board[move.from.row][move.from.col];
    board[move.to.row][move.to.col] = piece;
    board[move.from.row][move.from.col] = ' ';
    
    return 1;
}

// Switch the current player
void switchPlayer() {
    currentPlayer = (currentPlayer == WHITE) ? BLACK : WHITE;
}

// Simple check detection (not fully implemented)
int isInCheck(Player player) {
    // This is a placeholder. In a real chess game, you would need to
    // check if the king is under attack.
    return 0;
}

// Simple checkmate detection (not fully implemented)
int isCheckmate(Player player) {
    // This is a placeholder. In a real chess game, you would need to
    // check if the king is in check and has no valid moves.
    return 0;
}

int main() {
    char input[10];
    Move move;
    
    // Initialize the game
    initializeBoard();
    
    // Game loop
    while (gameState == ONGOING) {
        // Print the board
        printBoard();
        
        // Print the current player
        printf("\n%s's turn: ", currentPlayer == WHITE ? "White" : "Black");
        
        // Get the player's move
        fgets(input, sizeof(input), stdin);
        input[strcspn(input, "\n")] = '\0';  // Remove newline
        
        // Check for quit command
        if (strcmp(input, "quit") == 0 || strcmp(input, "exit") == 0) {
            printf("Game ended by player.\n");
            break;
        }
        
        // Parse and validate the move
        if (!parseMove(input, &move)) {
            printf("Invalid move format. Use format like 'e2e4' or 'e2 e4'.\n");
            continue;
        }
        
        // Make the move
        if (!makeMove(move)) {
            printf("Invalid move. Try again.\n");
            continue;
        }
        
        // Switch player
        switchPlayer();
        
        // Check for game end conditions (not fully implemented)
        if (isCheckmate(currentPlayer)) {
            gameState = (currentPlayer == WHITE) ? BLACK_WIN : WHITE_WIN;
            printBoard();
            printf("\n%s wins by checkmate!\n", 
                   gameState == WHITE_WIN ? "White" : "Black");
        }
    }
    
    return 0;
}
