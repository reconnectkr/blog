import {
  AscendingDecendingSchema,
  IntFilterSchema,
  NullableSortOrderSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
  StringNullableFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListUnitTypeOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  description: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
});

export const ListUnitTypeQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.number(), IntFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        description: z
          .union([z.string().nullable(), StringNullableFilterSchema])
          .optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([ListUnitTypeOrderBySchema, ListUnitTypeOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListUnitTypeQueryString = z.infer<
  typeof ListUnitTypeQueryStringSchema
>;

export const ListUnitTypeResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        name: z.string(),
        description: z.string().nullable(),
      })
      .array(),
  })
  .strict();
export type ListUnitTypeResponse = z.infer<typeof ListUnitTypeResponseSchema>;
