# 🚀 OnBoard AI

**Autonomous Employee Onboarding Intelligence**

A multi-agent AI system built with CrewAI that automates employee onboarding by intelligently searching Workday policy documents and generating personalized, compliant onboarding packages.

**Built specifically for Workday's AI Software Engineer role**

---

## 🎯 What It Does

OnBoard AI uses **3 specialized AI agents** to automate the entire employee onboarding process:

1. **Policy Researcher Agent** - Searches Workday's official policy documents using semantic search to find all relevant policies for the new employee

2. **Onboarding Writer Agent** - Creates personalized welcome emails, checklists (Day 1, Week 1, 30-day), and policy summaries in friendly, actionable language

3. **Compliance Validator Agent** - Ensures all legal requirements are met, catches gaps, and verifies completeness before delivery

**Result:** Complete onboarding package in **5 minutes** vs **2+ hours** manually

---

## 🏗️ Architecture
```
Workday PDF Documents (Code of Conduct, etc.)
            ↓
    PDF Processing & Chunking
            ↓
    Vector Database (ChromaDB)
            ↓
    Semantic Search Tool
            ↓
┌───────────────────────────────────┐
│   Multi-Agent CrewAI System       │
│                                   │
│  1. Policy Researcher → Research  │
│  2. Writer → Create Content       │
│  3. Validator → Verify Compliance │
└───────────────────────────────────┘
            ↓
    Personalized Onboarding Package
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Groq API key (free tier: https://console.groq.com)

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/workdayflow-ai.git
cd workdayflow-ai

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your GROQ_API_KEY to .env
```

### Setup Knowledge Base
```bash
# 1. Add Workday PDF documents to backend/data/pdfs/
#    (Already included: code-of-conduct.pdf)

# 2. Process PDFs and create vector database
python backend/setup_pdfs.py
```

### Run the Application

#### Option 1: Run Streamlit UI (Recommended)
```bash
# Run the user-friendly web interface
python run_app.py

# Or directly:
streamlit run frontend/app.py
```

#### Option 2: Run from Command Line
```bash
# Generate onboarding package for test employee
python backend/main.py

# Check backend/outputs/ folder for generated package
```

---

## 📁 Project Structure
```
onboardAI/
├── backend/                 # Backend code and logic
│   ├── agents/
│   │   └── onboarding_agents.py  # 3 specialized agents
│   ├── tasks/
│   │   └── onboarding_tasks.py   # Sequential workflow
│   ├── tools/
│   │   ├── pdf_knowledge_base.py  # PDF processing
│   │   └── policy_search.py       # Semantic search
│   ├── data/
│   │   ├── pdfs/              # Workday policy PDFs
│   │   ├── chroma_db/         # Vector database (auto-created)
│   │   └── employee_profiles.json
│   ├── outputs/               # Generated packages
│   ├── setup_pdfs.py         # One-time PDF setup
│   └── main.py               # OnboardingCrew class
├── frontend/                # Frontend UI
│   └── app.py               # Streamlit web interface
├── run_app.py              # Launcher script
├── requirements.txt        # Python dependencies
└── README.md
```

---

## 💡 Key Features

✅ **Real Workday Content** - Uses actual Workday Code of Conduct PDF  
✅ **Semantic Search** - Finds relevant policies using embeddings  
✅ **Multi-Agent Architecture** - Specialized agents collaborate autonomously  
✅ **Compliance Focused** - Validates all requirements are met  
✅ **Production Ready** - Clean architecture, error handling, logging  
✅ **Cost Optimized** - Uses free Groq API (Llama 3.1 70B)  

---

## 🎓 Technical Stack

- **Framework:** CrewAI (multi-agent orchestration)
- **LLM:** Groq (Llama 3.1 70B - free tier)
- **Vector DB:** ChromaDB (local, free)
- **Embeddings:** Sentence Transformers (all-MiniLM-L6-v2)
- **PDF Processing:** PyPDF2

---

## 📊 Business Impact

For a company onboarding 100 employees monthly:

- **Time Savings:** 2 hours → 5 minutes per onboarding (95% reduction)
- **Cost Savings:** ~180 hours monthly = $9,000 in HR operational costs
- **Consistency:** Every employee gets complete, compliant onboarding
- **Scalability:** Handles 1 or 100 onboardings with same quality

---

## 🔧 Development

### Add More PDFs
```bash
# Add PDFs to backend/data/pdfs/
cp path/to/new-policy.pdf backend/data/pdfs/

# Reprocess knowledge base
python backend/setup_pdfs.py
```

### Test Different Employees

Use the Streamlit UI to enter different employee profiles, or edit `backend/main.py` and change:
```python
employee = employees[0]  # Try employees[1] or employees[2]
```

---

## 📝 License

MIT License - Built as interview project for Workday

---

## 👤 Author

**Palak** - AI Software Engineer  
Master of Applied Computing (AI), University of Windsor
