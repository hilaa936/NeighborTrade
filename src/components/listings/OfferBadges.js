import { useTranslations } from "next-intl";

export default function OfferBadges({ listing, className = "" }) {
  const t = useTranslations("offer");
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {listing.isFree && <span className="chip bg-leaf-100 text-leaf-800">{t("free")}</span>}
      {listing.isExchange && <span className="chip bg-earth-100 text-earth-800">{t("exchange")}</span>}
      {listing.openToOffers && <span className="chip bg-sky-100 text-sky-800">{t("offers")}</span>}
    </div>
  );
}
