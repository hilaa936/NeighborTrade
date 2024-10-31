// src/app/api/itinerary/route.js

import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // OpenAI API Key from environment variables
});

const openai = new OpenAIApi(configuration);

// Helper function to create a flexible prompt based on user input
const generatePrompt = (destination, days, interests) => {
  let prompt = `Generate a ${days}-day travel itinerary for ${destination}. `;

  if (interests && interests.length > 0) {
    prompt += `Focus on activities related to ${interests.join(", ")}. `;
  } else {
    prompt += `Include popular sights, experiences, and cultural activities. `;
  }

  prompt += `Provide recommendations for each day, including things to do, places to eat, and accommodations.`;

  return prompt;
};

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

    // Generate the prompt dynamically based on user input
    const prompt = generatePrompt(destination, days, interests);

    // Call the OpenAI API with the prompt
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Model selection
      prompt: prompt,
      max_tokens: 1000, // Adjust as necessary
      temperature: 0.7,
    });

    // Check for a valid response
    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0].text
    ) {
      const itinerary = response.data.choices[0].text.trim(); // Extract and clean up the response text
      return NextResponse.json({ itinerary }); // Send the itinerary in JSON format
    } else {
      throw new Error("Invalid response from OpenAI API");
    }
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
