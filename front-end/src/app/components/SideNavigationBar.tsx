"use client";

import { getAllCategories } from "@/lib/api";
import { useEffect, useState } from "react";
import { ICategory, INavigationItem } from "../interfaces";
import NavigationItem from "./NavigationItem";

export default function SideNavigationBar() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setCategories(categories.map((category) => category));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
