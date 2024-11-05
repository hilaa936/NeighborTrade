// src/app/api/travel/userActivities/route.js

import { getServerSession } from "next-auth";
import { addUserActivity, getUserActivities } from "@/lib/travel/userActivity";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    // Get all user activities for the authenticated user
    const userActivities = await getUserActivities(userId);
    return NextResponse.json(userActivities, { status: 200 });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    return NextResponse.json(
      { error: "Error fetching user activities" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const userActivityData = await request.json();

  try {
    // Get session to identify the logged-in user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //validate authorize
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const user = session.user;
    //create new userActivity
    const newUserActivity = await addUserActivity(user.id, userActivityData);

    return NextResponse.json(newUserActivity, { status: 201 });
  } catch (error) {
    console.error("Error creating user activity:", error);
    return NextResponse.json(
      { error: "Error creating user activity" },
      { status: 500 }
    );
  }
}
