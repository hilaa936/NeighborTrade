"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/ui/EmptyState";

export default function ErrorPage({ error, reset }) {
  const t = useTranslations("common");
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="page max-w-lg">
      <EmptyState icon="🌧️" title={t("errorTitle")} hint={t("errorBody")}>
        <button type="button" onClick={reset} className="btn btn-primary">
          {t("retry")}
        </button>
      </EmptyState>
    </div>
  );
}
