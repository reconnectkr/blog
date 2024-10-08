"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Dialog from "./Dialog";

export default function Header() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "logout" | null;
    title: string;
    message: string;
  }>({ isOpen: false, type: null, title: "", message: "" });

  const router = useRouter();
  const { accessToken, logout } = useAuth();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    setDialogState({
      isOpen: true,
      type: "logout",
      title: "로그아웃",
      message: "로그아웃 하시겠습니까?",
    });
  };

  const handleLogoutConfirm = () => {
    setDialogState({ isOpen: false, type: null, title: "", message: "" });
    logout();
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleDialogClose = () => {
    setDialogState({ isOpen: false, type: null, title: "", message: "" });
  };

  return (
    <div className="bg-white shadow-md">
      <header className="flex flex-row justify-between py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-800 max-w-7xl">
          블로그
        </Link>
        {accessToken ? (
          <div className="flex flex-row gap-10">
            <button onClick={handleProfile}>프로필</button>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div className="flex flex-row gap-10">
            <button onClick={handleSignup}>회원가입</button>
            <button onClick={handleLogin}>로그인</button>
          </div>
        )}
      </header>
      <Dialog
        isOpen={dialogState.isOpen}
        onClick={
          dialogState.type === "logout"
            ? handleLogoutConfirm
            : handleDialogClose
        }
        onClose={handleDialogClose}
        title={dialogState.title}
      >
        <p className="text-sm text-gray-500">{dialogState.message}</p>
      </Dialog>
    </div>
  );
}
