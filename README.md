# Truminds — Code of Conduct e-learning (POC)

A static, clickable proof of concept of the **Code of Conduct (TSS-HR-004)** training module: instructions, four video chapters, a final assessment, attestation and a completion certificate — plus a mock HR completion report.

No backend. Progress is saved in the browser's `localStorage`.

## Stack

Next.js 16 (App Router, `output: "export"`) · TypeScript · Tailwind CSS v4 · Zustand (persisted) · Sonner (toasts) · Radix Dialog · lucide-react · Anton + Inter (self-hosted via Fontsource)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

### Deploy on Vercel

Import the repo in Vercel → framework **Next.js** → deploy. No environment variables needed.

## Add your assets

| File | Path | Notes |
|---|---|---|
| Video | `public/videos/coc.mp4` | One file is reused by all 4 chapters for the POC. **Keep it under 100 MB** (GitHub's file limit). Encode with `-movflags +faststart` so it starts playing before it fully downloads. |
| Logo | `public/truminds-logo.svg` | Until it exists, a drawn swoosh + "TRUMINDS" wordmark is shown. Different name/format? Change `moduleMeta.logoSrc` in `src/content/module.ts`. |

## Demo script (≈5 min)

1. Open `/?demo=1` — presenter mode adds a **Skip video (demo)** button on chapters. (`?demo=0` turns it off.)
2. Sign in as **Learner** with any name and an ID like `TSS2001`.
3. Welcome → **Begin with instructions**. The checkbox only enables after scrolling to the end; ticking it enables **Next**.
4. Chapter 01: try dragging the video scrubber forward — it snaps back with a warning toast. Let it finish (or skip) → Chapter 02 unlocks.
5. Click a locked step in the sidebar → "Complete … to unlock this step" toast.
6. Finish chapters 02–04 → **Final assessment** unlocks. Answer wrongly once to show the fail/review/retry flow (questions reshuffle), then pass with 4/5 or 5/5.
7. Attest (tick + type your full name) → certificate with a unique ID. **Download PDF** is a placeholder.
8. Sign out → sign in as **HR Admin** → completion report. The highlighted *Live demo* row is your run. Try search, status filter, **Export CSV** and **Reset demo**.

## Where things live

```
src/
  content/module.ts          ← all copy: chapters, instructions, 5 questions, pass mark, signatory, toast messages
  content/mock-employees.ts  ← seeded HR report rows
  lib/store.ts               ← persisted state (session, learner, progress, attempts, attestation)
  lib/steps.ts               ← step unlock rules + progress %
  lib/notify.ts              ← toast helpers (throttling, "Progress saved")
  components/learner-shell.tsx  ← sidebar, guards, sticky footer
  components/video-player.tsx   ← watch-to-complete, no skip-ahead, resume, milestones
  app/…                      ← one folder per route
docs/PRD.md                  ← requirements and scope
```

Editing content never requires touching UI components — change `src/content/module.ts`.

## Routes

`/` sign-in · `/welcome` · `/instructions` · `/chapter/1…4` · `/assessment` · `/result` · `/attest` · `/certificate` · `/admin`

## Known POC limits

- Mock sign-in (no password); progress is per browser/device.
- HR report rows other than the live demo learner are fake.
- Certificate PDF export is a placeholder.
- Skip-ahead blocking is a UX control, not tamper-proof (a determined user can edit `localStorage`). A production build would verify completion server-side.
