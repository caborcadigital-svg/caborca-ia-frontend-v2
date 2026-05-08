'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cloud, Newspaper, CalendarDays, AlertTriangle, Trophy, Store, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import MainLayout from './MainLayout';
import { climaAPI, noticiasAPI, eventosAPI, reportesAPI, deportesAPI } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ACCESOS = [
  { href: '/chat', label: 'Chat IA', desc: 'Pregúntame cualquier cosa', icon: MessageSquare, color: 'from-blue-600 to-blue-500' },
  { href: '/clima', label: 'Clima', desc: 'Tiempo actual y pronóstico', icon: Cloud, color: 'from-sky-600 to-sky-500' },
  { href: '/noticias', label: 'Noticias', desc: 'Lo más reciente de Caborca', icon: Newspaper, color: 'from-purple-600 to-purple-500' },
  { href: '/eventos', label: 'Eventos', desc: 'Próximos eventos locales', icon: CalendarDays, color: 'from-emerald-600 to-emerald-500' },
  { href: '/reportes', label: 'Reportes', desc: 'Reportes ciudadanos activos', icon: AlertTriangle, color: 'from-amber-600 to-amber-500' },
  { href: '/deportes', label: 'Deportes', desc: 'Resultados y próximos juegos', icon: Trophy, color: 'from-rose-600 to-rose-500' },
  { href: '/negocios', label: 'Negocios', desc: 'Negocios locales y servicios', icon: Store, color: 'from-teal-600 to-teal-500' },
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
      noticiasAPI.getAll().then(setNoticias),
      eventosAPI.getAll().then(setEventos),
      reportesAPI.getAll().then(d => setReportes(d.slice(0, 3))),
      deportesAPI.getPartidos().then(setPartidos),
    ]);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              ¿Qué está pasando <span className="text-gradient">hoy en Caborca</span>?
            </h1>
            <p className="text-slate-400 mt-1">Tu centro de información local, impulsado por IA</p>
          </div>
          {clima && (
            <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 shrink-0">
              <img
                src={`https://openweathermap.org/img/wn/${clima.icono}@2x.png`}
                alt={clima.descripcion}
                className="w-10 h-10"
              />
              <div>
                <div className="text-2xl font-bold text-white">{clima.temperatura}°C</div>
                <div className="text-xs text-slate-400 capitalize">{clima.descripcion}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ACCESOS.map(({ href, label, desc, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="glass rounded-2xl p-4 hover:scale-[1.02] transition-all group cursor-pointer col-span-1">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-xs text-slate-400 mt-0.5 hidden md:block">{desc}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.length > 0 && (
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-purple-400" />
                  Noticias recientes
                </h2>
                <Link href="/noticias" className="text-xs text-brand-500 hover:text-brand-400">Ver todas →</Link>
              </div>
              <div className="space-y-3">
                {noticias.map(n => (
                  <Link key={n.id} href={`/noticias/${n.id}`}
                    className="glass rounded-xl p-4 flex gap-4 hover:border-brand-600/30 transition-all group block">
                    {n.imagen_url && (
                      <img src={n.imagen_url} alt={n.titulo} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs text-brand-400 font-medium uppercase tracking-wide">{n.categoria}</div>
                      <div className="text-sm font-semibold text-white mt-1 line-clamp-2 group-hover:text-brand-300 transition-colors">{n.titulo}</div>
                      <div className="text-xs text-slate-400 mt-1">
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
                  <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-emerald-400" />
                    Próximos eventos
                  </h2>
                  <Link href="/eventos" className="text-xs text-brand-500 hover:text-brand-400">Ver todos →</Link>
                </div>
                <div className="space-y-2">
                  {eventos.map(e => (
                    <div key={e.id} className="glass rounded-xl p-3">
                      <div className="text-sm font-medium text-white">{e.nombre}</div>
                      <div className="text-xs text-slate-400 mt-1">
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
                  <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-rose-400" />
                    Deportes
                  </h2>
                  <Link href="/deportes" className="text-xs text-brand-500 hover:text-brand-400">Ver más →</Link>
                </div>
                <div className="space-y-2">
                  {partidos.map(p => (
                    <div key={p.id} className="glass rounded-xl p-3">
                      <div className="text-xs text-slate-400 mb-1">{p.liga} · {p.deporte}</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-white truncate">{p.equipo_local}</span>
                        <span className="font-bold text-brand-400 mx-2 shrink-0">
                          {p.marcador_local ?? '-'} - {p.marcador_visitante ?? '-'}
                        </span>
                        <span className="font-medium text-white truncate text-right">{p.equipo_visitante}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Reportes activos
                  </h2>
                  <Link href="/reportes" className="text-xs text-brand-500 hover:text-brand-400">Ver todos →</Link>
                </div>
                <div className="space-y-2">
                  {reportes.map(r => (
                    <div key={r.id} className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-400 uppercase">{r.tipo}</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 line-clamp-2">{r.descripcion}</div>
                      <div className="text-xs text-slate-500 mt-1">{r.ubicacion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Link href="/chat"
          className="flex items-center gap-4 glass rounded-2xl p-5 hover:border-brand-600/40 transition-all group">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-white text-base">¿Tienes alguna pregunta sobre Caborca?</div>
            <div className="text-sm text-slate-400">Pregúntale a Caborca IA — te ayuda con clima, negocios, eventos y más</div>
          </div>
          <div className="text-brand-400 group-hover:translate-x-1 transition-transform shrink-0">→</div>
        </Link>
      </div>
    </MainLayout>
  );
}
