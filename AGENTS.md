# AGENTS.md — Supervisor Feedback Analyzer (Trinethra Module)

## Project Overview

Build a web app that analyzes supervisor transcripts using Ollama (local LLM) to produce structured Fellow assessments. The intern reviews and edits the AI draft — AI suggests, human decides.

---

## Domain Knowledge (from context.md)

### The Fellow Model

**Two Layers of Work:**
- **Layer 1 — Execution (visible):** Meetings, tracking, follow-ups, data entry, vendor calls, reports, presence
- **Layer 2 — Systems Building (the actual mandate):** SOPs, trackers, dashboards, workflows, accountability structures, documentation that survives the Fellow's departure

**Critical Distinction:** Layer 1 is necessary but not sufficient. Layer 2 is the job. Flag when transcript shows only Layer 1.

**Survivability Test:** If the Fellow left tomorrow, would any system they built continue running?
- Yes → Systems building
- No → Task execution only

### The 8 KPIs

| KPI | Measures | Supervisor Says |
|-----|----------|-----------------|
| Lead Generation | New customers identified/contacted | "finds new schools to partner with" |
| Lead Conversion | Leads → paying customers | "closed 3 new accounts" |
| Upselling | More to existing customers | "ordering bigger quantities" |
| Cross-selling | Additional products to existing | "started supplying packaging too" |
| NPS | Customer satisfaction | "retailers are happier", "fewer complaints" |
| PAT | Profitability | "reduced waste", "costs came down" |
| TAT | Turnaround time | "dispatch is faster", "no missed deadlines" |
| Quality | Defect/rejection/complaint rates | "rejection dropped", "fewer complaints" |

Supervisors never say "KPI." Map their plain language to these categories.

### Rubric (1-10 Scale)

**Need Attention (1-3):**
- 1 Not Interested: disengagement, no effort
- 2 Lacks Discipline: works only when told, no self-initiative
- 3 Motivated but Directionless: enthusiasm + confusion

**Productivity (4-6):**
- 4 Careless and Inconsistent: quality varies
- 5 Consistent Performer: reliable execution, meets standards
- 6 Reliable and Productive: high trust, "I give a task and forget"

**Performance (7-10):**
- 7 Problem Identifier: spots patterns supervisor hadn't noticed
- 8 Problem Solver: identifies AND fixes problems
- 9 Innovative and Experimental: builds new tools/processes, tests approaches
- 10 Exceptional Performer: 9 + flawlessly + others learn from them

**Critical Boundary: 6 vs 7**
- Score 6: executes tasks defined by others ("does everything I give him")
- Score 7: expands scope ("noticed rejection rate goes up on Mondays and started tracking why")

The difference is **initiative direction**. A 6 takes initiative within assigned scope. A 7 expands the scope.

### 4 Assessment Dimensions (Gap Analysis)

1. **Driving Execution:** Gets things done on time, follows up without reminders, initiates work
2. **Systems Building:** Created trackers, processes, SOPs, templates that survive departure
3. **KPI Impact:** Work connected to measurable business outcomes
4. **Change Management:** Interacts with floor team, gets people to adopt new processes, handles resistance

**Most Fellows struggle with Change Management.** A 23-year-old asking a 45-year-old operator to fill out a new checklist — power dynamic is inverted, no formal authority. Flag when no change management evidence exists.

### Supervisor Biases to Account For

1. **Helpfulness bias:** "She handles all my calls" sounds like 8, but is 5-6 (task absorption, not systems building)
2. **Presence bias:** "Always on the floor" rated higher than "spends time building trackers"
3. **Halo/horn effect:** one big story colors entire assessment
4. **Recency bias:** remembers last 2 weeks, not full tenure

In prompt: identify when praise describes task absorption vs systems building, or when negative comments mask real systems work.

---

## Sample Transcripts (for Testing)

| Transcript | Expected Score | Trap |
|------------|---------------|------|
| Karthik at Veerabhadra Auto | 6 (signal toward 7) | Supervisor warm/positive; evidence is Layer 1 + one cycle time study; lazy tool gives 8 |
| Meena at Lakshmi Textiles | 7 (change mgmt gap) | Supervisor critical ("too much laptop time"); evidence shows genuine systems building; lazy tool gives 4 |
| Anil at Prabhat Foods | 5-6 (dependency problem) | Glowing review ("right hand"); evidence shows workload absorption; lazy tool gives 9 |

If scores are within ±1, prompt engineering is strong.

---

## Required Output JSON Structure

```json
{
  "score": {
    "value": 6,
    "label": "Reliable and Productive",
    "band": "Productivity",
    "justification": "The supervisor describes strong task execution...",
    "confidence": "low|medium|high"
  },
  "evidence": [
    {
      "quote": "exact quote from transcript",
      "signal": "positive|negative|neutral",
      "dimension": "execution|systems_building|kpi_impact|change_management",
      "interpretation": "what this quote means for scoring, distinguishing Layer 1 vs Layer 2 work"
    }
  ],
  "kpiMapping": [
    {
      "kpi": "Lead Generation|Lead Conversion|Upselling|Cross-selling|NPS|PAT|TAT|Quality",
      "evidence": "transcript excerpt showing this KPI connection",
      "systemOrPersonal": "system|personal"
    }
  ],
  "gaps": [
    {
      "dimension": "execution|systems_building|kpi_impact|change_management",
      "detail": "specific explanation of what's missing or not demonstrated"
    }
  ],
  "followUpQuestions": [
    {
      "question": "specific question to ask supervisor",
      "targetGap": "execution|systems_building|kpi_impact|change_management|problem_identification",
      "lookingFor": "what evidence this question should surface"
    }
  ]
}
```

**All 5 sections must be present.** Format can be adapted but sections are mandatory and must be grounded in transcript content.

---

## Design Challenges (tackle at least 2)

1. **One Prompt or Many?** Single comprehensive prompt vs. multiple focused calls. Consider quality vs. speed tradeoff.
2. **Structured Output Reliability.** Handle messy JSON: strict mode, retry on parse failure, regex fallback, partial results display.
3. **Evidence Linking.** Connect suggested score to specific quotes. Allow user to click quote and see rubric mapping.
4. **Showing Uncertainty.** Prevent automation bias. Design UI so intern treats output as draft, not verdict.
5. **Gap Detection.** Detecting absence (what transcript doesn't say) is harder than extraction. Use reasoning about the 4 dimensions.

---

## Technical Requirements

| Requirement | Detail |
|-------------|--------|
| LLM | Ollama (local). Any model (llama3.2, mistral, phi3, gemma). No cloud APIs. |
| Frontend | Any framework (React, Vue, Svelte, vanilla). Browser-based. |
| Backend | Any language (Node/Express, Python/FastAPI, Go). |
| Runs locally | No deployment required. README with setup instructions. |
| Git history | Incremental commits showing thinking process. |

---

## What to Build

### Input
- Text area for pasting supervisor transcript
- "Run Analysis" button

### Processing (Backend)
- Send transcript to Ollama at `http://localhost:11434/api/generate`
- Extract structured analysis using domain knowledge from this file

### Output (Frontend)
- Display analysis in clean, usable interface
- Non-technical psychology intern must understand it

### Expected Analysis Sections
1. **Extracted Evidence** — quotes tagged as positive/negative/neutral, mapped to dimension
2. **Rubric Score** — 1-10 with justification citing evidence
3. **KPI Mapping** — which KPIs the Fellow's work connects to
4. **Gap Analysis** — which dimensions NOT covered in transcript
5. **Follow-up Questions** — 3-5 questions targeting specific gaps

---

## Prompt Engineering Requirements

Your Ollama prompt must:
- Include the full Fellow model (Layer 1 vs Layer 2, Survivability Test)
- Include the 8 KPIs with plain-language examples
- Include the 1-10 rubric with score boundaries
- Include the 4 assessment dimensions
- Instruct to identify supervisor biases (helpfulness, presence, halo, recency)
- Instruct on the 6 vs 7 critical boundary
- Distinguish task absorption from systems building
- Return valid JSON matching the required structure
- Generate gap-aware follow-up questions

---

## Testing Checklist

Run analysis on all 3 sample transcripts:
- [ ] Karthik: score should be 5-7 (not 8+)
- [ ] Meena: score should be 6-8 (not 4 or 9+)
- [ ] Anil: score should be 5-6 (not 8+)

If any score is wrong by more than ±1, iterate on your prompt.