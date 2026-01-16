import { createClient } from '@supabase/supabase-js';

// Prefer server-side env, fall back to public for browser usage
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials are missing. Check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Post {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    content: string;
    created_at: string;
    updated_at: string;
}
