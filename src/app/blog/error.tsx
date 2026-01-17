'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">오류 발생</h1>
      <p className="text-xl text-gray-600 mb-4">
        요청을 처리하는 중에 오류가 발생했습니다.
      </p>
      <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-100 p-4 rounded">
        {error.message || '알 수 없는 오류'}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
        <Link href="/blog" className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700">
          블로그로 돌아가기
        </Link>
      </div>
    </div>
  );
}
