import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/server/auth";
import { searchListings } from "@/server/listings";
import ListingGrid from "@/components/listings/ListingGrid";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/market");

  const t = await getTranslations("home");
  const latest = (await searchListings({}, null)).slice(0, 8);
  const steps = [
    { icon: "🧺", title: t("step1Title"), text: t("step1") },
    { icon: "💬", title: t("step2Title"), text: t("step2") },
    { icon: "🤝", title: t("step3Title"), text: t("step3") },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-leaf-50 to-sand">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center sm:py-20">
          <span className="text-5xl" aria-hidden>
            🍅🌿🍋
          </span>
          <h1 className="text-balance text-3xl font-extrabold text-leaf-900 sm:text-5xl">{t("title")}</h1>
          <p className="max-w-xl text-balance text-lg text-stone-600">{t("subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/market" className="btn btn-primary px-7 py-3 text-base">
              {t("browse")}
            </Link>
            <Link href="/auth/register" className="btn btn-secondary px-7 py-3 text-base">
              {t("publish")}
            </Link>
          </div>
        </div>
      </section>

      <section className="page">
        <h2 className="mb-4 text-xl font-bold text-stone-900">{t("howTitle")}</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="card flex gap-3 p-4">
              <span className="text-3xl" aria-hidden>
                {step.icon}
              </span>
              <div>
                <h3 className="font-semibold text-stone-900">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-sm text-stone-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {latest.length > 0 && (
        <section className="page pt-0">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-stone-900">{t("latest")}</h2>
            <Link href="/market" className="text-sm font-medium text-leaf-700 hover:underline">
              {t("seeAll")}
            </Link>
          </div>
          <ListingGrid listings={latest} />
        </section>
      )}
    </>
  );
}
