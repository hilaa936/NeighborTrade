"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({
      callbackUrl: "/auth/login", // Redirect to the login page after logging out
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Logout
    </button>
  );
}