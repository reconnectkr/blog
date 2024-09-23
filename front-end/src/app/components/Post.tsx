"use client";

import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { IPost } from "../interfaces";

interface PostProps {
  postData: IPost;
}

export default function Post({ postData }: PostProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          홈
        </Link>
        {" > "}
        <Link
          href={`/posts/${postData.category.href}`}
          className="text-blue-600 hover:underline"
        >
          {postData.category.label}
        </Link>
        {" > "}
        <span className="text-gray-600">{postData.title}</span>
      </nav>

      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{postData.title}</h1>
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span>{formattedDate(postData.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{postData.category.label}</span>
            <span className="mx-2">•</span>
            <span>작성자 ID: {postData.authorId}</span>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown>{postData.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      <div className="mt-8 text-sm text-gray-600">
        <p>마지막 수정: {formattedDate(postData.updatedAt)}</p>
      </div>

      <div className="mt-8">
        <Link
          href={`/posts/${postData.category.href}`}
          className="text-blue-600 hover:underline"
        >
          ← {postData.category.label} 카테고리의 다른 글 보기
        </Link>
      </div>
    </div>
  );
}
