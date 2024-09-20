"use client";

import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { IPost } from "../interfaces";

export default function PostContent({ post }: { post: IPost }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          홈
        </Link>
        {" > "}
        <Link
          href={`/posts/${post.data.category.href}`}
          className="text-blue-600 hover:underline"
        >
          {post.data.category.label}
        </Link>
        {" > "}
        <span className="text-gray-600">{post.data.title}</span>
      </nav>

      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{post.data.title}</h1>
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span>{formattedDate(post.data.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{post.data.category.label}</span>
            <span className="mx-2">•</span>
            <span>작성자 ID: {post.data.authorId}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      <div className="mt-8 text-sm text-gray-600">
        <p>마지막 수정: {formattedDate(post.data.updatedAt)}</p>
      </div>

      <div className="mt-8">
        <Link
          href={`/posts/${post.data.category.href}`}
          className="text-blue-600 hover:underline"
        >
          ← {post.data.category.label} 카테고리의 다른 글 보기
        </Link>
      </div>
    </div>
  );
}
