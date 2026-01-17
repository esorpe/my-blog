# My Blog

A modern blog application built with Next.js 16, React 19, TypeScript, and Supabase.

## Features

- 📝 **Markdown Support** - Write posts in Markdown with automatic HTML rendering
- 🔐 **Supabase Authentication** - Secure admin login with email/password
- ⚡ **ISR Caching** - Incremental Static Regeneration for optimal performance
- 🎨 **Tailwind CSS** - Beautiful, responsive UI
- 📱 **Mobile Friendly** - Works great on all devices
- 🚀 **Server Components** - Built with Next.js App Router
- 🛡️ **XSS Protection** - Sanitized HTML output

## Tech Stack

- **Framework**: Next.js 16.1.2
- **UI Library**: React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Markdown**: Remark + Remark HTML
- **Security**: DOMPurify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (https://supabase.com)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env.local`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up your Supabase database with the `posts` table:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  date date not null,
  excerpt text,
  content text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

4. Create an admin user in Supabase Auth

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build for production:

```bash
npm run build
npm start
```

## Architecture

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx           # Blog index with ISR
│   │   ├── [slug]/
│   │   │   └── page.tsx       # Individual post with markdown rendering
│   │   ├── loading.tsx        # Blog loading skeleton
│   │   └── error.tsx          # Error boundary
│   ├── admin/
│   │   ├── page.tsx           # Admin login (Supabase Auth)
│   │   └── AdminDashboard.tsx # Post editor with CRUD operations
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home redirect
│   ├── not-found.tsx          # 404 page
│   └── error.tsx              # Global error boundary
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── markdown.ts            # Markdown utilities (for SSG)
│   └── markdownRenderer.ts    # Server-side markdown to HTML rendering
└── posts/
    ├── welcome.md             # Sample posts (optional)
    └── blog.md
```

## Key Improvements Made

✅ **Markdown to HTML Rendering** - Uses Remark for proper markdown parsing with sanitization
✅ **Supabase Authentication** - Replaced password auth with proper email/password authentication
✅ **ISR Caching** - Changed from `revalidate: 0` to `revalidate: 3600` for better performance
✅ **Type Safety** - Removed `any` types and added proper error handling
✅ **Loading States** - Added skeleton loading components for better UX
✅ **Error Pages** - Custom 404 and error boundary pages
✅ **Better Feedback** - Admin dashboard shows success/error messages
✅ **Proper Dependencies** - Replaced markdown-it with remark for better flexibility

## Admin Dashboard

Access the admin dashboard at `/admin`:

- Create, edit, and delete blog posts
- Write posts in Markdown format
- Authentication required (Supabase Auth)
- Real-time feedback on operations

## Environment Setup

Make sure your `.env.local` has:

```
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

The public variables are needed for client-side auth, while the non-public ones are for server-side operations.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
