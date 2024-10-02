import { ICategory, IPost } from "@/app/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("API error: ", await response.text());
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// GET API 함수들
export async function getAllPosts(): Promise<IPost[]> {
  const response = await fetchAPI("/post");
  console.log(response);
  return response.items;
}

export async function getPost(id: number): Promise<IPost> {
  const response = await fetchAPI(`/post/${id}`);
  return response;
}

export async function getMostRecentPost(): Promise<IPost | null> {
  const posts = await getAllPosts();
  return posts.length > 0 ? posts[0] : null;
}

export async function getRecentPosts(count: number): Promise<IPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

export async function getAllCategories(): Promise<ICategory[]> {
  const response = await fetchAPI("/category");
  return response.items;
}

export async function getPostsByCategory(categoryId: number): Promise<IPost[]> {
  const postResponse = await fetchAPI("/post");
  const posts: IPost[] = postResponse.items;
  const argumentId = Number(categoryId);

  const postsByCategory: IPost[] = posts.filter((post: IPost) =>
    post.categories.some((category: ICategory) => category.id === argumentId)
  );

  return postsByCategory;
}

// POST API 함수들
export async function createPost(
  postData: {
    title: string;
    content: string;
    categories: string[];
  },
  options: RequestInit = {}
): Promise<IPost> {
  const response = await fetchAPI("/post", {
    method: "POST",
    body: JSON.stringify(postData),
    ...options,
  });
  return response;
}

export async function createCategory(
  categoryData: Omit<ICategory, "id">,
  options: RequestInit = {}
): Promise<ICategory> {
  const response = await fetchAPI("/category", {
    method: "POST",
    body: JSON.stringify(categoryData),
    ...options,
  });
  return response;
}

// PUT API 함수들 (예시)
export async function updatePost(
  id: number,
  postData: Partial<IPost>
): Promise<IPost> {
  const response = await fetchAPI(`/post/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
  });
  return response;
}

// DELETE API 함수들 (예시)
export async function deletePost(id: number): Promise<void> {
  await fetchAPI(`/post/${id}`, {
    method: "DELETE",
  });
}
