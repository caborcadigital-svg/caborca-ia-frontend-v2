'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';
import { useAuthStore } from '../../hooks/useAuth';
import { LogoIcon } from '../MainLayout';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [tab, setTab] = useState<'login'|'registro'>('login');
  const [form, setForm] = useState({ nombre:'', username:'', email:'', password:'', codigo_admin:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const router = useRouter();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error('Email y contrasena requeridos'); return; }
    setLoading(true);
    try {
      let data;
      if (tab === 'login') {
  await login(form.email, form.password);
  toast.success('Bienvenido');
  router.push('/');
} else {
  if (!form.nombre || !form.username) { toast.error('Nombre y usuario requeridos'); setLoading(false); return; }
  data = await authAPI.registro({ nombre: form.nombre, username: form.username, email: form.email, password: form.password, codigo_admin: form.codigo_admin });
  if (data.token) {
    localStorage.setItem('caborca_token', data.token);
    localStorage.setItem('caborca_user', JSON.stringify(data.usuario));
    toast.success('Cuenta creada exitosamente');
    router.push('/');
  }
}
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al ' + (tab === 'login' ? 'iniciar sesion' : 'registrarse'));
    } finally { setLoading(false); }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border";
  const inpStyle = { borderColor:'var(--border)', color:'var(--text-primary)', background:'var(--surface)' };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background:'var(--sand)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><LogoIcon size={64} /></div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--desert-blue)' }}>Caborca IA</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Tu asistente inteligente de Heroica Caborca</p>
        </div>

        <div className="rounded-2xl p-6 border shadow-sm space-y-4" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor:'var(--border)' }}>
            {(['login','registro'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-medium capitalize transition-all"
                style={{ background: tab === t ? '#E05C3A' : 'transparent', color: tab === t ? 'white' : 'var(--text-secondary)' }}>
                {t === 'login' ? 'Iniciar sesion' : 'Registrarse'}
              </button>
            ))}
          </div>

          {tab === 'registro' && (
            <>
              <input type="text" placeholder="Nombre completo *" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inp} style={inpStyle} />
              <input type="text" placeholder="Nombre de usuario *" value={form.username} onChange={e => set('username', e.target.value)} className={inp} style={inpStyle} />
            </>
          )}

          <input type="text" placeholder="Email o usuario *" value={form.email} onChange={e => set('email', e.target.value)} className={inp} style={inpStyle} />

          <div className="relative">
            <input type={showPass ? 'text' : 'password'} placeholder="Contrasena *" value={form.password}
              onChange={e => set('password', e.target.value)} className={inp + ' pr-11'} style={inpStyle}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {tab === 'registro' && (
            <input type="text" placeholder="Codigo admin (opcional)" value={form.codigo_admin} onChange={e => set('codigo_admin', e.target.value)} className={inp} style={inpStyle} />
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-xl gradient-sunset text-white font-semibold text-sm disabled:opacity-50 shadow-md">
            {loading ? 'Cargando...' : tab === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
          </button>

          <button onClick={() => router.push('/')} className="w-full text-center text-xs" style={{ color:'var(--text-muted)' }}>
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
