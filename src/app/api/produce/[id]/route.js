// app/api/produce/[id]/route.js
import { NextResponse } from "next/server";
import { getProduceById, updateProduce, deleteProduce } from "@/lib/produce";

// GET /api/produce/:id: Fetch specific produce by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const produce = await getProduceById(id);
    if (!produce) {
      return NextResponse.json({ error: "Produce not found" }, { status: 404 });
    }

    return NextResponse.json(produce, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/produce/:id: Update specific produce
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedProduce = await updateProduce(id, body);
    return NextResponse.json(updatedProduce, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/produce/:id: Remove or disable specific produce (soft delete)
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const deletedProduce = await deleteProduce(id);
    return NextResponse.json(deletedProduce, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
