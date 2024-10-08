"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Dialog from "./Dialog";

export default function Header() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "login" | "logout" | null;
  }>({ isOpen: false, type: null });

  const router = useRouter();
  const { accessToken, logout } = useAuth();

  const handleLogin = () => {
    setDialogState({ isOpen: true, type: "login" });
  };

  const handleLoginConfirm = () => {
    setDialogState({ isOpen: false, type: null });
    router.push("/login");
  };

  const handleLogout = () => {
    setDialogState({ isOpen: true, type: "logout" });
  };

  const handleLogoutConfirm = () => {
    setDialogState({ isOpen: false, type: null });
    logout();
  };

  const handleDialogClose = () => {
    setDialogState({ isOpen: false, type: null });
  };

  return (
    <div className="bg-white shadow-md">
      <header className="flex flex-row justify-between py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-800 max-w-7xl">
          블로그
        </Link>
        {accessToken ? (
          <div className="flex flex-row gap-10">
            <Link href="/profile" className="flex items-center">
              프로필
            </Link>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <button onClick={handleLogin}>로그인</button>
        )}
      </header>
      <Dialog
        isOpen={dialogState.isOpen}
        onClick={
          dialogState.type === "login"
            ? handleLoginConfirm
            : handleLogoutConfirm
        }
        onClose={handleDialogClose}
        title={dialogState.type === "login" ? "로그인" : "로그아웃"}
      >
        <p>
          {dialogState.type === "login"
            ? "로그인 하시겠습니까?"
            : "로그아웃 하시겠습니까?"}
        </p>
      </Dialog>
    </div>
  );
}
