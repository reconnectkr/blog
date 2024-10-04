import Post from "@/app/components/Post";
import { getPost } from "@/lib/api";

export default async function PostPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  try {
    const postData = await getPost(params.id);

    if (!postData) {
      return <div>No post found.</div>;
    }

    return <Post postData={postData} />;
  } catch (error) {
    console.error(`Error fetching post by slug ${params.id}:`, error);
    return <div>An error occurred.</div>;
  }
}
