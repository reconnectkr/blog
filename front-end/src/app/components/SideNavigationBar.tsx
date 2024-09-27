import { romanizeCategory } from "@/lib/createCategory";
import { getAllCategories } from "@/lib/posts";
import { INavigationItem } from "../interfaces";
import NavigationItem from "./NavigationItem";

export default async function SideNavigationBar() {
  const categories = await getAllCategories();

  // const uniqueCategoryLabels = new Set<string>();

  const navigationItems: INavigationItem[] = [
    { href: "/", label: "홈" },
    {
      href: "/posts",
      label: "포스트",
      subItems: [
        { href: "/posts", label: "전체" },
        ...categories.map((category) => ({
          href: `/posts/${romanizeCategory(category).toLowerCase()}`,
          label: category,
        })),
      ],
      // subItems: categories
      //   .filter((category) => {
      //     if (uniqueCategoryLabels.has(category.label)) {
      //       return false;
      //     }
      //     uniqueCategoryLabels.add(category.label);
      //     return true;
      //   })
      //   .map((category) => ({
      //     href:
      //       category.label === "전체"
      //         ? category.href
      //         : `/posts/${category.href.toLowerCase()}`,
      //     label: category.label,
      //   })),
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
