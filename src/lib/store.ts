"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { chapters, moduleMeta } from "@/content/module";

export type Role = "learner" | "admin";

export interface Profile {
  name: string;
  employeeId: string;
  department: string;
}

export interface ChapterProgress {
  completed: boolean;
  completedAt: string | null;
  /** Furthest point reached on first viewing (seconds). Seeking beyond it is blocked until completed. */
  maxTime: number;
  /** Resume position (seconds). */
  position: number;
  /** Milestone toasts already shown (50, 90). */
  milestones: number[];
}

export interface Attempt {
  at: string;
  score: number; // correct answers
  total: number;
  /** Question ids in the order they were shown. */
  order: string[];
  answers: Record<string, string>;
}

export interface LearnerProgress {
  instructionsAcceptedAt: string | null;
  chapters: Record<number, ChapterProgress>;
  attempts: Attempt[];
  passedAt: string | null;
  attestation: { fullName: string; at: string } | null;
  certificateId: string | null;
}

interface State {
  hydrated: boolean;
  session: { role: Role; profile: Profile } | null;
  /** The demo learner — kept separately so an HR sign-in doesn't wipe it. */
  learner: Profile | null;
  progress: LearnerProgress;
  demo: boolean;

  setHydrated: () => void;
  signIn: (role: Role, profile: Profile) => void;
  signOut: () => void;
  setDemo: (on: boolean) => void;
  acceptInstructions: () => void;
  updateVideo: (chapter: number, patch: Partial<Pick<ChapterProgress, "maxTime" | "position">>) => void;
  addMilestone: (chapter: number, milestone: number) => void;
  completeChapter: (chapter: number) => void;
  recordAttempt: (attempt: Attempt) => void;
  attest: (fullName: string) => void;
  resetDemo: () => void;
}

const emptyChapter = (): ChapterProgress => ({
  completed: false,
  completedAt: null,
  maxTime: 0,
  position: 0,
  milestones: [],
});

export const emptyProgress = (): LearnerProgress => ({
  instructionsAcceptedAt: null,
  chapters: Object.fromEntries(chapters.map((c) => [c.id, emptyChapter()])),
  attempts: [],
  passedAt: null,
  attestation: null,
  certificateId: null,
});

const now = () => new Date().toISOString();

function makeCertificateId() {
  const year = new Date().getFullYear();
  // Start above the seeded mock IDs so the live learner never collides with them.
  const seq = 100 + Math.floor(Math.random() * 900);
  return `${moduleMeta.certificatePrefix}-${year}-${String(seq).padStart(5, "0")}`;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      session: null,
      learner: null,
      progress: emptyProgress(),
      demo: false,

      setHydrated: () => set({ hydrated: true }),

      signIn: (role, profile) => {
        if (role === "admin") {
          set({ session: { role, profile } });
          return;
        }
        const prev = get().learner;
        const sameLearner = prev && prev.employeeId.toLowerCase() === profile.employeeId.toLowerCase();
        set({
          session: { role, profile },
          learner: profile,
          // A different employee ID starts a fresh run of the module.
          progress: sameLearner ? get().progress : emptyProgress(),
        });
      },

      signOut: () => set({ session: null }),

      setDemo: (on) => set({ demo: on }),

      acceptInstructions: () =>
        set((s) => ({
          progress: { ...s.progress, instructionsAcceptedAt: s.progress.instructionsAcceptedAt ?? now() },
        })),

      updateVideo: (chapter, patch) =>
        set((s) => {
          const cur = s.progress.chapters[chapter] ?? emptyChapter();
          return {
            progress: {
              ...s.progress,
              chapters: { ...s.progress.chapters, [chapter]: { ...cur, ...patch } },
            },
          };
        }),

      addMilestone: (chapter, milestone) =>
        set((s) => {
          const cur = s.progress.chapters[chapter] ?? emptyChapter();
          if (cur.milestones.includes(milestone)) return s;
          return {
            progress: {
              ...s.progress,
              chapters: {
                ...s.progress.chapters,
                [chapter]: { ...cur, milestones: [...cur.milestones, milestone] },
              },
            },
          };
        }),

      completeChapter: (chapter) =>
        set((s) => {
          const cur = s.progress.chapters[chapter] ?? emptyChapter();
          if (cur.completed) return s;
          return {
            progress: {
              ...s.progress,
              chapters: {
                ...s.progress.chapters,
                [chapter]: { ...cur, completed: true, completedAt: now() },
              },
            },
          };
        }),

      recordAttempt: (attempt) =>
        set((s) => {
          const passed = attempt.score / attempt.total >= moduleMeta.passMark;
          return {
            progress: {
              ...s.progress,
              attempts: [...s.progress.attempts, attempt],
              passedAt: s.progress.passedAt ?? (passed ? attempt.at : null),
            },
          };
        }),

      attest: (fullName) =>
        set((s) => ({
          progress: {
            ...s.progress,
            attestation: { fullName, at: now() },
            certificateId: s.progress.certificateId ?? makeCertificateId(),
          },
        })),

      resetDemo: () => set({ progress: emptyProgress() }),
    }),
    {
      name: "truminds-coc-poc",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated after mount by <StoreHydrator/> so the first client render matches the static HTML.
      skipHydration: true,
      partialize: (s) => ({
        session: s.session,
        learner: s.learner,
        progress: s.progress,
        demo: s.demo,
      }),
      // Mark hydrated even if storage was empty or unavailable, so guards never hang.
      onRehydrateStorage: () => () => {
        useStore.setState({ hydrated: true });
      },
    },
  ),
);
