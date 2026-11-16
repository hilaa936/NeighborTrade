"use client";

import { useTranslations } from "next-intl";

// Turns an API error into a translated message
export function useErrorMessage() {
  const t = useTranslations("errors");
  return (error) => (error?.code && t.has(error.code) ? t(error.code) : t("server_error"));
}
