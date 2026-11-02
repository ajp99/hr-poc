# PRD — Code of Conduct e-learning module (POC)

**Owner:** Ayush (Frontend) · **Stakeholder:** Head of HR · **Status:** POC · **Doc:** TSS-HR-004

## 1. Goal

A working, static frontend demo of the Truminds Code of Conduct training, based on the HR head's reference screens, to approve the experience before any backend work.

## 2. Users

- **Learner** — any employee completing the module.
- **HR Admin** — views completion status across employees.

## 3. Learner flow

Mock sign-in → Welcome → 00 Instructions → Chapters 01–04 → Final assessment → Result → Attestation → Certificate

| Step | Requirement |
|---|---|
| Sign-in | Name, employee ID, department; role toggle Learner / HR Admin. No password. A different employee ID starts a fresh run. |
| Welcome | Personal greeting, module overview, list of chapters with completion state, **Resume where you left off** for returning learners. |
| 00 Instructions | How the module works. Checkbox is disabled until the learner scrolls to the end; ticking it enables **Next**. Acceptance time is recorded and shown read-only on revisit. |
| Chapters 01–04 | Why this code exists · What is expected of you · Respect and dignity · Conduct, health and safety. Each: video, then the full chapter text. |
| Video rules | First viewing: no seeking beyond the furthest point watched, no speed-up. Resume position saved. Next step unlocks on `ended`. After completion: free scrubbing. `?demo=1` shows a Skip button. |
| Final assessment | Locked until all chapters are complete. 5 MCQs, question and option order shuffled every attempt. Submit enabled when all answered; confirmation dialog before submit. |
| Result | Score, pass/fail, and a full review (your answer vs correct answer + explanation) on every attempt. ≥ 80% (4/5) passes. Below that: unlimited retries. |
| Attestation | Statement, agreement checkbox, typed full name (must match sign-in name), date. |
| Certificate | Name, employee ID, completion date, unique certificate ID, HR signatory name/title. **Download PDF** is a placeholder for the POC. |

**Navigation:** completed steps stay reachable in the sidebar with no re-gating; locked steps show a toast explaining what to complete first. Direct URLs to locked steps redirect to Welcome.

## 4. HR report (mock)

Table: name, employee ID, department, instructions accepted, status (Not started / In progress / Passed / Completed), best score, attempts, completed on, certificate ID. Search, status filter, CSV export of the filtered rows, **Reset demo** (with confirmation). Seeded mock employees + the live demo learner (highlighted).

## 5. Notifications (top-right toasts)

| Event | Type |
|---|---|
| Signed in / signed out | success / info |
| Instructions accepted — Chapter 01 unlocked | success |
| Video 50% / 90% | info |
| Skip-ahead blocked (throttled) | warning |
| Chapter complete — next unlocked | success |
| Halfway through the chapters | info |
| All chapters complete — Assessment unlocked | success |
| Submit answers? | confirmation dialog |
| Passed with N% | success |
| Near miss (3/5) | warning |
| Failed (≤ 2/5) | error (stays until dismissed) |
| New attempt — questions reshuffled | info |
| Locked step clicked (throttled) | warning |
| Progress saved | subtle, 2 s |
| Attestation recorded / PDF coming soon | success / info |
| CSV exported / Demo data reset | success |

Durations: success & info 4 s, warning 5 s, error sticky. Max 3 visible. All message text lives in `src/content/module.ts`.

## 6. Non-functional

- Fully static (`next build` → `out/`), deployable on Vercel or any static host.
- Light theme only; desktop-first and responsive to phones (sidebar becomes a drawer).
- Keyboard accessible, visible focus, reduced-motion respected.

## 7. Out of scope (POC)

Real authentication, database, server-side completion tracking, PDF generation, email/Teams reminders, multiple languages, LMS/SCORM integration.

## 8. Path to production

Supabase (Auth + Postgres) for users, progress events and certificates; server-side verification of video completion and scoring; PDF generation for certificates; real HR report with date-range filters.
