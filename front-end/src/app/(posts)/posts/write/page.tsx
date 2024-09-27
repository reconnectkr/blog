"use client";

import { useAuth } from "@/app/context/AuthContext";
import { getAllCategories } from "@/lib/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const router = useRouter();
  const { accessToken, refreshAccessToken } = useAuth();
  // const { user } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      console.log("토큰이 아직 준비되지 않았습니다.");
      return;
    }

    getAllCategories();
  }, [accessToken]);

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        const response = await fetch("api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: newCategory }),
        });

        if (response.ok) {
          const createdCategory = await response.json();
          setSelectedCategories([...selectedCategories, createdCategory.name]);
          setAvailableCategories([
            ...availableCategories,
            createdCategory.name,
          ]);
          setNewCategory("");
        } else {
          console.error("Failed to create category");
        }
      } catch (error) {
        console.error("Error creating category:", error);
      }
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.filter(
        (selectedCategory) => selectedCategory !== category
      )
    );
  };

  const handleSelectCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          categories: selectedCategories,
        }),
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const retryResponse = await fetch("/api/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify({
              title,
              content,
              categories: selectedCategories,
              // authorId: user?.username,
              authorId: "pointjunseo@naver.com",
            }),
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log("Post saved:", data.post);
            alert("포스트가 성공적으로 저장되었습니다.");
            router.push("/posts");
          } else {
            throw new Error("Failed to save the post after token refresh");
          }
        } else {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          router.push("/login");
        }
      }

      if (response.ok) {
        const data = response.headers
          .get("Content-Type")
          ?.includes("application/json")
          ? await response.json()
          : null;

        if (data) {
          console.log("Post saved:", data.post);
          alert("포스트가 성공적으로 저장되었습니다.");
          router.push("/posts");
        } else {
          alert("서버에서 유효한 응답을 받지 못했습니다.");
        }
      } else {
        const errorData = response.headers
          .get("Content-Type")
          ?.includes("application/json")
          ? await response.json()
          : { message: "Unknown error" };
        throw new Error(errorData.message || "Failed to save the post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("글 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!accessToken) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">로그인이 필요합니다</h1>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">새 글 작성</h1>
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-6 px-4 py-2 text-lg bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="mb-6">
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="새 카테고리를 입력하세요"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow px-4 py-2 text-lg bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
            >
              {category}
              <button
                onClick={() => handleRemoveCategory(category)}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelectCategory(category)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <MDEditor
        value={content}
        onChange={setContent as (value?: string) => void}
        className="mb-6"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
      >
        저장
      </button>
    </div>
  );
}
