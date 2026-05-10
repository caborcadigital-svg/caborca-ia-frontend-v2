'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { ArrowLeft, Phone, MapPin, Clock, MessageCircle, Menu, Globe, Star } from 'lucide-react';

function formatWhatsApp(tel: string) {
  const digits = tel.replace(/\D/g, '');
  return digits.length === 10 ? `52${digits}` : digits;
}

export default function NegocioDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [negocio, setNegocio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/negocios/${id}`)
      .then(r => setNegocio(r.data))
      .catch(() => router.push('/negocios'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-3 py-4 space-y-4 animate-pulse">
        <div className="h-48 bg-gray-100 rounded-2xl" />
        <div className="h-6 bg-gray-100 rounded w-2/3" />
      </div>
    </MainLayout>
  );

  if (!negocio) return null;

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <Link href="/negocios" className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Volver a negocios
        </Link>

        {negocio.imagen_url ? (
          <img src={negocio.imagen_url} alt={negocio.nombre} className="w-full h-48 object-cover rounded-2xl" />
        ) : (
          <div className="w-full h-32 rounded-2xl flex items-center justify-center text-5xl" style={{ background: '#EEF4F9' }}>🏪</div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div>
            <div className="text-xs font-semibold capitalize mb-1" style={{ color: '#2D5F8A' }}>{negocio.categoria}</div>
            <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>{negocio.nombre}</h1>
            {negocio.destacado && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5" style={{ color: '#E8823A' }} />
                <span className="text-xs font-medium" style={{ color: '#E8823A' }}>Negocio destacado</span>
              </div>
            )}
          </div>

          {negocio.descripcion && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{negocio.descripcion}</p>
          )}

          <div className="space-y-2.5">
            {negocio.direccion && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--terracotta)' }} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{negocio.direccion}</span>
              </div>
            )}
            {negocio.horario && (
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--terracotta)' }} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{negocio.horario}</span>
              </div>
            )}
            {negocio.telefono && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: 'var(--terracotta)' }} />
                <a href={`tel:${negocio.telefono}`} className="text-sm font-medium" style={{ color: 'var(--desert-blue)' }}>
                  {negocio.telefono}
                </a>
              </div>
            )}
            {negocio.sitio_web && (
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 shrink-0" style={{ color: 'var(--terracotta)' }} />
                <a href={negocio.sitio_web} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium truncate" style={{ color: 'var(--desert-blue)' }}>
                  {negocio.sitio_web.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {negocio.telefono && (
              <a href={`https://wa.me/${formatWhatsApp(negocio.telefono)}?text=Hola, vi tu negocio en Caborca IA`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm shadow-md"
                style={{ background: '#25D366' }}>
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </a>
            )}
            {negocio.menu_url && (
              <a href={negocio.menu_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border bg-white"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <Menu className="w-5 h-5" style={{ color: 'var(--terracotta)' }} />
                Ver menú / carta
              </a>
            )}
            {negocio.telefono && (
              <a href={`tel:${negocio.telefono}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border bg-white"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <Phone className="w-5 h-5" style={{ color: 'var(--terracotta)' }} />
                Llamar
              </a>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}