'use client';
import { useState } from 'react';
import MainLayout from '../MainLayout';
import { Newspaper, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SugerirNoticiaPage() {
  const [form, setForm] = useState({ titulo:'', descripcion:'', fuente:'', nombre_contacto:'', email_contacto:'', telefono_contacto:'' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const enviar = async () => {
    if (!form.titulo || !form.descripcion) { toast.error('Titulo y descripcion son requeridos'); return; }
    setEnviando(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/sugerencias-noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error');
      setEnviado(true);
    } catch { toast.error('Error enviando sugerencia'); }
    finally { setEnviando(false); }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border";
  const inpStyle = { borderColor:'var(--border)', color:'var(--text-primary)', background:'var(--card)' };

  if (enviado) return (
    <MainLayout>
      <div className="max-w-lg mx-auto px-3 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background:'#EEF5F0' }}>
          <CheckCircle className="w-8 h-8" style={{ color:'#4A7C59' }} />
        </div>
        <h1 className="font-display text-2xl font-bold" style={{ color:'var(--desert-blue)' }}>Sugerencia enviada</h1>
        <p className="text-sm" style={{ color:'var(--text-muted)' }}>
          Gracias por contribuir. El equipo de Caborca IA revisara tu sugerencia y si es de interes la publicara.
        </p>
        <button onClick={() => { setEnviado(false); setForm({ titulo:'', descripcion:'', fuente:'', nombre_contacto:'', email_contacto:'', telefono_contacto:'' }); }}
          className="px-6 py-3 rounded-xl gradient-sunset text-white font-medium text-sm">
          Enviar otra sugerencia
        </button>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#F3EEF9' }}>
            <Newspaper className="w-5 h-5" style={{ color:'#6B3FA0' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Sugiere una noticia</h1>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Ayuda a informar a Caborca</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 border text-sm" style={{ background:'#EEF5F0', borderColor:'#C8E0CC', color:'#2D5A3A' }}>
          Tu sugerencia sera revisada por el equipo antes de publicarse. Si tienes evidencia o mas detalles, incluyelos en la descripcion.
        </div>

        <div className="rounded-2xl p-5 border shadow-sm space-y-4" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
          <h3 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>Informacion de la noticia</h3>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Titulo o tema *</label>
            <input type="text" placeholder="¿Sobre qué es la noticia?" value={form.titulo} onChange={e => set('titulo', e.target.value)} className={inp} style={inpStyle} />
          </div>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Descripcion completa *</label>
            <textarea placeholder="Describe con detalle lo que sabes. Dónde ocurrió, cuándo, quiénes estaban involucrados..." value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)} rows={5} className={inp + ' resize-none'} style={inpStyle} />
          </div>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Fuente o referencia (opcional)</label>
            <input type="text" placeholder="¿De dónde viene esta información? (testigo, redes sociales, etc.)" value={form.fuente} onChange={e => set('fuente', e.target.value)} className={inp} style={inpStyle} />
          </div>
        </div>

        <div className="rounded-2xl p-5 border shadow-sm space-y-4" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
          <h3 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>Tus datos de contacto (opcional)</h3>
          <p className="text-xs" style={{ color:'var(--text-muted)' }}>Solo para que podamos contactarte si necesitamos mas informacion. No se publicaran.</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Tu nombre</label>
              <input type="text" placeholder="Juan Lopez" value={form.nombre_contacto} onChange={e => set('nombre_contacto', e.target.value)} className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Telefono</label>
              <input type="tel" placeholder="637..." value={form.telefono_contacto} onChange={e => set('telefono_contacto', e.target.value)} className={inp} style={inpStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Email</label>
            <input type="email" placeholder="tu@email.com" value={form.email_contacto} onChange={e => set('email_contacto', e.target.value)} className={inp} style={inpStyle} />
          </div>
        </div>

        <button onClick={enviar} disabled={enviando}
          className="w-full py-3 rounded-xl gradient-sunset text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
          <Send className="w-4 h-4" />
          {enviando ? 'Enviando...' : 'Enviar sugerencia'}
        </button>

        <p className="text-center text-xs" style={{ color:'var(--text-muted)' }}>
          Al enviar, aceptas que el equipo de Caborca IA puede editar y publicar la noticia.
        </p>
      </div>
    </MainLayout>
  );
}
