import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UserSyncProvider } from "@/components/UserSyncProvider";
import Head from "next/head";
import PurchaseWidget from "@/components/PurchaseWidget";
import StateProvider from "@/components/auth/StateProvider";

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
        <StateProvider>
          <AuthProvider>
            <UserSyncProvider>
              <CurrencyProvider>{children}</CurrencyProvider>
              <PurchaseWidget />
            </UserSyncProvider>
          </AuthProvider>
        </StateProvider>
      </body>
    </html>
  );
}
