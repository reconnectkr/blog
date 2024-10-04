import PostsList from "@/app/components/PostsList";
import { getAllPosts } from "@/lib/api";

export default async function PostsPage() {
  const posts = await getAllPosts();
  return <PostsList initialPosts={posts} />;
}
