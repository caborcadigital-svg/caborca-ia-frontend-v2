'use client';
import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstall() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const standalone = (window.navigator as any).standalone;
    setIsIOS(ios);

    if (ios && !standalone) {
      const dismissed = localStorage.getItem('pwa_ios_dismissed');
      if (!dismissed) setTimeout(() => setShowIOS(true), 3000);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      const dismissed = localStorage.getItem('pwa_dismissed');
      if (!dismissed) setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const instalar = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setPrompt(null);
  };

  const dismiss = () => {
    setShow(false);
    setShowIOS(false);
    localStorage.setItem('pwa_dismissed', 'true');
    localStorage.setItem('pwa_ios_dismissed', 'true');
  };

  if (showIOS) {
    return (
      <div className="fixed bottom-20 left-3 right-3 z-50 rounded-2xl p-4 shadow-2xl animate-slide-up"
        style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
        <button onClick={dismiss} className="absolute top-3 right-3" style={{ color:'var(--text-muted)' }}>
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <img src="/icon-192.png" alt="Caborca IA" className="w-10 h-10 rounded-xl" />
          <div>
            <div className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>Instalar Caborca IA</div>
            <div className="text-xs" style={{ color:'var(--text-muted)' }}>Acceso rápido desde tu pantalla de inicio</div>
          </div>
        </div>
        <div className="text-xs rounded-xl p-3" style={{ background:'var(--sand)', color:'var(--text-secondary)' }}>
          Toca <strong>Compartir</strong> <span className="text-base">⬆️</span> y luego <strong>"Agregar a pantalla de inicio"</strong>
        </div>
      </div>
    );
  }

  if (!show || !prompt) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 rounded-2xl p-4 shadow-2xl animate-slide-up"
      style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
      <button onClick={dismiss} className="absolute top-3 right-3" style={{ color:'var(--text-muted)' }}>
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-3 mb-3">
        <img src="/icon-192.png" alt="Caborca IA" className="w-10 h-10 rounded-xl" />
        <div>
          <div className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>Instalar Caborca IA</div>
          <div className="text-xs" style={{ color:'var(--text-muted)' }}>Acceso rápido, funciona sin internet</div>
        </div>
      </div>
      <button onClick={instalar}
        className="w-full py-2.5 rounded-xl gradient-sunset text-white font-medium text-sm flex items-center justify-center gap-2">
        <Download className="w-4 h-4" /> Instalar app
      </button>
    </div>
  );
}
