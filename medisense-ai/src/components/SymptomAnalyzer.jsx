import { useState } from 'react';
import { AlertTriangle, Activity, ChevronRight, Plus, X, Loader2, Stethoscope } from 'lucide-react';
import { callClaude, parseMarkdown } from '../utils/api';

const SYSTEM_PROMPT = `You are MediSense AI's Symptom Analysis Engine — an advanced medical AI assistant.
When a user describes their symptoms, provide:

1. **Symptom Assessment** — Identify the primary symptoms and their significance
2. **Possible Conditions** — List 3-5 possible conditions (ordered by likelihood), with brief explanations
3. **Severity Level** — Clearly state: LOW / MEDIUM / HIGH with brief justification
4. **Immediate Actions** — What the person should do right now
5. **When to Seek Emergency Care** — Red flag symptoms to watch for
6. **Self-Care Tips** — Evidence-based home care advice if applicable

Format your response with clear markdown headers (##) for each section.
Always end with a disclaimer reminding users to consult a qualified healthcare professional.
Be empathetic, clear, and use accessible language. Do NOT diagnose definitively — only suggest possibilities.`;

const SYMPTOM_TAGS = [
  'Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea', 'Chest Pain',
  'Shortness of Breath', 'Sore Throat', 'Back Pain', 'Dizziness',
  'Rash', 'Joint Pain', 'Abdominal Pain', 'Vomiting',
];

export default function SymptomAnalyzer() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [age, setAge] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const analyze = async () => {
    if (selectedSymptoms.length === 0 && !customInput.trim()) {
      setError('Please select at least one symptom or describe your condition.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const symptomsText = [
        ...selectedSymptoms,
        customInput.trim() ? `Additional details: ${customInput.trim()}` : '',
      ].filter(Boolean).join(', ');

      const userMessage = `Patient Information:
- Age: ${age || 'Not specified'}
- Symptom Duration: ${duration || 'Not specified'}
- Symptoms: ${symptomsText}

Please analyze these symptoms.`;

      const response = await callClaude(
        [{ role: 'user', content: userMessage }],
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

  const severity = result
    ? result.toLowerCase().includes('severity level: high') || result.toLowerCase().includes('**high**')
      ? 'high'
      : result.toLowerCase().includes('severity level: medium') || result.toLowerCase().includes('**medium**')
      ? 'medium'
      : 'low'
    : null;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="feature-icon">
            <Stethoscope size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">Symptom Analyzer</h2>
            <p className="text-sm text-[var(--text-secondary)]">AI-powered triage & health assessment</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-card p-6 space-y-5">
        {/* Quick Select */}
        <div>
          <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block">
            Common Symptoms
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_TAGS.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  selectedSymptoms.includes(s)
                    ? 'bg-[var(--accent)] text-[#050d1a] border-[var(--accent)] font-bold'
                    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {selectedSymptoms.includes(s) && <span className="mr-1">✓</span>}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Selected */}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(s => (
              <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold severity-low">
                {s}
                <button onClick={() => toggleSymptom(s)} className="hover:opacity-70">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Additional Details */}
        <div>
          <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
            Describe Your Condition
          </label>
          <textarea
            className="input-field h-24"
            placeholder="e.g., 'Sharp chest pain when breathing deeply, started 2 days ago after exercising...'"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
          />
        </div>

        {/* Age & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
              Age
            </label>
            <input
              className="input-field"
              placeholder="e.g., 28"
              value={age}
              onChange={e => setAge(e.target.value)}
              type="number"
              min="0" max="120"
            />
          </div>
          <div>
            <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2 block">
              Duration
            </label>
            <input
              className="input-field"
              placeholder="e.g., 2 days"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Activity size={16} />
              Analyze Symptoms
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`glass-card p-6 animate-fade-up`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Analysis Report</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide severity-${severity}`}>
              {severity} severity
            </span>
          </div>
          <div className="accent-line mb-5" />
          <div
            className="ai-response text-sm text-[var(--text-secondary)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }}
          />
          <div className="mt-5 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400/80 text-xs flex items-start gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            This analysis is for informational purposes only and is not a medical diagnosis. Always consult a licensed healthcare professional.
          </div>
        </div>
      )}
    </div>
  );
}
