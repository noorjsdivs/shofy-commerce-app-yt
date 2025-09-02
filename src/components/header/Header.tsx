import BottomHeader from "./BottomHeader";
import MiddleHeader from "./MiddleHeader";
import TopHeader from "./TopHeader";

const Header = () => {
  const freeShippingThreshold =
    process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "1000";
  return (
    <header className="w-full bg-theme-white sticky top-0 z-50">
      {/* TopHeader */}
      <TopHeader freeShippingThreshold={freeShippingThreshold} />
      <div>
        {/* Middle Header */}
        <MiddleHeader />
        {/* BottomHeader */}
        <BottomHeader />
      </div>
    </header>
  );
};

export default Header;
