// app/api/trips/[tripId]/route.js
import travelClient from "@/lib/prisma/travelClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth configuration
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = params;

  try {
    const trip = await travelClient.userTrip.findUnique({
      where: { id: Number(tripId) },
    });

    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip:", error);

    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { tripId } = params;

  try {
    await travelClient.userTrip.delete({
      where: { id: Number(tripId) },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return new Response(JSON.stringify({ error: "Failed to delete trip" }), {
      status: 500,
    });
  }
}
