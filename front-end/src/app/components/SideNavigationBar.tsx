import { getAllCategories } from "@/lib/api";
import { INavigationItem } from "../interfaces";
import NavigationItem from "./NavigationItem";

export default async function SideNavigationBar() {
  const categories = await getAllCategories();

  const navigationItems: INavigationItem[] = [
    { href: "/", label: "홈" },
    {
      href: "/posts",
      label: "포스트",
      subItems: [
        { href: "/posts", label: "전체" },
        ...categories.map((category) => ({
          href: `/posts/category/${category.id}`,
          label: category.name,
        })),
      ],
    },
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
