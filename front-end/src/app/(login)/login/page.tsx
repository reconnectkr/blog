"use client";

import Dialog from "@/app/components/Dialog";
import { useAuth } from "@/app/context/AuthContext";
import { getUserInfo } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "correct" | "error" | null;
    title: string;
    message: string;
  }>({ isOpen: false, type: null, title: "", message: "" });

  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      setError("모든 필드를 채워주세요.");
      return false;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setDialogState({
        isOpen: true,
        type: "error",
        title: "오류",
        message: "로그인 정보가 올바르지 않습니다.",
      });
    } else {
      setLoading(true);

      try {
        const newAccessToken = await login(email, password);

        const userData = await getUserInfo(newAccessToken, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        const message = userData?.username
          ? `${userData.username}님 환영합니다!`
          : `${email}님 환영합니다!`;
        setDialogState({
          isOpen: true,
          type: "correct",
          title: "로그인 성공",
          message: message,
        });
      } catch (error) {
        console.error("로그인 에러: ", error);
        setError(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLoginCorrectConfirm = () => {
    setDialogState({ isOpen: false, type: null, title: "", message: "" });
    router.push("/");
  };

  const handleDialogClose = () => {
    setDialogState({ isOpen: false, type: null, title: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          로그인
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "처리 중..." : "로그인"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <div>
                <button
                  onClick={handleSignup}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  계정 만들기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={dialogState.isOpen}
        onClick={
          dialogState.type === "correct"
            ? handleLoginCorrectConfirm
            : handleDialogClose
        }
        onClose={
          dialogState.type === "correct"
            ? handleLoginCorrectConfirm
            : handleDialogClose
        }
        title={dialogState.title}
      >
        <p className="text-sm text-gray-500">{dialogState.message}</p>
      </Dialog>
    </div>
  );
}
