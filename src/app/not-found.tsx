import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-slate-400 mb-8">La página que buscas no existe en Caborca IA</p>
        <Link href="/" className="px-6 py-3 rounded-xl gradient-brand text-white font-medium">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
