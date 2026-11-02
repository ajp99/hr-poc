"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { messages, moduleMeta, questions } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button, ButtonLink, ConfirmDialog } from "@/components/ui";
import { notify } from "@/lib/notify";
import { buildAttempt, LETTERS, scoreAnswers } from "@/lib/quiz";
import { useStore } from "@/lib/store";

export default function AssessmentPage() {
  const router = useRouter();
  const attemptNo = useStore((s) => s.progress.attempts.length) + 1;
  const recordAttempt = useStore((s) => s.recordAttempt);

  // Shuffled once per visit; a retry is a new visit, so it reshuffles.
  const [quiz] = useState(buildAttempt);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);

  const answered = Object.keys(answers).length;
  const total = questions.length;
  const allAnswered = answered === total;

  function submit() {
    const score = scoreAnswers(answers);
    const pct = Math.round((score / total) * 100);
    recordAttempt({
      at: new Date().toISOString(),
      score,
      total,
      order: quiz.map((q) => q.id),
      answers,
    });
    if (score / total >= moduleMeta.passMark) notify.success(messages.passed(pct));
    else if (score === Math.ceil(total * moduleMeta.passMark) - 1) notify.warning(messages.nearMiss(pct));
    else notify.error(messages.failed(pct));
    notify.saved();
    router.push("/result/");
  }

  return (
    <LearnerShell
      active="assessment"
      guard={(p, steps) => {
        if (p.passedAt) return { href: "/result/" };
        const step = steps.find((s) => s.id === "assessment");
        return step?.status === "locked" ? { href: "/welcome/", message: messages.lockedStep(step.requirement) } : null;
      }}
      footer={
        <FooterBar
          back={<ButtonLink href="/chapter/4/" variant="secondary">Back</ButtonLink>}
          status={
            <span>
              <span className="font-semibold text-ink tabular-nums">{answered}</span> of {total} answered
              {attemptNo > 1 && <span className="ml-3 text-muted">· Attempt {attemptNo}</span>}
            </span>
          }
          action={
            <Button onClick={() => setConfirm(true)} disabled={!allAnswered}>
              Submit answers
              <Send className="size-4" />
            </Button>
          }
        />
      }
    >
      <PageHeading eyebrow={`Final assessment · ${total} questions`} title="Check your understanding" />
      <p className="mt-10 max-w-4xl text-[1.25rem] leading-[1.6] text-ink">
        Answer all {total} questions, then submit. You need {Math.round(moduleMeta.passMark * 100)}% (
        {Math.ceil(total * moduleMeta.passMark)} of {total}) to pass. You can retry as many times as you need.
      </p>

      <ol className="mt-14 space-y-16">
        {quiz.map((q, qi) => (
          <li key={q.id}>
            <fieldset>
              <legend className="w-full">
                <span className="eyebrow text-muted">
                  Question {qi + 1} of {total}
                </span>
                <span className="mt-3 block text-[1.5rem] font-bold leading-snug text-ink sm:text-[1.875rem]">{q.prompt}</span>
              </legend>
              <div className="mt-7 space-y-4" role="radiogroup">
                {q.options.map((o, oi) => {
                  const selected = answers[q.id] === o.id;
                  return (
                    <label
                      key={o.id}
                      className={`relative flex cursor-pointer items-center gap-6 rounded-xl border-2 px-7 py-6 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                        selected ? "border-brand bg-brand-soft" : "border-line hover:border-[#c9ccd6] hover:bg-[#fafbfc]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={o.id}
                        checked={selected}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                        // Sized to the label (not sr-only) so focusing it scrolls to the option itself, not a stray 1px box.
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <span className={`w-4 text-[0.9375rem] font-semibold ${selected ? "text-brand" : "text-muted"}`}>{LETTERS[oi]}</span>
                      <span className={`text-[1.1875rem] leading-snug sm:text-[1.375rem] ${selected ? "font-medium text-ink" : "text-body"}`}>{o.text}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={messages.submitTitle}
        body={messages.submitBody}
        confirmLabel="Submit"
        onConfirm={submit}
      />
    </LearnerShell>
  );
}
