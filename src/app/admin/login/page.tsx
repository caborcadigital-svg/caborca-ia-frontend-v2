'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../hooks/useAuth';
import { authAPI } from '../../../lib/api';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { LogoIcon } from '../../MainLayout';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ identificador: '', password: '' });
  const [regForm, setRegForm] = useState({ nombre: '', username: '', email: '', password: '', codigo_admin: '' });
  const { login } = useAuthStore();
  const router = useRouter();

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border bg-white transition-colors focus:border-terracotta";
  const style = { borderColor: 'var(--border)', color: 'var(--text-primary)' };

  const handleLogin = async () => {
    if (!loginForm.identificador || !loginForm.password) { toast.error('Completa todos los campos'); return; }
    setIsLoading(true);
    try {
      await login(loginForm.identificador, loginForm.password);
      toast.success('¡Bienvenido!');
      router.push('/admin');
    } catch (err: any) { toast.error(err.message); }
    finally { setIsLoading(false); }
  };

  const handleRegistro = async () => {
    if (!regForm.nombre || !regForm.username || !regForm.email || !regForm.password) {
      toast.error('Completa todos los campos requeridos'); return;
    }
    setIsLoading(true);
    try {
      const data = await authAPI.registro(regForm);
      localStorage.setItem('caborca_token', data.token);
      localStorage.setItem('caborca_user', JSON.stringify(data.usuario));
      toast.success('Cuenta creada');
      router.push('/admin');
    } catch (err: any) { toast.error(err.response?.data?.error || 'Error al registrarse'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--sand)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><LogoIcon size={72} /></div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--desert-blue)' }}>Caborca IA</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border" style={{ borderColor: 'var(--border)' }}>
          <div className="flex rounded-xl overflow-hidden border mb-5" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setModo('login')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${modo === 'login' ? 'gradient-sunset text-white' : ''}`}
              style={modo !== 'login' ? { color: 'var(--text-secondary)' } : {}}>
              Iniciar sesión
            </button>
            <button onClick={() => setModo('registro')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${modo === 'registro' ? 'gradient-sunset text-white' : ''}`}
              style={modo !== 'registro' ? { color: 'var(--text-secondary)' } : {}}>
              Registrarse
            </button>
          </div>

          {modo === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Usuario o correo electrónico</label>
                <input type="text" placeholder="usuario o correo@ejemplo.com" value={loginForm.identificador}
                  onChange={e => setLoginForm(f => ({ ...f, identificador: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className={inp} style={style} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className={inp + ' pr-11'} style={style} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} disabled={isLoading}
                className="w-full py-3 rounded-xl gradient-sunset text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-2">
                <LogIn className="w-4 h-4" />
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Nombre completo</label>
                <input type="text" placeholder="Tu nombre" value={regForm.nombre}
                  onChange={e => setRegForm(f => ({ ...f, nombre: e.target.value }))}
                  className={inp} style={style} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Usuario</label>
                  <input type="text" placeholder="usuario123" value={regForm.username}
                    onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))}
                    className={inp} style={style} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Correo</label>
                  <input type="email" placeholder="correo@ejemplo.com" value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    className={inp} style={style} />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                    className={inp + ' pr-11'} style={style} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Código admin <span style={{ color: 'var(--text-muted)' }}>(opcional)</span>
                </label>
                <input type="text" placeholder="Solo si tienes código" value={regForm.codigo_admin}
                  onChange={e => setRegForm(f => ({ ...f, codigo_admin: e.target.value }))}
                  className={inp} style={style} />
              </div>
              <button onClick={handleRegistro} disabled={isLoading}
                className="w-full py-3 rounded-xl gradient-sunset text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
                <UserPlus className="w-4 h-4" />
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
