// lib/produce.js
import prisma from "@/lib/prisma";

export const createProduce = async (data) => {
  return await prisma.produce.create({
    data,
  });
};

export const getAllAvailableProduce = async () => {
  return await prisma.produce.findMany({
    where: { available: true },
  });
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
