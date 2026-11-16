import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { searchListings } from "@/server/listings";
import ListingGrid from "@/components/listings/ListingGrid";
import MarketFilters from "@/components/market/MarketFilters";
import EmptyState from "@/components/ui/EmptyState";

export async function generateMetadata() {
  const t = await getTranslations("market");
  return { title: t("title") };
}

export default async function MarketPage({ searchParams }) {
  const params = await searchParams;
  const t = await getTranslations("market");
  const viewer = await getCurrentUser();
  const listings = await searchListings(params, viewer);
  const hasLocation = viewer?.lat != null;

  return (
    <div className="page">
      <h1 className="page-title mb-4">{t("title")}</h1>
      <MarketFilters key={params.q ?? ""} hasLocation={hasLocation} />
      {viewer && !hasLocation && (
        <p className="mb-4 rounded-xl bg-earth-50 px-4 py-3 text-sm text-earth-800">
          <Link href="/profile" className="font-semibold underline">
            {t("setLocation")}
          </Link>
        </p>
      )}
      {listings.length > 0 ? (
        <>
          <p className="mb-3 text-sm text-stone-500">{t("results", { count: listings.length })}</p>
          <ListingGrid listings={listings} />
        </>
      ) : (
        <EmptyState icon="🔍" title={t("empty")} hint={t("emptyHint")}>
          <Link href="/market" className="btn btn-secondary">
            {t("clear")}
          </Link>
        </EmptyState>
      )}
    </div>
  );
}
