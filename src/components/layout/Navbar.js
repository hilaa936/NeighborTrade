"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  LoginIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"; // Ensure these imports are correct and the icons are from @heroicons/react

const navLinks = [
  { title: "Trips", link: "/travel/trip" },
  { title: "Activities", link: "/travel/activities" },
];

// Updated authLink with label, link, and icon properties
const authLink = {
  login: {
    label: "Login",
    link: "/auth/login",
    icon: "", //<LoginIcon className="w-5 h-5 mr-2" />,
  },
  register: {
    label: "Register",
    link: "/auth/register",
    icon: "", //<UserAddIcon className="w-5 h-5 mr-2" />,
  },
  logout: {
    label: "Logout",
    link: "/auth/login",
    icon: <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2" />,
  },
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" w-full z-30 flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white shadow-lg">
      {/* Logo */}
      <h1 className="md:text-xl text-lg font-semibold">
        <Link href="/">Home Growers Platform</Link>
      </h1>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex space-x-6 items-center">
        {navLinks.map((item) => (
          <li key={item.link}>
            <Link
              href={item.link}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                pathname === item.link
                  ? "bg-gray-700 text-blue-300 shadow-md"
                  : "text-gray-300 hover:text-blue-200 hover:bg-gray-700"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Authentication Actions Section */}
      <div className="flex items-center space-x-4">
        {status === "unauthenticated" ? (
          <>
            <Link
              href={authLink.login.link}
              className="text-sm hover:underline flex items-center"
            >
              {authLink.login.icon}
              {authLink.login.label}
            </Link>
            <Link
              href={authLink.register.link}
              className="text-sm hover:underline flex items-center"
            >
              {authLink.register.icon}
              {authLink.register.label}
            </Link>
          </>
        ) : (
          <div className="hidden md:flex">
            <Link
              href="/profile"
              className="text-sm px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center"
            >
              <UserCircleIcon className="w-5 h-5 m-1" />
              <span className="hidden lg:flex">{session?.user?.username}</span>
            </Link>
            <button
              className="flex mx-3 items-center justify-center py-2 text-red-500 hover:text-red-600"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              {authLink.logout.icon}
              <span>{authLink.logout.label}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button
        onClick={toggleMenu}
        className="z-10 md:hidden focus:outline-none text-white"
      >
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

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className={`absolute top-28 right-0  md:hidden w-full sm:w-2/4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform ${
              isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
          >
            <ul className="flex flex-col items-center space-y-4 py-4">
              {navLinks.map((link) => (
                <li key={link.link}>
                  <Link
                    href={link.link}
                    className={`block w-full px-4 py-2 text-center transition-colors duration-200 ${
                      pathname === link.link
                        ? "bg-gray-700 text-blue-400"
                        : "text-gray-300 hover:bg-gray-700 hover:text-blue-300"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Authentication Section */}
            <div className="w-full text-center">
              {status === "unauthenticated" ? (
                <>
                  <Link
                    href={authLink.login.link}
                    className="w-full flex items-center justify-center py-2 text-gray-300 hover:text-blue-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {authLink.login.icon}
                    <span>{authLink.login.label}</span>
                  </Link>
                  <Link
                    href={authLink.register.link}
                    className="w-full flex items-center justify-center py-2 text-gray-300 hover:text-blue-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {authLink.register.icon}
                    <span>{authLink.register.label}</span>
                  </Link>
                </>
              ) : (
                <div className="w-full flex border-t p-3 border-t-sky-200 flex-row justify-between">
                  <Link
                    href="/profile"
                    className="text-sm px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    {session?.user?.username}
                  </Link>
                  <button
                    className="flex items-center justify-center py-2 text-red-500 hover:text-red-600"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    {authLink.logout.icon}
                    <span>{authLink.logout.label}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
