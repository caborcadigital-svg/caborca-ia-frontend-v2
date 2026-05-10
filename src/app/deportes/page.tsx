'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { deportesAPI } from '../../lib/api';
import { Trophy, Plus, X, Send } from 'lucide-react';
import ShareWhatsApp from '../../components/ShareWhatsApp';
import toast from 'react-hot-toast';

const DEPORTES = ['beisbol','futbol','basquetbol','softbol','otro'];
const FORM_INIT = { deporte:'beisbol', liga:'', equipo_local:'', equipo_visitante:'', marcador_local:'', marcador_visitante:'', lugar:'', fecha:'', comentario:'', enviado_por:'' };

export default function DeportesPage() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [enviando, setEnviando] = useState(false);
  const [tab, setTab] = useState<'resultados'|'proximos'>('resultados');

  useEffect(() => { deportesAPI.getPartidos().then(setPartidos); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const enviarResultado = async () => {
    if (!form.equipo_local || !form.equipo_visitante) { toast.error('Equipos requeridos'); return; }
    if (form.marcador_local === '' || form.marcador_visitante === '') { toast.error('Marcadores requeridos'); return; }
    setEnviando(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/resultados-deportivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error enviando');
      toast.success('Resultado enviado. El admin lo revisara y publicara.');
      setForm(FORM_INIT);
      setShowForm(false);
    } catch { toast.error('Error enviando resultado'); }
    finally { setEnviando(false); }
  };

  const resultados = partidos.filter(p => p.estado === 'finalizado');
  const proximos = partidos.filter(p => p.estado === 'programado' || p.estado === 'en_curso');
  const lista = tab === 'resultados' ? resultados : proximos;

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
  const inpStyle = { borderColor:'var(--border)', color:'var(--text-primary)' };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#FEF0E8' }}>
              <Trophy className="w-5 h-5" style={{ color:'#E8823A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Deportes en Caborca</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>Ligas y torneos locales</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Enviar resultado'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor:'var(--border)' }}>
            <div>
              <h3 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>Enviar resultado de partido</h3>
              <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>El admin lo revisara antes de publicarlo</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Deporte</label>
                <select value={form.deporte} onChange={e => set('deporte', e.target.value)} className={inp} style={inpStyle}>
                  {DEPORTES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Liga / Torneo</label>
                <input type="text" placeholder="Liga FG, etc." value={form.liga} onChange={e => set('liga', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Equipo local *</label>
                <input type="text" placeholder="Local" value={form.equipo_local} onChange={e => set('equipo_local', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Local</label>
                  <input type="number" min="0" placeholder="0" value={form.marcador_local} onChange={e => set('marcador_local', e.target.value)} className={inp + ' text-center'} style={inpStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Visit.</label>
                  <input type="number" min="0" placeholder="0" value={form.marcador_visitante} onChange={e => set('marcador_visitante', e.target.value)} className={inp + ' text-center'} style={inpStyle} />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Equipo visitante *</label>
                <input type="text" placeholder="Visitante" value={form.equipo_visitante} onChange={e => set('equipo_visitante', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Lugar</label>
                <input type="text" placeholder="Campo / Estadio" value={form.lugar} onChange={e => set('lugar', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Fecha del partido</label>
                <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>
            <input type="text" placeholder="Tu nombre (opcional)" value={form.enviado_por} onChange={e => set('enviado_por', e.target.value)} className={inp} style={inpStyle} />
            <textarea placeholder="Comentario adicional (opcional)" value={form.comentario} onChange={e => set('comentario', e.target.value)}
              rows={2} className={inp + ' resize-none'} style={inpStyle} />
            <button onClick={enviarResultado} disabled={enviando}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {enviando ? 'Enviando...' : 'Enviar resultado para revision'}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {[{v:'resultados',label:'Resultados'},{v:'proximos',label:'Proximos'}].map(({ v, label }) => (
            <button key={v} onClick={() => setTab(v as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === v ? 'gradient-sunset text-white border-transparent' : 'bg-white'}`}
              style={tab !== v ? { borderColor:'var(--border)', color:'var(--text-secondary)' } : {}}>
              {label}
            </button>
          ))}
        </div>

        {lista.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border shadow-sm" style={{ borderColor:'var(--border)' }}>
            <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color:'var(--text-muted)' }}>No hay {tab === 'resultados' ? 'resultados' : 'partidos proximos'}</div>
          </div>
        ) : (
          <div className="space-y-3">
            {lista.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color:'var(--terracotta)' }}>{p.liga} · {p.deporte}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: p.estado === 'finalizado' ? 'var(--text-muted)' : p.estado === 'en_curso' ? '#16a34a' : 'var(--terracotta)', background: p.estado === 'finalizado' ? '#f3f4f6' : p.estado === 'en_curso' ? '#f0fdf4' : '#fef0ec' }}>
                    {p.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{p.equipo_local}</span>
                  <span className="font-display font-bold text-xl mx-4" style={{ color:'var(--desert-blue)' }}>
                    {p.marcador_local ?? '-'} - {p.marcador_visitante ?? '-'}
                  </span>
                  <span className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{p.equipo_visitante}</span>
                </div>
                {p.lugar && <div className="text-xs mt-2 text-center" style={{ color:'var(--text-muted)' }}>📍 {p.lugar}</div>}
                <div className="flex justify-center mt-2">
                  <ShareWhatsApp
                    texto={'⚾ Resultado en Caborca: ' + p.equipo_local + ' ' + (p.marcador_local ?? '-') + ' - ' + (p.marcador_visitante ?? '-') + ' ' + p.equipo_visitante + ' (' + p.liga + ')'}
                    url="https://caborca.app/deportes" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
