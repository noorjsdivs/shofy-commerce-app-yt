const EmptyCartSkeleton = () => {
  return (
    <div className="bg-white h-96 my-10 flex flex-col gap-4 items-center justify-center py-5 rounded-lg border border-gray-200 drop-shadow-2xl animate-pulse">
      {/* Title Skeleton */}
      <div className="bg-gray-200 rounded h-8 w-64 mb-4"></div>

      {/* Description Skeleton */}
      <div className="space-y-2 max-w-[700px] w-full">
        <div className="bg-gray-200 rounded h-4 w-full"></div>
        <div className="bg-gray-200 rounded h-4 w-5/6 mx-auto"></div>
        <div className="bg-gray-200 rounded h-4 w-4/5 mx-auto"></div>
        <div className="bg-gray-200 rounded h-4 w-3/4 mx-auto"></div>
      </div>

      {/* Button Skeleton */}
      <div className="bg-gray-200 rounded-md h-12 w-40 mt-6"></div>
    </div>
  );
};

export default EmptyCartSkeleton;
