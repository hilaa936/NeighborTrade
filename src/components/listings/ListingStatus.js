import { useTranslations } from "next-intl";

// Status chip for the owner's view of a listing
export function statusOf(listing, now = new Date()) {
  if (listing.status === "PAUSED") return "paused";
  if (listing.quantity <= 0) return "soldOut";
  if (listing.expiresAt && new Date(listing.expiresAt) <= now) return "expired";
  return "active";
}

const STYLES = {
  active: "bg-leaf-100 text-leaf-800",
  paused: "bg-stone-200 text-stone-700",
  soldOut: "bg-earth-100 text-earth-800",
  expired: "bg-red-100 text-red-800",
};

export default function ListingStatus({ listing }) {
  const t = useTranslations("listing.status");
  const status = statusOf(listing);
  return <span className={`chip ${STYLES[status]}`}>{t(status)}</span>;
}
