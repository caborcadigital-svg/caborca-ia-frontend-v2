'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Plus, X, Trash2, Edit, MessageSquare, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSugerenciasPage() {
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [texto, setTexto] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/sugerencias/todas').then(r => setSugerencias(r.data));
  }, []);

  const handleSave = async () => {
    if (!texto.trim()) { toast.error('Escribe el texto de la sugerencia'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const { data } = await api.put(`/sugerencias/${editId}`, { texto });
        setSugerencias(prev => prev.map(s => s.id === editId ? data : s));
        toast.success('Sugerencia actualizada');
      } else {
        const orden = sugerencias.length + 1;
        const { data } = await api.post('/sugerencias', { texto, orden });
        setSugerencias(prev => [...prev, data]);
        toast.success('Sugerencia creada');
      }
      setTexto(''); setShowForm(false); setEditId(null);
    } catch { toast.error('Error guardando sugerencia'); }
    finally { setIsSaving(false); }
  };

  const handleEdit = (s: any) => {
    setTexto(s.texto);
    setEditId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta sugerencia?')) return;
    try {
      await api.delete(`/sugerencias/${id}`);
      setSugerencias(prev => prev.filter(s => s.id !== id));
      toast.success('Eliminada');
    } catch { toast.error('Error eliminando'); }
  };

  const toggleActivo = async (s: any) => {
    try {
      const { data } = await api.put(`/sugerencias/${s.id}`, { activo: !s.activo });
      setSugerencias(prev => prev.map(x => x.id === s.id ? data : x));
    } catch { toast.error('Error actualizando'); }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF0EC' }}>
              <MessageSquare className="w-5 h-5" style={{ color: '#E05C3A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Sugerencias del Chat</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Botones de acceso rápido en el chat IA</p>
            </div>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setTexto(''); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nueva'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            💡 Estas sugerencias aparecen como botones en la pantalla de inicio del chat. Máximo 6 sugerencias activas recomendado.
          </p>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              {editId ? 'Editar sugerencia' : 'Nueva sugerencia'}
            </h3>
            <input type="text" placeholder="Ej: ¿Qué clima hace hoy en Caborca?" value={texto}
              onChange={e => setTexto(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className={inp} style={inpStyle} maxLength={100} />
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{texto.length}/100 caracteres</span>
              <button onClick={handleSave} disabled={!texto.trim() || isSaving}
                className="px-5 py-2 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50">
                {isSaving ? 'Guardando...' : editId ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {sugerencias.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border shadow-sm text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              No hay sugerencias. Agrega la primera.
            </div>
          ) : sugerencias.map((s, i) => (
            <div key={s.id} className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center gap-3 ${!s.activo ? 'opacity-60' : ''}`}
              style={{ borderColor: 'var(--border)' }}>
              <GripVertical className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.texto}</div>
                <div className="text-xs mt-0.5" style={{ color: s.activo ? '#16a34a' : '#999' }}>
                  {s.activo ? '● Activa' : '○ Inactiva'} · Orden {s.orden}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => toggleActivo(s)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all text-xs font-bold"
                  style={{ background: s.activo ? '#f0fdf4' : '#f9f9f9', borderColor: s.activo ? '#86efac' : '#E0E0E0', color: s.activo ? '#16a34a' : '#999' }}>
                  {s.activo ? '●' : '○'}
                </button>
                <button onClick={() => handleEdit(s)}
                  className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-blue-100">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(s.id)}
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
