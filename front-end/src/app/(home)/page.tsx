import formattedDate from "@/lib/formattedDate";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";
import {
  getAllPosts,
  getMostRecentPost,
  getRecentPosts,
} from "../../lib/posts";

async function MostRecentPost() {
  const mostRecentPost = await getMostRecentPost();

  if (!mostRecentPost) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">최신 포스트</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>아직 게시된 포스트가 없습니다.</p>
        </div>
      </section>
    );
  }

  const processedContent = await remark()
    .use(html)
    .process(mostRecentPost.content);
  const contentHtml = processedContent.toString();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">최신 포스트</h2>
      <article className="flex flex-col bg-white shadow-lg rounded-lg p-6 gap-4">
        <h3 className="text-2xl font-semibold">{mostRecentPost.title}</h3>
        <p className="text-gray-600">
          {formattedDate(mostRecentPost.updatedAt)} •{" "}
          {mostRecentPost.readingTime} min read
        </p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <Link
          href={`/posts/${mostRecentPost.category.href}/${mostRecentPost.id}`}
          className="inline-block text-blue-600 hover:underline"
        >
          계속 읽기
        </Link>
      </article>
    </section>
  );
}

async function RecentPosts() {
  const recentPosts = await getRecentPosts(3);

  if (!recentPosts) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">최근 포스트</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>아직 게시된 포스트가 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">최근 포스트</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.category.href}/${post.id}`}
            className="block"
          >
            <div className="flex flex-col bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 gap-2">
              {/* {post.data.coverImage && (
                <Image
                  src={post.data.coverImage}
                  alt={post.data.title}
                  width={300}
                  height={200}
                  className="rounded-t-lg"
                />
              )} */}
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-gray-600">
                {formattedDate(post.updatedAt)} • {post.readingTime} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function AllPosts() {
  const allPosts = await getAllPosts();

  if (allPosts.length == 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">최근 포스트</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>아직 게시된 포스트가 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">모든 포스트</h2>
      <ul className="flex flex-col gap-4">
        {allPosts.map((post) => (
          <li
            key={post.slug}
            className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <Link
              href={`/posts/${post.category.href}/${post.id}`}
              className="block"
            >
              <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
              <p className="text-gray-600 text-sm">
                {formattedDate(post.updatedAt)} • {post.readingTime} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <MostRecentPost />
      <RecentPosts />
      <AllPosts />
    </div>
  );
}
