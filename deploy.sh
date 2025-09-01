#!/bin/bash

# Portfolio Website Deployment Script
echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run type checking
echo "🔍 Running type checks..."
npm run typecheck

if [ $? -ne 0 ]; then
    echo "❌ Type checking failed"
    exit 1
fi

echo "✅ Type checking passed"

# Build the project
echo "🏗️ Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"
echo "📁 Build files are in the 'dist' directory"
echo ""
echo "🎉 Deployment ready!"
echo ""
echo "📋 Next steps:"
echo "   • Upload the 'dist' folder to your hosting provider"
echo "   • Or deploy directly with:"
echo "     - Vercel: vercel --prod"
echo "     - Netlify: netlify deploy --prod --dir=dist"
echo "     - GitHub Pages: Deploy the dist folder"
echo ""
echo "🌐 For Vercel deployment:"
echo "   1. Install Vercel CLI: npm i -g vercel"
echo "   2. Run: vercel --prod"
echo ""
echo "🌐 For Netlify deployment:"
echo "   1. Install Netlify CLI: npm i -g netlify-cli"
echo "   2. Run: netlify deploy --prod --dir=dist"
