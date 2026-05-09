'use client';

import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Image, AlignLeft, AlignCenter, Heading2, Quote, Minus } from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
}

export default function RichEditor({ value, onChange, placeholder = 'Escribe el contenido...', height = 300 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      exec('createLink', linkUrl);
      setLinkUrl('');
      setShowLink(false);
    }
  };

  const toolBtn = "w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700";
  const toolIcon = "w-4 h-4";

  return (
    <div className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-900" style={{ borderColor: 'var(--border)' }}>
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b" style={{ borderColor: 'var(--border)', background: 'var(--sand)' }}>
        <button type="button" onClick={() => exec('bold')} className={toolBtn} title="Negrita">
          <Bold className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button type="button" onClick={() => exec('italic')} className={toolBtn} title="Cursiva">
          <Italic className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <button type="button" onClick={() => exec('formatBlock', 'h2')} className={toolBtn} title="Encabezado">
          <Heading2 className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'blockquote')} className={toolBtn} title="Cita">
          <Quote className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <button type="button" onClick={() => exec('insertUnorderedList')} className={toolBtn} title="Lista">
          <List className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} className={toolBtn} title="Lista numerada">
          <ListOrdered className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <button type="button" onClick={() => exec('justifyLeft')} className={toolBtn} title="Izquierda">
          <AlignLeft className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button type="button" onClick={() => exec('justifyCenter')} className={toolBtn} title="Centro">
          <AlignCenter className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <button type="button" onClick={() => setShowLink(!showLink)} className={toolBtn} title="Insertar link">
          <Link className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button type="button" onClick={() => exec('insertHorizontalRule')} className={toolBtn} title="Separador">
          <Minus className={toolIcon} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {showLink && (
        <div className="flex gap-2 p-2 border-b" style={{ borderColor: 'var(--border)', background: 'var(--sand)' }}>
          <input type="url" placeholder="https://..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
            className="flex-1 rounded-lg px-3 py-1.5 text-sm outline-none border bg-white"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            onKeyDown={e => e.key === 'Enter' && insertLink()} />
          <button type="button" onClick={insertLink}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white gradient-sunset">
            Insertar
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        onBlur={handleChange}
        data-placeholder={placeholder}
        className="outline-none p-4 text-sm leading-relaxed overflow-y-auto rich-editor"
        style={{
          minHeight: height,
          maxHeight: height * 1.5,
          color: 'var(--text-primary)',
        }}
      />

      <style>{`
        .rich-editor:empty:before {
          content: attr(data-placeholder);
          color: var(--text-muted);
          pointer-events: none;
        }
        .rich-editor h2 { font-size: 1.2em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .rich-editor blockquote { border-left: 3px solid var(--terracotta); padding-left: 1em; margin: 0.8em 0; color: var(--text-secondary); font-style: italic; }
        .rich-editor ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .rich-editor a { color: var(--terracotta); text-decoration: underline; }
        .rich-editor hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
        .rich-editor strong { font-weight: 700; }
        .rich-editor em { font-style: italic; }
        .rich-editor p { margin: 0.3em 0; }
      `}</style>
    </div>
  );
}
