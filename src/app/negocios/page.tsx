'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { negociosAPI } from '../lib/api';
import { Store, MapPin, Phone, Clock, Search, MessageCircle, Menu, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const CATEGORIAS = ['todos', 'restaurante', 'farmacia', 'tienda', 'servicio', 'café', 'taqueria', 'supermercado', 'banco', 'hotel', 'otro'];

function formatWhatsApp(tel: string) {
  const digits = tel.replace(/\D/g, '');
  return digits.length === 10 ? `52${digits}` : digits;
}

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [isLoading, setIsLoading] = useState(false);
  const [showSolicitud, setShowSolicitud] = useState(false);
  const [solicitudForm, setSolicitudForm] = useState({ nombre: '', categoria: 'restaurante', descripcion: '', telefono_contacto: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const buscar = (query = q, cat = categoria) => {
    setIsLoading(true);
    negociosAPI.getAll({ q: query || undefined, categoria: cat === 'todos' ? undefined : cat })
      .then(setNegocios).finally(() => setIsLoading(false));
  };

  useEffect(() => { buscar(); }, [categoria]);

  const enviarSolicitud = async () => {
    if (!solicitudForm.nombre) return;
    setEnviando(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes-negocios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solicitudForm),
      });
      setEnviado(true);
      setTimeout(() => { setShowSolicitud(false); setEnviado(false); setSolicitudForm({ nombre: '', categoria: 'restaurante', descripcion: '', telefono_contacto: '' }); }, 2000);
    } catch {
      setEnviado(false);
    } finally {
      setEnviando(false);
    }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF4F9' }}>
              <Store className="w-5 h-5" style={{ color: '#2D5F8A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Negocios de Caborca</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tiendas, restaurantes y servicios locales</p>
            </div>
          </div>
          <button onClick={() => setShowSolicitud(!showSolicitud)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border bg-white hover:shadow-sm transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--terracotta)' }}>
            <Plus className="w-4 h-4" />
            Solicitar
          </button>
        </div>

        {showSolicitud && (
          <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-3 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>📍 Solicitar registro de negocio</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>¿Conoces un negocio que debería estar aquí? Mándanos la info y lo agregamos.</p>

            {enviado ? (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">✅</div>
                <div className="font-semibold text-sm" style={{ color: '#16a34a' }}>¡Solicitud enviada!</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Lo revisaremos pronto</div>
              </div>
            ) : (
              <>
                <input type="text" placeholder="Nombre del negocio *" value={solicitudForm.nombre}
                  onChange={e => setSolicitudForm(f => ({ ...f, nombre: e.target.value }))}
                  className={inp} style={inpStyle} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Categoría</label>
                    <select value={solicitudForm.categoria} onChange={e => setSolicitudForm(f => ({ ...f, categoria: e.target.value }))} className={inp} style={inpStyle}>
                      {CATEGORIAS.filter(c => c !== 'todos').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Tu teléfono (opcional)</label>
                    <input type="tel" placeholder="638 000 0000" value={solicitudForm.telefono_contacto}
                      onChange={e => setSolicitudForm(f => ({ ...f, telefono_contacto: e.target.value }))}
                      className={inp} style={inpStyle} />
                  </div>
                </div>
                <textarea placeholder="Descripción, dirección o info adicional..." value={solicitudForm.descripcion}
                  onChange={e => setSolicitudForm(f => ({ ...f, descripcion: e.target.value }))}
                  rows={2} className={inp + ' resize-none'} style={inpStyle} />
                <div className="flex gap-2">
                  <button onClick={enviarSolicitud} disabled={!solicitudForm.nombre || enviando}
                    className="flex-1 py-2.5 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50">
                    {enviando ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                  <button onClick={() => setShowSolicitud(false)}
                    className="px-4 py-2.5 rounded-xl border text-sm bg-white"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}

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
                <div className="h-24 bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : negocios.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <Store className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No se encontraron negocios</div>
            <button onClick={() => setShowSolicitud(true)}
              className="mt-3 text-xs font-medium hover:underline" style={{ color: 'var(--terracotta)' }}>
              ¿Conoces uno? Solicita que lo agreguemos →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {negocios.map(n => (
              <Link key={n.id} href={`/negocios/${n.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden block">
                {n.imagen_url ? (
                  <img src={n.imagen_url} alt={n.nombre} className="w-full h-28 object-cover" />
                ) : (
                  <div className="w-full h-28 flex items-center justify-center" style={{ background: '#EEF4F9' }}>
                    <Store className="w-10 h-10" style={{ color: '#2D5F8A' }} />
                  </div>
                )}
                <div className="p-3">
                  <div className="text-xs font-semibold capitalize mb-0.5" style={{ color: '#2D5F8A' }}>{n.categoria}</div>
                  <div className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{n.nombre}</div>
                  {n.direccion && (
                    <div className="flex items-center gap-1 text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                      <MapPin className="w-3 h-3 shrink-0" />{n.direccion}
                    </div>
                  )}
                  <div className="flex gap-1.5 mt-2">
                    {n.telefono && (
                      <a href={`https://wa.me/${formatWhatsApp(n.telefono)}`} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-white"
                        style={{ background: '#25D366' }}>
                        <MessageCircle className="w-3 h-3" /> WA
                      </a>
                    )}
                    {n.menu_url && (
                      <a href={n.menu_url} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border bg-white"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        <Menu className="w-3 h-3" /> Menú
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
