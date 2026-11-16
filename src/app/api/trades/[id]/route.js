import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { actOnTrade } from "@/server/trades";

export const PATCH = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  const trade = await actOnTrade(user, id, await readJson(request));
  return NextResponse.json({ trade });
});
