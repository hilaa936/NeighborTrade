"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login Error</h2>
      <p className="text-red-500 mb-4">
        {error || "Unknown error occurred during login"}
      </p>
      <a
        href="/auth/login"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Back to Login
      </a>
    </div>
  );
}
