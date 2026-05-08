'use client';

import { useState, useRef, useEffect } from 'react';
import MainLayout from '../MainLayout';
import { chatAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { Send, Bot, User, Plus, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  rol: 'user' | 'assistant';
  contenido: string;
  fuente?: string;
}

const SUGERENCIAS = [
  '¿Qué clima hace hoy en Caborca?',
  '¿Qué eventos hay este fin de semana?',
  '¿Dónde puedo cenar hoy?',
  '¿Qué pasó hoy en Caborca?',
  'Recomiéndame un lugar tranquilo para comer',
  '¿Hay reportes de tráfico activos?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [conversaciones, setConversaciones] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      chatAPI.getConversaciones().then(setConversaciones).catch(() => {});
    }
  }, [isAuthenticated]);

  const enviar = async (texto?: string) => {
    const msg = (texto || input).trim();
    if (!msg || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), rol: 'user', contenido: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let convId = conversacionId;
      if (!convId && isAuthenticated) {
        const conv = await chatAPI.crearConversacion();
        convId = conv.id;
        setConversacionId(conv.id);
        setConversaciones(prev => [conv, ...prev]);
      }

      const res = await chatAPI.mensaje({
        mensaje: msg,
        conversacion_id: convId || undefined,
        usuario_id: user?.id,
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        rol: 'assistant',
        contenido: res.respuesta,
        fuente: res.fuente,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      toast.error('Error al enviar mensaje');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const nuevaConversacion = () => {
    setMessages([]);
    setConversacionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-56px)] lg:h-screen">
        {isAuthenticated && conversaciones.length > 0 && (
          <div className="hidden md:flex flex-col w-56 border-r bg-white/60" style={{ borderColor: 'var(--border)' }}>
            <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <button onClick={nuevaConversacion}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-sand-dark"
                style={{ color: 'var(--text-secondary)' }}>
                <Plus className="w-4 h-4" />
                Nueva conversación
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversaciones.map(c => (
                <button key={c.id} onClick={() => chatAPI.getMensajes(c.id).then(msgs => { setMessages(msgs); setConversacionId(c.id); })}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-xl text-xs transition-colors truncate',
                    c.id === conversacionId
                      ? 'font-medium' : 'hover:bg-sand-dark'
                  )}
                  style={{ color: c.id === conversacionId ? 'var(--terracotta)' : 'var(--text-muted)', backgroundColor: c.id === conversacionId ? 'var(--sand-dark)' : undefined }}>
                  {c.titulo}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl overflow-hidden mb-6 shadow-xl">
                  <img src="/logo.png" alt="Caborca IA" className="w-full h-full object-contain bg-white p-1"
                    onError={(e) => {
                      e.currentTarget.style.display='none';
                      e.currentTarget.parentElement!.className = 'w-20 h-20 rounded-3xl gradient-desert-hero flex items-center justify-center mb-6 shadow-xl';
                    }}
                  />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--desert-blue)' }}>Caborca IA</h2>
                <p className="max-w-md mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                  Tu asistente inteligente de Heroica Caborca, Sonora. Pregúntame sobre el clima, negocios, eventos, deportes o cualquier cosa de la ciudad.
                </p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGERENCIAS.map(s => (
                    <button key={s} onClick={() => enviar(s)}
                      className="card-desert rounded-xl p-3 text-left text-xs hover:shadow-md transition-all hover:border-terracotta"
                      style={{ color: 'var(--text-secondary)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id}
                className={clsx('flex gap-3 animate-slide-up', msg.rol === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.rol === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 mt-0.5 shadow-sm">
                    <img src="/logo.png" alt="IA" className="w-full h-full object-contain bg-white p-0.5"
                      onError={(e) => {
                        e.currentTarget.style.display='none';
                        e.currentTarget.parentElement!.className = 'w-8 h-8 rounded-xl gradient-sunset flex items-center justify-center shrink-0 mt-0.5';
                        e.currentTarget.parentElement!.innerHTML = '<svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/></svg>';
                      }}
                    />
                  </div>
                )}
                <div className={clsx(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.rol === 'user'
                    ? 'gradient-sunset text-white rounded-tr-sm shadow-md'
                    : 'card-desert rounded-tl-sm prose-chat'
                )} style={msg.rol === 'assistant' ? { color: 'var(--text-primary)' } : {}}>
                  {msg.contenido.split('\n').map((line, i) => {
                    const formatted = line
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>');
                    return (
                      <span key={i}>
                        <span dangerouslySetInnerHTML={{ __html: formatted }} />
                        {i < msg.contenido.split('\n').length - 1 && <br />}
                      </span>
                    );
                  })}
                  {msg.fuente && msg.fuente !== 'sistema' && (
                    <div className="text-xs mt-2 pt-2 border-t opacity-50" style={{ borderColor: 'var(--border)' }}>
                      Fuente: {msg.fuente}
                    </div>
                  )}
                </div>
                {msg.rol === 'user' && (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm" style={{ background: 'var(--sand-dark)' }}>
                    <User className="w-4 h-4" style={{ color: 'var(--desert-blue)' }} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0">
                  <img src="/logo.png" alt="IA" className="w-full h-full object-contain bg-white p-0.5"
                    onError={(e) => { e.currentTarget.parentElement!.className = 'w-8 h-8 rounded-xl gradient-sunset flex items-center justify-center shrink-0'; }}
                  />
                </div>
                <div className="card-desert rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t bg-white/60 backdrop-blur-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-3 items-end max-w-3xl mx-auto">
              <div className="flex-1 rounded-2xl flex items-end gap-2 px-4 py-3 border shadow-sm bg-white" style={{ borderColor: 'var(--border)' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pregúntame algo sobre Caborca..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm resize-none outline-none max-h-32"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <button
                onClick={() => enviar()}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 rounded-xl gradient-sunset flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-lg">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Caborca IA puede cometer errores. Verifica información importante.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
