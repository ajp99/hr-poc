"use client";

import { ArrowRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { chapters, messages, pad, type ChapterBlock } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button, ButtonLink } from "@/components/ui";
import { VideoPlayer } from "@/components/video-player";
import { notify } from "@/lib/notify";
import { useStore } from "@/lib/store";

export function ChapterView({ chapterId }: { chapterId: number }) {
  const router = useRouter();
  const index = chapters.findIndex((c) => c.id === chapterId);
  const chapter = chapters[index];
  const isLast = index === chapters.length - 1;
  const completed = useStore((s) => !!s.progress.chapters[chapterId]?.completed);
  const videoDone = useStore((s) => !!s.progress.chapters[chapterId]?.videoDone);
  const completeVideo = useStore((s) => s.completeVideo);

  const checkHref = `/chapter/${chapterId}/check/`;
  const prevHref = index === 0 ? "/instructions/" : `/chapter/${chapters[index - 1].id}/`;
  const nextHref = isLast ? "/assessment/" : `/chapter/${chapters[index + 1].id}/`;

  function handleComplete() {
    if (useStore.getState().progress.chapters[chapterId]?.videoDone) return;
    completeVideo(chapterId);
    notify.success(messages.videoDone(chapterId));
    notify.saved();
  }

  return (
    <LearnerShell
      active={`chapter-${chapterId}`}
      guard={(_p, steps) => {
        const step = steps.find((s) => s.id === `chapter-${chapterId}`);
        return step?.status === "locked" ? { href: "/welcome/", message: messages.lockedStep(step.requirement) } : null;
      }}
      footer={
        <FooterBar
          back={<ButtonLink href={prevHref} variant="secondary">Back</ButtonLink>}
          status={
            completed
              ? `Chapter ${pad(chapterId)} complete`
              : videoDone
                ? `Chapter ${pad(chapterId)} of ${pad(chapters.length)} · answer the questions to continue`
                : `Chapter ${pad(chapterId)} of ${pad(chapters.length)} · watch the video to continue`
          }
          action={
            completed ? (
              <Button onClick={() => router.push(nextHref)}>
                {isLast ? "Final assessment" : "Next chapter"}
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={() => router.push(checkHref)} disabled={!videoDone}>
                Check your understanding
                <ArrowRight className="size-4" />
              </Button>
            )
          }
        />
      }
    >
      <PageHeading eyebrow={chapter.eyebrow} title={chapter.title} tone="muted" />

      <div className="mt-12">
        <VideoPlayer chapterId={chapterId} src={chapter.videoSrc} onComplete={handleComplete} />
      </div>

      <article className="mt-14 max-w-5xl">
        {chapter.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </article>
    </LearnerShell>
  );
}

function Block({ block }: { block: ChapterBlock }) {
  switch (block.kind) {
    case "lead":
      return <p className="text-[1.375rem] leading-[1.6] text-ink sm:text-[1.6rem]">{block.text}</p>;
    case "heading":
      return <h2 className="mt-12 text-2xl font-bold text-ink">{block.text}</h2>;
    case "paragraph":
      return <p className="mt-4 text-[1.0625rem] leading-8 text-body">{block.text}</p>;
    case "bullets":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[1.0625rem] leading-7 text-body">
              <span className="mt-[0.7rem] size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "cards":
      return (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {block.cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-line p-8 lg:p-10">
              <p className="eyebrow text-brand">{c.label}</p>
              <div className="mt-6 space-y-5">
                {c.items.map((item) => (
                  <p key={item} className="text-[1.125rem] leading-8 text-body">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "callout":
      return (
        <aside className="mt-10 flex gap-4 rounded-2xl border-l-4 border-brand bg-brand-soft p-6">
          <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <p className="font-semibold text-ink">{block.title}</p>
            <p className="mt-1.5 text-[1.0625rem] leading-7 text-body">{block.text}</p>
          </div>
        </aside>
      );
  }
}
