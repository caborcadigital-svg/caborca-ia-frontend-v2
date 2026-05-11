'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '../MainLayout';
import { negociosAPI } from '../../lib/api';
import { useDarkMode } from '../../hooks/useDarkMode';
import { Search } from 'lucide-react';

const CATEGORIAS_ICONOS: Record<string,string> = {
  restaurante:'🍽️',farmacia:'💊',supermercado:'🛒',tienda:'🏪',servicio:'🔧',hotel:'🏨',
  'cafe':'☕',taqueria:'🌮',panaderia:'🥖',mecanico:'🔩',otro:'📍',
};

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { dark } = useDarkMode();

  useEffect(() => { negociosAPI.getAll().then(setNegocios).finally(()=>setIsLoading(false)); }, []);

  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';
  const blue = dark?'#60A5FA':'#2D5F8A';
  const cardBlue = dark?'rgba(37,99,235,0.08)':'#EEF4F9';
  const borderBlue = dark?'rgba(37,99,235,0.2)':'#BFDBFE';

  const categorias = ['todos',...Array.from(new Set(negocios.map(n=>n.categoria?.toLowerCase()||'otro')))];
  const filtrados = negocios.filter(n => {
    const matchCat = filtro==='todos'||n.categoria?.toLowerCase()===filtro;
    const matchQ = !busqueda||(n.nombre+' '+(n.categoria||'')).toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchQ;
  });
  const destacados = filtrados.filter(n=>n.destacado);
  const resto = filtrados.filter(n=>!n.destacado);

  return (
    <MainLayout>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ marginBottom:'12px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Negocios</h1>
          <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Directorio local de Caborca</p>
        </div>
        <div style={{ position:'relative', marginBottom:'10px' }}>
          <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
          <input type="text" placeholder="Buscar negocios..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
            style={{ width:'100%', background:card, border:'0.5px solid '+border, borderRadius:'10px', padding:'9px 12px 9px 32px', fontSize:'13px', color:textP, outline:'none' }} />
        </div>
        <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'12px', paddingBottom:'2px' }}>
          {categorias.map(cat=>(
            <button key={cat} onClick={()=>setFiltro(cat)}
              style={{ background: filtro===cat?'#2D5F8A':card, color: filtro===cat?'white':textM, border:'0.5px solid '+(filtro===cat?'#2D5F8A':border), borderRadius:'20px', padding:'5px 12px', fontSize:'11px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, textTransform:'capitalize' }}>
              {CATEGORIAS_ICONOS[cat]||''} {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {[...Array(5)].map((_,i)=><div key={i} style={{ background:card, border:'0.5px solid '+border, borderRadius:'12px', height:'72px', opacity:0.4 }} />)}
          </div>
        ) : filtrados.length===0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'13px' }}>No se encontraron negocios</div>
        ) : (
          <>
            {destacados.length > 0 && (
              <div style={{ marginBottom:'14px' }}>
                <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:'8px' }}>⭐ Destacados</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  {destacados.map(n=>(
                    <Link key={n.id} href={'/negocios/'+n.id} style={{ background:cardBlue, border:'0.5px solid '+borderBlue, borderRadius:'14px', overflow:'hidden', textDecoration:'none', display:'block' }}>
                      {n.imagen_url ? <img src={n.imagen_url} alt={n.nombre} style={{ width:'100%', height:'70px', objectFit:'cover' }} /> : <div style={{ height:'70px', background:'var(--sand-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px' }}>{CATEGORIAS_ICONOS[n.categoria?.toLowerCase()]||'🏪'}</div>}
                      <div style={{ padding:'8px 10px' }}>
                        <div style={{ fontSize:'11px', fontWeight:700, color:textP, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.nombre}</div>
                        <div style={{ fontSize:'9px', color:blue, marginTop:'1px', textTransform:'capitalize' }}>{n.categoria}</div>
                        {n.telefono && <div style={{ fontSize:'9px', color:textM, marginTop:'2px' }}>📞 {n.telefono}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {resto.length > 0 && (
              <div>
                {destacados.length>0 && <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:'8px' }}>Todos</div>}
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  {resto.map(n=>(
                    <Link key={n.id} href={'/negocios/'+n.id} style={{ background:card, border:'0.5px solid '+border, borderRadius:'12px', padding:'10px 12px', display:'flex', gap:'10px', alignItems:'center', textDecoration:'none' }}>
                      {n.imagen_url ? <img src={n.imagen_url} alt={n.nombre} style={{ width:'44px', height:'44px', borderRadius:'10px', objectFit:'cover', flexShrink:0 }} /> : <div style={{ width:'44px', height:'44px', background:'var(--sand-dark)', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>{CATEGORIAS_ICONOS[n.categoria?.toLowerCase()]||'🏪'}</div>}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'13px', fontWeight:600, color:textP, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.nombre}</div>
                        <div style={{ fontSize:'10px', color:textM, textTransform:'capitalize', marginTop:'1px' }}>{n.categoria}</div>
                        {n.direccion && <div style={{ fontSize:'10px', color:textM, marginTop:'1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>📍 {n.direccion}</div>}
                      </div>
                      {n.telefono && <a href={'https://wa.me/52'+n.telefono.replace(/\D/g,'')} onClick={e=>e.stopPropagation()} target="_blank" rel="noopener noreferrer"
                        style={{ background:'#25D366', color:'white', fontSize:'11px', padding:'5px 10px', borderRadius:'8px', textDecoration:'none', fontWeight:600, flexShrink:0, whiteSpace:'nowrap' }}>WA</a>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
