// lib/produce.js
import prisma from "@/lib/prisma";

export const createProduce = async (data) => {
  return await prisma.produce.create({
    data,
  });
};

export const getAllAvailableProduce = async () => {
  const allProduce = await prisma.produce.findMany({
    where: { available: true },
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
};

export const getProducesByTrader = async (traderId) => {
  return await prisma.produce.findMany({
    where: {
      traderId,
      available: true,
    },
  });
};
export const getAllTraderProduce = async (traderId) => {
  return await prisma.produce.findMany({
    where: {
      traderId,
    },
  });
};

export const getProduceById = async (id) => {
  return await prisma.produce.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
};

export const updateProduce = async (id, data) => {
  return await prisma.produce.update({
    where: {
      id: parseInt(id, 10),
    },
    data,
  });
};

export const deleteProduce = async (id) => {
  return await prisma.produce.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      available: false, // Soft delete by disabling produce
    },
  });
};
