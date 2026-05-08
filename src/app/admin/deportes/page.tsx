'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, deportesAPI } from '../../../lib/api';
import { Plus, X, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const FORM_INIT = {
  deporte: 'beisbol', liga: '', equipo_local: '', equipo_visitante: '',
  marcador_local: '', marcador_visitante: '', fecha: '', lugar: '', estado: 'programado'
};

const DEPORTES = ['beisbol', 'futbol', 'basquetbol', 'softbol', 'otro'];
const ESTADOS = ['programado', 'en_curso', 'finalizado', 'cancelado'];

export default function AdminDeportesPage() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    deportesAPI.getPartidos().then(setPartidos);
  }, []);

  const handleSave = async () => {
    if (!form.equipo_local || !form.equipo_visitante || !form.fecha) {
      toast.error('Equipos y fecha son requeridos'); return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        marcador_local: form.marcador_local !== '' ? parseInt(form.marcador_local) : null,
        marcador_visitante: form.marcador_visitante !== '' ? parseInt(form.marcador_visitante) : null,
      };
      if (editId) {
        const updated = await adminAPI.actualizarPartido(editId, payload);
        setPartidos(prev => prev.map(p => p.id === editId ? updated : p));
        toast.success('Partido actualizado');
      } else {
        const nuevo = await adminAPI.crearPartido(payload);
        setPartidos(prev => [nuevo, ...prev]);
        toast.success('Partido registrado');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando partido'); }
    finally { setIsSaving(false); }
  };

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-white">Gestionar Deportes</h1>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo partido'}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
            <h3 className="font-semibold text-white">{editId ? 'Editar partido' : 'Nuevo partido'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Deporte</label>
                <select value={form.deporte} onChange={e => set('deporte', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500">
                  {DEPORTES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Liga / Torneo</label>
                <input type="text" placeholder="Ej: Liga FG" value={form.liga} onChange={e => set('liga', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Equipo local *</label>
                <input type="text" value={form.equipo_local} onChange={e => set('equipo_local', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Marcador L</label>
                  <input type="number" min="0" value={form.marcador_local} onChange={e => set('marcador_local', e.target.value)}
                    className="w-full bg-surface-800 border border-surface-600 rounded-xl px-3 py-3 text-white text-sm text-center outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Marcador V</label>
                  <input type="number" min="0" value={form.marcador_visitante} onChange={e => set('marcador_visitante', e.target.value)}
                    className="w-full bg-surface-800 border border-surface-600 rounded-xl px-3 py-3 text-white text-sm text-center outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Equipo visitante *</label>
                <input type="text" value={form.equipo_visitante} onChange={e => set('equipo_visitante', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fecha y hora *</label>
                <input type="datetime-local" value={form.fecha} onChange={e => set('fecha', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Lugar</label>
                <input type="text" placeholder="Campo/Estadio" value={form.lugar} onChange={e => set('lugar', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Estado</label>
                <select value={form.estado} onChange={e => set('estado', e.target.value)}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500">
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-brand text-white font-medium text-sm disabled:opacity-50">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar partido' : 'Registrar partido'}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {partidos.map(p => (
            <div key={p.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-brand-400">{p.liga} · {p.deporte}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.estado === 'finalizado' ? 'text-slate-400 bg-slate-400/10' :
                    p.estado === 'en_curso' ? 'text-green-400 bg-green-400/10' : 'text-brand-400 bg-brand-400/10'
                  }`}>{p.estado}</span>
                  <button onClick={() => {
                    setForm({ deporte: p.deporte, liga: p.liga || '', equipo_local: p.equipo_local, equipo_visitante: p.equipo_visitante,
                      marcador_local: p.marcador_local ?? '', marcador_visitante: p.marcador_visitante ?? '',
                      fecha: p.fecha?.slice(0, 16) || '', lugar: p.lugar || '', estado: p.estado });
                    setEditId(p.id); setShowForm(true);
                  }} className="w-7 h-7 rounded-lg glass text-brand-400 hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center">
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{p.equipo_local}</span>
                <span className="font-display font-bold text-xl text-white mx-4">
                  {p.marcador_local ?? '-'} - {p.marcador_visitante ?? '-'}
                </span>
                <span className="font-semibold text-white">{p.equipo_visitante}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
