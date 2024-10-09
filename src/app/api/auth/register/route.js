import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser, getUserByEmail } from "@/lib/user";
import prisma from "@/lib/prisma"; // Assuming you are using Prisma

export async function POST(request) {
  try {
    const { name, email, password, provider, profilePicture } =
      await request.json();

    // Validate the input for both Google OAuth and email/password registration
    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required." },
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

    // Handle email/password registration
    if (!provider) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required for email registration." },
          { status: 400 }
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user with email/password
      const newUser = await createUser({
        username: name,
        email: email,
        password: hashedPassword,
      });

      // Respond with success
      return NextResponse.json(
        { message: "User registered successfully!", user: newUser },
        { status: 201 }
      );
    }

    // Handle Google OAuth registration
    if (provider === "Google") {
      const newUser = await prisma.user.create({
        data: {
          username: name,
          email: email,
          provider: "Google",
          profile: {
            create: {
              firstName: name.split(" ")[0],
              lastName: name.split(" ")[1] || "",
              profilePicture: profilePicture || null,
            },
          },
        },
      });

      // Respond with success
      return NextResponse.json(
        { message: "Google user registered successfully!", user: newUser },
        { status: 201 }
      );
    }

    // If no valid registration type is provided
    return NextResponse.json(
      { error: "Invalid registration method." },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
