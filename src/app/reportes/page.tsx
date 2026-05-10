'use client';
import { useEffect, useState, useRef } from 'react';
import MainLayout from '../MainLayout';
import { reportesAPI } from '../../lib/api';
import { AlertTriangle, Plus, X, MapPin, Clock, Map, List } from 'lucide-react';
import ShareWhatsApp from '../../components/ShareWhatsApp';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const TIPOS = ['accidente','apagón','tráfico','retén','seguridad','otro'];
const TIPO_COLORS: Record<string,string> = { accidente:'#DC2626','apagón':'#D97706','tráfico':'#EA580C','retén':'#2563EB',seguridad:'#DC2626',otro:'#6B7280' };
const CABORCA_CENTER: [number,number] = [30.7162,-112.1544];

export default function ReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [vista, setVista] = useState<'lista'|'mapa'>('lista');
  const [form, setForm] = useState({ tipo:'tráfico', descripcion:'', ubicacion:'' });
  const [enviando, setEnviando] = useState(false);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { reportesAPI.getAll().then(setReportes); }, []);

  useEffect(() => {
    if (vista !== 'mapa' || !mapContainerRef.current || mapRef.current) return;
    import('leaflet').then(L => {
      const lf = L.default;
      delete (lf.Icon.Default.prototype as any)._getIconUrl;
      lf.Icon.Default.mergeOptions({ iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });
      const map = lf.map(mapContainerRef.current!, { center: CABORCA_CENTER, zoom: 13 });
      lf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap' }).addTo(map);
      reportes.forEach(r => {
        if (r.lat && r.lng) {
          lf.circleMarker([r.lat,r.lng], { radius:10, fillColor:TIPO_COLORS[r.tipo]||'#6B7280', color:'white', weight:2, fillOpacity:0.9 })
            .addTo(map).bindPopup(`<strong>${r.tipo}</strong><br/>${r.descripcion}<br/><small>${r.ubicacion}</small>`);
        }
      });
      mapRef.current = map;
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [vista, reportes]);

  const enviarReporte = async () => {
    if (!form.descripcion || !form.ubicacion) { toast.error('Descripción y ubicación requeridas'); return; }
    setEnviando(true);
    try {
      const nuevo = await reportesAPI.crear(form);
      setReportes(prev => [nuevo, ...prev]);
      setForm({ tipo:'tráfico', descripcion:'', ubicacion:'' });
      setShowForm(false);
      toast.success('Reporte enviado. Será revisado por el equipo.');
    } catch { toast.error('Error enviando reporte'); }
    finally { setEnviando(false); }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
  const inpStyle = { borderColor:'var(--border)', color:'var(--text-primary)' };

  return (
    <MainLayout>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#FDF1EC' }}>
              <AlertTriangle className="w-5 h-5" style={{ color:'#C4622D' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Reportes Ciudadanos</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>{reportes.length} reportes activos</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Reportar'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor:'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>Nuevo reporte ciudadano</h3>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tipo:t }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${form.tipo === t ? 'text-white border-transparent' : 'bg-white'}`}
                  style={form.tipo === t ? { background:TIPO_COLORS[t]||'#6B7280' } : { borderColor:'var(--border)', color:'var(--text-secondary)' }}>
                  {t}
                </button>
              ))}
            </div>
            <textarea placeholder="¿Qué está pasando?" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion:e.target.value }))}
              rows={3} className={inp+' resize-none'} style={inpStyle} />
            <input type="text" placeholder="Ubicación exacta..." value={form.ubicacion} onChange={e => setForm(f => ({ ...f, ubicacion:e.target.value }))} className={inp} style={inpStyle} />
            <button onClick={enviarReporte} disabled={enviando} className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50">
              {enviando ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {[{v:'lista',icon:List,label:'Lista'},{v:'mapa',icon:Map,label:'Mapa'}].map(({ v, icon:Icon, label }) => (
            <button key={v} onClick={() => setVista(v as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${vista === v ? 'gradient-sunset text-white border-transparent' : 'bg-white'}`}
              style={vista !== v ? { borderColor:'var(--border)', color:'var(--text-secondary)' } : {}}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {vista === 'mapa' && (
          <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor:'var(--border)' }}>
            <div ref={mapContainerRef} style={{ height:'350px' }} />
          </div>
        )}

        {vista === 'lista' && (
          <div className="space-y-3">
            {reportes.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border shadow-sm" style={{ borderColor:'var(--border)' }}>
                <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <div className="text-sm" style={{ color:'var(--text-muted)' }}>No hay reportes activos</div>
              </div>
            ) : reportes.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor:'var(--border)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background:(TIPO_COLORS[r.tipo]||'#6B7280')+'20' }}>
                    <AlertTriangle className="w-4 h-4" style={{ color:TIPO_COLORS[r.tipo]||'#6B7280' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full text-white" style={{ background:TIPO_COLORS[r.tipo]||'#6B7280' }}>{r.tipo}</span>
                      <span className="text-xs flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" />{formatDistanceToNow(new Date(r.created_at), { addSuffix:true, locale:es })}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color:'var(--text-primary)' }}>{r.descripcion}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs" style={{ color:'var(--text-muted)' }}><MapPin className="w-3 h-3" />{r.ubicacion}</div>
                    <div className="mt-2">
                      <ShareWhatsApp texto={`⚠️ Reporte en Caborca: [${r.tipo.toUpperCase()}] ${r.descripcion} 📍 ${r.ubicacion}`} url="https://caborca.app/reportes" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
