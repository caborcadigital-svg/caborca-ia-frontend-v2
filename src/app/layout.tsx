import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import BottomNav from './BottomNav';
import OnboardingTour from '../components/OnboardingTour';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: { default: 'Caborca IA — Tu asistente inteligente', template: '%s | Caborca IA' },
  description: 'La IA comunitaria de Heroica Caborca, Sonora. Clima, noticias, eventos, reportes, negocios y mas.',
  keywords: ['Caborca', 'Sonora', 'IA', 'asistente', 'noticias Caborca', 'clima Caborca', 'negocios Caborca'],
  authors: [{ name: 'Caborca IA', url: 'https://caborca.app' }],
  metadataBase: new URL('https://caborca.app'),
  openGraph: {
    type: 'website', locale: 'es_MX', url: 'https://caborca.app', siteName: 'Caborca IA',
    title: 'Caborca IA — Tu asistente inteligente',
    description: 'La IA comunitaria de Heroica Caborca, Sonora.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Caborca IA' }],
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Caborca IA' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable + ' ' + outfit.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E3A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Caborca IA" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="geo.region" content="MX-SON" />
        <meta name="geo.placename" content="Heroica Caborca, Sonora" />
      </head>
      <body>
        {children}
        <BottomNav />
        <OnboardingTour />
        <Toaster position="top-right" toastOptions={{ style: { background: '#FFFFFF', color: '#1A1A2E', border: '1px solid #E0E0E0' }, duration: 3500 }} />
      </body>
    </html>
  );
}
