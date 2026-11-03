"use client";

import { Check, Lock, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { moduleMeta, messages } from "@/content/module";
import { notify } from "@/lib/notify";
import { getSteps, progressPercent, type Step, type StepId } from "@/lib/steps";
import { useStore, type LearnerProgress } from "@/lib/store";
import { DevBar } from "./dev-bar";
import { Logo } from "./ui";

interface Props {
  /** Highlights the sidebar item; omit for pages outside the step list (Welcome). */
  active?: StepId;
  /**
   * Returns a redirect target if this page shouldn't be reachable yet (e.g. a locked chapter),
   * or null to render. Runs after storage has hydrated.
   */
  guard?: (p: LearnerProgress, steps: Step[]) => { href: string; message?: string } | null;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function LearnerShell({ active, guard, footer, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useStore((s) => s.hydrated);
  const session = useStore((s) => s.session);
  const progress = useStore((s) => s.progress);
  const signOut = useStore((s) => s.signOut);
  const [drawer, setDrawer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = getSteps(progress);
  const pct = progressPercent(progress);
  const blocked = hydrated && session?.role === "learner" && guard ? guard(progress, steps) : null;
  const allowed = hydrated && session?.role === "learner" && !blocked;

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/");
      return;
    }
    if (session.role !== "learner") {
      router.replace("/admin/");
      return;
    }
    if (blocked) {
      if (blocked.message) notify.warning(blocked.message, `guard:${pathname}`);
      router.replace(blocked.href);
    }
  }, [hydrated, session, blocked, router, pathname]);

  // New page → start at the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const activeStep = steps.find((s) => s.id === active);
  const statusLine = activeStep
    ? activeStep.id.startsWith("chapter")
      ? `Chapter ${activeStep.number.slice(0, 2)} of 04`
      : activeStep.label
    : "Welcome";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-8 pb-7 pt-10">
        <Link href="/welcome/" className="inline-block" aria-label="Go to welcome page">
          <Logo src={moduleMeta.logoSrc} />
        </Link>
        <p className="font-display mt-6 text-[2.15rem] text-ink">{moduleMeta.title}</p>
        <p className="mt-2 text-[0.9375rem] text-muted">
          {moduleMeta.docId} · {moduleMeta.classification}
        </p>
      </div>

      <nav aria-label="Module steps" className="flex-1 overflow-y-auto px-5 py-5">
        <ol className="space-y-1">
          {steps.map((s) => (
            <li key={s.id}>
              <SidebarItem
                step={s}
                active={s.id === active}
                onLocked={() => notify.warning(messages.lockedStep(s.requirement), `locked:${s.id}`)}
              />
            </li>
          ))}
        </ol>
      </nav>

      <div className="border-t border-line px-8 py-6">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-muted">Progress</span>
          <span className="text-lg font-semibold text-ink tabular-nums">{pct}%</span>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eceef2]"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Module progress"
        >
          <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-[0.9375rem] text-muted">{statusLine}</p>
        {session && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#f5f6f9] px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{session.profile.name}</p>
              <p className="truncate text-xs text-muted">
                {session.profile.employeeId} · {session.profile.department}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                signOut();
                notify.info(messages.signedOut);
                router.replace("/");
              }}
              className="rounded-full p-2 text-muted hover:bg-white hover:text-ink"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
    <DevBar />
    <div className="flex min-h-0 flex-1 overflow-hidden bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden w-[400px] shrink-0 border-r border-line lg:block xl:w-[445px]">{sidebar}</aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#111318]/40"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-[86%] max-w-[380px] bg-white shadow-xl"
            // Close the drawer when a step link is followed.
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setDrawer(false);
            }}
          >
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-muted hover:bg-[#f5f6f9]"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="-ml-1 rounded-full p-2 text-ink hover:bg-[#f5f6f9]"
            aria-label="Open module menu"
          >
            <Menu className="size-5" />
          </button>
          <Logo src={moduleMeta.logoSrc} className="!h-6" />
          <span className="w-10 text-right text-sm font-semibold tabular-nums text-ink">{pct}%</span>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto" id="main-scroll">
          <main className="mx-auto w-full max-w-[1240px] px-5 pb-16 pt-10 sm:px-10 lg:px-[8%] lg:pt-[7.5rem]">
            {allowed ? children : <PageSkeleton />}
          </main>
        </div>

        {footer && allowed && (
          <footer className="border-t border-line bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1240px] items-center gap-4 px-5 py-4 sm:px-10 lg:px-[8%] lg:py-6">
              {footer}
            </div>
          </footer>
        )}
      </div>
    </div>
    </div>
  );
}

function SidebarItem({ step, active, onLocked }: { step: Step; active: boolean; onLocked: () => void }) {
  const locked = step.status === "locked";
  const done = step.status === "completed";
  const content = (
    <>
      <span
        className={`${step.sub ? "w-10" : "w-7"} shrink-0 text-[0.9375rem] font-semibold tabular-nums ${active ? "text-brand" : "text-[#8d919c]"}`}
      >
        {step.number}
      </span>
      <span className={`flex-1 ${step.sub ? "text-[0.975rem]" : "text-[1.05rem]"} leading-snug ${active ? "font-semibold text-ink" : locked ? "text-[#8d919c]" : "text-body"}`}>
        {step.label}
      </span>
      {done ? (
        <Check className="size-4 shrink-0 text-success" aria-label="Completed" strokeWidth={2.5} />
      ) : locked ? (
        <Lock className="size-3.5 shrink-0 text-[#a3a7b2]" aria-label="Locked" />
      ) : null}
    </>
  );
  const cls = `flex w-full items-center gap-4 rounded-xl py-4 pr-5 text-left transition-colors ${step.sub ? "ml-8 pl-4 !py-3" : "pl-5"} ${
    active ? "bg-brand-soft" : locked ? "hover:bg-[#f7f8fa]" : "hover:bg-[#f5f6f9]"
  }`;

  if (locked) {
    return (
      <button type="button" className={cls} onClick={onLocked} aria-disabled="true">
        {content}
      </button>
    );
  }
  return (
    <Link href={step.href} className={cls} aria-current={active ? "step" : undefined}>
      {content}
    </Link>
  );
}

function PageSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-48 rounded bg-[#eceef2]" />
      <div className="mt-6 h-14 w-3/4 rounded bg-[#eceef2]" />
      <div className="mt-10 h-4 w-full rounded bg-[#f1f2f5]" />
      <div className="mt-3 h-4 w-5/6 rounded bg-[#f1f2f5]" />
    </div>
  );
}

/** Eyebrow + condensed display headline + accent bar, as in the reference screens. */
export function PageHeading({
  eyebrow,
  title,
  tone = "brand",
}: {
  eyebrow: string;
  title: string;
  tone?: "brand" | "muted";
}) {
  return (
    <header>
      <p className={`eyebrow ${tone === "brand" ? "text-brand" : "text-muted"}`}>{eyebrow}</p>
      <h1 className="font-display mt-5 text-[2.75rem] text-ink sm:text-[3.5rem] lg:text-[4.75rem]">{title}</h1>
      <div className="mt-5 h-1 w-32 bg-brand" aria-hidden="true" />
    </header>
  );
}

/** Back · status · primary action — the sticky footer bar from the reference screens. */
export function FooterBar({
  back,
  status,
  action,
}: {
  back?: React.ReactNode;
  status?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <>
      <div className="shrink-0">{back}</div>
      <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 text-center text-[0.9375rem] text-muted sm:flex">
        {status}
      </div>
      <div className="ml-auto shrink-0 sm:ml-0">{action}</div>
    </>
  );
}
