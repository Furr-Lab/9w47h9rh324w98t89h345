#!/bin/bash

# Kemi SamBO Website - Quick Commands Reference
# Run these commands to get started

echo "🥋 Kemi SamBO Website - Setup Commands 🥋"
echo "==========================================="
echo ""

# Check if this is run from the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this from the website directory!"
    echo "cd website && bash start.sh"
    exit 1
fi

echo "✅ Found package.json - You're in the right directory!"
echo ""

# Display available commands
echo "Available Commands:"
echo "===================="
echo ""
echo "1. Setup (first time only):"
echo "   npm install"
echo "   pip install -r requirements.txt"
echo ""
echo "2. Development:"
echo "   Terminal 1: python server.py"
echo "   Terminal 2: npm run dev"
echo ""
echo "3. Production Build:"
echo "   npm run build"
echo ""
echo "4. Preview Build:"
echo "   npm run preview"
echo ""
echo "5. Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin/login"
echo "   API: http://localhost:5000/api"
echo ""
echo "6. Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "==========================================="
echo "For detailed guides, see:"
echo "  - README.md - Full overview"
echo "  - QUICKSTART.md - 5-minute start"
echo "  - SETUP.md - Detailed setup"
echo "==========================================="
echo ""
