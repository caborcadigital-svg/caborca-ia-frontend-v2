'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../../MainLayout';
import api from '../../../lib/api';
import ImageUpload from '../../../components/ImageUpload';
import { Settings, Save, Eye, Palette, Type, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMAS = [
  {
    nombre: 'Desierto Sonora',
    preview: ['#1E3A5F','#E05C3A','#F5A623'],
    config: {
      color_primary: '#E05C3A',
      color_secondary: '#E8823A',
      color_accent: '#F5A623',
      color_surface: '#FFFFFF',
      color_sand: '#F0F2F5',
      color_text: '#1A1A2E',
      color_muted: '#8A8AAA',
      color_border: '#E0E0E0',
      color_sidebar_from: '#1E3A5F',
      color_sidebar_to: '#162D4A',
      hero_gradient: 'linear-gradient(135deg, #1E3A5F 0%, #6B3FA0 60%, #E05C3A 100%)',
    }
  },
  {
    nombre: 'Noche Caborca',
    preview: ['#0F1117','#6B3FA0','#E05C3A'],
    config: {
      color_primary: '#6B3FA0',
      color_secondary: '#8B5CC8',
      color_accent: '#E05C3A',
      color_surface: '#1A1D27',
      color_sand: '#0F1117',
      color_text: '#F0F2F5',
      color_muted: '#6A7090',
      color_border: '#2A2D3E',
      color_sidebar_from: '#0F1117',
      color_sidebar_to: '#1A1D27',
      hero_gradient: 'linear-gradient(135deg, #0F1117 0%, #6B3FA0 60%, #E05C3A 100%)',
    }
  },
  {
    nombre: 'Atardecer',
    preview: ['#C4622D','#E8823A','#F5A623'],
    config: {
      color_primary: '#C4622D',
      color_secondary: '#E8823A',
      color_accent: '#F5A623',
      color_surface: '#FFFAF5',
      color_sand: '#FEF3E8',
      color_text: '#2D1810',
      color_muted: '#9A7060',
      color_border: '#EDD5C0',
      color_sidebar_from: '#8B3A1A',
      color_sidebar_to: '#C4622D',
      hero_gradient: 'linear-gradient(135deg, #C4622D 0%, #E8823A 60%, #F5A623 100%)',
    }
  },
  {
    nombre: 'Cactus Verde',
    preview: ['#1E3A5F','#4A7C59','#F5A623'],
    config: {
      color_primary: '#4A7C59',
      color_secondary: '#5E9E72',
      color_accent: '#F5A623',
      color_surface: '#F5FAF6',
      color_sand: '#EAF4EC',
      color_text: '#1A2D1E',
      color_muted: '#6A8A70',
      color_border: '#C8E0CC',
      color_sidebar_from: '#1E3A2A',
      color_sidebar_to: '#2D5A3A',
      hero_gradient: 'linear-gradient(135deg, #1E3A2A 0%, #4A7C59 60%, #F5A623 100%)',
    }
  },
  {
    nombre: 'Cielo Sonora',
    preview: ['#2D5F8A','#4A90C4','#F5A623'],
    config: {
      color_primary: '#2D5F8A',
      color_secondary: '#4A90C4',
      color_accent: '#F5A623',
      color_surface: '#F5F8FC',
      color_sand: '#EAF2F8',
      color_text: '#1A2D3E',
      color_muted: '#6A8AAA',
      color_border: '#C8DFF0',
      color_sidebar_from: '#1E3A5F',
      color_sidebar_to: '#2D5F8A',
      hero_gradient: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F8A 60%, #4A90C4 100%)',
    }
  },
  {
    nombre: 'Tierra Roja',
    preview: ['#8B1A1A','#C4622D','#F5A623'],
    config: {
      color_primary: '#8B1A1A',
      color_secondary: '#C4622D',
      color_accent: '#F5A623',
      color_surface: '#FFF8F5',
      color_sand: '#FEEDE8',
      color_text: '#2D1010',
      color_muted: '#9A6060',
      color_border: '#EDD0C0',
      color_sidebar_from: '#5A0A0A',
      color_sidebar_to: '#8B1A1A',
      hero_gradient: 'linear-gradient(135deg, #5A0A0A 0%, #8B1A1A 50%, #C4622D 100%)',
    }
  },
];

const HERO_GRADIENTS = [
  { label:'Desierto clásico', value:'linear-gradient(135deg, #1E3A5F 0%, #6B3FA0 60%, #E05C3A 100%)' },
  { label:'Atardecer', value:'linear-gradient(135deg, #E05C3A, #E8823A, #F5A623)' },
  { label:'Noche', value:'linear-gradient(135deg, #0F1117, #1E3A5F, #6B3FA0)' },
  { label:'Cactus', value:'linear-gradient(135deg, #1E3A5F, #4A7C59)' },
  { label:'Cielo', value:'linear-gradient(135deg, #1E3A5F, #2D5F8A, #4A90C4)' },
  { label:'Tierra', value:'linear-gradient(135deg, #5A0A0A, #8B1A1A, #C4622D)' },
  { label:'Personalizado', value:'custom' },
];

const DEFAULT_CONFIG = {
  hero_titulo: '¿Qué pasa hoy en',
  hero_ciudad: 'Caborca',
  hero_subtitulo: 'Heroica Caborca, Sonora',
  hero_bg_type: 'gradient',
  hero_gradient: 'linear-gradient(135deg, #1E3A5F 0%, #6B3FA0 60%, #E05C3A 100%)',
  hero_imagen: '',
  hero_color1: '#1E3A5F',
  hero_color2: '#E05C3A',
  color_primary: '#E05C3A',
  color_secondary: '#E8823A',
  color_accent: '#F5A623',
  color_surface: '#FFFFFF',
  color_sand: '#F0F2F5',
  color_text: '#1A1A2E',
  color_muted: '#8A8AAA',
  color_border: '#E0E0E0',
  color_sidebar_from: '#1E3A5F',
  color_sidebar_to: '#162D4A',
};

const TABS = ['Temas','Hero','Colores'];

const COLOR_FIELDS = [
  { key:'color_primary', label:'Color principal (botones, links, acentos)' },
  { key:'color_secondary', label:'Color secundario' },
  { key:'color_accent', label:'Color de acento (badges, highlights)' },
  { key:'color_surface', label:'Fondo de tarjetas' },
  { key:'color_sand', label:'Fondo general de la app' },
  { key:'color_text', label:'Texto principal' },
  { key:'color_muted', label:'Texto secundario / muted' },
  { key:'color_border', label:'Bordes y separadores' },
  { key:'color_sidebar_from', label:'Sidebar — color inicio' },
  { key:'color_sidebar_to', label:'Sidebar — color fin' },
];

export default function AdminConfigPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState(0);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    api.get('/config').then(r => { if (r.data && Object.keys(r.data).length) setConfig(c => ({ ...c, ...r.data })); }).catch(() => {});
  }, []);

  const set = (k: string, v: string) => setConfig(c => ({ ...c, [k]: v }));

  const aplicarTema = (tema: typeof TEMAS[0]) => {
    setConfig(c => ({ ...c, ...tema.config, hero_gradient: tema.config.hero_gradient }));
    toast.success('Tema "' + tema.nombre + '" aplicado — guarda para confirmar');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/config', config);
      toast.success('Configuracion guardada. Recarga la pagina para ver los cambios.');
    } catch { toast.error('Error guardando'); }
    finally { setIsSaving(false); }
  };

  const getHeroBg = () => {
    if (config.hero_bg_type === 'imagen' && config.hero_imagen) return { backgroundImage: 'url(' + config.hero_imagen + ')', backgroundSize:'cover', backgroundPosition:'center' };
    if (config.hero_gradient === 'custom') return { background: 'linear-gradient(135deg, ' + config.hero_color1 + ', ' + config.hero_color2 + ')' };
    return { background: config.hero_gradient };
  };

  const inp = "w-full rounded-xl px-4 py-3 text-sm outline-none border";
  const inpStyle = { borderColor:'var(--border)', color:'var(--text-primary)', background:'var(--surface)' };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#EEF4F9' }}>
              <Palette className="w-5 h-5" style={{ color:'#2D5F8A' }} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Apariencia</h1>
              <p className="text-xs" style={{ color:'var(--text-muted)' }}>Temas, colores y textos</p>
            </div>
          </div>
          <button onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ borderColor:'var(--border)', color:'var(--text-secondary)', background:'var(--surface)' }}>
            <Eye className="w-4 h-4" /> {preview ? 'Ocultar' : 'Preview'}
          </button>
        </div>

        {preview && (
          <div className="space-y-3">
            <div className="rounded-2xl p-4 text-white" style={getHeroBg()}>
              <h2 className="font-display text-lg font-bold">{config.hero_titulo} <span style={{ color:'#FCD34D' }}>{config.hero_ciudad}</span>?</h2>
              <p className="text-white/60 text-xs mt-0.5">{config.hero_subtitulo}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl p-3 border" style={{ background:config.color_surface, borderColor:config.color_border }}>
                <div className="w-6 h-6 rounded-lg mb-2" style={{ background:config.color_primary }} />
                <div className="text-xs font-semibold" style={{ color:config.color_text }}>Tarjeta</div>
                <div className="text-xs" style={{ color:config.color_muted }}>Subtexto</div>
              </div>
              <div className="rounded-xl p-3 flex items-center justify-center" style={{ background:config.color_primary }}>
                <span className="text-white text-xs font-bold">Botón</span>
              </div>
              <div className="rounded-xl p-3 border" style={{ background:config.color_sand, borderColor:config.color_border }}>
                <div className="text-xs font-semibold" style={{ color:config.color_text }}>Fondo</div>
                <div className="w-full h-1.5 rounded-full mt-2" style={{ background:config.color_border }} />
              </div>
            </div>
          </div>
        )}

        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor:'var(--border)' }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="flex-1 py-2.5 text-sm font-medium transition-all"
              style={{ background: tab === i ? config.color_primary : 'var(--surface)', color: tab === i ? 'white' : 'var(--text-secondary)' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Elige un tema completo — afecta colores, sidebar y hero</p>
            <div className="grid grid-cols-2 gap-3">
              {TEMAS.map(tema => (
                <button key={tema.nombre} onClick={() => aplicarTema(tema)}
                  className="rounded-2xl overflow-hidden border-2 text-left transition-all hover:scale-95 active:scale-90"
                  style={{ borderColor:'var(--border)' }}>
                  <div className="h-16 flex items-stretch">
                    {tema.preview.map((c, i) => <div key={i} className="flex-1" style={{ background:c }} />)}
                  </div>
                  <div className="px-3 py-2" style={{ background:'var(--surface)' }}>
                    <div className="text-xs font-bold" style={{ color:'var(--text-primary)' }}>{tema.nombre}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 border shadow-sm space-y-4" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
              <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:'var(--text-primary)' }}><Type className="w-4 h-4" />Textos</h3>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Texto principal</label>
                <input type="text" value={config.hero_titulo} onChange={e => set('hero_titulo', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Ciudad (aparece resaltada)</label>
                <input type="text" value={config.hero_ciudad} onChange={e => set('hero_ciudad', e.target.value)} className={inp} style={inpStyle} />
              </div>
              <div>
                <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>Subtitulo</label>
                <input type="text" value={config.hero_subtitulo} onChange={e => set('hero_subtitulo', e.target.value)} className={inp} style={inpStyle} />
              </div>
            </div>

            <div className="rounded-2xl p-4 border shadow-sm space-y-4" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
              <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:'var(--text-primary)' }}><Image className="w-4 h-4" />Fondo</h3>
              <div className="flex gap-2">
                {[{v:'gradient',label:'Degradado'},{v:'imagen',label:'Imagen'}].map(({ v, label }) => (
                  <button key={v} onClick={() => set('hero_bg_type', v)}
                    className={'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ' + (config.hero_bg_type === v ? 'text-white border-transparent' : '')}
                    style={{ background: config.hero_bg_type === v ? config.color_primary : 'transparent', borderColor: config.hero_bg_type !== v ? 'var(--border)' : 'transparent', color: config.hero_bg_type !== v ? 'var(--text-secondary)' : 'white' }}>
                    {label}
                  </button>
                ))}
              </div>

              {config.hero_bg_type === 'gradient' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {HERO_GRADIENTS.map(g => (
                      <button key={g.value} onClick={() => set('hero_gradient', g.value)}
                        className={'rounded-xl overflow-hidden border-2 transition-all'}
                        style={{ borderColor: config.hero_gradient === g.value ? config.color_primary : 'transparent' }}>
                        {g.value !== 'custom' ? <div style={{ background:g.value, height:40 }} /> : <div className="h-10 flex items-center justify-center text-xs font-medium" style={{ background:'var(--sand)', color:'var(--text-secondary)' }}>🎨 Personalizado</div>}
                        <div className="text-xs py-1 px-2 text-center" style={{ color:'var(--text-muted)', background:'var(--surface)' }}>{g.label}</div>
                      </button>
                    ))}
                  </div>
                  {config.hero_gradient === 'custom' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[{k:'hero_color1',label:'Color inicio'},{k:'hero_color2',label:'Color fin'}].map(({ k, label }) => (
                        <div key={k}>
                          <label className="text-xs mb-1 block font-medium" style={{ color:'var(--text-secondary)' }}>{label}</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(config as any)[k]} onChange={e => set(k, e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer shrink-0" style={{ borderColor:'var(--border)' }} />
                            <input type="text" value={(config as any)[k]} onChange={e => set(k, e.target.value)} className={inp} style={inpStyle} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {config.hero_bg_type === 'imagen' && (
                <div className="space-y-2">
                  <ImageUpload value={config.hero_imagen} onChange={v => set('hero_imagen', v)} label="Imagen de fondo (recomendado 1200x400)" />
                  <p className="text-xs" style={{ color:'var(--text-muted)' }}>Usa una imagen oscura para que el texto blanco sea legible</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div className="rounded-2xl p-4 border shadow-sm space-y-4" style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
            <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color:'var(--text-primary)' }}><Palette className="w-4 h-4" />Colores personalizados</h3>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Ajusta cada color individualmente. Tip: usa los temas como base y modifica lo que no te guste.</p>
            <div className="space-y-3">
              {COLOR_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <input type="color" value={(config as any)[key] || '#000000'} onChange={e => set(key, e.target.value)}
                    className="w-10 h-10 rounded-lg border cursor-pointer shrink-0" style={{ borderColor:'var(--border)' }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium mb-1" style={{ color:'var(--text-secondary)' }}>{label}</div>
                    <input type="text" value={(config as any)[key] || ''} onChange={e => set(key, e.target.value)}
                      className={inp} style={{ ...inpStyle, padding:'6px 12px' }} />
                  </div>
                  <div className="w-8 h-8 rounded-lg border shrink-0" style={{ background:(config as any)[key], borderColor:'var(--border)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm disabled:opacity-50 shadow-md w-full justify-center"
          style={{ background: config.color_primary }}>
          <Save className="w-4 h-4" />
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </MainLayout>
  );
}
