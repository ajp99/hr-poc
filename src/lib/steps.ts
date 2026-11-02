import { chapters, moduleMeta, pad } from "@/content/module";
import type { LearnerProgress } from "./store";

export type StepId = "instructions" | `chapter-${number}` | "assessment" | "attestation" | "certificate";
export type StepStatus = "locked" | "available" | "completed";

export interface Step {
  id: StepId;
  number: string;
  label: string;
  href: string;
  status: StepStatus;
  /** Shown in the "locked" toast: "Complete {requirement} to unlock this step". */
  requirement: string;
  /** Counts toward the progress bar. */
  counts: boolean;
}

export function chaptersDone(p: LearnerProgress) {
  return chapters.filter((c) => p.chapters[c.id]?.completed).length;
}

export function getSteps(p: LearnerProgress): Step[] {
  const steps: Step[] = [];
  const accepted = !!p.instructionsAcceptedAt;

  steps.push({
    id: "instructions",
    number: "00",
    label: "Instructions",
    href: "/instructions/",
    status: accepted ? "completed" : "available",
    requirement: "",
    counts: true,
  });

  chapters.forEach((c, i) => {
    const prevDone = i === 0 ? accepted : !!p.chapters[chapters[i - 1].id]?.completed;
    const done = !!p.chapters[c.id]?.completed;
    steps.push({
      id: `chapter-${c.id}`,
      number: pad(c.id),
      label: c.title,
      href: `/chapter/${c.id}/`,
      status: done ? "completed" : prevDone ? "available" : "locked",
      requirement: i === 0 ? "the Instructions" : `Chapter ${pad(chapters[i - 1].id)}`,
      counts: true,
    });
  });

  const allChapters = chaptersDone(p) === chapters.length;
  steps.push({
    id: "assessment",
    number: "A",
    label: "Final assessment",
    href: p.passedAt ? "/result/" : "/assessment/",
    status: p.passedAt ? "completed" : allChapters ? "available" : "locked",
    requirement: "all four chapters",
    counts: true,
  });

  steps.push({
    id: "attestation",
    number: "B",
    label: "Attestation",
    href: "/attest/",
    status: p.attestation ? "completed" : p.passedAt ? "available" : "locked",
    requirement: `the assessment with ${Math.round(moduleMeta.passMark * 100)}% or more`,
    counts: true,
  });

  steps.push({
    id: "certificate",
    number: "C",
    label: "Certificate",
    href: "/certificate/",
    status: p.certificateId ? "completed" : "locked",
    requirement: "the attestation",
    counts: false,
  });

  return steps;
}

export function progressPercent(p: LearnerProgress) {
  const steps = getSteps(p).filter((s) => s.counts);
  const done = steps.filter((s) => s.status === "completed").length;
  return Math.round((done / steps.length) * 100);
}

/** Where "Resume" should take the learner: the first step that is available but not done. */
export function resumeHref(p: LearnerProgress) {
  const steps = getSteps(p);
  const next = steps.find((s) => s.status === "available");
  if (next) return next.href;
  return p.certificateId ? "/certificate/" : "/instructions/";
}

export function hasStarted(p: LearnerProgress) {
  return !!p.instructionsAcceptedAt;
}
