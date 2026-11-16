"use client";

import { useUnread } from "./UnreadProvider";

export default function UnreadBadge({ className = "" }) {
  const { count } = useUnread();
  if (!count) return null;
  return (
    <span
      className={`min-w-5 rounded-full bg-earth-500 px-1.5 text-center text-[11px] font-bold leading-5 text-white ${className}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
