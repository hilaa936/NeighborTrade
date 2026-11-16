import {
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  PlusCircleIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const isActive = (pathname, href) => pathname === href || pathname.startsWith(`${href}/`);

// Chat screens on mobile are full-screen, like a messaging app
export const isChatScreen = (pathname) => /^\/messages\/[^/]+/.test(pathname);

export const NAV_ICONS = {
  market: BuildingStorefrontIcon,
  messages: ChatBubbleLeftRightIcon,
  publish: PlusCircleIcon,
  myListings: Squares2X2Icon,
  me: UserCircleIcon,
};
