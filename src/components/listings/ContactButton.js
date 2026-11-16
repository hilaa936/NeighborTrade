"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { api } from "@/lib/api";
import { useErrorMessage } from "@/components/ui/useErrorMessage";

export default function ContactButton({ listingId, loggedIn, existingChatId }) {
  const t = useTranslations("listing");
  const router = useRouter();
  const errorMessage = useErrorMessage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!loggedIn) {
    return (
      <Link href={`/auth/login?callbackUrl=/listings/${listingId}`} className="btn btn-primary w-full py-3 text-base">
        {t("contactLogin")}
      </Link>
    );
  }

  if (existingChatId) {
    return (
      <Link href={`/messages/${existingChatId}`} className="btn btn-primary w-full py-3 text-base">
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
        {t("openChat")}
      </Link>
    );
  }

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const { conversation } = await api("/api/conversations", { method: "POST", body: { listingId } });
      router.push(`/messages/${conversation.id}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={start} disabled={busy} className="btn btn-primary w-full py-3 text-base">
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
        {t("contact")}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
