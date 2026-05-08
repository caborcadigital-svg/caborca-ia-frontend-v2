'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../MainLayout';
import { noticiasAPI } from '../lib/api';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const CATEGORIAS = ['todas', 'general', 'seguridad', 'deportes', 'gobierno', 'cultura', 'economia'];

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [categoria, setCategoria] = useState('todas');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    noticiasAPI.getAll({ limit: 20, categoria: categoria === 'todas' ? undefined : categoria })
      .then(setNoticias)
      .finally(() => setIsLoading(false));
  }, [categoria]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Noticias de Caborca</h1>
            <p className="text-slate-400 text-sm">Información local actualizada</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                categoria === cat
                  ? 'bg-brand-600 text-white'
                  : 'glass text-slate-400 hover:text-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-surface-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-surface-700 rounded w-full mb-2" />
                <div className="h-3 bg-surface-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : noticias.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400">No hay noticias en esta categoría</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {noticias.map((n, i) => (
              <article key={n.id}
                className={`glass rounded-2xl overflow-hidden hover:border-brand-600/30 transition-all group ${i === 0 ? 'md:flex' : ''}`}>
                {n.imagen_url && (
                  <img
                    src={n.imagen_url}
                    alt={n.titulo}
                    className={`object-cover ${i === 0 ? 'md:w-64 md:h-auto h-48 w-full' : 'w-full h-40'}`}
                  />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-brand-400 uppercase tracking-wide">{n.categoria}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-white text-lg mb-2 group-hover:text-brand-300 transition-colors line-clamp-2">
                    {n.titulo}
                  </h2>
                  {n.resumen && (
                    <p className="text-slate-400 text-sm line-clamp-3 flex-1">{n.resumen}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <Link href={`/noticias/${n.id}`}
                      className="text-sm text-brand-400 hover:text-brand-300 font-medium">
                      Leer más →
                    </Link>
                    {n.link_externo && (
                      <a href={n.link_externo} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
                        <ExternalLink className="w-3 h-3" />
                        Fuente
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
