import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions
import prisma from "@/lib/prisma"; // Prisma Client

export async function GET(request) {
  // Get the user session
  const session = await getServerSession(authOptions);

  // If the user is not authenticated, return a 401 Unauthorized error
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = session.user.id;

  try {
    // Fetch the user's profile from the database
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ error: "Error fetching profile" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  // If no session, return unauthorized
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { profilePicture, contactInfo, type } = await request.json();
  const userId = session.user.id;

  try {
    // Check if the profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      // Update the profile if it exists
      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: {
          profilePicture,
          contactInfo,
          type,
        },
      });
      return new Response(JSON.stringify(updatedProfile), { status: 200 });
    } else {
      // Create a new profile if it doesn't exist
      const newProfile = await prisma.profile.create({
        data: {
          userId,
          profilePicture,
          contactInfo,
          type: type || "BEGIN", // Default to BEGIN if type is not provided
        },
      });
      return new Response(JSON.stringify(newProfile), { status: 201 });
    }
  } catch (error) {
    console.error("Error updating or creating profile:", error);
    return new Response(
      JSON.stringify({ error: "Error updating or creating profile" }),
      { status: 500 }
    );
  }
}
