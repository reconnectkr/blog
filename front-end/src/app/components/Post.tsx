"use client";

import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Button } from "../components/Button";
import { IPost } from "../interfaces";

interface PostProps {
  postData: IPost;
}

export default function Post({ postData }: PostProps) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          홈
        </Link>
        {" > "}
        {postData.categories.map((category, index) => (
          <span key={category.id}>
            <Link
              href={`/posts/${category.id}`}
              className="text-blue-600 hover:underline"
            >
              {category.name}
            </Link>
            {index < postData.categories.length - 1 && ", "}
          </span>
        ))}
        {" > "}
        <span className="text-gray-600">{postData.title}</span>
      </nav>

      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{postData.title}</h1>
            <Button
              onClick={() => router.push(`/write?mode=edit&id=${postData.id}`)}
            >
              수정하기
            </Button>
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span>{formattedDate(postData.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>
              {postData.categories.map((category, index) => (
                <span key={category.id}>
                  <Link
                    href={`/posts/${category.id}`}
                    className="hover:underline"
                  >
                    {category.name}
                  </Link>
                  {index < postData.categories.length - 1 && ", "}
                </span>
              ))}
            </span>
            <span className="mx-2">•</span>
            <span>작성자 ID: {postData.id}</span>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {postData.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <div className="mt-8 text-sm text-gray-600">
        <p>마지막 수정: {formattedDate(postData.updatedAt)}</p>
      </div>

      <div className="mt-8">
        {postData.categories.map((category) => (
          <div key={category.id} className="mb-2">
            <Link
              href={`/posts/${category.id}`}
              className="text-blue-600 hover:underline"
            >
              ← {category.name} 카테고리의 다른 글 보기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
