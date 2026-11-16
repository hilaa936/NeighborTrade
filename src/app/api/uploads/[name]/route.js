import { readStoredFile } from "@/server/uploads";

export async function GET(request, { params }) {
  const { name } = await params;
  const file = await readStoredFile(name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file, {
    headers: {
      "Content-Type": "image/webp",
      // Names are random and never reused
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
