"use client";

import { getMostRecentPost } from "@/lib/api";
import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { IPost } from "../interfaces";

export default function MostRecentPost() {
  const [mostRecentPost, setMostRecentPost] = useState<IPost | null>(null);
  try {
    useEffect(() => {
      const fetchPosts = async () => {
        const updatedPost = await getMostRecentPost();
        setMostRecentPost(updatedPost);
      };

      fetchPosts();
    }, []);

    if (!mostRecentPost) {
      return (
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">최신 포스트</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p>아직 게시된 포스트가 없습니다.</p>
          </div>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">최신 포스트</h2>
        <article className="flex flex-col bg-white shadow-lg rounded-lg p-6 gap-4">
          <h3 className="text-2xl font-semibold">{mostRecentPost.title}</h3>
          <p className="text-gray-600">
            {formattedDate(mostRecentPost.updatedAt)} • {1} min read
          </p>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {mostRecentPost.content}
            </ReactMarkdown>
          </div>
          <Link
            href={`/posts/${mostRecentPost.id}`}
            className="inline-block text-blue-600 hover:underline"
          >
            계속 읽기
          </Link>
        </article>
      </section>
    );
  } catch (error) {
    console.error("Error in AllPosts component: ", error);
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">최근 포스트</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>
            포스트를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </section>
    );
  }
}
