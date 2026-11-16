"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@heroicons/react/24/solid";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import UnreadBadge from "./UnreadBadge";
import { isActive, isChatScreen } from "./navItems";

const LINKS = [
  { key: "market", href: "/market" },
  { key: "messages", href: "/messages", badge: true },
  { key: "myListings", href: "/my-listings" },
  { key: "trades", href: "/trades" },
];

export default function TopBar({ user }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { status } = useSession();
  const loggedIn = status === "authenticated" || (status === "loading" && user);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-stone-200/70 bg-white/90 backdrop-blur ${
        isChatScreen(pathname) ? "hidden md:block" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Logo />
        {loggedIn && (
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ key, href, badge }) => (
              <Link
                key={key}
                href={href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  isActive(pathname, href) ? "bg-leaf-50 text-leaf-800" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {t(key)}
                {badge && <UnreadBadge />}
              </Link>
            ))}
          </nav>
        )}
        <div className="ms-auto flex items-center gap-2">
          {loggedIn ? (
            <>
              <Link href="/listings/new" className="btn btn-primary hidden md:inline-flex">
                <PlusIcon className="h-4 w-4" />
                {t("newListing")}
              </Link>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link href="/market" className="btn btn-ghost hidden sm:inline-flex">
                {t("market")}
              </Link>
              <Link href="/auth/login" className="btn btn-secondary">
                {t("login")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({ user }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (event) => !ref.current?.contains(event.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-400"
        aria-label={t("menu")}
        aria-expanded={open}
      >
        <Avatar user={user} size="sm" />
      </button>
      {open && (
        <div
          className="absolute end-0 mt-2 w-52 overflow-hidden rounded-2xl border border-stone-200 bg-white py-1 shadow-lg"
          onClick={() => setOpen(false)}
        >
          <p className="truncate px-4 py-2 text-sm font-semibold text-stone-800">{user?.name}</p>
          <MenuLink href="/profile">
            {t("profile")}
          </MenuLink>
          <MenuLink href="/my-listings">{t("myListings")}</MenuLink>
          <MenuLink href="/trades">{t("trades")}</MenuLink>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-4 py-2 text-start text-sm text-red-700 hover:bg-red-50"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children }) {
  return (
    <Link href={href} className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
      {children}
    </Link>
  );
}
