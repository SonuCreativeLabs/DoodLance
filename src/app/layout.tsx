"use client";

import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/contexts/auth-context";
import { RoleProvider } from "@/contexts/role-context";
import { SplashScreen } from "@/components/splash-screen";
import { useState } from "react";

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
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
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
