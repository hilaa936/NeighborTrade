import accountsClient from "@/lib/prisma/accountsClient";
import travelClient from "@/lib/prisma/travelClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth configuration
import { getUserByEmail } from "@/lib/user";

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
    if (!session || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from AccountsDB
    const user = await getUserByEmail(session.user.email);

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

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Fetch trips for the authenticated user
    const trips = await travelClient.userTrip.findMany({
      where: { userId },
    });
    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return res.status(500).json({ error: "Failed to retrieve trips" });
  }
}
