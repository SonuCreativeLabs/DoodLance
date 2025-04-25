import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { RoleProvider } from "@/contexts/role-context";
import { AuthProvider } from "@/contexts/auth-context";

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
            <main className="min-h-screen">
              {children}
            </main>
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
