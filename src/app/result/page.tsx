"use client";

import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { messages, moduleMeta, questions } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button } from "@/components/ui";
import { notify } from "@/lib/notify";
import { LETTERS } from "@/lib/quiz";
import { useStore } from "@/lib/store";

export default function ResultPage() {
  const router = useRouter();
  const attempts = useStore((s) => s.progress.attempts);
  const passedAt = useStore((s) => s.progress.passedAt);
  const attested = useStore((s) => !!s.progress.attestation);

  // After a pass, review the passing attempt; otherwise the latest one.
  const passing = attempts.find((a) => a.score / a.total >= moduleMeta.passMark);
  const attempt = passing ?? attempts[attempts.length - 1];
  const attemptIndex = attempt ? attempts.indexOf(attempt) + 1 : 0;
  const pct = attempt ? Math.round((attempt.score / attempt.total) * 100) : 0;
  const passed = !!passedAt;

  function retry() {
    notify.info(messages.retry);
    router.push("/assessment/");
  }

  return (
    <LearnerShell
      active="assessment"
      guard={(p) => (p.attempts.length === 0 ? { href: "/assessment/" } : null)}
      footer={
        <FooterBar
          status={`Attempt ${attemptIndex} · ${attempt?.score ?? 0} of ${attempt?.total ?? 0} correct`}
          action={
            passed ? (
              <Button onClick={() => router.push(attested ? "/certificate/" : "/attest/")}>
                {attested ? "View certificate" : "Continue to attestation"}
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={retry}>
                <RotateCcw className="size-4" />
                Retry assessment
              </Button>
            )
          }
        />
      }
    >
      {attempt && (
        <>
          <PageHeading eyebrow={`Final assessment · Attempt ${attemptIndex}`} title={passed ? "You passed" : "Not quite yet"} />

          <div
            className={`mt-12 flex flex-col gap-6 rounded-2xl border p-8 sm:flex-row sm:items-center ${
              passed ? "border-success/40 bg-success-soft" : "border-danger/30 bg-danger-soft"
            }`}
          >
            <p className={`font-display text-[4.5rem] ${passed ? "text-success" : "text-danger"}`}>{pct}%</p>
            <div className="sm:ml-4">
              <p className="text-xl font-bold text-ink">
                {attempt.score} of {attempt.total} correct · {Math.round(moduleMeta.passMark * 100)}% needed
              </p>
              <p className="mt-1.5 text-[1.0625rem] text-body">
                {passed
                  ? "Well done. Review your answers below, then complete your attestation."
                  : "Review the answers below, then retry. Questions and options will be reshuffled."}
              </p>
            </div>
          </div>

          <h2 className="eyebrow mt-14 text-muted">Answer review</h2>
          <ol className="mt-6 space-y-10">
            {attempt.order.map((qid, i) => {
              const q = questions.find((x) => x.id === qid);
              if (!q) return null;
              const chosen = attempt.answers[qid];
              const right = chosen === q.correctOptionId;
              return (
                <li key={qid} className="rounded-2xl border border-line p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-full ${
                        right ? "bg-success text-white" : "bg-danger text-white"
                      }`}
                      aria-label={right ? "Correct" : "Incorrect"}
                    >
                      {right ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-muted">Question {i + 1}</p>
                      <p className="mt-2 text-xl font-bold leading-snug text-ink">{q.prompt}</p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3 sm:pl-11">
                    {q.options.map((o, oi) => {
                      const isCorrect = o.id === q.correctOptionId;
                      const isChosen = o.id === chosen;
                      return (
                        <li
                          key={o.id}
                          className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 ${
                            isCorrect
                              ? "border-success bg-success-soft"
                              : isChosen
                                ? "border-danger/60 bg-danger-soft"
                                : "border-line"
                          }`}
                        >
                          <span className="w-4 text-sm font-semibold text-muted">{LETTERS[oi]}</span>
                          <span className="flex-1 text-[1.0625rem] text-body">{o.text}</span>
                          {isChosen && (
                            <span className={`text-xs font-semibold uppercase tracking-wider ${isCorrect ? "text-success" : "text-danger"}`}>
                              Your answer
                            </span>
                          )}
                          {isCorrect && !isChosen && (
                            <span className="text-xs font-semibold uppercase tracking-wider text-success">Correct answer</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-5 text-[1rem] leading-7 text-body sm:pl-11">
                    <span className="font-semibold text-ink">Why: </span>
                    {q.explanation}
                  </p>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </LearnerShell>
  );
}
