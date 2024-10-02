"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ICategory, IPost } from "../interfaces";
import PostBox from "./PostBox";
import PostsListFilter from "./PostsListFilter";
import { getAllCategories } from "@/lib/api";

interface PostsListProps {
  posts: IPost[];
}

export default function PostsList({ posts }: PostsListProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setCategories(categories.map((category) => category));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredPosts =
    selectedCategories.length > 0
      ? posts.filter((post) =>
          selectedCategories.every((selectedCategory) =>
            post.categories.some(
              (postCategory) => postCategory.id === selectedCategory.id
            )
          )
        )
      : posts;

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
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />

        <div className="space-y-6 mt-6">
          {filteredPosts.map((post) => (
            <PostBox key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
