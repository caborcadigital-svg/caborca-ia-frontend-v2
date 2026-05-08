'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../../components/ImageUpload';

const FORM_INIT = { nombre: '', categoria: 'restaurante', descripcion: '', direccion: '', telefono: '', horario: '', imagen_url: '' };
const CATEGORIAS = ['restaurante', 'farmacia', 'tienda', 'servicio', 'café', 'taqueria', 'supermercado', 'banco', 'hotel', 'otro'];
const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function AdminNegociosPage() {
  const [negocios, setNegocios] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/negocios').then(r => setNegocios(r.data)).finally(() => setIsLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre) { toast.error('Nombre requerido'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const { data } = await api.put(`/admin/negocios/${editId}`, form);
        setNegocios(prev => prev.map(n => n.id === editId ? data : n));
        toast.success('Negocio actualizado');
      } else {
        const { data } = await api.post('/admin/negocios', form);
        setNegocios(prev => [data, ...prev]);
        toast.success('Negocio creado');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando negocio'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (n: any) => {
    setForm({ nombre: n.nombre, categoria: n.categoria || 'restaurante', descripcion: n.descripcion || '', direccion: n.direccion || '', telefono: n.telefono || '', horario: n.horario || '', imagen_url: n.imagen_url || '' });
    setEditId(n.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este negocio?')) return;
    try {
      await api.delete(`/admin/negocios/${id}`);
      setNegocios(prev => prev.filter(n => n.id !== id));
      toast.success('Negocio eliminado');
    } catch { toast.error('Error eliminando negocio'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Gestionar Negocios</h1>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo negocio'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{editId ? 'Editar negocio' : 'Nuevo negocio'}</h3>

            <ImageUpload value={form.imagen_url} onChange={v => set('imagen_url', v)} label="Foto del negocio" />

            <input type="text" placeholder="Nombre del negocio *" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inp} style={inpStyle} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Categoría</label>
                <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inp} style={inpStyle}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Teléfono</label>
                <input type="tel" placeholder="638 000 0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>

            <input type="text" placeholder="Dirección" value={form.direccion} onChange={e => set('direccion', e.target.value)} className={inp} style={inpStyle} />
            <input type="text" placeholder="Horario (ej: Lun-Vie 9am-8pm)" value={form.horario} onChange={e => set('horario', e.target.value)} className={inp} style={inpStyle} />
            <textarea placeholder="Descripción breve" value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
              rows={3} className={inp + ' resize-none'} style={inpStyle} />

            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar negocio' : 'Crear negocio'}
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : negocios.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay negocios registrados. Agrega el primero.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {negocios.map(n => (
              <div key={n.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
                {n.imagen_url && <img src={n.imagen_url} alt={n.nombre} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold capitalize mb-0.5" style={{ color: '#2D5F8A' }}>{n.categoria}</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{n.nombre}</div>
                  {n.direccion && <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>📍 {n.direccion}</div>}
                  {n.telefono && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>📞 {n.telefono}</div>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(n)}
                    className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(n.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center border border-red-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
