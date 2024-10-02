// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const authHeader = request.headers.get("Authorization");

//     if (!authHeader) {
//       return NextResponse.json(
//         { message: "Authorization header is missing" },
//         { status: 401 }
//       );
//     }

//     const CreateCategoryRequestSchema = z
//       .object({
//         name: z.string(),
//       })
//       .strict();

//     const parsed = CreateCategoryRequestSchema.safeParse(body);

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

//     const response = await fetch("http://localhost:4000/api/v1/category", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: authHeader,
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           message:
//             data.message || "An error occurred while creating the category",
//         },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: 201 });
//   } catch (error) {
//     console.error("Error in category creation:", error);
//     return NextResponse.json(
//       { message: "An unexpected error occurred" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const authHeader = request.headers.get("Authorization");

//     if (!authHeader) {
//       return NextResponse.json(
//         { message: "Authorization header is missing" },
//         { status: 401 }
//       );
//     }

//     const response = await fetch("http://localhost:4000/api/v1/category", {
//       headers: {
//         Authorization: authHeader,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           message:
//             data.message || "An error occurred while fetching categories",
//         },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error("Error in fetching categories:", error);
//     return NextResponse.json(
//       { message: "An unexpected error occurred" },
//       { status: 500 }
//     );
//   }
// }
