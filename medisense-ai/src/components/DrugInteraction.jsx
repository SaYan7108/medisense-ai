import { useState } from 'react';
import { Pill, Plus, X, Loader2, ChevronRight, AlertTriangle, Shield } from 'lucide-react';
import { callClaude, parseMarkdown } from '../utils/api';

const SYSTEM_PROMPT = `You are MediSense AI's Drug Interaction Analysis Engine.

When given a list of medications, analyze potential interactions and provide:

1. **Interaction Summary** — Overall safety assessment (Safe / Caution / Dangerous)
2. **Drug-Drug Interactions** — List each significant interaction found with severity (Minor / Moderate / Major)
3. **Mechanism of Interaction** — Briefly explain HOW each interaction works
4. **Clinical Effects** — What symptoms/effects might occur
5. **Recommendations** — What to do (monitor, avoid, adjust timing, etc.)
6. **Food & Lifestyle Interactions** — Note any relevant food/alcohol interactions
7. **Safe Alternatives** — Where major interactions exist, suggest asking about alternatives

Rate overall risk as: ✅ LOW RISK | ⚠️ MODERATE RISK | 🚨 HIGH RISK

Use ## headers. Be precise and clinically accurate.
Always advise consulting a pharmacist or physician before making changes.`;

const COMMON_DRUGS = [
  'Aspirin', 'Metformin', 'Atorvastatin', 'Lisinopril', 'Amlodipine',
  'Omeprazole', 'Metoprolol', 'Warfarin', 'Ibuprofen', 'Paracetamol',
  'Amoxicillin', 'Levothyroxine', 'Clopidogrel', 'Gabapentin',
];

export default function DrugInteraction() {
  const [drugs, setDrugs] = useState([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addDrug = (name) => {
    const clean = name.trim();
    if (!clean) return;
    if (drugs.includes(clean)) return;
    if (drugs.length >= 8) {
      setError('Maximum 8 medications at once.');
      return;
    }
    setDrugs(prev => [...prev, clean]);
    setInput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addDrug(input);
  };

  const check = async () => {
    if (drugs.length < 2) {
      setError('Please add at least 2 medications to check interactions.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await callClaude(
        [{ role: 'user', content: `Check interactions for these medications:\n${drugs.map((d, i) => `${i + 1}. ${d}`).join('\n')}` }],
        SYSTEM_PROMPT,
        1200
      );
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const riskLevel = result
    ? result.includes('HIGH RISK') || result.includes('🚨')
      ? 'high'
      : result.includes('MODERATE RISK') || result.includes('⚠️')
      ? 'medium'
      : 'low'
    : null;

  const riskConfig = {
    high: { label: 'HIGH RISK', cls: 'severity-high', icon: '🚨' },
    medium: { label: 'MODERATE RISK', cls: 'severity-medium', icon: '⚠️' },
    low: { label: 'LOW RISK', cls: 'severity-low', icon: '✅' },
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon">
            <Shield size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Drug Interaction Checker</h2>
            <p className="text-sm text-[var(--text-secondary)]">Identify dangerous medication combinations</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass-card p-6 space-y-5">
        <div>
          <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
            Add Medications
          </label>
          <div className="flex gap-2">
            <input
              className="input-field"
              placeholder="Type medication name and press Enter..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn-primary flex items-center gap-1 px-4"
              onClick={() => addDrug(input)}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Quick Add */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2 font-display uppercase tracking-widest">Common Medications:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DRUGS.map(d => (
              <button
                key={d}
                onClick={() => addDrug(d)}
                disabled={drugs.includes(d)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                  drugs.includes(d)
                    ? 'opacity-30 cursor-not-allowed border-[var(--border)] text-[var(--text-muted)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Drug List */}
        {drugs.length > 0 && (
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2 font-display uppercase tracking-widest">
              Selected ({drugs.length}/8):
            </p>
            <div className="flex flex-wrap gap-2">
              {drugs.map(d => (
                <span key={d} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-active)] text-sm text-[var(--accent)] font-medium">
                  <Pill size={12} />
                  {d}
                  <button onClick={() => setDrugs(prev => prev.filter(x => x !== d))} className="hover:opacity-60 ml-1">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={check}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Checking Interactions...
            </>
          ) : (
            <>
              <Shield size={16} />
              Check Interactions
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && riskLevel && (
        <div className="glass-card p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Interaction Report</h3>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${riskConfig[riskLevel].cls}`}>
              {riskConfig[riskLevel].icon} {riskConfig[riskLevel].label}
            </span>
          </div>
          <div className="accent-line mb-5" />
          <div
            className="ai-response text-sm text-[var(--text-secondary)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}
          />
          <div className="mt-5 p-3 rounded-lg bg-[var(--accent-dim)] border border-[var(--border-active)] text-[var(--accent)]/80 text-xs flex items-start gap-2">
            <Shield size={14} className="flex-shrink-0 mt-0.5" />
            Always consult your pharmacist or physician before changing your medication regimen.
          </div>
        </div>
      )}
    </div>
  );
}
