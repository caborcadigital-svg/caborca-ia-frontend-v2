'use client';
import { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const iniciar = () => {
    if (!supported) { toast.error('Tu navegador no soporta búsqueda por voz'); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => { setIsListening(false); setIsProcessing(false); };
    recognition.onerror = () => { setIsListening(false); setIsProcessing(false); toast.error('No se pudo escuchar'); };
    recognition.onresult = (e: any) => {
      const texto = e.results[0][0].transcript;
      setIsProcessing(true);
      toast.success('Buscando: ' + texto);
      setTimeout(() => {
        router.push('/chat?q=' + encodeURIComponent(texto));
      }, 500);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const detener = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  if (!supported) return null;

  return (
    <button
      onClick={isListening ? detener : iniciar}
      className="flex items-center justify-center w-10 h-10 rounded-xl border transition-all"
      style={{
        background: isListening ? '#FEF2F2' : 'var(--card)',
        borderColor: isListening ? '#DC2626' : 'var(--border)',
        color: isListening ? '#DC2626' : 'var(--text-muted)',
      }}
      title="Buscar por voz">
      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> :
       isListening ? <MicOff className="w-4 h-4" /> :
       <Mic className="w-4 h-4" />}
    </button>
  );
}
