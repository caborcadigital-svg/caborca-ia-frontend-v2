'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, AlertTriangle, Store, Trophy } from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { href: '/', label: 'Inicio', icon: Home, tour: 'inicio' },
  { href: '/deportes', label: 'Deportes', icon: Trophy, tour: 'deportes' },
  { href: '/chat', label: 'Chat IA', icon: MessageSquare, fab: true, tour: 'chat' },
  { href: '/reportes', label: 'Reportes', icon: AlertTriangle, tour: 'reportes' },
  { href: '/negocios', label: 'Negocios', icon: Store, tour: 'negocios' },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden"
      style={{
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 35,
      }}>
      <div className="flex items-center justify-around px-2 py-1">
        {NAV.map(({ href, label, icon: Icon, fab, tour }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          if (fab) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center -mt-5" data-tour={tour}>
                <div className="w-14 h-14 rounded-full gradient-sunset flex items-center justify-center shadow-lg shadow-orange-200">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span style={{ color: active ? 'var(--sunset-coral)' : 'var(--text-muted)', fontSize: '10px' }} className="mt-1 font-medium">
                  {label}
                </span>
              </Link>
            );
          }
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all" data-tour={tour}>
              <Icon className="w-5 h-5" style={{ color: active ? 'var(--sunset-coral)' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400', color: active ? 'var(--sunset-coral)' : 'var(--text-muted)' }}>
                {label}
              </span>
              {active && <div className="w-1 h-1 rounded-full" style={{ background: 'var(--sunset-coral)' }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
