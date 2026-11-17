# Petropolis Work Engine

Interactive concept demo for a pet-care task dispatch system. Built to support a 60–90 second sales walkthrough showing how Goose-style reservations become prioritized staff tasks.

> **Interactive Concept Demo** — mock data and local React state only. No live Goose, Slack, or AWS integrations.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Lucide icons + shadcn-style UI primitives
- Recharts
- Deployable to Vercel

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

Use Node.js **20.9+**.

## Walkthrough

1. Open **Operations** for KPIs, live queue, staff, and completion chart.
2. Use **Watch Demo** for the guided 6-step flow.
3. Visit **Task Generator** → Simulate New Check-In.
4. Open **Priority Engine** → Run Dispatch.
5. Use **Slack Simulator** to Start/Complete tasks and clock actions.
6. Adjust assignments in **Manager Admin**.
7. Review **Phase 1 Architecture** for the production integration story.

## Deploy

Push to GitHub and import the repo in Vercel, or run:

```bash
npx vercel
```
