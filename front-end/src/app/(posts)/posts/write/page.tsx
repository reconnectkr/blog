"use client";

import { useAuth } from "@/app/context/AuthContext";
import { createCategory, createPost, getAllCategories } from "@/lib/api";
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
  const { accessToken, executeAuthenticatedAction } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await executeAuthenticatedAction(() =>
          getAllCategories()
        );
        setAvailableCategories(categories.map((category) => category.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert(
          "카테고리를 불러오는데 실패했습니다. 페이지를 새로고침 해주세요."
        );
      }
    };

    if (accessToken) {
      fetchCategories();
    }
  }, [accessToken, executeAuthenticatedAction]);

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        const createdCategory = await executeAuthenticatedAction(() =>
          createCategory(
            { name: newCategory },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        );
        setSelectedCategories((prev) => [...prev, createdCategory.name]);
        setAvailableCategories((prev) => [...prev, createdCategory.name]);
        setNewCategory("");
      } catch (error) {
        console.error("Error creating category:", error);
        alert("카테고리 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      alert("카테고리를 입력하세요.");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.filter((selectedCategory) => selectedCategory !== category)
    );
  };

  const handleSelectCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  const handleSubmit = async () => {
    try {
      const postData = { title, content, categories: selectedCategories };
      const savedPost = await executeAuthenticatedAction(() =>
        createPost(postData, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 추가
          },
        })
      );
      console.log("Post saved:", savedPost);
      alert("포스트가 성공적으로 저장되었습니다.");
      router.push("/posts");
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
