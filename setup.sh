#!/bin/bash

echo "🚀 Setting up DVHS Alumni Ranking..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials!"
else
    echo "✅ .env.local already exists"
fi

# Check if Supabase is configured
if grep -q "your_supabase_project_url" .env.local; then
    echo "⚠️  Remember to update your Supabase credentials in .env.local"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Set up your Supabase project and run the SQL schema from lib/database.sql"
echo "2. Update .env.local with your Supabase URL and anon key"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Upload your CSV data via the admin panel at /admin"
echo ""
echo "📚 For detailed instructions, see README.md"

