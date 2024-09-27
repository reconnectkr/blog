import { ICategory } from "../interfaces";

interface PostsListFilterProps {
  categories: ICategory[];
  selectedCategories: ICategory[];
  onCategoryChange: (categories: ICategory[]) => void;
}

export default function PostsListFilter({
  categories,
  selectedCategories,
  onCategoryChange,
}: PostsListFilterProps) {
  const handleCategoryClick = (category: ICategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(
        selectedCategories.filter((selected) => selected !== category)
      );
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex space-x-4 mb-6">
      <button
        className={`px-4 py-2 rounded-3xl ${
          selectedCategories.length === 0
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
        onClick={() => onCategoryChange([])}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-4 py-2 rounded-3xl ${
            selectedCategories.includes(category)
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
