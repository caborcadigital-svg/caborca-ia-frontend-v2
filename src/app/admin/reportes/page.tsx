'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, reportesAPI } from '../../../lib/api';
import { AlertTriangle, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TIPO_COLORS: Record<string, string> = {
  accidente: '#DC2626', 'apagón': '#D97706', 'tráfico': '#EA580C',
  'retén': '#2563EB', seguridad: '#DC2626', 'promoción': '#16A34A',
  evento: '#7C3AED', calle_cerrada: '#D97706', otro: '#6B7280',
};

export default function AdminReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('pendiente');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (filtro === 'pendiente' ? adminAPI.getReportesPendientes() : reportesAPI.getAll())
      .then(setReportes).finally(() => setIsLoading(false));
  }, [filtro]);

  const manejar = async (id: string, estado: string) => {
    try {
      await adminAPI.actualizarReporte(id, estado);
      setReportes(prev => prev.filter(r => r.id !== id));
      toast.success(`Reporte ${estado}`);
    } catch { toast.error('Error actualizando'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FDF1EC' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#C4622D' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Moderación de Reportes</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Aprueba o rechaza reportes ciudadanos</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['pendiente', 'aprobado', 'rechazado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${filtro === f ? 'gradient-sunset text-white border-transparent shadow-sm' : 'bg-white'}`}
              style={filtro !== f ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : reportes.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay reportes {filtro}s</div>
          </div>
        ) : (
          <div className="space-y-2">
            {reportes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-start gap-3" style={{ borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold text-white capitalize"
                      style={{ backgroundColor: TIPO_COLORS[r.tipo] || '#6B7280' }}>
                      {r.tipo.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{r.descripcion}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📍 {r.ubicacion}</p>
                </div>
                {filtro === 'pendiente' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => manejar(r.id, 'aprobado')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 hover:bg-green-600 hover:text-white transition-all border border-green-100 text-green-600">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => manejar(r.id, 'rechazado')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-600 hover:text-white transition-all border border-red-100 text-red-500">
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
