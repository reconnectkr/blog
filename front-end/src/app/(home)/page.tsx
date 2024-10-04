import AllPosts from "../components/AllPosts";
import MostRecentPost from "../components/MostRecentPost";
import RecentPosts from "../components/RecentPosts";

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-10 min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <MostRecentPost />
      <RecentPosts />
      <AllPosts />
    </div>
  );
}
