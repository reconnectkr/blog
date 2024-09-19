"use client";

import React from "react";
import { getPostsByCategory } from "@/lib/posts";
import { usePathname } from "next/navigation";

export default function CategoryPage() {
  const path = usePathname();

  console.log(path);
  // const posts = getPostsByCategory(category);

  return (
    <div>
      hello
      {/* <h1>Posts in {category}</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <a href={`/posts/${category}/${post.slug}`}>{post.title}</a>
        </div>
      ))} */}
    </div>
  );
}
