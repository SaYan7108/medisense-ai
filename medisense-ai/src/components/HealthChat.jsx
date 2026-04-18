import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Bot, User, Trash2 } from 'lucide-react';
import { callClaude, parseMarkdown } from '../utils/api';

const SYSTEM_PROMPT = `You are MediSense, an empathetic and knowledgeable AI health companion.

You help users with:
- General health and wellness questions
- Understanding medical conditions and treatments
- Mental health support and stress management
- Nutrition and fitness guidance
- Medication information and side effects
- Post-appointment follow-up questions
- Health literacy and education

Guidelines:
- Be warm, empathetic, and supportive
- Use clear, accessible language
- When appropriate, use bullet points or numbered lists for clarity
- Always recommend professional consultation for serious or personal medical concerns
- Never diagnose — suggest possibilities and encourage professional evaluation
- If someone seems distressed, acknowledge feelings before providing information
- Keep responses focused and concise (2-4 paragraphs max unless detailed info is needed)

You represent healthcare AI that enhances, not replaces, professional medical care.`;

const QUICK_QUESTIONS = [
  'What are signs of vitamin D deficiency?',
  'How to improve sleep quality naturally?',
  'Best foods for heart health?',
  'How do I manage anxiety?',
  'What should my blood pressure be?',
  'How much water should I drink daily?',
];

export default function HealthChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm **MediSense**, your AI health companion. 👋\n\nI can help you understand health conditions, answer wellness questions, explain medical terms, or just have a health conversation.\n\nHow can I assist you today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await callClaude(apiMessages, SYSTEM_PROMPT, 800);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${err.message}. Please try again.`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. How can I help you today?",
    }]);
  };

  return (
    <div className="flex flex-col h-full animate-fade-up" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="feature-icon">
            <MessageCircle size={20} className="text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">MediSense Chat</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <p className="text-xs text-[var(--accent)]">AI Health Companion · Online</p>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-2">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-xs text-[var(--text-muted)] font-display uppercase tracking-widest mb-2">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="glass-card flex-1 overflow-y-auto p-4 flex flex-col gap-3 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--border-active)] flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-[var(--accent)]" />
              </div>
            )}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              {msg.role === 'assistant' ? (
                <div className="ai-response text-sm text-[var(--text-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
              ) : (
                <p className="text-sm text-[var(--text-primary)]">{msg.content}</p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0 mt-1">
                <User size={14} className="text-[#050d1a]" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--border-active)] flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-[var(--accent)]" />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1.5 items-center h-5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card p-3 flex gap-3 items-end">
        <textarea
          className="input-field flex-1 h-12 resize-none"
          style={{ paddingTop: '14px' }}
          placeholder="Ask me anything about your health..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
        />
        <button
          className="btn-primary p-3 flex items-center justify-center"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{ height: '46px', width: '46px', padding: 0 }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
