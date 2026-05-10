'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import { Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminConfigPage() {
  const [config, setConfig] = useState({ hero_titulo:'¿Qué pasa hoy en', hero_ciudad:'Caborca', hero_subtitulo:'Heroica Caborca, Sonora' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get('/config').then(r => { if (r.data) setConfig(r.data); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/config', config);
      toast.success('Configuracion guardada');
    } catch { toast.error('Error guardando'); }
    finally { setIsSaving(false); }
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border";
  const inpStyle = { borderColor:'var(--border)', color:'var(--text-primary)', background:'var(--surface)' };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#EEF4F9' }}>
            <Settings className="w-5 h-5" style={{ color:'#2D5F8A' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Configuracion del sitio</h1>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Textos y contenido editable</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 border shadow-sm space-y-4" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
          <h2 className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>Texto del hero (pagina de inicio)</h2>

          <div className="rounded-xl p-4 border" style={{ borderColor:'var(--border)', background:'var(--sand)' }}>
            <div className="text-sm font-medium" style={{ color:'var(--text-muted)' }}>Vista previa:</div>
            <div className="mt-2 text-lg font-bold" style={{ color:'var(--desert-blue)' }}>
              {config.hero_titulo} <span style={{ color:'#E8823A' }}>{config.hero_ciudad}</span>?
            </div>
            <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{config.hero_subtitulo}</div>
          </div>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Texto principal</label>
            <input type="text" value={config.hero_titulo} onChange={e => setConfig(c => ({ ...c, hero_titulo: e.target.value }))} className={inp} style={inpStyle} />
          </div>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Ciudad (aparece en naranja)</label>
            <input type="text" value={config.hero_ciudad} onChange={e => setConfig(c => ({ ...c, hero_ciudad: e.target.value }))} className={inp} style={inpStyle} />
          </div>

          <div>
            <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Subtitulo</label>
            <input type="text" value={config.hero_subtitulo} onChange={e => setConfig(c => ({ ...c, hero_subtitulo: e.target.value }))} className={inp} style={inpStyle} />
          </div>

          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
