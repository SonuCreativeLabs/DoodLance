"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { RoleProvider } from "@/contexts/role-context";
import { ModalProvider } from "@/contexts/ModalContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SplashScreen } from "@/components/splash-screen";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

// Metadata is moved to a separate layout file since this is a client component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily disabled splash screen
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // We're using a fixed dark theme
  const theme = 'dark';

  // Client-side effect to handle theme
  useEffect(() => {
    // This runs only on the client side
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <RoleProvider>
            <ModalProvider>
              <LayoutProvider>
                {showSplash ? (
                  <SplashScreen onComplete={() => setShowSplash(false)} />
                ) : (
                  <main className="flex flex-col h-screen">
                    {children}
                  </main>
                )}
              </LayoutProvider>
            </ModalProvider>
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
