import { z } from 'zod';

export const GetPostPathParamSchema = z.string();
export type GetPostPathParam = z.infer<typeof GetPostPathParamSchema>;

export const GetPostResponseSchema = z
  .object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    categories: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    ),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();
export type GetPostResponse = z.infer<typeof GetPostResponseSchema>;
