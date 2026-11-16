import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPinIcon } from "@heroicons/react/20/solid";
import ListingImage from "./ListingImage";
import OfferBadges from "./OfferBadges";
import LocationText from "./LocationText";
import Quantity from "./Quantity";

export default function ListingCard({ listing }) {
  const t = useTranslations("categories");
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ListingImage listing={listing} />
        <OfferBadges listing={listing} className="absolute start-2 top-2" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-stone-500">
          {listing.category === "other" ? listing.customCategory : t(listing.category)}
        </p>
        <h3 className="line-clamp-1 font-semibold text-stone-900 group-hover:text-leaf-700">{listing.title}</h3>
        <p className="text-sm text-stone-600">
          <Quantity value={listing.quantity} unit={listing.unit} />
        </p>
        <p className="mt-auto flex items-center gap-1 pt-1 text-xs text-stone-500">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-earth-400" />
          <span className="truncate">
            <LocationText location={listing.location} />
            {listing.owner && <> · {listing.owner.name}</>}
          </span>
        </p>
      </div>
    </Link>
  );
}
