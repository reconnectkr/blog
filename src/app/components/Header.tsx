import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-white shadow-md">
      <header className="flex flex-row justify-between py-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-800 max-w-7xl">
          My Blog
        </Link>
        <button>login</button>
      </header>
    </div>
  );
}
