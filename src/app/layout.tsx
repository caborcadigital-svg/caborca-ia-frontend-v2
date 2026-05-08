import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Caborca IA — Tu asistente inteligente',
  description: 'La IA comunitaria de Heroica Caborca, Sonora. Clima, noticias, eventos, reportes y más.',
  keywords: 'Caborca, Sonora, IA, asistente, noticias, clima, eventos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            duration: 3500,
          }}
        />
      </body>
    </html>
  );
}
