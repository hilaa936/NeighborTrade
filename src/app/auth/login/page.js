import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { safeCallbackUrl } from "@/lib/api";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("loginTitle") };
}

export default async function LoginPage({ searchParams }) {
  const callbackUrl = safeCallbackUrl((await searchParams).callbackUrl);
  if (await getCurrentUser()) redirect(callbackUrl);
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("loginTitle")}>
      <LoginForm callbackUrl={callbackUrl} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)} />
    </AuthCard>
  );
}
