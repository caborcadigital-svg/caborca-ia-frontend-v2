'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  MessageSquare, Cloud, Newspaper, CalendarDays, AlertTriangle,
  Trophy, Store, LayoutDashboard, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import clsx from 'clsx';

const NAV = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/chat', label: 'Chat IA', icon: MessageSquare },
  { href: '/clima', label: 'Clima', icon: Cloud },
  { href: '/noticias', label: 'Noticias', icon: Newspaper },
  { href: '/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/reportes', label: 'Reportes', icon: AlertTriangle },
  { href: '/deportes', label: 'Deportes', icon: Trophy },
  { href: '/negocios', label: 'Negocios', icon: Store },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout, loadFromStorage } = useAuthStore();

  useEffect(() => { loadFromStorage(); }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--sand)' }}>
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setOpen(false)}
      />

      <aside className={clsx(
        'fixed top-0 left-0 h-full z-30 flex flex-col sidebar-desert',
        'transition-transform duration-300 ease-in-out w-[270px]',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
            <img src="/logo.png" alt="Caborca IA" className="w-full h-full object-contain" 
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                t.parentElement!.innerHTML = '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6 text-white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2"/></svg>';
              }}
            />
          </div>
          <div>
            <div className="font-display font-bold text-white text-base leading-tight">Caborca IA</div>
            <div className="text-xs text-white/50">Tu asistente inteligente</div>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'nav-active'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
              </Link>
            );
          })}

          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-white/10">
              <p className="text-xs text-white/30 px-3 mb-2 font-medium uppercase tracking-wider">Admin</p>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  pathname.startsWith('/admin')
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-white/60 hover:text-amber-300 hover:bg-amber-500/10'
                )}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Panel Admin
              </Link>
            </div>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full gradient-sunset flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user?.nombre?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.nombre}</div>
                <div className="text-xs text-white/40 truncate">@{user?.username}</div>
              </div>
              <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/chat" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-sunset text-white text-sm font-medium w-full shadow-lg">
              <MessageSquare className="w-4 h-4" />
              Iniciar chat
            </Link>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[270px]">
        <header className="flex items-center gap-3 px-4 py-3 lg:hidden border-b sticky top-0 z-10 bg-white/80 backdrop-blur-sm" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setOpen(true)} style={{ color: 'var(--desert-blue)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="Caborca IA" className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--desert-blue)' }}>Caborca IA</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
