// src/app/api/travel/userActivities/[id]/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as userActivitiesService from "@/lib/travel/userActivity";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params; // Get the user activity ID from the URL parameters

  try {
    const userActivity = await userActivitiesService.getUserActivity(id);

    if (!userActivity) {
      return new Response(
        JSON.stringify({ message: "User activity not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(userActivity), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
