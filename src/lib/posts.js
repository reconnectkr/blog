import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "src/public/posts/");

export async function getMostRecentPost() {
  const posts = await getAllPosts();
  return posts[0];
}

export async function getRecentPosts(count) {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}

export async function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(".mdx", "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      data,
      content,
      readingTime: Math.ceil(content.split(" ").length / 200),
    };
  });

  return allPostsData.sort((a, b) => (a.data.date < b.data.date ? 1 : -1));
}
