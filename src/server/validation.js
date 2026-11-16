import { z } from "zod";
import { CATEGORIES, EXPIRY_OPTIONS, LIMITS, MAX_IMAGES, UNITS } from "@/lib/options";
import { getLocality } from "@/lib/localities";

const text = (max) => z.string().trim().max(max);
const optionalText = (max) =>
  text(max)
    .optional()
    .nullable()
    .transform((v) => v || null);

// Only images that our own upload endpoint produced
const imageUrl = z.string().regex(/^\/api\/uploads\/[a-z0-9]+\.webp$/);

const localityId = z
  .string()
  .refine((id) => getLocality(id), "unknown_locality")
  .optional()
  .nullable();

export const registerSchema = z.object({
  name: text(LIMITS.name).min(2),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(LIMITS.passwordMin).max(LIMITS.passwordMax),
});

export const profileSchema = z.object({
  name: text(LIMITS.name).min(2),
  bio: optionalText(LIMITS.bio),
  image: imageUrl.optional().nullable(),
  localityId,
  lat: z.number().min(29).max(34).optional().nullable(),
  lng: z.number().min(34).max(36).optional().nullable(),
});

const listingFields = {
  title: text(LIMITS.title).min(2),
  description: optionalText(LIMITS.description),
  category: z.enum(CATEGORIES),
  customCategory: optionalText(LIMITS.customCategory),
  quantity: z.number().positive().max(100000),
  unit: z.enum(UNITS),
  isFree: z.boolean(),
  isExchange: z.boolean(),
  wanted: optionalText(LIMITS.wanted),
  openToOffers: z.boolean(),
  images: z.array(imageUrl).max(MAX_IMAGES).default([]),
  expiry: z.enum(EXPIRY_OPTIONS),
};

// At least one way to get the produce must be chosen
const hasOfferType = (l) => l.isFree || l.isExchange || l.openToOffers;

export const listingSchema = z
  .object(listingFields)
  .refine(hasOfferType, { message: "offer_type_required", path: ["isFree"] })
  .refine((l) => l.category !== "other" || l.customCategory, {
    message: "custom_category_required",
    path: ["customCategory"],
  });

export const listingActionSchema = z.object({
  action: z.enum(["pause", "resume", "renew"]),
  expiry: z.enum(EXPIRY_OPTIONS).optional(),
});

export const searchSchema = z.object({
  q: text(60).optional().catch(undefined),
  category: z.enum(CATEGORIES).optional().catch(undefined),
  offer: z.enum(["free", "exchange", "offers"]).optional().catch(undefined),
  maxKm: z.coerce.number().int().positive().max(500).optional().catch(undefined),
});

export const messageSchema = z.object({
  body: text(LIMITS.message).min(1),
});

export const tradeProposalSchema = z.object({
  quantity: z.number().positive().max(100000),
  terms: text(LIMITS.terms).min(1),
});

export const tradeActionSchema = z.object({
  action: z.enum(["accept", "decline", "withdraw", "complete", "cancel"]),
});
