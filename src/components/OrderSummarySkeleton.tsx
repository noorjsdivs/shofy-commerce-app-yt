const OrderSummarySkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-md w-full shadow-sm animate-pulse">
      {/* Title Skeleton */}
      <div className="bg-gray-200 rounded h-5 w-32 mb-3"></div>

      {/* Order Details Skeleton */}
      <div className="space-y-3">
        {/* Order ID */}
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 rounded h-4 w-16"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 rounded h-4 w-12"></div>
          <div className="bg-gray-200 rounded h-4 w-16"></div>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <div className="bg-gray-200 rounded h-4 w-10"></div>
          <div className="bg-gray-200 rounded-full h-6 w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummarySkeleton;
