"use client";

import { Download, LogOut, RotateCcw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { messages, moduleMeta } from "@/content/module";
import type { CompletionStatus } from "@/content/mock-employees";
import { Button, ConfirmDialog, Logo } from "@/components/ui";
import { notify } from "@/lib/notify";
import { buildReport, downloadCsv, fmtDate } from "@/lib/report";
import { useStore } from "@/lib/store";

const STATUSES: ("All" | CompletionStatus)[] = ["All", "Not started", "In progress", "Passed", "Completed"];

const statusStyle: Record<CompletionStatus, string> = {
  "Not started": "bg-[#f1f2f5] text-muted",
  "In progress": "bg-warning-soft text-warning",
  Passed: "bg-brand-soft text-brand",
  Completed: "bg-success-soft text-success",
};

export default function AdminPage() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const session = useStore((s) => s.session);
  const learner = useStore((s) => s.learner);
  const progress = useStore((s) => s.progress);
  const signOut = useStore((s) => s.signOut);
  const resetDemo = useStore((s) => s.resetDemo);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) router.replace("/");
    else if (session.role !== "admin") router.replace("/welcome/");
  }, [hydrated, session, router]);

  const rows = useMemo(() => buildReport(learner, progress), [learner, progress]);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (status === "All" || r.status === status) &&
        (!needle ||
          r.name.toLowerCase().includes(needle) ||
          r.employeeId.toLowerCase().includes(needle) ||
          r.department.toLowerCase().includes(needle)),
    );
  }, [rows, q, status]);

  if (!hydrated || session?.role !== "admin") {
    return <div className="min-h-dvh" aria-busy="true" />;
  }

  return (
    <div className="min-h-dvh bg-[#f7f8fa]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <div className="flex items-center gap-5">
            <Logo src={moduleMeta.logoSrc} />
            <span className="hidden h-6 w-px bg-line sm:block" />
            <span className="hidden text-[0.9375rem] font-semibold text-ink sm:block">HR Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted md:block">{session.profile.name}</span>
            <Button
              variant="secondary"
              className="!h-10 !px-4"
              onClick={() => {
                signOut();
                notify.info(messages.signedOut);
                router.replace("/");
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-10 lg:py-14">
        <p className="eyebrow text-muted">
          {moduleMeta.docId} · {moduleMeta.title}
        </p>
        <h1 className="font-display mt-4 text-[2.75rem] text-ink sm:text-[3.5rem]">Completion report</h1>
        <div className="mt-4 h-1 w-28 bg-brand" aria-hidden="true" />

        <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1 lg:max-w-sm">
            <span className="sr-only">Search employees</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input className="input !pl-11" placeholder="Search name, ID or department" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="lg:w-52">
            <span className="sr-only">Filter by status</span>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "All" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3 lg:ml-auto">
            <Button
              variant="secondary"
              onClick={() => setConfirmReset(true)}
              disabled={!learner}
              title={learner ? "Clear the demo learner's progress" : "No demo learner yet"}
            >
              <RotateCcw className="size-4" />
              Reset demo
            </Button>
            <Button
              onClick={() => {
                downloadCsv(filtered);
                notify.success(messages.csvExported(filtered.length));
              }}
              disabled={filtered.length === 0}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          Showing <span className="font-semibold text-ink">{filtered.length}</span> of {rows.length} employees
        </p>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[1080px] text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-line bg-[#fafbfc] text-xs uppercase tracking-[0.1em] text-muted">
                <Th>Employee</Th>
                <Th>Department</Th>
                <Th>Instructions accepted</Th>
                <Th>Status</Th>
                <Th className="text-right">Best score</Th>
                <Th className="text-right">Attempts</Th>
                <Th>Completed on</Th>
                <Th>Certificate ID</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((r) => (
                <tr key={r.employeeId} className={r.isLive ? "bg-brand-soft/50" : "hover:bg-[#fafbfc]"}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap font-semibold text-ink">{r.name}</span>
                      {r.isLive && (
                        <span className="whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-white">
                          Live demo
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted">{r.employeeId}</span>
                  </td>
                  <td className="px-5 py-4 text-body">{r.department}</td>
                  <td className="px-5 py-4 tabular-nums text-body">{fmtDate(r.instructionsAcceptedAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-body">{r.score === null ? "—" : `${r.score}%`}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-body">{r.attempts}</td>
                  <td className="px-5 py-4 tabular-nums text-body">{fmtDate(r.completedAt)}</td>
                  <td className="px-5 py-4 font-mono text-[0.8125rem] text-body">{r.certificateId ?? "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-muted">
                    No employees match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Mock data for the POC. The highlighted row reflects the demo learner&apos;s real progress in this browser.
        </p>
      </main>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title={messages.resetTitle}
        body={messages.resetBody}
        confirmLabel="Reset"
        tone="danger"
        onConfirm={() => {
          resetDemo();
          notify.success(messages.resetDone);
        }}
      />
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3.5 font-semibold ${className}`}>{children}</th>;
}
