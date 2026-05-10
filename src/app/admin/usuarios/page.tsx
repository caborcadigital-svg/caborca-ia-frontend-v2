'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { useAuthStore } from '../../../hooks/useAuth';
import { Users, Plus, X, Edit, UserX, UserCheck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  { value:'admin', label:'Admin', desc:'Crear y editar todo. No puede eliminar.' },
  { value:'editor_noticias', label:'Editor Noticias', desc:'Solo crear y editar noticias.' },
  { value:'editor_eventos', label:'Editor Eventos', desc:'Solo crear y editar eventos.' },
  { value:'moderador', label:'Moderador', desc:'Aprobar reportes y resultados deportivos.' },
];

const ROLE_COLORS: Record<string,string> = {
  superadmin:'#6B3FA0', admin:'#2D5F8A', editor_noticias:'#4A7C59', editor_eventos:'#E8823A', moderador:'#C4622D',
};

const FORM_INIT = { nombre:'', username:'', email:'', password:'', role:'editor_noticias' };

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(FORM_INIT);
  const [editId, setEditId] = useState<string|null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    api.get('/usuarios').then(r => setUsuarios(r.data)).catch(() => toast.error('Error cargando usuarios'));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nombre || !form.email || !form.role) { toast.error('Nombre, email y rol requeridos'); return; }
    if (!editId && !form.password) { toast.error('Contrasena requerida para nuevo colaborador'); return; }
    if (!editId && !form.username) { toast.error('Nombre de usuario requerido'); return; }
    setIsSaving(true);
    try {
      if (editId) {
        const updated = await api.put('/usuarios/' + editId, { nombre: form.nombre, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) });
        setUsuarios(prev => prev.map(u => u.id === editId ? { ...u, ...updated.data } : u));
        toast.success('Colaborador actualizado');
      } else {
        const nuevo = await api.post('/usuarios', form);
        setUsuarios(prev => [nuevo.data, ...prev]);
        toast.success('Colaborador creado');
      }
      setForm(FORM_INIT); setShowForm(false); setEditId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error guardando');
    } finally { setIsSaving(false); }
  };

  const handleEdit = (u: any) => {
    setForm({ nombre: u.nombre, username: u.username, email: u.email, password: '', role: u.role });
    setEditId(u.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleActivo = async (u: any) => {
    try {
      await api.put('/usuarios/' + u.id, { activo: !u.activo });
      setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, activo: !u.activo } : x));
      toast.success(u.activo ? 'Colaborador desactivado' : 'Colaborador activado');
    } catch { toast.error('Error actualizando estado'); }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--surface)' };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F3EEF9' }}>
              <Users className="w-5 h-5" style={{ color: '#6B3FA0' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Colaboradores</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{usuarios.filter(u => u.activo).length} activos</p>
            </div>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(FORM_INIT); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium gradient-sunset text-white shadow-sm">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancelar' : 'Nuevo'}
          </button>
        </div>

        {showForm && (
          <div className="rounded-2xl p-5 border shadow-sm space-y-4 animate-slide-up" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{editId ? 'Editar colaborador' : 'Nuevo colaborador'}</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Nombre completo *</label>
                <input type="text" placeholder="Juan Lopez" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inp} style={inpStyle} />
              </div>
              {!editId && (
                <div>
                  <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Usuario *</label>
                  <input type="text" placeholder="juanlopez" value={form.username} onChange={e => set('username', e.target.value)} className={inp} style={inpStyle} />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Email *</label>
              <input type="email" placeholder="juan@ejemplo.com" value={form.email} onChange={e => set('email', e.target.value)} className={inp} style={inpStyle} />
            </div>

            <div className="relative">
              <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>{editId ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena *'}</label>
              <input type={showPass ? 'text' : 'password'} placeholder={editId ? 'Dejar vacio para no cambiar' : 'Minimo 8 caracteres'}
                value={form.password} onChange={e => set('password', e.target.value)} className={inp + ' pr-10'} style={inpStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 bottom-3" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div>
              <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-secondary)' }}>Rol *</label>
              <div className="space-y-2">
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => set('role', r.value)}
                    className={'w-full text-left rounded-xl px-4 py-3 border transition-all ' + (form.role === r.value ? 'border-2' : '')}
                    style={{ borderColor: form.role === r.value ? (ROLE_COLORS[r.value] || '#E05C3A') : 'var(--border)', background: form.role === r.value ? (ROLE_COLORS[r.value] || '#E05C3A') + '10' : 'var(--surface)' }}>
                    <div className="text-sm font-semibold" style={{ color: form.role === r.value ? (ROLE_COLORS[r.value] || '#E05C3A') : 'var(--text-primary)' }}>{r.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} disabled={isSaving}
              className="w-full py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-sm">
              {isSaving ? 'Guardando...' : editId ? 'Actualizar colaborador' : 'Crear colaborador'}
            </button>
          </div>
        )}

        <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b text-xs font-bold uppercase" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'var(--sand)' }}>
            Colaboradores registrados
          </div>
          {usuarios.length === 0 ? (
            <div className="p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No hay colaboradores registrados</div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {usuarios.map(u => (
                <div key={u.id} className={'flex items-center gap-3 px-4 py-3 ' + (!u.activo ? 'opacity-50' : '')}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: ROLE_COLORS[u.role] || '#6B3FA0' }}>
                    {u.nombre?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{u.nombre}</span>
                      {u.role === 'superadmin' && <span className="text-xs px-1.5 py-0.5 rounded-full text-white" style={{ background: '#6B3FA0', fontSize: '10px' }}>SUPER</span>}
                      {!u.activo && <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600" style={{ fontSize: '10px' }}>INACTIVO</span>}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>@{u.username} · {u.email}</div>
                    <div className="text-xs mt-0.5 font-medium capitalize" style={{ color: ROLE_COLORS[u.role] || '#6B3FA0' }}>
                      {ROLES.find(r => r.value === u.role)?.label || u.role}
                    </div>
                  </div>
                  {u.role !== 'superadmin' && u.id !== user?.id && (
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(u)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center border hover:bg-blue-50 hover:border-blue-200 transition-all"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleActivo(u)}
                        className={'w-8 h-8 rounded-xl flex items-center justify-center border transition-all ' + (u.activo ? 'hover:bg-red-50 hover:border-red-200' : 'hover:bg-green-50 hover:border-green-200')}
                        style={{ borderColor: 'var(--border)', color: u.activo ? '#C4622D' : '#4A7C59' }}
                        title={u.activo ? 'Desactivar' : 'Activar'}>
                        {u.activo ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4 border" style={{ borderColor: 'var(--border)', background: 'var(--sand)' }}>
          <h3 className="text-xs font-bold mb-3 uppercase" style={{ color: 'var(--text-muted)' }}>Permisos por rol</h3>
          <div className="space-y-2">
            {ROLES.map(r => (
              <div key={r.value} className="flex items-start gap-3">
                <div className="px-2 py-0.5 rounded-full text-white text-xs font-bold shrink-0 mt-0.5" style={{ background: ROLE_COLORS[r.value] || '#E05C3A' }}>{r.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.desc}</div>
              </div>
            ))}
            <div className="flex items-start gap-3">
              <div className="px-2 py-0.5 rounded-full text-white text-xs font-bold shrink-0 mt-0.5" style={{ background: '#6B3FA0' }}>Superadmin</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Acceso total. Unico que puede eliminar contenido. Gestiona colaboradores.</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
