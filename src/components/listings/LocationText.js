import { useLocale, useTranslations } from "next-intl";
import { localityName } from "@/lib/localities";

// "In your city", "~5 km away", or the city name for guests
export default function LocationText({ location }) {
  const t = useTranslations("location");
  const locale = useLocale();
  if (!location) return null;
  if (location.kind === "sameCity") return t("sameCity");
  if (location.kind === "distance") return t("distance", { km: location.km });
  return t("city", { city: localityName(location.localityId, locale) });
}
