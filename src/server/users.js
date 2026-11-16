import bcrypt from "bcrypt";
import { db } from "./db";
import { ApiError, notFound } from "./errors";
import { profileSchema, registerSchema } from "./validation";
import { resolveLocation } from "@/lib/geo";

const SALT_ROUNDS = 10;

// Fields that are safe to send to the user themselves
const selfFields = {
  id: true,
  email: true,
  name: true,
  image: true,
  bio: true,
  localityId: true,
  lat: true,
  lng: true,
  provider: true,
  createdAt: true,
};

export async function registerUser(input) {
  const { name, email, password } = registerSchema.parse(input);
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "email_taken");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return db.user.create({ data: { name, email, passwordHash }, select: { id: true, name: true, email: true } });
}

// Returns the user when the password matches, otherwise null
export async function verifyCredentials(email, password) {
  if (!email || !password) return null;
  const user = await db.user.findUnique({ where: { email: String(email).trim().toLowerCase() } });
  if (!user?.passwordHash) return null;
  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) return null;
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return user;
}

// Creates or updates the local user for a Google sign-in
export async function upsertOAuthUser({ email, name, image, provider }) {
  const normalized = email.trim().toLowerCase();
  return db.user.upsert({
    where: { email: normalized },
    create: { email: normalized, name: (name || normalized.split("@")[0]).slice(0, 40), image, provider },
    update: { lastLoginAt: new Date() },
  });
}

export const getUserById = (id) => db.user.findUnique({ where: { id }, select: selfFields });

export async function updateProfile(userId, input) {
  const data = profileSchema.parse(input);
  const location = resolveLocation(data);
  return db.user.update({
    where: { id: userId },
    // `image` left out keeps the current picture (e.g. from Google); null removes it
    data: { name: data.name, bio: data.bio, ...(data.image !== undefined && { image: data.image }), ...location },
    select: selfFields,
  });
}

// Public view of a user: never email or coordinates
export async function getPublicProfile(id) {
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, name: true, image: true, bio: true, localityId: true, lat: true, lng: true, createdAt: true },
  });
  if (!user) throw notFound();
  return user;
}
