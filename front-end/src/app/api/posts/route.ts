import { IPost } from "@/app/interfaces";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function POST(request: NextRequest) {
  const { title, content, authorId, category } = await request.json();

  const newPost: IPost = {
    id: Date.now(),
    slug: title.toLowerCase().replace(/ /g, "-"),
    title,
    category,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
    content,
    readingTime: calculateReadingTime(content),
  };

  const postContent = JSON.stringify(newPost, null, 2);
  const filePath = path.join(
    process.cwd(),
    "data",
    "posts",
    `${newPost.slug}.json`
  );

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(filePath, postContent);
    return NextResponse.json(
      { message: "Post saved successfully as JSON", post: newPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ message: "Error saving post" }, { status: 500 });
  }
}
