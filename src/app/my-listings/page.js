import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getCurrentUser } from "@/server/auth";
import { getMyListings } from "@/server/listings";
import EmptyState from "@/components/ui/EmptyState";
import ListingImage from "@/components/listings/ListingImage";
import ListingStatus from "@/components/listings/ListingStatus";
import OwnerActions from "@/components/listings/OwnerActions";
import Quantity from "@/components/listings/Quantity";

export async function generateMetadata() {
  const t = await getTranslations("myListings");
  return { title: t("title") };
}

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?callbackUrl=/my-listings");
  const t = await getTranslations("myListings");
  const tListing = await getTranslations("listing");
  const tNav = await getTranslations("nav");
  const listings = await getMyListings(user);

  return (
    <div className="page max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="page-title">{t("title")}</h1>
        <Link href="/listings/new" className="btn btn-primary">
          <PlusIcon className="h-4 w-4" />
          {tNav("newListing")}
        </Link>
      </div>
      {listings.length === 0 ? (
        <EmptyState icon="🧺" title={t("empty")} hint={t("emptyHint")}>
          <Link href="/listings/new" className="btn btn-primary">
            {t("emptyCta")}
          </Link>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => (
            <li key={listing.id} className="card flex gap-3 p-3">
              <Link href={`/listings/${listing.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <ListingImage listing={listing} sizes="96px" artClassName="text-3xl" />
              </Link>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/listings/${listing.id}`} className="truncate font-semibold text-stone-900 hover:text-leaf-700">
                    {listing.title}
                  </Link>
                  <ListingStatus listing={listing} />
                </div>
                <p className="text-sm text-stone-600">
                  <Quantity value={listing.quantity} unit={listing.unit} />
                  {" · "}
                  {tListing("chats", { count: listing._count.conversations })}
                </p>
                <OwnerActions listing={listing} compact />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
