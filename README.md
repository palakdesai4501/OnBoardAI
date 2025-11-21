# Demo

https://github.com/user-attachments/assets/564be90e-ad95-4422-9a12-13a36e9ff091

# OnBoard AI

**Autonomous Employee Onboarding Intelligence**

A multi-agent AI system built with CrewAI that automates employee onboarding by intelligently searching Workday policy documents and generating personalized, compliant onboarding packages.

---

## What It Does

OnBoard AI uses **2 specialized AI agents** to automate the entire employee onboarding process:

1. **Policy Researcher Agent** - Searches Workday's official policy documents using semantic search to find all relevant policies for the new employee based on their role, department, location, and employment type.

2. **Onboarding Writer Agent** - Creates personalized welcome emails, checklists (Day 1, Week 1, 30-day), and policy summaries in friendly, actionable language.

**Result:** Complete onboarding package in **5 minutes** vs **2+ hours** manually

---

## Architecture

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
└───────────────────────────────────┘
            ↓
    FastAPI REST API
            ↓
    React Frontend UI
            ↓
    Personalized Onboarding Package
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- OpenAI API key (https://platform.openai.com/api-keys)

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/onboardAI.git
cd onboardAI

# Backend Setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Frontend Setup
cd frontend
npm install
cd ..

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Setup Knowledge Base

```bash
# 1. Add Workday PDF documents to backend/data/pdfs/
#    (Already included: code-of-conduct.pdf)

# 2. Process PDFs and create vector database
python backend/setup_pdfs.py
```

### Run the Application

#### Option 1: Start Both Services (Recommended)

```bash
# Start both backend API and frontend dev server
chmod +x start.sh
./start.sh
```

This will start:
- Backend API: http://localhost:8000
- Frontend UI: http://localhost:5173

#### Option 2: Run Services Separately

**Backend API:**
```bash
cd backend
python -m uvicorn api:app --reload --port 8000
```

**Frontend UI:**
```bash
cd frontend
npm run dev
```

#### Option 3: Run from Command Line (Backend Only)

```bash
# Generate onboarding package for test employee
python backend/main.py

# Check backend/outputs/ folder for generated package
```

---

## Project Structure

```
onboardAI/
├── backend/                 # Backend API and logic
│   ├── agents/
│   │   └── onboarding_agents.py  # 2 specialized agents
│   ├── tasks/
│   │   └── onboarding_tasks.py   # Sequential workflow tasks
│   ├── tools/
│   │   ├── pdf_knowledge_base.py  # PDF processing & vector DB
│   │   └── policy_search.py       # Semantic search tool
│   ├── utils/
│   │   ├── logger.py              # Logging configuration
│   │   ├── exceptions.py          # Custom exceptions
│   │   └── file_cleanup.py        # File management
│   ├── data/
│   │   ├── pdfs/                  # Workday policy PDFs
│   │   ├── chroma_db/             # Vector database (auto-created)
│   │   └── employee_profiles.json # Test employee data
│   ├── outputs/                   # Generated packages
│   ├── api.py                     # FastAPI REST API
│   ├── config.py                  # Configuration management
│   ├── main.py                    # OnboardingCrew class
│   └── setup_pdfs.py              # One-time PDF setup
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── EmployeeForm.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── StatusCard.tsx
│   │   ├── hooks/
│   │   │   └── useOnboarding.ts   # Onboarding logic hook
│   │   ├── services/
│   │   │   └── api.ts             # API client
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   └── package.json
├── start.sh                       # Start script for both services
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment variables template
└── README.md
```

---

## Key Features

- **Real Workday Content** - Uses actual Workday Code of Conduct PDF  
- **Semantic Search** - Finds relevant policies using embeddings  
- **Multi-Agent Architecture** - Specialized agents collaborate autonomously  
- **REST API** - FastAPI backend with health checks and metrics  
- **Modern UI** - React + TypeScript frontend with Tailwind CSS  
- **Production Ready** - Clean architecture, error handling, logging  
- **Personalized** - Location, department, and role-specific content  

---

## Technical Stack

### Backend
- **Framework:** FastAPI (REST API)
- **Multi-Agent:** CrewAI (orchestration)
- **LLM:** OpenAI GPT-4o-mini
- **Vector DB:** ChromaDB (local, persistent)
- **Embeddings:** Sentence Transformers (all-MiniLM-L6-v2)
- **PDF Processing:** PyPDF2

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API

---

## API Endpoints

### Health Check
```bash
GET /api/health
```
Returns system health status including knowledge base and API key configuration.

### Onboard Employee
```bash
POST /api/onboard
Content-Type: application/json

{
  "name": "John Doe",
  "role": "Software Engineer",
  "department": "Engineering",
  "location": "California",
  "work_arrangement": "remote",
  "employment_type": "full_time",
  "start_date": "2025-01-15"
}
```

### Download Output
```bash
GET /api/output/{filename}
```
Downloads the generated onboarding package markdown file.

### Metrics
```bash
GET /api/metrics
```
Returns file cleanup metrics and retention settings.

---

## Business Impact

For a company onboarding 100 employees monthly:

- **Time Savings:** 2 hours → 5 minutes per onboarding (95% reduction)
- **Cost Savings:** ~180 hours monthly = $9,000 in HR operational costs
- **Consistency:** Every employee gets complete, compliant onboarding
- **Scalability:** Handles 1 or 100 onboardings with same quality

---

## Development

### Add More PDFs
```bash
# Add PDFs to backend/data/pdfs/
cp path/to/new-policy.pdf backend/data/pdfs/

# Reprocess knowledge base
python backend/setup_pdfs.py
```

### Environment Variables

Create a `.env` file in the project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2
OPENAI_MAX_TOKENS=1800

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Paths
PDF_DIRECTORY=data/pdfs
PERSIST_DIRECTORY=data/chroma_db
OUTPUTS_DIRECTORY=outputs

# File Management
FILE_RETENTION_DAYS=30

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json
```

### Build Frontend for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` and can be served by any static file server or integrated with the FastAPI backend.


---

## Author

**Palak** - AI Software Engineer  
Master of Applied Computing (AI), University of Windsor
