import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { getMessages, sendMessage } from "@/server/chat";
import { rateLimit } from "@/server/rateLimit";

// ?after=<ISO date> returns only newer messages (used for polling)
export const GET = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  const after = request.nextUrl.searchParams.get("after");
  return NextResponse.json({ messages: await getMessages(user, id, { after }) });
});

export const POST = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  rateLimit(`message:${user.id}`, { limit: 30, windowMs: 60_000 });
  const message = await sendMessage(user, id, await readJson(request));
  return NextResponse.json({ message }, { status: 201 });
});
