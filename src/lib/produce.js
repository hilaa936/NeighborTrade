// Create a new createProduce
export const createProduce = async (data) => {
  const produce = await prisma.produce.create({
    data: {
      growerId: data.growerId,
      name: data.name,
      description: data.description || "",
      quantity: data.quantity,
      isDisabled: data.isDisabled || false,
    },
  });
  return produce;
};
