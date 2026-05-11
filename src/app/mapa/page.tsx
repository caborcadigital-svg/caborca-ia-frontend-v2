'use client';
import { useEffect, useState, useRef } from 'react';
import MainLayout from '../MainLayout';
import { Map, AlertTriangle, Store, CalendarDays, Layers, RefreshCw } from 'lucide-react';

const CABORCA_CENTER: [number,number] = [30.7162, -112.1544];

const CAPAS = [
  { id:'reportes', label:'Reportes', icon:'🚨', color:'#DC2626' },
  { id:'negocios', label:'Negocios', icon:'🏪', color:'#2D5F8A' },
  { id:'eventos', label:'Eventos', icon:'📅', color:'#4A7C59' },
  { id:'emergencias', label:'Emergencias', icon:'🚑', color:'#7C3AED' },
];

const REPORTE_COLORES: Record<string,string> = {
  accidente:'#DC2626', 'apagón':'#D97706', tráfico:'#EA580C', retén:'#2563EB', seguridad:'#DC2626', otro:'#6B7280'
};

export default function MapaPage() {
  const [capasActivas, setCapasActivas] = useState<string[]>(['reportes','negocios','eventos','emergencias']);
  const [reportes, setReportes] = useState<any[]>([]);
  const [negocios, setNegocios] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [emergencias, setEmergencias] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const cargarDatos = async () => {
    setIsLoading(true);
    await Promise.allSettled([
      fetch(API+'/reportes?limit=50').then(r=>r.json()).then(d=>setReportes(Array.isArray(d)?d.filter((r:any)=>r.lat&&r.lng):[])).catch(()=>{}),
      fetch(API+'/negocios?limit=100').then(r=>r.json()).then(d=>setNegocios(Array.isArray(d)?d.filter((n:any)=>n.lat&&n.lng):[])).catch(()=>{}),
      fetch(API+'/eventos').then(r=>r.json()).then(d=>setEventos(Array.isArray(d)?d.filter((e:any)=>e.lat&&e.lng):[])).catch(()=>{}),
      fetch(API+'/emergencias').then(r=>r.json()).then(d=>setEmergencias(Array.isArray(d)?d:[])).catch(()=>{}),
    ]);
    setIsLoading(false);
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    import('leaflet').then(L => {
      const lf = L.default;
      delete (lf.Icon.Default.prototype as any)._getIconUrl;

      const map = lf.map(mapContainerRef.current!, { center: CABORCA_CENTER, zoom: 13, zoomControl: false });
      lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(map);
      lf.control.zoom({ position: 'bottomright' }).addTo(map);
      mapRef.current = map;
    });

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then(L => {
      const lf = L.default;
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      if (capasActivas.includes('reportes')) {
        reportes.forEach(r => {
          const color = REPORTE_COLORES[r.tipo] || '#6B7280';
          const marker = lf.circleMarker([r.lat, r.lng], { radius:10, fillColor:color, color:'white', weight:2, fillOpacity:0.9 })
            .addTo(mapRef.current)
            .on('click', () => setSeleccionado({ tipo:'reporte', ...r }));
          markersRef.current.push(marker);
        });
      }

      if (capasActivas.includes('negocios')) {
        negocios.forEach(n => {
          const marker = lf.circleMarker([n.lat, n.lng], { radius:8, fillColor:'#2D5F8A', color:'white', weight:2, fillOpacity:0.9 })
            .addTo(mapRef.current)
            .on('click', () => setSeleccionado({ tipo:'negocio', ...n }));
          markersRef.current.push(marker);
        });
      }

      if (capasActivas.includes('eventos')) {
        eventos.forEach(e => {
          const marker = lf.circleMarker([e.lat, e.lng], { radius:8, fillColor:'#4A7C59', color:'white', weight:2, fillOpacity:0.9 })
            .addTo(mapRef.current)
            .on('click', () => setSeleccionado({ tipo:'evento', ...e }));
          markersRef.current.push(marker);
        });
      }
    });
  }, [reportes, negocios, eventos, capasActivas]);

  const toggleCapa = (id: string) => {
    setCapasActivas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const totalItems = (capasActivas.includes('reportes') ? reportes.length : 0) +
    (capasActivas.includes('negocios') ? negocios.length : 0) +
    (capasActivas.includes('eventos') ? eventos.length : 0);

  return (
    <MainLayout>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div style={{ display:'flex', flexDirection:'column', height:'calc(100dvh - 52px)' }}>

        <div style={{ background:'var(--card)', borderBottom:'1px solid var(--border)', padding:'10px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg,#1E3A5F,#4A7C59)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Map size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text-primary)' }}>Mapa de Caborca</div>
                <div style={{ fontSize:'10px', color:'var(--text-muted)' }}>{totalItems} puntos en el mapa</div>
              </div>
            </div>
            <button onClick={cargarDatos} style={{ background:'var(--sand)', border:'1px solid var(--border)', borderRadius:'10px', padding:'6px 8px', cursor:'pointer', color:'var(--text-muted)' }}>
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div style={{ display:'flex', gap:'6px', overflowX:'auto' }}>
            {CAPAS.map(capa => (
              <button key={capa.id} onClick={() => toggleCapa(capa.id)}
                style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 10px', borderRadius:'20px', border:'1.5px solid', borderColor: capasActivas.includes(capa.id) ? capa.color : 'var(--border)', background: capasActivas.includes(capa.id) ? capa.color+'15' : 'var(--card)', cursor:'pointer', flexShrink:0, fontSize:'11px', fontWeight:600, color: capasActivas.includes(capa.id) ? capa.color : 'var(--text-muted)', whiteSpace:'nowrap' }}>
                <span style={{ fontSize:'13px' }}>{capa.icon}</span>
                {capa.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex:1, position:'relative' }}>
          <div ref={mapContainerRef} style={{ width:'100%', height:'100%' }} />

          {seleccionado && (
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'var(--card)', borderRadius:'20px 20px 0 0', padding:'16px', boxShadow:'0 -4px 20px rgba(0,0,0,0.15)', zIndex:1000 }}>
              <div style={{ width:'36px', height:'4px', background:'var(--border)', borderRadius:'2px', margin:'0 auto 12px' }} />
              <div style={{ display:'flex', alignItems:'start', gap:'10px', marginBottom:'12px' }}>
                <div style={{ fontSize:'28px', flexShrink:0 }}>
                  {seleccionado.tipo === 'reporte' ? '🚨' : seleccionado.tipo === 'negocio' ? '🏪' : '📅'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'3px' }}>
                    {seleccionado.tipo === 'reporte' ? seleccionado.tipo_reporte || 'Reporte' : seleccionado.tipo === 'negocio' ? seleccionado.categoria : 'Evento'}
                  </div>
                  <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)', lineHeight:1.3 }}>
                    {seleccionado.tipo === 'reporte' ? seleccionado.descripcion : seleccionado.tipo === 'negocio' ? seleccionado.nombre : seleccionado.nombre}
                  </div>
                  {(seleccionado.ubicacion || seleccionado.direccion || seleccionado.lugar) && (
                    <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'4px' }}>
                      📍 {seleccionado.ubicacion || seleccionado.direccion || seleccionado.lugar}
                    </div>
                  )}
                  {seleccionado.telefono && (
                    <a href={'tel:'+seleccionado.telefono} style={{ display:'inline-flex', alignItems:'center', gap:'4px', marginTop:'8px', background:'#25D366', color:'white', borderRadius:'8px', padding:'5px 12px', fontSize:'12px', fontWeight:600, textDecoration:'none' }}>
                      📞 Llamar
                    </a>
                  )}
                </div>
                <button onClick={() => setSeleccionado(null)} style={{ background:'var(--sand)', border:'none', borderRadius:'8px', padding:'4px 8px', cursor:'pointer', fontSize:'12px', color:'var(--text-muted)', flexShrink:0 }}>✕</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background:'var(--card)', borderTop:'1px solid var(--border)', padding:'8px 12px', display:'flex', gap:'8px' }}>
          {CAPAS.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'var(--text-muted)' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:c.color, opacity: capasActivas.includes(c.id) ? 1 : 0.3 }} />
              {c.icon} {c.label}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
