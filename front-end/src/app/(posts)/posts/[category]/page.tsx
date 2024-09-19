import PostBox from "@/app/components/PostBox";
import { ICategory } from "@/app/interfaces";
import { getPostsByCategory } from "@/lib/posts";
import { usePathname, useRouter } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const posts = await getPostsByCategory(params.category);

  return (
    <div>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">게시물 목록</h1>
          <div className="space-y-6 mt-6">
            {posts.map((post) => (
              <PostBox post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
