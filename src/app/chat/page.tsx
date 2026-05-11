'use client';
import { useState, useRef, useEffect } from 'react';
import MainLayout from '../MainLayout';
import { chatAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { getSugerenciasPorHora } from '../../hooks/useSugerencias';
import { Send, User, Plus, Loader2, Trash2 } from 'lucide-react';
import { LogoIcon } from '../MainLayout';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Message { id: string; rol: 'user' | 'assistant'; contenido: string; fuente?: string; }
const STORAGE_KEY = 'caborca_chat_local';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversacionId, setConversacionId] = useState<string | null>(null);
  const [conversaciones, setConversaciones] = useState<any[]>([]);
  const [sugerencias, setSugerencias] = useState<string[]>(getSugerenciasPorHora());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  useEffect(() => {
    if (!isAuthenticated) {
      try { const s = localStorage.getItem(STORAGE_KEY); if (s) setMessages(JSON.parse(s)); } catch {}
    }
    if (isAuthenticated) chatAPI.getConversaciones().then(setConversaciones).catch(() => {});
    fetch(process.env.NEXT_PUBLIC_API_URL + '/sugerencias').then(r => r.json())
      .then(d => { if (d?.length) setSugerencias(d.map((s: any) => s.texto)); }).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && messages.length > 0) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20))); } catch {}
    }
  }, [messages, isAuthenticated]);

  useEffect(() => {
    const handleVoice = (e: any) => {
      const texto = e.detail?.texto;
      if (texto) {
        setInput(texto);
        setTimeout(() => inputRef.current?.focus(), 100);
        toast.success('Voz capturada — presiona enviar');
      }
    };
    window.addEventListener('voice-input', handleVoice);
    return () => window.removeEventListener('voice-input', handleVoice);
  }, []);

  const limpiar = () => { setMessages([]); setConversacionId(null); try { localStorage.removeItem(STORAGE_KEY); } catch {} };

  const enviar = async (texto?: string) => {
    const msg = (texto || input).trim();
    if (!msg || isLoading) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), rol:'user', contenido:msg }]);
    setInput(''); setIsLoading(true);
    try {
      let convId = conversacionId;
      if (!convId && isAuthenticated) { const c = await chatAPI.crearConversacion(); convId = c.id; setConversacionId(c.id); setConversaciones(prev => [c, ...prev]); }
      const res = await chatAPI.mensaje({ mensaje:msg, conversacion_id:convId||undefined, usuario_id:user?.id });
      setMessages(prev => [...prev, { id:(Date.now()+1).toString(), rol:'assistant', contenido:res.respuesta, fuente:res.fuente }]);
    } catch { toast.error('Error al enviar mensaje'); }
    finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row" style={{ height:'calc(100dvh - 52px)' }}>
        {isAuthenticated && conversaciones.length > 0 && (
          <div className="hidden lg:flex flex-col w-52 border-r shrink-0" style={{ borderColor:'var(--border)', background:'var(--surface)' }}>
            <div className="p-2 border-b" style={{ borderColor:'var(--border)' }}>
              <button onClick={limpiar} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-100" style={{ color:'var(--text-secondary)' }}>
                <Plus className="w-4 h-4" /> Nueva
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {conversaciones.map(c => (
                <button key={c.id} onClick={() => chatAPI.getMensajes(c.id).then(msgs => { setMessages(msgs); setConversacionId(c.id); })}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-gray-100 truncate"
                  style={{ color: c.id===conversacionId ? 'var(--terracotta)' : 'var(--text-muted)' }}>
                  {c.titulo}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-8 animate-fade-in">
                <div className="mb-4"><LogoIcon size={60} /></div>
                <h2 className="font-display text-xl font-bold mb-1" style={{ color:'var(--desert-blue)' }}>Caborca IA</h2>
                <p className="max-w-xs mb-6 text-sm" style={{ color:'var(--text-muted)' }}>Tu asistente inteligente de Heroica Caborca, Sonora.</p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                  {sugerencias.slice(0,6).map(s => (
                    <button key={s} onClick={() => enviar(s)} className="rounded-xl p-3 text-left text-xs border shadow-sm hover:shadow-md transition-all"
                      style={{ background:'var(--surface)', borderColor:'var(--border)', color:'var(--text-secondary)' }}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={clsx('flex gap-2 animate-slide-up', msg.rol==='user' ? 'justify-end' : 'justify-start')}>
                    {msg.rol==='assistant' && <div className="shrink-0 mt-0.5"><LogoIcon size={26} /></div>}
                    <div className={clsx('max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed', msg.rol==='user' ? 'gradient-sunset text-white rounded-tr-sm shadow-md' : 'border shadow-sm rounded-tl-sm')}
                      style={msg.rol==='assistant' ? { color:'var(--text-primary)', background:'var(--surface)', borderColor:'var(--border)' } : {}}>
                      {msg.contenido.split('\n').map((line, i) => (
                        <span key={i}>
                          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/(https?:\/\/[^\s)]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#E05C3A;text-decoration:underline;word-break:break-all;">$1</a>') }} />
                          {i < msg.contenido.split('\n').length-1 && <br />}
                        </span>
                      ))}
                      {msg.fuente && msg.fuente!=='sistema' && <div className="text-xs mt-2 pt-2 border-t opacity-40" style={{ borderColor:'var(--border)' }}>Fuente: {msg.fuente}</div>}
                    </div>
                    {msg.rol==='user' && <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background:'var(--sand-dark)' }}><User className="w-3.5 h-3.5" style={{ color:'var(--desert-blue)' }} /></div>}
                  </div>
                ))}
              </>
            )}
            {isLoading && (
              <div className="flex gap-2 justify-start animate-fade-in">
                <div className="shrink-0"><LogoIcon size={26} /></div>
                <div className="border shadow-sm rounded-2xl rounded-tl-sm px-4 py-3" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
                  <div className="flex items-center gap-2" style={{ color:'var(--text-muted)' }}><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Pensando...</span></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="shrink-0 border-t" style={{ borderColor:'var(--border)', background:'var(--surface)' }}>
            {messages.length > 0 && (
              <div className="flex justify-end px-3 pt-1.5">
                <button onClick={limpiar} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ color:'var(--text-muted)' }}>
                  <Trash2 className="w-3 h-3" /> Limpiar
                </button>
              </div>
            )}
            <div className="p-3" style={{ paddingBottom:'calc(env(safe-area-inset-bottom) + 72px)' }}>
              <div className="flex gap-2 items-end max-w-2xl mx-auto">
                <div className="flex-1 rounded-2xl flex items-end gap-2 px-4 py-3 border shadow-sm" style={{ background:'var(--sand)', borderColor:'var(--border)' }}>
                  <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Preguntame algo sobre Caborca..." rows={1}
                    className="flex-1 bg-transparent text-sm resize-none outline-none max-h-28"
                    style={{ color:'var(--text-primary)' }} />
                </div>
                <button onClick={() => enviar()} disabled={!input.trim() || isLoading}
                  className="w-11 h-11 rounded-xl gradient-sunset flex items-center justify-center shrink-0 disabled:opacity-40 shadow-lg">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-center text-xs mt-1.5" style={{ color:'var(--text-muted)' }}>Caborca IA puede cometer errores. Verifica info importante.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
