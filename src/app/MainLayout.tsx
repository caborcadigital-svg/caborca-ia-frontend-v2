'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MessageSquare, Cloud, Newspaper, CalendarDays, AlertTriangle, Trophy, Store, LayoutDashboard, Menu, X, LogOut, ChevronRight, Megaphone, Moon, Sun, BarChart2, Settings, Users } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import GlobalSearch from '../components/GlobalSearch';
import clsx from 'clsx';

const NAV = [
  { href:'/', label:'Inicio', icon:LayoutDashboard, tour:'inicio' },
  { href:'/chat', label:'Chat IA', icon:MessageSquare, tour:'chat' },
  { href:'/clima', label:'Clima', icon:Cloud, tour:'clima' },
  { href:'/noticias', label:'Noticias', icon:Newspaper },
  { href:'/eventos', label:'Eventos', icon:CalendarDays },
  { href:'/reportes', label:'Reportes', icon:AlertTriangle, tour:'reportes' },
  { href:'/deportes', label:'Deportes', icon:Trophy, tour:'deportes' },
  { href:'/negocios', label:'Negocios', icon:Store, tour:'negocios' },
];

const ADMIN_NAV_BASE = [
  { href:'/admin', label:'Panel Admin', icon:LayoutDashboard, roles:['superadmin','admin','editor_noticias','editor_eventos','moderador'] },
  { href:'/admin/noticias', label:'Noticias', icon:Newspaper, roles:['superadmin','admin','editor_noticias'] },
  { href:'/admin/eventos', label:'Eventos', icon:CalendarDays, roles:['superadmin','admin','editor_eventos'] },
  { href:'/admin/deportes', label:'Deportes', icon:Trophy, roles:['superadmin','admin'] },
  { href:'/admin/negocios', label:'Negocios', icon:Store, roles:['superadmin','admin'] },
  { href:'/admin/reportes', label:'Reportes', icon:AlertTriangle, roles:['superadmin','admin','moderador'] },
  { href:'/admin/resultados', label:'Resultados enviados', icon:Trophy, roles:['superadmin','admin','moderador'] },
  { href:'/admin/solicitudes', label:'Solicitudes', icon:Store, roles:['superadmin','admin'] },
  { href:'/admin/publicidad', label:'Publicidad', icon:Megaphone, roles:['superadmin','admin'] },
  { href:'/admin/sugerencias', label:'Sugerencias Chat', icon:MessageSquare, roles:['superadmin','admin'] },
  { href:'/admin/stats', label:'Estadisticas Chat', icon:BarChart2, roles:['superadmin','admin'] },
  { href:'/admin/usuarios', label:'Colaboradores', icon:Users, roles:['superadmin'] },
  { href:'/admin/config', label:'Configuracion', icon:Settings, roles:['superadmin'] },
];

function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="lg1" cx="50%" cy="65%" r="60%"><stop offset="0%" stopColor="#F5A623"/><stop offset="55%" stopColor="#E05C3A"/><stop offset="100%" stopColor="#6B3FA0"/></radialGradient></defs>
      <circle cx="50" cy="44" r="36" fill="url(#lg1)"/>
      <path d="M14 62 Q30 54 50 58 Q70 62 86 54 L86 80 Q70 76 50 78 Q30 80 14 74Z" fill="#1E0F3A" opacity="0.65"/>
      <rect x="32" y="37" width="36" height="24" rx="2" fill="#1E0F3A" opacity="0.75"/>
      <rect x="43" y="22" width="14" height="17" rx="2" fill="#1E0F3A" opacity="0.75"/>
      <rect x="48" y="17" width="4" height="7" rx="1" fill="#1E0F3A" opacity="0.75"/>
      <path d="M20 56 Q24 40 20 28 Q18 23 22 23 Q25 24 24 29 Q28 23 27 18" stroke="#4A7C59" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      <path d="M24 40 Q19 38 17 40" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M24 47 Q29 45 31 47" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <ellipse cx="50" cy="80" rx="26" ry="9" fill="#1E0F3A" opacity="0.88"/>
      <rect x="32" y="73" width="36" height="14" rx="7" fill="white"/>
      <ellipse cx="43" cy="80" rx="3.5" ry="4.5" fill="#4A90C4"/>
      <ellipse cx="57" cy="80" rx="3.5" ry="4.5" fill="#4A90C4"/>
      <path d="M50 87 L47 96 L50 94 L53 96Z" fill="white"/>
      <circle cx="72" cy="20" r="2.5" fill="white" opacity="0.85"/>
      <circle cx="62" cy="13" r="1.8" fill="white" opacity="0.65"/>
      <circle cx="79" cy="28" r="1.2" fill="white" opacity="0.55"/>
    </svg>
  );
}

export { LogoIcon };

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout, loadFromStorage } = useAuthStore();
  const { dark, toggle } = useDarkMode();
  useEffect(() => { loadFromStorage(); }, []);

  const rol = user?.role || '';
  const isAdmin = ['superadmin','admin','editor_noticias','editor_eventos','moderador'].includes(rol);
  const isSuperadmin = rol === 'superadmin';
  const enAdmin = pathname.startsWith('/admin');

  const adminNav = ADMIN_NAV_BASE.filter(item => item.roles.includes(rol));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'var(--sand)' }}>
      <div className={clsx('fixed inset-0 bg-black/40 z-20 lg:hidden transition-opacity', open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} onClick={() => setOpen(false)} />
      <aside className={clsx('fixed top-0 left-0 h-full z-30 flex flex-col sidebar-desert w-[260px] transition-transform duration-300 ease-in-out', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <LogoIcon size={40} />
          <div><div className="font-display font-bold text-white text-base leading-tight">Caborca IA</div><div className="text-xs text-white/50">Tu asistente inteligente</div></div>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {!enAdmin && NAV.map(({ href, label, icon:Icon, tour }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} data-tour={tour}
                className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', active ? 'nav-active' : 'text-white/60 hover:text-white hover:bg-white/10')}>
                <Icon className="w-4 h-4 shrink-0" />{label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
              </Link>
            );
          })}
          {isAdmin && !enAdmin && (
            <div className="pt-2 mt-2 border-t border-white/10">
              <p className="text-xs text-white/30 px-3 mb-1 font-medium uppercase tracking-wider">Admin</p>
              <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-white/60 hover:text-amber-300 hover:bg-amber-500/10">
                <LayoutDashboard className="w-4 h-4 shrink-0" />Panel Admin
              </Link>
            </div>
          )}
          {isAdmin && enAdmin && (
            <>
              <div className="px-3 mb-2"><Link href="/" onClick={() => setOpen(false)} className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1">← Volver al sitio</Link></div>
              <div className="px-3 mb-1 flex items-center gap-2">
                <p className="text-xs text-white/30 font-medium uppercase tracking-wider">Admin</p>
                {isSuperadmin && <span className="text-xs px-1.5 py-0.5 rounded-full text-white/70 border border-white/20" style={{ fontSize:'9px' }}>SUPER</span>}
              </div>
              {adminNav.map(({ href, label, icon:Icon }) => {
                const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                return (
                  <Link key={href} href={href} onClick={() => setOpen(false)}
                    className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', active ? 'bg-amber-500/20 text-amber-300' : 'text-white/60 hover:text-amber-300 hover:bg-amber-500/10')}>
                    <Icon className="w-4 h-4 shrink-0" />{label}
                    {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
                  </Link>
                );
              })}
            </>
          )}
        </nav>
        <div className="px-2 py-3 border-t border-white/10 space-y-2">
          <button onClick={toggle} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all text-white/60 hover:text-white hover:bg-white/10">
            {dark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {dark ? 'Modo claro' : 'Modo oscuro'}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full gradient-sunset flex items-center justify-center text-white text-sm font-bold shrink-0">{user?.nombre?.[0]?.toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user?.nombre}</div>
                <div className="text-xs text-white/40 truncate capitalize">{user?.role}</div>
              </div>
              <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            <Link href="/auth" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-sunset text-white text-sm font-medium w-full shadow-lg">
              <MessageSquare className="w-4 h-4" />Iniciar sesion
            </Link>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        <header className="flex items-center gap-3 px-4 py-2.5 border-b sticky top-0 z-10 bg-white/90 backdrop-blur-sm" style={{ borderColor:'var(--border)' }}>
          <button onClick={() => setOpen(true)} className="lg:hidden" style={{ color:'var(--desert-blue)' }}><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 lg:hidden"><LogoIcon size={30} /><span className="font-display font-bold text-sm" style={{ color:'var(--desert-blue)' }}>{enAdmin ? 'Admin' : 'Caborca IA'}</span></div>
          <div className="flex-1 flex items-center justify-end gap-2">
            {!enAdmin && <GlobalSearch />}
            <button onClick={toggle} className="p-1.5 rounded-lg" style={{ color:'var(--text-muted)' }}>{dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
            {!isAuthenticated && !enAdmin && (
              <Link href="/auth" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium gradient-sunset text-white">Iniciar sesion</Link>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
