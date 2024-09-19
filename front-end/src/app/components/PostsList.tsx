"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IPost } from "../interfaces";
import PostsListFilter from "./PostsListFilter";
import PostBox from "./PostBox";

interface PostsListProps {
  initialPosts: IPost[];
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(initialPosts.map((post) => post.data.category.label))
    ).filter((category): category is string => Boolean(category));
    setCategories(uniqueCategories);
  }, [initialPosts]);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.data.category.label === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">게시물 목록</h1>

        <PostsListFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="space-y-6 mt-6">
          {filteredPosts.map((post) => (
            <PostBox post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
