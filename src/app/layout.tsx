import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import BottomNav from "@/components/layout/bottom-nav";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "SkilledMice - Hyper-local Service Marketplace",
  description: "Connect with local service providers and monetize your skills",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <AuthProvider>
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
        </AuthProvider>
        <BottomNav />
      </body>
    </html>
  );
}
