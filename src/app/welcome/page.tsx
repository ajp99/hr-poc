"use client";

import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { chapters, moduleMeta, pad } from "@/content/module";
import { LearnerShell, PageHeading } from "@/components/learner-shell";
import { ButtonLink } from "@/components/ui";
import { chaptersDone, hasStarted, resumeHref } from "@/lib/steps";
import { useStore } from "@/lib/store";

export default function WelcomePage() {
  const session = useStore((s) => s.session);
  const progress = useStore((s) => s.progress);
  const firstName = session?.profile.name.split(" ")[0] ?? "";
  const started = hasStarted(progress);
  const done = chaptersDone(progress);
  const finished = !!progress.certificateId;

  return (
    <LearnerShell>
      <PageHeading eyebrow={`${moduleMeta.docId} · ${moduleMeta.version} · ${moduleMeta.classification}`} title={`Hi ${firstName}`} />

      <p className="mt-10 max-w-3xl text-[1.375rem] leading-[1.6] text-ink sm:text-[1.6rem]">
        {finished
          ? "You've completed the Code of Conduct module. You can revisit any chapter or view your certificate."
          : started
            ? `Welcome back. You've completed ${done} of ${chapters.length} chapters — pick up right where you left off.`
            : "This module introduces the Truminds Code of Conduct — the standards that guide how we work with each other, our clients and our stakeholders."}
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <OverviewCard label="Watch & read" text={`${chapters.length} chapters, each with a short video and the full text of the Code.`} />
        <OverviewCard label="Assessment" text={`5 questions at the end. ${Math.round(moduleMeta.passMark * 100)}% to pass, with unlimited retries.`} />
        <OverviewCard label="Attest" text="Confirm you'll abide by the Code and receive your completion certificate." />
      </div>

      <h2 className="eyebrow mt-14 text-muted">What you&apos;ll cover</h2>
      <ol className="mt-5 divide-y divide-line rounded-2xl border border-line">
        {chapters.map((c) => {
          const complete = !!progress.chapters[c.id]?.completed;
          return (
            <li key={c.id} className="flex items-start gap-5 px-6 py-5">
              <span className="w-7 pt-0.5 text-[0.9375rem] font-semibold tabular-nums text-brand">{pad(c.id)}</span>
              <div className="flex-1">
                <p className="text-lg font-semibold text-ink">{c.title}</p>
                <p className="mt-1 text-[0.9375rem] text-muted">{c.summary}</p>
              </div>
              {complete ? (
                <CheckCircle2 className="mt-1 size-5 text-success" aria-label="Completed" />
              ) : (
                <Circle className="mt-1 size-5 text-[#cfd2da]" aria-label="Not completed" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <ButtonLink href={started ? resumeHref(progress) : "/instructions/"} size="lg">
          {finished ? "View certificate" : started ? "Resume where you left off" : "Begin with instructions"}
          <ArrowRight className="size-5" />
        </ButtonLink>
      </div>
    </LearnerShell>
  );
}

function OverviewCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-line p-6">
      <p className="eyebrow text-brand">{label}</p>
      <p className="mt-3 text-[1.0625rem] leading-7 text-body">{text}</p>
    </div>
  );
}
