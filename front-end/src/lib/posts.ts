import { IPost } from "@/app/interfaces";
import { promises as fs } from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "data/posts/");

let cachedPosts: IPost[] = [];
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function invalidateCache() {
  cachedPosts = [];
  lastCacheTime = 0;
}

function isValidPostData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): data is Omit<IPost, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} {
  return (
    typeof data.id === "number" &&
    typeof data.title === "string" &&
    typeof data.category === "object" &&
    typeof data.category.label === "string" &&
    typeof data.category.href === "string" &&
    typeof data.authorId === "string" &&
    typeof data.createdAt === "string" &&
    typeof data.updatedAt === "string" &&
    typeof data.content === "string"
  );
}

export async function getAllPosts(): Promise<IPost[]> {
  const currentTime = Date.now();
  if (cachedPosts.length > 0 && currentTime - lastCacheTime < CACHE_TTL) {
    return cachedPosts;
  }

  try {
    const fileNames = await fs.readdir(postsDirectory);

    const allPostsData = await Promise.all(
      fileNames.map(async (fileName) => {
        try {
          const slug = fileName.replace(".json", "");
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = await fs.readFile(fullPath, "utf8");
          const postData = JSON.parse(fileContents);

          if (!isValidPostData(postData)) {
            console.warn(`Invalid post data in file: ${fileName}`);
            return null;
          }

          return {
            ...postData,
            slug,
            createdAt: new Date(postData.createdAt),
            updatedAt: new Date(postData.updatedAt),
            readingTime: Math.ceil(postData.content.split(" ").length / 200),
          } as IPost;
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          return null;
        }
      })
    );

    cachedPosts = allPostsData
      .filter((post): post is IPost => post !== null)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    lastCacheTime = currentTime;

    return cachedPosts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getMostRecentPost(): Promise<IPost | null> {
  const posts = await getAllPosts();
  return posts.length > 0 ? posts[0] : null;
}

export async function getRecentPosts(count: number): Promise<IPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getPostById(id: number): Promise<IPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.id === id) || null;
}

export async function getAllCategories() {
  const posts = await getAllPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.category))
  ).filter(Boolean);
  return [{ href: "/posts", label: "전체" }, ...categories];
}

export async function getPostsByCategory(href: string): Promise<IPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category.href === href);
}
