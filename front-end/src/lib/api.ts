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

export async function getAllPosts(): Promise<IPost[]> {
  const response = await fetchAPI("/post");
  return response.items;
}

export async function getPost(id: string): Promise<IPost> {
  const response = await fetchAPI(`/post/${id}`);
  return response.items;
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

export async function getPostsByCategory(categoryId: string): Promise<IPost[]> {
  const postResponse = await fetchAPI("/post");
  const posts: IPost[] = postResponse.items;
  const argumentId = Number(categoryId);

  const postsByCategory: IPost[] = posts.filter((post: IPost) =>
    post.categories.some((category: ICategory) => category.id === argumentId)
  );

  return postsByCategory;
}
