'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../hooks/useAuth';
import { authAPI } from '../../../lib/api';
import { Zap, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ identificador: '', password: '' });
  const [regForm, setRegForm] = useState({ nombre: '', username: '', email: '', password: '', codigo_admin: '' });

  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!loginForm.identificador || !loginForm.password) { toast.error('Completa todos los campos'); return; }
    setIsLoading(true);
    try {
      await login(loginForm.identificador, loginForm.password);
      toast.success('¡Bienvenido!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
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
      toast.success('Cuenta creada exitosamente');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-600/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Caborca IA</h1>
          <p className="text-slate-400 text-sm mt-1">
            {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </p>
        </div>

        <div className="glass rounded-3xl p-8 space-y-5">
          <div className="flex rounded-xl overflow-hidden border border-surface-600">
            <button onClick={() => setModo('login')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${modo === 'login' ? 'gradient-brand text-white' : 'text-slate-400 hover:text-white'}`}>
              Iniciar sesión
            </button>
            <button onClick={() => setModo('registro')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${modo === 'registro' ? 'gradient-brand text-white' : 'text-slate-400 hover:text-white'}`}>
              Registrarse
            </button>
          </div>

          {modo === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Usuario o correo electrónico</label>
                <input
                  type="text"
                  placeholder="usuario o correo@ejemplo.com"
                  value={loginForm.identificador}
                  onChange={e => setLoginForm(f => ({ ...f, identificador: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} disabled={isLoading}
                className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-600/20">
                <LogIn className="w-4 h-4" />
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Nombre completo</label>
                <input type="text" placeholder="Tu nombre" value={regForm.nombre}
                  onChange={e => setRegForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Usuario</label>
                  <input type="text" placeholder="usuario123" value={regForm.username}
                    onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Correo electrónico</label>
                  <input type="email" placeholder="correo@ejemplo.com" value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={regForm.password}
                    onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Código de administrador <span className="text-slate-600">(opcional)</span></label>
                <input type="text" placeholder="Solo si tienes código admin" value={regForm.codigo_admin}
                  onChange={e => setRegForm(f => ({ ...f, codigo_admin: e.target.value }))}
                  className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-500 placeholder:text-slate-500" />
              </div>
              <button onClick={handleRegistro} disabled={isLoading}
                className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-brand-600/20">
                <UserPlus className="w-4 h-4" />
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
