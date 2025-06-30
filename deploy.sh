#!/bin/bash

echo "🚀 Setting up Kids Store Webapp..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p database
mkdir -p uploads/images
mkdir -p uploads/sounds

# Initialize database
echo "🗄️ Initializing database..."
cd backend
npm run init-db
cd ..

echo "✅ Setup complete!"
echo ""
echo "🎉 To start the development servers:"
echo "   npm run dev"
echo ""
echo "🌐 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend API will be available at: http://localhost:3001"
echo ""
echo "Happy coding! 🛍️✨" 