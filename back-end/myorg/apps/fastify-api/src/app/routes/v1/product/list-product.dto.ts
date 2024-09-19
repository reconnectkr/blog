import {
  AscendingDecendingSchema,
  coerceDecimalSchema,
  DateTimeFilterSchema,
  DecimalFilterSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
  StringNullableFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListProductOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  price: AscendingDecendingSchema.optional(),
  description: AscendingDecendingSchema.optional(),
  createdAt: AscendingDecendingSchema.optional(),
  createdBy: AscendingDecendingSchema.optional(),
  updatedAt: AscendingDecendingSchema.optional(),
  updatedBy: AscendingDecendingSchema.optional(),
});

export const ListProductQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
        name: z.union([z.string(), StringFilterSchema]).optional(),
        price: z.union([coerceDecimalSchema, DecimalFilterSchema]).optional(),
        description: z
          .union([z.string(), StringNullableFilterSchema])
          .optional(),
        createdAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        createdBy: z.union([z.string(), StringFilterSchema]).optional(),
        updatedAt: z.union([z.coerce.date(), DateTimeFilterSchema]).optional(),
        updatedBy: z.union([z.string(), StringFilterSchema]).optional(),
      })
      .optional(),

    page: z.coerce.number().min(1).default(1).optional(),
    pageSize: z.coerce
      .number()
      .max(PAGE_SIZE_MAX)
      .default(PAGE_SIZE_DEFAULT)
      .optional(),
    orderBy: z
      .union([ListProductOrderBySchema, ListProductOrderBySchema.array()])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListProductQueryString = z.infer<
  typeof ListProductQueryStringSchema
>;

export const ListProductResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        name: z.string(),
        price: coerceDecimalSchema,
        description: z.string().nullable(),

        createdAt: z.coerce.date(),
        createdBy: z.string(),
        updatedAt: z.coerce.date(),
        updatedBy: z.string(),
      })
      .array(),
  })
  .strict();
export type ListProductResponse = z.infer<typeof ListProductResponseSchema>;
