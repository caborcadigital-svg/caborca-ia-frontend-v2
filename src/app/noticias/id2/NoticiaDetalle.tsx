'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../MainLayout';
import { noticiasAPI } from '../../../lib/api';
import { ArrowLeft, Clock, User } from 'lucide-react';
import ShareWhatsApp from '../../../components/ShareWhatsApp';
import { Skeleton } from '../../../components/Skeleton';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NoticiaDetalle({ id }: { id: string }) {
  const [noticia, setNoticia] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    noticiasAPI.getById(id).then(setNoticia).catch(() => router.push('/noticias')).finally(() => setIsLoading(false));
  }, [id]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <Link href="/noticias" className="flex items-center gap-2 text-sm" style={{ color:'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Volver a noticias
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : noticia ? (
          <>
            {noticia.imagen_url && (
              <img src={noticia.imagen_url} alt={noticia.titulo} className="w-full h-64 object-cover rounded-2xl shadow-md" />
            )}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase px-2 py-1 rounded-full" style={{ background:'var(--sand-dark)', color:'var(--terracotta)' }}>
                  {noticia.categoria}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold leading-tight mb-3" style={{ color:'var(--text-primary)' }}>
                {noticia.titulo}
              </h1>
              <div className="flex items-center gap-4 mb-4 text-xs" style={{ color:'var(--text-muted)' }}>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(noticia.created_at), { addSuffix:true, locale:es })}
                </span>
                {noticia.autor && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{noticia.autor}</span>}
              </div>
              {noticia.resumen && (
                <p className="text-base font-medium leading-relaxed mb-4 pb-4 border-b" style={{ color:'var(--text-secondary)', borderColor:'var(--border)' }}>
                  {noticia.resumen}
                </p>
              )}
              {noticia.contenido && (
                <div className="prose prose-sm max-w-none text-sm leading-relaxed space-y-3"
                  style={{ color:'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
              )}
              <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor:'var(--border)' }}>
                <span className="text-xs" style={{ color:'var(--text-muted)' }}>Caborca IA · caborca.app</span>
                <ShareWhatsApp
                  texto={'📰 ' + noticia.titulo}
                  url={'https://caborca.app/noticias/' + noticia.id}
                  size="sm" />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}
