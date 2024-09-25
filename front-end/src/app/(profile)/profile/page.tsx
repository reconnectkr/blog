import Image from "next/image";
import Link from "next/link";

interface IUser {
  name: string;
  image: string;
  bio: string;
}

interface IPostInProfile {
  id: number;
  title: string;
  date: string;
  readingTime: number;
}

const user: IUser = {
  name: "홍길동",
  image: "/images/profile.jpg",
  bio: "안녕하세요. 프론트엔드 개발자 홍길동입니다.",
};

const dummyPosts: IPostInProfile[] = [
  { id: 1, title: "첫 번째 게시물", date: "2024-09-20", readingTime: 5 },
  { id: 2, title: "두 번째 게시물", date: "2024-09-22", readingTime: 3 },
  { id: 3, title: "세 번째 게시물", date: "2024-09-24", readingTime: 7 },
];

interface IUserInfo {
  user: IUser;
}

function UserInfo({ user }: IUserInfo) {
  return (
    <div className="flex items-center space-x-4 bg-white shadow-lg rounded-lg p-6">
      <Image
        src={user.image}
        alt={user.name}
        width={100}
        height={100}
        className="rounded-full"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-600">{user.bio}</p>
      </div>
    </div>
  );
}

interface IUserPosts {
  posts: IPostInProfile[];
}
function UserPosts({ posts }: IUserPosts) {
  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold mb-4">작성한 게시물</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block">
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
              <p className="text-gray-600 text-sm">
                {post.date} • {post.readingTime} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <UserInfo user={user} />
        <UserPosts posts={dummyPosts} />
      </div>
    </div>
  );
}
