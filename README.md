# 🏥 MediSense AI — Intelligent Health Platform

> **Codecure @ SPIRIT 2026 · IIT (BHU) Varanasi**  
> AI-driven health-tech solution enhancing healthcare delivery, patient engagement, and health literacy.

---

## 📌 Project Overview

**MediSense AI** is a comprehensive, AI-powered health intelligence platform that puts clinical-grade reasoning in the hands of every user. Built for the intersection of innovation and healthcare, MediSense addresses the three core pillars of the Codecure challenge:

- **Healthcare Delivery** — Smart symptom triage and drug safety checks
- **Patient Engagement** — Conversational AI health companion and personalized care planning
- **Health Literacy** — Medical language translation into plain, accessible language

Powered by **Grok (xAI)** via an OpenAI-compatible API, MediSense delivers real-time, context-aware medical intelligence through a beautiful, production-grade interface.

---

## ✨ Features

### 1. 🩺 Symptom Analyzer
Intelligent symptom triage powered by Grok AI.
- Select from 14+ common symptoms or describe in natural language
- Input age and symptom duration for personalized analysis
- Receive: possible conditions (ranked by likelihood), severity scoring (Low/Medium/High), immediate action steps, red flag warnings, and self-care tips
- Color-coded severity badges with clinical context

### 2. 📖 MedTranslate — Health Literacy Engine
Converts complex medical documents into plain language.
- Paste any medical report, lab result, prescription, or radiology finding
- Outputs: plain language summary, key findings, medical glossary, what it means for you, and questions to ask your doctor
- Includes 3 real-world example reports (lab, cardiology, radiology)
- One-click copy to clipboard

### 3. 💊 Drug Interaction Checker
AI-powered medication safety analysis.
- Add up to 8 medications (manual entry or quick-select from 14 common drugs)
- Identifies: drug-drug interactions, severity levels (Minor/Moderate/Major), interaction mechanisms, clinical effects, and safer alternatives
- Overall risk rating: ✅ LOW / ⚠️ MODERATE / 🚨 HIGH
- Food and lifestyle interaction warnings

### 4. 🫀 CarePlan AI — Preventive Health Planner
Personalized preventive medicine roadmap.
- Input: age, gender, weight, height, activity level, diet type, smoking/alcohol habits, existing conditions, and health goals
- Auto-calculates BMI
- Generates: health risk assessment, age/gender-appropriate screening schedule, vaccination recommendations, lifestyle modifications, monitoring targets, 30-day action plan, and annual goals

### 5. 💬 MediSense Chat — AI Health Companion
Real-time conversational health assistant.
- Full multi-turn conversation with memory context
- Pre-loaded quick questions for instant engagement
- Markdown-rendered responses for clarity
- Covers: general health Q&A, mental wellness, nutrition, fitness, medication info, and post-appointment support

---

## 🛠️ Tech Stack & Tools

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS + Custom CSS Variables |
| **AI Engine** | Grok (xAI) via OpenAI-compatible API |
| **AI Model** | `grok-3-mini` |
| **Icons** | Lucide React |
| **Typography** | Syne (display) + DM Sans (body) |
| **State Management** | React Hooks (useState, useEffect, useRef) |
| **Build Tool** | Vite 5 |
| **Package Manager** | npm |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+ 
- npm v9+
- xAI API Key ([Get one at console.x.ai](https://console.x.ai))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/medisense-ai.git
cd medisense-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your Grok API key:
# VITE_GROK_API_KEY=xai-your-key-here

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

> **Alternative:** If you don't set up the `.env` file, the app will prompt you to enter your API key directly in the browser on first launch. The key is stored in localStorage for subsequent visits.

---

## 🏗️ Technical Workflow

```
User Input
    │
    ▼
React UI Layer (Component)
    │
    ▼
API Utility (src/utils/api.js)
    │  • Constructs system prompt (feature-specific)
    │  • Formats message history
    │  • Sends POST to https://api.x.ai/v1/chat/completions
    │
    ▼
Grok AI (grok-3-mini)
    │  • Processes medical context
    │  • Returns structured markdown response
    │
    ▼
parseMarkdown() Renderer
    │  • Converts markdown to HTML
    │
    ▼
React UI Render (dangerouslySetInnerHTML)
    │
    ▼
User sees formatted, actionable health insights
```

### Key Architecture Decisions

- **System Prompts**: Each feature has a carefully engineered, domain-specific system prompt that constrains Grok to behave as a medical sub-specialist, ensuring structured, safe, and relevant outputs.
- **Stateless API**: Every API call is independent — no user data is stored server-side, ensuring privacy.
- **Local Key Storage**: API keys are stored in `localStorage`, never transmitted to any third-party server.
- **Markdown Parsing**: Custom lightweight markdown parser handles headers, bold, lists, and code — no external dependency needed.
- **Severity Extraction**: Client-side regex extracts severity levels from AI responses for dynamic UI badges.

---

## 📁 Project Structure

```
medisense-ai/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Home page with feature cards
│   │   ├── SymptomAnalyzer.jsx # AI symptom triage
│   │   ├── MedTranslate.jsx    # Medical language translator
│   │   ├── DrugInteraction.jsx # Drug safety checker
│   │   ├── CarePlan.jsx        # Preventive care planner
│   │   ├── HealthChat.jsx      # Conversational AI assistant
│   │   └── ApiKeySetup.jsx     # First-run API key configuration
│   ├── utils/
│   │   └── api.js              # Grok API integration + markdown parser
│   ├── App.jsx                 # Root component + navigation
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + design system
├── index.html                  # HTML shell
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── package.json                # Dependencies
├── .env.example                # Environment template
└── README.md                   # This file
```

---

## 🎯 Innovation & Impact

### Problem Addressed
- **Health Literacy Gap**: 90 million adults in India struggle to understand medical terminology
- **Symptom Anxiety**: Patients lack tools to assess symptom severity before seeking care
- **Medication Safety**: Polypharmacy errors are a leading cause of preventable hospitalizations
- **Preventive Care Access**: Personalized health planning remains a luxury for most

### Our Solution
MediSense AI democratizes access to clinical intelligence — making it available to anyone with a smartphone or browser, in language they can understand.

### Scalability
- Frontend-only architecture = zero backend infrastructure costs
- API-first design allows easy model swapping (GPT-4, Gemini, Claude, etc.)
- Component-based React architecture enables rapid feature addition
- Designed for Progressive Web App (PWA) conversion

---

## 🔒 Safety & Ethics

- All AI responses include medical disclaimers
- The platform explicitly does **not** diagnose — it suggests possibilities and encourages professional consultation
- No user health data is stored, transmitted, or logged
- Emergency red-flag warnings are prominently displayed for high-severity symptoms
- Drug interaction warnings always recommend pharmacist/physician consultation

---

## 🚀 Future Roadmap

- [ ] EHR (Electronic Health Record) integration
- [ ] Voice input for accessibility
- [ ] Multilingual support (Hindi, Bengali, Tamil, etc.)
- [ ] Wearable data integration (heart rate, SpO2)
- [ ] Telemedicine appointment booking
- [ ] Community health forums
- [ ] Offline PWA mode
- [ ] Doctor-facing dashboard

---

## 👥 Team

Built with passion for Codecure @ SPIRIT 2026, IIT (BHU) Varanasi.

---


> MediSense AI empowers patients to understand their health — so doctors can focus on healing.
