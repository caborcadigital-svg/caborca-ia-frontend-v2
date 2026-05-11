import type { Metadata } from 'next';
import NoticiaDetalle from './NoticiaDetalle';

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/noticias/' + params.id, { next: { revalidate: 300 } });
    if (!res.ok) return { title: 'Noticia | Caborca IA' };
    const n = await res.json();
    return {
      title: n.titulo + ' | Caborca IA',
      description: n.resumen || n.titulo,
      openGraph: {
        title: n.titulo,
        description: n.resumen || n.titulo,
        images: n.imagen_url ? [{ url: n.imagen_url, width: 1200, height: 630, alt: n.titulo }] : [],
        type: 'article',
        locale: 'es_MX',
        siteName: 'Caborca IA',
      },
      twitter: {
        card: 'summary_large_image',
        title: n.titulo,
        description: n.resumen || n.titulo,
        images: n.imagen_url ? [n.imagen_url] : [],
      },
    };
  } catch {
    return { title: 'Noticia | Caborca IA' };
  }
}

export default function Page({ params }: Props) {
  return <NoticiaDetalle id={params.id} />;
}
