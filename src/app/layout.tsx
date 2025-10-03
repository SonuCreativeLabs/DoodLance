"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { RoleProvider } from "@/contexts/role-context";
import { ModalProvider } from "@/contexts/ModalContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { DateRangeProvider } from "@/contexts/DateRangeContext";
import { useEffect } from "react";
import { NavbarProvider } from "@/contexts/NavbarContext";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";

const inter = Inter({ subsets: ["latin"] });

// Metadata is moved to a separate layout file since this is a client component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <AuthKitProvider>
          <RoleProvider>
            <ModalProvider>
              <LayoutProvider>
                <DateRangeProvider>
                  <main className="flex flex-col min-h-screen">
                    <NavbarProvider>
                      {children}
                    </NavbarProvider>
                  </main>
                </DateRangeProvider>
              </LayoutProvider>
            </ModalProvider>
          </RoleProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
