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
      { message: "Post saved successfully", post: newPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ message: "Error saving post" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { title, content, authorId, category } = body;

//   // 데이터베이스 저장 또는 다른 저장 로직 추가
//   // 예시로는 콘솔에만 로그를 찍고 성공 응답을 보냄
//   console.log("Saving post:", { title, content, authorId, category });

//   // 응답 처리
//   return NextResponse.json({ post: { title, content, authorId, category } });
// }
