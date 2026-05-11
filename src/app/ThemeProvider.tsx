'use client';
import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(API + '/config').then(r => r.json()).then(config => {
      if (!config || !Object.keys(config).length) return;

      const isDark = localStorage.getItem('caborca_dark_mode') === 'true';
      const root = document.documentElement;

      const sidebarMap: Record<string,string> = {
        color_sidebar_from: '--sidebar-from',
        color_sidebar_to: '--sidebar-to',
      };

      const colorMap: Record<string,string> = {
        color_primary: '--terracotta',
        color_secondary: '--sunset-orange',
        color_accent: '--desert-gold',
      };

      const bgColorMap: Record<string,string> = {
        color_surface: '--surface',
        color_sand: '--sand',
        color_text: '--text-primary',
        color_muted: '--text-muted',
        color_border: '--border',
      };

      Object.entries(colorMap).forEach(([k, v]) => {
        if (config[k]) root.style.setProperty(v, config[k]);
      });

      if (!isDark) {
        Object.entries(bgColorMap).forEach(([k, v]) => {
          if (config[k]) root.style.setProperty(v, config[k]);
        });
      }

      if (config.color_sidebar_from && config.color_sidebar_to) {
        const styleId = 'caborca-sidebar-style';
        let style = document.getElementById(styleId) as HTMLStyleElement;
        if (!style) { style = document.createElement('style'); style.id = styleId; document.head.appendChild(style); }
        style.textContent = '.sidebar-desert { background: linear-gradient(180deg, ' + config.color_sidebar_from + ' 0%, ' + config.color_sidebar_to + ' 100%) !important; }';
      }
    }).catch(() => {});
  }, []);

  return null;
}
