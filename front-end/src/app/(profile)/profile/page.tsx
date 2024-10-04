"use client";

import { useAuth } from "@/app/context/AuthContext";
import { IUser } from "@/app/interfaces";
import { getUserInfo, updateUserInfo } from "@/lib/api";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const { accessToken } = useAuth();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedInfo, setEditedInfo] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        setError("액세스 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      try {
        const information = await getUserInfo(accessToken, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserInfo(information);
        setEditedInfo(information);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedInfo || !accessToken) return;

    try {
      await updateUserInfo(editedInfo, accessToken, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(editedInfo);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user information:", error);
      setError("사용자 정보를 업데이트하는 데 실패했습니다.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">프로필</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              사용자 정보
            </h3>
            <button
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={handleEditToggle}
            >
              {isEditing ? "취소" : "수정"}
            </button>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">이름</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedInfo?.name || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    />
                  ) : (
                    userInfo.name
                  )}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">사용자명</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editedInfo?.username || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    />
                  ) : (
                    userInfo.username
                  )}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  휴대폰 번호
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="mobile"
                      value={editedInfo?.mobile || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    />
                  ) : (
                    userInfo.mobile || "미등록"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {isEditing && (
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
            >
              저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
