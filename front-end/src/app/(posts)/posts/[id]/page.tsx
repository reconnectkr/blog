import Post from "@/app/components/Post";

export default async function PostPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  try {
    if (!params) {
      return <div>No post found.</div>;
    }

    return <Post postId={params.id} />;
  } catch (error) {
    console.error(`Error fetching post by slug ${params.id}:`, error);
    return <div>An error occurred.</div>;
  }
}
