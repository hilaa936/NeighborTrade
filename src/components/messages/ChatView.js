"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Avatar from "@/components/ui/Avatar";
import { useUnread } from "@/components/layout/UnreadProvider";
import { useErrorMessage } from "@/components/ui/useErrorMessage";
import { api } from "@/lib/api";
import { LIMITS } from "@/lib/options";
import { usePolling } from "./usePolling";
import MessageTime from "./MessageTime";
import TradeCard from "./TradeCard";
import TradeForm from "./TradeForm";
import DetailsPanel from "./DetailsPanel";

const POLL_MS = 3_000;

const dayKey = (date) => new Date(date).toDateString();

export default function ChatView({ me, initialDetails, initialMessages }) {
  const t = useTranslations("messages");
  const errorMessage = useErrorMessage();
  const { refresh: refreshUnread } = useUnread();
  const [details, setDetails] = useState(initialDetails);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const scroller = useRef(null);
  const id = details.id;

  const tradesById = Object.fromEntries(details.trades.map((trade) => [trade.id, trade]));
  const openTrade = details.trades.find((trade) => trade.status === "PROPOSED");
  const names = { [me.id]: t("you"), [details.other.id]: details.other.name };

  const markRead = useCallback(async () => {
    try {
      await api(`/api/conversations/${id}/read`, { method: "POST" });
      refreshUnread();
    } catch {
      // Not critical; the next poll will retry
    }
  }, [id, refreshUnread]);

  const reloadDetails = useCallback(async () => {
    try {
      setDetails((await api(`/api/conversations/${id}`)).conversation);
    } catch {
      // Keep what is on screen
    }
  }, [id]);

  // Appends messages that are not on screen yet
  const merge = useCallback((incoming) => {
    if (incoming.length === 0) return;
    setMessages((current) => {
      const known = new Set(current.map((m) => m.id));
      const fresh = incoming.filter((m) => !known.has(m.id));
      return fresh.length ? [...current, ...fresh] : current;
    });
  }, []);

  const lastAt = messages.at(-1)?.createdAt;

  const poll = useCallback(async () => {
    try {
      const query = lastAt ? `?after=${encodeURIComponent(new Date(lastAt).toISOString())}` : "";
      const { messages: incoming } = await api(`/api/conversations/${id}/messages${query}`);
      merge(incoming);
      if (incoming.some((m) => m.senderId !== me.id)) markRead();
      if (incoming.some((m) => m.kind === "TRADE")) reloadDetails();
    } catch {
      // Offline: try again on the next tick
    }
  }, [id, lastAt, me.id, merge, markRead, reloadDetails]);

  usePolling(poll, POLL_MS);

  useEffect(() => {
    markRead();
  }, [markRead]);

  // Keep the newest message in view
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const send = async (event) => {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    try {
      const { message } = await api(`/api/conversations/${id}/messages`, { method: "POST", body: { body } });
      merge([message]);
      setDraft("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  // After a trade action: fetch the new status message and the updated trades
  const afterTradeChange = async () => {
    await Promise.all([poll(), reloadDetails()]);
  };

  return (
    <div className="flex h-full min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-stone-200 bg-white px-2 py-2 sm:px-3">
          <Link href="/messages" className="btn btn-ghost p-2 md:hidden" aria-label={t("back")}>
            {/* Points "back" in reading direction */}
            <ArrowRightIcon className="h-5 w-5 ltr:rotate-180" />
          </Link>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 text-start hover:bg-stone-50"
            aria-expanded={showDetails}
          >
            <Avatar user={details.other} />
            <span className="min-w-0">
              <span className="block truncate font-semibold text-stone-900">{details.other.name}</span>
              <span className="block truncate text-xs text-earth-700">
                {details.listing.isDeleted ? t("listingRemoved") : details.listing.title}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="btn btn-ghost p-2"
            aria-label={t("details")}
          >
            <InformationCircleIcon className="h-6 w-6" />
          </button>
        </header>

        <div ref={scroller} className="flex-1 overflow-y-auto bg-[#f3efe6] px-3 py-4 sm:px-6">
          {messages.length === 0 && (
            <p className="mx-auto mt-8 max-w-xs rounded-xl bg-white/80 px-4 py-3 text-center text-sm text-stone-600">
              {t("start")}
            </p>
          )}
          <ol className="flex flex-col gap-1.5">
            {messages.map((message, index) => (
              <li key={message.id} className="flex flex-col">
                {dayKey(message.createdAt) !== dayKey(messages[index - 1]?.createdAt ?? 0) && (
                  <DaySeparator date={message.createdAt} />
                )}
                <Message
                  message={message}
                  mine={message.senderId === me.id}
                  me={me}
                  senderName={names[message.senderId]}
                  trade={message.tradeId ? (tradesById[message.tradeId] ?? message.trade) : null}
                  unit={details.listing.unit}
                  onTradeChange={afterTradeChange}
                />
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={send} className="border-t border-stone-200 bg-white px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-3">
          {error && <p className="px-2 pb-1 text-sm text-red-700">{error}</p>}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setShowTradeForm(true)}
              disabled={Boolean(openTrade) || !details.listing.isAvailable}
              className="btn btn-secondary shrink-0 px-3 py-2.5"
              title={t("proposeHint")}
            >
              🤝 <span className="hidden sm:inline">{t("propose")}</span>
            </button>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends, Shift+Enter adds a line (desktop habit)
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) send(event);
              }}
              rows={1}
              maxLength={LIMITS.message}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              className="input max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-2xl py-2.5"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="btn btn-primary h-11 w-11 shrink-0 p-0"
              aria-label={t("send")}
            >
              <PaperAirplaneIcon className="h-5 w-5 rtl:-scale-x-100" />
            </button>
          </div>
        </form>
      </div>

      {showDetails && (
        <DetailsPanel details={details} me={me} onClose={() => setShowDetails(false)} />
      )}
      {showTradeForm && (
        <TradeForm
          conversationId={id}
          listing={details.listing}
          onClose={() => setShowTradeForm(false)}
          onSent={async () => {
            setShowTradeForm(false);
            await afterTradeChange();
          }}
        />
      )}
    </div>
  );
}

function DaySeparator({ date }) {
  const format = useFormatter();
  return (
    <span className="mx-auto my-2 rounded-full bg-white/80 px-3 py-0.5 text-xs text-stone-500 shadow-sm">
      {format.dateTime(new Date(date), { weekday: "long", day: "numeric", month: "long" })}
    </span>
  );
}

function Message({ message, mine, me, senderName, trade, unit, onTradeChange }) {
  const t = useTranslations("trade");

  if (message.kind === "TRADE" && message.tradeStatus !== "PROPOSED") {
    return (
      <p className="mx-auto my-1 rounded-full bg-earth-100/80 px-3 py-1 text-center text-xs text-earth-900">
        🤝 {t(`event.${message.tradeStatus}`, { name: senderName })} · <MessageTime date={message.createdAt} />
      </p>
    );
  }

  if (message.kind === "TRADE") {
    return (
      <div className={`my-1 w-full max-w-xs ${mine ? "self-end" : "self-start"}`}>
        <TradeCard trade={trade} me={me} senderName={senderName} unit={unit} onChange={onTradeChange} />
      </div>
    );
  }

  return (
    <div
      className={`max-w-[80%] rounded-2xl px-3 py-1.5 shadow-sm ${
        mine ? "self-end rounded-ee-sm bg-leaf-100 text-stone-900" : "self-start rounded-es-sm bg-white text-stone-900"
      }`}
    >
      <p className="whitespace-pre-wrap break-words">{message.body}</p>
      <p className="mt-0.5 text-end text-[11px] text-stone-500">
        <MessageTime date={message.createdAt} />
      </p>
    </div>
  );
}
