import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiAward,
  FiCreditCard,
} from "react-icons/fi";

const ProductFeatures = () => {
  const features = [
    {
      icon: <FiTruck className="w-8 h-8 text-blue-600" />,
      title: "Free Shipping",
      description: "Free shipping on orders over $1000",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <FiShield className="w-8 h-8 text-green-600" />,
      title: "Secure Payment",
      description: "100% secure payment protection",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: <FiRefreshCw className="w-8 h-8 text-orange-600" />,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      icon: <FiHeadphones className="w-8 h-8 text-purple-600" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: <FiAward className="w-8 h-8 text-yellow-600" />,
      title: "Quality Guarantee",
      description: "Premium quality assurance",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      icon: <FiCreditCard className="w-8 h-8 text-indigo-600" />,
      title: "Flexible Payment",
      description: "Multiple payment options available",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Why Choose Us?
        </h3>
        <p className="text-gray-600">
          We provide the best shopping experience for our customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${feature.bgColor} ${feature.borderColor} border rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;
