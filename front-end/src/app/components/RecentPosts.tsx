"use client";

import { getRecentPosts } from "@/lib/api";
import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces";

export default function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState<IPost[]>([]);
  try {
    useEffect(() => {
      const fetchPosts = async () => {
        const updatedPosts = await getRecentPosts(3);
        setRecentPosts(updatedPosts);
      };

      fetchPosts();
    }, []);

    if (!recentPosts || recentPosts.length === 0) {
      return (
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">최근 포스트</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <p>아직 게시된 포스트가 없습니다.</p>
          </div>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">최근 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="block">
              <div className="flex flex-col bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 gap-2">
                {/* {post.data.coverImage && (
                  <Image
                    src={post.data.coverImage}
                    alt={post.data.title}
                    width={300}
                    height={200}
                    className="rounded-t-lg"
                  />
                )} */}
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600">
                  {formattedDate(post.updatedAt)} • {1} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
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
