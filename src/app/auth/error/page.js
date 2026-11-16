import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AuthCard from "@/components/auth/AuthCard";

// NextAuth sends sign-in failures here (?error=...); the code itself is not shown to users
export default async function AuthErrorPage() {
  const t = await getTranslations("auth");
  return (
    <AuthCard title={t("errorTitle")}>
      <p className="text-center text-stone-600">{t("errorBody")}</p>
      <Link href="/auth/login" className="btn btn-primary w-full">
        {t("backToLogin")}
      </Link>
    </AuthCard>
  );
}
