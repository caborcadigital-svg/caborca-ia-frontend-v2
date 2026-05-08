'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, noticiasAPI } from '../../../lib/api';
import { Plus, Trash2, Edit, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const FORM_INIT = { titulo: '', contenido: '', resumen: '', imagen_url: '', categoria: 'general', link_externo: '' };
const CATEGORIAS = ['general', 'seguridad', 'deportes', 'gobierno', 'cultura', 'economia'];

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    noticiasAPI.getAll({ limit: 50 }).then(setNoticias);
  }, []);

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
      setForm(FORM_INIT);
      setShowForm(false);
      setEditId(null);
    } catch { toast.error('Error guardando noticia'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (n: any) => {
    setForm({ titulo: n.titulo, contenido: n.contenido || '', resumen: n.resumen || '', imagen_url: n.imagen_url || '', categoria: n.categoria, link_externo: n.link_externo || '' });
    setEditId(n.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    try {
      await adminAPI.eliminarNoticia(id);
      setNoticias(prev => prev.filter(n => n.id !== id));
      toast.success('Noticia eliminada');
    } catch { toast.error('Error eliminando noticia'); }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-white">Gestionar Noticias</h1>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-medium">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nueva noticia'}
          </button>
        </div>

        {showForm && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
            <h3 className="font-semibold text-white">{editId ? 'Editar noticia' : 'Nueva noticia'}</h3>
            <input type="text" placeholder="Título *" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
            <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500">
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea placeholder="Resumen breve" value={form.resumen} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
              rows={2} className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 resize-none placeholder:text-slate-500" />
            <textarea placeholder="Contenido completo *" value={form.contenido} onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
              rows={6} className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 resize-none placeholder:text-slate-500" />
            <input type="url" placeholder="URL de imagen (opcional)" value={form.imagen_url} onChange={e => setForm(f => ({ ...f, imagen_url: e.target.value }))}
              className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
            <input type="url" placeholder="Link externo / fuente (opcional)" value={form.link_externo} onChange={e => setForm(f => ({ ...f, link_externo: e.target.value }))}
              className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-brand text-white font-medium text-sm disabled:opacity-50">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar noticia' : 'Publicar noticia'}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {noticias.map(n => (
            <div key={n.id} className="glass rounded-2xl p-4 flex items-start gap-4">
              {n.imagen_url && <img src={n.imagen_url} alt={n.titulo} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-brand-400 font-medium mb-1">{n.categoria}</div>
                <div className="text-white font-semibold text-sm line-clamp-1">{n.titulo}</div>
                <div className="text-slate-400 text-xs mt-1">{new Date(n.created_at).toLocaleDateString('es-MX')}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(n)} className="w-8 h-8 rounded-xl glass text-brand-400 hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(n.id)} className="w-8 h-8 rounded-xl glass text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
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
