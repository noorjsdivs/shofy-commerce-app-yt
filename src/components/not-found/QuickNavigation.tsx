import Link from "next/link";

interface NavigationCardProps {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
}

function NavigationCard({
  href,
  icon,
  title,
  subtitle,
  description,
  bgColor,
}: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-theme-color hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-center mb-4">
        <div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-theme-color">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}

export default function QuickNavigation() {
  const navigationItems = [
    {
      href: "/",
      icon: "🏠",
      title: "Homepage",
      subtitle: "Start fresh",
      description: "Discover our latest products and featured collections",
      bgColor: "bg-blue-100 group-hover:bg-blue-200",
    },
    {
      href: "/products",
      icon: "🛍️",
      title: "All Products",
      subtitle: "Browse everything",
      description:
        "Explore our complete product catalog with filters and categories",
      bgColor: "bg-green-100 group-hover:bg-green-200",
    },
    {
      href: "/categories",
      icon: "📂",
      title: "Categories",
      subtitle: "Shop by type",
      description:
        "Find exactly what you need by browsing our organized categories",
      bgColor: "bg-purple-100 group-hover:bg-purple-200",
    },
    {
      href: "/favorite",
      icon: "❤️",
      title: "Wishlist",
      subtitle: "Saved items",
      description:
        "View your favorite products and items you want to buy later",
      bgColor: "bg-red-100 group-hover:bg-red-200",
    },
    {
      href: "/auth/signin",
      icon: "🔑",
      title: "Account",
      subtitle: "Sign in or register",
      description: "Access your account, orders, and personalized experience",
      bgColor: "bg-yellow-100 group-hover:bg-yellow-200",
    },
    {
      href: "/cart",
      icon: "🛒",
      title: "Shopping Cart",
      subtitle: "View your cart",
      description: "Check your cart items and proceed to checkout",
      bgColor: "bg-indigo-100 group-hover:bg-indigo-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {navigationItems.map((item) => (
        <NavigationCard key={item.href} {...item} />
      ))}
    </div>
  );
}
