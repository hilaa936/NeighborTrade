import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Optimistic check only: pages and API routes verify the session themselves
export async function proxy(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();
  const login = new URL("/auth/login", request.url);
  login.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/messages/:path*", "/my-listings/:path*", "/listings/new", "/listings/:id/edit", "/trades/:path*", "/profile/:path*"],
};
