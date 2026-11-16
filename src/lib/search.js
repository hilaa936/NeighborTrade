// Hebrew final letters (ך ם ן ף ץ) become their regular forms, so "לימון" finds "לימונים"
const FINAL_LETTERS = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };

export function normalizeSearch(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[֑-ׇ]/g, "") // Hebrew vowel marks (niqqud)
    .replace(/[ךםןףץ]/g, (c) => FINAL_LETTERS[c])
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
