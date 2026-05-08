'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../MainLayout';
import { adminAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { Newspaper, CalendarDays, AlertTriangle, Trophy, Users, TrendingUp, Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [reportesPendientes, setReportesPendientes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user && user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/');
      return;
    }
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
    } catch {
      toast.error('Error actualizando reporte');
    }
  };

  if (!isAuthenticated || (user && user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Acceso denegado</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-slate-400 text-sm">Caborca IA — Control general de contenido</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Noticias', value: stats.noticias, icon: Newspaper, color: 'text-purple-400' },
              { label: 'Eventos', value: stats.eventos, icon: CalendarDays, color: 'text-emerald-400' },
              { label: 'Reportes pendientes', value: stats.reportes_pendientes, icon: AlertTriangle, color: 'text-amber-400' },
              { label: 'Usuarios', value: stats.usuarios, icon: Users, color: 'text-brand-400' },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                <div className="text-3xl font-display font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/admin/noticias"
            className="glass rounded-2xl p-6 hover:border-purple-600/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <Newspaper className="w-8 h-8 text-purple-400" />
              <Plus className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Gestionar Noticias</h3>
            <p className="text-slate-400 text-sm mt-1">Publicar y administrar noticias locales</p>
          </Link>

          <Link href="/admin/eventos"
            className="glass rounded-2xl p-6 hover:border-emerald-600/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <CalendarDays className="w-8 h-8 text-emerald-400" />
              <Plus className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Gestionar Eventos</h3>
            <p className="text-slate-400 text-sm mt-1">Crear y administrar eventos de la comunidad</p>
          </Link>

          <Link href="/admin/deportes"
            className="glass rounded-2xl p-6 hover:border-rose-600/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-rose-400" />
              <Plus className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Gestionar Deportes</h3>
            <p className="text-slate-400 text-sm mt-1">Registrar partidos y resultados locales</p>
          </Link>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                {reportesPendientes.length} pendientes
              </span>
            </div>
            <h3 className="font-display font-bold text-white text-lg">Moderación de Reportes</h3>
            <p className="text-slate-400 text-sm mt-1">Aprobar o rechazar reportes ciudadanos</p>
          </div>
        </div>

        {reportesPendientes.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Reportes pendientes de moderación
            </h2>
            <div className="space-y-3">
              {reportesPendientes.map(r => (
                <div key={r.id} className="glass rounded-2xl p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-amber-400 uppercase">{r.tipo}</span>
                    </div>
                    <p className="text-white text-sm">{r.descripcion}</p>
                    <p className="text-slate-400 text-xs mt-1">📍 {r.ubicacion}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => manejarReporte(r.id, 'aprobado')}
                      className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => manejarReporte(r.id, 'rechazado')}
                      className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
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
