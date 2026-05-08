'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { eventosAPI } from '../lib/api';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [tab, setTab] = useState<'proximos' | 'todos'>('proximos');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    eventosAPI.getAll({ proximos: tab === 'proximos', limit: 30 })
      .then(setEventos)
      .finally(() => setIsLoading(false));
  }, [tab]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Eventos en Caborca</h1>
            <p className="text-slate-400 text-sm">Actividades y eventos locales</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(['proximos', 'todos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t ? 'gradient-brand text-white' : 'glass text-slate-400 hover:text-white'
              }`}>
              {t === 'proximos' ? 'Próximos eventos' : 'Todos'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-surface-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-surface-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400">No hay eventos registrados</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {eventos.map(e => (
              <div key={e.id} className="glass rounded-2xl overflow-hidden hover:border-emerald-600/30 transition-all">
                {e.imagen_url && (
                  <img src={e.imagen_url} alt={e.nombre} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-xs text-emerald-400 font-medium uppercase">{e.categoria}</span>
                      <h2 className="font-display font-bold text-white text-lg mt-1">{e.nombre}</h2>
                    </div>
                    <div className="glass rounded-xl px-3 py-2 text-center shrink-0">
                      <div className="text-lg font-bold text-white leading-none">
                        {new Date(e.fecha_inicio).getDate()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(e.fecha_inicio).toLocaleDateString('es-MX', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  {e.descripcion && (
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">{e.descripcion}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    {e.lugar && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {e.lugar}
                      </span>
                    )}
                    {e.link_externo && (
                      <a href={e.link_externo} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
                        <ExternalLink className="w-3 h-3" />
                        Más info
                      </a>
                    )}
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
