// app/api/produce/route.js
import { NextResponse } from "next/server";
import {
  createProduce,
  getAllAvailableProduce,
  getProducesByTrader,
  getAllTraderProduce,
} from "@/lib/produce";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth configuration
import { getServerSession } from "next-auth"; // For session handling

// POST /api/produce: Add new produce
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, quantity, traderId } = body;
    const session = await getServerSession(authOptions);
    //validate authorize
    if (!session?.user?.id || traderId != session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    //validate fields
    if (!name || !quantity || !traderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduce = await createProduce({
      name,
      description,
      quantity,
      traderId,
    });
    return NextResponse.json(newProduce, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// GET /api/produce: Fetch all produce with trader information
// GET /api/produce?traderId=<traderId>: Fetch all produce by trader
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const traderId = searchParams.get("traderId");
    // Get the logged-in user's session
    const session = await getServerSession(authOptions);

    if (!traderId) {
      const allProduce = await getAllAvailableProduce();
      return NextResponse.json(allProduce, { status: 200 });
    } else {
      // If there is no session, return 401 Unauthorized
      if (!session || session.user.id !== traderId) {
        return getProducesByTrader(traderId);
      }
      const produce = await getAllTraderProduce(traderId);
      return NextResponse.json(produce, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
