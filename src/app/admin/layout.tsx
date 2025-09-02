import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Shofy",
  description: "Administrative dashboard for managing the e-commerce platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
