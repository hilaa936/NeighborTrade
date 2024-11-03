import accountsClient from "@/lib/prisma/accountsClient";
import travelClient from "@/lib/prisma/travelClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const {
    name,
    userPreferences,
    tripStartDate,
    tripEndDate,
    tripType,
    destination,
  } = await request.json();

  try {
    // Get session to identify the logged-in user
    const session = await getServerSession({ request });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from AccountsDB
    const user = await accountsClient.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new trip in TravelDB
    const newTrip = await travelClient.userTrip.create({
      data: {
        name,
        userId: user.id,
        userPreferences,
        tripStartDate: tripStartDate ? new Date(tripStartDate) : null,
        tripEndDate: tripEndDate ? new Date(tripEndDate) : null,
        tripType,
        destination,
      },
    });
    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "Error creating trip" }, { status: 500 });
  }
}
