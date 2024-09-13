import React from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import CategoryFilter from "@/app/components/CategoryFilter";

export default async function PostsPage({
  params,
}: {
  params: { category?: string };
}) {
  const posts = await getAllPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.data.category))
  ).filter(Boolean);

  const filteredPosts = params.category
    ? posts.filter(
        (post) => post.data.category?.href.toLowerCase() === params.category
      )
    : posts;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">게시물 목록</h1>

        <CategoryFilter
          categories={categories}
          selectedCategory={params.category}
        />

        <div className="space-y-6 mt-6">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.data.title}
                  </Link>
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {post.data.category.label} • {post.data.date}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    더 읽기 <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
