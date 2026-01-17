# Setup Guide

## Step 1: Environment Variables ✅ (Auto-created template)

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase project details.

## Step 2: Supabase Setup (Manual - requires your account)

### 2.1 Create the `posts` table

Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Create posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  date date not null,
  excerpt text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on slug for faster lookups
create index posts_slug_idx on public.posts(slug);

-- Create index on date for sorting
create index posts_date_idx on public.posts(date desc);

-- Enable Row Level Security
alter table public.posts enable row level security;

-- Allow public read access
create policy "Posts are publicly readable"
  on public.posts
  for select
  using (true);

-- Allow authenticated users to create/edit/delete
create policy "Authenticated users can manage posts"
  on public.posts
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

### 2.2 Create an admin user

In Supabase Dashboard → Authentication → Users:
- Click "Create new user"
- Email: your-email@example.com
- Password: a strong password
- Click "Create user"

## Step 3: Test Locally ✅ (Ready to run)

```bash
npm run dev
```

Then:
1. Navigate to http://localhost:3000 - should redirect to blog
2. Try http://localhost:3000/admin - login with your credentials
3. Create a test post
4. View it at http://localhost:3000/blog

## Step 4: Production Build (Optional)

```bash
npm run build
npm start
```

## Troubleshooting

### "Supabase credentials are missing" error
- Make sure `.env.local` exists and has the correct variables
- Check that values don't have extra quotes or spaces
- Restart the dev server after changing env variables

### "User not found" on admin login
- Verify the user exists in Supabase Authentication
- Check the email address is spelled correctly
- Try resetting password in Supabase dashboard

### Posts not appearing
- Check that the `posts` table exists in Supabase
- Verify RLS policies are set up correctly
- Check browser console for errors

## What's Automated ✅

- ✅ npm dependencies installed
- ✅ Environment template created (.env.local.example)
- ✅ Project structure set up

## What Requires Manual Action 📝

- 📝 Create `.env.local` with your Supabase credentials
- 📝 Create `posts` table in Supabase (SQL provided above)
- 📝 Create admin user in Supabase Auth

Once you complete these steps, the app will be fully functional!
