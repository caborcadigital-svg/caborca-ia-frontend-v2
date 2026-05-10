'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, Newspaper, CalendarDays, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState<any>({ noticias:[], negocios:[], eventos:[] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (!q.trim() || q.length < 2) { setResultados({ noticias:[], negocios:[], eventos:[] }); return; }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [noticias, negocios, eventos] = await Promise.all([
          fetch(API + '/noticias?q=' + encodeURIComponent(q) + '&limit=3').then(r => r.json()).catch(() => []),
          fetch(API + '/negocios?q=' + encodeURIComponent(q) + '&limit=3').then(r => r.json()).catch(() => []),
          fetch(API + '/eventos?q=' + encodeURIComponent(q) + '&limit=3').then(r => r.json()).catch(() => []),
        ]);
        setResultados({ noticias: noticias || [], negocios: negocios || [], eventos: eventos || [] });
      } finally { setIsLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  const total = resultados.noticias.length + resultados.negocios.length + resultados.eventos.length;

  const ir = (href: string) => { router.push(href); setOpen(false); setQ(''); };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all hover:shadow-sm"
        style={{ borderColor:'var(--border)', color:'var(--text-muted)', background:'var(--surface)' }}>
        <Search className="w-4 h-4" />
        <span className="hidden sm:block">Buscar...</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-3" style={{ background:'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background:'var(--surface)' }}>
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor:'var(--border)' }}>
              <Search className="w-5 h-5 shrink-0" style={{ color:'var(--text-muted)' }} />
              <input ref={inputRef} type="text" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Buscar noticias, negocios, eventos..."
                className="flex-1 bg-transparent text-sm outline-none" style={{ color:'var(--text-primary)' }} />
              <button onClick={() => { setOpen(false); setQ(''); }}>
                <X className="w-5 h-5" style={{ color:'var(--text-muted)' }} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading && <div className="p-4 text-center text-sm" style={{ color:'var(--text-muted)' }}>Buscando...</div>}

              {!isLoading && q.length >= 2 && total === 0 && (
                <div className="p-6 text-center text-sm" style={{ color:'var(--text-muted)' }}>No se encontraron resultados para "{q}"</div>
              )}

              {resultados.noticias.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold uppercase" style={{ color:'var(--text-muted)', background:'var(--sand)' }}>Noticias</div>
                  {resultados.noticias.map((n: any) => (
                    <button key={n.id} onClick={() => ir('/noticias/' + n.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-all border-b" style={{ borderColor:'var(--border)' }}>
                      <Newspaper className="w-4 h-4 shrink-0" style={{ color:'#6B3FA0' }} />
                      <span className="text-sm line-clamp-1" style={{ color:'var(--text-primary)' }}>{n.titulo}</span>
                    </button>
                  ))}
                </div>
              )}

              {resultados.negocios.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold uppercase" style={{ color:'var(--text-muted)', background:'var(--sand)' }}>Negocios</div>
                  {resultados.negocios.map((n: any) => (
                    <button key={n.id} onClick={() => ir('/negocios/' + n.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-all border-b" style={{ borderColor:'var(--border)' }}>
                      <Store className="w-4 h-4 shrink-0" style={{ color:'#2D5F8A' }} />
                      <div>
                        <div className="text-sm" style={{ color:'var(--text-primary)' }}>{n.nombre}</div>
                        <div className="text-xs capitalize" style={{ color:'var(--text-muted)' }}>{n.categoria}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {resultados.eventos.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-bold uppercase" style={{ color:'var(--text-muted)', background:'var(--sand)' }}>Eventos</div>
                  {resultados.eventos.map((e: any) => (
                    <button key={e.id} onClick={() => ir('/eventos')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:opacity-80 transition-all border-b" style={{ borderColor:'var(--border)' }}>
                      <CalendarDays className="w-4 h-4 shrink-0" style={{ color:'#4A7C59' }} />
                      <div>
                        <div className="text-sm" style={{ color:'var(--text-primary)' }}>{e.nombre}</div>
                        <div className="text-xs" style={{ color:'var(--text-muted)' }}>{new Date(e.fecha_inicio).toLocaleDateString('es-MX')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!q && (
                <div className="p-4 text-center text-xs" style={{ color:'var(--text-muted)' }}>
                  Escribe para buscar en noticias, negocios y eventos
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
