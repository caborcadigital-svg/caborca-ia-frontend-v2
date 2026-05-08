'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../MainLayout';
import { noticiasAPI } from '../../../lib/api';
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NoticiaDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [noticia, setNoticia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    noticiasAPI.getById(id as string)
      .then(setNoticia).catch(() => router.push('/noticias')).finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-3/4" />
        <div className="h-52 bg-gray-100 rounded-2xl" />
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}</div>
      </div>
    </MainLayout>
  );

  if (!noticia) return null;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <Link href="/noticias" className="flex items-center gap-2 text-sm transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Volver a noticias
        </Link>
        <article className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>{noticia.categoria}</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(noticia.created_at), { addSuffix: true, locale: es })}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: 'var(--desert-blue)' }}>{noticia.titulo}</h1>
            {noticia.resumen && <p className="text-base mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{noticia.resumen}</p>}
          </div>
          {noticia.imagen_url && (
            <img src={noticia.imagen_url} alt={noticia.titulo} className="w-full rounded-2xl object-cover max-h-72" />
          )}
          <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{noticia.contenido}</div>
          </div>
          {noticia.link_externo && (
            <a href={noticia.link_externo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: 'var(--terracotta)' }}>
              <ExternalLink className="w-4 h-4" /> Ver fuente original
            </a>
          )}
        </article>
      </div>
    </MainLayout>
  );
}
