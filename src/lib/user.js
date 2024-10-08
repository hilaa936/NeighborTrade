//lib/user.js
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Fetch user by email
export const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error("Email must be provided");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

// Verify user's password
export const verifyUserPassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new Error("Both password and hashedPassword must be provided");
  }

  const isValid = await bcrypt.compare(password, hashedPassword);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  return isValid;
};

// Create a new user (with automatic password hashing)
export const createUser = async ({ username, email, password }) => {
  if (!username || !email || password == null) {
    throw new Error("Username, email, and password are required");
  }

  try {
    // Hash the password
    const passwordHash = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : null;

    // Create user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
    });

    return newUser;
  } catch (error) {
    // Handle email uniqueness error
    if (error.code === "P2002" && error.meta.target.includes("email")) {
      throw new Error("A user with this email already exists.");
    }
    throw error; // Propagate other errors
  }
};
