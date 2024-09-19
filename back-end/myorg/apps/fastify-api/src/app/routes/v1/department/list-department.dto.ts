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

export const ListDepartmentOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  description: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
});

export const ListDepartmentQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
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
      .union([ListDepartmentOrderBySchema, ListDepartmentOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListDepartmentQueryString = z.infer<
  typeof ListDepartmentQueryStringSchema
>;

export const ListDepartmentResponseSchema = z
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
export type ListDepartmentResponse = z.infer<
  typeof ListDepartmentResponseSchema
>;
