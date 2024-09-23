import { z } from 'zod';

export const DeleteCategoryPathParamSchema = z.coerce.number().int().positive();
export type DeleteCategoryPathParam = z.infer<
  typeof DeleteCategoryPathParamSchema
>;

export const DeleteCategoryResponseSchema = z.undefined();
export type DeleteCategoryResponse = z.infer<
  typeof DeleteCategoryResponseSchema
>;
