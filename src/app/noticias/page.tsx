'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '../MainLayout';
import { noticiasAPI } from '../../lib/api';
import { Newspaper, ChevronRight } from 'lucide-react';
import ShareWhatsApp from '../../components/ShareWhatsApp';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const CATEGORIAS = ['todas','general','seguridad','deportes','gobierno','cultura','economia'];

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [categoria, setCategoria] = useState('todas');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    noticiasAPI.getAll({ categoria: categoria === 'todas' ? undefined : categoria }).then(setNoticias).finally(() => setIsLoading(false));
  }, [categoria]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#F3EEF9' }}>
            <Newspaper className="w-5 h-5" style={{ color:'#6B3FA0' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Noticias de Caborca</h1>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Información local al día</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${categoria === cat ? 'gradient-sunset text-white border-transparent' : 'bg-white'}`}
              style={categoria !== cat ? { borderColor:'var(--border)', color:'var(--text-secondary)' } : {}}>
              {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_,i) => <div key={i} className="bg-white rounded-2xl p-4 border animate-pulse h-32" style={{ borderColor:'var(--border)' }} />)}</div>
        ) : noticias.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border shadow-sm" style={{ borderColor:'var(--border)' }}>
            <Newspaper className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color:'var(--text-muted)' }}>No hay noticias en esta categoría</div>
          </div>
        ) : (
          <div className="space-y-3">
            {noticias.map(n => (
              <div key={n.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                {n.imagen_url && <img src={n.imagen_url} alt={n.titulo} className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase" style={{ color:'var(--terracotta)' }}>{n.categoria}</span>
                    <span className="text-xs" style={{ color:'var(--text-muted)' }}>{formatDistanceToNow(new Date(n.created_at), { addSuffix:true, locale:es })}</span>
                  </div>
                  <h2 className="font-bold text-sm mb-1" style={{ color:'var(--text-primary)' }}>{n.titulo}</h2>
                  {n.resumen && <p className="text-xs mb-3 line-clamp-2" style={{ color:'var(--text-secondary)' }}>{n.resumen}</p>}
                  <div className="flex items-center justify-between">
                    <Link href={`/noticias/${n.id}`} className="flex items-center gap-1 text-xs font-medium" style={{ color:'var(--terracotta)' }}>
                      Leer más <ChevronRight className="w-3 h-3" />
                    </Link>
                    <ShareWhatsApp texto={`📰 ${n.titulo}`} url={`https://caborca.app/noticias/${n.id}`} />
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
