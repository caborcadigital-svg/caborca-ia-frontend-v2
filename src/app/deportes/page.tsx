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
      deportesAPI.getPartidos({ limit: 20 }).then(setPartidos),
      deportesAPI.getProximos().then(setProximos),
    ]).finally(() => setIsLoading(false));
  }, []);

  const data = tab === 'resultados' ? partidos.filter(p => p.estado === 'finalizado') : proximos;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Deportes en Caborca</h1>
            <p className="text-slate-400 text-sm">Ligas, torneos y resultados locales</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(['resultados', 'proximos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t ? 'gradient-brand text-white' : 'glass text-slate-400 hover:text-white'
              }`}>
              {t === 'resultados' ? 'Resultados' : 'Próximos partidos'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-surface-700 rounded w-1/4 mb-4" />
                <div className="flex justify-between">
                  <div className="h-4 bg-surface-700 rounded w-1/3" />
                  <div className="h-4 bg-surface-700 rounded w-16" />
                  <div className="h-4 bg-surface-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400">
              {tab === 'resultados' ? 'No hay resultados registrados' : 'No hay partidos programados'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map(p => (
              <div key={p.id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-400 font-medium">{p.liga}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400 capitalize">{p.deporte}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(p.fecha).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-white text-base">{p.equipo_local}</div>
                    {p.lugar && <div className="text-xs text-slate-400 mt-0.5">{p.lugar}</div>}
                  </div>
                  <div className="px-6 text-center">
                    {p.estado === 'finalizado' ? (
                      <div className="font-display font-bold text-2xl text-white">
                        {p.marcador_local} <span className="text-slate-500 text-lg">-</span> {p.marcador_visitante}
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-brand-400 uppercase">
                        {new Date(p.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <div className={`text-xs mt-1 font-medium ${
                      p.estado === 'finalizado' ? 'text-slate-500' :
                      p.estado === 'en_curso' ? 'text-green-400' : 'text-brand-400'
                    }`}>
                      {p.estado === 'finalizado' ? 'Final' : p.estado === 'en_curso' ? '🔴 En vivo' : 'Programado'}
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="font-semibold text-white text-base">{p.equipo_visitante}</div>
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
