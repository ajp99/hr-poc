"use client";

import { PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { attestation, messages } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button, ButtonLink, Checkbox } from "@/components/ui";
import { notify } from "@/lib/notify";
import { useStore } from "@/lib/store";

const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

export default function AttestPage() {
  const router = useRouter();
  const profile = useStore((s) => s.session?.profile);
  const existing = useStore((s) => s.progress.attestation);
  const attest = useStore((s) => s.attest);

  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const nameMatches = !!profile && norm(name) === norm(profile.name);
  const canSubmit = agreed && nameMatches;

  function submit() {
    attest(name.trim().replace(/\s+/g, " "));
    notify.success(messages.attested);
    notify.saved();
    router.push("/certificate/");
  }

  if (existing) {
    // Already attested — show the record read-only.
    return (
      <LearnerShell
        active="attestation"
        footer={
          <FooterBar
            back={<ButtonLink href="/result/" variant="secondary">Back</ButtonLink>}
            status="Attestation recorded"
            action={<ButtonLink href="/certificate/">View certificate</ButtonLink>}
          />
        }
      >
        <PageHeading eyebrow={attestation.eyebrow} title={attestation.title} />
        <Statement />
        <dl className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Meta label="Signed by" value={existing.fullName} />
          <Meta label="Signed on" value={new Date(existing.at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })} />
        </dl>
      </LearnerShell>
    );
  }

  return (
    <LearnerShell
      active="attestation"
      guard={(_p, steps) => {
        const step = steps.find((s) => s.id === "attestation");
        return step?.status === "locked" ? { href: "/welcome/", message: messages.lockedStep(step.requirement) } : null;
      }}
      footer={
        <FooterBar
          back={<ButtonLink href="/result/" variant="secondary">Back</ButtonLink>}
          status={!agreed ? "Tick the box to agree" : !nameMatches ? "Type your full name to sign" : "Ready to submit"}
          action={
            <Button onClick={submit} disabled={!canSubmit}>
              <PenLine className="size-4" />
              Sign &amp; submit
            </Button>
          }
        />
      }
    >
      <PageHeading eyebrow={attestation.eyebrow} title={attestation.title} />
      <p className="mt-10 max-w-4xl text-[1.375rem] leading-[1.6] text-ink">{attestation.lead}</p>
      <Statement />

      <div className="mt-8 max-w-3xl space-y-6">
        <Checkbox id="attest-agree" checked={agreed} onChange={setAgreed} label={attestation.checkboxLabel} />

        <label className="block">
          <span className="text-sm font-semibold text-ink">{attestation.nameLabel}</span>
          <input
            className="input mt-2 !h-14 !text-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={profile?.name}
            autoComplete="off"
          />
          {touched && name && !nameMatches && (
            <span className="mt-1.5 block text-sm text-danger">Must match the name you signed in with ({profile?.name}).</span>
          )}
        </label>

        <dl className="grid gap-4 sm:grid-cols-2">
          <Meta label="Employee ID" value={profile?.employeeId ?? ""} />
          <Meta label="Date" value={today} />
        </dl>
      </div>
    </LearnerShell>
  );
}

function Statement() {
  return (
    <blockquote className="mt-10 max-w-4xl rounded-2xl border border-line bg-[#fafbfc] p-8 text-[1.1875rem] leading-8 text-ink">
      {attestation.statement}
    </blockquote>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line px-5 py-4">
      <dt className="eyebrow !text-[0.6875rem] text-muted">{label}</dt>
      <dd className="mt-1.5 font-semibold text-ink">{value}</dd>
    </div>
  );
}
