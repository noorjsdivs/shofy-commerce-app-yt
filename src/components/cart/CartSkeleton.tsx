interface CartSkeletonProps {
  itemCount?: number;
}

const CartSkeleton = ({ itemCount = 3 }: CartSkeletonProps) => {
  return (
    <div className="animate-pulse">
      {/* Cart Title Skeleton */}
      <div className="bg-gray-200 rounded h-8 w-64 mb-10"></div>

      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
        {/* Cart Items Section Skeleton */}
        <section className="lg:col-span-7">
          <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
            {/* Cart Item Skeletons */}
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className="flex py-6 sm:py-10">
                {/* Product Image Skeleton */}
                <div className="bg-gray-200 rounded-lg h-24 w-24 sm:h-48 sm:w-48 flex-shrink-0"></div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    {/* Product Info Skeleton */}
                    <div>
                      <div className="bg-gray-200 rounded h-6 w-3/4 mb-2"></div>
                      <div className="bg-gray-200 rounded h-4 w-1/2 mb-3"></div>
                      <div className="bg-gray-200 rounded h-4 w-1/3 mb-2"></div>
                      <div className="bg-gray-200 rounded h-4 w-1/4"></div>
                    </div>

                    {/* Price and Quantity Skeleton */}
                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="bg-gray-200 rounded h-6 w-20 mb-4"></div>

                      {/* Quantity Controls Skeleton */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="bg-gray-200 rounded h-8 w-8"></div>
                        <div className="bg-gray-200 rounded h-8 w-12"></div>
                        <div className="bg-gray-200 rounded h-8 w-8"></div>
                      </div>

                      {/* Remove Button Skeleton */}
                      <div className="bg-gray-200 rounded h-8 w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cart Summary Section Skeleton */}
        <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          {/* Summary Title */}
          <div className="bg-gray-200 rounded h-6 w-32 mb-6"></div>

          {/* Summary Items */}
          <div className="space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <div className="bg-gray-200 rounded h-4 w-20"></div>
              <div className="bg-gray-200 rounded h-4 w-16"></div>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between">
              <div className="bg-gray-200 rounded h-4 w-16"></div>
              <div className="bg-gray-200 rounded h-4 w-12"></div>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between">
              <div className="bg-gray-200 rounded h-4 w-10"></div>
              <div className="bg-gray-200 rounded h-4 w-14"></div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="bg-gray-200 rounded h-5 w-16"></div>
                <div className="bg-gray-200 rounded h-5 w-20"></div>
              </div>
            </div>
          </div>

          {/* Checkout Button Skeleton */}
          <div className="bg-gray-200 rounded-md h-12 w-full mt-6"></div>

          {/* Continue Shopping Link Skeleton */}
          <div className="bg-gray-200 rounded h-4 w-32 mx-auto mt-6"></div>

          {/* Payment Methods Skeleton */}
          <div className="mt-6">
            <div className="bg-gray-200 rounded h-4 w-40 mb-3"></div>
            <div className="bg-gray-200 rounded h-12 w-full"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CartSkeleton;
