import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '@/lib/markdownRenderer';

export const revalidate = 3600; // Revalidate every hour (ISR)

export async function generateStaticParams() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug');

  if (error || !posts) {
    console.error('Error fetching posts for static params:', error);
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Render markdown to HTML
  const htmlContent = await renderMarkdown(post.content);

  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
        ← 블로그로 돌아가기
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600">{post.date}</p>
      </header>

      <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}
