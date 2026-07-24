import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LocationPrompt } from '@/components/ui/LocationPrompt';
import { AppProvider } from '@/components/providers/AppProvider';

export const metadata: Metadata = {
  title: 'Sizzle & Slice | Gourmet Burgers, Wood-Fired Pizza & Fast Food',
  description:
    'Order fresh artisanal burgers, wood-fired pizzas, shawarmas, and desserts directly via WhatsApp with lightning fast delivery.',
  keywords: ['food ordering', 'gourmet burgers', 'wood fired pizza', 'whatsapp food order', 'restaurant delivery'],
  openGraph: {
    title: 'Sizzle & Slice | Gourmet Food Delivery',
    description: 'Order your favorite meals directly via WhatsApp for fast delivery.',
    url: 'https://sizzlenslice.com',
    siteName: 'Sizzle & Slice',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sizzle & Slice Feast',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sizzle & Slice | Gourmet Food Ordering',
    description: 'Fresh artisanal meals delivered straight to your door via WhatsApp.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 antialiased selection:bg-brand-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
          <LocationPrompt />
        </AppProvider>
      </body>
    </html>
  );
}
