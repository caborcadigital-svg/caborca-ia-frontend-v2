'use client';
import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(API + '/config').then(r => r.json()).then(config => {
      if (!config || !Object.keys(config).length) return;
      const root = document.documentElement;
      const map: Record<string,string> = {
        color_primary: '--terracotta',
        color_secondary: '--sunset-orange',
        color_accent: '--desert-gold',
        color_surface: '--surface',
        color_sand: '--sand',
        color_text: '--text-primary',
        color_muted: '--text-muted',
        color_border: '--border',
      };
      Object.entries(map).forEach(function(entry) {
        const k = entry[0]; const v = entry[1];
        if (config[k]) root.style.setProperty(v, config[k]);
      });
      if (config.color_sidebar_from && config.color_sidebar_to) {
        const style = document.getElementById('caborca-sidebar-style') || document.createElement('style');
        style.id = 'caborca-sidebar-style';
        style.textContent = '.sidebar-desert { background: linear-gradient(180deg, ' + config.color_sidebar_from + ' 0%, ' + config.color_sidebar_to + ' 100%) !important; }';
        if (!document.getElementById('caborca-sidebar-style')) document.head.appendChild(style);
      }
      if (config.color_text) {
        root.style.setProperty('--text-secondary', config.color_text + 'CC');
      }
    }).catch(function() {});
  }, []);

  return null;
}
