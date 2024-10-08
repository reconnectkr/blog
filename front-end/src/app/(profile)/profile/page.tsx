"use client";

import { Button } from "@/app/components/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/Card";
import Dialog from "@/app/components/Dialog";
import { Input } from "@/app/components/Input";
import { useAuth } from "@/app/context/AuthContext";
import { IUser } from "@/app/interfaces";
import { getUserInfo, updateUserInfo } from "@/lib/api";
import { removeNullProperties } from "@/lib/removeNullProperties";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const { accessToken, executeAuthenticatedAction } = useAuth();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedInfo, setEditedInfo] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "edit" | "save" | null;
  }>({ isOpen: false, type: null });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const information = await executeAuthenticatedAction(() =>
          getUserInfo(accessToken, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        );
        setUserInfo(information);
        setEditedInfo(information);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [accessToken, executeAuthenticatedAction]);

  const handleEditToggle = () => {
    if (!isEditing) {
      setDialogState({ isOpen: true, type: "edit" });
    } else {
      setIsEditing(false);
      setEditedInfo(userInfo);
    }
  };

  const handleEditConfirm = () => {
    setIsEditing(true);
    setDialogState({ isOpen: false, type: null });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDialogState({ isOpen: true, type: "save" });
  };

  const handleSaveConfirm = async () => {
    if (!editedInfo || !accessToken) return;

    try {
      await executeAuthenticatedAction(() =>
        updateUserInfo(removeNullProperties(editedInfo), accessToken, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      setUserInfo(editedInfo);
      setIsEditing(false);
      setDialogState({ isOpen: false, type: null });
    } catch (error) {
      console.error("Failed to update user information:", error);
      setError("사용자 정보를 업데이트하는 데 실패했습니다.");
    }
  };

  const handleDialogClose = () => {
    setDialogState({ isOpen: false, type: null });
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (!accessToken)
    return (
      <div className="text-red-500">
        액세스 토큰이 없습니다. 다시 로그인해주세요.
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!userInfo) return <div>사용자 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>프로필</CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={handleEditToggle}
            >
              {isEditing ? "취소" : "수정"}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">이름</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {isEditing ? (
                      <Input
                        name="name"
                        value={editedInfo?.name || ""}
                        onChange={handleInputChange}
                        className="mt-0"
                      />
                    ) : (
                      userInfo.name
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    사용자명
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {isEditing ? (
                      <Input
                        name="username"
                        value={editedInfo?.username || ""}
                        onChange={handleInputChange}
                        className="mt-0"
                      />
                    ) : (
                      userInfo.username
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    휴대폰 번호
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {isEditing ? (
                      <Input
                        name="mobile"
                        value={editedInfo?.mobile || ""}
                        onChange={handleInputChange}
                        className="mt-0"
                      />
                    ) : (
                      userInfo.mobile || "미등록"
                    )}
                  </dd>
                </div>
              </dl>
              {isEditing && (
                <div className="mt-6">
                  <Button type="submit" className="w-full">
                    저장
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog
        isOpen={dialogState.isOpen}
        onClick={
          dialogState.type === "edit" ? handleEditConfirm : handleSaveConfirm
        }
        onClose={handleDialogClose}
        title={dialogState.type === "edit" ? "프로필 수정" : "프로필 저장"}
      >
        <p>
          {dialogState.type === "edit"
            ? "프로필을 수정하시겠습니까?"
            : "변경사항을 저장하시겠습니까?"}
        </p>
      </Dialog>
    </div>
  );
}
