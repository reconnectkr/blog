import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const SignUpRequestSchema = z
      .object({
        email: z.string().email().max(128),
        username: z.string().min(2).max(32),
        name: z.string().max(64),
        password: z.string().min(8),
      })
      .strict();

    const parsed = SignUpRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "Bad Request",
          message: "입력 값이 유효하지 않습니다.",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost:4000/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: `회원가입 실패: ${
            data.message || "알 수 없는 오류가 발생했습니다."
          }`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "회원가입 성공" }, { status: 201 });
  } catch (error) {
    console.error("회원가입 요청 처리 중 오류 발생:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
