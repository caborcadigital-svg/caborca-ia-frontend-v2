'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import { adminAPI, reportesAPI } from '../../../lib/api';
import { AlertTriangle, Check, X, Clock, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const TIPO_COLORS: Record<string, string> = {
  accidente: '#DC2626', 'apagón': '#D97706', 'tráfico': '#EA580C',
  'retén': '#2563EB', seguridad: '#DC2626', 'promoción': '#16A34A',
  evento: '#7C3AED', calle_cerrada: '#D97706', otro: '#6B7280',
};
const TIPOS = ['accidente', 'apagón', 'tráfico', 'retén', 'seguridad', 'promoción', 'evento', 'calle_cerrada', 'otro'];
const ESTADOS = ['pendiente', 'aprobado', 'rechazado', 'resuelto'];

export default function AdminReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('pendiente');
  const [isLoading, setIsLoading] = useState(true);
  const [editando, setEditando] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const cargar = (estado: string) => {
    setIsLoading(true);
    (estado === 'pendiente' ? adminAPI.getReportesPendientes() : reportesAPI.getAll())
      .then(data => {
        if (estado !== 'pendiente') {
          setReportes(data.filter((r: any) => r.estado === estado));
        } else {
          setReportes(data);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { cargar(filtro); }, [filtro]);

  const manejar = async (id: string, estado: string) => {
    try {
      await adminAPI.actualizarReporte(id, estado);
      setReportes(prev => prev.filter(r => r.id !== id));
      toast.success(`Reporte ${estado}`);
    } catch { toast.error('Error actualizando'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este reporte?')) return;
    try {
      await adminAPI.actualizarReporte(id, 'rechazado');
      setReportes(prev => prev.filter(r => r.id !== id));
      toast.success('Reporte eliminado');
    } catch { toast.error('Error eliminando'); }
  };

  const handleGuardarEdit = async () => {
    if (!editando) return;
    setIsSaving(true);
    try {
      await adminAPI.actualizarReporte(editando.id, editando.estado);
      setReportes(prev => prev.map(r => r.id === editando.id ? { ...r, ...editando } : r));
      setEditando(null);
      toast.success('Reporte actualizado');
    } catch { toast.error('Error guardando'); }
    finally { setIsSaving(false); }
  };

  const inp = "w-full rounded-xl px-3 py-2 text-sm outline-none border bg-white";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FDF1EC' }}>
            <AlertTriangle className="w-5 h-5" style={{ color: '#C4622D' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Moderación de Reportes</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Administra los reportes ciudadanos</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['pendiente', 'aprobado', 'rechazado', 'resuelto'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${filtro === f ? 'gradient-sunset text-white border-transparent shadow-sm' : 'bg-white'}`}
              style={filtro !== f ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {f}
            </button>
          ))}
        </div>

        {editando && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Editar reporte</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Tipo</label>
                <select value={editando.tipo} onChange={e => setEditando((p: any) => ({ ...p, tipo: e.target.value }))} className={inp} style={inpStyle}>
                  {TIPOS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Estado</label>
                <select value={editando.estado} onChange={e => setEditando((p: any) => ({ ...p, estado: e.target.value }))} className={inp} style={inpStyle}>
                  {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <textarea value={editando.descripcion} onChange={e => setEditando((p: any) => ({ ...p, descripcion: e.target.value }))}
              rows={3} className={inp + ' resize-none'} style={inpStyle} />
            <input type="text" value={editando.ubicacion} onChange={e => setEditando((p: any) => ({ ...p, ubicacion: e.target.value }))} className={inp} style={inpStyle} />
            <div className="flex gap-2">
              <button onClick={handleGuardarEdit} disabled={isSaving}
                className="flex-1 py-2.5 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50">
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => setEditando(null)}
                className="px-4 py-2.5 rounded-xl border text-sm font-medium bg-white"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              </div>
            ))}
          </div>
        ) : reportes.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay reportes {filtro}s</div>
          </div>
        ) : (
          <div className="space-y-2">
            {reportes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold text-white capitalize"
                        style={{ backgroundColor: TIPO_COLORS[r.tipo] || '#6B7280' }}>
                        {r.tipo.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{r.descripcion}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📍 {r.ubicacion}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    {filtro === 'pendiente' && (
                      <>
                        <button onClick={() => manejar(r.id, 'aprobado')}
                          className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-50 hover:bg-green-600 hover:text-white transition-all border border-green-100 text-green-600">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => manejar(r.id, 'rechazado')}
                          className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-600 hover:text-white transition-all border border-red-100 text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => setEditando({ ...r })}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 text-blue-600">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(r.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-600 hover:text-white transition-all border border-red-100 text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
