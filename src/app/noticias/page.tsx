'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../MainLayout';
import { noticiasAPI } from '../../lib/api';
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
      .then(setNoticias).finally(() => setIsLoading(false));
  }, [categoria]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F3EEF9' }}>
            <Newspaper className="w-5 h-5" style={{ color: '#6B3FA0' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Noticias de Caborca</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Información local actualizada</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${
                categoria === cat ? 'gradient-sunset text-white border-transparent shadow-sm' : 'bg-white'
              }`}
              style={categoria !== cat ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : noticias.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <Newspaper className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay noticias en esta categoría</div>
          </div>
        ) : (
          <div className="space-y-3">
            {noticias.map((n, i) => (
              <article key={n.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${i === 0 ? 'md:flex' : ''}`}
                style={{ borderColor: 'var(--border)' }}>
                {n.imagen_url && (
                  <img src={n.imagen_url} alt={n.titulo}
                    className={`object-cover ${i === 0 ? 'md:w-56 md:h-auto h-40 w-full' : 'w-full h-36'}`} />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>{n.categoria}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-base mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{n.titulo}</h2>
                  {n.resumen && <p className="text-sm line-clamp-2 flex-1" style={{ color: 'var(--text-secondary)' }}>{n.resumen}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <Link href={`/noticias/${n.id}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--terracotta)' }}>
                      Leer más →
                    </Link>
                    {n.link_externo && (
                      <a href={n.link_externo} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <ExternalLink className="w-3 h-3" /> Fuente
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
