"use client";

import React from "react";
import { getPostBySlug } from "@/lib/posts";
import { useRouter } from "next/router";

export default function PostPage() {
  const router = useRouter();
  const { category, slug } = router.query;

  console.log(category, slug);
  // const post = getPostBySlug(slug);

  // if (!post) {
  //   return <div>Post not found</div>;
  // }

  return (
    <div>
      hi
      {/* <h1>{post.title}</h1>
      <p>{post.content}</p> */}
    </div>
  );
}
