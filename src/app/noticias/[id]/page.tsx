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
      .then(setNoticia)
      .catch(() => router.push('/noticias'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 animate-pulse">
          <div className="h-8 bg-surface-700 rounded w-3/4" />
          <div className="h-64 bg-surface-700 rounded-2xl" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-surface-700 rounded" />)}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!noticia) return null;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Link href="/noticias" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a noticias
        </Link>

        <article className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-medium text-brand-400 uppercase tracking-wide">{noticia.categoria}</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(noticia.created_at), { addSuffix: true, locale: es })}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">{noticia.titulo}</h1>
            {noticia.resumen && (
              <p className="text-slate-300 text-lg mt-3 leading-relaxed">{noticia.resumen}</p>
            )}
          </div>

          {noticia.imagen_url && (
            <img src={noticia.imagen_url} alt={noticia.titulo} className="w-full rounded-2xl object-cover max-h-80" />
          )}

          <div className="glass rounded-2xl p-6">
            <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
              {noticia.contenido}
            </div>
          </div>

          {noticia.link_externo && (
            <a href={noticia.link_externo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300">
              <ExternalLink className="w-4 h-4" />
              Ver fuente original
            </a>
          )}
        </article>
      </div>
    </MainLayout>
  );
}
