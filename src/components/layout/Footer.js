"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  // The messenger fills the screen; no footer there
  if (pathname.startsWith("/messages")) return null;
  return (
    <footer className="border-t border-stone-200/70 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-stone-500 sm:flex-row">
        <p>{t("note")}</p>
        <nav className="flex gap-4">
          <Link href="/terms" className="hover:text-stone-800">
            {t("terms")}
          </Link>
          <Link href="/privacy" className="hover:text-stone-800">
            {t("privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
