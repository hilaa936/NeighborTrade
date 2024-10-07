// src/app/api/users/route.js
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  const data = await request.json();

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hashedPassword, // Store the hashed password
        isGrower: data.isGrower || false,
        profilePicture: data.profilePicture || null,
        contactInfo: data.contactInfo || null,
      },
    });
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error); // Log the specific error
    return new Response(
      JSON.stringify({ error: "User creation failed", details: error.message }),
      { status: 500 }
    );
  }
}
