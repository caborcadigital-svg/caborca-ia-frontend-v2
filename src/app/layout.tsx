import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import BottomNav from '../components/BottomNav';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Caborca IA — Tu asistente inteligente',
  description: 'La IA comunitaria de Heroica Caborca, Sonora. Clima, noticias, eventos, reportes y más.',
  keywords: 'Caborca, Sonora, IA, asistente, noticias, clima, eventos',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Caborca IA' },
  themeColor: '#1E3A5F',
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
      </head>
      <body style={{ paddingBottom: '0' }}>
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
