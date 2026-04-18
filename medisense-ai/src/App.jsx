import { useState, useEffect } from 'react';
import { Activity, BookOpen, Shield, MessageCircle, Heart, LayoutDashboard, Menu, X, Zap } from 'lucide-react';
import Dashboard from './components/Dashboard';
import SymptomAnalyzer from './components/SymptomAnalyzer';
import MedTranslate from './components/MedTranslate';
import DrugInteraction from './components/DrugInteraction';
import CarePlan from './components/CarePlan';
import HealthChat from './components/HealthChat';
import ApiKeySetup from './components/ApiKeySetup';

const TABS = [
  { id: 'home',     label: 'Home',       icon: LayoutDashboard },
  { id: 'symptoms', label: 'Symptoms',   icon: Activity },
  { id: 'translate',label: 'MedTranslate',icon: BookOpen },
  { id: 'drugs',    label: 'Drug Check', icon: Shield },
  { id: 'careplan', label: 'Care Plan',  icon: Heart },
  { id: 'chat',     label: 'Chat',       icon: MessageCircle },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [apiKey, setApiKey] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('medisense_api_key');
    if (stored) setApiKey(stored);
  }, []);

  if (!apiKey) {
    return <ApiKeySetup onSave={(key) => setApiKey(key)} />;
  }

  const navigate = (tab) => { setActiveTab(tab); setMobileMenuOpen(false); };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':     return <Dashboard onNavigate={navigate} />;
      case 'symptoms': return <SymptomAnalyzer />;
      case 'translate':return <MedTranslate />;
      case 'drugs':    return <DrugInteraction />;
      case 'careplan': return <CarePlan />;
      case 'chat':     return <HealthChat />;
      default:         return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      <div className="noise-overlay" />
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-xl" style={{ background: 'rgba(5,13,26,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Zap size={16} className="text-[#050d1a]" style={{ fill: '#050d1a' }} />
            </div>
            <span className="font-display font-extrabold text-lg text-[var(--text-primary)] tracking-tight">
              MediSense<span className="text-[var(--accent)]">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => navigate(tab.id)}>
                  <Icon size={14} />{tab.label}
                </button>
              );
            })}
          </div>

          <button className="md:hidden text-[var(--text-secondary)] p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] px-4 py-3 space-y-1" style={{ background: 'rgba(5,13,26,0.95)' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} className={`nav-tab w-full text-left ${activeTab === tab.id ? 'active' : ''}`} onClick={() => navigate(tab.id)}>
                  <Icon size={14} />{tab.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">{renderContent()}</main>

      <footer className="border-t border-[var(--border)] mt-12 py-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          MediSense AI · Codecure @ SPIRIT 2026, IIT (BHU) Varanasi · Powered by Groq AI
        </p>
      </footer>
    </div>
  );
}
