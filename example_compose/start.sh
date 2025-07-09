#!/bin/bash

# Startup script for currency converter
echo "Starting Currency Converter Application..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application
echo "Starting server..."
node server.js