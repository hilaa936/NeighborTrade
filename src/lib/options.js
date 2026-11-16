// Fixed option lists shared by forms, filters and validation; labels live in messages/*.json

export const CATEGORIES = ["vegetables", "fruits", "herbs", "plants", "seeds", "other"];

export const UNITS = ["KG", "UNIT", "BUNCH", "BAG", "POT"];

// Listing lifetime in days; "always" means the listing never expires
export const EXPIRY_OPTIONS = ["3", "7", "14", "30", "always"];
export const DEFAULT_EXPIRY = "14";

export const DISTANCE_OPTIONS = [5, 10, 25, 50];

export const MAX_IMAGES = 3;

export const LIMITS = {
  name: 40,
  bio: 500,
  title: 60,
  description: 1000,
  wanted: 200,
  customCategory: 30,
  message: 2000,
  terms: 200,
  passwordMin: 8,
  passwordMax: 128,
};
