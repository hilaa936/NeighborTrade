"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import { statusOf } from "./ListingStatus";

export default function OwnerActions({ listing, compact = false }) {
  const t = useTranslations("listing");
  const router = useRouter();
  const errorMessage = useErrorMessage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const status = statusOf(listing);

  const run = async (request) => {
    setBusy(true);
    setError(null);
    try {
      await request();
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const act = (action) => run(() => api(`/api/listings/${listing.id}`, { method: "PATCH", body: { action } }));

  const remove = () => {
    if (!window.confirm(t("deleteConfirm"))) return;
    run(async () => {
      await api(`/api/listings/${listing.id}`, { method: "DELETE" });
      router.push("/my-listings");
    });
  };

  const size = compact ? "btn-sm" : "";
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/listings/${listing.id}/edit`} className={`btn btn-secondary ${size}`}>
          {t("edit")}
        </Link>
        {status === "active" && (
          <button type="button" disabled={busy} onClick={() => act("pause")} className={`btn btn-secondary ${size}`}>
            {t("pause")}
          </button>
        )}
        {status === "paused" && (
          <button type="button" disabled={busy} onClick={() => act("resume")} className={`btn btn-secondary ${size}`}>
            {t("resume")}
          </button>
        )}
        {status === "expired" && (
          <button type="button" disabled={busy} onClick={() => act("renew")} className={`btn btn-primary ${size}`}>
            {t("renew")}
          </button>
        )}
        <button type="button" disabled={busy} onClick={remove} className={`btn btn-danger ${size}`}>
          {t("delete")}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
