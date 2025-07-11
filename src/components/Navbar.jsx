"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ClipboardList } from "lucide-react"; // Import the icon

const APP_NAME = "AuthVerifyVoiceTodo";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isSignedIn =
    typeof window !== "undefined" && localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  return (
    <header className="bg-gray-900 text-white w-full shadow-md py-4 sm:py-5 lg:py-6">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4">
        {/* Left: App Name with Icon */}
        <div className="flex items-center gap-2">
          <ClipboardList size={28} className="text-white" />
          <div className="font-bold text-xl sm:text-2xl tracking-wide">
            {APP_NAME}
          </div>
        </div>
        {/* Center: Home/Todo (if signed in) */}
        {isSignedIn ? (
          <div className="flex gap-4">
            <Link
              href="/"
              className={`hover:text-gray-300 transition-colors duration-200 ${
                pathname === "/" ? "font-semibold text-gray-100" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/todo"
              className={`hover:text-gray-300 transition-colors duration-200 ${
                pathname === "/todo"
                  ? "font-semibold text-gray-100"
                  : "text-white"
              }`}
            >
              Todo
            </Link>
          </div>
        ) : (
          <div />
        )}
        {/* Right: Auth buttons or Logout */}
        <div className="flex gap-2">
          {isSignedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 font-medium shadow-sm transition duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/signin"
                className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 font-medium shadow-sm transition duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 font-medium shadow-sm transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
