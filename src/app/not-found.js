import Link from "next/link";
import { getTranslations } from "next-intl/server";
import EmptyState from "@/components/ui/EmptyState";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <div className="page max-w-lg">
      <EmptyState icon="🥀" title={t("notFoundTitle")} hint={t("notFoundBody")}>
        <Link href="/" className="btn btn-primary">
          {t("home")}
        </Link>
      </EmptyState>
    </div>
  );
}
