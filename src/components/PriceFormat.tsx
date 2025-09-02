"use client";
import { twMerge } from "tailwind-merge";
import { useCurrency } from "../contexts/CurrencyContext";

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

interface Props {
  amount?: number;
  className?: string;
  fromCurrency?: CurrencyCode;
}

const PriceFormat = ({ amount, className, fromCurrency = "USD" }: Props) => {
  const { selectedCurrency, convertPrice } = useCurrency();

  if (!amount)
    return <span className={twMerge("font-medium", className)}>-</span>;

  const convertedAmount = convertPrice(amount, fromCurrency);

  // Currencies that don't use decimal places
  const noDecimalCurrencies = ["JPY", "BDT"];
  const useDecimals = !noDecimalCurrencies.includes(selectedCurrency);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: selectedCurrency,
    minimumFractionDigits: useDecimals ? 2 : 0,
    maximumFractionDigits: useDecimals ? 2 : 0,
  }).format(convertedAmount);

  return (
    <span className={twMerge("font-medium", className)}>{formattedPrice}</span>
  );
};

export default PriceFormat;
