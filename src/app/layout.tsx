import type { Metadata } from 'next';
import './globals.css';
import AppProviders from '@/providers/AppProviders';

export const metadata: Metadata = {
  title: 'The XVIII Brew Co. | Crafted Coffee & Extraordinary Desserts',
  description:
    'The XVIII Brew Co. — Premium artisan coffee and extraordinary desserts. Single-origin beans, precision brewing, and handcrafted confections. Experience what a cup can truly mean.',
  keywords: ['coffee', 'desserts', 'premium', 'artisan', 'XVIII Brew Co', 'luxury coffee'],
  authors: [{ name: 'The XVIII Brew Co.' }],
  openGraph: {
    title: 'The XVIII Brew Co. | Crafted Coffee & Extraordinary Desserts',
    description: 'Premium artisan coffee and extraordinary desserts. Something has been steeping.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
