# Supervisor Feedback Analyzer — Trinethra Module

An AI-assisted tool that analyzes supervisor transcripts to produce structured Fellow assessments. Built for DeepThought's internal team (TPMs, HR, and psychology interns) to monitor Fellow performance across client engagements.

## Setup Instructions

### Prerequisites
- Node.js installed
- Ollama installed

### Step 1: Set Up Ollama

```bash
# Install Ollama from https://ollama.com (or use your package manager)

# Pull the model
ollama pull llama3.2:3b

# Verify Ollama is running
ollama list
```

### Step 2: Start the Backend

```bash
cd backend

# Install dependencies
npm install

# Start the server (runs on http://localhost:3000)
node app.js
```

### Step 3: Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (runs on http://localhost:5173)
npm run dev
```

### Step 4: Use the App

1. Open http://localhost:5173 in your browser
2. Paste a supervisor transcript in the text area
3. Click "Send" to analyze
4. Review the generated assessment in the results page
5. Use the "Edit" toggle to modify any section as needed

---

## Ollama Model

**Model Used:** `llama3.2:3b`

**Why this model:**
- Smallest variant of Llama 3.2 (3B parameters) — runs smoothly on laptops with 8GB RAM
- Despite its size, performs well on structured extraction tasks
- Fast inference compared to larger models
- Good balance between quality and speed for a 10-minute transcript

**Note:** We use the `llama3.2:3b` tag specifically (not `llama3.2` which defaults to 7B) for faster local inference.

---

## Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │ ──── │   Express   │ ──── │   Ollama    │
│  (React)     │ HTTP │  (Backend)  │ HTTP │  (LLM)      │
│             │      │ :3000       │      │ :11434      │
└─────────────┘      └─────────────┘      └─────────────┘
     │                     │
     │              ┌──────┴──────┐
     │              │ prompt.js  │
     │              │ (System +   │
     │              │  User msg)  │
     │              ├─────────────┤
     │              │ format.json │
     │              │ (JSON Schema)│
     └──────────────┴─────────────┘
```

- **Frontend (React + Vite):** Single-page app with two views — transcript input and results display. Uses React Router for navigation.
- **Backend (Express):** Single `/analyze` endpoint that receives transcript, forwards to Ollama, and returns the structured analysis.
- **Ollama:** Local LLM running `llama3.2:3b`. The backend sends a system prompt (domain knowledge) + user prompt (transcript) and requests structured JSON output.

---

## Design Challenges Tackled

### Challenge 1: One Prompt or Many?

**Approach:** Single comprehensive prompt

**Rationale:**
- A supervisor transcript is typically 10-15 minutes of conversation — approximately 1500-3000 words
- This length is well within the context window of `llama3.2:3b`
- The 5 output sections (score, evidence, KPI mapping, gaps, follow-up questions) are semantically related — splitting them would lose cross-referencing opportunities
- Speed matters: a single API call reduces latency from ~20-30s (3 calls) to ~10-15s (1 call)
- The intern reviews the full output anyway, so batching is more efficient

**Tradeoff accepted:** Single-prompt may sacrifice some specialized extraction quality, but the speed improvement and simplicity make it the right choice for this use case.

### Challenge 2: Structured Output Reliability

**Approach:** JSON Schema enforcement via Ollama's `format` parameter

**Implementation:**
- `format.json` defines a strict JSON Schema with:
  - Required fields and their types
  - Enum constraints for fields like `signal`, `dimension`, `kpi`, `confidence`
  - Property descriptions for additional LLM guidance
- The schema is sent as the `format` parameter in the Ollama API request
- Ollama uses this schema to constrain its output, reducing malformed responses

**Fallback strategy (for future):** If parsing fails, we could:
1. Retry the request once
2. Use regex to extract partial JSON
3. Display raw text with error message to the user

**Tradeoff accepted:** JSON Schema is strict but may occasionally produce empty/null values if the LLM is uncertain. The Edit mode in the UI allows correction of these edge cases.

### Challenge 4: Showing Uncertainty

**Approach:** Edit mode in results page + confidence indicator

**Implementation:**
- The results page displays all sections in read-only mode by default
- An "Edit" toggle (which becomes "Lock" when active) allows the intern to modify any field inline
- The `confidence` field in the score indicates how certain the LLM is about its assessment
- All fields are editable: score value, evidence quotes, KPI mappings, gap details, and follow-up questions
- "New Analysis" button allows starting fresh without navigating away

**Why this helps:**
- Intern treats output as a draft, not a verdict
- Automation bias is reduced because changes are visible and intentional
- The LLM's uncertainty is explicitly surfaced via the confidence field

---

## Future Improvements

With more time, we would add:

1. **Side-by-side view:** Display the transcript on the left and the analysis on the right so the intern can cross-reference without tab-switching

2. **Click-to-highlight evidence:** Click on an evidence quote to highlight the corresponding section in the transcript (and vice versa)

3. **Export functionality:** Download the final assessment as a PDF or copy to clipboard with proper formatting

4. **Retry/regenerate individual sections:** Instead of regenerating the entire analysis, allow the intern to regenerate specific sections (e.g., "regenerate follow-up questions")

5. **Transcript persistence:** Save analyzed transcripts locally so the intern can revisit previous assessments

6. **Better error handling:** Display clear error messages when Ollama is unavailable or returns malformed JSON, with a "Try Again" button