import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "@/lib/user";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate the input (basic validation)
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
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

    // Create the new user in the database
    const newUser = await createUser({
      username: name,
      email: email,
      password: hashedPassword, // Store the hashed password
    });

    // Respond with success
    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
