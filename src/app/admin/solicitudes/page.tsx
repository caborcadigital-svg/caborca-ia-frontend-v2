'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Store, Check, X, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('pendiente');

  useEffect(() => {
    api.get('/solicitudes-negocios').then(r => setSolicitudes(r.data)).finally(() => setIsLoading(false));
  }, []);

  const actualizar = async (id: string, estado: string) => {
    try {
      await api.put(`/solicitudes-negocios/${id}`, { estado });
      setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado } : s));
      toast.success(`Solicitud ${estado}`);
    } catch { toast.error('Error actualizando solicitud'); }
  };

  const convertirANegocio = (s: any) => {
    const params = new URLSearchParams({
      nombre: s.nombre,
      categoria: s.categoria,
      descripcion: s.descripcion || '',
    });
    window.location.href = `/admin/negocios?prefill=${encodeURIComponent(JSON.stringify({ nombre: s.nombre, categoria: s.categoria, descripcion: s.descripcion }))}`;
  };

  const lista = solicitudes.filter(s => s.estado === filtro);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF4F9' }}>
            <Store className="w-5 h-5" style={{ color: '#2D5F8A' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Solicitudes de Negocios</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Negocios sugeridos por la comunidad</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['pendiente', 'aprobado', 'rechazado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${filtro === f ? 'gradient-sunset text-white border-transparent' : 'bg-white'}`}
              style={filtro !== f ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {f}
              {f === 'pendiente' && solicitudes.filter(s => s.estado === 'pendiente').length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {solicitudes.filter(s => s.estado === 'pendiente').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              </div>
            ))}
          </div>
        ) : lista.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <Store className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay solicitudes {filtro}s</div>
          </div>
        ) : (
          <div className="space-y-3">
            {lista.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.nombre}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{ background: '#EEF4F9', color: '#2D5F8A' }}>{s.categoria}</span>
                    </div>
                    {s.descripcion && <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{s.descripcion}</p>}
                    {s.telefono_contacto && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>📞 Contacto: {s.telefono_contacto}</p>}
                    <div className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(s.created_at), { addSuffix: true, locale: es })}
                    </div>
                  </div>
                  {filtro === 'pendiente' && (
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => convertirANegocio(s)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                        title="Agregar como negocio">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={() => actualizar(s.id, 'aprobado')}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100"
                        title="Aprobar">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => actualizar(s.id, 'rechazado')}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all border border-red-100"
                        title="Rechazar">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
