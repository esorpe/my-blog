#!/usr/bin/env node

/**
 * Supabase Setup Script
 * Creates the posts table and indexes
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const PROJECT_URL = 'https://aerfrvuistfzszlaklsi.supabase.co';
const ANON_KEY = 'sb_publishable_f3AsfNIhbH5cbwvFjMuF8A_K8wiAhpZ';

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  const supabase = createClient(PROJECT_URL, ANON_KEY);

  try {
    // Test connection
    console.log('✓ Testing Supabase connection...');
    const { data, error: testError } = await supabase.from('posts').select('count', { count: 'exact', head: true });
    
    if (testError?.code === 'PGRST116') {
      // Table doesn't exist, we need to create it
      console.log('📋 Posts table does not exist. Creation will need to be done via Supabase dashboard.');
    } else if (testError) {
      console.log('⚠️  Error:', testError.message);
    } else {
      console.log('✓ Posts table already exists!');
    }

    // Try to list posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .limit(1);

    if (!error) {
      console.log('✓ Database connection successful!\n');
      console.log('📊 Current posts count: ' + (posts?.length || 0));
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📝 MANUAL SETUP REQUIRED');
  console.log('='.repeat(60) + '\n');

  console.log('Since we need superuser access to create tables, please:');
  console.log('\n1. Go to: https://supabase.com/dashboard/project/aerfrvuistfzszlaklsi');
  console.log('\n2. Click "SQL Editor" and run this SQL:\n');

  const sql = `
-- Create posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  date date not null,
  excerpt text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists posts_slug_idx on public.posts(slug);
create index if not exists posts_date_idx on public.posts(date desc);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies
create policy "Posts are publicly readable" on public.posts
  for select using (true);

create policy "Authenticated users can manage posts" on public.posts
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
  `;

  console.log(sql);

  console.log('\n3. Create an admin user:');
  console.log('   - Go to Authentication → Users');
  console.log('   - Click "Create new user"');
  console.log('   - Email: admin@example.com');
  console.log('   - Password: a strong password');
  console.log('   - Click "Create user"\n');

  console.log('4. After setup, run: npm run dev\n');
}

setupDatabase();
