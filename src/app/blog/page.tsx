import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable caching for this page

export default async function BlogIndex() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('date', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">블로그</h1>
          <p className="text-xl text-gray-600">생각과 경험을 공유합니다</p>
        </div>
        <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          관리자
        </Link>
      </div>

      <div className="grid gap-8">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
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
          ))
        ) : (
          <p className="text-gray-500">아직 작성된 글이 없습니다. 관리자 페이지에서 글을 작성해보세요!</p>
        )}
      </div>
    </div>
  );
}
