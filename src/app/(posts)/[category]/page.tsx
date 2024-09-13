"use client";

import React from "react";
import { getPostsByCategory } from "@/lib/posts";
import { useRouter } from "next/router";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const posts = getPostsByCategory(category);

  return (
    <div>
      <h1>Posts in {category}</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <a href={`/posts/${category}/${post.slug}`}>{post.title}</a>
        </div>
      ))}
    </div>
  );
}
