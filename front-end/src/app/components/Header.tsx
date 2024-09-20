"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  return (
    <div className="bg-white shadow-md">
      <header className="flex flex-row justify-between py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-800 max-w-7xl">
          My Blog
        </Link>
        {isLoggedIn ? (
          <div className="flex flex-row gap-10">
            <Link href="/profile" className="flex items-center">
              프로필
            </Link>
            <button onClick={logout}>로그아웃</button>
          </div>
        ) : (
          <Link href="/login">login</Link>
        )}
      </header>
    </div>
  );
}
