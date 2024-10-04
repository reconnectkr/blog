import { ICategory, IPost, IUser } from "@/app/interfaces";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DecodedToken {
  userId: string;
}

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
  const response = await fetchAPI("/post?pageSize=200"); // 왜 여기 쿼리 스트링으로 페이지 사이즈를 넘겨줘야만 하는거지??
  const posts = response.items;

  const sortedPosts = posts.sort(
    (a: IPost, b: IPost) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return sortedPosts;
}

export async function getPost(id: number): Promise<IPost> {
  const response = await fetchAPI(`/post/${id}`);
  return response;
}

export async function getMostRecentPost(): Promise<IPost | null> {
  const response = await fetchAPI("/post?pageSize=200");
  const posts = response.items;

  const sortedPosts = posts.sort(
    (a: IPost, b: IPost) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return sortedPosts.length > 0 ? sortedPosts[0] : null;
}

export async function getRecentPosts(count: number): Promise<IPost[]> {
  const response = await fetchAPI("/post?pageSize=200");
  const posts = response.items;

  const sortedPosts = posts.sort(
    (a: IPost, b: IPost) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return sortedPosts.slice(0, count);
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

export async function getUserInfo(
  accessToken: string,
  options: RequestInit = {}
): Promise<IUser> {
  const decodedToken = jwtDecode<DecodedToken>(accessToken);
  const userId = decodedToken.userId;

  const response = await fetchAPI(`/user/${userId}`, {
    ...options,
  });

  return response;
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

// PATCH API 함수들
export const updateUserInfo = async (
  updatedInfo: Partial<IUser>,
  accessToken: string,
  options?: RequestInit
) => {
  const decodedToken = jwtDecode<DecodedToken>(accessToken);
  const userId = decodedToken.userId;
  const endpoint = `/user/${userId}`;
  const updatedOptions: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(updatedInfo),
    ...options,
  };

  return fetchAPI(endpoint, updatedOptions);
};
