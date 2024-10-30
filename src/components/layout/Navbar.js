"use client";

import { formatDate } from "@/utils/formatDate";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut({
      callbackUrl: "/auth/login", // Redirect to login after logout
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">
        <Link href="/">Home Growers Platform</Link>
      </h1>

      {/* Main Links */}
      <div className="hidden md:flex items-center">
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
              Hello {session?.user?.username}{" "}
              <span className="text-gray-400 text-sm">
                (expires {formatDate(session?.expires)})
              </span>
            </span>
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm mr-4">
              {session?.user?.role}
            </span>

            {/* Profile Link */}
            <Link
              href="/profile"
              className="text-gray-300 hover:text-white transition-all mr-4"
            >
              Profile
            </Link>
            <Link
              className="text-gray-300 hover:text-white transition-all mr-4"
              href="/travel/tripPreferences"
            >
              Travel
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col mt-4">
          {status === "unauthenticated" ? (
            <>
              <Link href="/auth/login" className="py-2" onClick={toggleMenu}>
                Login
              </Link>
              <Link href="/auth/register" className="py-2" onClick={toggleMenu}>
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="py-2">
                Hello {session?.user?.username}{" "}
                <span className="text-gray-400 text-sm">
                  (expires {formatDate(session?.expires)})
                </span>
              </span>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm py-2">
                {session?.user?.role}
              </span>

              {/* Profile Link for Mobile */}
              <Link
                href="/profile"
                className="py-2 text-gray-600 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 mt-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
