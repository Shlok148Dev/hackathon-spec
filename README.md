# 🦅 Hermes: Self-Healing Autonomous Support Agent
> **Cyber Cypher 5.0 - Advanced Track Submission**

Hermes is an **Agentic AI System** designed for headless commerce platforms. It functions as an autonomous Site Reliability Engineer (SRE), capable of creating tickets, diagnosing root causes, and implementing fixes—all with human-in-the-loop oversight.

![Dashboard Preview](./docs/dashboard_preview.png)

## 🚀 The Problem
Modern headless commerce migrations are complex. A single API mismatch or config error c@app.on_event("startup")` hook to run a database migration, ensured the `resolved_at` column is added to the `tickets` table upon server start.
1.  Triaging the ticket.
2.  Reading logs.
3.  Finding the documentation.
4.  Proposing a fix.

**Hermes does this in seconds.**

## 💡 The Solution: Agent Swarm
Our architecture uses a "Swarm" of specialized AI agents:

1.  **Orchestrator (The Boss)**
    *   *Model*: Gemini 1.5 Flash
    *   *Role*: Low-latency triaging and routing.
    *   *Action*: Decides if a ticket needs a human or the AI Diagnostician.

2.  **Diagnostician (The Detective)**
    *   *Model*: Gemini 1.5 Pro
    *   *Role*: Deep reasoning and RAG (Retrieval Augmented Generation).
    *   *Action*: Analyzes documentation + logs to form hypotheses.

3.  **Healer (The Surgeon)**
    *   *Model*: Code-Generative Model
    *   *Role*: Proposing safe, reversible fixes.
    *   *Action*: Generates SQL/JSON patches. Requires **Human Approval** for high-risk actions.

## 🛠️ Tech Stack
*   **Backend**: Python (FastAPI), SQLAlchemy (Async), PostgreSQL (Supabase)
*   **AI Core**: Google Gemini 1.5 Pro, `text-embedding-004` (Vector Search)
*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion
*   **Infrastructure**: Docker ready, designed for Vercel/Railway.

## ⚡ Quick Start

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   PostgreSQL URL (Supabase recommended)
*   Google Gemini API Key

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/hackathon-spec.git
cd hackathon-spec
```

### 2. Backend (Port 8000)
```bash
# Setup Environment
cp .env.example .env
# (Add your DATABASE_URL and GOOGLE_API_KEY)

# Install Dependencies
pip install -r requirements.txt

# Run Server (Auto-migrates DB)
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### 4. Verified Usage
Open `http://localhost:5173` to see the **Mission Control Dashboard**.
*   **Create a Ticket**: Checks for API/Config errors.
*   **Watch the Feed**: See agents thinking in real-time.
*   **Approve Fix**: Click "Approve" to let the Healer fix the DB.

## 🧪 Testing
Run our full end-to-end verification suite:
```bash
python scripts/verify_full_system.py
```

## 📜 License
MIT
