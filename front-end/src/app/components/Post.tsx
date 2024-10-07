"use client";

import { deletePost, getPost } from "@/lib/api";
import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { IPost } from "../interfaces";

interface PostProps {
  postId: string;
}

export default function Post({ postId }: PostProps) {
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();
  const { accessToken, executeAuthenticatedAction } = useAuth();

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

  const handleDelete = async () => {
    if (
      window.confirm(
        "이 글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      setIsDeleting(true);
      try {
        const response = await executeAuthenticatedAction(() =>
          deletePost(postId, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        );

        console.log("Delete response: ", response);

        const checkResponse = await getPost(postId);
        console.log("Check post after deletion: ", checkResponse);

        router.push("/posts");
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("포스트 삭제에 실패했습니다.");
      } finally {
        setIsDeleting(false);
      }
    }
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
            <div className="space-x-2">
              <Button onClick={handleEdit}>수정하기</Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </Button>
            </div>
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
