import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">블로그</h1>
        <p className="text-xl text-gray-600">생각과 경험을 공유합니다</p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-b pb-8 hover:bg-gray-50 -mx-4 px-4 py-4 rounded transition"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold mb-2 text-blue-600 hover:text-blue-800">
                {post.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-500 mb-3">{String(post.date)}</p>
            <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block"
            >
              더 읽기 →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
