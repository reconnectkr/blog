import Post from "@/app/components/Post";
import { getPostById } from "@/lib/posts";

export default async function PostPage({
  params,
}: {
  params: { category: string; id: number };
}) {
  try {
    const postData = await getPostById(params.id);
    console.log("postData: ", postData);

    if (!postData) {
      return <div>No post found.</div>;
    }

    return <Post postData={postData} />;
  } catch (error) {
    console.error(`Error fetching post by slug ${params.id}:`, error);
    return <div>An error occurred.</div>;
  }
}
