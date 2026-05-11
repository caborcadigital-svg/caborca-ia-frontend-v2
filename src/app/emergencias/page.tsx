'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { useDarkMode } from '../../hooks/useDarkMode';

const TIPO_COLORS: Record<string,{icon:string,dark:string,light:string,border_d:string,border_l:string,text_d:string,text_l:string}> = {
  hospital:{icon:'🏥',dark:'rgba(220,38,38,0.08)',light:'#FEF2F2',border_d:'rgba(220,38,38,0.2)',border_l:'#FECACA',text_d:'#F87171',text_l:'#DC2626'},
  policia:{icon:'🚔',dark:'rgba(37,99,235,0.08)',light:'#EFF6FF',border_d:'rgba(37,99,235,0.2)',border_l:'#BFDBFE',text_d:'#60A5FA',text_l:'#2563EB'},
  bomberos:{icon:'🚒',dark:'rgba(234,88,12,0.08)',light:'#FFF7ED',border_d:'rgba(234,88,12,0.2)',border_l:'#FED7AA',text_d:'#FB923C',text_l:'#EA580C'},
  ambulancia:{icon:'🚑',dark:'rgba(220,38,38,0.08)',light:'#FEF2F2',border_d:'rgba(220,38,38,0.2)',border_l:'#FECACA',text_d:'#F87171',text_l:'#DC2626'},
  otro:{icon:'📞',dark:'rgba(107,114,128,0.08)',light:'#F9FAFB',border_d:'rgba(107,114,128,0.2)',border_l:'#E5E7EB',text_d:'#9CA3AF',text_l:'#6B7280'},
};

export default function EmergenciasPage() {
  const [emergencias, setEmergencias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const { dark } = useDarkMode();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL+'/emergencias').then(r=>r.json()).then(d=>setEmergencias(Array.isArray(d)?d:[])).finally(()=>setIsLoading(false));
  }, []);

  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';

  const categorias = ['todos',...Array.from(new Set(emergencias.map(e=>e.categoria||'otro')))];
  const filtradas = filtro==='todos' ? emergencias : emergencias.filter(e=>(e.categoria||'otro')===filtro);

  return (
    <MainLayout>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ marginBottom:'12px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Emergencias</h1>
          <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Directorio de servicios de emergencia</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginBottom:'14px' }}>
          <a href="tel:911" style={{ background:'rgba(220,38,38,0.1)', border:'0.5px solid rgba(220,38,38,0.3)', borderRadius:'12px', padding:'14px', display:'flex', gap:'10px', alignItems:'center', textDecoration:'none' }}>
            <div style={{ fontSize:'28px' }}>🆘</div>
            <div><div style={{ fontSize:'20px', fontWeight:800, color: dark?'#F87171':'#DC2626' }}>911</div><div style={{ fontSize:'10px', color: dark?'rgba(248,113,113,0.5)':'#DC2626', opacity:0.7, letterSpacing:'0.3px' }}>EMERGENCIAS</div></div>
          </a>
          <a href="tel:6376372626" style={{ background:'rgba(37,99,235,0.1)', border:'0.5px solid rgba(37,99,235,0.3)', borderRadius:'12px', padding:'14px', display:'flex', gap:'10px', alignItems:'center', textDecoration:'none' }}>
            <div style={{ fontSize:'28px' }}>🚑</div>
            <div><div style={{ fontSize:'14px', fontWeight:700, color: dark?'#60A5FA':'#2563EB' }}>Cruz Roja</div><div style={{ fontSize:'10px', color: dark?'rgba(96,165,250,0.5)':'#2563EB', opacity:0.7 }}>637-637-2626</div></div>
          </a>
        </div>
        <div style={{ display:'flex', gap:'6px', overflowX:'auto', marginBottom:'12px', paddingBottom:'2px' }}>
          {categorias.map(cat=>(
            <button key={cat} onClick={()=>setFiltro(cat)}
              style={{ background: filtro===cat?'#E05C3A':card, color: filtro===cat?'white':textM, border:'0.5px solid '+(filtro===cat?'#E05C3A':border), borderRadius:'20px', padding:'5px 12px', fontSize:'11px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, textTransform:'capitalize' }}>
              {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {[...Array(5)].map((_,i)=><div key={i} style={{ background:card, border:'0.5px solid '+border, borderRadius:'12px', height:'68px', opacity:0.4 }} />)}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {filtradas.map(e => {
              const col = TIPO_COLORS[e.tipo]||TIPO_COLORS.otro;
              return (
                <div key={e.id} style={{ background: dark?col.dark:col.light, border:'0.5px solid '+(dark?col.border_d:col.border_l), borderRadius:'12px', padding:'12px 14px', display:'flex', gap:'10px', alignItems:'center' }}>
                  <div style={{ fontSize:'24px', flexShrink:0 }}>{col.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'13px', fontWeight:700, color: dark?col.text_d:col.text_l }}>{e.nombre}</div>
                    {e.descripcion && <div style={{ fontSize:'11px', color:textM, marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.descripcion}</div>}
                    {e.direccion && <div style={{ fontSize:'10px', color:textM, marginTop:'2px' }}>📍 {e.direccion}</div>}
                  </div>
                  <div style={{ flexShrink:0, display:'flex', flexDirection:'column', gap:'4px' }}>
                    {e.telefono && <a href={'tel:'+e.telefono} style={{ background: dark?col.text_d:col.text_l, color:'white', fontSize:'11px', padding:'5px 10px', borderRadius:'8px', textDecoration:'none', fontWeight:600, textAlign:'center', whiteSpace:'nowrap' }}>{e.telefono}</a>}
                    {e.telefono2 && <a href={'tel:'+e.telefono2} style={{ background:'var(--sand-dark)', color:'var(--text-secondary)', fontSize:'11px', padding:'4px 10px', borderRadius:'8px', textDecoration:'none', textAlign:'center', whiteSpace:'nowrap' }}>{e.telefono2}</a>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
