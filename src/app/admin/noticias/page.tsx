'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, noticiasAPI } from '../../../lib/api';
import { Plus, Trash2, Edit, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../../components/ImageUpload';
import RichEditor from '../../../components/RichEditor';

const FORM_INIT = { titulo: '', contenido: '', resumen: '', imagen_url: '', categoria: 'general', link_externo: '' };
const CATEGORIAS = ['general', 'seguridad', 'deportes', 'gobierno', 'cultura', 'economia', 'sociedad'];
const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => { noticiasAPI.getAll({ limit: 50 }).then(setNoticias); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

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
      setForm(FORM_INIT); setShowForm(false); setEditId(null); setPreview(false);
    } catch { toast.error('Error guardando noticia'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (n: any) => {
    setForm({ titulo: n.titulo, contenido: n.contenido || '', resumen: n.resumen || '', imagen_url: n.imagen_url || '', categoria: n.categoria, link_externo: n.link_externo || '' });
    setEditId(n.id); setShowForm(true); setPreview(false);
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
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); setPreview(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nueva noticia'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{editId ? 'Editar noticia' : 'Nueva noticia'}</h3>
              <button type="button" onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border bg-white transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {preview ? 'Editar' : 'Vista previa'}
              </button>
            </div>

            {preview ? (
              <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
                {form.imagen_url && <img src={form.imagen_url} alt="" className="w-full h-40 object-cover rounded-xl" />}
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--terracotta)' }}>{form.categoria}</div>
                <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{form.titulo || 'Sin título'}</h2>
                {form.resumen && <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>{form.resumen}</p>}
                <div className="text-sm leading-relaxed rich-editor" style={{ color: 'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{ __html: form.contenido || '<em>Sin contenido</em>' }} />
              </div>
            ) : (
              <>
                <ImageUpload value={form.imagen_url} onChange={v => set('imagen_url', v)} label="Imagen de la noticia" />
                <input type="text" placeholder="Título *" value={form.titulo} onChange={e => set('titulo', e.target.value)} className={inp} style={inpStyle} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Categoría</label>
                    <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inp} style={inpStyle}>
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Link externo / fuente</label>
                    <input type="url" placeholder="https://..." value={form.link_externo} onChange={e => set('link_externo', e.target.value)} className={inp} style={inpStyle} />
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Resumen breve</label>
                  <textarea placeholder="Resumen que aparece en la lista de noticias..." value={form.resumen} onChange={e => set('resumen', e.target.value)}
                    rows={2} className={inp + ' resize-none'} style={inpStyle} />
                </div>
                <div>
                  <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-secondary)' }}>Contenido completo *</label>
                  <RichEditor value={form.contenido} onChange={v => set('contenido', v)} placeholder="Escribe el contenido completo de la noticia..." height={280} />
                </div>
              </>
            )}

            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar noticia' : 'Publicar noticia'}
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
      </div>
    </MainLayout>
  );
}
