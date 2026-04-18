import { useState } from 'react';
import { FileText, Loader2, ChevronRight, AlertCircle, BookOpen, Copy, Check } from 'lucide-react';
import { callClaude, parseMarkdown } from '../utils/api';

const SYSTEM_PROMPT = `You are MediSense AI's MedTranslate engine — an expert at making complex medical information accessible.

When given medical text (reports, prescriptions, diagnoses, lab results), you:

1. **Plain Language Summary** — Explain what the document says in simple, everyday language
2. **Key Findings** — Bullet-point the most important findings/results
3. **Medical Terms Glossary** — Define any complex medical terms found
4. **What This Means For You** — Practical interpretation of the results
5. **Questions to Ask Your Doctor** — Suggest 3-5 relevant questions the patient should ask

Always be empathetic, clear, and non-alarmist. Use analogies when helpful. 
Format with clear ## headers.`;

const EXAMPLES = [
  {
    label: 'Lab Report',
    text: 'HbA1c: 7.2% (Reference: <5.7%), FBS: 142 mg/dL, eGFR: 68 mL/min/1.73m², Creatinine: 1.3 mg/dL. Mild proteinuria noted. Start metformin 500mg BD.'
  },
  {
    label: 'Cardiology',
    text: 'Echocardiography findings: EF 45%, Grade I diastolic dysfunction, mild mitral regurgitation, no pericardial effusion. Recommend ACE inhibitor therapy.'
  },
  {
    label: 'Radiology',
    text: 'Chest X-ray: Cardiomegaly with CTR 0.55, bilateral perihilar infiltrates, blunting of costophrenic angles suggestive of pleural effusion. No pneumothorax.'
  }
];

export default function MedTranslate() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const translate = async () => {
    if (!input.trim()) {
      setError('Please paste your medical text.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await callClaude(
        [{ role: 'user', content: `Please translate this medical text into plain language:\n\n${input.trim()}` }],
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

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon">
            <BookOpen size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">MedTranslate</h2>
            <p className="text-sm text-[var(--text-secondary)]">Convert complex medical jargon to plain language</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
            Paste Medical Text
          </label>
          <textarea
            className="input-field h-36"
            placeholder="Paste your medical report, prescription, lab results, or diagnosis here..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        {/* Quick Examples */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-2 font-display uppercase tracking-widest">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex.label}
                onClick={() => setInput(ex.text)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={translate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <FileText size={16} />
              Translate to Plain Language
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="glass-card p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Plain Language Explanation</h3>
            <button
              onClick={copyResult}
              className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <div className="accent-line mb-5" />
          <div
            className="ai-response text-sm text-[var(--text-secondary)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}
          />
        </div>
      )}
    </div>
  );
}
