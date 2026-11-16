"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { LIMITS } from "@/lib/options";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import Quantity, { roundQuantity } from "@/components/listings/Quantity";

// Bottom sheet on mobile, dialog on desktop
export default function TradeForm({ conversationId, listing, onClose, onSent }) {
  const t = useTranslations("trade");
  const tUnit = useTranslations("units");
  const tCommon = useTranslations("common");
  const errorMessage = useErrorMessage();
  const [quantity, setQuantity] = useState(String(roundQuantity(Math.min(1, listing.quantity))));
  const [terms, setTerms] = useState(listing.isFree ? t("termsFree") : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/api/conversations/${conversationId}/trades`, {
        method: "POST",
        body: { quantity: Number(quantity), terms },
      });
      await onSent();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">🤝 {t("proposeTitle")}</h2>
            <p className="text-sm text-stone-500">{t("proposeHint")}</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost p-1.5" aria-label={tCommon("close")}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div>
          <label htmlFor="trade-quantity" className="label">
            {t("quantity", { unit: tUnit(listing.unit) })}
          </label>
          <input
            id="trade-quantity"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="any"
            max={listing.quantity}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="input"
            required
          />
          <p className="mt-1 text-xs text-stone-500">
            {t("available", { quantity: "" })}
            <Quantity value={listing.quantity} unit={listing.unit} />
          </p>
        </div>
        <div>
          <label htmlFor="trade-terms" className="label">
            {t("terms")}
          </label>
          <input
            id="trade-terms"
            value={terms}
            onChange={(event) => setTerms(event.target.value)}
            placeholder={t("termsPlaceholder")}
            maxLength={LIMITS.terms}
            className="input"
            required
          />
          {terms !== t("termsFree") && (
            <button type="button" onClick={() => setTerms(t("termsFree"))} className="chip mt-2 bg-leaf-100 text-leaf-800">
              {t("termsFree")}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full py-3">
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
