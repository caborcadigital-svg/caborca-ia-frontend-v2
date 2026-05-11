'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Brain, Plus, X, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIAS = [
  { value:'geografia', label:'🗺️ Geografía', color:'#2D5F8A' },
  { value:'historia', label:'📜 Historia', color:'#6B3FA0' },
  { value:'servicios', label:'🏥 Servicios', color:'#DC2626' },
  { value:'restaurantes', label:'🍽️ Restaurantes', color:'#E8823A' },
  { value:'farmacias', label:'💊 Farmacias', color:'#16A34A' },
  { value:'supermercados', label:'🛒 Supermercados', color:'#0284C7' },
  { value:'tramites', label:'📋 Trámites', color:'#7C3AED' },
  { value:'deportes', label:'🏆 Deportes', color:'#EA580C' },
  { value:'eventos', label:'📅 Eventos', color:'#4A7C59' },
  { value:'lugares', label:'📍 Lugares', color:'#C4622D' },
  { value:'datos_generales', label:'ℹ️ Datos generales', color:'#1E3A5F' },
  { value:'otro', label:'💡 Otro', color:'#6B7280' },
];

const FORM_INIT = { categoria:'servicios', titulo:'', contenido:'', tags:'', prioridad:5, activo:true };

export default function AdminConocimientoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(FORM_INIT);
  const [editId, setEditId] = useState<string|null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    api.get('/conocimiento').then(r => setItems(r.data)).catch(() => toast.error('Error cargando'));
  };

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.titulo || !form.contenido || !form.categoria) { toast.error('Categoria, titulo y contenido requeridos'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const r = await api.put('/conocimiento/' + editId, form);
        setItems(prev => prev.map(i => i.id === editId ? r.data : i));
        toast.success('Actualizado');
      } else {
        const r = await api.post('/conocimiento', form);
        setItems(prev => [r.data, ...prev]);
        toast.success('Agregado al conocimiento');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (item: any) => {
    setForm({ categoria:item.categoria, titulo:item.titulo, contenido:item.contenido, tags:(item.tags||[]).join(', '), prioridad:item.prioridad||5, activo:item.activo });
    setEditId(item.id); setShowForm(true);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este conocimiento?')) return;
    try { await api.delete('/conocimiento/' + id); setItems(prev => prev.filter(i => i.id !== id)); toast.success('Eliminado'); }
    catch { toast.error('Error eliminando'); }
  };

  const toggleActivo = async (item: any) => {
    try {
      await api.put('/conocimiento/' + item.id, { ...item, activo: !item.activo });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, activo: !i.activo } : i));
    } catch { toast.error('Error'); }
  };

  const filtrados = items.filter(i => {
    const matchCat = filtro === 'todos' || i.categoria === filtro;
    const matchBusq = !busqueda || i.titulo.toLowerCase().includes(busqueda.toLowerCase()) || i.contenido.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBusq;
  });

  const getCat = (val: string) => CATEGORIAS.find(c => c.value === val) || CATEGORIAS[CATEGORIAS.length-1];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#EEF4F9' }}>
              <Brain className="w-5 h-5" style={{ color:'#2D5F8A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Conocimiento de Caborca</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>{items.filter(i=>i.activo).length} entradas activas · la IA aprende de esto</p>
            </div>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Agregar'}
          </button>
        </div>

        <div className="rounded-2xl p-3 border text-sm" style={{ background:'#EEF5F0', borderColor:'#C8E0CC', color:'#2D5A3A' }}>
          🧠 Todo lo que agregues aquí lo usa la IA automáticamente cuando alguien le pregunta algo relacionado. Entre más detallado, mejor responde.
        </div>

        {showForm && (
          <div className="rounded-2xl p-5 border shadow-sm space-y-4 animate-slide-up" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{editId ? 'Editar conocimiento' : 'Nuevo conocimiento'}</h3>

            <div>
              <label className="text-xs mb-2 block font-medium" style={{ color:'var(--text-secondary)' }}>Categoría *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(cat => (
                  <button key={cat.value} onClick={() => set('categoria', cat.value)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    style={{ background: form.categoria===cat.value ? cat.color : 'var(--card)', color: form.categoria===cat.value ? 'white' : 'var(--text-secondary)', borderColor: form.categoria===cat.value ? cat.color : 'var(--border)' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Título *</label>
              <input type="text" placeholder="Ej: Hospital General de Caborca" value={form.titulo} onChange={e => set('titulo', e.target.value)} className="input-field" />
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Contenido *</label>
              <p className="text-xs mb-1" style={{ color:'var(--text-muted)' }}>Escribe toda la información relevante. Direcciones, teléfonos, horarios, descripción detallada.</p>
              <textarea placeholder="El Hospital General está ubicado en..." value={form.contenido} onChange={e => set('contenido', e.target.value)}
                rows={6} className="input-field resize-none" style={{ fontFamily:'inherit' }} />
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Tags (palabras clave separadas por comas)</label>
              <input type="text" placeholder="hospital, médico, urgencias, salud, imss" value={form.tags} onChange={e => set('tags', e.target.value)} className="input-field" />
              <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>Estas palabras ayudan a la IA a encontrar esta info cuando alguien pregunta</p>
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Prioridad (1-10, mayor = más importante)</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="10" value={form.prioridad} onChange={e => set('prioridad', parseInt(e.target.value))} className="flex-1" />
                <span className="text-sm font-bold w-6" style={{ color:'var(--text-primary)' }}>{form.prioridad}</span>
              </div>
            </div>

            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar' : 'Agregar al conocimiento'}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'var(--text-muted)' }} />
            <input type="text" placeholder="Buscar en el conocimiento..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
              className="input-field" style={{ paddingLeft:'36px' }} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFiltro('todos')}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{ background: filtro==='todos' ? '#1E3A5F' : 'var(--card)', color: filtro==='todos' ? 'white' : 'var(--text-secondary)', borderColor: filtro==='todos' ? '#1E3A5F' : 'var(--border)' }}>
            Todos ({items.length})
          </button>
          {CATEGORIAS.map(cat => {
            const count = items.filter(i => i.categoria === cat.value).length;
            if (count === 0) return null;
            return (
              <button key={cat.value} onClick={() => setFiltro(cat.value)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={{ background: filtro===cat.value ? cat.color : 'var(--card)', color: filtro===cat.value ? 'white' : 'var(--text-secondary)', borderColor: filtro===cat.value ? cat.color : 'var(--border)' }}>
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {filtrados.length === 0 ? (
            <div className="rounded-2xl p-10 text-center text-sm" style={{ background:'var(--card)', border:'1px solid var(--border)', color:'var(--text-muted)' }}>
              {busqueda ? 'No se encontraron resultados para "' + busqueda + '"' : 'No hay entradas en esta categoría'}
            </div>
          ) : filtrados.map(item => {
            const cat = getCat(item.categoria);
            return (
              <div key={item.id} className={'rounded-2xl p-4 border shadow-sm ' + (!item.activo ? 'opacity-50' : '')}
                style={{ background:'var(--card)', borderColor:'var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background:cat.color }}>{cat.label}</span>
                      <span className="text-xs" style={{ color:'var(--text-muted)' }}>Prioridad: {item.prioridad}</span>
                      {!item.activo && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Inactivo</span>}
                    </div>
                    <div className="font-semibold text-sm mb-1" style={{ color:'var(--text-primary)' }}>{item.titulo}</div>
                    <div className="text-xs line-clamp-2 mb-2" style={{ color:'var(--text-muted)' }}>{item.contenido}</div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0,5).map((t: string) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background:'var(--sand)', color:'var(--text-muted)' }}>{t}</span>
                        ))}
                        {item.tags.length > 5 && <span className="text-xs" style={{ color:'var(--text-muted)' }}>+{item.tags.length-5}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => toggleActivo(item)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
                      style={{ borderColor:'var(--border)', color: item.activo ? '#16A34A' : 'var(--text-muted)', background:'var(--card)' }}
                      title={item.activo ? 'Desactivar' : 'Activar'}>
                      {item.activo ? '✓' : '○'}
                    </button>
                    <button onClick={() => handleEdit(item)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:bg-blue-50"
                      style={{ borderColor:'var(--border)', color:'var(--text-muted)' }}>
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:bg-red-50 hover:text-red-500"
                      style={{ borderColor:'var(--border)', color:'var(--text-muted)' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
