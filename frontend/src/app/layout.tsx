import type { Metadata } from 'next';
import { Providers } from '@/components/layout/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFab } from '@/components/ui/WhatsAppFab';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Peyote Spychatelics — Premium Botanical Marketplace',
  description: 'Rare, ethically sourced botanical specimens curated for collectors and enthusiasts.',
  keywords: 'peyote, cactus, botanical, rare plants, succulents, collector',
  openGraph: {
    title: 'Peyote Spychatelics',
    description: 'Premium Botanical Marketplace',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: '#1A2E1A', color: '#F7F2E8', fontFamily: 'Inter, sans-serif' },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#1A2E1A' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
