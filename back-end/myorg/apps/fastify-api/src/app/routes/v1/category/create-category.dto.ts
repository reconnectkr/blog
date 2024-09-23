import { z } from 'zod';

export const CreateCategoryRequestSchema = z
  .object({
    name: z.string(),
  })
  .strict();
export type CreateCategoryRequest = z.infer<typeof CreateCategoryRequestSchema>;

export const CreateCategoryResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type CreateCategoryResponse = z.infer<
  typeof CreateCategoryResponseSchema
>;
