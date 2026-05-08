'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { negociosAPI } from '../lib/api';
import { Store, MapPin, Phone, Clock, Search } from 'lucide-react';

const CATEGORIAS = ['todos', 'restaurante', 'farmacia', 'tienda', 'servicio', 'café', 'taqueria', 'otro'];

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [isLoading, setIsLoading] = useState(false);

  const buscar = (query = q, cat = categoria) => {
    setIsLoading(true);
    negociosAPI.getAll({ q: query || undefined, categoria: cat === 'todos' ? undefined : cat })
      .then(setNegocios).finally(() => setIsLoading(false));
  };

  useEffect(() => { buscar(); }, [categoria]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF4F9' }}>
            <Store className="w-5 h-5" style={{ color: '#2D5F8A' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Negocios de Caborca</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tiendas, restaurantes y servicios locales</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder="Buscar negocios, restaurantes, servicios..."
            className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none border bg-white shadow-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${categoria === cat ? 'gradient-sunset text-white border-transparent shadow-sm' : 'bg-white'}`}
              style={categoria !== cat ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border animate-pulse" style={{ borderColor: 'var(--border)' }}>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : negocios.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <Store className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No se encontraron negocios</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {negocios.map(n => (
              <div key={n.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                {n.imagen_url && <img src={n.imagen_url} alt={n.nombre} className="w-full h-28 object-cover" />}
                <div className="p-3">
                  <div className="text-xs font-semibold capitalize mb-1" style={{ color: '#2D5F8A' }}>{n.categoria}</div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{n.nombre}</div>
                  {n.descripcion && <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{n.descripcion}</p>}
                  <div className="space-y-1 mt-2">
                    {n.direccion && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <MapPin className="w-3 h-3 shrink-0" /><span className="truncate">{n.direccion}</span>
                      </div>
                    )}
                    {n.telefono && (
                      <a href={`tel:${n.telefono}`} className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--terracotta)' }}>
                        <Phone className="w-3 h-3 shrink-0" />{n.telefono}
                      </a>
                    )}
                    {n.horario && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3 shrink-0" /><span className="truncate">{n.horario}</span>
                      </div>
                    )}
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
