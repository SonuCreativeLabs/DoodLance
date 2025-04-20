import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AuthProvider } from "@/context/auth-context";
import { RoleProvider } from "@/contexts/role-context";

export const metadata: Metadata = {
  title: "SkilledMice",
  description: "Find skilled professionals for your tasks",
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
          <RoleProvider>
            <main className="min-h-screen pb-16 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
