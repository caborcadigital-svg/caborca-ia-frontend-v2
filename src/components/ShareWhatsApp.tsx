'use client';
import { MessageCircle } from 'lucide-react';
interface Props { texto: string; url?: string; size?: 'sm' | 'md'; }
export default function ShareWhatsApp({ texto, url, size = 'sm' }: Props) {
  const mensaje = url ? `${texto}\n\n${url}` : texto;
  const href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-1.5 font-medium rounded-xl transition-all text-white hover:opacity-90 ${size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'}`}
      style={{ background: '#25D366' }}>
      <MessageCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      Compartir
    </a>
  );
}
