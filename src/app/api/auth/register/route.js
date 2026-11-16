import { NextResponse } from "next/server";
import { readJson, route } from "@/server/errors";
import { clientIp, rateLimit } from "@/server/rateLimit";
import { registerUser } from "@/server/users";

export const POST = route(async (request) => {
  rateLimit(`register:${clientIp(request)}`, { limit: 5, windowMs: 60 * 60_000 });
  const user = await registerUser(await readJson(request));
  return NextResponse.json({ user }, { status: 201 });
});
