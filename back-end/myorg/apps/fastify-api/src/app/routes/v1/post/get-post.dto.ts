import { z } from 'zod';

export const GetPostPathParamSchema = z.coerce.number().int();
export type GetPostPathParam = z.infer<typeof GetPostPathParamSchema>;

export const GetPostResponseSchema = z
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
export type GetPostResponse = z.infer<typeof GetPostResponseSchema>;
