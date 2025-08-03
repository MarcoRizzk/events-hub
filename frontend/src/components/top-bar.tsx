"use client";

import React, { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  user?: {
    email?: string;
    name?: string;
  } | null;
  onLogout: () => void;
}

const TopBar = ({ user, onLogout }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Events<span className="text-gray-800">Hub</span>
            </Link>

            {/* Desktop links */}
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <div className="h-5 w-1 bg-gray-200"></div>
                <Link
                  className="px-2 py-1 hover:bg-gray-200 transition-colors rounded-lg"
                  href="/my-events"
                >
                  <div className="text-gray-800">My Events</div>
                </Link>
                <div className="h-5 w-1 bg-gray-200"></div>
                <Link
                  className="px-2 py-1 hover:bg-gray-200 transition-colors rounded-lg"
                  href="/create-event"
                >
                  <div className="text-gray-800">Create Event</div>
                </Link>
                <div className="h-5 w-1 bg-gray-200"></div>
                <Link
                  className="px-2 py-1 hover:bg-gray-200 transition-colors rounded-lg"
                  href="/my-rsvps"
                >
                  <div className="text-gray-800">My RSVPs</div>
                </Link>
              </div>
            )}
          </div>

          {/* Right Section */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="font-semibold text-gray-800">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onLogout}
                className="hidden md:block px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 border-t border-gray-200 pt-2">
            {user ? (
              <>
                <Link
                  href="/my-events"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  My Events
                </Link>
                <Link
                  href="/create-event"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Create Event
                </Link>
                <Link
                  href="/my-rsvps"
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  My RSVPs
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full text-center px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
