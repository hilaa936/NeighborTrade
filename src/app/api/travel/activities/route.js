// src/app/api/travel/activities/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as activitiesLib from "@/lib/travel/activities";
import accountsClient from "@/lib/prisma/accountsClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // Get all activities
  const activities = await activitiesLib.getAllActivities();
  return new Response(JSON.stringify(activities), { status: 200 });
}

export async function POST(request) {
  const activityData = await request.json();

  try {
    //create new activity
    const newActivity = await activitiesLib.createActivity(activityData);
    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Error creating activity" },
      { status: 500 }
    );
  }
}
