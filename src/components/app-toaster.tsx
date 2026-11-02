"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      visibleToasts={3}
      richColors
      closeButton
      offset={20}
      toastOptions={{
        classNames: {
          toast: "!font-sans !text-[0.9375rem] !rounded-xl",
        },
      }}
    />
  );
}
