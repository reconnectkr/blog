// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     const LoginRequestSchema = z.union([
//       z
//         .object({
//           email: z.string().email().max(128),
//           password: z.string(),
//         })
//         .strict(),
//       z
//         .object({
//           username: z.string().max(32),
//           password: z.string(),
//         })
//         .strict(),
//     ]);

//     const parsed = LoginRequestSchema.safeParse(body);

//     if (!parsed.success) {
//       return NextResponse.json(
//         {
//           statusCode: 400,
//           error: "Bad Request",
//           message: parsed.error.name,
//           details: parsed.error.errors,
//         },
//         { status: 400 }
//       );
//     }

//     const response = await fetch("http://localhost:4000/api/v1/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(parsed.data),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { message: `로그인 실패: ${data}` },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken,
//     });
//   } catch (error) {
//     console.error("로그인 요청 처리 중 오류 발생:", error);
//     return NextResponse.json({ message: "서버 오류" }, { status: 500 });
//   }
// }
