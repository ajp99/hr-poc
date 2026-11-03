"use client";

import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

/** Temporary dev-only control panel. Delete this file and its use in learner-shell.tsx to remove. */
export function DevBar() {
  const router = useRouter();
  const pathname = usePathname();
  const completeVideo = useStore((s) => s.completeVideo);
  const completeChapter = useStore((s) => s.completeChapter);
  const resetDemo = useStore((s) => s.resetDemo);
  const chapterId = Number(/^\/chapter\/(\d+)\/(?:check\/)?$/.exec(pathname)?.[1]) || null;
  const videoDone = useStore((s) => (chapterId ? !!s.progress.chapters[chapterId]?.videoDone : false));
  const done = useStore((s) => (chapterId ? !!s.progress.chapters[chapterId]?.completed : false));

  const btn =
    "rounded border border-warning/40 bg-white px-2.5 py-1 font-semibold text-warning hover:bg-warning-soft disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex w-full shrink-0 items-center gap-3 border-b border-warning/40 bg-warning-soft px-4 py-1.5 text-xs text-warning">
      <span className="font-bold tracking-wider">DEV</span>
      <button
        type="button"
        className={btn}
        disabled={!chapterId || videoDone}
        title={chapterId ? (videoDone ? "Video already complete" : "Mark this video complete") : "Open a chapter page"}
        onClick={() => chapterId && completeVideo(chapterId)}
      >
        Skip video
      </button>
      <button
        type="button"
        className={btn}
        disabled={!chapterId || done}
        title={chapterId ? (done ? "Chapter already complete" : "Mark this chapter complete") : "Open a chapter page"}
        onClick={() => chapterId && completeChapter(chapterId)}
      >
        Skip questions
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => {
          resetDemo();
          router.push("/welcome/");
        }}
      >
        Reset progress
      </button>
    </div>
  );
}
