import { FiX, FiDollarSign } from "react-icons/fi";
import { useState } from "react";

type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "CNY"
  | "INR"
  | "BDT";

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
  onCurrencySelect: (currency: CurrencyCode) => void;
}

const currencies: Array<{
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
}> = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
];

const CurrencyModal = ({
  isOpen,
  onClose,
  selectedCurrency,
  onCurrencySelect,
}: CurrencyModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencySelect = (currencyCode: CurrencyCode) => {
    onCurrencySelect(currencyCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden z-10 max-h-[80vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Select Currency
              </h3>
              <p className="text-sm text-gray-600">
                Choose your preferred currency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search currencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Currency List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency.code)}
              className={`w-full flex items-center space-x-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left ${
                selectedCurrency === currency.code
                  ? "bg-green-50 border-r-4 border-green-500"
                  : ""
              }`}
            >
              <span className="text-2xl">{currency.flag}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {currency.code}
                    </h4>
                    <p className="text-sm text-gray-600">{currency.name}</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {currency.symbol}
                  </span>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {filteredCurrencies.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No currencies found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Currency rates are updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyModal;
