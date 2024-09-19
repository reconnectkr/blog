import { IPost } from "@/app/interfaces";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "src/public/posts/");

let cachedPosts: IPost[] = [];

export async function getMostRecentPost(): Promise<IPost | undefined> {
  const posts = await getAllPosts();
  return posts[0];
}

export async function getRecentPosts(count: number): Promise<IPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
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
          slug,
          data: {
            title: data.title || "Untitled",
            date: data.date || new Date().toISOString(),
            category: {
              href: data.category.href || "",
              label: data.category.label || "",
            },
          },
          content,
          readingTime: Math.ceil(content.split(" ").length / 200),
        };
      })
    );

    cachedPosts = allPostsData.sort((a, b) =>
      new Date(a.data.date) < new Date(b.data.date) ? 1 : -1
    );

    return cachedPosts;
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

export function invalidateCache() {
  cachedPosts = [];
}

export async function getPostBySlug(slug: string): Promise<IPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getAllCategories() {
  const posts = await getAllPosts();
  const categories = Array.from(
    new Set(posts.map((post) => post.data.category))
  ).filter(Boolean);
  return [{ href: "/posts", label: "전체" }, ...categories];
}

export async function getPostsByCategory(
  category: string
): Promise<IPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.data.category.label === category);
}
