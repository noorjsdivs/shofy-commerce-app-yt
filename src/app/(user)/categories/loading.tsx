export default function Loading() {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="h-32 lg:h-40 bg-gray-200 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="p-3 lg:p-4">
                <div className="h-4 lg:h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>

                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Skeleton */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
