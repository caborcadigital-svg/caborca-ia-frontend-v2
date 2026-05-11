'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MessageSquare, ChevronRight, MapPin } from 'lucide-react';
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
  hero_gradient: 'linear-gradient(160deg, #1a3356 0%, #5a3490 50%, #3a1a6e 100%)',
  hero_imagen: '',
  hero_color1: '#1E3A5F',
  hero_color2: '#E05C3A',
};

const REPORTE_COLORES: Record<string,{bg:string,color:string,border:string}> = {
  accidente:{ bg:'#FEF2F2', color:'#DC2626', border:'#DC2626' },
  'apagón':{ bg:'#FFFBEB', color:'#D97706', border:'#D97706' },
  tráfico:{ bg:'#FEF2F2', color:'#EA580C', border:'#EA580C' },
  retén:{ bg:'#EFF6FF', color:'#2563EB', border:'#2563EB' },
  seguridad:{ bg:'#FEF2F2', color:'#DC2626', border:'#DC2626' },
  otro:{ bg:'#F9FAFB', color:'#6B7280', border:'#6B7280' },
};

const TIPO_EMOJIS: Record<string,string> = {
  accidente:'🚗','apagón':'⚡',tráfico:'🚦',retén:'🚔',seguridad:'🚨',otro:'📋'
};

const CLIMA_ICONOS: Record<string,string> = {
  'cielo claro':'☀️','nubes':'⛅','lluvia':'🌧️','tormenta':'⛈️',
  'nieve':'❄️','niebla':'🌫️','soleado':'☀️','nublado':'☁️',
};

function getClimaIcono(desc: string) {
  const d = (desc || '').toLowerCase();
  for (const [k, v] of Object.entries(CLIMA_ICONOS)) { if (d.includes(k)) return v; }
  return '☀️';
}

export default function HomePage() {
  const [clima, setClima] = useState<any>(null);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [negociosDestacados, setNegociosDestacados] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [heroConfig, setHeroConfig] = useState(DEFAULT_CONFIG);

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
      deportesAPI.getPartidos().then(d => setPartidos(d.slice(0,2))),
      negociosAPI.getAll().then(d => setNegociosDestacados(d.filter((n:any)=>n.destacado).slice(0,4))),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/reportes?limit=3').then(r=>r.json()).then(d=>setReportes(Array.isArray(d)?d:[])).catch(()=>{}),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/publicidad').then(r=>r.json()).then(d=>setBanners(Array.isArray(d)?d.filter((b:any)=>b.activo):[])).catch(()=>{}),
      fetch(process.env.NEXT_PUBLIC_API_URL+'/config').then(r=>r.json()).then(d=>{if(d&&Object.keys(d).length)setHeroConfig(c=>({...c,...d}));}).catch(()=>{}),
    ]);
  }, []);

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setBannerIdx(i=>(i+1)%banners.length), 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  const banner = banners[bannerIdx];
  const reporteActivo = reportes[0];
  const noticiaDestacada = noticias[0];
  const noticiasResto = noticias.slice(1);
  const eventoHoy = eventos[0];
  const partidoReciente = partidos[0];

  const s = { fontFamily:'inherit' };

  return (
    <MainLayout>
      <PullToRefresh onRefresh={cargarDatos}>
        <div style={{ background:'var(--sand)', minHeight:'100vh', paddingBottom:'80px', ...s }}>

          <div style={{ ...getHeroBg(), padding:'16px 14px 14px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'100px', height:'100px', background:'rgba(255,255,255,0.04)', borderRadius:'50%' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', position:'relative' }}>
              <div>
                <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'10px', marginBottom:'1px' }}>
                  {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}
                </div>
                <div style={{ color:'white', fontSize:'14px', fontWeight:500 }}>Heroica Caborca, Son.</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(255,255,255,0.12)', borderRadius:'20px', padding:'4px 10px' }}>
                <div style={{ width:'6px', height:'6px', background:'#4ADE80', borderRadius:'50%' }} />
                <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'10px' }}>En vivo</div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ fontSize:'44px', lineHeight:1 }}>{clima ? getClimaIcono(clima.descripcion) : '☀️'}</div>
                <div>
                  <div style={{ color:'white', fontSize:'42px', fontWeight:500, lineHeight:1, letterSpacing:'-1px' }}>
                    {clima ? clima.temperatura+'°' : '--°'}
                  </div>
                  <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', marginTop:'2px', textTransform:'capitalize' }}>
                    {clima ? clima.descripcion : 'Cargando...'}
                  </div>
                </div>
              </div>
              {clima && (
                <div style={{ display:'flex', flexDirection:'column', gap:'4px', textAlign:'right' }}>
                  <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'8px', padding:'5px 10px' }}>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'9px' }}>Humedad</div>
                    <div style={{ color:'white', fontSize:'12px', fontWeight:500 }}>{clima.humedad}%</div>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'8px', padding:'5px 10px' }}>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'9px' }}>Viento</div>
                    <div style={{ color:'white', fontSize:'12px', fontWeight:500 }}>{clima.viento} km/h</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding:'8px 14px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'6px' }}>
              <div style={{ background:'#FEF2F2', borderRadius:'10px', padding:'10px 8px', textAlign:'center', border:'0.5px solid #FECACA' }}>
                <div style={{ fontSize:'20px', marginBottom:'3px' }}>🚨</div>
                <div style={{ fontSize:'13px', fontWeight:500, color:'#DC2626' }}>{reportes.length}</div>
                <div style={{ fontSize:'9px', color:'#DC2626', opacity:0.8 }}>reportes</div>
              </div>
              <div style={{ background:'#EEF5F0', borderRadius:'10px', padding:'10px 8px', textAlign:'center', border:'0.5px solid #C8E0CC' }}>
                <div style={{ fontSize:'20px', marginBottom:'3px' }}>📅</div>
                <div style={{ fontSize:'13px', fontWeight:500, color:'#4A7C59' }}>{eventos.length}</div>
                <div style={{ fontSize:'9px', color:'#4A7C59', opacity:0.8 }}>eventos</div>
              </div>
              <div style={{ background:'#FEF0E8', borderRadius:'10px', padding:'10px 8px', textAlign:'center', border:'0.5px solid #FDD5B4' }}>
                <div style={{ fontSize:'20px', marginBottom:'3px' }}>⚾</div>
                <div style={{ fontSize:'13px', fontWeight:500, color:'#E8823A' }}>
                  {partidoReciente ? partidoReciente.marcador_local+'-'+partidoReciente.marcador_visitante : '--'}
                </div>
                <div style={{ fontSize:'9px', color:'#E8823A', opacity:0.8 }}>Rojos</div>
              </div>
              <Link href="/chat" style={{ background:'#F3EEF9', borderRadius:'10px', padding:'10px 8px', textAlign:'center', border:'0.5px solid #DDD6FE', textDecoration:'none', display:'block' }}>
                <div style={{ fontSize:'20px', marginBottom:'3px' }}>🤖</div>
                <div style={{ fontSize:'13px', fontWeight:500, color:'#6B3FA0' }}>IA</div>
                <div style={{ fontSize:'9px', color:'#6B3FA0', opacity:0.8 }}>pregunta</div>
              </Link>
            </div>
          </div>

          {banner && (
            <div style={{ margin:'0 14px 8px', background:'var(--card)', borderRadius:'12px', padding:'10px 12px', display:'flex', alignItems:'center', gap:'10px', border:'1px solid var(--border)' }}>
              {banner.imagen_url && <img src={banner.imagen_url} alt={banner.titulo} style={{ width:'32px', height:'32px', borderRadius:'8px', objectFit:'cover', flexShrink:0 }} />}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'11px', fontWeight:700, color:banner.color||'#E05C3A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{banner.titulo}</div>
                {banner.subtitulo && <div style={{ fontSize:'10px', color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{banner.subtitulo}</div>}
              </div>
              {banner.link_url && <a href={banner.link_url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'11px', fontWeight:700, color:banner.color||'#E05C3A', flexShrink:0 }}>Ver →</a>}
            </div>
          )}

          {reporteActivo && (
            <div style={{ margin:'0 14px 8px', background:REPORTE_COLORES[reporteActivo.tipo]?.bg||'#FEF2F2', borderLeft:'3px solid '+(REPORTE_COLORES[reporteActivo.tipo]?.border||'#DC2626'), borderRadius:'0 8px 8px 0', padding:'8px 10px', display:'flex', gap:'8px', alignItems:'center' }}>
              <div style={{ fontSize:'16px', flexShrink:0 }}>{TIPO_EMOJIS[reporteActivo.tipo]||'🚨'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'11px', fontWeight:500, color:REPORTE_COLORES[reporteActivo.tipo]?.color||'#DC2626' }}>
                  Alerta activa · {formatDistanceToNow(new Date(reporteActivo.created_at),{addSuffix:true,locale:es})}
                </div>
                <div style={{ fontSize:'10px', color:REPORTE_COLORES[reporteActivo.tipo]?.color||'#DC2626', opacity:0.7 }}>
                  {reporteActivo.descripcion} — {reporteActivo.ubicacion}
                </div>
              </div>
              <div style={{ background:REPORTE_COLORES[reporteActivo.tipo]?.border||'#DC2626', color:'white', fontSize:'9px', padding:'3px 8px', borderRadius:'4px', whiteSpace:'nowrap', fontWeight:500 }}>ACTIVO</div>
            </div>
          )}

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px 6px' }}>
            <div style={{ fontSize:'12px', fontWeight:500, color:'var(--text-primary)' }}>Lo de hoy en Caborca</div>
            <Link href="/noticias" style={{ fontSize:'10px', color:'#E05C3A', fontWeight:500, textDecoration:'none' }}>Ver todo →</Link>
          </div>
          <div style={{ padding:'0 14px', display:'flex', flexDirection:'column', gap:'5px', marginBottom:'8px' }}>
            {noticiaDestacada && (
              <Link href={'/noticias/'+noticiaDestacada.id} style={{ display:'flex', gap:'10px', padding:'9px 10px', background:'var(--card)', borderRadius:'10px', alignItems:'center', textDecoration:'none', border:'1px solid var(--border)' }}>
                <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#1E3A5F,#6B3FA0)', borderRadius:'8px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>📰</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:'#E05C3A', fontWeight:500, textTransform:'uppercase', marginBottom:'2px' }}>{noticiaDestacada.categoria}</div>
                  <div style={{ fontSize:'11px', fontWeight:500, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{noticiaDestacada.titulo}</div>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'1px' }}>{formatDistanceToNow(new Date(noticiaDestacada.created_at),{addSuffix:true,locale:es})}</div>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink:0 }} />
              </Link>
            )}
            {eventoHoy && (
              <Link href="/eventos" style={{ display:'flex', gap:'10px', padding:'9px 10px', background:'#EEF5F0', borderRadius:'10px', alignItems:'center', textDecoration:'none', border:'0.5px solid #C8E0CC' }}>
                <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#4A7C59,#2D5A3A)', borderRadius:'8px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>📅</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:'#4A7C59', fontWeight:500, textTransform:'uppercase', marginBottom:'2px' }}>Evento próximo</div>
                  <div style={{ fontSize:'11px', fontWeight:500, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{eventoHoy.nombre}{eventoHoy.lugar?' · '+eventoHoy.lugar:''}</div>
                  <div style={{ fontSize:'10px', color:'#4A7C59', marginTop:'1px' }}>{new Date(eventoHoy.fecha_inicio).toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})}</div>
                </div>
                <div style={{ background:'#4A7C59', color:'white', fontSize:'9px', padding:'3px 8px', borderRadius:'4px', fontWeight:500, flexShrink:0 }}>HOY</div>
              </Link>
            )}
            {partidoReciente && (
              <Link href="/deportes" style={{ display:'flex', gap:'10px', padding:'9px 10px', background:'var(--card)', borderRadius:'10px', alignItems:'center', textDecoration:'none', border:'1px solid var(--border)' }}>
                <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#E8823A,#C4622D)', borderRadius:'8px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>⚾</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:'#E8823A', fontWeight:500, textTransform:'uppercase', marginBottom:'2px' }}>Deportes · {partidoReciente.liga}</div>
                  <div style={{ fontSize:'11px', fontWeight:500, color:'var(--text-primary)' }}>
                    {partidoReciente.equipo_local} {partidoReciente.marcador_local??'-'} — {partidoReciente.marcador_visitante??'-'} {partidoReciente.equipo_visitante}
                  </div>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink:0 }} />
              </Link>
            )}
            {noticiasResto.slice(0,1).map(n => (
              <Link key={n.id} href={'/noticias/'+n.id} style={{ display:'flex', gap:'10px', padding:'9px 10px', background:'var(--card)', borderRadius:'10px', alignItems:'center', textDecoration:'none', border:'1px solid var(--border)' }}>
                {n.imagen_url ? <img src={n.imagen_url} alt={n.titulo} style={{ width:'36px', height:'36px', borderRadius:'8px', objectFit:'cover', flexShrink:0 }} /> : <div style={{ width:'36px', height:'36px', background:'var(--sand-dark)', borderRadius:'8px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>📰</div>}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'9px', color:'#6B3FA0', fontWeight:500, textTransform:'uppercase', marginBottom:'2px' }}>{n.categoria}</div>
                  <div style={{ fontSize:'11px', fontWeight:500, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.titulo}</div>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'1px' }}>{formatDistanceToNow(new Date(n.created_at),{addSuffix:true,locale:es})}</div>
                </div>
                <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink:0 }} />
              </Link>
            ))}
          </div>

          {negociosDestacados.length > 0 && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'2px 14px 6px' }}>
                <div style={{ fontSize:'12px', fontWeight:500, color:'var(--text-primary)' }}>Negocios destacados</div>
                <Link href="/negocios" style={{ fontSize:'10px', color:'#E05C3A', fontWeight:500, textDecoration:'none' }}>Ver todos →</Link>
              </div>
              <div style={{ padding:'0 14px', display:'flex', gap:'8px', overflowX:'auto', marginBottom:'8px', paddingBottom:'4px' }}>
                {negociosDestacados.map(n => (
                  <Link key={n.id} href={'/negocios/'+n.id} style={{ flexShrink:0, width:'100px', background:'var(--card)', borderRadius:'10px', overflow:'hidden', border:'1px solid var(--border)', textDecoration:'none', display:'block' }}>
                    {n.imagen_url ? <img src={n.imagen_url} alt={n.nombre} style={{ width:'100%', height:'52px', objectFit:'cover' }} /> : <div style={{ height:'52px', background:'var(--sand-dark)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>🏪</div>}
                    <div style={{ padding:'6px 8px' }}>
                      <div style={{ fontSize:'10px', fontWeight:500, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.nombre}</div>
                      <div style={{ fontSize:'9px', color:'#4A7C59' }}>⭐ Destacado</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div style={{ margin:'0 14px 8px', background:'linear-gradient(135deg,#1a3356,#5a3490)', borderRadius:'12px', padding:'12px 14px', display:'flex', gap:'10px', alignItems:'center' }}>
            <div style={{ width:'36px', height:'36px', background:'rgba(255,255,255,0.15)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>🤖</div>
            <Link href="/chat" style={{ flex:1, minWidth:0, textDecoration:'none' }}>
              <div style={{ color:'white', fontSize:'12px', fontWeight:500, marginBottom:'2px' }}>Pregúntale a Caborca IA</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>¿Dónde comer? ¿Qué pasó hoy? ¿Clima mañana?</div>
            </Link>
            <div style={{ color:'white', fontSize:'18px', flexShrink:0 }}>›</div>
          </div>

          <Link href="/mapa" style={{ margin:'0 14px 8px', borderRadius:'10px', overflow:'hidden', border:'1px solid var(--border)', textDecoration:'none', display:'block' }}>
            <div style={{ background:'#e8f4e8', height:'72px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <div style={{ color:'#4A7C59', fontSize:'12px', fontWeight:500 }}>🗺️ Mapa en vivo de Caborca</div>
              <div style={{ position:'absolute', top:'12px', left:'20px', width:'9px', height:'9px', background:'#DC2626', borderRadius:'50%', border:'2px solid white' }} />
              <div style={{ position:'absolute', top:'30px', right:'40px', width:'9px', height:'9px', background:'#2D5F8A', borderRadius:'50%', border:'2px solid white' }} />
              <div style={{ position:'absolute', bottom:'14px', left:'60px', width:'9px', height:'9px', background:'#E8823A', borderRadius:'50%', border:'2px solid white' }} />
            </div>
            <div style={{ background:'var(--card)', padding:'7px 10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:'8px' }}>
                {[{c:'#DC2626',l:'Reportes'},{c:'#2D5F8A',l:'Negocios'},{c:'#E8823A',l:'Eventos'}].map(item => (
                  <div key={item.l} style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'9px', color:'var(--text-muted)' }}>
                    <div style={{ width:'7px', height:'7px', background:item.c, borderRadius:'50%' }} />
                    {item.l}
                  </div>
                ))}
              </div>
              <div style={{ fontSize:'10px', color:'#E05C3A', fontWeight:500 }}>Abrir →</div>
            </div>
          </Link>

          <div style={{ margin:'0 14px 10px' }}>
            <div style={{ fontSize:'12px', fontWeight:500, color:'var(--text-primary)', marginBottom:'6px' }}>Emergencias rápidas</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
              <a href="tel:911" style={{ background:'#FEF2F2', borderRadius:'10px', padding:'9px 10px', display:'flex', gap:'8px', alignItems:'center', textDecoration:'none', border:'0.5px solid #FECACA' }}>
                <div style={{ fontSize:'18px' }}>🆘</div>
                <div><div style={{ fontSize:'12px', fontWeight:500, color:'#DC2626' }}>911</div><div style={{ fontSize:'9px', color:'#DC2626', opacity:0.7 }}>Emergencias</div></div>
              </a>
              <a href="tel:6376372626" style={{ background:'#EFF6FF', borderRadius:'10px', padding:'9px 10px', display:'flex', gap:'8px', alignItems:'center', textDecoration:'none', border:'0.5px solid #BFDBFE' }}>
                <div style={{ fontSize:'18px' }}>🚑</div>
                <div><div style={{ fontSize:'12px', fontWeight:500, color:'#2563EB' }}>Cruz Roja</div><div style={{ fontSize:'9px', color:'#2563EB', opacity:0.7 }}>637-637-2626</div></div>
              </a>
            </div>
          </div>

        </div>
      </PullToRefresh>
    </MainLayout>
  );
}
