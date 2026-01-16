import { getPostBySlug, getSlugs } from '@/lib/markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const slugs = getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
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

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
