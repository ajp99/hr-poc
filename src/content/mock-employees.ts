/** Seeded rows for the HR report. Purely fictional — replaced by real records once a backend exists. */

export type CompletionStatus = "Not started" | "In progress" | "Passed" | "Completed";

export interface ReportRow {
  name: string;
  employeeId: string;
  department: string;
  instructionsAcceptedAt: string | null;
  status: CompletionStatus;
  score: number | null; // best score, %
  attempts: number;
  completedAt: string | null;
  certificateId: string | null;
  isLive?: boolean;
}

export const departments = [
  "Engineering",
  "Quality Assurance",
  "Product & Design",
  "Human Resources",
  "Finance",
  "Sales & Marketing",
  "Operations",
];

export const mockEmployees: ReportRow[] = [
  { name: "Riya Sharma", employeeId: "TSS1021", department: "Engineering", instructionsAcceptedAt: "2026-10-05T10:12:00+05:30", status: "Completed", score: 100, attempts: 1, completedAt: "2026-10-05T11:02:00+05:30", certificateId: "TSS-COC-2026-00011" },
  { name: "Arjun Mehta", employeeId: "TSS1034", department: "Engineering", instructionsAcceptedAt: "2026-10-06T09:40:00+05:30", status: "Completed", score: 80, attempts: 2, completedAt: "2026-10-06T10:55:00+05:30", certificateId: "TSS-COC-2026-00012" },
  { name: "Neha Kapoor", employeeId: "TSS1047", department: "Quality Assurance", instructionsAcceptedAt: "2026-10-07T14:05:00+05:30", status: "In progress", score: null, attempts: 0, completedAt: null, certificateId: null },
  { name: "Vikram Singh", employeeId: "TSS1052", department: "Product & Design", instructionsAcceptedAt: null, status: "Not started", score: null, attempts: 0, completedAt: null, certificateId: null },
  { name: "Ananya Iyer", employeeId: "TSS1063", department: "Human Resources", instructionsAcceptedAt: "2026-10-08T12:20:00+05:30", status: "Completed", score: 100, attempts: 1, completedAt: "2026-10-08T13:10:00+05:30", certificateId: "TSS-COC-2026-00015" },
  { name: "Rahul Verma", employeeId: "TSS1078", department: "Finance", instructionsAcceptedAt: "2026-10-09T16:30:00+05:30", status: "Passed", score: 80, attempts: 3, completedAt: null, certificateId: null },
  { name: "Pooja Nair", employeeId: "TSS1081", department: "Sales & Marketing", instructionsAcceptedAt: "2026-10-10T11:00:00+05:30", status: "In progress", score: 60, attempts: 1, completedAt: null, certificateId: null },
  { name: "Karan Malhotra", employeeId: "TSS1095", department: "Operations", instructionsAcceptedAt: null, status: "Not started", score: null, attempts: 0, completedAt: null, certificateId: null },
  { name: "Sneha Reddy", employeeId: "TSS1102", department: "Engineering", instructionsAcceptedAt: "2026-10-12T10:45:00+05:30", status: "Completed", score: 80, attempts: 1, completedAt: "2026-10-12T11:40:00+05:30", certificateId: "TSS-COC-2026-00019" },
  { name: "Aditya Joshi", employeeId: "TSS1117", department: "Quality Assurance", instructionsAcceptedAt: "2026-10-13T15:15:00+05:30", status: "In progress", score: null, attempts: 0, completedAt: null, certificateId: null },
  { name: "Meera Pillai", employeeId: "TSS1123", department: "Product & Design", instructionsAcceptedAt: "2026-10-14T09:30:00+05:30", status: "Completed", score: 100, attempts: 2, completedAt: "2026-10-14T10:35:00+05:30", certificateId: "TSS-COC-2026-00021" },
  { name: "Siddharth Rao", employeeId: "TSS1139", department: "Engineering", instructionsAcceptedAt: null, status: "Not started", score: null, attempts: 0, completedAt: null, certificateId: null },
];
