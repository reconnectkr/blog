"use client";

import React from "react";
import { getPostsByCategory } from "@/lib/posts";
import { usePathname } from "next/navigation";

interface CategoryPageProps {
  href: string;
}

export default async function CategoryPage({ href }: CategoryPageProps) {
  const path = usePathname();

  console.log(path);
  const posts = getPostsByCategory(href);

  return (
    <div>
      hello
      {/* <h1>{category.label}</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <a href={`/posts/${category}/${post.slug}`}>{post.title}</a>
        </div>
      ))} */}
    </div>
  );
}
