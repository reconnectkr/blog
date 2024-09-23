import { z } from 'zod';

export const UpdatePostPathParamSchema = z.coerce.number().int();
export type UpdatePostPathParam = z.infer<typeof UpdatePostPathParamSchema>;

export const UpdatePostRequestSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    categories: z.array(z.string()).optional(),
  })
  .strict();
export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;

export const UpdatePostResponseSchema = z
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
export type UpdatePostResponse = z.infer<typeof UpdatePostResponseSchema>;
