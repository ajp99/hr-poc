"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { chapters, messages, pad } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button, ButtonLink } from "@/components/ui";
import { notify } from "@/lib/notify";
import { LETTERS, shuffle } from "@/lib/quiz";
import { chaptersDone } from "@/lib/steps";
import { useStore } from "@/lib/store";

export function CheckView({ chapterId }: { chapterId: number }) {
  const router = useRouter();
  const index = chapters.findIndex((c) => c.id === chapterId);
  const chapter = chapters[index];
  const isLast = index === chapters.length - 1;
  const completed = useStore((s) => !!s.progress.chapters[chapterId]?.completed);
  const completeChapter = useStore((s) => s.completeChapter);

  // Option order is shuffled once per visit.
  const [checks] = useState(() => chapter.checks.map((q) => ({ ...q, options: shuffle(q.options) })));
  const [correct, setCorrect] = useState<Record<string, true>>({});
  const [wrong, setWrong] = useState<Record<string, string[]>>({});

  const total = checks.length;
  // A completed chapter is shown as a read-only review with every answer revealed.
  const isRight = (id: string) => completed || !!correct[id];
  const rightCount = checks.filter((q) => isRight(q.id)).length;

  useEffect(() => {
    if (completed || rightCount !== total) return;
    completeChapter(chapterId);
    const done = chaptersDone(useStore.getState().progress);
    if (isLast || done === chapters.length) {
      notify.success(messages.allChaptersDone);
    } else {
      notify.success(messages.chapterComplete(chapterId));
      if (done === Math.ceil(chapters.length / 2)) notify.info(messages.modulesHalf);
    }
    notify.saved();
  }, [completed, rightCount, total, completeChapter, chapterId, isLast]);

  function pick(qid: string, optionId: string, correctId: string) {
    if (isRight(qid)) return;
    if (optionId === correctId) {
      setCorrect((c) => ({ ...c, [qid]: true }));
    } else {
      setWrong((w) => ({ ...w, [qid]: [...(w[qid] ?? []), optionId] }));
      notify.warning(messages.checkWrong, `check-wrong:${qid}`);
    }
  }

  const next = chapters[index + 1];
  const nextHref = next ? `/chapter/${next.id}/` : "/assessment/";

  return (
    <LearnerShell
      active={`chapter-${chapterId}-check`}
      guard={(_p, steps) => {
        const step = steps.find((s) => s.id === `chapter-${chapterId}-check`);
        return step?.status === "locked"
          ? { href: `/chapter/${chapterId}/`, message: messages.lockedStep(step.requirement) }
          : null;
      }}
      footer={
        <FooterBar
          back={<ButtonLink href={`/chapter/${chapterId}/`} variant="secondary">Back</ButtonLink>}
          status={
            completed ? (
              `Chapter ${pad(chapterId)} complete`
            ) : (
              <span>
                <span className="font-semibold text-ink tabular-nums">{rightCount}</span> of {total} correct
              </span>
            )
          }
          action={
            <Button onClick={() => router.push(nextHref)} disabled={!completed}>
              {isLast ? "Final assessment" : "Next chapter"}
              <ArrowRight className="size-4" />
            </Button>
          }
        />
      }
    >
      <PageHeading eyebrow={`Chapter ${pad(chapterId)} · Check-in`} title="Check your understanding" tone="muted" />
      <p className="mt-10 max-w-4xl text-[1.25rem] leading-[1.6] text-ink">
        Answer all {total} questions correctly to {next ? `unlock Chapter ${pad(next.id)}` : "unlock the final assessment"}.
        If you pick a wrong answer, you can try again.
      </p>

      <ol className="mt-14 space-y-16">
        {checks.map((q, qi) => {
          const done = isRight(q.id);
          return (
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
                    const isCorrectPick = done && o.id === q.correctOptionId;
                    const isWrongPick = !done && (wrong[q.id] ?? []).includes(o.id);
                    return (
                      <label
                        key={o.id}
                        className={`relative flex items-center gap-6 rounded-xl border-2 px-7 py-6 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                          isCorrectPick
                            ? "border-success bg-success-soft"
                            : isWrongPick
                              ? "border-danger bg-danger-soft"
                              : done
                                ? "border-line opacity-60"
                                : "cursor-pointer border-line hover:border-[#c9ccd6] hover:bg-[#fafbfc]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={o.id}
                          checked={isCorrectPick}
                          disabled={done || isWrongPick}
                          onChange={() => pick(q.id, o.id, q.correctOptionId)}
                          // Sized to the label so focusing it scrolls to the option itself.
                          className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-default"
                        />
                        <span className="w-4 text-[0.9375rem] font-semibold text-muted">{LETTERS[oi]}</span>
                        <span className="flex-1 text-[1.1875rem] leading-snug text-body sm:text-[1.375rem]">{o.text}</span>
                        {isCorrectPick && <Check className="size-5 shrink-0 text-success" aria-label="Correct" strokeWidth={2.5} />}
                        {isWrongPick && <X className="size-5 shrink-0 text-danger" aria-label="Incorrect" strokeWidth={2.5} />}
                      </label>
                    );
                  })}
                </div>
                {(done || (wrong[q.id]?.length ?? 0) > 0) && (
                  <p className={`mt-5 text-[1.0625rem] leading-7 ${done ? "text-success" : "text-body"}`} role="status">
                    {done ? q.explanation : "Not quite — have another look at the chapter and try again."}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
    </LearnerShell>
  );
}
