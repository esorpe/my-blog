import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">요청한 페이지를 찾을 수 없습니다.</p>
      <Link href="/blog" className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        블로그로 돌아가기
      </Link>
    </div>
  );
}
