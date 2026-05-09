'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Plus, X, Edit, Trash2, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../../components/ImageUpload';

const FORM_INIT = { titulo: '', subtitulo: '', imagen_url: '', link_url: '', color: '#E05C3A', activo: true, orden: 0 };
const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function AdminPublicidadPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { api.get('/publicidad').then(r => setItems(r.data)); }, []);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.titulo) { toast.error('Título requerido'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const { data } = await api.put(`/publicidad/${editId}`, form);
        setItems(prev => prev.map(i => i.id === editId ? data : i));
        toast.success('Banner actualizado');
      } else {
        const { data } = await api.post('/publicidad', form);
        setItems(prev => [...prev, data]);
        toast.success('Banner creado');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando banner'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (item: any) => {
    setForm({ titulo: item.titulo, subtitulo: item.subtitulo || '', imagen_url: item.imagen_url || '', link_url: item.link_url || '', color: item.color || '#E05C3A', activo: item.activo, orden: item.orden || 0 });
    setEditId(item.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este banner?')) return;
    try {
      await api.delete(`/publicidad/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Banner eliminado');
    } catch { toast.error('Error eliminando'); }
  };

  const toggleActivo = async (item: any) => {
    try {
      const { data } = await api.put(`/publicidad/${item.id}`, { ...item, activo: !item.activo });
      setItems(prev => prev.map(i => i.id === item.id ? data : i));
      toast.success(data.activo ? 'Banner activado' : 'Banner pausado');
    } catch { toast.error('Error actualizando'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Publicidad</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Banners rotativos en la página de inicio</p>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo banner'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{editId ? 'Editar banner' : 'Nuevo banner'}</h3>
            <ImageUpload value={form.imagen_url} onChange={v => set('imagen_url', v)} label="Imagen del banner (opcional)" />
            <input type="text" placeholder="Título del banner *" value={form.titulo} onChange={e => set('titulo', e.target.value)} className={inp} style={inpStyle} />
            <input type="text" placeholder="Subtítulo / descripción" value={form.subtitulo} onChange={e => set('subtitulo', e.target.value)} className={inp} style={inpStyle} />
            <input type="url" placeholder="URL al hacer click (opcional)" value={form.link_url} onChange={e => set('link_url', e.target.value)} className={inp} style={inpStyle} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Color del banner</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                    className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)' }} />
                  <input type="text" value={form.color} onChange={e => set('color', e.target.value)} className={inp} style={inpStyle} />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Orden</label>
                <input type="number" min="0" value={form.orden} onChange={e => set('orden', parseInt(e.target.value))} className={inp} style={inpStyle} />
              </div>
            </div>
            <div className="p-3 rounded-xl border" style={{ borderColor: form.color + '40', background: form.color + '10' }}>
              <div className="text-xs font-bold" style={{ color: form.color }}>{form.titulo || 'Vista previa del banner'}</div>
              {form.subtitulo && <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{form.subtitulo}</div>}
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar banner' : 'Crear banner'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {items.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border shadow-sm text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              No hay banners publicitarios
            </div>
          )}
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3 ${!item.activo ? 'opacity-60' : ''}`}
              style={{ borderColor: item.color + '30' }}>
              {item.imagen_url && <img src={item.imagen_url} alt={item.titulo} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Megaphone className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
                  <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{item.titulo}</div>
                </div>
                {item.subtitulo && <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.subtitulo}</div>}
                <div className="text-xs mt-1" style={{ color: item.activo ? '#16a34a' : '#999' }}>
                  {item.activo ? '● Activo' : '○ Pausado'}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => toggleActivo(item)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all text-xs font-bold"
                  style={{ background: item.activo ? '#f0fdf4' : '#f9f9f9', borderColor: item.activo ? '#86efac' : '#E0E0E0', color: item.activo ? '#16a34a' : '#999' }}>
                  {item.activo ? '●' : '○'}
                </button>
                <button onClick={() => handleEdit(item)}
                  className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center border border-red-100">
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
