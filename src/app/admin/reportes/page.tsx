'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI } from '../../../lib/api';
import { AlertTriangle, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TIPO_COLORS: Record<string, string> = {
  accidente: 'text-red-400',
  'apagón': 'text-yellow-400',
  'tráfico': 'text-orange-400',
  'retén': 'text-blue-400',
  seguridad: 'text-red-500',
  'promoción': 'text-green-400',
  evento: 'text-purple-400',
  calle_cerrada: 'text-amber-400',
  otro: 'text-slate-400',
};

export default function AdminReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('pendiente');
  const [isLoading, setIsLoading] = useState(true);

  const cargar = (estado: string) => {
    setIsLoading(true);
    (estado === 'pendiente' ? adminAPI.getReportesPendientes() : import('../../../lib/api').then(m => m.reportesAPI.getAll()))
      .then(setReportes)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { cargar(filtro); }, [filtro]);

  const manejar = async (id: string, estado: string) => {
    try {
      await adminAPI.actualizarReporte(id, estado);
      setReportes(prev => prev.filter(r => r.id !== id));
      toast.success(`Reporte ${estado}`);
    } catch { toast.error('Error actualizando reporte'); }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Moderación de Reportes</h1>
            <p className="text-slate-400 text-sm">Aprueba o rechaza reportes ciudadanos</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['pendiente', 'aprobado', 'rechazado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filtro === f ? 'bg-amber-600 text-white' : 'glass text-slate-400 hover:text-white'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-surface-700 rounded w-1/4 mb-3" />
                <div className="h-4 bg-surface-700 rounded w-full mb-2" />
                <div className="h-3 bg-surface-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : reportes.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400">No hay reportes {filtro}s</div>
          </div>
        ) : (
          <div className="space-y-3">
            {reportes.map(r => (
              <div key={r.id} className="glass rounded-2xl p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase ${TIPO_COLORS[r.tipo] || 'text-slate-400'}`}>
                      {r.tipo.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{r.descripcion}</p>
                  <p className="text-slate-400 text-xs mt-2">📍 {r.ubicacion}</p>
                </div>
                {filtro === 'pendiente' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => manejar(r.id, 'aprobado')}
                      className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center" title="Aprobar">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => manejar(r.id, 'rechazado')}
                      className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center" title="Rechazar">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
