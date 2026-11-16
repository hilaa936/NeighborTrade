"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CATEGORIES, DISTANCE_OPTIONS } from "@/lib/options";

// Filters live in the URL so results can be shared and survive a refresh
export default function MarketFilters({ hasLocation }) {
  const t = useTranslations("market");
  const tCategory = useTranslations("categories");
  const tOffer = useTranslations("offer");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const update = (changes) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const category = params.get("category") ?? "";

  return (
    <div className="mb-5 space-y-3">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          update({ q: q.trim() });
        }}
        className="relative"
      >
        <MagnifyingGlassIcon className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          onBlur={() => q.trim() !== (params.get("q") ?? "") && update({ q: q.trim() })}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          className="input rounded-full ps-11"
          maxLength={60}
        />
      </form>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {["", ...CATEGORIES].map((key) => (
          <button
            key={key || "all"}
            type="button"
            onClick={() => update({ category: key })}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              category === key
                ? "border-leaf-600 bg-leaf-600 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
          >
            {key ? tCategory(key) : t("allCategories")}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={params.get("offer") ?? ""}
          onChange={(event) => update({ offer: event.target.value })}
          className="input w-auto rounded-full py-1.5 text-sm"
          aria-label={t("anyOffer")}
        >
          <option value="">{t("anyOffer")}</option>
          <option value="free">{tOffer("free")}</option>
          <option value="exchange">{tOffer("exchange")}</option>
          <option value="offers">{tOffer("offers")}</option>
        </select>
        {hasLocation && (
          <select
            value={params.get("maxKm") ?? ""}
            onChange={(event) => update({ maxKm: event.target.value })}
            className="input w-auto rounded-full py-1.5 text-sm"
            aria-label={t("anyDistance")}
          >
            <option value="">{t("anyDistance")}</option>
            {DISTANCE_OPTIONS.map((km) => (
              <option key={km} value={km}>
                {t("withinKm", { km })}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
