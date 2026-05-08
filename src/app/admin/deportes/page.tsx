'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, deportesAPI } from '../../../lib/api';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FORM_INIT = { deporte: 'beisbol', liga: '', equipo_local: '', equipo_visitante: '', marcador_local: '', marcador_visitante: '', fecha: '', lugar: '', estado: 'programado' };
const DEPORTES = ['beisbol', 'futbol', 'basquetbol', 'softbol', 'otro'];
const ESTADOS = ['programado', 'en_curso', 'finalizado', 'cancelado'];
const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function AdminDeportesPage() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { deportesAPI.getPartidos().then(setPartidos); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.equipo_local || !form.equipo_visitante || !form.fecha) {
      toast.error('Equipos y fecha requeridos'); return;
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

  const handleEdit = (p: any) => {
    setForm({ deporte: p.deporte, liga: p.liga || '', equipo_local: p.equipo_local, equipo_visitante: p.equipo_visitante, marcador_local: p.marcador_local ?? '', marcador_visitante: p.marcador_visitante ?? '', fecha: p.fecha?.slice(0, 16) || '', lugar: p.lugar || '', estado: p.estado });
    setEditId(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este partido?')) return;
    try {
      await adminAPI.actualizarPartido(id, { estado: 'cancelado' });
      setPartidos(prev => prev.filter(p => p.id !== id));
      toast.success('Partido eliminado');
    } catch { toast.error('Error eliminando'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Gestionar Deportes</h1>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo partido'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{editId ? 'Editar partido' : 'Nuevo partido'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Deporte</label>
                <select value={form.deporte} onChange={e => set('deporte', e.target.value)} className={inp} style={inpStyle}>
                  {DEPORTES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Liga / Torneo</label>
                <input type="text" placeholder="Liga FG" value={form.liga} onChange={e => set('liga', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Equipo local *</label>
                <input type="text" value={form.equipo_local} onChange={e => set('equipo_local', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Marc. L</label>
                  <input type="number" min="0" value={form.marcador_local} onChange={e => set('marcador_local', e.target.value)} className={inp + ' text-center'} style={inpStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Marc. V</label>
                  <input type="number" min="0" value={form.marcador_visitante} onChange={e => set('marcador_visitante', e.target.value)} className={inp + ' text-center'} style={inpStyle} />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Equipo visitante *</label>
                <input type="text" value={form.equipo_visitante} onChange={e => set('equipo_visitante', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Fecha y hora *</label>
                <input type="datetime-local" value={form.fecha} onChange={e => set('fecha', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Lugar</label>
                <input type="text" placeholder="Campo/Estadio" value={form.lugar} onChange={e => set('lugar', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Estado</label>
                <select value={form.estado} onChange={e => set('estado', e.target.value)} className={inp} style={inpStyle}>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar partido' : 'Registrar partido'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {partidos.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--terracotta)' }}>{p.liga} · {p.deporte}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: p.estado === 'finalizado' ? 'var(--text-muted)' : p.estado === 'en_curso' ? '#16a34a' : 'var(--terracotta)', background: p.estado === 'finalizado' ? '#f3f4f6' : p.estado === 'en_curso' ? '#f0fdf4' : '#fef0ec' }}>
                    {p.estado}
                  </span>
                  <button onClick={() => handleEdit(p)}
                    className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100">
                    <Edit className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center border border-red-100">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.equipo_local}</span>
                <span className="font-display font-bold text-xl mx-4" style={{ color: 'var(--desert-blue)' }}>
                  {p.marcador_local ?? '-'} - {p.marcador_visitante ?? '-'}
                </span>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.equipo_visitante}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
