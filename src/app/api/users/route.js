// src/app/api/users/route.js
import { createUser, getUserByEmail } from "@/lib/user";
import { NextResponse } from "next/server";

// POST route to create a new user
export async function POST(request) {
  try {
    const data = await request.json();

    // Basic validation for required fields
    if (!data.email || !data.username || !data.password) {
      return NextResponse.json(
        { error: "username, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }
    console.log(data.toString());
    // Create the new user (using the helper function)
    const newUser = await createUser({
      name: data.name,
      email: data.email,
      password: data.password, // Password will be hashed in the helper
    });

    // Return the created user with status 201
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error

    // Internal server error, do not expose details to the user
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}
