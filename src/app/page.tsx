'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cloud, Newspaper, CalendarDays, AlertTriangle, Trophy, Store, MessageSquare } from 'lucide-react';
import MainLayout from './MainLayout';
import { climaAPI, noticiasAPI, eventosAPI, reportesAPI, deportesAPI } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ACCESOS = [
  { href: '/chat', label: 'Chat IA', desc: 'Pregúntame cualquier cosa', icon: MessageSquare, color: '#E05C3A' },
  { href: '/clima', label: 'Clima', desc: 'Tiempo actual', icon: Cloud, color: '#4A90C4' },
  { href: '/noticias', label: 'Noticias', desc: 'Lo más reciente', icon: Newspaper, color: '#6B3FA0' },
  { href: '/eventos', label: 'Eventos', desc: 'Próximas actividades', icon: CalendarDays, color: '#4A7C59' },
  { href: '/reportes', label: 'Reportes', desc: 'Incidencias activas', icon: AlertTriangle, color: '#C4622D' },
  { href: '/deportes', label: 'Deportes', desc: 'Resultados locales', icon: Trophy, color: '#E8823A' },
  { href: '/negocios', label: 'Negocios', desc: 'Negocios y servicios', icon: Store, color: '#2D5F8A' },
];

export default function HomePage() {
  const [clima, setClima] = useState<any>(null);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);

  useEffect(() => {
    Promise.allSettled([
      climaAPI.getCurrent().then(setClima),
      noticiasAPI.getAll().then(d => setNoticias(d.slice(0, 4))),
      eventosAPI.getAll({ proximos: true }).then(d => setEventos(d.slice(0, 3))),
      reportesAPI.getAll().then(d => setReportes(d.slice(0, 3))),
      deportesAPI.getPartidos().then(d => setPartidos(d.slice(0, 3))),
    ]);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <div className="rounded-3xl overflow-hidden gradient-desert-hero p-8 text-white relative">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <path d="M0 150 Q100 100 200 130 Q300 160 400 110 Q500 60 600 100 Q700 140 800 90 L800 200 L0 200Z" fill="white"/>
              <rect x="320" y="80" width="8" height="120" fill="white" opacity="0.5"/>
              <rect x="315" y="100" width="18" height="8" rx="4" fill="white" opacity="0.5"/>
              <rect x="315" y="115" width="18" height="8" rx="4" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                ¿Qué está pasando hoy<br/>en <span className="text-yellow-300">Caborca</span>?
              </h1>
              <p className="text-white/70">Tu asistente inteligente de Heroica Caborca, Sonora</p>
            </div>
            {clima && (
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-4 shrink-0">
                <img src={`https://openweathermap.org/img/wn/${clima.icono}@2x.png`} alt={clima.descripcion} className="w-14 h-14" />
                <div>
                  <div className="text-4xl font-display font-bold">{clima.temperatura}°C</div>
                  <div className="text-sm text-white/70 capitalize">{clima.descripcion}</div>
                  <div className="text-xs text-white/50 mt-0.5">Caborca, Sonora</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ACCESOS.map(({ href, label, desc, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="card-desert rounded-2xl p-4 hover:scale-[1.02] hover:shadow-md transition-all group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"
                style={{ backgroundColor: color + '20' }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
              <div className="text-xs mt-0.5 hidden md:block" style={{ color: 'var(--text-muted)' }}>{desc}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.length > 0 && (
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Newspaper className="w-5 h-5" style={{ color: '#6B3FA0' }} />
                  Noticias recientes
                </h2>
                <Link href="/noticias" className="text-xs font-medium hover:underline" style={{ color: 'var(--terracotta)' }}>Ver todas →</Link>
              </div>
              <div className="space-y-3">
                {noticias.map(n => (
                  <Link key={n.id} href={`/noticias/${n.id}`}
                    className="card-desert rounded-xl p-4 flex gap-4 hover:shadow-md transition-all group block">
                    {n.imagen_url && (
                      <img src={n.imagen_url} alt={n.titulo} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>{n.categoria}</div>
                      <div className="text-sm font-semibold mt-1 line-clamp-2 group-hover:text-terracotta transition-colors" style={{ color: 'var(--text-primary)' }}>{n.titulo}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {eventos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <CalendarDays className="w-4 h-4 text-cactus" />
                    Próximos eventos
                  </h2>
                  <Link href="/eventos" className="text-xs font-medium" style={{ color: 'var(--terracotta)' }}>Ver todos →</Link>
                </div>
                <div className="space-y-2">
                  {eventos.map(e => (
                    <div key={e.id} className="card-desert rounded-xl p-3">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{e.nombre}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {new Date(e.fecha_inicio).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {e.lugar && ` · ${e.lugar}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {partidos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Trophy className="w-4 h-4" style={{ color: '#E8823A' }} />
                    Deportes
                  </h2>
                  <Link href="/deportes" className="text-xs font-medium" style={{ color: 'var(--terracotta)' }}>Ver más →</Link>
                </div>
                <div className="space-y-2">
                  {partidos.map(p => (
                    <div key={p.id} className="card-desert rounded-xl p-3">
                      <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{p.liga} · {p.deporte}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.equipo_local}</span>
                        <span className="font-bold mx-2 shrink-0" style={{ color: 'var(--terracotta)' }}>
                          {p.marcador_local ?? '-'} - {p.marcador_visitante ?? '-'}
                        </span>
                        <span className="font-medium truncate text-right" style={{ color: 'var(--text-primary)' }}>{p.equipo_visitante}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <AlertTriangle className="w-4 h-4" style={{ color: 'var(--terracotta)' }} />
                    Reportes activos
                  </h2>
                  <Link href="/reportes" className="text-xs font-medium" style={{ color: 'var(--terracotta)' }}>Ver todos →</Link>
                </div>
                <div className="space-y-2">
                  {reportes.map(r => (
                    <div key={r.id} className="card-desert rounded-xl p-3">
                      <div className="text-xs font-semibold uppercase" style={{ color: 'var(--terracotta)' }}>{r.tipo}</div>
                      <div className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{r.descripcion}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>📍 {r.ubicacion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Link href="/chat"
          className="flex items-center gap-4 card-desert rounded-2xl p-5 hover:shadow-lg transition-all group block">
          <div className="w-12 h-12 rounded-2xl gradient-sunset flex items-center justify-center shadow-lg shrink-0">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>¿Tienes alguna pregunta sobre Caborca?</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Pregúntale a Caborca IA — clima, negocios, eventos y más</div>
          </div>
          <div className="group-hover:translate-x-1 transition-transform shrink-0" style={{ color: 'var(--terracotta)' }}>→</div>
        </Link>
      </div>
    </MainLayout>
  );
}
