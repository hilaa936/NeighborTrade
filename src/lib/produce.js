// lib/produce.js
import mockData from "@/mock/mockData.json"; // Import mock data for fallback
import tradeClient from "./prisma/tradeClient";

export const createProduce = async (data) => {
  return await tradeClient.produce.create({
    data,
  });
};

export const getAllAvailableProduce = async () => {
  try {
    const allProduce = await tradeClient.produce.findMany({
      where: { isAvailable: true },
      include: {
        trader: {
          // Assuming "trader" is the relation field to the User model
          select: {
            username: true,
            // profilePicture: true, // Assuming trader profile has a picture
          },
        },
      },
    });
    return allProduce;
  } catch (error) {
    console.error("Database error: Falling back to mock data", error);

    // Check if we are in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("Using mock data for development");
      return mockData.produce; // Return the mock produce data
    } else {
      throw new Error(
        "Database is unavailable, and mock data is disabled in production."
      );
    }
  }
};

export const getProducesByTrader = async (traderId) => {
  return await tradeClient.produce.findMany({
    where: {
      traderId,
      isAvailable: true,
    },
  });
};
export const getAllTraderProduce = async (traderId) => {
  return await tradeClient.produce.findMany({
    where: {
      traderId,
    },
    orderBy: {
      isAvailable: "desc", // Shows available items (true) first
    },
  });
};

export const getProduceById = async (id) => {
  return await tradeClient.produce.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
};

export const updateProduce = async (id, data) => {
  return await tradeClient.produce.update({
    where: {
      id: parseInt(id, 10),
    },
    data,
  });
};

export const deleteProduce = async (id) => {
  return await tradeClient.produce.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      isAvailable: false, // Soft delete by disabling produce
    },
  });
};
