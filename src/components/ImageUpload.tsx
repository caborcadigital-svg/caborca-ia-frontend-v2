'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { subirImagen } from '../../lib/upload';
import toast from 'react-hot-toast';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Imagen' }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }

    setUploading(true);
    try {
      const url = await subirImagen(file);
      onChange(url);
      toast.success('Imagen subida correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error subiendo imagen');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="text-xs mb-1.5 block font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative inline-block">
            <img src={value} alt="Preview" className="w-full h-32 object-cover rounded-xl border" style={{ borderColor: 'var(--border)' }} />
            <button type="button" onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 bg-white hover:shadow-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Subiendo...' : 'Subir imagen'}
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="O pega URL de imagen..."
            value={value}
            onChange={e => onChange(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none border bg-white"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
}
