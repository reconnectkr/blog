import {
  AscendingDecendingSchema,
  coerceDecimalSchema,
  DateTimeFilterSchema,
  DecimalFilterSchema,
  IntFilterSchema,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  StringFilterSchema,
} from '@reconnect/zod-common';
import { z } from 'zod';

export const ListProductInventoryItemOrderBySchema = z.object({
  id: AscendingDecendingSchema.optional(),
  product: z
    .object({
      id: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
    })
    .optional(),
  inventoryItem: z
    .object({
      id: AscendingDecendingSchema.optional(),
      code: AscendingDecendingSchema.optional(),
      name: AscendingDecendingSchema.optional(),
      category: z
        .object({
          id: AscendingDecendingSchema.optional(),
          name: AscendingDecendingSchema.optional(),
        })
        .optional(),
    })
    .optional(),
  quantity: AscendingDecendingSchema.optional(),
  createdAt: AscendingDecendingSchema.optional(),
  createdBy: AscendingDecendingSchema.optional(),
  updatedAt: AscendingDecendingSchema.optional(),
  updatedBy: AscendingDecendingSchema.optional(),
});

export const ListProductInventoryItemQueryStringSchema = z
  .object({
    filter: z
      .object({
        product: z
          .object({
            id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
            name: z.union([z.string(), StringFilterSchema]).optional(),
          })
          .optional(),
        inventoryItem: z
          .object({
            id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
            name: z.union([z.string(), StringFilterSchema]).optional(),
            code: z.union([z.string(), StringFilterSchema]).optional(),
            category: z
              .object({
                id: z.union([z.coerce.number(), IntFilterSchema]).optional(),
                name: z.union([z.string(), StringFilterSchema]).optional(),
              })
              .nullable()
              .optional(),
          })
          .optional(),
        quantity: z
          .union([coerceDecimalSchema, DecimalFilterSchema])
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
      .union([
        ListProductInventoryItemOrderBySchema,
        ListProductInventoryItemOrderBySchema.array(),
      ])
      .default([{ product: { id: 'asc' } }, { inventoryItem: { id: 'asc' } }]),
  })
  .strict();
export type ListProductInventoryItemQueryString = z.infer<
  typeof ListProductInventoryItemQueryStringSchema
>;

export const ListProductInventoryItemResponseSchema = z
  .object({
    items: z
      .object({
        productId: z.number().int(),
        inventoryItem: z.object({
          id: z.number().int(),
          code: z.string(),
          name: z.string(),
          specification: z.string(),
          inventoryUnit: z.object({
            id: z.number().int(),
            name: z.string(),
          }),
          category: z
            .object({
              id: z.number().int(),
              name: z.string(),
              typeId: z.number().int(),
              parentId: z.number().int().nullable(),
            })
            .nullable(),
        }),
        quantity: coerceDecimalSchema,

        createdAt: z.coerce.date(),
        createdBy: z.string(),
        updatedAt: z.coerce.date(),
        updatedBy: z.string(),
      })
      .array(),
  })
  .strict();
export type ListProductInventoryItemResponse = z.infer<
  typeof ListProductInventoryItemResponseSchema
>;
