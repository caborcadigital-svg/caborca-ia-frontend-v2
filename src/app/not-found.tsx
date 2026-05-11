import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background:'var(--sand)' }}>
      <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mb-6">
        <defs><radialGradient id="lg404" cx="50%" cy="65%" r="60%"><stop offset="0%" stopColor="#F5A623"/><stop offset="55%" stopColor="#E05C3A"/><stop offset="100%" stopColor="#6B3FA0"/></radialGradient></defs>
        <circle cx="50" cy="44" r="36" fill="url(#lg404)" opacity="0.3"/>
        <text x="50" y="55" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#E05C3A">404</text>
      </svg>
      <h1 className="font-display text-3xl font-bold mb-2" style={{ color:'var(--desert-blue)' }}>Pagina no encontrada</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color:'var(--text-muted)' }}>
        Esta pagina no existe o fue movida. Vuelve al inicio para encontrar lo que buscas.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/" className="py-3 rounded-xl gradient-sunset text-white font-semibold text-sm text-center shadow-md">
          Ir al inicio
        </Link>
        <Link href="/chat" className="py-3 rounded-xl border text-sm font-medium text-center"
          style={{ borderColor:'var(--border)', color:'var(--text-secondary)', background:'var(--card)' }}>
          Preguntale a la IA
        </Link>
      </div>
    </div>
  );
}
