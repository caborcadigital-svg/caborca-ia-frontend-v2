'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, eventosAPI } from '../../../lib/api';
import { Plus, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FORM_INIT = {
  nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '',
  lugar: '', imagen_url: '', categoria: 'general', link_externo: '',
};
const CATEGORIAS = ['general', 'deportes', 'cultura', 'musica', 'feria', 'gobierno', 'otro'];

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    eventosAPI.getAll().then(setEventos);
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre || !form.fecha_inicio) { toast.error('Nombre y fecha inicio son requeridos'); return; }
    setIsSaving(true);
    try {
      const nuevo = await adminAPI.crearEvento(form);
      setEventos(prev => [nuevo, ...prev]);
      setForm(FORM_INIT);
      setShowForm(false);
      toast.success('Evento creado');
    } catch { toast.error('Error creando evento'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return;
    try {
      await adminAPI.eliminarEvento(id);
      setEventos(prev => prev.filter(e => e.id !== id));
      toast.success('Evento eliminado');
    } catch { toast.error('Error eliminando evento'); }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-white">Gestionar Eventos</h1>
          <button onClick={() => { setShowForm(!showForm); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo evento'}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
            <h3 className="font-semibold text-white">Nuevo evento</h3>
            <input type="text" placeholder="Nombre del evento *" value={form.nombre} onChange={e => set('nombre', e.target.value)}
              className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fecha inicio *</label>
                <input type="datetime-local" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fecha fin (opcional)</label>
                <input type="datetime-local" value={form.fecha_fin} onChange={e => set('fecha_fin', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Lugar / Venue" value={form.lugar} onChange={e => set('lugar', e.target.value)}
                className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500">
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea placeholder="Descripción del evento" value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
              rows={3} className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 resize-none placeholder:text-slate-500" />
            <div className="grid grid-cols-2 gap-4">
              <input type="url" placeholder="URL imagen (opcional)" value={form.imagen_url} onChange={e => set('imagen_url', e.target.value)}
                className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
              <input type="url" placeholder="Link externo (opcional)" value={form.link_externo} onChange={e => set('link_externo', e.target.value)}
                className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-brand text-white font-medium text-sm disabled:opacity-50">
              {isSaving ? 'Guardando...' : 'Crear evento'}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {eventos.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-slate-400">No hay eventos registrados</div>
          )}
          {eventos.map(e => (
            <div key={e.id} className="glass rounded-2xl p-4 flex items-center gap-4">
              {e.imagen_url && <img src={e.imagen_url} alt={e.nombre} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-emerald-400 font-medium mb-1">{e.categoria}</div>
                <div className="text-white font-semibold text-sm">{e.nombre}</div>
                <div className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                  <span>{new Date(e.fecha_inicio).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {e.lugar && <span>· {e.lugar}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(e.id)}
                className="w-8 h-8 rounded-xl glass text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
