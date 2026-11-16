import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import ListingForm from "@/components/listings/ListingForm";

export async function generateMetadata() {
  const t = await getTranslations("form");
  return { title: t("newTitle") };
}

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?callbackUrl=/listings/new");
  const t = await getTranslations("form");
  return (
    <div className="page max-w-2xl">
      <h1 className="page-title mb-5">{t("newTitle")}</h1>
      <ListingForm hasLocation={user.lat != null} />
    </div>
  );
}
