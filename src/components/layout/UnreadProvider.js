"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const POLL_MS = 10_000;
const UnreadContext = createContext({ count: 0, refresh: () => {} });

// Polls the unread-messages count for the nav badge
export function UnreadProvider({ children }) {
  const { status } = useSession();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations/unread");
      if (response.ok) setCount((await response.json()).count);
    } catch {
      // Offline: keep the last known count
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    const tick = () => document.visibilityState === "visible" && refresh();
    const timer = setInterval(tick, POLL_MS);
    const initial = setTimeout(tick, 0);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      clearTimeout(initial);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [status, refresh]);

  return (
    <UnreadContext.Provider value={{ count: status === "authenticated" ? count : 0, refresh }}>
      {children}
    </UnreadContext.Provider>
  );
}

export const useUnread = () => useContext(UnreadContext);
