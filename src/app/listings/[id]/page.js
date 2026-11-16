import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { MapPinIcon, ClockIcon } from "@heroicons/react/20/solid";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import { ApiError } from "@/server/errors";
import { getListing } from "@/server/listings";
import Avatar from "@/components/ui/Avatar";
import ListingPhotos from "@/components/listings/ListingPhotos";
import OfferBadges from "@/components/listings/OfferBadges";
import LocationText from "@/components/listings/LocationText";
import Quantity from "@/components/listings/Quantity";
import ContactButton from "@/components/listings/ContactButton";
import OwnerActions from "@/components/listings/OwnerActions";
import ListingStatus from "@/components/listings/ListingStatus";

async function load(id, viewer) {
  try {
    return await getListing(id, viewer);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = await getListing(id, null).catch(() => null);
  return listing ? { title: listing.title } : {};
}

export default async function ListingPage({ params }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const listing = await load(id, viewer);
  const t = await getTranslations("listing");
  const tCategory = await getTranslations("categories");
  const tOffer = await getTranslations("offer");
  const format = await getFormatter();
  const existingChat =
    viewer && !listing.isMine
      ? await db.conversation.findUnique({
          where: { listingId_buyerId: { listingId: id, buyerId: viewer.id } },
          select: { id: true },
        })
      : null;

  return (
    <div className="page max-w-4xl">
      <div className="grid gap-6 md:grid-cols-2">
        <ListingPhotos listing={listing} />

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-stone-500">
              {listing.category === "other" ? listing.customCategory : tCategory(listing.category)}
            </p>
            <h1 className="page-title">{listing.title}</h1>
            <p className="mt-1 text-lg text-stone-700">
              <Quantity value={listing.quantity} unit={listing.unit} />
            </p>
          </div>

          <OfferBadges listing={listing} />
          {listing.isExchange && listing.wanted && (
            <p className="rounded-xl bg-earth-50 px-4 py-3 text-sm text-earth-900">
              {tOffer("wanted", { wanted: listing.wanted })}
            </p>
          )}
          {listing.openToOffers && <p className="text-sm text-sky-800">{tOffer("offersHint")}</p>}

          <ul className="space-y-1.5 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-earth-400" />
              <LocationText location={listing.location} />
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-earth-400" />
              {t("posted", { time: format.relativeTime(listing.createdAt) })}
              {" · "}
              {listing.expiresAt ? t("expires", { date: format.dateTime(listing.expiresAt, { day: "numeric", month: "short" }) }) : t("always")}
            </li>
          </ul>

          {listing.description && (
            <div>
              <h2 className="mb-1 font-semibold text-stone-800">{t("description")}</h2>
              <p className="whitespace-pre-line text-stone-700">{listing.description}</p>
            </div>
          )}

          {listing.isMine ? (
            <div className="card space-y-3 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-stone-800">{t("yours")}</p>
                <ListingStatus listing={listing} />
              </div>
              <OwnerActions listing={listing} />
            </div>
          ) : (
            <>
              <Link href={`/users/${listing.owner.id}`} className="card flex items-center gap-3 p-3 hover:bg-stone-50">
                <Avatar user={listing.owner} />
                <div className="min-w-0">
                  <p className="text-xs text-stone-500">{t("owner")}</p>
                  <p className="truncate font-semibold text-stone-900">{listing.owner.name}</p>
                </div>
                <span className="ms-auto text-sm text-leaf-700">{t("viewProfile")}</span>
              </Link>
              <ContactButton listingId={listing.id} loggedIn={Boolean(viewer)} existingChatId={existingChat?.id} />
              <p className="text-center text-xs text-stone-500">{t("privacyNote")}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
