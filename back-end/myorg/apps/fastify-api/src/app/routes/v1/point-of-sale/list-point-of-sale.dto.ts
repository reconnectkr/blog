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

export const ListPointOfSaleOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  description: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
  department: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
      description: z
        .union([AscendingDecendingSchema, NullableSortOrderSchema])
        .optional(),
    })
    .optional(),
});

export const ListPointOfSaleQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        description: z
          .union([z.string().nullable(), StringNullableFilterSchema])
          .optional(),
        department: z
          .object({
            id: z.union([z.number(), IntFilterSchema]).optional(),
            name: z.union([z.string(), StringFilterSchema]).optional(),
            description: z
              .union([z.string().nullable(), StringNullableFilterSchema])
              .optional(),
          })
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
      .union([
        ListPointOfSaleOrderBySchema,
        ListPointOfSaleOrderBySchema.array(),
      ])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListPointOfSaleQueryString = z.infer<
  typeof ListPointOfSaleQueryStringSchema
>;

export const ListPointOfSaleResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        name: z.string(),
        description: z.string().nullable(),
        department: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string().nullable(),
        }),
      })
      .array(),
  })
  .strict();
export type ListPointOfSaleResponse = z.infer<
  typeof ListPointOfSaleResponseSchema
>;
