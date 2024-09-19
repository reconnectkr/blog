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

export const ListPriceAdjustmentPolicyOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
  description: z
    .union([AscendingDecendingSchema, NullableSortOrderSchema])
    .optional(),
});

export const ListPriceAdjustmentPolicyQueryStringSchema = z
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
      .union([
        ListPriceAdjustmentPolicyOrderBySchema,
        ListPriceAdjustmentPolicyOrderBySchema.array(),
      ])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListPriceAdjustmentPolicyQueryString = z.infer<
  typeof ListPriceAdjustmentPolicyQueryStringSchema
>;

export const ListPriceAdjustmentPolicyResponseSchema = z
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
export type ListPriceAdjustmentPolicyResponse = z.infer<
  typeof ListPriceAdjustmentPolicyResponseSchema
>;
