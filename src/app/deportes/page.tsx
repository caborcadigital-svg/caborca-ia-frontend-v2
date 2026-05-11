'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { deportesAPI } from '../../lib/api';
import { useDarkMode } from '../../hooks/useDarkMode';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DeportesPage() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ equipo_local:'', equipo_visitante:'', marcador_local:'', marcador_visitante:'', liga:'', deporte:'Béisbol', lugar:'', nombre_contacto:'' });
  const [enviando, setEnviando] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { dark } = useDarkMode();

  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';
  const textS = dark?'rgba(255,255,255,0.4)':'var(--text-secondary)';
  const cardOrange = dark?'rgba(232,130,58,0.08)':'#FEF0E8';
  const borderOrange = dark?'rgba(232,130,58,0.2)':'#FDD5B4';
  const inp = { background:card, border:'0.5px solid '+border, borderRadius:'10px', padding:'10px 12px', fontSize:'13px', color:textP, outline:'none', width:'100%' };

  useEffect(() => { deportesAPI.getPartidos().then(setPartidos).finally(()=>setIsLoading(false)); }, []);
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  const enviar = async () => {
    if (!form.equipo_local||!form.equipo_visitante) { toast.error('Equipos requeridos'); return; }
    setEnviando(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL+'/resultados-deportivos', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error('Error');
      toast.success('Resultado enviado, pendiente de revisión');
      setShowForm(false);
    } catch { toast.error('Error enviando resultado'); }
    finally { setEnviando(false); }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
          <div>
            <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Deportes</h1>
            <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Ligas y resultados de Caborca</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)}
            style={{ background:showForm?card:'#E8823A', border:'0.5px solid '+(showForm?border:'#E8823A'), borderRadius:'10px', padding:'8px 14px', fontSize:'12px', fontWeight:600, color:showForm?textP:'white', cursor:'pointer' }}>
            {showForm?'Cancelar':'+ Resultado'}
          </button>
        </div>

        {showForm && (
          <div style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', padding:'14px', marginBottom:'12px' }}>
            <div style={{ fontSize:'12px', fontWeight:600, color:textP, marginBottom:'12px', letterSpacing:'0.3px' }}>ENVIAR RESULTADO</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'6px', alignItems:'center' }}>
                <input placeholder="Equipo local" value={form.equipo_local} onChange={e=>set('equipo_local',e.target.value)} style={inp as any} />
                <div style={{ textAlign:'center', fontSize:'12px', color:textM, fontWeight:600 }}>VS</div>
                <input placeholder="Equipo visitante" value={form.equipo_visitante} onChange={e=>set('equipo_visitante',e.target.value)} style={inp as any} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'6px', alignItems:'center' }}>
                <input type="number" placeholder="0" value={form.marcador_local} onChange={e=>set('marcador_local',e.target.value)} style={{ ...inp, textAlign:'center' } as any} />
                <div style={{ textAlign:'center', fontSize:'18px', color:textM, fontWeight:700 }}>-</div>
                <input type="number" placeholder="0" value={form.marcador_visitante} onChange={e=>set('marcador_visitante',e.target.value)} style={{ ...inp, textAlign:'center' } as any} />
              </div>
              <input placeholder="Liga o torneo" value={form.liga} onChange={e=>set('liga',e.target.value)} style={inp as any} />
              <input placeholder="Lugar del partido (opcional)" value={form.lugar} onChange={e=>set('lugar',e.target.value)} style={inp as any} />
              <input placeholder="Tu nombre (opcional)" value={form.nombre_contacto} onChange={e=>set('nombre_contacto',e.target.value)} style={inp as any} />
              <button onClick={enviar} disabled={enviando}
                style={{ background:'#E8823A', border:'none', borderRadius:'10px', padding:'11px', fontSize:'13px', fontWeight:600, color:'white', cursor:'pointer', opacity:enviando?0.6:1 }}>
                {enviando?'Enviando...':'Enviar resultado'}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {[...Array(3)].map((_,i)=><div key={i} style={{ background:card, border:'0.5px solid '+border, borderRadius:'12px', height:'80px', opacity:0.4 }} />)}
          </div>
        ) : partidos.length===0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'13px' }}>No hay partidos registrados</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {partidos.map(p => (
              <div key={p.id} style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', padding:'14px' }}>
                <div style={{ fontSize:'10px', color:textM, textAlign:'center', marginBottom:'10px', letterSpacing:'0.3px' }}>
                  ⚾ {p.liga} · {p.deporte}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontSize:'13px', fontWeight:700, color:textP }}>{p.equipo_local}</div>
                    <div style={{ fontSize:'10px', color:textM, marginTop:'2px' }}>Local</div>
                  </div>
                  <div style={{ background: dark?'rgba(232,130,58,0.15)':cardOrange, border:'0.5px solid '+borderOrange, borderRadius:'12px', padding:'8px 16px', margin:'0 10px' }}>
                    <div style={{ fontSize:'22px', fontWeight:800, color: dark?'#FB923C':'#E8823A', letterSpacing:'2px', lineHeight:1 }}>
                      {p.marcador_local??'-'} - {p.marcador_visitante??'-'}
                    </div>
                    <div style={{ fontSize:'9px', color: dark?'rgba(251,146,60,0.5)':'#E8823A', textAlign:'center', marginTop:'2px', letterSpacing:'0.3px' }}>FINAL</div>
                  </div>
                  <div style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontSize:'13px', fontWeight:700, color:textP }}>{p.equipo_visitante}</div>
                    <div style={{ fontSize:'10px', color:textM, marginTop:'2px' }}>Visitante</div>
                  </div>
                </div>
                {p.lugar && <div style={{ fontSize:'10px', color:textM, textAlign:'center', marginTop:'8px' }}>📍 {p.lugar}</div>}
                {p.created_at && <div style={{ fontSize:'10px', color:textM, textAlign:'center', marginTop:'3px' }}>{formatDistanceToNow(new Date(p.created_at),{addSuffix:true,locale:es})}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
