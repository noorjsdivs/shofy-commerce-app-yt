import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Dashboard - Shofy",
  description:
    "Delivery management dashboard for tracking and updating deliveries",
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
