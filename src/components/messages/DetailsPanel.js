"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Avatar from "@/components/ui/Avatar";
import ListingImage from "@/components/listings/ListingImage";
import LocationText from "@/components/listings/LocationText";
import OfferBadges from "@/components/listings/OfferBadges";
import Quantity from "@/components/listings/Quantity";

// Person + listing + trades, opened from the chat header (like a contact info screen)
export default function DetailsPanel({ details, me, onClose }) {
  const t = useTranslations("messages");
  const tTrade = useTranslations("trade");
  const tListing = useTranslations("listing");
  const format = useFormatter();
  const { other, listing, trades } = details;

  return (
    <aside className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white lg:static lg:z-auto lg:w-80 lg:shrink-0 lg:border-s lg:border-stone-200">
      <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
        <h2 className="font-semibold text-stone-900">{t("details")}</h2>
        <button type="button" onClick={onClose} className="btn btn-ghost p-1.5" aria-label={t("closeDetails")}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <section className="flex flex-col items-center gap-1 border-b border-stone-100 px-4 py-6 text-center">
        <Avatar user={other} size="lg" />
        <p className="mt-2 text-lg font-bold text-stone-900">{other.name}</p>
        {other.location && (
          <p className="flex items-center gap-1 text-sm text-stone-500">
            <MapPinIcon className="h-4 w-4 text-earth-400" />
            <LocationText location={other.location} />
          </p>
        )}
        <p className="text-xs text-stone-400">
          {t("memberSince", { date: format.dateTime(new Date(other.createdAt), { month: "long", year: "numeric" }) })}
        </p>
        {other.bio && <p className="mt-2 whitespace-pre-line text-sm text-stone-600">{other.bio}</p>}
        <Link href={`/users/${other.id}`} className="mt-2 text-sm font-medium text-leaf-700 hover:underline">
          {tListing("viewProfile")}
        </Link>
      </section>

      <section className="border-b border-stone-100 px-4 py-4">
        <p className="mb-2 text-xs font-semibold text-stone-500">{t(`role.${details.role}`)}</p>
        {listing.isDeleted ? (
          <p className="text-sm text-stone-500">{t("listingRemoved")}</p>
        ) : (
          <Link href={`/listings/${listing.id}`} className="flex gap-3 rounded-xl p-1 hover:bg-stone-50">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <ListingImage listing={listing} sizes="64px" artClassName="text-2xl" />
            </span>
            <span className="min-w-0 space-y-1">
              <span className="block truncate font-semibold text-stone-900">{listing.title}</span>
              <span className="block text-sm text-stone-600">
                {tListing("left", { quantity: "" })}
                <Quantity value={listing.quantity} unit={listing.unit} />
              </span>
              <OfferBadges listing={listing} />
            </span>
          </Link>
        )}
      </section>

      <section className="px-4 py-4">
        <h3 className="mb-2 text-sm font-semibold text-stone-800">{t("trades")}</h3>
        {trades.length === 0 ? (
          <p className="text-sm text-stone-500">{t("noTrades")}</p>
        ) : (
          <ul className="space-y-2">
            {trades.map((trade) => (
              <li key={trade.id} className="rounded-xl border border-stone-200 px-3 py-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold">
                    <Quantity value={trade.quantity} unit={listing.unit} />
                  </span>
                  <span className="text-stone-500">{tTrade(`status.${trade.status}`)}</span>
                </div>
                <p className="text-stone-600">{trade.terms}</p>
                <p className="text-xs text-stone-400">
                  {tTrade("by", { name: trade.proposerId === me.id ? t("you") : other.name })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
