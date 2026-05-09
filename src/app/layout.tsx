import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import BottomNav from '../components/BottomNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    default: 'Caborca IA — Tu asistente inteligente',
    template: '%s | Caborca IA',
  },
  description: 'La IA comunitaria de Heroica Caborca, Sonora. Clima, noticias, eventos, reportes, negocios y más.',
  keywords: ['Caborca', 'Sonora', 'IA', 'asistente inteligente', 'noticias Caborca', 'clima Caborca', 'negocios Caborca', 'eventos Caborca'],
  authors: [{ name: 'Caborca IA', url: 'https://caborca.app' }],
  creator: 'YSKS Soluciones',
  metadataBase: new URL('https://caborca.app'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://caborca.app',
    siteName: 'Caborca IA',
    title: 'Caborca IA — Tu asistente inteligente',
    description: 'La IA comunitaria de Heroica Caborca, Sonora. Clima, noticias, eventos, reportes y negocios locales.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Caborca IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caborca IA',
    description: 'Tu asistente inteligente de Heroica Caborca, Sonora.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Caborca IA' },
  themeColor: '#1E3A5F',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E3A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Caborca IA" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="geo.region" content="MX-SON" />
        <meta name="geo.placename" content="Heroica Caborca, Sonora" />
        <meta name="geo.position" content="30.7162;-112.1544" />
      </head>
      <body>
        {children}
        <BottomNav />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#FFFFFF', color: '#1A1A2E', border: '1px solid #E0E0E0' },
            duration: 3500,
          }}
        />
      </body>
    </html>
  );
}
