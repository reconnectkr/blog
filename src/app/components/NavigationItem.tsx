import Link from "next/link";

interface NavigationItemProps {
  href: string;
}
export default function NavigationItem({ href }: NavigationItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
      >
        {href}
      </Link>
    </li>
  );
}
