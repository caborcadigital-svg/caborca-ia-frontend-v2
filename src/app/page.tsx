'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MainLayout from './MainLayout';
import PullToRefresh from '../components/PullToRefresh';
import { climaAPI, noticiasAPI, eventosAPI, deportesAPI, negociosAPI } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDarkMode } from '../hooks/useDarkMode';

const DEFAULT_CONFIG = {
  hero_gradient: 'linear-gradient(160deg, #1a3356 0%, #5a3490 50%, #3a1a6e 100%)',
  hero_bg_type: 'gradient',
  hero_imagen: '',
  hero_color1: '#1E3A5F',
  hero_color2: '#E05C3A',
};

const TIPO_EMOJIS: Record<string,string> = {
  accidente:'🚗','apagón':'⚡',tráfico:'🚦',retén:'🚔',seguridad:'🚨',otro:'📋'
};

const CLIMA_ICONOS: Record<string,string> = {
  'cielo claro':'☀️','nubes':'⛅','lluvia':'🌧️','tormenta':'⛈️','niebla':'🌫️','soleado':'☀️','nublado':'☁️',
};

function getClimaIcono(desc: string) {
  const d = (desc||'').toLowerCase();
  for (const [k,v] of Object.entries(CLIMA_ICONOS)) { if (d.includes(k)) return v; }
  return '☀️';
}

export default function HomePage() {
  const [clima, setClima] = useState<any>(null);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [negociosDestacados, setNegociosDestacados] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [heroConfig, setHeroConfig] = useState(DEFAULT_CONFIG);
  const { dark } = useDarkMode();

  const getHeroBg = () => {
    if (heroConfig.hero_bg_type === 'imagen' && heroConfig.hero_imagen)
      return { backgroundImage:'url('+heroConfig.hero_imagen+')', backgroundSize:'cover', backgroundPosition:'center' };
    if (heroConfig.hero_gradient === 'custom')
      return { background:'linear-gradient(160deg,'+heroConfig.hero_color1+','+heroConfig.hero_color2+')' };
    return { background: heroConfig.hero_gradient };
  };

  const cargarDatos = useCallback(async () => {
    await Promise.allSettled([
      climaAPI.getCurrent().then(setClima),
      noticiasAPI.getAll().then(d => setNoticias(d.slice(0,4))),
      eventosAPI.getAll({ proximos:true }).then(d => setEventos(d.slice(0,3))),
      negociosAPI.getAll().then(d => setNegociosDestacados(d.filter((n:any)=>n.destacado).slice(0,4))),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/reportes?limit=3').then(r=>r.json()).then(d=>setReportes(Array.isArray(d)?d:[])).catch(()=>{}),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/publicidad').then(r=>r.json()).then(d=>setBanners(Array.isArray(d)?d.filter((b:any)=>b.activo):[])).catch(()=>{}),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/config').then(r=>r.json()).then(d=>{if(d&&Object.keys(d).length)setHeroConfig(c=>({...c,...d}));}).catch(()=>{}),
    ]);
  }, []);

  useEffect(() => { cargarDatos(); }, []);
  useEffect(() => {
    if (banners.length<=1) return;
    const t = setInterval(()=>setBannerIdx(i=>(i+1)%banners.length),4000);
    return ()=>clearInterval(t);
  }, [banners.length]);

  const banner = banners[bannerIdx];
  const reporteActivo = reportes[0];
  const noticiaDestacada = noticias[0];
  const noticiasResto = noticias.slice(1,3);
  const eventoHoy = eventos[0];

  const c = {
    card: dark ? 'rgba(255,255,255,0.03)' : 'var(--card)',
    border: dark ? 'rgba(255,255,255,0.08)' : 'var(--border)',
    cardRed: dark ? 'rgba(220,38,38,0.08)' : '#FEF2F2',
    borderRed: dark ? 'rgba(220,38,38,0.2)' : '#FECACA',
    cardGreen: dark ? 'rgba(74,124,89,0.08)' : '#EEF5F0',
    borderGreen: dark ? 'rgba(74,124,89,0.2)' : '#C8E0CC',
    cardPurple: dark ? 'rgba(107,63,160,0.1)' : '#F3EEF9',
    borderPurple: dark ? 'rgba(107,63,160,0.25)' : '#DDD6FE',
    cardOrange: dark ? 'rgba(232,130,58,0.08)' : '#FEF0E8',
    borderOrange: dark ? 'rgba(232,130,58,0.2)' : '#FDD5B4',
    cardBlue: dark ? 'rgba(37,99,235,0.08)' : '#EFF6FF',
    borderBlue: dark ? 'rgba(37,99,235,0.2)' : '#BFDBFE',
    textPrimary: dark ? 'rgba(255,255,255,0.85)' : 'var(--text-primary)',
    textMuted: dark ? 'rgba(255,255,255,0.3)' : 'var(--text-muted)',
    textSec: dark ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)',
    label: dark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
    alertDot: dark ? '#DC2626' : '#DC2626',
    green: dark ? '#6EE7A0' : '#4A7C59',
    red: dark ? '#F87171' : '#DC2626',
    purple: dark ? '#C084FC' : '#6B3FA0',
    blue: dark ? '#60A5FA' : '#2563EB',
    mapBg: dark ? 'linear-gradient(135deg,#0D1F14,#1A3D2B)' : '#e8f4e8',
    mapText: dark ? 'rgba(110,231,160,0.7)' : '#4A7C59',
  };

  const sectionLabel = { fontSize:'11px', fontWeight:600, color:c.label, letterSpacing:'0.8px', textTransform:'uppercase' as const };

  return (
    <MainLayout>
      <PullToRefresh onRefresh={cargarDatos}>
        <div style={{ background:'var(--sand)', minHeight:'100vh', paddingBottom:'80px' }}>

          <div style={{ ...getHeroBg(), padding:'16px 14px 14px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', background:'rgba(107,63,160,0.12)', borderRadius:'50%', filter:'blur(20px)' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', position:'relative' }}>
              <div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px', marginBottom:'2px', letterSpacing:'0.3px' }}>
                  {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})} · Heroica Caborca
                </div>
                <div style={{ color:'white', fontSize:'16px', fontWeight:600, fontFamily:'Outfit,sans-serif', letterSpacing:'-0.3px' }}>Caborca IA</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(74,222,128,0.1)', border:'0.5px solid rgba(74,222,128,0.3)', borderRadius:'20px', padding:'5px 10px' }}>
                <div style={{ width:'6px', height:'6px', background:'#4ADE80', borderRadius:'50%' }} />
                <div style={{ color:'#4ADE80', fontSize:'10px', fontWeight:500 }}>En vivo</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontSize:'48px', lineHeight:1, filter:'drop-shadow(0 0 12px rgba(255,200,0,0.3))' }}>{clima?getClimaIcono(clima.descripcion):'☀️'}</div>
                <div>
                  <div style={{ color:'white', fontSize:'46px', fontWeight:700, lineHeight:1, letterSpacing:'-2px' }}>{clima?clima.temperatura+'°':'--°'}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', marginTop:'3px', textTransform:'capitalize' }}>{clima?clima.descripcion:'Cargando...'}</div>
                </div>
              </div>
              {clima && (
                <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
                  <div style={{ background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'6px 10px', textAlign:'right' }}>
                    <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'9px', letterSpacing:'0.3px' }}>HUMEDAD</div>
                    <div style={{ color:'white', fontSize:'13px', fontWeight:600, marginTop:'1px' }}>{clima.humedad}%</div>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'6px 10px', textAlign:'right' }}>
                    <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'9px', letterSpacing:'0.3px' }}>VIENTO</div>
                    <div style={{ color:'white', fontSize:'13px', fontWeight:600, marginTop:'1px' }}>{clima.viento} km/h</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding:'10px 12px 6px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px' }}>
            <Link href="/reportes" style={{ background:c.cardRed, border:'0.5px solid '+c.borderRed, borderRadius:'12px', padding:'10px 8px', textAlign:'center', textDecoration:'none', display:'block' }}>
              <div style={{ fontSize:'18px', marginBottom:'3px' }}>🚨</div>
              <div style={{ fontSize:'18px', fontWeight:700, color:c.red, lineHeight:1 }}>{reportes.length}</div>
              <div style={{ fontSize:'9px', color:c.red, opacity:0.7, marginTop:'2px', letterSpacing:'0.3px' }}>REPORTES</div>
            </Link>
            <Link href="/eventos" style={{ background:c.cardGreen, border:'0.5px solid '+c.borderGreen, borderRadius:'12px', padding:'10px 8px', textAlign:'center', textDecoration:'none', display:'block' }}>
              <div style={{ fontSize:'18px', marginBottom:'3px' }}>📅</div>
              <div style={{ fontSize:'18px', fontWeight:700, color:c.green, lineHeight:1 }}>{eventos.length}</div>
              <div style={{ fontSize:'9px', color:c.green, opacity:0.7, marginTop:'2px', letterSpacing:'0.3px' }}>EVENTOS</div>
            </Link>
            <Link href="/chat" style={{ background:c.cardPurple, border:'0.5px solid '+c.borderPurple, borderRadius:'12px', padding:'10px 8px', textAlign:'center', textDecoration:'none', display:'block' }}>
              <div style={{ fontSize:'18px', marginBottom:'3px' }}>🤖</div>
              <div style={{ fontSize:'18px', fontWeight:700, color:c.purple, lineHeight:1 }}>IA</div>
              <div style={{ fontSize:'9px', color:c.purple, opacity:0.7, marginTop:'2px', letterSpacing:'0.3px' }}>PREGUNTA</div>
            </Link>
          </div>

          {banner && (
            <div style={{ margin:'2px 12px 6px', background:c.card, border:'0.5px solid '+c.border, borderRadius:'10px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px' }}>
              {banner.imagen_url && <img src={banner.imagen_url} alt={banner.titulo} style={{ width:'32px', height:'32px', borderRadius:'8px', objectFit:'cover', flexShrink:0 }} />}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'11px', fontWeight:700, color:banner.color||'#E05C3A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{banner.titulo}</div>
                {banner.subtitulo && <div style={{ fontSize:'10px', color:c.textMuted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{banner.subtitulo}</div>}
              </div>
              {banner.link_url && <a href={banner.link_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'11px', fontWeight:700, color:banner.color||'#E05C3A', flexShrink:0 }}>Ver →</a>}
            </div>
          )}

          {reporteActivo && (
            <div style={{ margin:'0 12px 6px', background:c.cardRed, border:'0.5px solid '+c.borderRed, borderRadius:'10px', padding:'8px 10px', display:'flex', gap:'8px', alignItems:'center' }}>
              <div style={{ width:'6px', height:'6px', background:'#DC2626', borderRadius:'50%', flexShrink:0, boxShadow: dark ? '0 0 6px #DC2626' : 'none' }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'10px', fontWeight:600, color:c.red, letterSpacing:'0.2px' }}>
                  {TIPO_EMOJIS[reporteActivo.tipo]||'🚨'} Alerta activa · {formatDistanceToNow(new Date(reporteActivo.created_at),{addSuffix:true,locale:es})}
                </div>
                <div style={{ fontSize:'10px', color:c.red, opacity:0.6, marginTop:'1px' }}>{reporteActivo.descripcion} — {reporteActivo.ubicacion}</div>
              </div>
              <div style={{ background: dark?'rgba(220,38,38,0.2)':'#DC2626', border: dark?'0.5px solid rgba(220,38,38,0.4)':'none', color: dark?'#F87171':'white', fontSize:'9px', padding:'3px 7px', borderRadius:'4px', fontWeight:600, whiteSpace:'nowrap', letterSpacing:'0.3px' }}>ACTIVO</div>
            </div>
          )}

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px 5px' }}>
            <div style={sectionLabel}>Lo de hoy</div>
            <Link href="/noticias" style={{ fontSize:'10px', color:'#E05C3A', fontWeight:500, textDecoration:'none' }}>Ver todo →</Link>
          </div>
          <div style={{ padding:'0 12px', display:'flex', flexDirection:'column', gap:'5px', marginBottom:'8px' }}>
            {noticiaDestacada && (
              <Link href={'/noticias/'+noticiaDestacada.id} style={{ background:c.card, border:'0.5px solid '+c.border, borderRadius:'12px', padding:'10px 12px', display:'flex', gap:'10px', alignItems:'center', textDecoration:'none' }}>
                <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#1E3A5F,#6B3FA0)', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', border:'0.5px solid rgba(107,63,160,0.3)' }}>📰</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:'#E05C3A', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'2px' }}>{noticiaDestacada.categoria}</div>
                  <div style={{ fontSize:'12px', fontWeight:500, color:c.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{noticiaDestacada.titulo}</div>
                  <div style={{ fontSize:'10px', color:c.textMuted, marginTop:'2px' }}>{formatDistanceToNow(new Date(noticiaDestacada.created_at),{addSuffix:true,locale:es})}</div>
                </div>
                <ChevronRight size={14} color={c.textMuted} style={{ flexShrink:0 }} />
              </Link>
            )}
            {eventoHoy && (
              <Link href="/eventos" style={{ background:c.cardGreen, border:'0.5px solid '+c.borderGreen, borderRadius:'12px', padding:'10px 12px', display:'flex', gap:'10px', alignItems:'center', textDecoration:'none' }}>
                <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#1A3D2B,#2D5A3A)', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', border:'0.5px solid rgba(74,124,89,0.3)' }}>📅</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:c.green, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'2px' }}>Evento próximo</div>
                  <div style={{ fontSize:'12px', fontWeight:500, color:c.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{eventoHoy.nombre}{eventoHoy.lugar?' · '+eventoHoy.lugar:''}</div>
                  <div style={{ fontSize:'10px', color:c.green, opacity:0.7, marginTop:'2px' }}>{new Date(eventoHoy.fecha_inicio).toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})}</div>
                </div>
                <div style={{ background: dark?'rgba(74,124,89,0.2)':c.green, border: dark?'0.5px solid rgba(74,124,89,0.4)':'none', color: dark?'#6EE7A0':'white', fontSize:'9px', padding:'3px 7px', borderRadius:'4px', fontWeight:600, flexShrink:0 }}>HOY</div>
              </Link>
            )}
            {noticiasResto.map(n => (
              <Link key={n.id} href={'/noticias/'+n.id} style={{ background:c.card, border:'0.5px solid '+c.border, borderRadius:'12px', padding:'10px 12px', display:'flex', gap:'10px', alignItems:'center', textDecoration:'none' }}>
                {n.imagen_url ? <img src={n.imagen_url} alt={n.titulo} style={{ width:'36px', height:'36px', borderRadius:'10px', objectFit:'cover', flexShrink:0 }} /> : <div style={{ width:'36px', height:'36px', background:'var(--sand-dark)', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>📰</div>}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:'#6B3FA0', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'2px' }}>{n.categoria}</div>
                  <div style={{ fontSize:'12px', fontWeight:500, color:c.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.titulo}</div>
                  <div style={{ fontSize:'10px', color:c.textMuted, marginTop:'2px' }}>{formatDistanceToNow(new Date(n.created_at),{addSuffix:true,locale:es})}</div>
                </div>
                <ChevronRight size={14} color={c.textMuted} style={{ flexShrink:0 }} />
              </Link>
            ))}
          </div>

          {negociosDestacados.length > 0 && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'2px 12px 6px' }}>
                <div style={sectionLabel}>Negocios</div>
                <Link href="/negocios" style={{ fontSize:'10px', color:'#E05C3A', fontWeight:500, textDecoration:'none' }}>Ver todos →</Link>
              </div>
              <div style={{ padding:'0 12px', display:'flex', gap:'7px', overflowX:'auto', marginBottom:'8px', paddingBottom:'4px' }}>
                {negociosDestacados.map(n => (
                  <Link key={n.id} href={'/negocios/'+n.id} style={{ flexShrink:0, width:'96px', background:c.card, border:'0.5px solid '+c.border, borderRadius:'12px', overflow:'hidden', textDecoration:'none', display:'block' }}>
                    {n.imagen_url ? <img src={n.imagen_url} alt={n.nombre} style={{ width:'100%', height:'50px', objectFit:'cover' }} /> : <div style={{ height:'50px', background:'var(--sand-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>🏪</div>}
                    <div style={{ padding:'6px 8px' }}>
                      <div style={{ fontSize:'10px', fontWeight:600, color:c.textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.nombre}</div>
                      <div style={{ fontSize:'9px', color:'#FBBF24', marginTop:'1px' }}>⭐ Destacado</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div style={{ margin:'0 12px 8px', background: dark?'linear-gradient(135deg,rgba(107,63,160,0.2),rgba(30,58,95,0.3))':'linear-gradient(135deg,#1a3356,#5a3490)', border:'0.5px solid '+(dark?'rgba(107,63,160,0.3)':'transparent'), borderRadius:'14px', padding:'12px 14px', display:'flex', gap:'10px', alignItems:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-10px', right:'-10px', width:'60px', height:'60px', background:'rgba(107,63,160,0.15)', borderRadius:'50%', filter:'blur(10px)' }} />
            <div style={{ width:'38px', height:'38px', background:'rgba(107,63,160,0.3)', border:'0.5px solid rgba(107,63,160,0.5)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>🤖</div>
            <Link href="/chat" style={{ flex:1, minWidth:0, textDecoration:'none', position:'relative' }}>
              <div style={{ color:'rgba(255,255,255,0.9)', fontSize:'12px', fontWeight:600, marginBottom:'2px' }}>Pregúntale a Caborca IA</div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'10px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>¿Dónde comer? ¿Qué pasó hoy? ¿Clima?</div>
            </Link>
            <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'18px', flexShrink:0, position:'relative' }}>›</div>
          </div>

          <Link href="/mapa" style={{ margin:'0 12px 8px', borderRadius:'12px', overflow:'hidden', border:'0.5px solid '+c.border, textDecoration:'none', display:'block' }}>
            <div style={{ background:c.mapBg, height:'68px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <div style={{ color:c.mapText, fontSize:'12px', fontWeight:500, letterSpacing:'0.3px' }}>🗺️ Mapa en vivo de Caborca</div>
              {[{t:'10px',l:'18px',c:'#DC2626'},{t:'28px',r:'38px',c:dark?'#60A5FA':'#2D5F8A'},{b:'12px',l:'55px',c:'#FB923C'}].map((dot,i) => (
                <div key={i} style={{ position:'absolute', top:dot.t, bottom:(dot as any).b, left:dot.l, right:(dot as any).r, width:'8px', height:'8px', background:dot.c, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.6)', boxShadow: dark?`0 0 6px ${dot.c}`:'none' }} />
              ))}
            </div>
            <div style={{ background:c.card, borderTop:'0.5px solid '+c.border, padding:'7px 10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:'10px' }}>
                {[{col:'#DC2626',l:'Reportes'},{col:dark?'#60A5FA':'#2D5F8A',l:'Negocios'},{col:'#FB923C',l:'Eventos'}].map(item=>(
                  <div key={item.l} style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'9px', color:c.textMuted }}>
                    <div style={{ width:'6px', height:'6px', background:item.col, borderRadius:'50%' }} />
                    {item.l}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:'10px', color:'#E05C3A', fontWeight:500 }}>Abrir →</div>
            </div>
          </Link>

          <div style={{ margin:'0 12px 10px' }}>
            <div style={{ ...sectionLabel, marginBottom:'6px' }}>Emergencias</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
              <a href="tel:911" style={{ background:c.cardRed, border:'0.5px solid '+c.borderRed, borderRadius:'10px', padding:'10px', display:'flex', gap:'8px', alignItems:'center', textDecoration:'none' }}>
                <div style={{ fontSize:'20px' }}>🆘</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:c.red }}>911</div>
                  <div style={{ fontSize:'9px', color:c.red, opacity:0.5, letterSpacing:'0.3px' }}>EMERGENCIAS</div>
                </div>
              </a>
              <a href="tel:6376372626" style={{ background:c.cardBlue, border:'0.5px solid '+c.borderBlue, borderRadius:'10px', padding:'10px', display:'flex', gap:'8px', alignItems:'center', textDecoration:'none' }}>
                <div style={{ fontSize:'20px' }}>🚑</div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:c.blue }}>Cruz Roja</div>
                  <div style={{ fontSize:'9px', color:c.blue, opacity:0.5, letterSpacing:'0.3px' }}>637-637-2626</div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </PullToRefresh>
    </MainLayout>
  );
}
