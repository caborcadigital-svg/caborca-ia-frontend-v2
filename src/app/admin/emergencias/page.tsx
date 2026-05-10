'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { AlertCircle, Plus, X, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TIPOS = ['ambulancia','hospital','policia','bomberos','cruz_roja','proteccion_civil','imss','issste','gas','luz','agua','vialidad','dif','otro'];
const CATEGORIAS = ['emergencia','salud','seguridad','servicios','gobierno'];
const FORM_INIT = { nombre:'', tipo:'hospital', categoria:'salud', telefono:'', telefono2:'', descripcion:'', direccion:'', activo:true };

export default function AdminEmergenciasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(FORM_INIT);
  const [editId, setEditId] = useState<string|null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    api.get('/emergencias/admin').then(r => setItems(r.data)).catch(() => toast.error('Error cargando'));
  };

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre || !form.telefono) { toast.error('Nombre y teléfono requeridos'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const r = await api.put('/emergencias/' + editId, form);
        setItems(prev => prev.map(i => i.id === editId ? r.data : i));
        toast.success('Actualizado');
      } else {
        const r = await api.post('/emergencias', form);
        setItems(prev => [r.data, ...prev]);
        toast.success('Creado');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (item: any) => {
    setForm({ nombre:item.nombre, tipo:item.tipo, categoria:item.categoria, telefono:item.telefono, telefono2:item.telefono2||'', descripcion:item.descripcion||'', direccion:item.direccion||'', activo:item.activo });
    setEditId(item.id); setShowForm(true);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    try { await api.delete('/emergencias/' + id); setItems(prev => prev.filter(i => i.id !== id)); toast.success('Eliminado'); }
    catch { toast.error('Error eliminando'); }
  };

  const toggleActivo = async (item: any) => {
    try {
      await api.put('/emergencias/' + item.id, { ...item, activo: !item.activo });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i));
    } catch { toast.error('Error actualizando'); }
  };

  const inp = "input-field";

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#FEF2F2' }}>
              <AlertCircle className="w-5 h-5" style={{ color:'#DC2626' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Directorio de Emergencias</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>{items.filter(i => i.activo).length} servicios activos</p>
            </div>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Agregar'}
          </button>
        </div>

        {showForm && (
          <div className="rounded-2xl p-5 border shadow-sm space-y-4 animate-slide-up" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{editId ? 'Editar servicio' : 'Nuevo servicio de emergencias'}</h3>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Nombre del servicio *</label>
              <input type="text" placeholder="Cruz Roja Caborca" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inp} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Tipo</label>
                <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className={inp}>
                  {TIPOS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Categoría</label>
                <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inp}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Teléfono principal *</label>
                <input type="tel" placeholder="6376370000" value={form.telefono} onChange={e => set('telefono', e.target.value)} className={inp} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Teléfono 2 (opcional)</label>
                <input type="tel" placeholder="6376370001" value={form.telefono2} onChange={e => set('telefono2', e.target.value)} className={inp} />
              </div>
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Dirección (opcional)</label>
              <input type="text" placeholder="Blvd. Luis Donaldo Colosio..." value={form.direccion} onChange={e => set('direccion', e.target.value)} className={inp} />
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Descripción (opcional)</label>
              <input type="text" placeholder="Urgencias 24 horas" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} className={inp} />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => set('activo', !form.activo)} className="flex items-center gap-2 text-sm font-medium" style={{ color: form.activo ? '#16A34A' : 'var(--text-muted)' }}>
                {form.activo ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                {form.activo ? 'Visible al público' : 'Oculto'}
              </button>
            </div>

            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar' : 'Crear servicio'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="rounded-2xl p-10 text-center text-sm" style={{ background:'var(--card)', border:'1px solid var(--border)', color:'var(--text-muted)' }}>
              No hay servicios registrados. Agrega el primero.
            </div>
          ) : items.map(item => (
            <div key={item.id} className={'rounded-2xl p-4 flex items-center gap-3 shadow-sm ' + (!item.activo ? 'opacity-50' : '')}
              style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <div className="text-2xl shrink-0">{{'ambulancia':'🚑','hospital':'🏥','policia':'👮','bomberos':'🚒','cruz_roja':'🩺','proteccion_civil':'🦺','imss':'🏨','issste':'🏨','gas':'⚠️','luz':'⚡','agua':'💧','vialidad':'🚦','dif':'🤝','otro':'📞'}[item.tipo] || '📞'}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{item.nombre}</div>
                <div className="text-xs mt-0.5 capitalize" style={{ color:'var(--text-muted)' }}>{item.categoria} · {item.telefono}{item.telefono2 ? ' / ' + item.telefono2 : ''}</div>
                {item.descripcion && <div className="text-xs" style={{ color:'var(--text-muted)' }}>{item.descripcion}</div>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => toggleActivo(item)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
                  style={{ borderColor:'var(--border)', color: item.activo ? '#16A34A' : 'var(--text-muted)', background:'var(--card)' }}
                  title={item.activo ? 'Desactivar' : 'Activar'}>
                  {item.activo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:bg-blue-50 hover:border-blue-200"
                  style={{ borderColor:'var(--border)', color:'var(--text-muted)' }}>
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                  style={{ borderColor:'var(--border)', color:'var(--text-muted)' }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
