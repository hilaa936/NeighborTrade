// Client-side fetch helpers: errors carry the server's error code for translation

export class ApiClientError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function request(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiClientError("network", 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiClientError(data.error || "server_error", response.status);
  return data;
}

export const api = (url, { method = "GET", body } = {}) =>
  request(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  const { url } = await request("/api/uploads", { method: "POST", body: form });
  return url;
}

// Only same-site paths, so a crafted link cannot redirect elsewhere after login
export const safeCallbackUrl = (value, fallback = "/market") =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
