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
  metadataBase: new URL('https://doodlance.com'),
  title: {
    default: 'BAILS - Cricket Services Marketplace',
    template: '%s | BAILS',
  },
  description: 'Find and hire the best cricket talent in Chennai. Connect with net bowlers, sidearm specialists, coaches, and match players.',
  keywords: ['cricket', 'chennai', 'net bowlers', 'sidearm', 'cricket coaching', 'match players', 'hire cricketers', 'cricket services'],

  authors: [{ name: 'BAILS Team' }],
  creator: 'BAILS',
  publisher: 'BAILS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'BAILS - Cricket Services Marketplace',
    description: 'Connect with local cricket service providers and monetize your skills',
    url: 'https://bails.in',
    siteName: 'BAILS',
    images: [
      {
        url: '/images/LOGOS/BAILS TG.png',
        width: 1200,
        height: 630,
        alt: 'BAILS - Cricket Services Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BAILS - Cricket Services Marketplace',
    description: 'Connect with local cricket service providers and monetize your skills',
    creator: '@bails_in', // Assuming handle, can be generic if unknown
    images: ['/images/LOGOS/BAILS TG.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/LOGOS/TS favicon.svg',
    shortcut: '/images/LOGOS/TS favicon.svg',
    apple: '/images/LOGOS/TS favicon.svg',
  },
  manifest: '/manifest.json',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BAILS',
  url: 'https://doodlance.com',
  logo: 'https://doodlance.com/images/LOGOS/BAILS%20TG.png',
  sameAs: [
    'https://twitter.com/bails_official',
    'https://instagram.com/bails_official',
    // Add other social links
  ],
  description: 'A hyper-local cricket services platform connecting cricket players, coaches, teams, and enthusiasts with specialized cricket service providers.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
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
          <Script
            id="json-ld-org"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
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
