# Changelog

All published changes to the taxonomy and the rubric. The version lives in `taxonomy.yaml`.

## 0.2.0 (2026-10-26)

The rubric now gives two readings: the level and the focus. Prompted by early feedback that it measured technical skill but not how business-minded a person is.

- **Levels renamed** to describe maturity with AI, not roles: AI User, AI-Assisted, AI-Native and AI Leader (were Operator, Practitioner, Engineer and Architect). Each level lists other names people use.
- **New focus axis** from business to tech, with five positions: Business Operator, Business Builder, Product Engineer (the balanced middle), Software Engineer and Architect. No position ranks above another.
- **New dimension**: product and business judgment. Every dimension now belongs to a side (business, tech or both), and the focus comes from the gap between the two sides.
- "Ownership and judgment" is now "Technical ownership".
- Scoring rules for level and focus, shared by the site calculator through `@promptstyles/taxonomy/score`.
- Interview script, scoring guidance and the preparation guide mention the focus the role needs.

## 0.1.0 (2026-10-25)

First public draft.

- Eight styles: declarative, imperative, vibe coding, spec-driven development, test-driven prompting, example-based (few-shot), iterative / conversational and context engineering.
- Every style shows a prompt for the same feature (a home page image carousel).
- Origins checked against primary sources where they exist.
- Rubric with four levels (Operator, Practitioner, Engineer, Architect), five dimensions, a 65-minute interview script and a preparation guide for candidates.

## Candidates for 0.2

Open for discussion. Use the proposal form to weigh in.

- **Plan-first** (ask the model for a plan, review it, then let it implement). Notable milestones: Aider's architect mode (2024-09-26, https://aider.chat/2024/09/26/architect.html), Cline's Plan/Act modes (v3.2.0, January 2025) and the plan mode in Claude Code (mid-2025). No single origin.
- **Agentic delegation** (handing a whole task to an autonomous agent with goals, limits and checkpoints, then reviewing the result).
