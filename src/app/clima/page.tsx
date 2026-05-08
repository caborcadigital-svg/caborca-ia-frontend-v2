'use client';

import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { climaAPI } from '../../lib/api';
import { Cloud, Wind, Droplets, Eye, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <h1 className="font-display text-2xl font-bold text-white">Clima en Caborca</h1>

        {clima && (
          <div className="glass rounded-3xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${clima.icono}@4x.png`}
                alt={clima.descripcion}
                className="w-24 h-24"
              />
            </div>
            <div className="text-7xl font-display font-bold text-white mb-2">{clima.temperatura}°C</div>
            <div className="text-xl text-slate-300 capitalize mb-1">{clima.descripcion}</div>
            <div className="text-slate-400">Heroica Caborca, Sonora</div>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3 text-red-400" />{clima.maxima}°</span>
              <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3 text-blue-400" />{clima.minima}°</span>
              <span>Sensación {clima.sensacion}°C</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-surface-700/50">
              <div className="text-center">
                <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-white font-semibold">{clima.humedad}%</div>
                <div className="text-xs text-slate-400">Humedad</div>
              </div>
              <div className="text-center">
                <Wind className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                <div className="text-white font-semibold">{clima.viento} km/h</div>
                <div className="text-xs text-slate-400">Viento</div>
              </div>
              <div className="text-center">
                <Eye className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-white font-semibold">{clima.visibilidad} km</div>
                <div className="text-xs text-slate-400">Visibilidad</div>
              </div>
            </div>
          </div>
        )}

        {pronostico.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-bold text-white mb-4">Pronóstico 5 días</h2>
            <div className="grid grid-cols-5 gap-3">
              {pronostico.map((dia: any) => (
                <div key={dia.fecha} className="glass rounded-2xl p-4 text-center">
                  <div className="text-xs text-slate-400 mb-2">
                    {new Date(dia.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'short' })}
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${dia.icono}@2x.png`}
                    alt={dia.descripcion}
                    className="w-10 h-10 mx-auto"
                  />
                  <div className="text-white font-bold text-sm mt-1">{dia.maxima}°</div>
                  <div className="text-slate-500 text-xs">{dia.minima}°</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
