// src/app/api/produce/route.js

import prisma from "@/lib/prisma";

export async function POST(request) {
  const data = await request.json();

  try {
    const produce = await createProduce({
      growerId: data.growerId,
      name: data.name,
      description: data.description,
      quantity: data.quantity,
      isDisabled: data.isDisabled,
    });
    return new Response(JSON.stringify(produce), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Produce creation failed" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const produceList = await prisma.produce.findMany({
      where: {
        isDisabled: false,
        quantity: { gt: 0 },
      },
    });
    return new Response(JSON.stringify(produceList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch produce" }), {
      status: 500,
    });
  }
}
