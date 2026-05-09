'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../MainLayout';
import { adminAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { Newspaper, CalendarDays, AlertTriangle, Trophy, Users, Store, Plus, Check, X, TrendingUp, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORES_REPORTE = ['#E05C3A', '#E8823A', '#4A90C4', '#6B3FA0', '#4A7C59', '#C4622D'];

export default function AdminPage() {
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [reportesPendientes, setReportesPendientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reportes'>('overview');

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

  const statCards = stats ? [
    { label: 'Noticias', value: stats.noticias, icon: Newspaper, color: '#6B3FA0', bg: '#F3EEF9', href: '/admin/noticias' },
    { label: 'Eventos', value: stats.eventos, icon: CalendarDays, color: '#4A7C59', bg: '#EEF5F0', href: '/admin/eventos' },
    { label: 'Pendientes', value: stats.reportes_pendientes, icon: AlertTriangle, color: '#C4622D', bg: '#FDF1EC', href: '/admin/reportes', alert: stats.reportes_pendientes > 0 },
    { label: 'Usuarios', value: stats.usuarios, icon: Users, color: '#2D5F8A', bg: '#EEF4F9', href: null },
  ] : [];

  const menuItems = [
    { href: '/admin/noticias', label: 'Noticias', desc: 'Publicar y administrar', icon: Newspaper, color: '#6B3FA0', bg: '#F3EEF9' },
    { href: '/admin/eventos', label: 'Eventos', desc: 'Crear y gestionar', icon: CalendarDays, color: '#4A7C59', bg: '#EEF5F0' },
    { href: '/admin/deportes', label: 'Deportes', desc: 'Partidos y resultados', icon: Trophy, color: '#E8823A', bg: '#FEF0E8' },
    { href: '/admin/negocios', label: 'Negocios', desc: 'Directorio local', icon: Store, color: '#2D5F8A', bg: '#EEF4F9' },
    { href: '/admin/reportes', label: 'Reportes', desc: 'Moderar ciudadanos', icon: AlertTriangle, color: '#C4622D', bg: '#FDF1EC' },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-3 py-4 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Panel de Administración</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Bienvenido, {user?.nombre}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${activeTab === 'overview' ? 'gradient-sunset text-white border-transparent' : 'bg-white'}`}
              style={activeTab !== 'overview' ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              <BarChart2 className="w-3.5 h-3.5" /> Resumen
            </button>
            <button onClick={() => setActiveTab('reportes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${activeTab === 'reportes' ? 'gradient-sunset text-white border-transparent' : 'bg-white'}`}
              style={activeTab !== 'reportes' ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Reportes
              {stats?.reportes_pendientes > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {stats.reportes_pendientes}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statCards.map(s => (
                  <div key={s.label} className={`bg-white rounded-2xl p-4 border shadow-sm transition-all ${s.href ? 'hover:shadow-md cursor-pointer' : ''} ${s.alert ? 'border-red-200' : 'border-gray-100'}`}
                    onClick={() => s.href && router.push(s.href)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                        <s.icon className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                      {s.alert && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </div>
                    <div className="text-2xl font-display font-bold" style={{ color: 'var(--desert-blue)' }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Gráfica simple de actividad */}
            {stats && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--terracotta)' }} />
                  Contenido publicado
                </h2>
                <div className="space-y-3">
                  {[
                    { label: 'Noticias', value: stats.noticias, max: Math.max(stats.noticias, stats.eventos, stats.usuarios, 1), color: '#6B3FA0' },
                    { label: 'Eventos', value: stats.eventos, max: Math.max(stats.noticias, stats.eventos, stats.usuarios, 1), color: '#4A7C59' },
                    { label: 'Usuarios', value: stats.usuarios, max: Math.max(stats.noticias, stats.eventos, stats.usuarios, 1), color: '#2D5F8A' },
                    { label: 'Rep. pendientes', value: stats.reportes_pendientes, max: Math.max(stats.noticias, stats.eventos, stats.usuarios, 1), color: '#C4622D' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="text-xs w-24 shrink-0" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max((item.value / item.max) * 100, item.value > 0 ? 5 : 0)}%`, background: item.color }} />
                      </div>
                      <div className="text-xs font-bold w-6 text-right" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {menuItems.map(item => (
                <Link key={item.href} href={item.href}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
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
          </>
        )}

        {activeTab === 'reportes' && (
          <div className="space-y-3">
            {reportesPendientes.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay reportes pendientes</div>
              </div>
            ) : reportesPendientes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
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
        )}
      </div>
    </MainLayout>
  );
}
