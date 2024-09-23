import { z } from 'zod';

export const CreatePostRequestSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    categories: z.array(z.string()),
  })
  .strict();
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;

export const CreatePostResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    categories: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();
export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;
