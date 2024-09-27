import PostBox from "@/app/components/PostBox";
import { getPostsByCategory } from "@/lib/api";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: number };
}) {
  const posts = await getPostsByCategory(params.categoryId);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">게시물 목록</h1>
          <Link
            href="/posts/write"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            새 글
          </Link>
        </div>
        <div className="space-y-6 mt-6">
          {posts.map((post) => (
            <PostBox key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
