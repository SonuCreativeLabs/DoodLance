import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react'
import { Providers } from "@/components/Providers";
import ErrorBoundary from '@/components/ErrorBoundary';

import { ReferralTracker } from '@/components/ReferralTracker';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DoodLance - Cricket Services Marketplace",
  description: "Connect with professional cricketers and coaches for training, matches, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased dark`}>
        <Providers>
          <ReferralTracker />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
