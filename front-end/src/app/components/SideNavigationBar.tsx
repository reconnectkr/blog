import { getAllCategories } from "@/lib/posts";
import { INavigationItem } from "../interfaces";
import NavigationItem from "./NavigationItem";

export default async function SideNavigationBar() {
  const categories = await getAllCategories();

  const uniqueCategoryLabels = new Set<string>();

  const navigationItems: INavigationItem[] = [
    { category: { href: "/", label: "홈" } },
    {
      category: {
        href: "/posts",
        label: "포스트",
      },
      subItems: categories
        .filter((category) => {
          if (uniqueCategoryLabels.has(category.label)) {
            return false;
          }
          uniqueCategoryLabels.add(category.label);
          return true;
        })
        .map((category) => ({
          href:
            category.label === "전체"
              ? category.href
              : `/posts/${category.href.toLowerCase()}`,
          label: category.label,
        })),
    },
    // { category: { href: "/about", label: "소개" } },
    // { category: { href: "/contact", label: "연락처" } },
  ];

  return (
    <nav className="bg-white w-64 flex-shrink-0 border-r p-4">
      <ul className="space-y-2">
        {navigationItems.map((item) => (
          <NavigationItem key={item.category.href} {...item} />
        ))}
      </ul>
    </nav>
  );
}
