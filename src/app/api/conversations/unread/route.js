import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { route } from "@/server/errors";
import { unreadCount } from "@/server/chat";

export const GET = route(async () => {
  const user = await getCurrentUser();
  return NextResponse.json({ count: user ? await unreadCount(user) : 0 });
});
