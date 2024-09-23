import { z } from 'zod';

export const GetCategoryPathParamSchema = z.coerce.number().int();
export type GetCategoryPathParam = z.infer<typeof GetCategoryPathParamSchema>;

export const GetCategoryResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type GetCategoryResponse = z.infer<typeof GetCategoryResponseSchema>;
