#!/bin/bash

# Start script for OnBoard AI
# This script starts both the backend API and frontend dev server

echo "🚀 Starting OnBoard AI..."
echo ""

# Start backend API in background
echo "📡 Starting backend API server..."
cd backend
python -m uvicorn api:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend dev server
echo "⚛️  Starting frontend dev server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo "   Backend API: http://localhost:8000"
echo "   Frontend UI: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

