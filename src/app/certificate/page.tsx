"use client";

import { Download } from "lucide-react";
import { messages, moduleMeta } from "@/content/module";
import { FooterBar, LearnerShell, PageHeading } from "@/components/learner-shell";
import { Button, ButtonLink, Logo } from "@/components/ui";
import { notify } from "@/lib/notify";
import { useStore } from "@/lib/store";

export default function CertificatePage() {
  const profile = useStore((s) => s.session?.profile);
  const progress = useStore((s) => s.progress);
  const { attestation, certificateId } = progress;

  const completedOn = attestation
    ? new Date(attestation.at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <LearnerShell
      active="certificate"
      guard={(p, steps) => {
        const step = steps.find((s) => s.id === "certificate");
        return !p.certificateId ? { href: "/welcome/", message: messages.lockedStep(step?.requirement ?? "the attestation") } : null;
      }}
      footer={
        <FooterBar
          back={<ButtonLink href="/welcome/" variant="secondary">Home</ButtonLink>}
          status={`Certificate ${certificateId ?? ""}`}
          action={
            <Button onClick={() => notify.info(messages.pdfPlaceholder)}>
              <Download className="size-4" />
              Download PDF
            </Button>
          }
        />
      }
    >
      <PageHeading eyebrow="Module complete" title="Your certificate" />

      <div className="mt-12 rounded-[1.25rem] border border-line bg-white p-2 shadow-[0_24px_60px_-30px_rgba(20,26,58,0.35)]">
        <div className="relative overflow-hidden rounded-[0.9rem] border-2 border-brand/80 px-6 py-12 text-center sm:px-14 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-soft" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-brand-soft" />

          <div className="relative">
            <div className="flex justify-center">
              <Logo src={moduleMeta.logoSrc} />
            </div>
            <p className="eyebrow mt-10 text-brand">Certificate of completion</p>
            <p className="mt-6 text-[1.0625rem] text-muted">This is to certify that</p>
            <p className="font-display mt-4 text-[2.75rem] text-ink sm:text-[3.75rem]">{profile?.name}</p>
            <p className="mt-2 text-[0.9375rem] font-medium text-muted">Employee ID {profile?.employeeId}</p>
            <p className="mx-auto mt-8 max-w-xl text-[1.125rem] leading-8 text-body">
              has successfully completed the <span className="font-semibold text-ink">{moduleMeta.title}</span> training module
              ({moduleMeta.docId}) and attested to abide by the Code.
            </p>

            <div className="mx-auto mt-14 grid max-w-2xl gap-10 text-left sm:grid-cols-2">
              <div>
                <p className="border-b border-ink/70 pb-2 font-display text-2xl normal-case tracking-normal text-ink">{completedOn}</p>
                <p className="mt-2 text-sm text-muted">Date of completion</p>
              </div>
              <div>
                <p className="border-b border-ink/70 pb-2 text-xl font-semibold italic text-ink">{moduleMeta.signatory.name}</p>
                <p className="mt-2 text-sm text-muted">{moduleMeta.signatory.title}</p>
              </div>
            </div>

            <p className="mt-12 text-sm font-semibold tracking-[0.12em] text-muted">CERTIFICATE ID · {certificateId}</p>
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}
