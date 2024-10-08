"use client";

import { formatDate } from "@/utils/formatDate";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({
      callbackUrl: "/auth/login", // Redirect to login after logout
    });
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">
        <Link href="/">Home Growers Platform</Link>
      </h1>

      <div className="flex items-center">
        {status === "unauthenticated" ? (
          <>
            <Link href="/auth/login" className="mr-4">
              Login
            </Link>
            <Link href="/auth/register" className="mr-4">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="mr-4">
              Hello {session?.user?.username}!{" "}
              <span className="text-gray-400 text-sm">
                (expires logged in: {formatDate(session?.expires)})
              </span>
            </span>
            <span className="mr-4">{session?.user?.role}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
