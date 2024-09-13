"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CategoryFilterProps {
  categories: { href: string; label: string }[];
  selectedCategory?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();

  const handleCategoryChange = (category: { href: string; label: string }) => {
    if (category.label === "전체") {
      router.push(category.href);
    } else {
      router.push(`/posts/${category.href.toLowerCase()}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.href}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category.href.toLowerCase() ||
              (category.href === "전체" && !selectedCategory)
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
