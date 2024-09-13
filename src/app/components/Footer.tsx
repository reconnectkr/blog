export default function Footer() {
  return (
    <footer className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 My Blog. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:your.email@example.com"
              className="text-gray-500 hover:text-gray-700"
            >
              Email
            </a>
            <a
              href="https://github.com/junseooo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/junseoo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
