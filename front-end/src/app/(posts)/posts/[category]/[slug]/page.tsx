import Post from "@/app/components/Post";
import { getPostBySlug } from "@/lib/posts";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const postData = await getPostBySlug(params.slug);

    if (!postData) {
      return <div>No post found.</div>;
    }

    return <Post postData={postData} />;
  } catch (error) {
    console.error(`Error fetching post by slug ${params.slug}:`, error);
    return <div>An error occurred.</div>;
  }
}
