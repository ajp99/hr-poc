"use client";

import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { messages, moduleMeta } from "@/content/module";
import { departments } from "@/content/mock-employees";
import { notify } from "@/lib/notify";
import { useStore, type Role } from "@/lib/store";
import { Button, Logo } from "@/components/ui";

export default function SignInPage() {
  const router = useRouter();
  const hydrated = useStore((s) => s.hydrated);
  const session = useStore((s) => s.session);

  // Already signed in → skip this screen.
  useEffect(() => {
    if (!hydrated || !session) return;
    router.replace(session.role === "admin" ? "/admin/" : "/welcome/");
  }, [hydrated, session, router]);

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <BrandPanel />
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden">
            <Logo src={moduleMeta.logoSrc} />
            <p className="font-display mt-6 text-5xl text-ink">Code of Conduct</p>
          </div>
          <h2 className="mt-10 text-2xl font-bold text-ink lg:mt-0">Sign in</h2>
          <p className="mt-2 text-[0.9375rem] text-muted">Demo sign-in — no password needed for this POC.</p>
          {/* Mounted once saved data has loaded, so it can pre-fill the last demo learner. */}
          {hydrated && !session ? <SignInForm /> : <div className="mt-8 h-[22rem]" aria-busy="true" />}
        </div>
      </section>
    </div>
  );
}

function SignInForm() {
  const router = useRouter();
  const learner = useStore((s) => s.learner);
  const signIn = useStore((s) => s.signIn);

  const [role, setRole] = useState<Role>("learner");
  const [name, setName] = useState(learner?.name ?? "");
  const [employeeId, setEmployeeId] = useState(learner?.employeeId ?? "");
  const [department, setDepartment] = useState(learner?.department ?? departments[0]);
  const [touched, setTouched] = useState(false);

  const nameErr = name.trim().length < 2 ? "Enter your full name" : "";
  const idErr = !/^[A-Za-z0-9-]{3,12}$/.test(employeeId.trim()) ? "Enter your employee ID (e.g. TSS1234)" : "";
  const valid = !nameErr && !idErr;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const profile = {
      name: name.trim().replace(/\s+/g, " "),
      employeeId: employeeId.trim().toUpperCase(),
      department: role === "admin" ? "Human Resources" : department,
    };
    signIn(role, profile);
    notify.success(messages.signedIn(profile.name.split(" ")[0]));
    router.replace(role === "admin" ? "/admin/" : "/welcome/");
  }

  return (
    <>
      <div role="radiogroup" aria-label="Sign in as" className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-[#f3f4f7] p-1.5">
        <RoleOption icon={<GraduationCap className="size-4" />} label="Learner" active={role === "learner"} onClick={() => setRole("learner")} />
        <RoleOption icon={<ShieldCheck className="size-4" />} label="HR Admin" active={role === "admin"} onClick={() => setRole("admin")} />
      </div>

      <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
        <Field label="Full name" error={touched ? nameErr : ""}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Ayush Pathak" />
        </Field>
        <Field label="Employee ID" error={touched ? idErr : ""}>
          <input
            className="input uppercase placeholder:normal-case"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g. TSS1234"
          />
        </Field>
        {role === "learner" && (
          <Field label="Department">
            <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
        )}
        <Button type="submit" size="lg" className="mt-3 w-full">
          {role === "admin" ? "Open HR report" : "Start module"}
          <ArrowRight className="size-5" />
        </Button>
      </form>
    </>
  );
}

function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[#141a3a] px-14 py-14 text-white lg:flex lg:flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-brand opacity-60 blur-3xl"
      />
      <div className="relative">
        <span className="inline-flex rounded-xl bg-white px-4 py-3">
          <Logo src={moduleMeta.logoSrc} />
        </span>
      </div>
      <div className="relative mt-auto">
        <p className="eyebrow text-[#aab5ec]">
          {moduleMeta.docId} · {moduleMeta.classification}
        </p>
        <h1 className="font-display mt-5 text-[5.5rem] leading-[0.95]">
          Code of
          <br />
          Conduct
        </h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-[#d5daf3]">
          Four short chapters, one final assessment and your attestation — at your own pace.
        </p>
      </div>
    </section>
  );
}

function RoleOption({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl text-[0.9375rem] font-semibold transition-colors ${
        active ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-sm text-danger">{error}</span>}
    </label>
  );
}
