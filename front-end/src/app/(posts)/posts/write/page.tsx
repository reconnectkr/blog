"use client";

import { useAuth } from "@/app/context/AuthContext";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 작성한 포스트를 src/public/posts에(로컬 저장소에) 저장하는 방법
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          authorId: user?.username,
          category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Post saved:", data.post);
        alert("포스트가 성공적으로 저장되었습니다.");
        router.push("/posts");
      } else {
        throw new Error("Failed to save the post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("글 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  //   api 연결 완료 시 이 코드 수정해서 사용
  //   try {
  //     const response = await fetch("/api/v1/posts", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         title,
  //         content,
  //         authorId: user?.username,
  //       }),
  //     });

  //     if (response.ok) {
  //       router.push("/posts");
  //     } else {
  //       throw new Error("Failed to save the post");
  //     }
  //   } catch (error) {
  //     console.error("Error saving post:", error);
  //     alert("글 저장에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

  if (!isLoggedIn) {
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
      <input
        type="text"
        placeholder="카테고리를 입력하세요"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-6 px-4 py-2 text-lg bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
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
