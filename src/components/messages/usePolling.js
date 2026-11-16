"use client";

import { useEffect, useRef } from "react";

// Calls `callback` every `ms` while the tab is visible, and right away when it becomes visible
export function usePolling(callback, ms) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  });

  useEffect(() => {
    const tick = () => document.visibilityState === "visible" && saved.current();
    const timer = setInterval(tick, ms);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [ms]);
}
