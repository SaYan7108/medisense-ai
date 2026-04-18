import { useState } from 'react';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react';

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (key.startsWith('gsk_')) {
      localStorage.setItem('medisense_api_key', key);
      setSaved(true);
      setTimeout(() => onSave(key), 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 grid-bg">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 animate-fade-up space-y-5">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-dim)] border border-[var(--border-active)] flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Key size={28} className="text-[var(--accent)]" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-[var(--text-primary)]">MediSense AI</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Powered by Groq — 100% free, no credit card</p>
          </div>

          <div className="relative">
            <input
              className="input-field pr-12"
              type={show ? 'text' : 'password'}
              placeholder="gsk_..."
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)]"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={handleSave}
            disabled={!key.startsWith('gsk_') || saved}
          >
            {saved
              ? <><CheckCircle size={16} /> Saved! Loading...</>
              : 'Launch MediSense AI'}
          </button>

          <p className="text-center text-xs text-[var(--text-muted)]">
            Get your free key at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline inline-flex items-center gap-1">
              console.groq.com <ExternalLink size={10} />
            </a>
          </p>

          <div className="p-3 rounded-lg bg-[var(--accent-dim)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
            🔒 Key stored only in your browser. Never sent to any third-party server.
          </div>
        </div>
      </div>
    </div>
  );
}
