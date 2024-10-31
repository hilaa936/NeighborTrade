// src/utils/formatDate.js
export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// utils/dateUtils.js

/**
 * Calculate the difference between two dates in months and days.
 * @param {string | Date} startDate - The start date (in 'YYYY-MM-DD' format or Date object).
 * @param {string | Date} endDate - The end date (in 'YYYY-MM-DD' format or Date object).
 * @returns {string} A readable string showing the difference in months and days.
 */
export function getDateDifference(startDate, endDate) {
  // Convert to Date objects if the inputs are strings
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffInMs = end - start;

  // Edge case: if the end date is before the start date, return "Invalid dates"
  if (diffInMs < 0) return "Invalid date range";

  // Calculate the difference in days
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Calculate months and remaining days
  const months = Math.floor(days / 30); // Approximate months
  const remainingDays = days % 30;

  // Generate a readable result string
  return months > 0
    ? `${months} month${months > 1 ? "s" : ""} and ${remainingDays} day${
        remainingDays > 1 ? "s" : ""
      }`
    : `${days} day${days > 1 ? "s" : ""}`;
}
