import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { listConversations, startConversation } from "@/server/chat";

export const GET = route(async () => {
  const user = await requireUser();
  return NextResponse.json({ conversations: await listConversations(user) });
});

export const POST = route(async (request) => {
  const user = await requireUser();
  const { listingId } = z.object({ listingId: z.string().min(1) }).parse(await readJson(request));
  const conversation = await startConversation(user, listingId);
  return NextResponse.json({ conversation: { id: conversation.id } });
});
