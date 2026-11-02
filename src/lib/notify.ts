"use client";

import { toast } from "sonner";
import { messages } from "@/content/module";

const lastShown = new Map<string, number>();

/** Drop repeats of the same toast inside `windowMs` (used for skip-ahead and locked-step clicks). */
function throttled(key: string, windowMs: number) {
  const t = Date.now();
  const prev = lastShown.get(key) ?? 0;
  if (t - prev < windowMs) return true;
  lastShown.set(key, t);
  return false;
}

export const notify = {
  success: (msg: string) => toast.success(msg, { duration: 4000 }),
  info: (msg: string) => toast.info(msg, { duration: 4000 }),
  warning: (msg: string, key?: string) => {
    if (key && throttled(key, 4000)) return;
    toast.warning(msg, { duration: 5000, id: key });
  },
  error: (msg: string) => toast.error(msg, { duration: Infinity, closeButton: true }),
  /** Small, quiet confirmation after state is persisted. */
  saved: () => {
    if (throttled("saved", 1500)) return;
    // Slight delay so it lands under the main event toast instead of racing it.
    setTimeout(() => toast(messages.progressSaved, { duration: 2000, className: "toast-subtle" }), 400);
  },
};
