import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { route } from "@/server/errors";
import { listMyTrades } from "@/server/trades";

export const GET = route(async () => {
  const user = await requireUser();
  return NextResponse.json({ trades: await listMyTrades(user) });
});
