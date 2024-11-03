import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/user";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Validate the input for both Google OAuth and email/password registration
    if (!email || !username) {
      return NextResponse.json(
        { error: "Username and email are required." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    // Create the new user with email/password
    const newUser = await createUser({
      username: username,
      email: email,
      password: password,
    });

    // Respond with success
    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific error messages
    const errorMessage =
      error.message || "Something went wrong with the registration.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
