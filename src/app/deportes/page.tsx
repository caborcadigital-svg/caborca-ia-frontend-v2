'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { deportesAPI } from '../../lib/api';
import { Trophy, Calendar } from 'lucide-react';

export default function DeportesPage() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [proximos, setProximos] = useState<any[]>([]);
  const [tab, setTab] = useState<'resultados' | 'proximos'>('resultados');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      deportesAPI.getPartidos().then(setPartidos),
      deportesAPI.getProximos().then(setProximos),
    ]).finally(() => setIsLoading(false));
  }, []);

  const data = tab === 'resultados' ? partidos.filter(p => p.estado === 'finalizado') : proximos;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF0E8' }}>
            <Trophy className="w-5 h-5" style={{ color: '#E8823A' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Deportes en Caborca</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Ligas, torneos y resultados locales</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(['resultados', 'proximos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === t ? 'gradient-sunset text-white shadow-md border-transparent' : 'bg-white'}`}
              style={tab !== t ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {t === 'resultados' ? 'Resultados' : 'Próximos Partidos'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-3 rounded w-1/4 mb-4 bg-gray-100" />
                <div className="flex justify-between gap-4">
                  <div className="h-4 rounded w-1/3 bg-gray-100" />
                  <div className="h-4 rounded w-16 bg-gray-100" />
                  <div className="h-4 rounded w-1/3 bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <Trophy className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {tab === 'resultados' ? 'No hay resultados registrados' : 'No hay partidos programados'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--terracotta)' }}>{p.liga}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {p.deporte}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Calendar className="w-3 h-3" />
                    {new Date(p.fecha).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{p.equipo_local}</div>
                    {p.lugar && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.lugar}</div>}
                  </div>
                  <div className="px-4 text-center shrink-0">
                    {p.estado === 'finalizado' ? (
                      <div className="font-display font-bold text-2xl" style={{ color: 'var(--desert-blue)' }}>
                        {p.marcador_local} <span className="text-lg text-gray-300">-</span> {p.marcador_visitante}
                      </div>
                    ) : (
                      <div className="text-sm font-bold" style={{ color: 'var(--terracotta)' }}>
                        {new Date(p.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <div className="text-xs mt-0.5 font-medium" style={{ color: p.estado === 'en_curso' ? '#16a34a' : 'var(--text-muted)' }}>
                      {p.estado === 'finalizado' ? 'Final' : p.estado === 'en_curso' ? '🔴 En vivo' : 'Programado'}
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{p.equipo_visitante}</div>
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
