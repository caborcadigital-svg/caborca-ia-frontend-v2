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
      .then(setNegocios)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { buscar(); }, [categoria]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); buscar(); };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Negocios de Caborca</h1>
            <p className="text-slate-400 text-sm">Encuentra tiendas, restaurantes y servicios locales</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar negocios, servicios, restaurantes..."
            className="w-full bg-surface-800 border border-surface-600 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500"
          />
        </form>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                categoria === cat ? 'bg-teal-600 text-white' : 'glass text-slate-400 hover:text-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-surface-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-surface-700 rounded w-full mb-2" />
                <div className="h-3 bg-surface-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : negocios.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <div className="text-slate-400">No se encontraron negocios</div>
            <p className="text-xs text-slate-500 mt-1">Prueba con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {negocios.map(n => (
              <div key={n.id} className="glass rounded-2xl overflow-hidden hover:border-teal-600/30 transition-all">
                {n.imagen_url && <img src={n.imagen_url} alt={n.nombre} className="w-full h-36 object-cover" />}
                <div className="p-4">
                  <div className="text-xs text-teal-400 font-medium capitalize mb-1">{n.categoria}</div>
                  <h2 className="font-display font-bold text-white text-base">{n.nombre}</h2>
                  {n.descripcion && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{n.descripcion}</p>}
                  <div className="space-y-1 mt-3">
                    {n.direccion && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {n.direccion}
                      </div>
                    )}
                    {n.telefono && (
                      <a href={`tel:${n.telefono}`} className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300">
                        <Phone className="w-3 h-3 shrink-0" />
                        {n.telefono}
                      </a>
                    )}
                    {n.horario && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3 h-3 shrink-0" />
                        {n.horario}
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
