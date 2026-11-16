// Adding a language: add its code here and a messages/<code>.json file
export const LOCALES = ["he"];
export const DEFAULT_LOCALE = "he";
export const LOCALE_COOKIE = "NEXT_LOCALE";

const RTL_LOCALES = ["he", "ar"];
export const directionOf = (locale) => (RTL_LOCALES.includes(locale) ? "rtl" : "ltr");
