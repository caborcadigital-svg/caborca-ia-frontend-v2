'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { reportesAPI } from '../lib/api';
import { AlertTriangle, Plus, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TIPOS = ['accidente', 'apagón', 'tráfico', 'retén', 'seguridad', 'promoción', 'evento', 'calle_cerrada', 'otro'];
const TIPO_COLORS: Record<string, string> = {
  accidente: '#DC2626', 'apagón': '#D97706', 'tráfico': '#EA580C',
  'retén': '#2563EB', seguridad: '#DC2626', 'promoción': '#16A34A',
  evento: '#7C3AED', calle_cerrada: '#D97706', otro: '#6B7280',
};

export default function ReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: 'accidente', descripcion: '', ubicacion: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { reportesAPI.getAll().then(setReportes).finally(() => setIsLoading(false)); }, []);

  const handleSubmit = async () => {
    if (!form.descripcion.trim() || !form.ubicacion.trim()) { toast.error('Descripción y ubicación son requeridas'); return; }
    setIsSubmitting(true);
    try {
      await reportesAPI.crear(form);
      toast.success('Reporte enviado. Será revisado por un moderador.');
      setShowForm(false);
      setForm({ tipo: 'accidente', descripcion: '', ubicacion: '' });
    } catch { toast.error('Error al enviar reporte'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FDF1EC' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#C4622D' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Reportes Ciudadanos</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Incidencias activas en Caborca</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Nuevo reporte ciudadano</h3>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS.map(tipo => (
                <button key={tipo} onClick={() => setForm(f => ({ ...f, tipo }))}
                  className={`px-2 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${form.tipo === tipo ? 'gradient-sunset text-white border-transparent' : 'bg-gray-50'}`}
                  style={form.tipo !== tipo ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
                  {tipo.replace('_', ' ')}
                </button>
              ))}
            </div>
            <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              placeholder="Describe brevemente lo que ocurre..." rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border resize-none bg-white"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <input type="text" value={form.ubicacion} onChange={e => setForm(f => ({ ...f, ubicacion: e.target.value }))}
              placeholder="Ej: Av. Obregón y Calle 6" className="w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
            </button>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Los reportes son revisados antes de publicarse</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : reportes.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay reportes activos en este momento</div>
          </div>
        ) : (
          <div className="space-y-3">
            {reportes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize text-white"
                    style={{ backgroundColor: TIPO_COLORS[r.tipo] || '#6B7280' }}>
                    {r.tipo.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                  </span>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--text-primary)' }}>{r.descripcion}</p>
                <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>📍 {r.ubicacion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
