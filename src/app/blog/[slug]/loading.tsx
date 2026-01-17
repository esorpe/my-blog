export default function Loading() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="h-4 bg-gray-200 rounded w-40 mb-8 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        ))}
      </div>
    </article>
  );
}
