interface PostsListFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function PostsListFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: PostsListFilterProps) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        className={`px-4 py-2 rounded ${
          !selectedCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => onCategoryChange(null)}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`px-4 py-2 rounded ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
