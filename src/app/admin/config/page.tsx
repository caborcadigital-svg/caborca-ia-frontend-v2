'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import ImageUpload from '../../../components/ImageUpload';
import { Settings, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const GRADIENTS = [
  { label: 'Azul → Morado → Coral', value: 'linear-gradient(135deg, #1E3A5F 0%, #6B3FA0 60%, #E05C3A 100%)' },
  { label: 'Azul marino', value: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)' },
  { label: 'Atardecer', value: 'linear-gradient(135deg, #E05C3A, #E8823A, #F5A623)' },
  { label: 'Desierto', value: 'linear-gradient(135deg, #8B4513, #D2691E, #F5A623)' },
  { label: 'Cactus', value: 'linear-gradient(135deg, #1E3A5F, #4A7C59)' },
  { label: 'Noche', value: 'linear-gradient(135deg, #0F1117, #1E3A5F, #6B3FA0)' },
  { label: 'Personalizado', value: 'custom' },
];

export default function AdminConfigPage() {
  const [config, setConfig] = useState({
    hero_titulo: '¿Qué pasa hoy en',
    hero_ciudad: 'Caborca',
    hero_subtitulo: 'Heroica Caborca, Sonora',
    hero_bg_type: 'gradient',
    hero_gradient: 'linear-gradient(135deg, #1E3A5F 0%, #6B3FA0 60%, #E05C3A 100%)',
    hero_imagen: '',
    hero_color1: '#1E3A5F',
    hero_color2: '#E05C3A',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    api.get('/config').then(r => { if (r.data && Object.keys(r.data).length) setConfig(c => ({ ...c, ...r.data })); }).catch(() => {});
  }, []);

  const set = (k: string, v: string) => setConfig(c => ({ ...c, [k]: v }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/config', config);
      toast.success('Configuracion guardada');
    } catch { toast.error('Error guardando'); }
    finally { setIsSaving(false); }
  };

  const getBg = () => {
    if (config.hero_bg_type === 'imagen' && config.hero_imagen) {
      return { backgroundImage: 'url(' + config.hero_imagen + ')', backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (config.hero_gradient === 'custom') {
      return { background: 'linear-gradient(135deg, ' + config.hero_color1 + ', ' + config.hero_color2 + ')' };
    }
    return { background: config.hero_gradient };
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--surface)' };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EEF4F9' }}>
              <Settings className="w-5 h-5" style={{ color: '#2D5F8A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Configuracion del sitio</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Textos y apariencia del inicio</p>
            </div>
          </div>
          <button onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--surface)' }}>
            <Eye className="w-4 h-4" /> {preview ? 'Editar' : 'Preview'}
          </button>
        </div>

        {preview && (
          <div className="rounded-2xl p-6 text-white flex items-center justify-between gap-3" style={getBg()}>
            <div>
              <h2 className="font-display text-xl font-bold leading-tight">
                {config.hero_titulo} <span style={{ color: '#FCD34D' }}>{config.hero_ciudad}</span>?
              </h2>
              <p className="text-white/60 text-xs mt-1">{config.hero_subtitulo}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2 text-center shrink-0">
              <div className="text-2xl font-bold">38°</div>
              <div className="text-xs text-white/60">Soleado</div>
            </div>
          </div>
        )}

        <div className="rounded-2xl p-5 border shadow-sm space-y-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Textos del hero</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Texto principal</label>
              <input type="text" value={config.hero_titulo} onChange={e => set('hero_titulo', e.target.value)} className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Ciudad (en amarillo)</label>
              <input type="text" value={config.hero_ciudad} onChange={e => set('hero_ciudad', e.target.value)} className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Subtitulo</label>
              <input type="text" value={config.hero_subtitulo} onChange={e => set('hero_subtitulo', e.target.value)} className={inp} style={inpStyle} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 border shadow-sm space-y-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Fondo del hero</h2>

          <div className="flex gap-2">
            {[{ v: 'gradient', label: 'Degradado' }, { v: 'imagen', label: 'Imagen' }].map(({ v, label }) => (
              <button key={v} onClick={() => set('hero_bg_type', v)}
                className={'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ' + (config.hero_bg_type === v ? 'gradient-sunset text-white border-transparent' : 'bg-white')}
                style={config.hero_bg_type !== v ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
                {label}
              </button>
            ))}
          </div>

          {config.hero_bg_type === 'gradient' && (
            <div className="space-y-3">
              <label className="text-xs mb-2 block font-medium" style={{ color: 'var(--text-secondary)' }}>Elige un degradado</label>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENTS.map(g => (
                  <button key={g.value} onClick={() => set('hero_gradient', g.value)}
                    className={'rounded-xl overflow-hidden border-2 transition-all ' + (config.hero_gradient === g.value ? 'border-orange-500 scale-95' : 'border-transparent')}
                    style={{ borderColor: config.hero_gradient === g.value ? '#E05C3A' : 'transparent' }}>
                    {g.value !== 'custom' ? (
                      <div style={{ background: g.value, height: 48 }} />
                    ) : (
                      <div className="h-12 flex items-center justify-center text-xs font-medium" style={{ background: 'var(--sand)', color: 'var(--text-secondary)' }}>
                        🎨 Personalizado
                      </div>
                    )}
                    <div className="text-xs py-1.5 px-2 text-center font-medium" style={{ color: 'var(--text-secondary)', background: 'var(--surface)' }}>{g.label}</div>
                  </button>
                ))}
              </div>

              {config.hero_gradient === 'custom' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Color inicio</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.hero_color1} onChange={e => set('hero_color1', e.target.value)}
                        className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)' }} />
                      <input type="text" value={config.hero_color1} onChange={e => set('hero_color1', e.target.value)} className={inp} style={inpStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-secondary)' }}>Color fin</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.hero_color2} onChange={e => set('hero_color2', e.target.value)}
                        className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: 'var(--border)' }} />
                      <input type="text" value={config.hero_color2} onChange={e => set('hero_color2', e.target.value)} className={inp} style={inpStyle} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {config.hero_bg_type === 'imagen' && (
            <div className="space-y-3">
              <ImageUpload value={config.hero_imagen} onChange={v => set('hero_imagen', v)} label="Imagen de fondo del hero (recomendado 1200x400px)" />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                💡 Usa una imagen oscura o agrega un overlay para que el texto blanco sea legible
              </p>
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-sunset text-white font-medium text-sm disabled:opacity-50 shadow-md w-full justify-center">
          <Save className="w-4 h-4" />
          {isSaving ? 'Guardando...' : 'Guardar todos los cambios'}
        </button>
      </div>
    </MainLayout>
  );
}
