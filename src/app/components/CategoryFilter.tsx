"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      router.push("/posts");
    } else {
      router.push(`/posts/category/${category.toLowerCase()}`);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category.toLowerCase() ||
              (category === "All" && !selectedCategory)
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
