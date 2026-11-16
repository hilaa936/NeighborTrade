"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import UnreadBadge from "./UnreadBadge";
import { NAV_ICONS, isActive, isChatScreen } from "./navItems";

const ITEMS = [
  { key: "market", href: "/market" },
  { key: "messages", href: "/messages", badge: true },
  { key: "publish", href: "/listings/new", primary: true },
  { key: "myListings", href: "/my-listings" },
  { key: "me", href: "/profile" },
];

// Mobile tab bar, like a messaging app
export default function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { status } = useSession();
  if (status !== "authenticated" || isChatScreen(pathname)) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITEMS.map(({ key, href, badge, primary }) => {
          const Icon = NAV_ICONS[key];
          const active = isActive(pathname, href);
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  primary ? "text-leaf-700" : active ? "text-leaf-700" : "text-stone-500"
                }`}
              >
                <Icon className={primary ? "h-8 w-8" : "h-6 w-6"} />
                {!primary && t(key)}
                {badge && <UnreadBadge className="absolute start-1/2 top-1 ms-2" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
