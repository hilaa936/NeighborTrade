import { getTranslations } from "next-intl/server";

// Desktop placeholder next to the list; on mobile the list fills the screen instead
export default async function MessagesPage() {
  const t = await getTranslations("messages");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-sand/60 text-stone-500">
      <span className="text-5xl" aria-hidden>
        💬
      </span>
      <p>{t("select")}</p>
    </div>
  );
}
