'use client';
import { useEffect, useState, useRef } from 'react';
import MainLayout from '../MainLayout';
import { eventosAPI } from '../../lib/api';
import { CalendarDays, MapPin, Clock, Map, List } from 'lucide-react';
import ShareWhatsApp from '../../components/ShareWhatsApp';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const CABORCA_CENTER: [number,number] = [30.7162,-112.1544];

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vista, setVista] = useState<'lista'|'mapa'>('lista');
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { eventosAPI.getAll({ proximos: true }).then(setEventos).finally(() => setIsLoading(false)); }, []);

  useEffect(() => {
    if (vista !== 'mapa' || !mapContainerRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      const lf = L.default;
      delete (lf.Icon.Default.prototype as any)._getIconUrl;
      lf.Icon.Default.mergeOptions({ iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });
      const map = lf.map(mapContainerRef.current!, { center: CABORCA_CENTER, zoom: 13 });
      lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(map);
      eventos.forEach(e => {
        if (e.lat && e.lng) {
          lf.marker([e.lat, e.lng]).addTo(map)
            .bindPopup('<strong>' + e.nombre + '</strong><br/>' + new Date(e.fecha_inicio).toLocaleDateString('es-MX') + (e.lugar ? '<br/>' + e.lugar : ''));
        }
      });
      mapRef.current = map;
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [vista, eventos]);

  return (
    <MainLayout>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#EEF5F0' }}>
              <CalendarDays className="w-5 h-5" style={{ color:'#4A7C59' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Eventos en Caborca</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>{eventos.length} eventos proximos</p>
            </div>
          </div>
          <div className="flex gap-2">
            {[{v:'lista',icon:List},{v:'mapa',icon:Map}].map(({ v, icon:Icon }) => (
              <button key={v} onClick={() => setVista(v as any)}
                className={'p-2 rounded-xl border transition-all ' + (vista === v ? 'gradient-sunset text-white border-transparent' : 'bg-white')}
                style={vista !== v ? { borderColor:'var(--border)', color:'var(--text-secondary)' } : {}}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {vista === 'mapa' && (
          <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor:'var(--border)' }}>
            <div ref={mapContainerRef} style={{ height:'350px' }} />
            <div className="p-3 text-xs" style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', color:'var(--text-muted)' }}>
              Solo eventos con ubicacion registrada aparecen en el mapa
            </div>
          </div>
        )}

        {vista === 'lista' && (
          isLoading ? (
            <div className="space-y-3">{[...Array(3)].map((_,i) => <div key={i} className="rounded-2xl p-4 border animate-pulse h-32" style={{ background:'var(--surface)', borderColor:'var(--border)' }} />)}</div>
          ) : eventos.length === 0 ? (
            <div className="rounded-2xl p-8 text-center border shadow-sm" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
              <CalendarDays className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--text-muted)' }} />
              <div className="text-sm" style={{ color:'var(--text-muted)' }}>No hay eventos proximos</div>
            </div>
          ) : (
            <div className="space-y-3">
              {eventos.map(e => (
                <div key={e.id} className="rounded-2xl border shadow-sm overflow-hidden" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
                  {e.imagen_url && <img src={e.imagen_url} alt={e.nombre} className="w-full h-36 object-cover" />}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs font-bold uppercase mb-1 block" style={{ color:'#4A7C59' }}>{e.categoria}</span>
                        <h2 className="font-bold text-base" style={{ color:'var(--text-primary)' }}>{e.nombre}</h2>
                        {e.descripcion && <p className="text-sm mt-1 line-clamp-2" style={{ color:'var(--text-secondary)' }}>{e.descripcion}</p>}
                        <div className="flex flex-wrap gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs" style={{ color:'var(--text-muted)' }}>
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(e.fecha_inicio).toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' })}
                          </div>
                          {e.lugar && (
                            <div className="flex items-center gap-1 text-xs" style={{ color:'var(--text-muted)' }}>
                              <MapPin className="w-3.5 h-3.5" />{e.lugar}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor:'var(--border)' }}>
                      <span className="text-xs" style={{ color:'var(--text-muted)' }}>
                        {formatDistanceToNow(new Date(e.fecha_inicio), { addSuffix:true, locale:es })}
                      </span>
                      <ShareWhatsApp texto={'Evento en Caborca: ' + e.nombre + ' - ' + new Date(e.fecha_inicio).toLocaleDateString('es-MX') + (e.lugar ? ' en ' + e.lugar : '')} url="https://caborca.app/eventos" size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}
