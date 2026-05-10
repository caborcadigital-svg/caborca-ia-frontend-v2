'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { climaAPI } from '../../lib/api';
import { Cloud, Droplets, Wind, Eye, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';

export default function ClimaPage() {
  const [clima, setClima] = useState<any>(null);
  const [pronostico, setPronostico] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      climaAPI.getCurrent().then(setClima),
      climaAPI.getPronostico().then(setPronostico),
    ]).finally(() => setIsLoading(false));
  }, []);

  const card = "rounded-2xl p-4 border shadow-sm";

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-3 py-4 space-y-4 pb-24 lg:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'#EFF6FC' }}>
            <Cloud className="w-5 h-5" style={{ color:'#4A90C4' }} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold" style={{ color:'var(--desert-blue)' }}>Clima en Caborca</h1>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>Heroica Caborca, Sonora</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className={card + " animate-pulse h-40"} style={{ background:'var(--surface)', borderColor:'var(--border)' }} />
            <div className={card + " animate-pulse h-24"} style={{ background:'var(--surface)', borderColor:'var(--border)' }} />
          </div>
        ) : clima ? (
          <>
            <div className="rounded-2xl p-6 text-white gradient-desert-hero">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-6xl font-display font-bold">{clima.temperatura}°</div>
                  <div className="text-white/70 capitalize mt-1">{clima.descripcion}</div>
                  <div className="flex items-center gap-3 mt-3 text-sm text-white/70">
                    <span className="flex items-center gap-1"><ArrowUp className="w-3.5 h-3.5" />{clima.maxima}°</span>
                    <span className="flex items-center gap-1"><ArrowDown className="w-3.5 h-3.5" />{clima.minima}°</span>
                  </div>
                  <div className="text-sm text-white/60 mt-1">Sensacion termica: {clima.sensacion}°C</div>
                </div>
                {clima.icono && <img src={'https://openweathermap.org/img/wn/' + clima.icono + '@2x.png'} alt="" className="w-20 h-20" />}
              </div>
            </div>

            <div className={card} style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon:Droplets, label:'Humedad', value:clima.humedad + '%', color:'#4A90C4' },
                  { icon:Wind, label:'Viento', value:clima.viento + ' km/h', color:'#4A7C59' },
                  { icon:Eye, label:'Visibilidad', value:clima.visibilidad + ' km', color:'#6B3FA0' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: item.color + '15' }}>
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>{item.value}</div>
                    <div className="text-xs" style={{ color:'var(--text-muted)' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {pronostico.length > 0 && (
              <div className={card} style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
                <h2 className="font-bold text-sm mb-3" style={{ color:'var(--text-primary)' }}>Pronostico</h2>
                <div className="space-y-2">
                  {pronostico.slice(0, 5).map((d: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor:'var(--border)' }}>
                      <span className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>{d.dia}</span>
                      <div className="flex items-center gap-2">
                        {d.icono && <img src={'https://openweathermap.org/img/wn/' + d.icono + '.png'} alt="" className="w-8 h-8" />}
                        <span className="text-xs capitalize" style={{ color:'var(--text-muted)' }}>{d.descripcion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold" style={{ color:'var(--text-primary)' }}>{d.maxima}°</span>
                        <span style={{ color:'var(--text-muted)' }}>{d.minima}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={card + " text-center py-10"} style={{ background:'var(--surface)', borderColor:'var(--border)' }}>
            <Cloud className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--text-muted)' }} />
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>No se pudo obtener el clima</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
