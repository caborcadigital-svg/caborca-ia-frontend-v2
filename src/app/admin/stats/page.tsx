'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { MessageSquare, TrendingUp, Users, BarChart2 } from 'lucide-react';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { api.get('/admin/chat-stats').then(r => setStats(r.data)).finally(() => setIsLoading(false)); }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#FEF0EC' }}>
            <BarChart2 className="w-5 h-5" style={{ color:'#E05C3A' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Estadísticas del Chat</h1>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Preguntas más frecuentes y uso del asistente</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-2xl p-4 border animate-pulse h-24" style={{ borderColor:'var(--border)' }} />)}</div>
        ) : !stats ? (
          <div className="bg-white rounded-2xl p-8 text-center border shadow-sm text-sm" style={{ borderColor:'var(--border)', color:'var(--text-muted)' }}>No hay estadísticas disponibles aún</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Total mensajes', value:stats.total_mensajes, icon:MessageSquare, color:'#E05C3A', bg:'#FEF0EC' },
                { label:'Conversaciones', value:stats.total_conversaciones, icon:TrendingUp, color:'#6B3FA0', bg:'#F3EEF9' },
                { label:'Usuarios activos', value:stats.usuarios_activos, icon:Users, color:'#2D5F8A', bg:'#EEF4F9' },
                { label:'Hoy', value:stats.mensajes_hoy, icon:BarChart2, color:'#4A7C59', bg:'#EEF5F0' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor:'var(--border)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background:s.bg }}>
                    <s.icon className="w-4 h-4" style={{ color:s.color }} />
                  </div>
                  <div className="text-2xl font-display font-bold" style={{ color:'var(--desert-blue)' }}>{s.value || 0}</div>
                  <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {stats.temas_frecuentes?.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor:'var(--border)' }}>
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color:'var(--text-primary)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color:'var(--terracotta)' }} /> Temas más consultados
                </h2>
                <div className="space-y-3">
                  {stats.temas_frecuentes.map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-xs font-bold w-5 text-right shrink-0" style={{ color:'var(--text-muted)' }}>{i+1}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium capitalize" style={{ color:'var(--text-primary)' }}>{t.tipo}</span>
                          <span className="text-xs" style={{ color:'var(--text-muted)' }}>{t.count} consultas</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full gradient-sunset" style={{ width:`${(t.count/stats.temas_frecuentes[0].count)*100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
