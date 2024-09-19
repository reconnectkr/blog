"use client";

import Link from "next/link";
import { useState } from "react";
import { INavigationItem } from "../interfaces";

export default function NavigationItem({
  category,
  subItems,
}: INavigationItem) {
  const [isOpen, setIsOpen] = useState(false);

  if (subItems) {
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 rounded flex justify-between items-center"
        >
          {category.label}
          <span
            className="transform transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </button>
        {isOpen && (
          <ul className="ml-4">
            {subItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={category.href}
        className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
      >
        {category.label}
      </Link>
    </li>
  );
}
