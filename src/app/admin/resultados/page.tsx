'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Trophy, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminResultadosPage() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('pendiente');

  const cargar = (estado: string) => {
    setIsLoading(true);
    api.get('/resultados-deportivos?estado=' + estado).then(r => setResultados(r.data)).finally(() => setIsLoading(false));
  };

  useEffect(() => { cargar(filtro); }, [filtro]);

  const aprobar = async (id: string) => {
    try {
      await api.put('/resultados-deportivos/' + id + '/aprobar', {});
      setResultados(prev => prev.filter(r => r.id !== id));
      toast.success('Resultado aprobado y publicado en deportes');
    } catch { toast.error('Error aprobando resultado'); }
  };

  const rechazar = async (id: string) => {
    try {
      await api.put('/resultados-deportivos/' + id + '/rechazar', {});
      setResultados(prev => prev.filter(r => r.id !== id));
      toast.success('Resultado rechazado');
    } catch { toast.error('Error rechazando resultado'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#FEF0E8' }}>
            <Trophy className="w-5 h-5" style={{ color:'#E8823A' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Resultados Enviados</h1>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Resultados enviados por la comunidad</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['pendiente','aprobado','rechazado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={'px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ' + (filtro === f ? 'gradient-sunset text-white border-transparent' : 'bg-white')}
              style={filtro !== f ? { borderColor:'var(--border)', color:'var(--text-secondary)' } : {}}>
              {f}
              {f === 'pendiente' && resultados.filter(r => r.estado === 'pendiente').length > 0 && filtro === 'pendiente' && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{resultados.length}</span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse h-28" style={{ borderColor:'var(--border)' }} />)}</div>
        ) : resultados.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor:'var(--border)' }}>
            <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color:'var(--text-muted)' }}>No hay resultados {filtro}s</div>
          </div>
        ) : (
          <div className="space-y-3">
            {resultados.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor:'var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold" style={{ color:'var(--terracotta)' }}>{r.deporte}</span>
                      {r.liga && <span className="text-xs" style={{ color:'var(--text-muted)' }}>· {r.liga}</span>}
                      <span className="flex items-center gap-1 text-xs ml-auto" style={{ color:'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix:true, locale:es })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{r.equipo_local}</span>
                      <span className="font-display font-bold text-xl mx-4" style={{ color:'var(--desert-blue)' }}>{r.marcador_local} - {r.marcador_visitante}</span>
                      <span className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{r.equipo_visitante}</span>
                    </div>
                    {r.lugar && <div className="text-xs" style={{ color:'var(--text-muted)' }}>📍 {r.lugar}</div>}
                    {r.comentario && <div className="text-xs mt-1 italic" style={{ color:'var(--text-secondary)' }}>"{r.comentario}"</div>}
                    {r.enviado_por && <div className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>Enviado por: {r.enviado_por}</div>}
                  </div>
                  {filtro === 'pendiente' && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => aprobar(r.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 hover:bg-green-600 hover:text-white transition-all border border-green-100 text-green-600"
                        title="Aprobar y publicar">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => rechazar(r.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-600 hover:text-white transition-all border border-red-100 text-red-500"
                        title="Rechazar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
