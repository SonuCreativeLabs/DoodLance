"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { RoleProvider } from "@/contexts/role-context";
import { SplashScreen } from "@/components/splash-screen";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// Metadata is moved to a separate layout file since this is a client component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily disabled splash screen
  const [showSplash, setShowSplash] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <RoleProvider>
            {showSplash ? (
              <SplashScreen onComplete={() => setShowSplash(false)} />
            ) : (
              <main className="min-h-screen">{children}</main>
            )}
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
