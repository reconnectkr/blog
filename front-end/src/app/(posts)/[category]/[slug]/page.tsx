"use client";

import React from "react";
import { getPostBySlug } from "@/lib/posts";
import { useRouter } from "next/router";

export default function PostPage() {
  const router = useRouter();
  const { category, slug } = router.query; // URL에서 카테고리와 slug를 가져옴
  const post = getPostBySlug(category, slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
