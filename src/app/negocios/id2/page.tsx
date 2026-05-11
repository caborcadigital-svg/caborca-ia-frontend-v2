import type { Metadata } from 'next';
import NegocioDetalle from './NegocioDetalle';

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/negocios/' + params.id, { next: { revalidate: 600 } });
    if (!res.ok) return { title: 'Negocio | Caborca IA' };
    const n = await res.json();
    return {
      title: n.nombre + ' en Caborca | Caborca IA',
      description: n.descripcion || n.nombre + ' — ' + n.categoria + ' en Heroica Caborca, Sonora',
      openGraph: {
        title: n.nombre + ' | Caborca IA',
        description: n.descripcion || n.nombre + ' en Caborca, Sonora',
        images: n.imagen_url ? [{ url: n.imagen_url, width: 800, height: 600, alt: n.nombre }] : [],
        type: 'website',
        locale: 'es_MX',
        siteName: 'Caborca IA',
      },
    };
  } catch {
    return { title: 'Negocio | Caborca IA' };
  }
}

export default function Page({ params }: Props) {
  return <NegocioDetalle id={params.id} />;
}
