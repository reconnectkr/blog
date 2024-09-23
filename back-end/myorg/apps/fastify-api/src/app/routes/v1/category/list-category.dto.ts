import {
  AscendingDecendingSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListCategoryOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
});

export const ListCategoryQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([ListCategoryOrderBySchema, ListCategoryOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListCategoryQueryString = z.infer<
  typeof ListCategoryQueryStringSchema
>;

export const ListCategoryResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array(),
  })
  .strict();
export type ListCategoryResponse = z.infer<typeof ListCategoryResponseSchema>;
