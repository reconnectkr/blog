import Link from "next/link";
import {
  getMostRecentPost,
  getRecentPosts,
  getAllPosts,
} from "../../lib/posts";

export default async function Home() {
  const mostRecentPost = await getMostRecentPost();
  const recentPosts = await getRecentPosts(3);
  const allPosts = await getAllPosts();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">최신 포스트</h2>
        <article className="flex flex-col bg-white shadow-lg rounded-lg p-6 gap-4">
          <h3 className="text-2xl font-semibold">
            {mostRecentPost.data.title}
          </h3>
          <p className="text-gray-600">
            {mostRecentPost.data.date} • {mostRecentPost.readingTime} min read
          </p>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: mostRecentPost.content }}
          />
          <Link
            href={`/blog/${mostRecentPost.slug}`}
            className="inline-block text-blue-600 hover:underline"
          >
            계속 읽기
          </Link>
        </article>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">최근 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <div className="flex flex-col bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 gap-2">
                <h3 className="text-xl font-semibold">{post.data.title}</h3>
                <p className="text-gray-600">
                  {post.data.date} • {post.readingTime} min read
                </p>
                <p className="text-gray-700">{post.data.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">모든 포스트</h2>
        <ul className="flex flex-col gap-4">
          {allPosts.map((post) => (
            <li
              key={post.slug}
              className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="text-lg font-semibold mb-1">
                  {post.data.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {post.data.date} • {post.readingTime} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
