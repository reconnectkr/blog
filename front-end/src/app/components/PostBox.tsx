import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { IPost } from "../interfaces";

interface PostBoxProps {
  post: IPost;
}
export default function PostBox({ post }: PostBoxProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          <Link
            href={`/posts/${post.data.category.href}/${post.slug}`}
            className="hover:underline"
          >
            {post.data.title}
          </Link>
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {post.data.category.label} • {formattedDate(post.data.updatedAt)}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <p className="text-sm text-gray-500">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </p>
        <div className="mt-4">
          <Link
            href={`/posts/${post.data.category.href}/[slug]?slug=${post.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            더 읽기 <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
