import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { route } from "@/server/errors";
import { getConversationDetails } from "@/server/chat";

export const GET = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  return NextResponse.json({ conversation: await getConversationDetails(user, id) });
});
