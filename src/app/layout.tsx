import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import PurchaseWidget from "@/components/PurchaseWidget";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Shofy - Multipurpose eCommerce website",
  description: "Test application for education purpose",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <AuthProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </AuthProvider>
        <PurchaseWidget />
      </body>
    </html>
  );
}
