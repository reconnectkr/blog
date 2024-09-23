"use client";

import { useEffect, useState } from "react";
import { IPost } from "../interfaces";
import PostBox from "./PostBox";
import PostsListFilter from "./PostsListFilter";
import Link from "next/link";

interface PostsListProps {
  initialPosts: IPost[];
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(initialPosts.map((post) => post.category.label))
    ).filter((category): category is string => Boolean(category));
    setCategories(uniqueCategories);
  }, [initialPosts]);

  const filteredPosts = selectedCategory
    ? initialPosts.filter((post) => post.category.label === selectedCategory)
    : initialPosts;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">게시물 목록</h1>
          <Link
            href="/posts/write"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            새 글
          </Link>
        </div>

        <PostsListFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="space-y-6 mt-6">
          {filteredPosts.map((post) => (
            <PostBox key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
