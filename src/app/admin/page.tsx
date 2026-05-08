'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../MainLayout';
import { adminAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { Newspaper, CalendarDays, AlertTriangle, Trophy, Users, Store, Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [reportesPendientes, setReportesPendientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadFromStorage(); }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user && user.role !== 'admin' && user.role !== 'superadmin') { router.push('/'); return; }
    Promise.all([
      adminAPI.getStats().then(setStats),
      adminAPI.getReportesPendientes().then(setReportesPendientes),
    ]).finally(() => setIsLoading(false));
  }, [isAuthenticated, user]);

  const manejarReporte = async (id: string, estado: string) => {
    try {
      await adminAPI.actualizarReporte(id, estado);
      setReportesPendientes(prev => prev.filter(r => r.id !== id));
      toast.success(`Reporte ${estado}`);
    } catch { toast.error('Error actualizando reporte'); }
  };

  if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Acceso denegado</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-3 py-4 space-y-5">
        <div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Panel de Administración</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Caborca IA — Control general de contenido</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Noticias', value: stats.noticias, icon: Newspaper, color: '#6B3FA0', bg: '#F3EEF9' },
              { label: 'Eventos', value: stats.eventos, icon: CalendarDays, color: '#4A7C59', bg: '#EEF5F0' },
              { label: 'Rep. pendientes', value: stats.reportes_pendientes, icon: AlertTriangle, color: '#C4622D', bg: '#FDF1EC' },
              { label: 'Usuarios', value: stats.usuarios, icon: Users, color: '#2D5F8A', bg: '#EEF4F9' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-display font-bold" style={{ color: 'var(--desert-blue)' }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href: '/admin/noticias', label: 'Noticias', desc: 'Publicar y administrar', icon: Newspaper, color: '#6B3FA0', bg: '#F3EEF9' },
            { href: '/admin/eventos', label: 'Eventos', desc: 'Crear y gestionar', icon: CalendarDays, color: '#4A7C59', bg: '#EEF5F0' },
            { href: '/admin/deportes', label: 'Deportes', desc: 'Partidos y resultados', icon: Trophy, color: '#E8823A', bg: '#FEF0E8' },
            { href: '/admin/negocios', label: 'Negocios', desc: 'Directorio de negocios', icon: Store, color: '#2D5F8A', bg: '#EEF4F9' },
            { href: '/admin/reportes', label: 'Reportes', desc: 'Moderar ciudadanos', icon: AlertTriangle, color: '#C4622D', bg: '#FDF1EC' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all group" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: 'var(--text-muted)' }} />
              </div>
              <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
            </Link>
          ))}
        </div>

        {reportesPendientes.length > 0 && (
          <div>
            <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle className="w-4 h-4" style={{ color: '#C4622D' }} />
              Reportes pendientes ({reportesPendientes.length})
            </h2>
            <div className="space-y-2">
              {reportesPendientes.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border shadow-sm flex items-start gap-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--terracotta)' }}>{r.tipo}</div>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{r.descripcion}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📍 {r.ubicacion}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => manejarReporte(r.id, 'aprobado')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 hover:bg-green-600 hover:text-white transition-all border border-green-100 text-green-600">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => manejarReporte(r.id, 'rechazado')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 hover:bg-red-600 hover:text-white transition-all border border-red-100 text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
