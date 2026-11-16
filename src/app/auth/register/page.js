import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { safeCallbackUrl } from "@/lib/api";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("registerTitle") };
}

export default async function RegisterPage({ searchParams }) {
  const callbackUrl = safeCallbackUrl((await searchParams).callbackUrl);
  if (await getCurrentUser()) redirect(callbackUrl);
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("registerTitle")}>
      <RegisterForm callbackUrl={callbackUrl} googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID)} />
    </AuthCard>
  );
}
