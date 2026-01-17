export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <div className="h-12 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      <div className="grid gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <article key={i} className="border-b pb-8">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mt-4"></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
