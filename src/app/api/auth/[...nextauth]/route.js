import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
import { clientIp, rateLimit } from "@/server/rateLimit";

const handler = NextAuth(authOptions);

// Limit password guessing on the credentials callback
async function post(request, context) {
  if (request.nextUrl.pathname.endsWith("/callback/credentials")) {
    try {
      rateLimit(`login:${clientIp(request)}`, { limit: 10, windowMs: 15 * 60_000 });
    } catch {
      return Response.json({ error: "rate_limited" }, { status: 429 });
    }
  }
  return handler(request, context);
}

export { handler as GET, post as POST };
