import { getAllPosts } from "@/lib/posts";
import NavigationItem, { NavigationItemProps } from "./NavigationItem";

async function getCategories() {
  const posts = await getAllPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.data.category))
  ).filter(Boolean);
  return [{ href: "/posts", label: "전체" }, ...categories];
}

export default async function SideNavigationBar() {
  const categories = await getCategories();

  const navigationItems: NavigationItemProps[] = [
    { href: "/", label: "홈" },
    {
      href: "/posts",
      label: "포스트",
      subItems: categories.map((category) => ({
        href:
          category.label === "전체"
            ? category.href
            : `/posts/${category.href.toLowerCase()}`,
        label: category.label,
      })),
    },
    { href: "/about", label: "소개" },
    { href: "/contact", label: "연락처" },
  ];

  return (
    <nav className="bg-white w-64 flex-shrink-0 border-r p-4">
      <ul className="space-y-2">
        {navigationItems.map((item) => (
          <NavigationItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
}
