import { NextResponse } from "next/server";
import { getCurrentUser, requireUser } from "@/server/auth";
import { readJson, route } from "@/server/errors";
import { createListing, searchListings } from "@/server/listings";

export const GET = route(async (request) => {
  const viewer = await getCurrentUser();
  const params = Object.fromEntries(request.nextUrl.searchParams);
  return NextResponse.json({ listings: await searchListings(params, viewer) });
});

export const POST = route(async (request) => {
  const user = await requireUser();
  const listing = await createListing(user, await readJson(request));
  return NextResponse.json({ listing: { id: listing.id } }, { status: 201 });
});
