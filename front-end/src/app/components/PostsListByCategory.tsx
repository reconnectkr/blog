import { IPost } from "../interfaces";
import PostBox from "./PostBox";

interface PostsListProps {
  initialPosts: IPost[];
}

export default function PostsList({ initialPosts }: PostsListProps) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">게시물 목록</h1>
        <div className="space-y-6 mt-6">
          {initialPosts.map((post) => (
            <PostBox key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
