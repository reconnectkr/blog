"use client";

import { getAllPosts } from "@/lib/api";
import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces";

export default function AllPosts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  try {
    useEffect(() => {
      const fetchPosts = async () => {
        const updatedPosts = await getAllPosts();
        setPosts(updatedPosts);
      };

      fetchPosts();
    }, []);

    if (!posts || posts.length === 0) {
      return (
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">모든 포스트</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p>아직 게시된 포스트가 없습니다.</p>
          </div>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">모든 포스트</h2>
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <Link href={`/posts/${post.id}`} className="block">
                <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                <p className="text-gray-600 text-sm">
                  {formattedDate(post.updatedAt)} • {1} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  } catch (error) {
    console.error("Error in AllPosts component: ", error);
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">모든 포스트</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>
            포스트를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </section>
    );
  }
}
