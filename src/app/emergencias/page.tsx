'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { Phone, AlertCircle, MapPin } from 'lucide-react';

const ICONOS: Record<string, string> = {
  ambulancia: '🚑',
  hospital: '🏥',
  policia: '👮',
  bomberos: '🚒',
  cruz_roja: '🩺',
  proteccion_civil: '🦺',
  imss: '🏨',
  issste: '🏨',
  gas: '⚠️',
  luz: '⚡',
  agua: '💧',
  vialidad: '🚦',
  dif: '🤝',
  otro: '📞',
};

const CATEGORIA_COLORES: Record<string, { bg: string; color: string; ring: string }> = {
  emergencia: { bg: '#FEF2F2', color: '#DC2626', ring: '#FECACA' },
  salud: { bg: '#EFF6FF', color: '#2563EB', ring: '#BFDBFE' },
  seguridad: { bg: '#F0FDF4', color: '#16A34A', ring: '#BBF7D0' },
  servicios: { bg: '#FFFBEB', color: '#D97706', ring: '#FDE68A' },
  gobierno: { bg: '#F5F3FF', color: '#7C3AED', ring: '#DDD6FE' },
};

export default function EmergenciasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/emergencias')
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d.filter((i: any) => i.activo) : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const categorias = ['todos', ...Array.from(new Set(items.map(i => i.categoria)))];
  const filtrados = filtro === 'todos' ? items : items.filter(i => i.categoria === filtro);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF2F2' }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#DC2626' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Directorio de Emergencias</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Heroica Caborca, Sonora</p>
          </div>
        </div>

        <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <span className="text-2xl">🆘</span>
          <div>
            <div className="text-sm font-bold" style={{ color: '#DC2626' }}>Emergencia inmediata</div>
            <div className="text-xs" style={{ color: '#EF4444' }}>Llama al 911 para emergencias de vida o muerte</div>
          </div>
          <a href="tel:911" className="ml-auto shrink-0 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-md" style={{ background: '#DC2626' }}>
            911
          </a>
        </div>

        {categorias.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setFiltro(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border"
                style={{
                  background: filtro === cat ? '#DC2626' : 'var(--card)',
                  color: filtro === cat ? 'white' : 'var(--text-secondary)',
                  borderColor: filtro === cat ? '#DC2626' : 'var(--border)',
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl p-4 animate-pulse flex gap-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: 'var(--sand-dark)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-1/2" style={{ background: 'var(--sand-dark)' }} />
                  <div className="h-3 rounded w-3/4" style={{ background: 'var(--sand-dark)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No hay servicios en esta categoría</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.map(item => {
              const colores = CATEGORIA_COLORES[item.categoria] || CATEGORIA_COLORES.servicios;
              return (
                <div key={item.id} className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                    style={{ background: colores.bg, border: '1.5px solid ' + colores.ring }}>
                    {ICONOS[item.tipo] || ICONOS.otro}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.nombre}</div>
                    {item.descripcion && <div className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{item.descripcion}</div>}
                    {item.direccion && (
                      <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <MapPin className="w-3 h-3 shrink-0" />{item.direccion}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {item.telefono && (
                        <a href={'tel:' + item.telefono}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold text-white"
                          style={{ background: colores.color }}>
                          <Phone className="w-3 h-3" /> {item.telefono}
                        </a>
                      )}
                      {item.telefono2 && (
                        <a href={'tel:' + item.telefono2}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border"
                          style={{ borderColor: colores.color, color: colores.color, background: colores.bg }}>
                          <Phone className="w-3 h-3" /> {item.telefono2}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full font-medium capitalize shrink-0"
                    style={{ background: colores.bg, color: colores.color }}>
                    {item.categoria}
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
