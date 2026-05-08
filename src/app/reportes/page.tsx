'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { reportesAPI } from '../../lib/api';
import { AlertTriangle, Plus, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TIPOS = ['accidente', 'apagón', 'tráfico', 'retén', 'seguridad', 'promoción', 'evento', 'calle_cerrada', 'otro'];

const TIPO_COLORS: Record<string, string> = {
  accidente: 'text-red-400 bg-red-400/10',
  'apagón': 'text-yellow-400 bg-yellow-400/10',
  'tráfico': 'text-orange-400 bg-orange-400/10',
  'retén': 'text-blue-400 bg-blue-400/10',
  seguridad: 'text-red-500 bg-red-500/10',
  'promoción': 'text-green-400 bg-green-400/10',
  evento: 'text-purple-400 bg-purple-400/10',
  calle_cerrada: 'text-amber-400 bg-amber-400/10',
  otro: 'text-slate-400 bg-slate-400/10',
};

export default function ReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: 'accidente', descripcion: '', ubicacion: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportesAPI.getAll().then(setReportes).finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.descripcion.trim() || !form.ubicacion.trim()) {
      toast.error('Descripción y ubicación son requeridas');
      return;
    }
    setIsSubmitting(true);
    try {
      await reportesAPI.crear(form);
      toast.success('Reporte enviado. Será revisado por un moderador.');
      setShowForm(false);
      setForm({ tipo: 'accidente', descripcion: '', ubicacion: '' });
    } catch {
      toast.error('Error al enviar reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Reportes Ciudadanos</h1>
              <p className="text-slate-400 text-sm">Incidencias activas en Caborca</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo reporte'}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
            <h3 className="font-semibold text-white">Nuevo reporte ciudadano</h3>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Tipo de reporte</label>
              <div className="grid grid-cols-3 gap-2">
                {TIPOS.map(tipo => (
                  <button key={tipo} onClick={() => setForm(f => ({ ...f, tipo }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                      form.tipo === tipo ? 'gradient-brand text-white' : 'glass text-slate-400 hover:text-white'
                    }`}>
                    {tipo.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Describe brevemente lo que está ocurriendo..."
                rows={3}
                className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 resize-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block">Ubicación</label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={e => setForm(f => ({ ...f, ubicacion: e.target.value }))}
                placeholder="Ej: Av. Obregón y Calle 6, frente al OXXO"
                className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500"
              />
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting}
              className="w-full py-3 rounded-xl gradient-brand text-white font-medium text-sm disabled:opacity-50">
              {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
            </button>
            <p className="text-xs text-slate-500 text-center">Los reportes son revisados antes de publicarse</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-surface-700 rounded w-1/4 mb-3" />
                <div className="h-3 bg-surface-700 rounded w-full mb-2" />
                <div className="h-3 bg-surface-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : reportes.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400">No hay reportes activos en este momento</div>
          </div>
        ) : (
          <div className="space-y-3">
            {reportes.map(r => (
              <div key={r.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${TIPO_COLORS[r.tipo] || TIPO_COLORS.otro}`}>
                    {r.tipo.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                  </span>
                </div>
                <p className="text-white text-sm mt-3">{r.descripcion}</p>
                <p className="text-slate-400 text-xs mt-2">📍 {r.ubicacion}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
