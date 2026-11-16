import Link from "next/link";
import { redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { listMyTrades } from "@/server/trades";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import ListingImage from "@/components/listings/ListingImage";
import Quantity from "@/components/listings/Quantity";

export async function generateMetadata() {
  const t = await getTranslations("trades");
  return { title: t("title") };
}

const STATUS_STYLES = {
  PROPOSED: "bg-amber-100 text-amber-900",
  ACCEPTED: "bg-leaf-100 text-leaf-800",
  COMPLETED: "bg-leaf-600 text-white",
  DECLINED: "bg-stone-200 text-stone-700",
  WITHDRAWN: "bg-stone-200 text-stone-700",
  CANCELLED: "bg-stone-200 text-stone-700",
};

export default async function TradesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?callbackUrl=/trades");
  const t = await getTranslations("trades");
  const tTrade = await getTranslations("trade");
  const format = await getFormatter();
  const trades = await listMyTrades(user);

  return (
    <div className="page max-w-3xl">
      <h1 className="page-title mb-5">{t("title")}</h1>
      {trades.length === 0 ? (
        <EmptyState icon="🤝" title={t("empty")} hint={t("emptyHint")} />
      ) : (
        <ul className="space-y-3">
          {trades.map((trade) => (
            <li key={trade.id} className="card flex gap-3 p-3">
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <ListingImage listing={trade.listing} sizes="80px" artClassName="text-3xl" />
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-stone-900">{trade.listing.title}</p>
                  <span className={`chip shrink-0 ${STATUS_STYLES[trade.status]}`}>
                    {tTrade(`status.${trade.status}`)}
                  </span>
                </div>
                <p className="text-sm text-stone-700">
                  {trade.role === "seller" ? t("give") : t("get")}{" "}
                  <Quantity value={trade.quantity} unit={trade.listing.unit} /> · {trade.terms}
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="flex min-w-0 items-center gap-2 text-sm text-stone-500">
                    <Avatar user={trade.other} size="sm" />
                    <span className="truncate">{t("with", { name: trade.other.name })}</span>
                    <span className="shrink-0">· {format.relativeTime(trade.updatedAt)}</span>
                  </span>
                  <Link href={`/messages/${trade.conversationId}`} className="btn btn-secondary btn-sm shrink-0">
                    {t("openChat")}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
