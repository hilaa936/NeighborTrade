import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { route } from "@/server/errors";
import { markRead } from "@/server/chat";

export const POST = route(async (request, { params }) => {
  const { id } = await params;
  await markRead(await requireUser(), id);
  return NextResponse.json({ ok: true });
});
