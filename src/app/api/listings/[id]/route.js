import { NextResponse } from "next/server";
import { getCurrentUser, requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { applyListingAction, deleteListing, getListing, updateListing } from "@/server/listings";

export const GET = route(async (request, { params }) => {
  const { id } = await params;
  return NextResponse.json({ listing: await getListing(id, await getCurrentUser()) });
});

// Full edit of the listing fields
export const PUT = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  await updateListing(user, id, await readJson(request));
  return NextResponse.json({ ok: true });
});

// Status actions: pause, resume, renew
export const PATCH = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  await applyListingAction(user, id, await readJson(request));
  return NextResponse.json({ ok: true });
});

export const DELETE = route(async (request, { params }) => {
  const { id } = await params;
  const user = await requireUser();
  await deleteListing(user, id);
  return NextResponse.json({ ok: true });
});
