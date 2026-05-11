'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { useDarkMode } from '../../hooks/useDarkMode';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const TIPOS = ['accidente','tráfico','apagón','retén','seguridad','otro'];
const TIPO_EMOJIS: Record<string,string> = { accidente:'🚗',tráfico:'🚦','apagón':'⚡',retén:'🚔',seguridad:'🚨',otro:'📋' };

const TIPO_COLORS_LIGHT: Record<string,{bg:string,border:string,color:string}> = {
  accidente:{bg:'#FEF2F2',border:'#FECACA',color:'#DC2626'},
  tráfico:{bg:'#FFF7ED',border:'#FED7AA',color:'#EA580C'},
  'apagón':{bg:'#FFFBEB',border:'#FDE68A',color:'#D97706'},
  retén:{bg:'#EFF6FF',border:'#BFDBFE',color:'#2563EB'},
  seguridad:{bg:'#FEF2F2',border:'#FECACA',color:'#DC2626'},
  otro:{bg:'#F9FAFB',border:'#E5E7EB',color:'#6B7280'},
};

const TIPO_COLORS_DARK: Record<string,{bg:string,border:string,color:string}> = {
  accidente:{bg:'rgba(220,38,38,0.08)',border:'rgba(220,38,38,0.2)',color:'#F87171'},
  tráfico:{bg:'rgba(234,88,12,0.08)',border:'rgba(234,88,12,0.2)',color:'#FB923C'},
  'apagón':{bg:'rgba(217,119,6,0.08)',border:'rgba(217,119,6,0.2)',color:'#FBBF24'},
  retén:{bg:'rgba(37,99,235,0.08)',border:'rgba(37,99,235,0.2)',color:'#60A5FA'},
  seguridad:{bg:'rgba(220,38,38,0.08)',border:'rgba(220,38,38,0.2)',color:'#F87171'},
  otro:{bg:'rgba(107,114,128,0.08)',border:'rgba(107,114,128,0.2)',color:'#9CA3AF'},
};

export default function ReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo:'accidente', descripcion:'', ubicacion:'', email_contacto:'' });
  const [enviando, setEnviando] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { dark } = useDarkMode();

  const TC = dark ? TIPO_COLORS_DARK : TIPO_COLORS_LIGHT;
  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL+'/reportes?limit=30').then(r=>r.json()).then(d=>setReportes(Array.isArray(d)?d:[])).finally(()=>setIsLoading(false));
  }, []);

  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  const enviar = async () => {
    if (!form.descripcion||!form.ubicacion) { toast.error('Descripción y ubicación requeridas'); return; }
    setEnviando(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL+'/reportes', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      if (!res.ok) throw new Error('Error');
      toast.success('Reporte enviado, gracias');
      setShowForm(false); setForm({tipo:'accidente',descripcion:'',ubicacion:'',email_contacto:''});
      fetch(process.env.NEXT_PUBLIC_API_URL+'/reportes?limit=30').then(r=>r.json()).then(d=>setReportes(Array.isArray(d)?d:[]));
    } catch { toast.error('Error enviando reporte'); }
    finally { setEnviando(false); }
  };

  const inp = { background:card, border:'0.5px solid '+border, borderRadius:'10px', padding:'10px 12px', fontSize:'13px', color:textP, outline:'none', width:'100%' };

  return (
    <MainLayout>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
          <div>
            <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Reportes ciudadanos</h1>
            <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Alertas y situaciones en Caborca</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)}
            style={{ background:showForm?card:'#E05C3A', border:'0.5px solid '+(showForm?border:'#E05C3A'), borderRadius:'10px', padding:'8px 14px', fontSize:'12px', fontWeight:600, color:showForm?textP:'white', cursor:'pointer' }}>
            {showForm?'Cancelar':'+ Reportar'}
          </button>
        </div>

        {showForm && (
          <div style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', padding:'14px', marginBottom:'12px' }}>
            <div style={{ fontSize:'12px', fontWeight:600, color:textP, marginBottom:'12px', letterSpacing:'0.3px' }}>NUEVO REPORTE</div>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'10px' }}>
              {TIPOS.map(t=>(
                <button key={t} onClick={()=>set('tipo',t)}
                  style={{ background: form.tipo===t?TC[t].bg:card, border:'0.5px solid '+(form.tipo===t?TC[t].border:border), borderRadius:'20px', padding:'5px 12px', fontSize:'11px', fontWeight:600, color: form.tipo===t?TC[t].color:textM, cursor:'pointer', display:'flex', alignItems:'center', gap:'4px' }}>
                  {TIPO_EMOJIS[t]} {t}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <textarea placeholder="Describe la situación..." value={form.descripcion} onChange={e=>set('descripcion',e.target.value)} rows={3}
                style={{ ...inp, resize:'none', fontFamily:'inherit' } as any} />
              <input type="text" placeholder="¿Dónde ocurre? (calle, colonia...)" value={form.ubicacion} onChange={e=>set('ubicacion',e.target.value)} style={inp as any} />
              <input type="email" placeholder="Email de contacto (opcional)" value={form.email_contacto} onChange={e=>set('email_contacto',e.target.value)} style={inp as any} />
              <button onClick={enviar} disabled={enviando}
                style={{ background:'#E05C3A', border:'none', borderRadius:'10px', padding:'11px', fontSize:'13px', fontWeight:600, color:'white', cursor:'pointer', opacity:enviando?0.6:1 }}>
                {enviando?'Enviando...':'Enviar reporte'}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {[...Array(4)].map((_,i)=><div key={i} style={{ background:card, border:'0.5px solid '+border, borderRadius:'12px', height:'72px', opacity:0.4 }} />)}
          </div>
        ) : reportes.length===0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'13px' }}>No hay reportes activos</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {reportes.map(r => {
              const col = TC[r.tipo]||TC.otro;
              return (
                <div key={r.id} style={{ background:col.bg, border:'0.5px solid '+col.border, borderRadius:'12px', padding:'12px 14px', borderLeft:'3px solid '+col.color }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                    <span style={{ fontSize:'16px' }}>{TIPO_EMOJIS[r.tipo]||'📋'}</span>
                    <span style={{ fontSize:'10px', fontWeight:700, color:col.color, textTransform:'uppercase', letterSpacing:'0.5px' }}>{r.tipo}</span>
                    <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'4px' }}>
                      {r.estado==='aprobado' && <div style={{ width:'5px', height:'5px', background:'#4ADE80', borderRadius:'50%' }} />}
                      <span style={{ fontSize:'10px', color:textM }}>{formatDistanceToNow(new Date(r.created_at),{addSuffix:true,locale:es})}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:'12px', fontWeight:600, color:col.color }}>{r.descripcion}</div>
                  <div style={{ fontSize:'11px', color:col.color, opacity:0.6, marginTop:'3px' }}>📍 {r.ubicacion}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
