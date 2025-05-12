#!/usr/bin/env python3

"""
A simple text-based chess game in Python.
"""

import os
import sys

# Constants
BOARD_SIZE = 8

# Game state
class GameState:
    ONGOING = 0
    WHITE_WIN = 1
    BLACK_WIN = 2
    DRAW = 3

# Player turn
class Player:
    WHITE = 0
    BLACK = 1

# Chess position
class Position:
    def __init__(self, row, col):
        self.row = row
        self.col = col

# Chess move
class Move:
    def __init__(self, from_pos, to_pos):
        self.from_pos = from_pos
        self.to_pos = to_pos

# Chess game
class ChessGame:
    def __init__(self):
        self.board = [[' ' for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
        self.current_player = Player.WHITE
        self.game_state = GameState.ONGOING
        self.initialize_board()

    def initialize_board(self):
        """Initialize the chess board with pieces in starting positions."""
        # Set up black pieces (top of the board)
        self.board[0][0] = 'r'
        self.board[0][1] = 'n'
        self.board[0][2] = 'b'
        self.board[0][3] = 'q'
        self.board[0][4] = 'k'
        self.board[0][5] = 'b'
        self.board[0][6] = 'n'
        self.board[0][7] = 'r'
        
        # Set up black pawns
        for j in range(BOARD_SIZE):
            self.board[1][j] = 'p'
        
        # Set up white pawns
        for j in range(BOARD_SIZE):
            self.board[6][j] = 'P'
        
        # Set up white pieces (bottom of the board)
        self.board[7][0] = 'R'
        self.board[7][1] = 'N'
        self.board[7][2] = 'B'
        self.board[7][3] = 'Q'
        self.board[7][4] = 'K'
        self.board[7][5] = 'B'
        self.board[7][6] = 'N'
        self.board[7][7] = 'R'

    def print_board(self):
        """Print the current state of the chess board."""
        # Clear the screen
        os.system('cls' if os.name == 'nt' else 'clear')
        
        print("\n  a b c d e f g h")
        print(" +-----------------+")
        
        for i in range(BOARD_SIZE):
            print(f"{8 - i}|", end="")
            
            for j in range(BOARD_SIZE):
                print(f"{self.board[i][j]} ", end="")
            
            print("|")
        
        print(" +-----------------+")

    def is_position_valid(self, pos):
        """Check if a position is valid (within the board)."""
        return 0 <= pos.row < BOARD_SIZE and 0 <= pos.col < BOARD_SIZE

    def get_piece_at(self, pos):
        """Get the piece at a given position."""
        if not self.is_position_valid(pos):
            return ' '
        return self.board[pos.row][pos.col]

    def parse_move(self, input_str):
        """Parse user input into a Move object."""
        # Remove spaces
        input_str = input_str.replace(" ", "")
        
        # Check if the input has the correct length
        if len(input_str) != 4:
            return None
        
        # Parse the move
        from_col = ord(input_str[0].lower()) - ord('a')
        from_row = 8 - int(input_str[1])
        to_col = ord(input_str[2].lower()) - ord('a')
        to_row = 8 - int(input_str[3])
        
        from_pos = Position(from_row, from_col)
        to_pos = Position(to_row, to_col)
        
        # Check if the positions are valid
        if not self.is_position_valid(from_pos) or not self.is_position_valid(to_pos):
            return None
        
        return Move(from_pos, to_pos)

    def is_valid_move(self, move):
        """Check if a move is valid."""
        # Basic validation
        if not self.is_position_valid(move.from_pos) or not self.is_position_valid(move.to_pos):
            return False
        
        # Get the piece at the starting position
        piece = self.get_piece_at(move.from_pos)
        
        # Check if there is a piece at the starting position
        if piece == ' ':
            return False
        
        # Check if the player is moving their own piece
        is_white_piece = piece.isupper()
        if (self.current_player == Player.WHITE and not is_white_piece) or \
           (self.current_player == Player.BLACK and is_white_piece):
            return False
        
        # Check if the destination has a piece of the same color
        dest_piece = self.get_piece_at(move.to_pos)
        if dest_piece != ' ' and dest_piece.isupper() == piece.isupper():
            return False
        
        # For simplicity, we'll allow any move that passes the above checks
        # In a real chess game, you would need to validate moves based on piece types
        
        return True

    def make_move(self, move):
        """Execute a move on the board."""
        if not self.is_valid_move(move):
            return False
        
        # Execute the move
        piece = self.board[move.from_pos.row][move.from_pos.col]
        self.board[move.to_pos.row][move.to_pos.col] = piece
        self.board[move.from_pos.row][move.from_pos.col] = ' '
        
        return True

    def switch_player(self):
        """Switch the current player."""
        self.current_player = Player.BLACK if self.current_player == Player.WHITE else Player.WHITE

    def is_in_check(self, player):
        """Check if a player is in check."""
        # This is a placeholder. In a real chess game, you would need to
        # check if the king is under attack.
        return False

    def is_checkmate(self, player):
        """Check if a player is in checkmate."""
        # This is a placeholder. In a real chess game, you would need to
        # check if the king is in check and has no valid moves.
        return False

    def play(self):
        """Main game loop."""
        while self.game_state == GameState.ONGOING:
            # Print the board
            self.print_board()
            
            # Print the current player
            player_name = "White" if self.current_player == Player.WHITE else "Black"
            print(f"\n{player_name}'s turn: ", end="")
            
            # Get the player's move
            try:
                input_str = input()
            except EOFError:
                break
            
            # Check for quit command
            if input_str.lower() in ["quit", "exit"]:
                print("Game ended by player.")
                break
            
            # Parse and validate the move
            move = self.parse_move(input_str)
            if move is None:
                print("Invalid move format. Use format like 'e2e4' or 'e2 e4'.")
                input("Press Enter to continue...")
                continue
            
            # Make the move
            if not self.make_move(move):
                print("Invalid move. Try again.")
                input("Press Enter to continue...")
                continue
            
            # Switch player
            self.switch_player()
            
            # Check for game end conditions (not fully implemented)
            if self.is_checkmate(self.current_player):
                self.game_state = GameState.WHITE_WIN if self.current_player == Player.BLACK else GameState.BLACK_WIN
                self.print_board()
                winner = "White" if self.game_state == GameState.WHITE_WIN else "Black"
                print(f"\n{winner} wins by checkmate!")

def main():
    """Main function."""
    game = ChessGame()
    game.play()

if __name__ == "__main__":
    main()
