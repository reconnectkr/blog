"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

// 게시물 타입 정의
interface Post {
  slug: string;
  data: {
    title: string;
    category: {
      label: string;
      href: string;
    };
    date: string;
  };
  content: string;
}

// CategoryFilter 프롭스 타입 정의
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

// CategoryFilter 컴포넌트 정의
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        className={`px-4 py-2 rounded ${
          !selectedCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => onCategoryChange(null)}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      const uniqueCategories = Array.from(
        new Set(allPosts.map((post) => post.data.category.label))
      ).filter((category): category is string => Boolean(category));
      setCategories(uniqueCategories);
    };
    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.data.category.label === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">게시물 목록</h1>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
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
