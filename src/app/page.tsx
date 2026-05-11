'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Cloud, Newspaper, CalendarDays, AlertTriangle, Trophy, Store, MessageSquare, Star, ChevronRight, MapPin } from 'lucide-react';
import MainLayout from './MainLayout';
import PullToRefresh from '../components/PullToRefresh';
import { climaAPI, noticiasAPI, eventosAPI, deportesAPI, negociosAPI } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const DEFAULT_CONFIG = {
  hero_titulo: '¿Qué pasa hoy en',
  hero_ciudad: 'Caborca',
  hero_subtitulo: 'Heroica Caborca, Sonora',
  hero_bg_type: 'gradient',
  hero_gradient: 'linear-gradient(135deg, #1E3A5F 0%, #6B3FA0 60%, #E05C3A 100%)',
  hero_imagen: '',
  hero_color1: '#1E3A5F',
  hero_color2: '#E05C3A',
};

const ACCESOS = [
  { href:'/chat', label:'Chat IA', icon:MessageSquare, color:'#E05C3A', bg:'#FEF0EC' },
  { href:'/clima', label:'Clima', icon:Cloud, color:'#4A90C4', bg:'#EFF6FC' },
  { href:'/noticias', label:'Noticias', icon:Newspaper, color:'#6B3FA0', bg:'#F3EEF9' },
  { href:'/eventos', label:'Eventos', icon:CalendarDays, color:'#4A7C59', bg:'#EEF5F0' },
  { href:'/reportes', label:'Reportes', icon:AlertTriangle, color:'#C4622D', bg:'#FDF1EC' },
  { href:'/deportes', label:'Deportes', icon:Trophy, color:'#E8823A', bg:'#FEF0E8' },
  { href:'/negocios', label:'Negocios', icon:Store, color:'#2D5F8A', bg:'#EEF4F9' },
  { href:'/mapa', label:'Mapa', icon:MapPin, color:'#4A7C59', bg:'#EEF5F0' },
];

const REPORTE_COLORES: Record<string,{bg:string,color:string,border:string}> = {
  accidente: { bg:'#FEF2F2', color:'#DC2626', border:'#DC2626' },
  'apagón': { bg:'#FFFBEB', color:'#D97706', border:'#D97706' },
  tráfico: { bg:'#FEF2F2', color:'#EA580C', border:'#EA580C' },
  retén: { bg:'#EFF6FF', color:'#2563EB', border:'#2563EB' },
  seguridad: { bg:'#FEF2F2', color:'#DC2626', border:'#DC2626' },
  otro: { bg:'#F9FAFB', color:'#6B7280', border:'#6B7280' },
};

const TIPO_EMOJIS: Record<string,string> = {
  accidente:'🚗', 'apagón':'⚡', tráfico:'🚦', retén:'🚔', seguridad:'🚨', otro:'📋'
};

export default function HomePage() {
  const [clima, setClima] = useState<any>(null);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [negociosDestacados, setNegociosDestacados] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [heroConfig, setHeroConfig] = useState(DEFAULT_CONFIG);
  const [reportes, setReportes] = useState<any[]>([]);
  const [tab, setTab] = useState<'noticias'|'reportes'|'deportes'>('noticias');

  const getHeroBg = () => {
    if (heroConfig.hero_bg_type === 'imagen' && heroConfig.hero_imagen) return { backgroundImage:'url('+heroConfig.hero_imagen+')', backgroundSize:'cover', backgroundPosition:'center' };
    if (heroConfig.hero_gradient === 'custom') return { background:'linear-gradient(135deg,'+heroConfig.hero_color1+','+heroConfig.hero_color2+')' };
    return { background: heroConfig.hero_gradient };
  };

  const cargarDatos = useCallback(async () => {
    await Promise.allSettled([
      climaAPI.getCurrent().then(setClima),
      noticiasAPI.getAll().then(d => setNoticias(d.slice(0,5))),
      eventosAPI.getAll({ proximos:true }).then(d => setEventos(d.slice(0,3))),
      deportesAPI.getPartidos().then(d => setPartidos(d.slice(0,3))),
      negociosAPI.getAll().then(d => setNegociosDestacados(d.filter((n:any) => n.destacado).slice(0,4))),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/publicidad').then(r=>r.json()).then(d=>setBanners(Array.isArray(d)?d.filter((b:any)=>b.activo):[])).catch(()=>{}),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/config').then(r=>r.json()).then(d=>{if(d&&Object.keys(d).length)setHeroConfig(c=>({...c,...d}));}).catch(()=>{}),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/reportes?limit=3').then(r=>r.json()).then(d=>setReportes(Array.isArray(d)?d:[])).catch(()=>{}),
    ]);
  }, []);

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setBannerIdx(i => (i+1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  const banner = banners[bannerIdx];
  const noticiaDestacada = noticias[0];
  const noticiasResto = noticias.slice(1);

  return (
    <MainLayout>
      <PullToRefresh onRefresh={cargarDatos}>
        <div style={{ background:'var(--sand)', minHeight:'100vh', paddingBottom:'80px' }}>

          <div style={{ ...getHeroBg(), padding:'12px 12px 0' }}>
            <div style={{ paddingTop:'8px', paddingBottom:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <div>
                  <h1 style={{ color:'white', fontSize:'18px', fontFamily:'Outfit,sans-serif', fontWeight:800, lineHeight:1.2, margin:0 }}>
                    {heroConfig.hero_titulo}<br/>
                    <span style={{ color:'#FCD34D' }}>{heroConfig.hero_ciudad}</span>
                  </h1>
                  <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'11px', margin:'4px 0 0' }}>{heroConfig.hero_subtitulo}</p>
                </div>
                {clima && (
                  <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:'14px', padding:'8px 12px', textAlign:'center', backdropFilter:'blur(8px)' }}>
                    <div style={{ color:'white', fontSize:'22px', fontWeight:800, lineHeight:1 }}>{clima.temperatura}°</div>
                    <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'10px', marginTop:'2px', textTransform:'capitalize' }}>{clima.descripcion}</div>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'9px' }}>↑{clima.maxima}° ↓{clima.minima}°</div>
                  </div>
                )}
              </div>
              <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
                {(['noticias','reportes','deportes'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ background: tab===t ? 'white' : 'rgba(255,255,255,0.15)', color: tab===t ? '#1E3A5F' : 'white', border:'none', borderRadius:'20px', padding:'5px 14px', fontSize:'12px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                    {t === 'noticias' ? '📰 Noticias' : t === 'reportes' ? '🚨 Reportes' : '🏆 Deportes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ padding:'12px' }}>

            {banner && (
              <div style={{ background:'var(--card)', borderRadius:'14px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px', border:'1px solid var(--border)' }}>
                {banner.imagen_url && <img src={banner.imagen_url} alt={banner.titulo} style={{ width:'36px', height:'36px', borderRadius:'8px', objectFit:'cover', flexShrink:0 }} />}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'11px', fontWeight:700, color:banner.color||'#E05C3A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{banner.titulo}</div>
                  {banner.subtitulo && <div style={{ fontSize:'10px', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{banner.subtitulo}</div>}
                </div>
                {banner.link_url && <a href={banner.link_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'11px', fontWeight:700, color:banner.color||'#E05C3A', flexShrink:0 }}>Ver →</a>}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'16px' }}>
              {ACCESOS.map(({ href, label, icon:Icon, color, bg }) => (
                <Link key={href} href={href}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', padding:'10px 4px', borderRadius:'16px', background:'var(--card)', border:'1px solid var(--border)', textDecoration:'none' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', background:bg }}>
                    <Icon size={18} color={color} />
                  </div>
                  <span style={{ fontSize:'10px', fontWeight:600, color:'var(--text-primary)', textAlign:'center', lineHeight:1.1 }}>{label}</span>
                </Link>
              ))}
            </div>

            {tab === 'noticias' && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>📰 Últimas noticias</span>
                  <Link href="/noticias" style={{ fontSize:'11px', color:'var(--terracotta)', fontWeight:600, textDecoration:'none' }}>Ver todas →</Link>
                </div>
                {noticiaDestacada && (
                  <Link href={'/noticias/'+noticiaDestacada.id} style={{ display:'block', textDecoration:'none', marginBottom:'10px' }}>
                    <div style={{ borderRadius:'16px', overflow:'hidden', background:'var(--card)', border:'1px solid var(--border)' }}>
                      {noticiaDestacada.imagen_url
                        ? <img src={noticiaDestacada.imagen_url} alt={noticiaDestacada.titulo} style={{ width:'100%', height:'160px', objectFit:'cover' }} />
                        : <div style={{ height:'120px', background:'linear-gradient(135deg,#1E3A5F,#6B3FA0)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:'40px' }}>📰</span></div>
                      }
                      <div style={{ padding:'12px' }}>
                        <div style={{ fontSize:'10px', fontWeight:700, color:'var(--terracotta)', textTransform:'uppercase', marginBottom:'4px' }}>{noticiaDestacada.categoria}</div>
                        <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text-primary)', lineHeight:1.3 }}>{noticiaDestacada.titulo}</div>
                        <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'6px' }}>{formatDistanceToNow(new Date(noticiaDestacada.created_at),{addSuffix:true,locale:es})}</div>
                      </div>
                    </div>
                  </Link>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {noticiasResto.map(n => (
                    <Link key={n.id} href={'/noticias/'+n.id} style={{ display:'flex', gap:'10px', background:'var(--card)', borderRadius:'14px', padding:'10px', border:'1px solid var(--border)', textDecoration:'none', alignItems:'center' }}>
                      {n.imagen_url
                        ? <img src={n.imagen_url} alt={n.titulo} style={{ width:'52px', height:'52px', borderRadius:'10px', objectFit:'cover', flexShrink:0 }} />
                        : <div style={{ width:'52px', height:'52px', borderRadius:'10px', background:'var(--sand-dark)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>📰</div>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:'10px', fontWeight:700, color:'var(--terracotta)', textTransform:'uppercase' }}>{n.categoria}</div>
                        <div style={{ fontSize:'12px', fontWeight:600, color:'var(--text-primary)', lineHeight:1.3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' } as any}>{n.titulo}</div>
                        <div style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'3px' }}>{formatDistanceToNow(new Date(n.created_at),{addSuffix:true,locale:es})}</div>
                      </div>
                      <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink:0 }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tab === 'reportes' && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>🚨 Reportes activos</span>
                  <Link href="/reportes" style={{ fontSize:'11px', color:'var(--terracotta)', fontWeight:600, textDecoration:'none' }}>Ver todos →</Link>
                </div>
                {reportes.length === 0 ? (
                  <div style={{ background:'var(--card)', borderRadius:'16px', padding:'24px', textAlign:'center', border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'13px' }}>Sin reportes activos ahora mismo</div>
                ) : reportes.map(r => {
                  const col = REPORTE_COLORES[r.tipo] || REPORTE_COLORES.otro;
                  return (
                    <div key={r.id} style={{ background:col.bg, borderRadius:'14px', padding:'12px', marginBottom:'8px', borderLeft:`3px solid ${col.border}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                        <span style={{ fontSize:'16px' }}>{TIPO_EMOJIS[r.tipo]||'📋'}</span>
                        <span style={{ fontSize:'11px', fontWeight:700, color:col.color, textTransform:'uppercase' }}>{r.tipo}</span>
                        <span style={{ fontSize:'10px', color:'#6B7280', marginLeft:'auto' }}>{formatDistanceToNow(new Date(r.created_at),{addSuffix:true,locale:es})}</span>
                      </div>
                      <div style={{ fontSize:'12px', fontWeight:600, color:'#1A1A2E' }}>{r.descripcion}</div>
                      <div style={{ fontSize:'11px', color:'#6B7280', marginTop:'3px' }}>📍 {r.ubicacion}</div>
                    </div>
                  );
                })}
                <Link href="/reportes" style={{ display:'block', textAlign:'center', padding:'10px', background:'var(--card)', borderRadius:'12px', border:'1px solid var(--border)', fontSize:'12px', fontWeight:600, color:'var(--terracotta)', textDecoration:'none', marginTop:'4px' }}>
                  + Enviar reporte ciudadano
                </Link>
              </div>
            )}

            {tab === 'deportes' && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>🏆 Resultados</span>
                  <Link href="/deportes" style={{ fontSize:'11px', color:'var(--terracotta)', fontWeight:600, textDecoration:'none' }}>Ver todos →</Link>
                </div>
                {partidos.length === 0 ? (
                  <div style={{ background:'var(--card)', borderRadius:'16px', padding:'24px', textAlign:'center', border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'13px' }}>Sin partidos recientes</div>
                ) : partidos.map(p => (
                  <div key={p.id} style={{ background:'var(--card)', borderRadius:'14px', padding:'12px', marginBottom:'8px', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:'10px', color:'var(--text-muted)', textAlign:'center', marginBottom:'8px' }}>⚾ {p.liga} · {p.deporte}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text-primary)', flex:1 }}>{p.equipo_local}</span>
                      <div style={{ background:'var(--desert-blue)', borderRadius:'10px', padding:'6px 14px', margin:'0 8px' }}>
                        <span style={{ color:'white', fontSize:'18px', fontWeight:800, letterSpacing:'2px' }}>{p.marcador_local??'-'} - {p.marcador_visitante??'-'}</span>
                      </div>
                      <span style={{ fontSize:'13px', fontWeight:700, color:'var(--text-primary)', flex:1, textAlign:'right' }}>{p.equipo_visitante}</span>
                    </div>
                    {p.lugar && <div style={{ fontSize:'10px', color:'var(--text-muted)', textAlign:'center', marginTop:'6px' }}>📍 {p.lugar}</div>}
                  </div>
                ))}
                <Link href="/deportes" style={{ display:'block', textAlign:'center', padding:'10px', background:'var(--card)', borderRadius:'12px', border:'1px solid var(--border)', fontSize:'12px', fontWeight:600, color:'var(--terracotta)', textDecoration:'none', marginTop:'4px' }}>
                  + Enviar resultado de partido
                </Link>
              </div>
            )}

            <Link href="/mapa" style={{ display:'flex', alignItems:'center', gap:'12px', background:'var(--card)', borderRadius:'16px', padding:'14px', border:'1px solid var(--border)', textDecoration:'none', marginBottom:'12px' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:'linear-gradient(135deg,#1E3A5F,#4A7C59)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <MapPin size={22} color="white" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text-primary)' }}>Mapa en vivo de Caborca</div>
                <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>Reportes, negocios y eventos en el mapa</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </Link>

            {eventos.length > 0 && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>📅 Próximos eventos</span>
                  <Link href="/eventos" style={{ fontSize:'11px', color:'var(--terracotta)', fontWeight:600, textDecoration:'none' }}>Ver todos →</Link>
                </div>
                <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
                  {eventos.map(e => (
                    <div key={e.id} style={{ background:'var(--card)', borderRadius:'14px', padding:'12px', minWidth:'140px', border:'1px solid var(--border)', flexShrink:0 }}>
                      <div style={{ fontSize:'9px', fontWeight:700, color:'#4A7C59', background:'#EEF5F0', padding:'2px 8px', borderRadius:'6px', display:'inline-block', marginBottom:'6px' }}>
                        {new Date(e.fecha_inicio).toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'}).toUpperCase()}
                      </div>
                      <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', lineHeight:1.3 }}>{e.nombre}</div>
                      {e.lugar && <div style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'4px' }}>📍 {e.lugar}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {negociosDestacados.length > 0 && (
              <div style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>⭐ Negocios destacados</span>
                  <Link href="/negocios" style={{ fontSize:'11px', color:'var(--terracotta)', fontWeight:600, textDecoration:'none' }}>Ver todos →</Link>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  {negociosDestacados.map(n => (
                    <Link key={n.id} href={'/negocios/'+n.id} style={{ background:'var(--card)', borderRadius:'14px', overflow:'hidden', border:'1px solid var(--border)', textDecoration:'none', display:'block' }}>
                      {n.imagen_url
                        ? <img src={n.imagen_url} alt={n.nombre} style={{ width:'100%', height:'72px', objectFit:'cover' }} />
                        : <div style={{ height:'72px', background:'var(--sand-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>🏪</div>
                      }
                      <div style={{ padding:'8px 10px' }}>
                        <div style={{ fontSize:'12px', fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.nombre}</div>
                        <div style={{ fontSize:'10px', color:'var(--text-muted)', textTransform:'capitalize' }}>{n.categoria}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link href="/chat" style={{ display:'flex', alignItems:'center', gap:'12px', borderRadius:'16px', padding:'14px', textDecoration:'none', background:'linear-gradient(135deg,#1E3A5F,#6B3FA0)' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <MessageSquare size={20} color="white" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:'white', fontSize:'13px', fontWeight:700 }}>Pregúntale a Caborca IA</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'11px', marginTop:'2px' }}>Clima, negocios, eventos y más...</div>
              </div>
              <ChevronRight size={16} color="rgba(255,255,255,0.6)" />
            </Link>
          </div>
        </div>
      </PullToRefresh>
    </MainLayout>
  );
}
