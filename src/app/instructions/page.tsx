"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { instructions, messages } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button, ButtonLink, Checkbox } from "@/components/ui";
import { notify } from "@/lib/notify";
import { useStore } from "@/lib/store";

export default function InstructionsPage() {
  const router = useRouter();
  const acceptedAt = useStore((s) => s.progress.instructionsAcceptedAt);
  const accept = useStore((s) => s.acceptInstructions);

  const [reachedEnd, setReachedEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const alreadyAccepted = !!acceptedAt;

  // The checkbox only enables once the end of the text has been on screen.
  // Watching a sentinel (rather than scroll math) also covers screens tall enough to show everything at once.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || reachedEnd) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setReachedEnd(true);
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => io.disconnect();
  });

  function next() {
    if (!alreadyAccepted) {
      accept();
      notify.success(messages.instructionsAccepted);
      notify.saved();
    }
    router.push("/chapter/1/");
  }

  const canContinue = alreadyAccepted || (reachedEnd && checked);
  const status = alreadyAccepted
    ? `Accepted on ${new Date(acceptedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`
    : !reachedEnd
      ? instructions.scrollHint
      : !checked
        ? "Tick the box to accept and continue"
        : "Ready to begin Chapter 01";

  return (
    <LearnerShell
      active="instructions"
      footer={
        <FooterBar
          back={<ButtonLink href="/welcome/" variant="secondary">Back</ButtonLink>}
          status={status}
          action={
            <Button onClick={next} disabled={!canContinue}>
              Next
              <ArrowRight className="size-4" />
            </Button>
          }
        />
      }
    >
      <PageHeading eyebrow={instructions.eyebrow} title={instructions.title} tone="muted" />
      <p className="mt-10 max-w-4xl text-[1.375rem] leading-[1.6] text-ink sm:text-[1.6rem]">{instructions.lead}</p>

      <div className="mt-12 space-y-10">
        {instructions.sections.map((sec, i) => (
          <section key={sec.heading} className="grid gap-4 md:grid-cols-[3rem_1fr]">
            <span className="text-[0.9375rem] font-semibold tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-xl font-bold text-ink">{sec.heading}</h2>
              <ul className="mt-4 space-y-3">
                {sec.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[1.0625rem] leading-7 text-body">
                    <span className="mt-[0.7rem] size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 max-w-3xl">
        {!reachedEnd && !alreadyAccepted && (
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted" aria-live="polite">
            <ArrowDown className="size-4 animate-bounce" />
            {instructions.scrollHint}
          </p>
        )}
        <Checkbox
          id="accept-instructions"
          checked={alreadyAccepted || checked}
          disabled={alreadyAccepted || !reachedEnd}
          onChange={setChecked}
          label={instructions.acceptLabel}
        />
      </div>
      <div ref={sentinel} className="h-px" aria-hidden="true" />
    </LearnerShell>
  );
}
