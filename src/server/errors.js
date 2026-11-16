import { NextResponse } from "next/server";
import { ZodError } from "zod";

// An expected error with a stable code; the client translates the code
export class ApiError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

export const unauthorized = () => new ApiError(401, "unauthorized");
export const forbidden = () => new ApiError(403, "forbidden");
export const notFound = () => new ApiError(404, "not_found");
export const badRequest = (code = "invalid_input") => new ApiError(400, code);

// Wraps a route handler so errors become `{ error: code }` responses
// and internal details never reach the client
export function route(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({ error: error.code }, { status: error.status });
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "invalid_input", fields: error.issues.map((i) => i.path.join(".")) },
          { status: 400 }
        );
      }
      console.error(`[api] ${request.method} ${request.nextUrl?.pathname}`, error);
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
  };
}

// Reads a JSON body, treating a malformed body as invalid input
export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw badRequest();
  }
}
