import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const preferences = await request.json();

    const itinerary = {
      days: [
        {
          date: preferences.startDate,
          activities: [
            { type: "sightseeing", name: "City Tour", time: "10:00 AM" },
            { type: "dining", name: "Local Restaurant", time: "12:00 PM" },
          ],
        },
        {
          date: preferences.endDate,
          activities: [
            { type: "shopping", name: "Market Visit", time: "10:00 AM" },
            { type: "sightseeing", name: "Museum Tour", time: "2:00 PM" },
          ],
        },
      ],
    };

    return NextResponse.json(itinerary, { status: 200 });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json(
      { message: "Error generating itinerary" },
      { status: 500 }
    );
  }
}
