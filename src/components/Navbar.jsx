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
    <header className="bg-gray-900 text-white w-full shadow-md py-2 sm:py-5 lg:py-6">
      <nav className="max-w-5xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between px-2 sm:px-6">
        {/* Left: App Name with Icon */}
        <div className="flex items-center gap-2 mb-2 sm:mb-0 min-w-0">
          <ClipboardList size={20} className="text-white" />
          <div className="font-bold text-base sm:text-3xl tracking-wide overflow-hidden text-ellipsis break-words">
            {APP_NAME}
          </div>
        </div>
        {/* Right: Navigation Links and Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-1 w-full sm:w-auto">
          {isSignedIn ? (
            <div className="flex gap-1 mb-2 sm:mb-0 justify-center w-full sm:w-auto">
              <Link
                href="/"
                className={`hover:text-gray-300 transition-colors duration-200 text-xs sm:text-base ${
                  pathname === "/"
                    ? "font-semibold text-gray-100"
                    : "text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/todo"
                className={`hover:text-gray-300 transition-colors duration-200 text-xs sm:text-base ${
                  pathname === "/todo"
                    ? "font-semibold text-gray-100"
                    : "text-white"
                }`}
              >
                Todo
              </Link>
              {(pathname === "/" || pathname === "/todo") && (
                <button
                  onClick={handleLogout}
                  className="bg-white text-gray-900 px-1.5 py-0.5 rounded-md hover:bg-gray-100 font-medium shadow-sm transition duration-200 text-xs"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-1 mb-2 sm:mb-0 justify-center w-full sm:w-auto">
              <Link
                href="/signin"
                className="bg-white text-gray-900 px-1.5 py-0.5 rounded-md hover:bg-gray-100 font-medium shadow-sm transition duration-200 text-xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-white text-gray-900 px-1.5 py-0.5 rounded-md hover:bg-gray-100 font-medium shadow-sm transition duration-200 text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
