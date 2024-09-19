import PostsList from "@/app/components/PostsList";
import { getAllPosts } from "@/lib/posts";

export default async function PostsPage() {
  const initialPosts = await getAllPosts();
  return <PostsList initialPosts={initialPosts} />;
}
