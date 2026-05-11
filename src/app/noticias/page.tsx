'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '../MainLayout';
import { noticiasAPI } from '../../lib/api';
import { useDarkMode } from '../../hooks/useDarkMode';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search } from 'lucide-react';

const CATEGORIAS = ['todas','local','gobierno','deportes','cultura','economia','seguridad'];

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { dark } = useDarkMode();

  useEffect(() => {
    noticiasAPI.getAll().then(setNoticias).finally(()=>setIsLoading(false));
  }, []);

  const filtradas = noticias.filter(n => {
    const matchCat = filtro==='todas' || n.categoria?.toLowerCase()===filtro;
    const matchQ = !busqueda || n.titulo.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchQ;
  });

  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';

  return (
    <MainLayout>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ marginBottom:'12px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Noticias</h1>
          <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Lo más reciente de Heroica Caborca</p>
        </div>
        <div style={{ position:'relative', marginBottom:'10px' }}>
          <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input type="text" placeholder="Buscar noticias..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
            style={{ width:'100%', background:card, border:'0.5px solid '+border, borderRadius:'10px', padding:'9px 12px 9px 32px', fontSize:'13px', color:textP, outline:'none' }} />
        </div>
        <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'12px', paddingBottom:'2px' }}>
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={()=>setFiltro(cat)}
              style={{ background: filtro===cat?'#E05C3A':card, color: filtro===cat?'white':textM, border:'0.5px solid '+(filtro===cat?'#E05C3A':border), borderRadius:'20px', padding:'5px 12px', fontSize:'11px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, textTransform:'capitalize', letterSpacing:'0.2px' }}>
              {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[...Array(4)].map((_,i)=>(
              <div key={i} style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', padding:'12px', height:'80px', opacity:0.5 }} />
            ))}
          </div>
        ) : filtradas.length===0 ? (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text-muted)', fontSize:'13px' }}>No hay noticias para mostrar</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {filtradas.map((n,i) => (
              <Link key={n.id} href={'/noticias/'+n.id} style={{ textDecoration:'none', display:'block' }}>
                <div style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', overflow:'hidden', display:'flex', gap:'0', transition:'opacity 0.2s' }}>
                  {i===0 && n.imagen_url ? (
                    <div style={{ display:'flex', flexDirection:'column' }}>
                      <img src={n.imagen_url} alt={n.titulo} style={{ width:'100%', height:'160px', objectFit:'cover' }} />
                      <div style={{ padding:'12px' }}>
                        <div style={{ fontSize:'9px', color:'#E05C3A', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'4px' }}>{n.categoria}</div>
                        <div style={{ fontSize:'14px', fontWeight:600, color:textP, lineHeight:1.35, marginBottom:'6px' }}>{n.titulo}</div>
                        <div style={{ fontSize:'10px', color:textM }}>{formatDistanceToNow(new Date(n.created_at),{addSuffix:true,locale:es})}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:'10px', padding:'10px 12px', alignItems:'center', width:'100%' }}>
                      {n.imagen_url
                        ? <img src={n.imagen_url} alt={n.titulo} style={{ width:'52px', height:'52px', borderRadius:'10px', objectFit:'cover', flexShrink:0 }} />
                        : <div style={{ width:'52px', height:'52px', background:'var(--sand-dark)', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>📰</div>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'9px', color:'#E05C3A', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'2px' }}>{n.categoria}</div>
                        <div style={{ fontSize:'12px', fontWeight:600, color:textP, lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' } as any}>{n.titulo}</div>
                        <div style={{ fontSize:'10px', color:textM, marginTop:'3px' }}>{formatDistanceToNow(new Date(n.created_at),{addSuffix:true,locale:es})}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
