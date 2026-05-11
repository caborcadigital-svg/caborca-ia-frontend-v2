'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Activity, Trash2, RefreshCw, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const SECCIONES = ['todas','noticias','eventos','deportes','negocios','reportes','usuarios','emergencias'];

const SECCION_COLORS: Record<string,{bg:string,color:string}> = {
  noticias: { bg:'#F3EEF9', color:'#6B3FA0' },
  eventos: { bg:'#EEF5F0', color:'#4A7C59' },
  deportes: { bg:'#FEF0E8', color:'#E8823A' },
  negocios: { bg:'#EEF4F9', color:'#2D5F8A' },
  reportes: { bg:'#FEF2F2', color:'#DC2626' },
  usuarios: { bg:'#F3EEF9', color:'#6B3FA0' },
  emergencias: { bg:'#FEF2F2', color:'#DC2626' },
};

const ACCION_ICONOS: Record<string,string> = {
  'publicada': '✅', 'creado': '✅', 'creada': '✅',
  'editada': '✏️', 'editado': '✏️',
  'eliminada': '🗑️', 'eliminado': '🗑️',
  'aprobado': '✅', 'rechazado': '❌',
  'registrado': '⚾',
};

function getIcono(accion: string) {
  const lower = accion.toLowerCase();
  for (const [key, icono] of Object.entries(ACCION_ICONOS)) {
    if (lower.includes(key)) return icono;
  }
  return '📋';
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [seccion, setSeccion] = useState('todas');
  const [page, setPage] = useState(1);

  const cargar = async (s = seccion, p = page) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50', page: String(p) });
      if (s !== 'todas') params.set('seccion', s);
      const r = await api.get('/logs?' + params.toString());
      setLogs(r.data.data || []);
      setTotal(r.data.total || 0);
    } catch { toast.error('Error cargando logs'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const cambiarSeccion = (s: string) => {
    setSeccion(s); setPage(1);
    cargar(s, 1);
  };

  const limpiar = async () => {
    if (!confirm('¿Eliminar logs de más de 90 días?')) return;
    try {
      await api.delete('/logs/limpiar');
      toast.success('Logs antiguos eliminados');
      cargar();
    } catch { toast.error('Error limpiando logs'); }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#EEF4F9' }}>
              <Activity className="w-5 h-5" style={{ color:'#2D5F8A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Logs de Actividad</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>{total} registros totales</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => cargar()} className="p-2 rounded-xl border" style={{ borderColor:'var(--border)', color:'var(--text-muted)', background:'var(--card)' }}>
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={limpiar} className="p-2 rounded-xl border" style={{ borderColor:'var(--border)', color:'#DC2626', background:'var(--card)' }}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {SECCIONES.map(s => (
            <button key={s} onClick={() => cambiarSeccion(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border"
              style={{
                background: seccion === s ? '#2D5F8A' : 'var(--card)',
                color: seccion === s ? 'white' : 'var(--text-secondary)',
                borderColor: seccion === s ? '#2D5F8A' : 'var(--border)',
              }}>
              {s}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="rounded-xl p-4 animate-pulse flex gap-3" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-lg shrink-0" style={{ background:'var(--sand-dark)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded w-1/3" style={{ background:'var(--sand-dark)' }} />
                  <div className="h-3 rounded w-2/3" style={{ background:'var(--sand-dark)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <Activity className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--text-muted)' }} />
            <div className="text-sm" style={{ color:'var(--text-muted)' }}>No hay actividad registrada aún</div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {logs.map(log => {
              const colores = SECCION_COLORS[log.seccion] || { bg:'#F5F5F5', color:'#6B7280' };
              return (
                <div key={log.id} className="rounded-xl p-3 flex items-start gap-3"
                  style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
                    style={{ background: colores.bg }}>
                    {getIcono(log.accion)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>{log.accion}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{ background: colores.bg, color: colores.color }}>
                        {log.seccion}
                      </span>
                    </div>
                    {log.detalle && <div className="text-xs mt-0.5 line-clamp-1" style={{ color:'var(--text-muted)' }}>{log.detalle}</div>}
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color:'var(--text-muted)' }}>
                      <span>👤 {log.usuario_nombre || 'Sistema'}</span>
                      <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix:true, locale:es })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {total > 50 && (
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => { const p = page - 1; setPage(p); cargar(seccion, p); }} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm border disabled:opacity-40"
              style={{ borderColor:'var(--border)', color:'var(--text-secondary)', background:'var(--card)' }}>
              ← Anterior
            </button>
            <span className="text-xs" style={{ color:'var(--text-muted)' }}>Página {page}</span>
            <button onClick={() => { const p = page + 1; setPage(p); cargar(seccion, p); }} disabled={page * 50 >= total}
              className="px-4 py-2 rounded-xl text-sm border disabled:opacity-40"
              style={{ borderColor:'var(--border)', color:'var(--text-secondary)', background:'var(--card)' }}>
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
