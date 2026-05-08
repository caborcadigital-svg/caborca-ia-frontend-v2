'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { eventosAPI } from '../../lib/api';
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react';

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [tab, setTab] = useState<'proximos' | 'todos'>('proximos');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    eventosAPI.getAll({ proximos: tab === 'proximos' }).then(setEventos).finally(() => setIsLoading(false));
  }, [tab]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF5F0' }}>
            <CalendarDays className="w-5 h-5" style={{ color: '#4A7C59' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Eventos en Caborca</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Actividades y eventos locales</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(['proximos', 'todos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === t ? 'gradient-sunset text-white border-transparent shadow-sm' : 'bg-white'}`}
              style={tab !== t ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {t === 'proximos' ? 'Próximos eventos' : 'Todos'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay eventos registrados</div>
          </div>
        ) : (
          <div className="space-y-3">
            {eventos.map(e => (
              <div key={e.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                {e.imagen_url && <img src={e.imagen_url} alt={e.nombre} className="w-full h-36 object-cover" />}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-xs font-semibold uppercase" style={{ color: '#4A7C59' }}>{e.categoria}</span>
                      <h2 className="font-display font-bold text-base mt-1" style={{ color: 'var(--text-primary)' }}>{e.nombre}</h2>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2 text-center shrink-0 border" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-lg font-bold leading-none" style={{ color: 'var(--desert-blue)' }}>
                        {new Date(e.fecha_inicio).getDate()}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(e.fecha_inicio).toLocaleDateString('es-MX', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  {e.descripcion && <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{e.descripcion}</p>}
                  <div className="flex items-center gap-4 mt-3">
                    {e.lugar && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <MapPin className="w-3 h-3" />{e.lugar}
                      </span>
                    )}
                    {e.link_externo && (
                      <a href={e.link_externo} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: 'var(--terracotta)' }}>
                        <ExternalLink className="w-3 h-3" /> Más info
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
