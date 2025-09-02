import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accountant Dashboard - Shofy",
  description:
    "Financial and accounting dashboard for managing accounts and transactions",
};

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
