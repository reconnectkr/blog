import { IPost } from "@/app/interfaces";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "data/posts/");

let cachedPosts: IPost[] = [];

export async function getMostRecentPost(): Promise<IPost | null> {
  try {
    const posts = await getAllPosts();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error("Error fetching most recent post:", error);
    return null;
  }
}

export async function getRecentPosts(count: number): Promise<IPost[] | null> {
  try {
    const posts = await getAllPosts();
    return posts.length > 0 ? posts.slice(0, count) : null;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return null;
  }
}

export async function getAllPosts(): Promise<IPost[]> {
  if (cachedPosts.length > 0) {
    return cachedPosts;
  }

  try {
    const fileNames = await fs.readdir(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(".mdx", "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          id: data.id || Date.now(),
          slug,
          title: data.title || "Untitled",
          category: {
            href: data.category?.href || "",
            label: data.category?.label || "",
          },
          authorId: data.authorId || "",
          createdAt: new Date(data.createdAt || new Date()),
          updatedAt: new Date(data.updatedAt || new Date()),
          content,
          readingTime: Math.ceil(content.split(" ").length / 200),
        } as IPost;
      })
    );

    cachedPosts = allPostsData.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    return cachedPosts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export function invalidateCache() {
  cachedPosts = [];
}

export async function getPostBySlug(slug: string): Promise<IPost | null> {
  try {
    const posts = await getAllPosts();
    const post = posts.find((post) => post.slug === slug);
    return post ? post : null;
  } catch (error) {
    console.error(`Error fetching ${slug} post:`, error);
    return null;
  }
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
