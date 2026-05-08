'use client';

import { useState, useRef, useEffect } from 'react';
import MainLayout from '../MainLayout';
import { chatAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { Send, Bot, User, Zap, Plus, Loader2 } from 'lucide-react';
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
  const [showSidebar, setShowSidebar] = useState(false);
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

  const cargarConversacion = async (id: string) => {
    try {
      const msgs = await chatAPI.getMensajes(id);
      setMessages(msgs.map((m: any) => ({ id: m.id, rol: m.rol, contenido: m.contenido })));
      setConversacionId(id);
    } catch {
      toast.error('Error cargando conversación');
    }
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
          <div className="hidden md:flex flex-col w-56 border-r border-surface-700/50 bg-surface-900/50">
            <div className="p-3 border-b border-surface-700/50">
              <button onClick={nuevaConversacion}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-surface-800 transition-colors">
                <Plus className="w-4 h-4" />
                Nueva conversación
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversaciones.map(c => (
                <button key={c.id} onClick={() => cargarConversacion(c.id)}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-xl text-xs transition-colors truncate',
                    c.id === conversacionId
                      ? 'bg-brand-600/20 text-brand-300'
                      : 'text-slate-400 hover:bg-surface-800 hover:text-white'
                  )}>
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
                <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-2xl mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">Caborca IA</h2>
                <p className="text-slate-400 max-w-md mb-8">Tu asistente inteligente de Heroica Caborca, Sonora. Pregúntame sobre el clima, negocios, eventos, deportes o cualquier cosa de la ciudad.</p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGERENCIAS.map(s => (
                    <button key={s} onClick={() => enviar(s)}
                      className="glass rounded-xl p-3 text-left text-xs text-slate-300 hover:text-white hover:border-brand-600/40 transition-all text-sm">
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
                  <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={clsx(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.rol === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'glass text-slate-200 rounded-tl-sm prose-chat'
                )}>
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
                    <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-surface-700/30">
                      Fuente: {msg.fuente}
                    </div>
                  )}
                </div>
                {msg.rol === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-surface-700/50">
            <div className="flex gap-3 items-end max-w-3xl mx-auto">
              <div className="flex-1 glass rounded-2xl flex items-end gap-2 px-4 py-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pregúntame algo sobre Caborca..."
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-slate-500 max-h-32"
                  style={{ overflowY: input.includes('\n') ? 'auto' : 'hidden' }}
                />
              </div>
              <button
                onClick={() => enviar()}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 rounded-xl gradient-brand flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-lg shadow-brand-600/20">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-center text-xs text-slate-600 mt-2">
              Caborca IA puede cometer errores. Verifica información importante.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
