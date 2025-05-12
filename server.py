#!/usr/bin/env python3
"""
Simple HTTP server for the chess game.
Run this script and then access the game at http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser

# Set the port
PORT = 8000

# Change to the directory containing the HTML files
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create the HTTP request handler
Handler = http.server.SimpleHTTPRequestHandler

# Create the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving chess game at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    # Open the browser automatically
    webbrowser.open(f"http://localhost:{PORT}")
    
    # Start the server
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
