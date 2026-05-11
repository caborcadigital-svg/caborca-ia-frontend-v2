'use client';
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface Step {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: Step[] = [
  { target:'[data-tour="inicio"]', title:'¡Bienvenido a Caborca IA! 👋', description:'Tu asistente inteligente de Heroica Caborca, Sonora. Aquí encontrarás todo lo que necesitas saber sobre tu ciudad.', position:'bottom' },
  { target:'[data-tour="chat"]', title:'Chat con la IA 🤖', description:'Pregúntale lo que quieras sobre Caborca: clima, negocios, eventos, noticias y más. La IA busca información en tiempo real.', position:'bottom' },
  { target:'[data-tour="clima"]', title:'Clima en tiempo real 🌡️', description:'Consulta el clima actual y pronóstico de Caborca actualizado al momento.', position:'bottom' },
  { target:'[data-tour="reportes"]', title:'Reportes Ciudadanos 🚨', description:'Reporta accidentes, apagones, tráfico o cualquier situación en la ciudad. Los demás caborqueños lo verán al instante.', position:'bottom' },
  { target:'[data-tour="negocios"]', title:'Negocios Locales 🏪', description:'Encuentra restaurantes, farmacias, tiendas y servicios de Caborca. Contacta directo por WhatsApp.', position:'bottom' },
  { target:'[data-tour="deportes"]', title:'Deportes 🏆', description:'Sigue las ligas y torneos locales. También puedes enviar resultados de partidos que hayas visto.', position:'bottom' },
];

const TOUR_KEY = 'caborca_tour_done';

export default function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const done = localStorage.getItem(TOUR_KEY);
    if (!done) setTimeout(() => setActive(true), 1200);
  }, []);

  const updateRect = useCallback((stepIndex: number) => {
    const target = STEPS[stepIndex]?.target;
    if (!target) return;
    const el = document.querySelector(target);
    if (el) { setRect(el.getBoundingClientRect()); el.scrollIntoView({ behavior:'smooth', block:'center' }); }
    else setRect(null);
  }, []);

  useEffect(() => { if (active) setTimeout(() => updateRect(step), 300); }, [active, step, updateRect]);

  useEffect(() => {
    if (!active) return;
    const handleResize = () => updateRect(step);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [active, step, updateRect]);

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else finish(); };
  const prev = () => { if (step > 0) setStep(s => s - 1); };
  const finish = () => { setActive(false); localStorage.setItem(TOUR_KEY, 'true'); };
  const restart = () => { setStep(0); setActive(true); };

  if (!mounted) return null;

  const current = STEPS[step];
  const padding = 8;

  const getTooltipStyle = (): React.CSSProperties => {
    if (!rect) return { top:'50%', left:'50%', transform:'translate(-50%,-50%)' };
    const tooltipW = 300;
    const tooltipH = 160;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pos = current.position || 'bottom';
    let top = 0, left = 0;
    if (pos === 'bottom') { top = rect.bottom + padding + 8; left = rect.left + rect.width / 2 - tooltipW / 2; }
    else if (pos === 'top') { top = rect.top - tooltipH - padding - 8; left = rect.left + rect.width / 2 - tooltipW / 2; }
    else if (pos === 'right') { top = rect.top + rect.height / 2 - tooltipH / 2; left = rect.right + padding + 8; }
    else { top = rect.top + rect.height / 2 - tooltipH / 2; left = rect.left - tooltipW - padding - 8; }
    left = Math.max(12, Math.min(left, vw - tooltipW - 12));
    top = Math.max(12, Math.min(top, vh - tooltipH - 12));
    return { position:'fixed', top, left, width:tooltipW, zIndex:10001 };
  };

  return (
    <>
      {!active && (
        <button onClick={restart}
          className="fixed right-4 z-40 w-10 h-10 rounded-full gradient-sunset text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-all"
          style={{ top:'50%', transform:'translateY(-50%)' }}
          title="Tour de la app">
          <HelpCircle className="w-5 h-5" />
        </button>
      )}
      {active && (
        <>
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex:9999 }}>
            {rect && (
              <div style={{ position:'absolute', top:rect.top-padding, left:rect.left-padding, width:rect.width+padding*2, height:rect.height+padding*2, borderRadius:12, boxShadow:'0 0 0 9999px rgba(0,0,0,0.7)', background:'transparent', border:'2px solid #E05C3A', transition:'all 0.3s ease' }} />
            )}
          </div>
          <div style={{ ...getTooltipStyle(), position:'fixed', zIndex:10001, background:'white', border:'1px solid #E0E0E0', borderRadius:'16px', padding:'16px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }} className="animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold" style={{ color:'#E05C3A' }}>{step+1} / {STEPS.length}</span>
              <button onClick={finish} style={{ color:'#8A8AAA' }}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-1 mb-3">
              {STEPS.map((_,i) => <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i<=step ? '#E05C3A' : '#E0E0E0' }} />)}
            </div>
            <h3 className="font-bold text-sm mb-1" style={{ color:'#1A1A2E' }}>{current.title}</h3>
            <p className="text-xs leading-relaxed mb-4" style={{ color:'#4A4A6A' }}>{current.description}</p>
            <div className="flex items-center justify-between">
              <button onClick={prev} disabled={step===0} className="flex items-center gap-1 text-xs font-medium disabled:opacity-30 px-3 py-1.5 rounded-lg border" style={{ borderColor:'#E0E0E0', color:'#4A4A6A' }}>
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button onClick={finish} className="text-xs" style={{ color:'#8A8AAA' }}>Saltar</button>
              <button onClick={next} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white gradient-sunset">
                {step===STEPS.length-1 ? '¡Listo!' : 'Siguiente'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
