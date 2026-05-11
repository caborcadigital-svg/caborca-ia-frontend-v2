'use client';
import { useEffect, useState } from 'react';
import MainLayout from '../MainLayout';
import { climaAPI } from '../../lib/api';
import { useDarkMode } from '../../hooks/useDarkMode';

const CLIMA_ICONOS: Record<string,string> = {
  'cielo claro':'☀️','nubes':'⛅','lluvia':'🌧️','tormenta':'⛈️','niebla':'🌫️','soleado':'☀️','nublado':'☁️',
};
function getIcono(desc:string) {
  const d=(desc||'').toLowerCase();
  for(const[k,v]of Object.entries(CLIMA_ICONOS)){if(d.includes(k))return v;}
  return'☀️';
}

export default function ClimaPage() {
  const [clima, setClima] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dark } = useDarkMode();

  useEffect(() => { climaAPI.getCurrent().then(setClima).finally(()=>setIsLoading(false)); }, []);

  const card = dark?'rgba(255,255,255,0.03)':'var(--card)';
  const border = dark?'rgba(255,255,255,0.08)':'var(--border)';
  const textP = dark?'rgba(255,255,255,0.85)':'var(--text-primary)';
  const textM = dark?'rgba(255,255,255,0.3)':'var(--text-muted)';

  const StatCard = ({label,value,emoji}:{label:string,value:string,emoji:string}) => (
    <div style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', padding:'14px', textAlign:'center' }}>
      <div style={{ fontSize:'24px', marginBottom:'6px' }}>{emoji}</div>
      <div style={{ fontSize:'18px', fontWeight:700, color:textP, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'10px', color:textM, marginTop:'4px', letterSpacing:'0.3px', textTransform:'uppercase' }}>{label}</div>
    </div>
  );

  return (
    <MainLayout>
      <div style={{ maxWidth:'480px', margin:'0 auto', padding:'12px', paddingBottom:'88px' }}>
        <div style={{ marginBottom:'16px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', marginBottom:'4px' }}>Clima</h1>
          <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Heroica Caborca, Sonora</p>
        </div>

        {isLoading ? (
          <div style={{ background:card, border:'0.5px solid '+border, borderRadius:'20px', height:'200px', opacity:0.4 }} />
        ) : clima ? (
          <>
            <div style={{ background:'linear-gradient(160deg,#1a3356,#5a3490)', borderRadius:'20px', padding:'24px', marginBottom:'12px', textAlign:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'100px', height:'100px', background:'rgba(107,63,160,0.2)', borderRadius:'50%', filter:'blur(20px)' }} />
              <div style={{ fontSize:'64px', lineHeight:1, marginBottom:'8px', filter:'drop-shadow(0 0 16px rgba(255,200,0,0.3))' }}>{getIcono(clima.descripcion)}</div>
              <div style={{ fontSize:'56px', fontWeight:800, color:'white', lineHeight:1, letterSpacing:'-2px' }}>{clima.temperatura}°C</div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px', marginTop:'6px', textTransform:'capitalize' }}>{clima.descripcion}</div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', marginTop:'4px' }}>Sensación térmica {clima.sensacion}°C</div>
              <div style={{ display:'flex', justifyContent:'center', gap:'16px', marginTop:'12px' }}>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>↑ Máx {clima.maxima}°</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>↓ Mín {clima.minima}°</div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' }}>
              <StatCard label="Humedad" value={clima.humedad+'%'} emoji="💧" />
              <StatCard label="Viento" value={clima.viento+' km/h'} emoji="💨" />
              <StatCard label="Visibilidad" value={(clima.visibilidad||10)+' km'} emoji="👁️" />
              <StatCard label="Nubes" value={(clima.nubes||0)+'%'} emoji="☁️" />
            </div>

            <div style={{ background:card, border:'0.5px solid '+border, borderRadius:'14px', padding:'14px' }}>
              <div style={{ fontSize:'11px', fontWeight:600, color:textM, letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:'10px' }}>Info Caborca</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                  <span style={{ color:textM }}>Verano típico</span>
                  <span style={{ color:textP, fontWeight:500 }}>hasta 48°C</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                  <span style={{ color:textM }}>Invierno típico</span>
                  <span style={{ color:textP, fontWeight:500 }}>0°C a 20°C</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                  <span style={{ color:textM }}>Lluvias</span>
                  <span style={{ color:textP, fontWeight:500 }}>Julio - Agosto</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                  <span style={{ color:textM }}>Altitud</span>
                  <span style={{ color:textP, fontWeight:500 }}>280 m.s.n.m.</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)', fontSize:'13px' }}>No se pudo obtener el clima</div>
        )}
      </div>
    </MainLayout>
  );
}
