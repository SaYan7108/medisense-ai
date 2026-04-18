import { useState } from 'react';
import { Heart, Loader2, ChevronRight, AlertCircle, Sparkles, User } from 'lucide-react';
import { callClaude, parseMarkdown } from '../utils/api';

const SYSTEM_PROMPT = `You are MediSense AI's Preventive Care Planner — an expert in preventive medicine and wellness.

Based on the patient's profile, create a personalized preventive care plan covering:

1. **Your Health Risk Assessment** — Based on their demographics and conditions, identify key risks
2. **Screening Schedule** — Age/gender appropriate screenings they should get and when
3. **Vaccinations** — Recommended vaccines based on their profile
4. **Lifestyle Modifications** — Specific, actionable recommendations for:
   - Diet & Nutrition
   - Physical Activity
   - Sleep & Stress Management
5. **Monitoring Targets** — Key metrics to track (BP, BMI, blood sugar ranges, etc.)
6. **30-Day Action Plan** — Practical first steps to take this month
7. **Annual Health Goals** — Long-term targets

Use ## headers. Be specific and personalized — not generic advice.
Make the plan realistic, encouraging, and achievable.`;

const CONDITIONS = [
  'Hypertension', 'Diabetes (Type 2)', 'High Cholesterol', 'Obesity',
  'Asthma', 'Heart Disease', 'Anxiety/Depression', 'Arthritis',
  'Thyroid Disorder', 'Anemia', 'PCOD/PCOS', 'Kidney Disease',
];

const LIFESTYLE = [
  'Sedentary', 'Mildly Active', 'Moderately Active', 'Very Active',
];

const DIET = [
  'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Eggetarian', 'Mixed',
];

export default function CarePlan() {
  const [form, setForm] = useState({
    age: '', gender: '', weight: '', height: '',
    lifestyle: '', diet: '', smoking: 'No', alcohol: 'No',
    conditions: [], goals: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleCondition = (c) => {
    setForm(prev => ({
      ...prev,
      conditions: prev.conditions.includes(c)
        ? prev.conditions.filter(x => x !== c)
        : [...prev.conditions, c],
    }));
  };

  const generate = async () => {
    if (!form.age || !form.gender) {
      setError('Age and gender are required.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    const bmi = form.weight && form.height
      ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
      : null;

    const prompt = `Patient Profile:
- Age: ${form.age} years
- Gender: ${form.gender}
- Weight: ${form.weight ? form.weight + ' kg' : 'Not provided'}
- Height: ${form.height ? form.height + ' cm' : 'Not provided'}
${bmi ? `- BMI: ${bmi}` : ''}
- Activity Level: ${form.lifestyle || 'Not specified'}
- Diet Type: ${form.diet || 'Not specified'}
- Smoking: ${form.smoking}
- Alcohol: ${form.alcohol}
- Existing Conditions: ${form.conditions.length > 0 ? form.conditions.join(', ') : 'None'}
- Health Goals: ${form.goals || 'General wellness'}

Please create a personalized preventive care plan.`;

    try {
      const response = await callClaude(
        [{ role: 'user', content: prompt }],
        SYSTEM_PROMPT,
        1500
      );
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="feature-icon">
            <Heart size={22} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">CarePlan AI</h2>
            <p className="text-sm text-[var(--text-secondary)]">Your personalized preventive health roadmap</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card p-6 space-y-5">
        {/* Demographics */}
        <div>
          <label className="text-sm font-display font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-3 block flex items-center gap-2">
            <User size={14} /> Personal Details
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Age *</label>
              <input className="input-field" placeholder="Years" type="number" value={form.age} onChange={e => update('age', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Gender *</label>
              <select className="input-field" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Weight (kg)</label>
              <input className="input-field" placeholder="e.g., 70" type="number" value={form.weight} onChange={e => update('weight', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Height (cm)</label>
              <input className="input-field" placeholder="e.g., 170" type="number" value={form.height} onChange={e => update('height', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-2 block font-display uppercase tracking-widest text-xs">Activity Level</label>
            <div className="flex flex-col gap-1.5">
              {LIFESTYLE.map(l => (
                <button key={l} onClick={() => update('lifestyle', l)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    form.lifestyle === l
                      ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-2 block font-display uppercase tracking-widest text-xs">Diet Type</label>
            <div className="flex flex-col gap-1.5">
              {DIET.map(d => (
                <button key={d} onClick={() => update('diet', d)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm border transition-all ${
                    form.diet === d
                      ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Habits */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Smoking</label>
            <select className="input-field" value={form.smoking} onChange={e => update('smoking', e.target.value)}>
              <option>No</option>
              <option>Occasionally</option>
              <option>Regularly</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Alcohol</label>
            <select className="input-field" value={form.alcohol} onChange={e => update('alcohol', e.target.value)}>
              <option>No</option>
              <option>Occasionally</option>
              <option>Regularly</option>
            </select>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-2 block font-display uppercase tracking-widest">Existing Conditions</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(c => (
              <button key={c} onClick={() => toggleCondition(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                  form.conditions.includes(c)
                    ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
                }`}>
                {form.conditions.includes(c) && '✓ '}{c}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Health Goals</label>
          <input className="input-field" placeholder="e.g., Lose weight, manage diabetes, improve energy..." value={form.goals} onChange={e => update('goals', e.target.value)} />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={generate} disabled={loading}>
          {loading ? (
            <><Loader2 size={16} className="animate-spin" />Generating Your Plan...</>
          ) : (
            <><Sparkles size={16} />Generate My Care Plan<ChevronRight size={16} /></>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="glass-card p-6 animate-fade-up">
          <h3 className="font-display font-bold text-lg mb-4">Your Personalized Care Plan</h3>
          <div className="accent-line mb-5" />
          <div className="ai-response text-sm text-[var(--text-secondary)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }} />
        </div>
      )}
    </div>
  );
}
