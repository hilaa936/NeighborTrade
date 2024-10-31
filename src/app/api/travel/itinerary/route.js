// src/app/api/mock-itinerary/route.js

import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
const getMockData = async () => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "mockItinerary.json"
  );

  // Read the contents of the JSON file
  const data = await fs.readFile(filePath, "utf-8");

  // Parse the JSON data
  const itinerary = JSON.parse(data);
  return itinerary;
};
export async function GET() {
  try {
    const itinerary = await getMockData();

    // Return the itinerary data as JSON
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Error reading mock itinerary:", error);
    return NextResponse.json(
      { error: "Failed to load mock itinerary" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const { destination, days, interests } = await request.json(); // Parse user input from the request body

    // Validate user input
    if (!destination || !days || days <= 0) {
      return NextResponse.json(
        {
          error:
            "Invalid input: Destination and a positive number of days are required.",
        },
        { status: 400 }
      );
    }
    const itinerary = await getMockData();

    // Return the itinerary data as JSON
    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Error generating itinerary:", error.message || error);

    // Handle specific OpenAI API errors or return a general message
    return NextResponse.json(
      {
        error:
          "Failed to generate itinerary. Please check your input or try again later.",
      },
      { status: 500 }
    );
  }
}
