import { moduleMeta } from "@/content/module";
import { mockEmployees, type CompletionStatus, type ReportRow } from "@/content/mock-employees";
import { chaptersDone } from "./steps";
import type { LearnerProgress, Profile } from "./store";

export function liveRow(learner: Profile, p: LearnerProgress): ReportRow {
  const best = p.attempts.reduce<number | null>((m, a) => {
    const pct = Math.round((a.score / a.total) * 100);
    return m === null ? pct : Math.max(m, pct);
  }, null);
  let status: CompletionStatus = "Not started";
  if (p.attestation) status = "Completed";
  else if (p.passedAt) status = "Passed";
  else if (p.instructionsAcceptedAt || chaptersDone(p) > 0) status = "In progress";

  return {
    name: learner.name,
    employeeId: learner.employeeId,
    department: learner.department,
    instructionsAcceptedAt: p.instructionsAcceptedAt,
    status,
    score: best,
    attempts: p.attempts.length,
    completedAt: p.attestation?.at ?? null,
    certificateId: p.certificateId,
    isLive: true,
  };
}

export function buildReport(learner: Profile | null, p: LearnerProgress): ReportRow[] {
  const rows = mockEmployees.filter((m) => !learner || m.employeeId !== learner.employeeId);
  return learner ? [liveRow(learner, p), ...rows] : rows;
}

export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

function csvCell(v: string | number | null) {
  const s = v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: ReportRow[]) {
  const header = [
    "Name",
    "Employee ID",
    "Department",
    "Instructions accepted",
    "Status",
    "Best score (%)",
    "Attempts",
    "Completed on",
    "Certificate ID",
  ];
  const lines = rows.map((r) =>
    [
      r.name,
      r.employeeId,
      r.department,
      r.instructionsAcceptedAt ?? "",
      r.status,
      r.score,
      r.attempts,
      r.completedAt ?? "",
      r.certificateId ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function downloadCsv(rows: ReportRow[]) {
  const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${moduleMeta.docId}-completion-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
