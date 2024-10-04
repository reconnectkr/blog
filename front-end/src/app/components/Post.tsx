"use client";

import { getPost } from "@/lib/api";
import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Button } from "../components/Button";
import { IPost } from "../interfaces";

interface PostProps {
  postId: string;
}

export default function Post({ postId }: PostProps) {
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPost(postId);
        if (post) {
          setPost(post);
        } else {
          console.error("No post found.");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    router.push(`/posts/write?mode=edit&id=${postId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          홈
        </Link>
        {" > "}
        {post.categories.map((category, index) => (
          <span key={category.id}>
            <Link
              href={`/posts/${category.id}`}
              className="text-blue-600 hover:underline"
            >
              {category.name}
            </Link>
            {index < post.categories.length - 1 && ", "}
          </span>
        ))}
        {" > "}
        <span className="text-gray-600">{post.title}</span>
      </nav>

      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <Button onClick={handleEdit}>수정하기</Button>
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span>{formattedDate(post.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>
              {post.categories.map((category, index) => (
                <span key={category.id}>
                  <Link
                    href={`/posts/${category.id}`}
                    className="hover:underline"
                  >
                    {category.name}
                  </Link>
                  {index < post.categories.length - 1 && ", "}
                </span>
              ))}
            </span>
            <span className="mx-2">•</span>
            <span>작성자 ID: {post.id}</span>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <div className="mt-8 text-sm text-gray-600">
        <p>마지막 수정: {formattedDate(post.updatedAt)}</p>
      </div>

      <div className="mt-8">
        {post.categories.map((category) => (
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
