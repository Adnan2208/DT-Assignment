## Problem Statement: 

1. A DT psychology intern calls the client supervisor (factory owner, COO, production head)
2. The supervisor talks for 10-15 minutes about how the Fellow is doing
3. The intern manually reads the transcript, extracts behavioral evidence, maps it to a 1-10 rubric, identifies gaps, and writes an assessment

**This manual process takes 45-60 minutes per transcript.** We want to bring it down to 10 minutes by building an AI-assisted analysis tool.

### What You're Building

A web application that takes a supervisor transcript as input, runs it through a local LLM (Ollama), and produces a structured analysis that a psychology intern can review, edit, and finalize.

**The tool does NOT replace the intern's judgment.** It produces a draft analysis that the intern reviews — accepting, rejecting, or editing each finding. The AI suggests; the human decides.


