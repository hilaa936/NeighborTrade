import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { db } from "@/server/db";
import ListingForm from "@/components/listings/ListingForm";

export default async function EditListingPage({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/login?callbackUrl=/listings/${id}/edit`);
  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || listing.status === "DELETED" || listing.ownerId !== user.id) notFound();
  const t = await getTranslations("form");
  const { lat, lng, searchText, ...editable } = listing;
  return (
    <div className="page max-w-2xl">
      <h1 className="page-title mb-5">{t("editTitle")}</h1>
      <ListingForm listing={editable} hasLocation={user.lat != null} />
    </div>
  );
}
