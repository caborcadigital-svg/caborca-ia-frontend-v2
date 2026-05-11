'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { eventosAPI } from '../../lib/api';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dark } = useDarkMode();

  useEffect(() => { eventosAPI.getAll({}).then(setEventos).finally(()=>setIsLoading(false)); }, []);

  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';
  const green = dark?'#6EE7A0':'#4A7C59';
  const cardGreen = dark?'rgba(74,124,89,0.08)':'#EEF5F0';
  const borderGreen = dark?'rgba(74,124,89,0.2)':'#C8E0CC';

  const ahora = new Date();
  const proximos = eventos.filter(e => new Date(e.fecha_inicio) >= ahora);
  const pasados = eventos.filter(e => new Date(e.fecha_inicio) < ahora);

  const EventoCard = ({ e }: { e: any }) => {
    const fecha = new Date(e.fecha_inicio);
    const esHoy = fecha.toDateString() === ahora.toDateString();
    return (
      <div style={{ background: esHoy?cardGreen:card, border:'0.5px solid '+(esHoy?borderGreen:border), borderRadius:'14px', padding:'14px', display:'flex', gap:'12px' }}>
        <div style={{ textAlign:'center', minWidth:'44px' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color: esHoy?green:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {fecha.toLocaleDateString('es-MX',{month:'short'})}
          </div>
          <div style={{ fontSize:'24px', fontWeight:800, color: esHoy?green:'var(--text-primary)', lineHeight:1 }}>
            {fecha.getDate()}
          </div>
          {esHoy && <div style={{ fontSize:'9px', background:green, color:'white', borderRadius:'4px', padding:'1px 5px', marginTop:'2px', fontWeight:700 }}>HOY</div>}
        </div>
        <div style={{ flex:1, minWidth:0, borderLeft:'2px solid '+(esHoy?borderGreen:border), paddingLeft:'12px' }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:textP, marginBottom:'4px', lineHeight:1.3 }}>{e.nombre}</div>
          {e.descripcion && <div style={{ fontSize:'11px', color:textM, marginBottom:'5px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' } as any}>{e.descripcion}</div>}
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {e.lugar && <div style={{ fontSize:'10px', color:textM }}>📍 {e.lugar}</div>}
            <div style={{ fontSize:'10px', color:textM }}>🕐 {fecha.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}</div>
            {e.categoria && <div style={{ fontSize:'10px', color: esHoy?green:'var(--text-muted)' }}>🏷️ {e.categoria}</div>}
          </div>
          {e.lat && e.lng && (
            <a href={`https://maps.google.com/?q=${e.lat},${e.lng}`} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:'4px', marginTop:'8px', fontSize:'11px', color:'#E05C3A', fontWeight:500, textDecoration:'none' }}>
              Ver en mapa →
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ marginBottom:'14px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Eventos</h1>
          <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Actividades en Heroica Caborca</p>
        </div>

        {isLoading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {[...Array(3)].map((_,i)=><div key={i} style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', height:'90px', opacity:0.4 }} />)}
          </div>
        ) : (
          <>
            {proximos.length > 0 && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:'8px' }}>Próximos eventos</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  {proximos.map(e=><EventoCard key={e.id} e={e} />)}
                </div>
              </div>
            )}
            {pasados.length > 0 && (
              <div>
                <div style={{ fontSize:'11px', fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:'8px' }}>Pasados</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px', opacity:0.6 }}>
                  {pasados.slice(0,5).map(e=><EventoCard key={e.id} e={e} />)}
                </div>
              </div>
            )}
            {eventos.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'13px' }}>No hay eventos registrados</div>}
          </>
        )}
      </div>
    </MainLayout>
  );
}
