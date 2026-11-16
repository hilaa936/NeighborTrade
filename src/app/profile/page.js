import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import ProfileForm from "@/components/profile/ProfileForm";
import { safeCallbackUrl } from "@/lib/api";

export async function generateMetadata() {
  const t = await getTranslations("profile");
  return { title: t("title") };
}

export default async function ProfilePage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?callbackUrl=/profile");
  const { next } = await searchParams;
  const t = await getTranslations("profile");
  return (
    <div className="page max-w-xl">
      <h1 className="page-title mb-5">{t("title")}</h1>
      <ProfileForm user={user} next={next ? safeCallbackUrl(next) : null} />
    </div>
  );
}
