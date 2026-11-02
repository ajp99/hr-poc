"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check } from "lucide-react";
import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed select-none whitespace-nowrap";
const sizes = {
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-lg",
};
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover disabled:bg-[#b9bfd9] disabled:text-white/90",
  secondary: "border border-line bg-white text-ink hover:border-[#c9ccd6] hover:bg-[#f7f8fa] disabled:text-muted",
  ghost: "text-brand underline underline-offset-4 hover:text-brand-hover disabled:text-muted",
  danger: "bg-danger text-white hover:bg-[#962722]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  return <button ref={ref} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
});

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Checkbox({
  checked,
  onChange,
  disabled,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: React.ReactNode;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
        disabled
          ? "cursor-not-allowed border-line bg-[#f7f8fa] text-muted"
          : checked
            ? "cursor-pointer border-brand bg-brand-soft text-ink"
            : "cursor-pointer border-line bg-white text-ink hover:border-[#c9ccd6]"
      }`}
    >
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className="peer absolute inset-0 cursor-[inherit] appearance-none rounded-md border-2 border-[#9ea3b0] bg-white checked:border-brand checked:bg-brand disabled:border-[#cfd2da]"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <Check className="pointer-events-none relative size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span className="text-[0.9375rem] font-medium leading-6">{label}</span>
    </label>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  body,
  confirmLabel,
  onConfirm,
  tone = "primary",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  tone?: "primary" | "danger";
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#111318]/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 shadow-2xl">
          <Dialog.Title className="text-xl font-bold text-ink">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-[0.9375rem] leading-6 text-body">{body}</Dialog.Description>
          <div className="mt-7 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Button
              variant={tone}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Truminds logo from /public, falling back to a drawn swoosh + wordmark until the file is added. */
export function Logo({ src, className = "" }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // The image may have failed before React hydrated (so onError never fired) — check once on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img ref={imgRef} src={src} alt="Truminds" className={`h-7 w-auto ${className}`} onError={() => setFailed(true)} />
    );
  }
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="Truminds">
      <svg width="46" height="18" viewBox="0 0 46 18" aria-hidden="true">
        <path d="M1 16C9 4 30 -1 45 3C34 5 20 10 12 17C8 18 3 18 1 16Z" fill="var(--brand)" />
      </svg>
      <span className="text-[1.05rem] font-semibold tracking-[0.22em] text-ink">TRUMINDS</span>
    </span>
  );
}
