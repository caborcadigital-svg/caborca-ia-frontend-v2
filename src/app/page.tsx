'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cloud, Newspaper, CalendarDays, AlertTriangle, Trophy, Store, MessageSquare, Wind, Droplets } from 'lucide-react';
import MainLayout from './MainLayout';
import { climaAPI, noticiasAPI, eventosAPI, reportesAPI, deportesAPI } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ACCESOS = [
  { href: '/chat', label: 'Chat IA', icon: MessageSquare, color: '#E05C3A', bg: '#FEF0EC' },
  { href: '/clima', label: 'Clima', icon: Cloud, color: '#4A90C4', bg: '#EFF6FC' },
  { href: '/noticias', label: 'Noticias', icon: Newspaper, color: '#6B3FA0', bg: '#F3EEF9' },
  { href: '/eventos', label: 'Eventos', icon: CalendarDays, color: '#4A7C59', bg: '#EEF5F0' },
  { href: '/reportes', label: 'Reportes', icon: AlertTriangle, color: '#C4622D', bg: '#FDF1EC' },
  { href: '/deportes', label: 'Deportes', icon: Trophy, color: '#E8823A', bg: '#FEF3EB' },
  { href: '/negocios', label: 'Negocios', icon: Store, color: '#2D5F8A', bg: '#EEF4F9' },
];

export default function HomePage() {
  const [clima, setClima] = useState<any>(null);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);

  useEffect(() => {
    Promise.allSettled([
      climaAPI.getCurrent().then(setClima),
      noticiasAPI.getAll().then(d => setNoticias(d.slice(0, 3))),
      eventosAPI.getAll({ proximos: true }).then(d => setEventos(d.slice(0, 2))),
      deportesAPI.getPartidos().then(d => setPartidos(d.slice(0, 2))),
    ]);
  }, []);

  return (
    <MainLayout>
      <div className="px-3 py-3 space-y-3 max-w-2xl mx-auto lg:max-w-5xl">

        {/* Hero compacto */}
        <div className="rounded-2xl gradient-desert-hero p-4 text-white flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">¿Qué pasa hoy en<br/><span className="text-yellow-300">Caborca</span>?</h1>
            <p className="text-white/60 text-xs mt-0.5">Heroica Caborca, Sonora</p>
          </div>
          {clima ? (
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 shrink-0">
              <img src={`https://openweathermap.org/img/wn/${clima.icono}.png`} alt="" className="w-8 h-8" />
              <div>
                <div className="text-2xl font-display font-bold leading-none">{clima.temperatura}°</div>
                <div className="text-xs text-white/60 capitalize">{clima.descripcion}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 shrink-0">
              <Cloud className="w-6 h-6 text-white/60" />
              <span className="text-xs text-white/60">Cargando...</span>
            </div>
          )}
        </div>

        {/* Accesos rápidos - grid 4 cols en móvil */}
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
          {ACCESOS.map(({ href, label, icon: Icon, color, bg }) => (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all active:scale-95 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-4.5 h-4.5" style={{ color }} />
              </div>
              <span className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--text-primary)', fontSize: '10px' }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* Contenido principal - 2 columnas en desktop, 1 en móvil */}
        <div className="grid lg:grid-cols-3 gap-3">

          {/* Noticias - ocupa 2 cols en desktop */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <Newspaper className="w-4 h-4" style={{ color: '#6B3FA0' }} />
                Noticias
              </h2>
              <Link href="/noticias" className="text-xs font-medium" style={{ color: 'var(--terracotta)' }}>Ver más →</Link>
            </div>
            {noticias.length === 0 ? (
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                Sin noticias por el momento
              </div>
            ) : (
              <div className="space-y-2">
                {noticias.map(n => (
                  <Link key={n.id} href={`/noticias/${n.id}`}
                    className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex gap-3 hover:shadow-md transition-all group block">
                    {n.imagen_url && (
                      <img src={n.imagen_url} alt={n.titulo} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>{n.categoria}</div>
                      <div className="text-sm font-semibold mt-0.5 line-clamp-2 group-hover:underline" style={{ color: 'var(--text-primary)' }}>{n.titulo}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar derecho - eventos + deportes */}
          <div className="space-y-3">
            {/* Eventos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <CalendarDays className="w-4 h-4" style={{ color: '#4A7C59' }} />
                  Eventos
                </h2>
                <Link href="/eventos" className="text-xs font-medium" style={{ color: 'var(--terracotta)' }}>Ver →</Link>
              </div>
              {eventos.length === 0 ? (
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  Sin eventos próximos
                </div>
              ) : (
                <div className="space-y-2">
                  {eventos.map(e => (
                    <div key={e.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{e.nombre}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date(e.fecha_inicio).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {e.lugar && ` · ${e.lugar}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deportes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <Trophy className="w-4 h-4" style={{ color: '#E8823A' }} />
                  Deportes
                </h2>
                <Link href="/deportes" className="text-xs font-medium" style={{ color: 'var(--terracotta)' }}>Ver →</Link>
              </div>
              {partidos.length === 0 ? (
                <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  Sin resultados recientes
                </div>
              ) : (
                <div className="space-y-2">
                  {partidos.map(p => (
                    <div key={p.id} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{p.liga}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.equipo_local}</span>
                        <span className="font-bold mx-2 shrink-0 text-sm" style={{ color: 'var(--terracotta)' }}>
                          {p.marcador_local ?? '-'}-{p.marcador_visitante ?? '-'}
                        </span>
                        <span className="font-medium truncate text-right" style={{ color: 'var(--text-primary)' }}>{p.equipo_visitante}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Chat */}
        <Link href="/chat"
          className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
          <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center shadow-md shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pregúntale a Caborca IA</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Clima, negocios, eventos y más...</div>
          </div>
          <span className="group-hover:translate-x-1 transition-transform text-sm shrink-0" style={{ color: 'var(--terracotta)' }}>→</span>
        </Link>

      </div>
    </MainLayout>
  );
}
