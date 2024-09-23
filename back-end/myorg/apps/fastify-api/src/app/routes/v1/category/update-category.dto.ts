import { z } from 'zod';

export const UpdateCategoryPathParamSchema = z.coerce.number().int();
export type UpdateCategoryPathParam = z.infer<
  typeof UpdateCategoryPathParamSchema
>;

export const UpdateCategoryRequestSchema = z
  .object({
    name: z.string().optional(),
  })
  .strict();
export type UpdateCategoryRequest = z.infer<typeof UpdateCategoryRequestSchema>;

export const UpdateCategoryResponseSchema = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();
export type UpdateCategoryResponse = z.infer<
  typeof UpdateCategoryResponseSchema
>;
