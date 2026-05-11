'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { ArrowLeft, Phone, MapPin, Clock, MessageCircle, Globe, Star } from 'lucide-react';
import ShareWhatsApp from '../../../components/ShareWhatsApp';
import { Skeleton } from '../../../components/Skeleton';

function formatWhatsApp(tel: string) {
  const digits = tel.replace(/\D/g, '');
  return digits.length === 10 ? '52' + digits : digits;
}

export default function NegocioDetalle({ id }: { id: string }) {
  const [negocio, setNegocio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/negocios/' + id).then(r => setNegocio(r.data)).catch(() => router.push('/negocios')).finally(() => setIsLoading(false));
  }, [id]);

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <Link href="/negocios" className="flex items-center gap-2 text-sm" style={{ color:'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" /> Volver a negocios
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : negocio ? (
          <>
            {negocio.imagen_url ? (
              <img src={negocio.imagen_url} alt={negocio.nombre} className="w-full h-48 object-cover rounded-2xl shadow-md" />
            ) : (
              <div className="w-full h-32 rounded-2xl flex items-center justify-center text-5xl" style={{ background:'var(--sand-dark)' }}>🏪</div>
            )}
            <div className="rounded-2xl p-5 border shadow-sm space-y-4" style={{ background:'var(--card)', borderColor:'var(--border)' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold capitalize mb-1" style={{ color:'#2D5F8A' }}>{negocio.categoria}</div>
                  <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>{negocio.nombre}</h1>
                  {negocio.destacado && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5" style={{ color:'#E8823A' }} />
                      <span className="text-xs font-medium" style={{ color:'#E8823A' }}>Negocio destacado</span>
                    </div>
                  )}
                </div>
                <ShareWhatsApp texto={'Mira este negocio en Caborca IA: ' + negocio.nombre} url={'https://caborca.app/negocios/' + negocio.id} size="sm" />
              </div>
              {negocio.descripcion && <p className="text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{negocio.descripcion}</p>}
              <div className="space-y-2.5">
                {negocio.direccion && <div className="flex items-start gap-2.5"><MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color:'var(--terracotta)' }} /><span className="text-sm" style={{ color:'var(--text-primary)' }}>{negocio.direccion}</span></div>}
                {negocio.horario && <div className="flex items-start gap-2.5"><Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color:'var(--terracotta)' }} /><span className="text-sm" style={{ color:'var(--text-primary)' }}>{negocio.horario}</span></div>}
                {negocio.telefono && <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 shrink-0" style={{ color:'var(--terracotta)' }} /><a href={'tel:' + negocio.telefono} className="text-sm font-medium" style={{ color:'var(--desert-blue)' }}>{negocio.telefono}</a></div>}
                {negocio.sitio_web && <div className="flex items-center gap-2.5"><Globe className="w-4 h-4 shrink-0" style={{ color:'var(--terracotta)' }} /><a href={negocio.sitio_web} target="_blank" rel="noopener noreferrer" className="text-sm font-medium truncate" style={{ color:'var(--desert-blue)' }}>{negocio.sitio_web.replace(/^https?:\/\//, '')}</a></div>}
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {negocio.telefono && (
                  <a href={'https://wa.me/' + formatWhatsApp(negocio.telefono) + '?text=' + encodeURIComponent('Hola, vi tu negocio en Caborca IA')}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm shadow-md"
                    style={{ background:'#25D366' }}>
                    <MessageCircle className="w-5 h-5" /> Contactar por WhatsApp
                  </a>
                )}
                {negocio.menu_url && (
                  <a href={negocio.menu_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border"
                    style={{ background:'var(--card)', borderColor:'var(--border)', color:'var(--text-primary)' }}>
                    Ver menu / carta
                  </a>
                )}
                {negocio.telefono && (
                  <a href={'tel:' + negocio.telefono}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border"
                    style={{ background:'var(--card)', borderColor:'var(--border)', color:'var(--text-primary)' }}>
                    <Phone className="w-5 h-5" style={{ color:'var(--terracotta)' }} /> Llamar
                  </a>
                )}
              </div>
            </div>
            {negocio.lat && negocio.lng && (
              <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor:'var(--border)' }}>
                <iframe title={'Mapa de ' + negocio.nombre}
                  src={'https://maps.google.com/maps?q=' + negocio.lat + ',' + negocio.lng + '&z=16&output=embed'}
                  className="w-full h-48" loading="lazy" />
                <div className="p-3" style={{ background:'var(--card)' }}>
                  <a href={'https://maps.google.com/?q=' + negocio.lat + ',' + negocio.lng} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium" style={{ color:'var(--terracotta)' }}>
                    Abrir en Google Maps →
                  </a>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}
