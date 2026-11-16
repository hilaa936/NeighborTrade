import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { proposeTrade } from "@/server/trades";

export const POST = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  const trade = await proposeTrade(user, id, await readJson(request));
  return NextResponse.json({ trade }, { status: 201 });
});
