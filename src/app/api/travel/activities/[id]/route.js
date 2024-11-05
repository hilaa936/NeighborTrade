// src/app/api/travel/activities/[id]/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as activitiesService from "@/lib/travel/activities";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = params; // Get the activity ID from the URL parameters

  try {
    const activity = await activitiesService.getActivityById(id);

    if (!activity) {
      return new Response(JSON.stringify({ message: "Activity not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(activity), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
