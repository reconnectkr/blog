import Post from "@/app/components/Post";
import { getPostBySlug } from "@/lib/posts";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const postData = await getPostBySlug(params.slug);
  return <Post postData={postData} />;
}
