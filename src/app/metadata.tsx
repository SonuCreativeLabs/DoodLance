import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'BAILS - Sports Freelance Marketplace',
    template: '%s | BAILS'
  },
  description: 'Connect with professional sports freelancers, coaches, and support staff. BAILS is the premier freelance marketplace for sports.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/LOGOS/TS favicon.svg', type: 'image/svg+xml' },
    ],
  },
};