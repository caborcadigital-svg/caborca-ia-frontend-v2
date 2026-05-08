'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, noticiasAPI } from '../../../lib/api';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../../components/ImageUpload';

const FORM_INIT = { titulo: '', contenido: '', resumen: '', imagen_url: '', categoria: 'general', link_externo: '' };
const CATEGORIAS = ['general', 'seguridad', 'deportes', 'gobierno', 'cultura', 'economia'];
const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { noticiasAPI.getAll({ limit: 50 }).then(setNoticias); }, []);

  const handleSave = async () => {
    if (!form.titulo || !form.contenido) { toast.error('Título y contenido requeridos'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const updated = await adminAPI.actualizarNoticia(editId, form);
        setNoticias(prev => prev.map(n => n.id === editId ? updated : n));
        toast.success('Noticia actualizada');
      } else {
        const nueva = await adminAPI.crearNoticia(form);
        setNoticias(prev => [nueva, ...prev]);
        toast.success('Noticia publicada');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando noticia'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (n: any) => {
    setForm({ titulo: n.titulo, contenido: n.contenido || '', resumen: n.resumen || '', imagen_url: n.imagen_url || '', categoria: n.categoria, link_externo: n.link_externo || '' });
    setEditId(n.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    try { await adminAPI.eliminarNoticia(id); setNoticias(prev => prev.filter(n => n.id !== id)); toast.success('Eliminada'); }
    catch { toast.error('Error eliminando'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Gestionar Noticias</h1>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nueva noticia'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{editId ? 'Editar noticia' : 'Nueva noticia'}</h3>
            <ImageUpload value={form.imagen_url} onChange={v => setForm(f => ({ ...f, imagen_url: v }))} label="Imagen de la noticia" />
            <input type="text" placeholder="Título *" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} className={inp} style={inpStyle} />
            <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className={inp} style={inpStyle}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea placeholder="Resumen breve" value={form.resumen} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
              rows={2} className={inp + ' resize-none'} style={inpStyle} />
            <textarea placeholder="Contenido completo *" value={form.contenido} onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
              rows={6} className={inp + ' resize-none'} style={inpStyle} />
            <input type="url" placeholder="Link externo / fuente (opcional)" value={form.link_externo} onChange={e => setForm(f => ({ ...f, link_externo: e.target.value }))} className={inp} style={inpStyle} />
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar' : 'Publicar noticia'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          {noticias.map(n => (
            <div key={n.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-start gap-3" style={{ borderColor: 'var(--border)' }}>
              {n.imagen_url && <img src={n.imagen_url} alt={n.titulo} className="w-12 h-12 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--terracotta)' }}>{n.categoria}</div>
                <div className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{n.titulo}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleDateString('es-MX')}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(n)} className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(n.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center border border-red-100">
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
