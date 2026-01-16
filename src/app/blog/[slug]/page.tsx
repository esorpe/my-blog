import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Disable caching

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug');
  
  return posts ? posts.map((post) => ({ slug: post.slug })) : [];
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
        ← 블로그로 돌아가기
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600">{post.date}</p>
      </header>

      <div className="prose max-w-none whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
