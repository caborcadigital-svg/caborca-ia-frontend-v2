import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import BottomNav from './BottomNav';
import OnboardingTour from '../components/OnboardingTour';
import ThemeProvider from './ThemeProvider';
import PWAInstall from '../components/PWAInstall';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const viewport: Viewport = {
  themeColor: '#1E3A5F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: { default: 'Caborca IA — Tu asistente inteligente', template: '%s | Caborca IA' },
  description: 'La IA comunitaria de Heroica Caborca, Sonora. Clima, noticias, eventos, reportes, negocios y mas.',
  keywords: ['Caborca','Sonora','IA','asistente','noticias Caborca','clima Caborca'],
  authors: [{ name: 'Caborca IA', url: 'https://caborca.app' }],
  metadataBase: new URL('https://caborca.app'),
  openGraph: {
    type: 'website', locale: 'es_MX', url: 'https://caborca.app', siteName: 'Caborca IA',
    title: 'Caborca IA — Tu asistente inteligente',
    description: 'La IA comunitaria de Heroica Caborca, Sonora.',
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Caborca IA' },
  applicationName: 'Caborca IA',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable + ' ' + outfit.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Caborca IA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="geo.region" content="MX-SON" />
        <meta name="geo.placename" content="Heroica Caborca, Sonora" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <ThemeProvider />
        <ServiceWorkerRegister />
        {children}
        <BottomNav />
        <OnboardingTour />
        <PWAInstall />
        <Toaster position="top-center" toastOptions={{ style:{ background:'var(--surface)', color:'var(--text-primary)', border:'1px solid var(--border)' }, duration:3500 }} />
      </body>
    </html>
  );
}
