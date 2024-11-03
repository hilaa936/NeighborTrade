import { travelClient } from "@/lib/prisma/travelClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Helper function to parse JSON request body
async function parseRequestBody(request) {
  return await request.json();
}

// Endpoint: Get All Activities
export async function GET(req) {
  try {
    const activities = await travelClient.activity.findMany();
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

// Endpoint: Add Activity
export async function POST(request) {
  const { name, description, location, destination, time } =
    await parseRequestBody(request);

  try {
    const newActivity = await travelClient.activity.create({
      data: {
        name,
        description,
        location,
        destination,
        time: time.toString(), // Ensure time is in Date format
      },
    });
    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Error creating activity" },
      { status: 500 }
    );
  }
}

// Endpoint: Like or Toggle Like Activity
export async function PATCH(request) {
  const { userId, activityId } = await parseRequestBody(request);

  try {
    // Check if the like already exists for the user and activity
    const existingLike = await travelClient.userActivity.findUnique({
      where: { userId_activityId: { userId, activityId } },
    });

    if (existingLike) {
      // Toggle the like status
      const updatedLike = await travelClient.userActivity.update({
        where: { userId_activityId: { userId, activityId } },
        data: { like: !existingLike.like },
      });
      return NextResponse.json(updatedLike, { status: 200 });
    } else {
      // Create a new like entry if it does not exist
      const newLike = await travelClient.userActivity.create({
        data: {
          userId,
          activityId,
          like: true,
        },
      });
      return NextResponse.json(newLike, { status: 201 });
    }
  } catch (error) {
    console.error("Error liking activity:", error);
    return NextResponse.json(
      { error: "Error liking activity" },
      { status: 500 }
    );
  }
}

// Endpoint: Unlike Activity (Toggle to false without deletion)
export async function DELETE(request) {
  const { userId, activityId } = await parseRequestBody(request);

  try {
    // Update the like status to false instead of deleting the entry
    const updatedLike = await travelClient.userActivity.update({
      where: {
        userId_activityId: { userId, activityId },
      },
      data: { like: false },
    });
    return NextResponse.json(
      { message: "Activity unliked successfully", data: updatedLike },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unliking activity:", error);
    return NextResponse.json(
      { error: "Error unliking activity" },
      { status: 500 }
    );
  }
}
