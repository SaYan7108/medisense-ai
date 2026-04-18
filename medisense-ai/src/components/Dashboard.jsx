import { Activity, BookOpen, Shield, MessageCircle, Heart, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react';

const FEATURES = [
  {
    id: 'symptoms',
    icon: Activity,
    color: '#00d2b4',
    bg: 'rgba(0,210,180,0.1)',
    title: 'Symptom Analyzer',
    subtitle: 'AI-Powered Triage',
    description: 'Describe your symptoms and get an intelligent assessment of possible conditions, severity scoring, and actionable next steps.',
    badge: 'Smart Triage',
  },
  {
    id: 'translate',
    icon: BookOpen,
    color: '#4cc9f0',
    bg: 'rgba(76,201,240,0.1)',
    title: 'MedTranslate',
    subtitle: 'Health Literacy',
    description: 'Convert complex medical reports, prescriptions, and lab results into plain, understandable language with a glossary.',
    badge: 'Plain Language',
  },
  {
    id: 'drugs',
    icon: Shield,
    color: '#ffd166',
    bg: 'rgba(255,209,102,0.1)',
    title: 'Drug Interaction',
    subtitle: 'Medication Safety',
    description: 'Check your medication list for dangerous interactions, understand mechanisms, and get safer alternatives.',
    badge: 'Safety Check',
  },
  {
    id: 'careplan',
    icon: Heart,
    color: '#ff4d6d',
    bg: 'rgba(255,77,109,0.1)',
    title: 'CarePlan AI',
    subtitle: 'Preventive Care',
    description: 'Get a personalized preventive health roadmap with screening schedules, lifestyle recommendations, and a 30-day action plan.',
    badge: 'Personalized',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    color: '#7b5ea7',
    bg: 'rgba(123,94,167,0.1)',
    title: 'MediSense Chat',
    subtitle: 'Health Companion',
    description: 'Have a real-time conversation with your AI health companion about any wellness topic, condition, or treatment.',
    badge: 'Real-time AI',
  },
];

const STATS = [
  { icon: Zap, label: 'AI-Powered Features', value: '5' },
  { icon: Users, label: 'Use Cases Covered', value: '15+' },
  { icon: TrendingUp, label: 'Health Domains', value: '8' },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="orb orb-teal absolute -top-20 -right-20 w-80 h-80 opacity-40" />
        <div className="orb orb-blue absolute -bottom-20 -left-20 w-60 h-60 opacity-30" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-dim)] border border-[var(--border-active)] text-[var(--accent)] text-xs font-display font-semibold uppercase tracking-widest mb-4">
            <Zap size={12} />
            SPIRIT 2026 · IIT (BHU) Varanasi
          </div>
          <h1 className="text-4xl font-display font-extrabold text-[var(--text-primary)] leading-tight mb-3">
            AI That Understands<br />
            <span className="text-[var(--accent)]">Your Health</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-2xl leading-relaxed mb-6">
            MediSense AI is an intelligent health platform combining symptom analysis, medical translation, drug safety, personalized care planning, and conversational AI — putting clinical intelligence in your hands.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate('symptoms')} className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </button>
            <button onClick={() => onNavigate('chat')} className="btn-secondary flex items-center gap-2">
              <MessageCircle size={16} /> Talk to MediSense
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-card p-4 text-center">
            <Icon size={20} className="text-[var(--accent)] mx-auto mb-2" />
            <div className="text-2xl font-display font-extrabold text-[var(--text-primary)]">{value}</div>
            <div className="text-xs text-[var(--text-muted)]">{label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-display font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => onNavigate(f.id)}
                className="glass-card p-5 text-left group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: f.bg, border: `1px solid ${f.color}30` }}>
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <span className="text-xs font-display font-bold px-2 py-1 rounded-full"
                    style={{ background: f.bg, color: f.color, border: `1px solid ${f.color}30` }}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[var(--text-primary)] mb-0.5">{f.title}</h3>
                <p className="text-xs text-[var(--accent)] font-semibold mb-2">{f.subtitle}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.description}</p>
                <div className="flex items-center gap-1 text-xs mt-3 transition-all duration-200"
                  style={{ color: f.color }}>
                  Open Feature <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-card p-4 border-yellow-500/20">
        <p className="text-xs text-yellow-400/70 text-center leading-relaxed">
          ⚕️ <strong>Medical Disclaimer:</strong> MediSense AI is for informational and educational purposes only. 
          It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}
