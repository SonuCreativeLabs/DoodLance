import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react'
import { Providers } from "@/components/Providers";
import ErrorBoundary from '@/components/ErrorBoundary';

import { ReferralTracker } from '@/components/ReferralTracker';
import { MicrosoftClarity } from "@/components/MicrosoftClarity";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'BAILS - Cricket Services Marketplace',
    template: '%s | BAILS',
  },
  description: 'Find and hire the best cricket talent in Chennai',
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
          <MicrosoftClarity projectId="v28pmfyxle" />
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Analytics />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-0N2KWPE6D5"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-0N2KWPE6D5');
            `}
          </Script>
        </Providers>
      </body>
    </html>
  );
}
