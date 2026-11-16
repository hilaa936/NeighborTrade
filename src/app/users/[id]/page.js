import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { getCurrentUser } from "@/server/auth";
import { ApiError } from "@/server/errors";
import { getUserListings } from "@/server/listings";
import { getPublicProfile } from "@/server/users";
import { describeLocation } from "@/lib/geo";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import ListingGrid from "@/components/listings/ListingGrid";
import LocationText from "@/components/listings/LocationText";

async function load(id) {
  try {
    return await getPublicProfile(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const user = await getPublicProfile(id).catch(() => null);
  return user ? { title: user.name } : {};
}

export default async function UserPage({ params }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const { lat, lng, localityId, ...user } = await load(id);
  const listings = await getUserListings(id, viewer);
  const t = await getTranslations("user");
  const tMessages = await getTranslations("messages");
  const format = await getFormatter();
  const location = describeLocation(viewer, { lat, lng, localityId });

  return (
    <div className="page">
      <section className="card mb-6 flex flex-col items-center gap-2 p-6 text-center sm:flex-row sm:text-start">
        <Avatar user={user} size="lg" />
        <div className="sm:ms-3">
          <h1 className="text-2xl font-bold text-stone-900">{user.name}</h1>
          <p className="flex items-center justify-center gap-1 text-sm text-stone-500 sm:justify-start">
            {location && (
              <>
                <MapPinIcon className="h-4 w-4 text-earth-400" />
                <LocationText location={location} />
                {" · "}
              </>
            )}
            {tMessages("memberSince", { date: format.dateTime(user.createdAt, { month: "long", year: "numeric" }) })}
          </p>
          {user.bio && <p className="mt-2 max-w-xl whitespace-pre-line text-stone-700">{user.bio}</p>}
        </div>
      </section>
      <h2 className="mb-4 text-xl font-bold text-stone-900">{t("listings", { name: user.name })}</h2>
      {listings.length ? <ListingGrid listings={listings} /> : <EmptyState icon="🧺" title={t("noListings")} />}
    </div>
  );
}
