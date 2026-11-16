import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { updateProfile } from "@/server/users";

export const GET = route(async () => NextResponse.json({ user: await requireUser() }));

export const PUT = route(async (request) => {
  const user = await requireUser();
  return NextResponse.json({ user: await updateProfile(user.id, await readJson(request)) });
});
