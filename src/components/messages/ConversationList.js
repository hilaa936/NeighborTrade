"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { usePolling } from "./usePolling";
import MessageTime from "./MessageTime";
import Quantity from "@/components/listings/Quantity";

const POLL_MS = 8_000;

export default function ConversationList({ initialConversations, activeId }) {
  const t = useTranslations("messages");
  const [conversations, setConversations] = useState(initialConversations);

  usePolling(async () => {
    try {
      setConversations((await api("/api/conversations")).conversations);
    } catch {
      // Keep the current list while offline
    }
  }, POLL_MS);

  return (
    <>
      <h1 className="border-b border-stone-100 px-4 py-4 text-xl font-bold text-stone-900">{t("title")}</h1>
      {conversations.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <span className="text-4xl" aria-hidden>
            🌱
          </span>
          <p className="font-semibold text-stone-800">{t("empty")}</p>
          <p className="text-sm text-stone-500">{t("emptyHint")}</p>
          <Link href="/market" className="btn btn-primary mt-2">
            {t("goToMarket")}
          </Link>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                className={`flex items-center gap-3 border-b border-stone-100 px-4 py-3 transition ${
                  c.id === activeId ? "bg-leaf-50" : "hover:bg-stone-50"
                }`}
              >
                <Avatar user={c.other} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-semibold text-stone-900">{c.other.name}</p>
                    <span className={`shrink-0 text-xs ${c.unread ? "font-semibold text-leaf-700" : "text-stone-400"}`}>
                      <MessageTime date={c.lastMessageAt} withDay />
                    </span>
                  </div>
                  <p className="truncate text-xs text-earth-700">{c.listing.title}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm text-stone-500">
                      <Preview message={c.lastMessage} unit={c.listing.unit} />
                    </p>
                    {c.unread > 0 && (
                      <span className="min-w-5 shrink-0 rounded-full bg-leaf-600 px-1.5 text-center text-[11px] font-bold leading-5 text-white">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Preview({ message, unit }) {
  const t = useTranslations("trade");
  if (!message) return " ";
  if (message.kind === "TEXT") return message.body;
  if (message.tradeStatus === "PROPOSED" && message.trade) {
    return (
      <>
        🤝 {t("proposal")}: {unit ? <Quantity value={message.trade.quantity} unit={unit} /> : message.trade.quantity}
      </>
    );
  }
  return <>🤝 {t(`status.${message.tradeStatus}`)}</>;
}
