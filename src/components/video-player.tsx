"use client";

import { FastForward, RotateCcw, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { messages } from "@/content/module";
import { notify } from "@/lib/notify";
import { useStore } from "@/lib/store";

interface Props {
  chapterId: number;
  src: string;
  /** Called once when the video ends on its first viewing (or via demo skip). */
  onComplete: () => void;
}

/** Tolerance (s) between the furthest point watched and a seek target before we treat it as skipping ahead. */
const SEEK_TOLERANCE = 1;

export function VideoPlayer({ chapterId, src, onComplete }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const demo = useStore((s) => s.demo);
  const completed = useStore((s) => !!s.progress.chapters[chapterId]?.videoDone);
  const updateVideo = useStore((s) => s.updateVideo);
  const addMilestone = useStore((s) => s.addMilestone);

  const [missing, setMissing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Mutable mirrors so the media event handlers always see fresh values without re-binding.
  const maxTime = useRef(0);
  const lastSave = useRef(0);
  const restoring = useRef(false);
  const completedRef = useRef(completed);
  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  // Reset per chapter / per source.
  useEffect(() => {
    const p = useStore.getState().progress.chapters[chapterId];
    maxTime.current = p?.maxTime ?? 0;
  }, [chapterId, src, reloadKey]);

  // A <video> that failed before hydration never fires onError — check its state on mount.
  useEffect(() => {
    const v = ref.current;
    if (v && v.error) setMissing(true);
  }, [reloadKey]);

  // No background playback: pause when the tab is hidden, the window loses focus, or the page is left.
  // Playback is never resumed automatically — the user presses play again.
  useEffect(() => {
    const v = ref.current;
    const pause = () => ref.current?.pause();
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", pause);
    window.addEventListener("pagehide", pause);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", pause);
      window.removeEventListener("pagehide", pause);
      v?.pause();
    };
  }, [reloadKey]);

  // Save the resume point when leaving the page.
  useEffect(() => {
    const v = ref.current;
    return () => {
      if (v && !Number.isNaN(v.currentTime) && v.currentTime > 0) {
        updateVideo(chapterId, { position: v.currentTime, maxTime: maxTime.current });
      }
    };
  }, [chapterId, updateVideo]);

  function handleLoaded() {
    const v = ref.current;
    if (!v) return;
    const p = useStore.getState().progress.chapters[chapterId];
    const resumeAt = p?.position ?? 0;
    if (resumeAt > 0 && resumeAt < v.duration - 1) {
      restoring.current = true;
      v.currentTime = resumeAt;
    }
  }

  function handleTimeUpdate() {
    const v = ref.current;
    if (!v || !v.duration) return;
    const t = v.currentTime;

    if (!completedRef.current) {
      // Normal playback advances the high-water mark; jumps are handled in onSeeking.
      if (t > maxTime.current && t - maxTime.current <= SEEK_TOLERANCE + 0.5) maxTime.current = t;

      const pct = (maxTime.current / v.duration) * 100;
      const chapter = useStore.getState().progress.chapters[chapterId];
      if (pct >= 50 && !chapter?.milestones.includes(50)) {
        addMilestone(chapterId, 50);
        notify.info(messages.videoHalf(chapterId));
      }
      if (pct >= 90 && !chapter?.milestones.includes(90)) {
        addMilestone(chapterId, 90);
        notify.info(messages.videoAlmost(chapterId));
      }
    }

    // Persist the resume point every few seconds.
    const now = Date.now();
    if (now - lastSave.current > 3000) {
      lastSave.current = now;
      updateVideo(chapterId, { position: t, maxTime: Math.max(maxTime.current, useStore.getState().progress.chapters[chapterId]?.maxTime ?? 0) });
    }
  }

  function handleSeeking() {
    const v = ref.current;
    if (!v) return;
    if (restoring.current) {
      restoring.current = false;
      return;
    }
    if (completedRef.current) return;
    if (v.currentTime > maxTime.current + SEEK_TOLERANCE) {
      v.currentTime = maxTime.current;
      notify.warning(messages.skipBlocked, "skip-blocked");
    }
  }

  function handleRateChange() {
    // Keep first viewing at normal speed or slower; no fast-forwarding through the content.
    const v = ref.current;
    if (v && !completedRef.current && v.playbackRate > 1) v.playbackRate = 1;
  }

  function handleEnded() {
    if (completedRef.current) return;
    const v = ref.current;
    if (v) updateVideo(chapterId, { position: 0, maxTime: v.duration });
    onComplete();
  }

  function skip() {
    const v = ref.current;
    if (v) v.pause();
    updateVideo(chapterId, { position: 0 });
    onComplete();
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-[#0e1124] shadow-[0_20px_50px_-24px_rgba(20,26,58,0.55)]">
        {missing ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <VideoOff className="size-10 text-[#8e97c9]" />
            <div>
              <p className="text-lg font-semibold">{messages.videoMissing}</p>
              <p className="mt-1 text-sm text-[#b8bfe0]">
                Add the file at <code className="rounded bg-white/10 px-1.5 py-0.5">public{src}</code>
                {demo ? " — or use Skip video below." : ". Add ?demo=1 to the URL to skip in presenter mode."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMissing(false);
                setReloadKey((k) => k + 1);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              <RotateCcw className="size-4" /> Retry
            </button>
          </div>
        ) : (
          <video
            key={`${src}-${reloadKey}`}
            ref={ref}
            className="aspect-video w-full bg-black"
            src={src}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onLoadedMetadata={handleLoaded}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onRateChange={handleRateChange}
            onEnded={handleEnded}
            onError={() => setMissing(true)}
          >
            Your browser does not support HTML5 video.
          </video>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          {completed
            ? "Video completed — you can rewatch and scrub freely."
            : "Watch to the end to unlock the next step. Skipping ahead is disabled on first viewing."}
        </p>
        {demo && !completed && (
          <button
            type="button"
            onClick={skip}
            className="inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-3.5 py-1.5 font-semibold text-warning hover:bg-[#f9e8c7]"
          >
            <FastForward className="size-4" /> Skip video (demo)
          </button>
        )}
      </div>
    </div>
  );
}
