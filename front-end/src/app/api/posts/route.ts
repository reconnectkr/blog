// import { NextRequest, NextResponse } from "next/server";

// // 로컬에 저장하는 api
// // export async function POST(request: NextRequest) {
// //   const {
// //     title,
// //     content,
// //     categories,
// //     authorId,
// //   }: {
// //     title: string;
// //     content: string;
// //     categories: string[];
// //     authorId: string;
// //   } = await request.json();

// //   const newPost: IPost = {
// //     id: Date.now(),
// //     slug: title.toLowerCase().replace(/ /g, "-"),
// //     title,
// //     categories,
// //     authorId,
// //     createdAt: new Date(),
// //     updatedAt: new Date(),
// //     content,
// //     readingTime: Math.ceil(content.split(" ").length / 200),
// //   };

// //   const postContent = JSON.stringify(newPost, null, 2);
// //   const filePath = path.join(
// //     process.cwd(),
// //     "data",
// //     "posts",
// //     `${newPost.slug}.json`
// //   );

// //   try {
// //     await fs.mkdir(path.dirname(filePath), { recursive: true });
// //     await fs.writeFile(filePath, postContent);

// //     return NextResponse.json(
// //       { message: "Post saved successfully as JSON", post: newPost },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error("Error saving post:", error);
// //     return NextResponse.json(
// //       { message: "Error saving post", error: error },
// //       { status: 500 }
// //     );
// //   }
// // }

// // 서버에 저장하는 api
// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const authHeader = request.headers.get("Authorization");

//   if (!authHeader) {
//     return NextResponse.json(
//       { message: "Authorization header is missing" },
//       { status: 401 }
//     );
//   }

//   const response = await fetch("http://localhost:4000/api/v1/post", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: authHeader,
//     },
//     body: JSON.stringify(body),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     return NextResponse.json(data, { status: response.status });
//   }

//   return NextResponse.json(data, { status: 200 });
// }

// export async function GET() {
//   try {
//     const response = await fetch("http://localhost:4000/api/v1/post/:id");

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("External API response:", data);

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error in API route:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error },
//       { status: 500 }
//     );
//   }
// }
