'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, eventosAPI } from '../../../lib/api';
import { Plus, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FORM_INIT = { nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', lugar: '', imagen_url: '', categoria: 'general', link_externo: '' };
const CATEGORIAS = ['general', 'deportes', 'cultura', 'musica', 'feria', 'gobierno', 'otro'];
const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { eventosAPI.getAll({ limit: 50 }).then(setEventos); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre || !form.fecha_inicio) { toast.error('Nombre y fecha inicio requeridos'); return; }
    setIsSaving(true);
    try {
      const nuevo = await adminAPI.crearEvento(form);
      setEventos(prev => [nuevo, ...prev]);
      setForm(FORM_INIT); setShowForm(false);
      toast.success('Evento creado');
    } catch { toast.error('Error creando evento'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return;
    try { await adminAPI.eliminarEvento(id); setEventos(prev => prev.filter(e => e.id !== id)); toast.success('Eliminado'); }
    catch { toast.error('Error eliminando'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Gestionar Eventos</h1>
          <button onClick={() => { setShowForm(!showForm); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo evento'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <input type="text" placeholder="Nombre del evento *" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inp} style={inpStyle} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Fecha inicio *</label>
                <input type="datetime-local" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Fecha fin</label>
                <input type="datetime-local" value={form.fecha_fin} onChange={e => set('fecha_fin', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Lugar / Venue" value={form.lugar} onChange={e => set('lugar', e.target.value)} className={inp} style={inpStyle} />
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inp} style={inpStyle}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea placeholder="Descripción" value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
              rows={3} className={inp + ' resize-none'} style={inpStyle} />
            <div className="grid grid-cols-2 gap-3">
              <input type="url" placeholder="URL imagen" value={form.imagen_url} onChange={e => set('imagen_url', e.target.value)} className={inp} style={inpStyle} />
              <input type="url" placeholder="Link externo" value={form.link_externo} onChange={e => set('link_externo', e.target.value)} className={inp} style={inpStyle} />
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : 'Crear evento'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {eventos.length === 0 && <div className="bg-white rounded-2xl p-8 text-center border shadow-sm text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>No hay eventos registrados</div>}
          {eventos.map(e => (
            <div key={e.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
              {e.imagen_url && <img src={e.imagen_url} alt={e.nombre} className="w-12 h-12 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-0.5" style={{ color: '#4A7C59' }}>{e.categoria}</div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{e.nombre}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {new Date(e.fecha_inicio).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  {e.lugar && ` · ${e.lugar}`}
                </div>
              </div>
              <button onClick={() => handleDelete(e.id)}
                className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center border border-red-100 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
