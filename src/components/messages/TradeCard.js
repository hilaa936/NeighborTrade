"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import Quantity from "@/components/listings/Quantity";

const STATUS_STYLES = {
  PROPOSED: "bg-amber-100 text-amber-900",
  ACCEPTED: "bg-leaf-100 text-leaf-800",
  COMPLETED: "bg-leaf-600 text-white",
  DECLINED: "bg-stone-200 text-stone-700",
  WITHDRAWN: "bg-stone-200 text-stone-700",
  CANCELLED: "bg-stone-200 text-stone-700",
};

// Which buttons a participant sees for a trade in a given status
function actionsFor(trade, meId) {
  const isProposer = trade.proposerId === meId;
  if (trade.status === "PROPOSED") return isProposer ? ["withdraw"] : ["accept", "decline"];
  if (trade.status === "ACCEPTED") return ["complete", "cancel"];
  return [];
}

export default function TradeCard({ trade, me, senderName, unit, onChange }) {
  const t = useTranslations("trade");
  const errorMessage = useErrorMessage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  if (!trade) return null;

  const act = async (action) => {
    if (action === "cancel" && !window.confirm(t("cancelConfirm"))) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/api/trades/${trade.id}`, { method: "PATCH", body: { action } });
      await onChange();
    } catch (err) {
      setError(errorMessage(err));
      await onChange();
    } finally {
      setBusy(false);
    }
  };

  const actions = actionsFor(trade, me.id);

  return (
    <div className="overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 bg-earth-50 px-3 py-2">
        <p className="text-sm font-semibold text-earth-900">🤝 {t("proposal")}</p>
        <span className={`chip ${STATUS_STYLES[trade.status]}`}>{t(`status.${trade.status}`)}</span>
      </div>
      <div className="space-y-1 px-3 py-2.5">
        <p className="text-lg font-bold text-stone-900">
          <Quantity value={trade.quantity} unit={unit} />
        </p>
        <p className="text-stone-700">{trade.terms}</p>
        <p className="text-xs text-stone-500">{t("by", { name: senderName })}</p>
      </div>
      {actions.length > 0 && (
        <div className="flex gap-2 border-t border-stone-100 px-3 py-2">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              disabled={busy}
              onClick={() => act(action)}
              className={`btn btn-sm flex-1 ${
                action === "accept" || action === "complete" ? "btn-primary" : "btn-secondary"
              }`}
            >
              {t(action)}
            </button>
          ))}
        </div>
      )}
      {error && <p className="px-3 pb-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
