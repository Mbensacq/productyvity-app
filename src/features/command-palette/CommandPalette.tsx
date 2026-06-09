import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { t } from '@/lib/i18n';

export interface PaletteNote {
  id: string;
  title: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  notes: PaletteNote[];
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onOpenDaily: () => void;
}

export function CommandPalette({
  open,
  onClose,
  notes,
  onSelectNote,
  onCreateNote,
  onOpenDaily,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    setQuery('');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q === '' ? notes : notes.filter((note) => note.title.toLowerCase().includes(q));
    return list.slice(0, 50);
  }, [notes, query]);

  if (!open) {
    return null;
  }

  const selectFirst = (): void => {
    const first = filtered[0];
    if (first) {
      onSelectNote(first.id);
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Enter') {
      selectFirst();
    }
  };

  const itemStyle = {
    width: '100%',
    textAlign: 'left' as const,
    background: 'transparent',
    color: 'var(--color-text)',
    border: 'none',
    borderRadius: '0.4rem',
    padding: '0.5rem 0.6rem',
    cursor: 'pointer',
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '10vh',
        zIndex: 50,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.title')}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          width: 'min(40rem, 92vw)',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.6rem',
          padding: '0.75rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('palette.placeholder')}
          aria-label={t('palette.placeholder')}
          style={{
            width: '100%',
            padding: '0.6rem 0.7rem',
            fontSize: '1rem',
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.4rem',
          }}
        />
        <ul
          style={{
            listStyle: 'none',
            margin: '0.5rem 0 0',
            padding: 0,
            maxHeight: '50vh',
            overflow: 'auto',
          }}
        >
          <li>
            <button
              type="button"
              style={itemStyle}
              onClick={() => {
                onCreateNote();
                onClose();
              }}
            >
              + {t('notes.new')}
            </button>
          </li>
          <li>
            <button
              type="button"
              style={itemStyle}
              onClick={() => {
                onOpenDaily();
                onClose();
              }}
            >
              {t('notes.daily')}
            </button>
          </li>
          {query.trim() !== '' && filtered.length === 0 && (
            <li style={{ padding: '0.5rem 0.6rem', color: 'var(--color-text-muted)' }}>
              {t('palette.noResults')}
            </li>
          )}
          {filtered.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  onSelectNote(note.id);
                  onClose();
                }}
              >
                {note.title.trim() === '' ? t('notes.untitled') : note.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
