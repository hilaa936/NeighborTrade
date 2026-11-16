import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { badRequest, route } from "@/server/errors";
import { rateLimit } from "@/server/rateLimit";
import { saveImage } from "@/server/uploads";

export const POST = route(async (request) => {
  const user = await requireUser();
  rateLimit(`upload:${user.id}`, { limit: 30, windowMs: 60 * 60_000 });
  let form;
  try {
    form = await request.formData();
  } catch {
    throw badRequest("no_file");
  }
  const url = await saveImage(form.get("file"));
  return NextResponse.json({ url }, { status: 201 });
});
