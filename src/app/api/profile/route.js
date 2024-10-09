import { getServerSession } from "next-auth/next"; // Import session handling
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth configuration
import prisma from "@/lib/prisma"; // Import Prisma Client

// Handle GET and POST requests to /api/profile
export async function GET(request) {
  // Get the session for the current request
  const session = await getServerSession(authOptions);

  // If no session exists, return unauthorized
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = session.user.id; // The logged-in user's UUID

  try {
    // Find the user's profile based on the userId
    const profile = await prisma.profile.findUnique({
      where: { userId }, // Find the profile by userId
    });

    // If the profile does not exist, return 404
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
      });
    }

    // Return the profile data
    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ error: "Error fetching profile" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  // Get the session for the current request
  const session = await getServerSession({ req: request }, authOptions);
  // If no session exists, return unauthorized
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = session.user.id; // The logged-in user's UUID
  const body = await request.json(); // Get the data from the request body

  const {
    profilePicture,
    firstName,
    lastName,
    bio,
    phoneNumber,
    location,
    website,
    birthdate,
  } = body;

  try {
    // Check if the profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      // If profile exists, update it
      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: {
          profilePicture,
          firstName,
          lastName,
          bio,
          phoneNumber,
          location,
          website,
          birthdate: birthdate ? new Date(birthdate) : null, // Convert birthdate to Date
        },
      });

      return new Response(JSON.stringify(updatedProfile), { status: 200 });
    } else {
      // If profile does not exist, create it
      const newProfile = await prisma.profile.create({
        data: {
          userId,
          profilePicture,
          firstName,
          lastName,
          bio,
          phoneNumber,
          location,
          website,
          birthdate: birthdate ? new Date(birthdate) : null, // Convert birthdate to Date
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
