import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react'
import { Providers } from "@/components/Providers";
import ErrorBoundary from '@/components/ErrorBoundary';
import { Suspense } from 'react';

import { ReferralTracker } from '@/components/ReferralTracker';
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import FacebookPixel from "@/components/FacebookPixel";
import { PageTracker } from "@/components/common/PageTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://bails.in'),
  title: {
    default: 'Sports Talent Marketplace',
    template: '%s | BAILS',
  },
  description: 'Find and hire the best sports freelancers. Connect with coaches, players, and specialized sport professionals.',
  keywords: ['sports freelance', 'coaching', 'athletes', 'hire sports talent', 'sports marketplace', 'cricket', 'football', 'badminton', 'net bowlers', 'sidearmers', 'mystry spinners', 'fast bowler', 'pickleball coach', 'padelball', 'basketball', 'one on one coach', 'analyst', 'physio', 'practice partner', 'cricket coaching', 'sports recruitment', 'athlete portfolio', 'local coaches', 'sports gigs', 'monetize sports skills', 'sports community', 'scouting', 'performance analyst', 'sports tech'],

  authors: [{ name: 'BAILS Team' }],
  creator: 'BAILS',
  publisher: 'BAILS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Sports Talent Marketplace',
    description: 'Hire sports experts or monetize your sports skills',
    url: 'https://bails.in',
    siteName: 'BAILS',
    images: [
      {
        url: '/images/LOGOS/BAILS%20Logo%20+%20Tag.png',
        width: 1200,
        height: 630,
        alt: 'BAILS - Sports Talent Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Talent Marketplace',
    description: 'Hire sports experts or monetize your sports skills',
    creator: '@bails_in', // Assuming handle, can be generic if unknown
    images: ['/images/LOGOS/BAILS%20Logo%20+%20Tag.png'],
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
  url: 'https://bails.in',
  logo: 'https://bails.in/images/LOGOS/BAILS%20Logo%20+%20Tag.png',
  sameAs: [
    'https://twitter.com/bails_official',
    'https://instagram.com/bails_official',
    // Add other social links
  ],
  description: 'A hyper-local sports freelance marketplace connecting players, coaches, teams, and enthusiasts with specialized sports professionals.',
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
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          <Suspense fallback={null}>
            <PageTracker />
          </Suspense>
          <MicrosoftClarity projectId="v28pmfyxle" />
          <Suspense fallback={null}>
            <FacebookPixel />
          </Suspense>
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              `,
            }}
          />
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
          <Script src="https://cdn.pushwoosh.com/webpush/v3/pushwoosh-web-notifications.js" strategy="afterInteractive" />
          <Script
            id="pushwoosh-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                 window.Pushwoosh = window.Pushwoosh || [];
                 window.Pushwoosh.push(['init', {
                     logLevel: 'info',
                     applicationCode: '39A99-0D413',
                     apiToken: '${process.env.NEXT_PUBLIC_PUSHWOOSH_API_TOKEN || ""}',
                     safariWebsitePushID: '',
                     defaultNotificationTitle: 'BAILS',
                     defaultNotificationImage: 'https://bails.in/images/LOGOS/BAILS%20Logo%20+%20Tag.png',
                     autoSubscribe: true,
                     serviceWorkerUrl: '/pushwoosh-service-worker.js'
                 }]);
               `,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
