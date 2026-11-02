"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Loads saved progress from localStorage after mount (keeps the first client render identical to the
 * static HTML), then applies presenter mode: `?demo=1` shows the Skip video button, `?demo=0` hides it.
 * window.location is used instead of useSearchParams so every page stays fully static.
 */
export function StoreHydrator() {
  useEffect(() => {
    Promise.resolve(useStore.persist.rehydrate()).finally(() => {
      useStore.setState({ hydrated: true });
      const v = new URLSearchParams(window.location.search).get("demo");
      if (v === "1") useStore.getState().setDemo(true);
      if (v === "0") useStore.getState().setDemo(false);
    });
  }, []);
  return null;
}
