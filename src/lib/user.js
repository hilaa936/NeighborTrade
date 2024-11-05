//lib/user.js
import bcrypt from "bcrypt";
import accountsClient from "./prisma/accountsClient";

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Fetch user by email
export const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error("Email must be provided");
  }

  const user = await accountsClient.user.findUnique({
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
export const createUser = async ({
  username,
  email,
  password = "",
  picture = "",
  provider = "Email",
  providerId = "",
  firstName = "",
  lastName = "",
}) => {
  if (
    provider === "Email" &&
    (!username || !email || !password || password.length < 1)
  ) {
    throw new Error("Username, email, and password are required");
  }

  try {
    // Hash the password
    const passwordHash = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : null;

    // Create user in the database
    const newUser = await accountsClient.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        provider: provider,
        providerId: providerId,
        image: picture,
        profile: {
          create: {
            firstName: firstName,
            lastName: lastName,
            profilePicture: picture,
          },
        },
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

export const UpdateUserLastLogin = async ({ email }) => {
  // Update user last login info
  await accountsClient.user.update({
    where: { email: email },
    data: { lastLogin: new Date() },
  });
};

//profile
export const createNewProfile = async (userId, profileData) => {
  const newProfile = await accountsClient.profile.create({
    data: {
      userId,
      ...profileData,
    },
  });

  return newProfile;
};
export const updateProfile = async (userId, profileData) => {
  const {
    profilePicture,
    firstName,
    lastName,
    bio,
    phoneNumber,
    location,
    website,
    birthdate,
  } = profileData;
  // birthdate = birthdate ? new Date(birthdate) : null; // Convert birthdate to Date
  // If profile exists, update it
  const updatedProfile = await accountsClient.profile.update({
    where: { userId },
    data: profileData,
  });

  return updatedProfile;
};
export const getProfileByUserId = async ({ userId }) => {
  const profile = await accountsClient.profile.findUnique({
    where: { userId }, // Find the profile by userId
  });

  return profile;
};
