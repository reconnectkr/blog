import {
  AscendingDecendingSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListPriceAdjustmentTypeOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  name: AscendingDecendingSchema.optional(),
});

export const ListPriceAdjustmentTypeQueryStringSchema = z
  .object({
    filter: z
      .object({
        id: z.union([z.number(), IntFilterSchema]).optional(),
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
      .union([
        ListPriceAdjustmentTypeOrderBySchema,
        ListPriceAdjustmentTypeOrderBySchema.array(),
      ])
      .default({ id: 'asc' }),
  })
  .strict();
export type ListPriceAdjustmentTypeQueryString = z.infer<
  typeof ListPriceAdjustmentTypeQueryStringSchema
>;

export const ListPriceAdjustmentTypeResponseSchema = z
  .object({
    items: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .array(),
  })
  .strict();
export type ListPriceAdjustmentTypeResponse = z.infer<
  typeof ListPriceAdjustmentTypeResponseSchema
>;
