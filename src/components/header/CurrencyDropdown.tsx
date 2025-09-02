"use client";
import { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { useCurrency } from "../../contexts/CurrencyContext";
import CurrencyNotification from "../notifications/CurrencyNotification";

type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "INR"
  | "BDT"
  | "PKR";

const currencies: {
  code: CurrencyCode;
  name: string;
  symbol: string;
  region?: string;
}[] = [
  { code: "USD", name: "US Dollar", symbol: "$", region: "Global" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    region: "North America",
  },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", region: "South Asia" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "South Asia" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", region: "South Asia" },
];

const CurrencyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    name: "",
    symbol: "",
    code: "",
  });
  const { selectedCurrency, setCurrency } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency: {
    code: CurrencyCode;
    name: string;
    symbol: string;
    region?: string;
  }) => {
    // Don't show notification if selecting the same currency
    if (currency.code === selectedCurrency) {
      setIsOpen(false);
      return;
    }

    setCurrency(currency.code);
    setIsOpen(false);

    // Show custom notification
    setNotificationData({
      name: currency.name,
      symbol: currency.symbol,
      code: currency.code,
    });
    setShowNotification(true);
  };

  const currentCurrency =
    currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="headerTopMenu cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">{currentCurrency.symbol}</span>
        <span>{currentCurrency.code}</span>
        <IoChevronDownSharp
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 py-2"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                currency.region === "South Asia"
                  ? "border-l-2 border-l-green-500 bg-green-50/30"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-gray-700">
                  {currency.symbol}
                </span>
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {currency.code}
                    {currency.region === "South Asia" && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-900">{currency.name}</div>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <FiCheck className="text-theme-color text-sm" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Custom Currency Notification */}
      <CurrencyNotification
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        currencyName={notificationData.name}
        currencySymbol={notificationData.symbol}
        currencyCode={notificationData.code}
      />
    </div>
  );
};

export default CurrencyDropdown;
