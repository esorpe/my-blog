#!/bin/bash

# Supabase Setup Script
PROJECT_URL="https://aerfrvuistfzszlaklsi.supabase.co"
ANON_KEY="sb_publishable_f3AsfNIhbH5cbwvFjMuF8A_K8wiAhpZ"

echo "🚀 Setting up Supabase database..."
echo "Project URL: $PROJECT_URL"

# Create posts table via SQL
echo "📋 Creating posts table..."

curl -X POST "$PROJECT_URL/rest/v1/rpc/sql_exec" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "create table if not exists public.posts (
      id uuid default gen_random_uuid() primary key,
      title text not null,
      slug text unique not null,
      date date not null,
      excerpt text,
      content text not null,
      created_at timestamp with time zone default timezone('"'"'utc'"'"'::text, now()) not null,
      updated_at timestamp with time zone default timezone('"'"'utc'"'"'::text, now()) not null
    );"
  }' 2>/dev/null

echo ""
echo "✅ Setup script complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to your Supabase dashboard"
echo "2. Create an admin user in Authentication → Users"
echo "3. Run: npm run dev"
