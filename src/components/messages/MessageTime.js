"use client";

import { useFormatter } from "next-intl";

const isSameDay = (a, b) => a.toDateString() === b.toDateString();

// "14:32" for today, "12 בנוב׳" for older messages
export default function MessageTime({ date, withDay = false }) {
  const format = useFormatter();
  const value = new Date(date);
  if (withDay && !isSameDay(value, new Date())) {
    return format.dateTime(value, { day: "numeric", month: "short" });
  }
  return format.dateTime(value, { hour: "2-digit", minute: "2-digit" });
}
