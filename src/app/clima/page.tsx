'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { climaAPI } from '../../lib/api';
import { Droplets, Wind, Eye, ArrowUp, ArrowDown } from 'lucide-react';

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

  if (isLoading) return (
    <MainLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--terracotta)', borderTopColor: 'transparent' }} />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-3 py-4 space-y-4">
        <h1 className="font-display text-xl font-bold" style={{ color: 'var(--desert-blue)' }}>Clima en Caborca</h1>

        {clima && (
          <div className="bg-white rounded-3xl p-6 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <img src={`https://openweathermap.org/img/wn/${clima.icono}@4x.png`} alt={clima.descripcion} className="w-20 h-20 mx-auto" />
            <div className="text-6xl font-display font-bold mt-1" style={{ color: 'var(--desert-blue)' }}>{clima.temperatura}°C</div>
            <div className="text-lg capitalize mt-1" style={{ color: 'var(--text-secondary)' }}>{clima.descripcion}</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Heroica Caborca, Sonora</div>

            <div className="flex items-center justify-center gap-4 mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3 text-red-400" />{clima.maxima}°</span>
              <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3 text-blue-400" />{clima.minima}°</span>
              <span>Sensación {clima.sensacion}°C</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              {[
                { icon: Droplets, label: 'Humedad', value: `${clima.humedad}%`, color: '#4A90C4' },
                { icon: Wind, label: 'Viento', value: `${clima.viento} km/h`, color: '#4A7C59' },
                { icon: Eye, label: 'Visibilidad', value: `${clima.visibilidad} km`, color: '#6B3FA0' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pronostico.length > 0 && (
          <div>
            <h2 className="font-display text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Pronóstico 5 días</h2>
            <div className="grid grid-cols-5 gap-2">
              {pronostico.map((dia: any) => (
                <div key={dia.fecha} className="bg-white rounded-2xl p-3 text-center border shadow-sm" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    {new Date(dia.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short' })}
                  </div>
                  <img src={`https://openweathermap.org/img/wn/${dia.icono}@2x.png`} alt={dia.descripcion} className="w-9 h-9 mx-auto" />
                  <div className="font-bold text-sm" style={{ color: 'var(--desert-blue)' }}>{dia.maxima}°</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{dia.minima}°</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
